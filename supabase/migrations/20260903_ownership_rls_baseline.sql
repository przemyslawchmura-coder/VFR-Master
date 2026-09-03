-- Repository-controlled ownership/RLS hardening for the existing authenticated
-- app tables. Apply only through a separately authorized live-safe migration
-- task, transactionally and after a schema/policy preflight.

alter table public.motorcycles alter column user_id drop default;
alter table public.service_records alter column user_id drop default;

do $$
begin
  alter table public.motorcycles
    add constraint motorcycles_id_user_id_key unique (id, user_id);
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.service_records
    add constraint service_records_motorcycle_owner_fkey
    foreign key (motorcycle_id, user_id)
    references public.motorcycles (id, user_id)
    on delete cascade;
exception when duplicate_object then null;
end $$;

alter table public.motorcycles enable row level security;
alter table public.service_records enable row level security;

-- The live baseline uses these names on both tables. Remove them before
-- creating canonical policies so obsolete permissive policies cannot remain.
drop policy if exists users_can_select on public.motorcycles;
drop policy if exists users_can_insert on public.motorcycles;
drop policy if exists users_can_update on public.motorcycles;
drop policy if exists users_can_delete on public.motorcycles;
drop policy if exists users_can_select on public.service_records;
drop policy if exists users_can_insert on public.service_records;
drop policy if exists users_can_update on public.service_records;
drop policy if exists users_can_delete on public.service_records;

drop policy if exists motorcycles_select_own on public.motorcycles;
create policy motorcycles_select_own on public.motorcycles
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists motorcycles_insert_own on public.motorcycles;
create policy motorcycles_insert_own on public.motorcycles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists motorcycles_update_own on public.motorcycles;
create policy motorcycles_update_own on public.motorcycles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists motorcycles_delete_own on public.motorcycles;
create policy motorcycles_delete_own on public.motorcycles
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists service_records_select_own on public.service_records;
create policy service_records_select_own on public.service_records
  for select to authenticated
  using (
    exists (
      select 1 from public.motorcycles m
      where m.id = service_records.motorcycle_id
        and m.user_id = (select auth.uid())
        and service_records.user_id = m.user_id
    )
  );

drop policy if exists service_records_insert_own on public.service_records;
create policy service_records_insert_own on public.service_records
  for insert to authenticated
  with check (
    exists (
      select 1 from public.motorcycles m
      where m.id = service_records.motorcycle_id
        and m.user_id = (select auth.uid())
        and service_records.user_id = m.user_id
    )
  );

drop policy if exists service_records_update_own on public.service_records;
create policy service_records_update_own on public.service_records
  for update to authenticated
  using (
    exists (
      select 1 from public.motorcycles m
      where m.id = service_records.motorcycle_id
        and m.user_id = (select auth.uid())
        and service_records.user_id = m.user_id
    )
  )
  with check (
    exists (
      select 1 from public.motorcycles m
      where m.id = service_records.motorcycle_id
        and m.user_id = (select auth.uid())
        and service_records.user_id = m.user_id
    )
  );

drop policy if exists service_records_delete_own on public.service_records;
create policy service_records_delete_own on public.service_records
  for delete to authenticated
  using (
    exists (
      select 1 from public.motorcycles m
      where m.id = service_records.motorcycle_id
        and m.user_id = (select auth.uid())
        and service_records.user_id = m.user_id
    )
  );
