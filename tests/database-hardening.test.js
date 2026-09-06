"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createDatabase() {
  const values = new Map();
  const context = {
    window: {},
    localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) },
    console: { error() {} }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js/database.js"), "utf8"), context);
  return { database: context.MotorcycleDatabase, values, context };
}

test("active motorcycle selection persists and stale values fall back safely", async () => {
  const first = createDatabase();
  first.database.motorcycles = [{ id: "a" }, { id: "b" }];
  assert.equal((await first.database.setActive("b")).id, "b");
  const second = createDatabase();
  second.values.set("vfrMasterActiveMotorcycleId", "b");
  second.database.motorcycles = [{ id: "a" }, { id: "b" }];
  assert.equal(second.database.restoreActiveMotorcycleId(), "b");
  second.values.set("vfrMasterActiveMotorcycleId", "stale");
  second.database.motorcycles = [{ id: "a" }, { id: "b" }];
  assert.equal(second.database.restoreActiveMotorcycleId(), "a");
  second.database.motorcycles = [];
  assert.equal(second.database.restoreActiveMotorcycleId(), null);
});

test("mileage update rejects invalid/decreasing values and persists confirmed value", async () => {
  const { database } = createDatabase();
  database.motorcycles = [{ id: "a", mileage: 1000 }];
  for (const value of ["", "NaN", Infinity, -1, 999]) assert.notEqual((await database.updateMileage("a", value)).status, "saved");
  const result = await database.updateMileage("a", 1200);
  assert.equal(result.status, "saved");
  assert.equal(database.getActive ? database.motorcycles[0].mileage : null, 1200);
});

test("mileage update changes local state only after cloud confirmation", async () => {
  const { database, context } = createDatabase();
  database.motorcycles = [{ id: "a", mileage: 1000 }];
  context.supabaseClient = { from() { return { update() { return { eq() { return { select() { return { async single() { return { data: { mileage: 1300 }, error: null }; } }; } }; } }; } }; } };
  assert.equal((await database.updateMileage("a", 1300)).status, "saved");
  assert.equal(database.motorcycles[0].mileage, 1300);
});

test("failed clarification cloud write leaves local context untouched", async () => {
  const { database, context } = createDatabase();
  database.motorcycles = [{ id: "a", clarification: { market: "EU", abs: false } }];
  database.activeMotorcycleId = "a";
  const original = database.motorcycles[0].clarification;
  context.supabaseClient = { from() { return { update() { return { eq: async () => ({ error: new Error("offline") }) }; } }; } };
  const result = await database.updateTechnicalClarification("a", { market: "USA", abs: true });
  assert.equal(result.status, "cloud-error");
  assert.deepEqual(original, { market: "EU", abs: false });
});

test("successful clarification cloud write updates local state after confirmation", async () => {
  const { database, context } = createDatabase();
  database.motorcycles = [{ id: "a", clarification: { market: "EU", abs: false } }];
  context.supabaseClient = { from() { return { update() { return { eq: async () => ({ error: null }) }; } }; } };
  const result = await database.updateTechnicalClarification("a", { market: "USA", abs: true });
  assert.equal(result.status, "saved");
  assert.equal(JSON.stringify(database.motorcycles[0].clarification), JSON.stringify({ market: "USA", abs: true, modelCode: null, equipmentVariant: null, transmissionVariant: null, emissionsVariant: null }));
});
