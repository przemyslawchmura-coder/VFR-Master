"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const readMigration = name => fs.readFileSync(path.join(migrationDir, name), "utf8");

const baselineName = "20260828_create_runtime_tables.sql";
const clarificationName = "20260829_add_technical_clarification.sql";
const ownershipName = "20260903_ownership_rls_baseline.sql";
const baseline = readMigration(baselineName);
const clarification = readMigration(clarificationName);
const ownership = readMigration(ownershipName);
const baselineSql = baseline.replace(/--.*$/gm, "");

test("runtime table migrations have deterministic historical ordering", () => {
  assert.deepEqual(
    [baselineName, clarificationName, ownershipName].sort(),
    [baselineName, clarificationName, ownershipName]
  );
});

test("base tables exist before later ALTER migrations and own no later column", () => {
  assert.match(baselineSql, /create table public\.motorcycles/i);
  assert.match(baselineSql, /create table public\.service_records/i);
  assert.match(clarification, /alter table public\.motorcycles\s+add column if not exists technical_clarification jsonb/i);
  assert.doesNotMatch(baselineSql, /technical_clarification/i);
  assert.doesNotMatch(baselineSql, /alter table/i);
});

test("baseline reconstructs the verified application schema contract", () => {
  for (const column of [
    "id uuid not null default gen_random_uuid()",
    "user_id uuid",
    "brand text",
    "model text",
    "year integer",
    "mileage integer",
    "vin text",
    "nickname text",
    "created_at timestamptz default now()",
    "catalog_variant_key text",
    "motorcycle_id uuid not null",
    "type text not null",
    "description text not null",
    "service_date date not null default current_date",
    "parts_cost numeric default 0",
    "labor_cost numeric default 0",
    "next_service_date date",
    "next_service_mileage integer",
    "updated_at timestamptz not null default now()"
  ]) assert.match(baselineSql, new RegExp(column.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));

  for (const constraint of [
    "constraint motorcycles_pkey primary key (id)",
    "constraint motorcycles_user_id_fkey",
    "constraint service_records_pkey primary key (id)",
    "constraint service_records_motorcycle_id_fkey",
    "constraint service_records_user_id_fkey"
  ]) assert.match(baselineSql, new RegExp(constraint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
});

test("existing ownership and RLS hardening remains represented by its migration", () => {
  assert.match(ownership, /alter table public\.motorcycles enable row level security/i);
  assert.match(ownership, /alter table public\.service_records enable row level security/i);
  for (const policy of [
    "motorcycles_select_own",
    "motorcycles_insert_own",
    "motorcycles_update_own",
    "motorcycles_delete_own",
    "service_records_select_own",
    "service_records_insert_own",
    "service_records_update_own",
    "service_records_delete_own"
  ]) assert.match(ownership, new RegExp(`create policy ${policy}`, "i"));
  assert.match(ownership, /using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(ownership, /with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(ownership, /service_records_motorcycle_owner_fkey/i);
});
