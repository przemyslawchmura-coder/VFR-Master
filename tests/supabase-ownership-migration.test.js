"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const sql = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260903_ownership_rls_baseline.sql"), "utf8");
const database = fs.readFileSync(path.join(__dirname, "../js/database.js"), "utf8");
const service = fs.readFileSync(path.join(__dirname, "../js/service.js"), "utf8");

test("ownership migration defines both tables, RLS and complete policy coverage", () => {
  assert.match(sql, /create table if not exists public\.motorcycles/i);
  assert.match(sql, /create table if not exists public\.service_records/i);
  assert.match(sql, /alter table public\.motorcycles enable row level security/i);
  assert.match(sql, /alter table public\.service_records enable row level security/i);
  for (const table of ["motorcycles", "service_records"]) {
    for (const action of ["select", "insert", "update", "delete"]) assert.match(sql, new RegExp(`create policy ${table}_[^\\n]+ on public\\.${table}\\s+for ${action}`, "i"));
  }
});

test("ownership rules are authenticated and fail closed against owner drift", () => {
  assert.match(sql, /motorcycles_insert_own[\s\S]+with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(sql, /motorcycles_update_own[\s\S]+using \(\(select auth\.uid\(\)\) = user_id\)[\s\S]+with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(sql, /service_records_motorcycle_owner_fkey[\s\S]+foreign key \(motorcycle_id, user_id\)[\s\S]+references public\.motorcycles \(id, user_id\)/i);
  assert.match(sql, /service_records_insert_own[\s\S]+service_records\.user_id = m\.user_id/i);
  assert.match(sql, /service_records_update_own[\s\S]+using[\s\S]+service_records\.user_id = m\.user_id[\s\S]+with check[\s\S]+service_records\.user_id = m\.user_id/i);
  assert.doesNotMatch(sql, /alter table public\.(motorcycles|service_records) alter column user_id set default/i);
  assert.doesNotMatch(sql, /user_id\s+uuid\s+default\s+gen_random_uuid/i);
});

test("existing application payloads remain compatible and unchanged", () => {
  assert.match(database, /payload\s*=\s*\{[\s\S]*user_id:\s*userId/i);
  assert.match(service, /const payload\s*=\s*\{[\s\S]*motorcycle_id:\s*bike\.id,[\s\S]*user_id:\s*session\.user\.id/i);
  assert.match(database, /from\("motorcycles"\)/);
  assert.match(service, /from\("service_records"\)/);
});
