# Supabase reproducibility audit

Status: local clean-project reconstruction verified on PostgreSQL 17; production
migration-history reconciliation remains unproven and unauthorized.

Audit basis: repository migrations/runtime code, verified local replay evidence,
and independently supplied live schema/history facts for project `vfr-master`.
No live Supabase project was changed and no production data was inspected by
this repository wave.

## Current migration inventory

| Migration | Repository-controlled content | Boundary |
| --- | --- | --- |
| `20260828000000_create_runtime_tables.sql` | Creates the verified `motorcycles` and `service_records` table foundations, base columns, primary keys and direct foreign keys. | Earliest repository ordering identifier; intentionally does not create `technical_clarification`, composite ownership hardening, RLS or policies. It is not evidence of a historical production execution. |
| `20260829000000_add_technical_clarification.sql` | Adds nullable `technical_clarification jsonb` to `public.motorcycles` when absent. | Incremental column addition; repository ordering identifier only; assumes `public.motorcycles` already exists and is not evidence of historical production execution. |
| `20260903170109_ownership_rls_live_parity_hardening.sql` | Adjusts defaults, adds a composite uniqueness constraint and composite-owner foreign key, enables RLS, and creates owner-scoped motorcycle/service policies. | Exact normalized repository identifier for the semantically equivalent live migration version/name. |

The repository now contains the required ordered table foundation, but it does
not by itself encode complete Auth/project configuration or reconcile the
production migration-history table.

## Verified local clean replay

The normalized chain was replayed twice from a fresh local Supabase setup on
PostgreSQL 17. Both replays applied all three migrations in order:

1. `20260828000000_create_runtime_tables.sql`
2. `20260829000000_add_technical_clarification.sql`
3. `20260903170109_ownership_rls_live_parity_hardening.sql`

`supabase migration list --local` showed all three versions, and
`supabase db lint --local` returned `No schema errors found`. Read-only local
inspection matched the previously supplied production runtime schema for
columns, defaults/nullability, primary keys, unique and foreign-key
constraints, RLS state, and all eight ownership policies including their
semantic ownership checks. No `supabase/seed.sql` exists; seed coverage was not
part of this proof and is not required by the current project scope.

This proves repository migration replay and local schema parity. It does not
prove production migration-history alignment, byte-for-byte SQL identity, full
grants, or complete external Auth/project configuration.

## Verified live schema facts

Independent live inspection supplied the following facts for project
`vfr-master` on PostgreSQL 17: both runtime tables exist with the columns,
defaults, nullability, primary keys, foreign keys, indexes, RLS state and eight
named owner policies represented by the ordered repository migration chain. No
triggers exist on either table. The live migration history currently contains
only `20260903170109 ownership_rls_live_parity_hardening`; it was not changed by
this wave.

These facts are live verification, not proof that a clean project can replay
the repository migrations successfully.

## Production runtime requirements

The application uses the following Supabase-backed objects through the existing
database and auth clients.

### `public.motorcycles`

The runtime selects and writes these columns:

`id`, `user_id`, `brand`, `model`, `year`, `mileage`, `vin`, `nickname`,
`catalog_variant_key`, `technical_clarification`, `created_at`.

It also relies on:

- an authenticated owner relationship through `user_id`;
- motorcycle deletion by `id`;
- updates to `mileage` and `technical_clarification` returning the persisted
  row where requested;
- deterministic ordering by `created_at` when loading motorcycles;
- `catalog_variant_key` and `technical_clarification` being optionally absent
  only for the explicitly supported legacy fallback path.

The repository proves these runtime column names and operations, but does not
prove the complete table definition or all historical defaults/constraints.

### `public.service_records`

The runtime selects, inserts, updates and deletes these columns:

`id`, `motorcycle_id`, `user_id`, `type`, `description`, `service_date`,
`mileage`, `parts_cost`, `labor_cost`, `workshop`, `note`,
`next_service_date`, `next_service_mileage`, `created_at`, `updated_at`.

It also relies on:

- ownership through `user_id` and the related motorcycle;
- filtering by `motorcycle_id`;
- ordering by `service_date` descending;
- returned rows for insert/update/delete operations;
- nullable optional fields such as `workshop`, `note`, `next_service_date`
  and `next_service_mileage`.

The repository proves these runtime expectations, but not the complete SQL
definition, indexes, defaults, check constraints or trigger behavior.

### Authentication and other Supabase services

Production runtime uses Supabase Auth session, sign-in, sign-up, password
recovery, password update and sign-out APIs. It also depends on configured
redirect/site behavior for the deployed application. These settings are not
fully expressible by the SQL migrations in this repository.

No runtime code in the audited path uses Supabase Storage, Edge Functions,
Realtime, RPC functions or additional application tables.

## Proven RLS and constraint assumptions

The repository-controlled ownership migration proves the intended policies:

- users may select/insert/update/delete their own motorcycles;
- service records are allowed only when the authenticated user owns both the
  motorcycle and the service record;
- `service_records(motorcycle_id, user_id)` references the matching composite
  motorcycle ownership key;
- `motorcycles(id, user_id)` is unique for that ownership relationship;
- both application tables have RLS enabled by that migration.

The migration does not prove the pre-existing primary keys, column types,
indexes, grants, or whether a clean database can apply the statements before
the referenced tables exist.

## Reconstruction gaps

| Requirement | Repository status |
| --- | --- |
| Empty-project creation of `motorcycles` | Verified by two local PostgreSQL 17 replays; not represented in production migration history. |
| Empty-project creation of `service_records` | Verified by two local PostgreSQL 17 replays; not represented in production migration history. |
| Complete runtime foundation columns/types/defaults/primary keys | Verified by local replay and parity inspection against the supplied live schema; full grants remain unproven. |
| Motorcycle/service indexes beyond represented uniqueness | Verified for the supplied runtime schema; broader deployment/index requirements remain unproven. |
| Ownership foreign keys and policy preconditions | Base prerequisites and hardening are verified by local replay and supplied live parity facts; production history reconciliation remains unproven. |
| Production migration-history alignment | Unresolved; live history contains only `20260903170109`, while the two earlier repository migrations are absent. |
| Supabase Auth provider, URL, redirect, email and password-security configuration | Dashboard/manual configuration dependent. |
| Full grants/extensions/project settings | Unknown from repository migrations. |

Therefore the two-table runtime schema is **reproducible locally from
repository-controlled migrations**, but production migration-history alignment
and complete project reproducibility are not yet proven.

## Exact path to reproducibility

The remaining bounded reconciliation wave should:

1. obtain a read-only production migration-history status and compare it with
   the normalized local versions;
2. compare any remaining live details with the local replay, including grants
   and settings not represented in the migrations;
3. identify which auth/project settings are dashboard-managed and record their
   non-secret required values;
4. prepare an explicitly authorized history-only reconciliation plan for the
   two earlier migrations, without executing their SQL on production;
5. document any intentionally external configuration that cannot be encoded in
   SQL.

No live migration apply or production data operation is part of this wave.

## Security boundary

The CI workflow requires no secrets, does not access Supabase and does not
deploy. The repository contains public browser client configuration for the
Supabase URL and publishable/anon access path; this is runtime configuration,
not a service-role credential. No service-role key, password, private token or
personal user data was added by this wave.
