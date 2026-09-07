# Supabase reproducibility audit

Status: clean-baseline foundation added; clean-project reconstruction is not yet
proven against a disposable Supabase/Postgres environment.

Audit basis: repository migrations/runtime code plus independently supplied live
schema facts for project `vfr-master`. No live Supabase project was changed and
no production data was inspected by this repository wave.

## Current migration inventory

| Migration | Repository-controlled content | Boundary |
| --- | --- | --- |
| `20260828000000_create_runtime_tables.sql` | Creates the verified `motorcycles` and `service_records` table foundations, base columns, primary keys and direct foreign keys. | Earliest repository ordering identifier; intentionally does not create `technical_clarification`, composite ownership hardening, RLS or policies. It is not evidence of a historical production execution. |
| `20260829000000_add_technical_clarification.sql` | Adds nullable `technical_clarification jsonb` to `public.motorcycles` when absent. | Incremental column addition; repository ordering identifier only; assumes `public.motorcycles` already exists and is not evidence of historical production execution. |
| `20260903170109_ownership_rls_live_parity_hardening.sql` | Adjusts defaults, adds a composite uniqueness constraint and composite-owner foreign key, enables RLS, and creates owner-scoped motorcycle/service policies. | Exact normalized repository identifier for the semantically equivalent live migration version/name. |

The repository now contains the required ordered table foundation, but it does
not by itself prove the migration chain against an empty disposable database or
encode complete Auth/project configuration.

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
| Empty-project creation of `motorcycles` | Represented by `20260828000000_create_runtime_tables.sql`; clean replay not yet executed. |
| Empty-project creation of `service_records` | Represented by `20260828000000_create_runtime_tables.sql`; clean replay not yet executed. |
| Complete runtime foundation columns/types/defaults/primary keys | Represented in the repository foundation and independently verified against the supplied live schema; clean replay and full grants remain unproven. |
| Motorcycle/service indexes beyond represented uniqueness | Missing or unknown. |
| Ownership foreign keys and policy preconditions | Base prerequisites are represented by the ordered repository chain; clean replay and live history reconciliation remain unproven. |
| Supabase Auth provider, URL, redirect, email and password-security configuration | Dashboard/manual configuration dependent. |
| Full grants/extensions/project settings | Unknown from repository migrations. |

Therefore a completely empty Supabase project is **not currently
reproducible solely from repository-controlled migrations**.

## Exact path to reproducibility

The remaining bounded validation wave should:

1. apply the ordered repository migrations to an empty disposable
   Supabase/Postgres environment and verify the final schema/policies;
2. compare the reconstructed result with the supplied live schema, including
   grants and any settings not represented in the migrations;
3. identify which auth/project settings are dashboard-managed and record their
   non-secret required values;
4. validate the resulting migrations against the disposable project and run
   targeted repository database/auth regressions;
5. document any intentionally external configuration that cannot be encoded in
   SQL.

No live migration apply or production data operation is part of this wave.

## Security boundary

The CI workflow requires no secrets, does not access Supabase and does not
deploy. The repository contains public browser client configuration for the
Supabase URL and publishable/anon access path; this is runtime configuration,
not a service-role credential. No service-role key, password, private token or
personal user data was added by this wave.
