-- Optional metadata for Technical Profile resolution. Safe additive migration.
alter table public.motorcycles
  add column if not exists technical_clarification jsonb;
