-- Wave 7 durable trusted asynchronous Factory execution substrate.
-- No browser policy, provider, scheduler or external acquisition is added.

create table public.research_execution_jobs (
  execution_id text not null,
  demand_id text not null,
  job_key text not null,
  status text not null default 'READY',
  worker_id text,
  claimed_at timestamptz,
  lease_expires_at timestamptz,
  attempt_count integer not null default 0,
  max_attempts integer not null default 3,
  checkpoint jsonb,
  last_failure jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint research_execution_jobs_pkey primary key (execution_id),
  constraint research_execution_jobs_demand_unique unique (demand_id),
  constraint research_execution_jobs_demand_fkey foreign key (demand_id) references public.research_demands (demand_id),
  constraint research_execution_jobs_status_check check (status in ('READY', 'RUNNING', 'RETRYABLE', 'COMPLETED', 'TERMINAL', 'BLOCKED', 'UNSUPPORTED', 'AWAITING_HUMAN_REVIEW')),
  constraint research_execution_jobs_attempts_check check (attempt_count >= 0 and attempt_count <= max_attempts),
  constraint research_execution_jobs_max_attempts_check check (max_attempts between 1 and 3)
);

create index research_execution_jobs_claim_idx on public.research_execution_jobs (status, lease_expires_at);
alter table public.research_execution_jobs enable row level security;
revoke all on table public.research_execution_jobs from anon, authenticated;

