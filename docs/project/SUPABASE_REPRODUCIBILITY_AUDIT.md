# Supabase reproducibility audit

Status: audit foundation only; clean-project reconstruction is not yet
reproducible from repository migrations alone.

Audit basis: repository-controlled runtime code and migrations only. No live
Supabase project was queried or changed, and no production data was inspected.

## Current migration inventory

| Migration | Repository-controlled content | Boundary |
| --- | --- | --- |
| `20260829_add_technical_clarification.sql` | Adds nullable `technical_clarification jsonb` to `public.motorcycles` when absent. | Incremental column addition; assumes `public.motorcycles` already exists. |
| `20260903_ownership_rls_baseline.sql` | Adjusts defaults, adds a composite uniqueness constraint and composite-owner foreign key, enables RLS, and creates owner-scoped motorcycle/service policies. | Incremental ownership/RLS hardening; assumes both tables, their columns, and the authenticated role context already exist. |

There is no repository migration that creates the initial tables, their
complete columns, primary keys, types, defaults, indexes, or a complete auth
configuration.

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
| Empty-project creation of `motorcycles` | Missing; only incremental alterations are present. |
| Empty-project creation of `service_records` | Missing; only incremental alterations are present. |
| Complete column types/defaults/primary keys | Missing or unknown. Runtime names are known, SQL definitions are not. |
| Motorcycle/service indexes beyond represented uniqueness | Missing or unknown. |
| Ownership foreign keys and policy preconditions | Partially represented by the 20260903 migration; base prerequisites are unknown. |
| Supabase Auth provider, URL, redirect, email and password-security configuration | Dashboard/manual configuration dependent. |
| Full grants/extensions/project settings | Unknown from repository migrations. |

Therefore a completely empty Supabase project is **not currently
reproducible solely from repository-controlled migrations**.

## Exact path to reproducibility

The later bounded schema wave should, with authorized schema evidence:

1. capture and review the complete current schema for the runtime tables,
   including types, nullability, defaults, keys, indexes, triggers, grants and
   policies;
2. identify which auth/project settings are dashboard-managed and record their
   non-secret required values;
3. add a reviewed repository baseline migration that creates the required
   objects in dependency order;
4. retain or reconcile the two existing incremental migrations so a clean
   project applies the complete ordered history exactly once;
5. validate the resulting migrations against an empty disposable Supabase
   project and run the repository database/auth regressions;
6. document any intentionally external configuration that cannot be encoded in
   SQL.

No speculative baseline SQL is created by this audit.

## Security boundary

The CI workflow requires no secrets, does not access Supabase and does not
deploy. The repository contains public browser client configuration for the
Supabase URL and publishable/anon access path; this is runtime configuration,
not a service-role credential. No service-role key, password, private token or
personal user data was added by this wave.
