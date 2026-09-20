-- Wave 5 trusted persistence/execution boundary foundation.
-- Repository-controlled only. Do not apply remotely in this wave.

create or replace function public.claim_research_demand(p_demand jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate public.research_demands;
  existing public.research_demands;
begin
  if p_demand is null
     or jsonb_typeof(p_demand) <> 'object'
     or nullif(p_demand->>'demandId', '') is null
     or nullif(p_demand->>'knowledgeKey', '') is null
     or nullif(p_demand->>'catalogVariantKey', '') is null
     or nullif(p_demand->>'canonicalFieldId', '') is null
     or nullif(p_demand->>'operation', '') is null
     or p_demand->'applicability' is null
     or p_demand->'requiredApplicabilityDimensions' is null then
    raise exception 'malformed trusted research demand';
  end if;

  insert into public.research_demands (
    demand_id, knowledge_key, catalog_variant_key, canonical_field_id,
    operation, demand_identity, applicability, conditions,
    required_applicability_dimensions, status, lifecycle
  ) values (
    p_demand->>'demandId', p_demand->>'knowledgeKey',
    p_demand->>'catalogVariantKey', p_demand->>'canonicalFieldId',
    p_demand->>'operation', coalesce(p_demand->'identity', '{}'::jsonb),
    p_demand->'applicability', p_demand->'conditions',
    p_demand->'requiredApplicabilityDimensions',
    coalesce(p_demand->>'status', 'IN_PROGRESS'), p_demand->'lifecycle'
  ) on conflict (demand_id) do nothing
  returning * into candidate;

  if found then
    return jsonb_build_object('ok', true, 'outcome', 'CREATED', 'record', to_jsonb(candidate));
  end if;

  select * into existing from public.research_demands where demand_id = p_demand->>'demandId';
  if existing.knowledge_key <> p_demand->>'knowledgeKey'
     or existing.catalog_variant_key <> p_demand->>'catalogVariantKey'
     or existing.canonical_field_id <> p_demand->>'canonicalFieldId'
     or existing.operation <> p_demand->>'operation'
     or existing.applicability <> p_demand->'applicability'
     or existing.required_applicability_dimensions <> p_demand->'requiredApplicabilityDimensions' then
    raise exception 'conflicting durable research demand identity';
  end if;
  return jsonb_build_object('ok', true, 'outcome', 'REUSED', 'record', to_jsonb(existing));
end;
$$;

create or replace function public.read_research_demand(p_demand_id text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(demand) from public.research_demands demand where demand.demand_id = p_demand_id;
$$;

create or replace function public.read_research_knowledge(p_knowledge_key text)
returns setof jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(knowledge) from public.research_reusable_knowledge knowledge
  where knowledge.knowledge_key = p_knowledge_key order by knowledge.record_id;
$$;

create or replace function public.set_research_demand_status(
  p_demand_id text, p_status text, p_lifecycle jsonb default null
)
returns jsonb
language sql
security definer
set search_path = public
as $$
  update public.research_demands
     set status = p_status,
         lifecycle = coalesce(p_lifecycle, lifecycle),
         updated_at = now()
   where demand_id = p_demand_id
  returning jsonb_build_object('ok', true, 'outcome', 'UPDATED', 'record', to_jsonb(research_demands));
$$;

create or replace function public.put_research_reusable_knowledge(p_record jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted public.research_reusable_knowledge;
  same_content public.research_reusable_knowledge;
  same_key_exists boolean;
begin
  perform pg_advisory_xact_lock(hashtext(p_record->>'knowledgeKey'));
  select * into same_content from public.research_reusable_knowledge
   where knowledge_key = p_record->>'knowledgeKey'
     and content_digest = p_record->>'contentDigest';
  if same_content.record_id is not null then
    return jsonb_build_object('ok', true, 'outcome', 'REUSED', 'record', to_jsonb(same_content));
  end if;
  select exists (select 1 from public.research_reusable_knowledge
    where knowledge_key = p_record->>'knowledgeKey') into same_key_exists;
  insert into public.research_reusable_knowledge (
    record_id, content_digest, knowledge_key, demand_id, canonical_field_id,
    operation, applicability, conditions, required_applicability_dimensions,
    status, value, raw_value, provenance, lineage
  ) values (
    p_record->>'recordId', p_record->>'contentDigest', p_record->>'knowledgeKey',
    p_record->>'demandId', p_record->>'canonicalFieldId', p_record->>'operation',
    p_record->'applicability', p_record->'conditions',
    p_record->'requiredApplicabilityDimensions', p_record->>'status',
    p_record->'value', p_record->'rawValue', p_record->'provenance', p_record->'lineage'
  ) on conflict (knowledge_key, content_digest) do nothing
  returning * into inserted;
  if found then
    return jsonb_build_object('ok', true, 'outcome', case when same_key_exists then 'CONFLICT' else 'CREATED' end, 'record', to_jsonb(inserted));
  end if;
  return jsonb_build_object('ok', true, 'outcome', 'CONFLICT', 'record', null);
end;
$$;

revoke all on function public.claim_research_demand(jsonb) from public, anon, authenticated;
revoke all on function public.read_research_demand(text) from public, anon, authenticated;
revoke all on function public.read_research_knowledge(text) from public, anon, authenticated;
revoke all on function public.set_research_demand_status(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.put_research_reusable_knowledge(jsonb) from public, anon, authenticated;
grant execute on function public.claim_research_demand(jsonb) to service_role;
grant execute on function public.read_research_demand(text) to service_role;
grant execute on function public.read_research_knowledge(text) to service_role;
grant execute on function public.set_research_demand_status(text, text, jsonb) to service_role;
grant execute on function public.put_research_reusable_knowledge(jsonb) to service_role;