create or replace function public.create_research_execution(p_execution jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare candidate public.research_execution_jobs; existing public.research_execution_jobs;
begin
  if p_execution is null or jsonb_typeof(p_execution) <> 'object'
     or nullif(p_execution->>'executionId', '') is null
     or nullif(p_execution->>'jobKey', '') is null
     or nullif(p_execution->>'demandId', '') is null
     or not exists (select 1 from public.research_demands where demand_id = p_execution->>'demandId') then
    raise exception 'malformed trusted research execution';
  end if;
  insert into public.research_execution_jobs (execution_id, demand_id, job_key, max_attempts, checkpoint)
  values (p_execution->>'executionId', p_execution->>'demandId', p_execution->>'jobKey', least(greatest(coalesce((p_execution->>'maxAttempts')::integer, 3), 1), 3), p_execution->'checkpoint')
  on conflict (demand_id) do nothing returning * into candidate;
  if found then return jsonb_build_object('ok', true, 'outcome', 'CREATED', 'record', to_jsonb(candidate)); end if;
  select * into existing from public.research_execution_jobs where demand_id = p_execution->>'demandId';
  if existing.execution_id <> p_execution->>'executionId' or existing.job_key <> p_execution->>'jobKey' then raise exception 'conflicting durable execution identity'; end if;
  return jsonb_build_object('ok', true, 'outcome', 'REUSED', 'record', to_jsonb(existing));
end; $$;

create or replace function public.read_research_execution(p_execution_id text)
returns jsonb language sql security definer set search_path = public as $$
  select to_jsonb(job) from public.research_execution_jobs job where job.execution_id = p_execution_id;
$$;

create or replace function public.claim_research_execution(p_execution_id text, p_worker_id text, p_lease_seconds integer default 60)
returns jsonb language plpgsql security definer set search_path = public as $$
declare current_job public.research_execution_jobs; claimed public.research_execution_jobs;
begin
  if nullif(p_execution_id, '') is null or nullif(p_worker_id, '') is null or p_lease_seconds not between 1 and 3600 then raise exception 'malformed trusted execution claim'; end if;
  select * into current_job from public.research_execution_jobs where execution_id = p_execution_id for update;
  if not found then return jsonb_build_object('ok', false, 'outcome', 'NOT_FOUND', 'record', null); end if;
  if current_job.status not in ('READY', 'RETRYABLE') and not (current_job.status = 'RUNNING' and current_job.lease_expires_at <= now()) then
    return jsonb_build_object('ok', true, 'outcome', case when current_job.status = 'RUNNING' then 'BUSY' else current_job.status end, 'record', to_jsonb(current_job));
  end if;
  if current_job.attempt_count >= current_job.max_attempts then
    update public.research_execution_jobs set status = 'TERMINAL', last_failure = jsonb_build_object('classification', 'PERMANENT', 'reason', 'MAX-ATTEMPTS-EXHAUSTED'), updated_at = now() where execution_id = p_execution_id returning * into claimed;
    return jsonb_build_object('ok', true, 'outcome', 'TERMINAL', 'record', to_jsonb(claimed));
  end if;
  update public.research_execution_jobs set status = 'RUNNING', worker_id = p_worker_id, claimed_at = now(), lease_expires_at = now() + make_interval(secs => p_lease_seconds), attempt_count = attempt_count + 1, updated_at = now() where execution_id = p_execution_id returning * into claimed;
  return jsonb_build_object('ok', true, 'outcome', 'CLAIMED', 'record', to_jsonb(claimed));
end; $$;

create or replace function public.checkpoint_research_execution(p_execution_id text, p_worker_id text, p_checkpoint jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare updated public.research_execution_jobs;
begin
  update public.research_execution_jobs set checkpoint = p_checkpoint, updated_at = now()
   where execution_id = p_execution_id and status = 'RUNNING' and worker_id = p_worker_id and lease_expires_at > now()
   returning * into updated;
  if not found then return jsonb_build_object('ok', false, 'outcome', 'LEASE-INVALID', 'record', null); end if;
  return jsonb_build_object('ok', true, 'outcome', 'CHECKPOINTED', 'record', to_jsonb(updated));
end; $$;

create or replace function public.finish_research_execution(p_execution_id text, p_worker_id text, p_outcome text, p_failure jsonb default null, p_checkpoint jsonb default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare current_job public.research_execution_jobs; next_status text;
begin
  select * into current_job from public.research_execution_jobs where execution_id = p_execution_id and status = 'RUNNING' and worker_id = p_worker_id and lease_expires_at > now() for update;
  if not found then return jsonb_build_object('ok', false, 'outcome', 'LEASE-INVALID', 'record', null); end if;
  if p_outcome = 'SUCCESS' then next_status := 'COMPLETED';
  elsif p_outcome = 'RETRYABLE' then next_status := case when current_job.attempt_count < current_job.max_attempts then 'RETRYABLE' else 'TERMINAL' end;
  elsif p_outcome in ('PERMANENT', 'BLOCKED', 'UNSUPPORTED', 'AWAITING_HUMAN_REVIEW') then next_status := case when p_outcome = 'PERMANENT' then 'TERMINAL' else p_outcome end;
  else raise exception 'unsupported execution outcome'; end if;
  update public.research_execution_jobs set status = next_status, worker_id = null, claimed_at = null, lease_expires_at = null, last_failure = case when p_outcome = 'SUCCESS' then null else jsonb_build_object('classification', case when p_outcome = 'RETRYABLE' then 'TRANSIENT' else p_outcome end, 'detail', p_failure) end, checkpoint = coalesce(p_checkpoint, checkpoint), updated_at = now() where execution_id = p_execution_id returning * into current_job;
  return jsonb_build_object('ok', true, 'outcome', 'FINISHED', 'record', to_jsonb(current_job));
end; $$;

revoke all on function public.create_research_execution(jsonb) from public, anon, authenticated;
revoke all on function public.read_research_execution(text) from public, anon, authenticated;
revoke all on function public.claim_research_execution(text, text, integer) from public, anon, authenticated;
revoke all on function public.checkpoint_research_execution(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.finish_research_execution(text, text, text, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_research_execution(jsonb) to service_role;
grant execute on function public.read_research_execution(text) to service_role;
grant execute on function public.claim_research_execution(text, text, integer) to service_role;
grant execute on function public.checkpoint_research_execution(text, text, jsonb) to service_role;
grant execute on function public.finish_research_execution(text, text, text, jsonb, jsonb) to service_role;
