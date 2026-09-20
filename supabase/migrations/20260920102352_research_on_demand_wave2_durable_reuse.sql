-- Wave 2 durable research boundary.
-- This schema is repository-only and has no browser/client write policy.
-- A trusted writer claims a demand with INSERT ... ON CONFLICT (demand_id) DO NOTHING RETURNING demand_id; the unique constraint makes the claim
-- atomic without making request metadata part of identity.

create table public.research_demands (
  demand_id text not null,
  knowledge_key text not null,
  catalog_variant_key text not null,
  canonical_field_id text not null,
  operation text not null,
  demand_identity jsonb not null,
  applicability jsonb not null,
  conditions jsonb,
  required_applicability_dimensions jsonb not null,
  status text not null,
  lifecycle jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint research_demands_pkey primary key (demand_id),
  constraint research_demands_demand_id_unique unique (demand_id),
  constraint research_demands_status_check check (status in (
    'MISSING', 'IN_PROGRESS', 'AWAITING_HUMAN_REVIEW', 'REUSABLE',
    'UNSUPPORTED', 'BLOCKED'
  ))
);

create table public.research_reusable_knowledge (
  record_id text not null,
  content_digest text not null,
  knowledge_key text not null,
  demand_id text not null,
  canonical_field_id text not null,
  operation text not null,
  applicability jsonb not null,
  conditions jsonb,
  required_applicability_dimensions jsonb not null,
  status text not null,
  value jsonb,
  raw_value jsonb,
  provenance jsonb,
  lineage jsonb,
  created_at timestamptz not null default now(),
  constraint research_reusable_knowledge_pkey primary key (record_id),
  constraint research_reusable_knowledge_content_unique unique (knowledge_key, content_digest),
  constraint research_reusable_knowledge_demand_fkey
    foreign key (demand_id) references public.research_demands (demand_id),
  constraint research_reusable_knowledge_status_check check (status in (
    'REUSABLE', 'IN_PROGRESS', 'AWAITING_HUMAN_REVIEW', 'UNSUPPORTED', 'BLOCKED'
  ))
);

create index research_reusable_knowledge_demand_idx
  on public.research_reusable_knowledge (demand_id);

alter table public.research_demands enable row level security;
alter table public.research_reusable_knowledge enable row level security;

-- Shared research state is not a browser-owned resource. Future trusted
-- Factory/service execution must receive an explicit, separately reviewed
-- access boundary; no anon/authenticated policy is created here.
revoke all on table public.research_demands from anon, authenticated;
revoke all on table public.research_reusable_knowledge from anon, authenticated;
