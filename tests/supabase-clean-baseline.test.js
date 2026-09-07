"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const readMigration = name => fs.readFileSync(path.join(migrationDir, name), "utf8");

const baselineName = "20260828000000_create_runtime_tables.sql";
const clarificationName = "20260829000000_add_technical_clarification.sql";
const ownershipName = "20260903170109_ownership_rls_live_parity_hardening.sql";
const baseline = readMigration(baselineName);
const clarification = readMigration(clarificationName);
const ownership = readMigration(ownershipName);
const baselineSql = baseline.replace(/--.*$/gm, "");

test("runtime table migrations have deterministic historical ordering", () => {
  for (const name of [baselineName, clarificationName, ownershipName]) {
    assert.match(name, /^\d{14}_[a-z0-9_]+\.sql$/);
  }
  const versions = [baselineName, clarificationName, ownershipName].map(name => name.slice(0, 14));
  assert.equal(new Set(versions).size, versions.length);
  assert.deepEqual(
    [baselineName, clarificationName, ownershipName].sort(),
    [baselineName, clarificationName, ownershipName]
  );
});

test("migration timestamps establish the intended dependency order", () => {
  assert.ok(baselineName < clarificationName);
  assert.ok(clarificationName < ownershipName);
  assert.equal(ownershipName.slice(0, 14), "20260903170109");
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
