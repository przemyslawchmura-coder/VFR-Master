"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadService() {
  const context = { window: {}, console: { error() {} } };
  context.window = context;
  context.MotorcycleDatabase = {
    bike: { id: "bike-1", mileage: 1000, services: [] },
    getActive() { return this.bike; },
    getAll() { return [this.bike]; },
    async getSession() { return null; }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js/service.js"), "utf8"), context);
  return context.ServiceModule;
}

function validService(overrides = {}) {
  return { description: "Wymiana oleju", date: "2026-01-01", mileage: 0, partsCost: 0, laborCost: 0, nextDate: null, nextMileage: null, ...overrides };
}

test("ServiceModule validates required, finite, non-negative domain values", () => {
  const module = loadService();
  assert.equal(module.validateService(validService()).valid, true);
  for (const field of ["mileage", "partsCost", "laborCost", "nextMileage"]) {
    assert.equal(module.validateService(validService({ [field]: NaN })).valid, false);
    assert.equal(module.validateService(validService({ [field]: Infinity })).valid, false);
    assert.equal(module.validateService(validService({ [field]: -1 })).valid, false);
  }
  assert.equal(module.validateService(validService({ description: "" })).valid, false);
  assert.equal(module.validateService(validService({ date: "2026-02-30" })).valid, false);
  assert.equal(module.validateService(validService({ nextDate: "not-a-date" })).valid, false);
  assert.equal(module.validateService(validService({ mileage: 0, nextMileage: 0 })).valid, true);
});

test("service due state keeps date and mileage dimensions independent", () => {
  const module = loadService();
  const today = new Date("2026-01-10T12:00:00");
  const bike = { mileage: 1000 };
  assert.equal(module.getServiceDueState({ nextMileage: 1100 }, bike, today).dueSoon, true);
  assert.equal(module.getServiceDueState({ nextDate: "2026-01-10" }, bike, today).dueByDate, true);
  assert.equal(module.getServiceDueState({ nextMileage: 1000, nextDate: "2026-12-01" }, bike, today).overdue, true);
  assert.equal(module.getServiceDueState({ nextMileage: 5000, nextDate: "2026-01-01" }, bike, today).overdue, true);
  assert.equal(module.getServiceDueState({ nextMileage: 5000, nextDate: "2026-12-01" }, bike, today).overdue, false);
  assert.equal(module.getServiceDueState({ nextMileage: 1100 }, {}, today).mileageUnknown, true);
});

test("next service does not let a distant date mask a nearer mileage service", () => {
  const module = loadService();
  const bike = { id: "bike-1", mileage: 1000, services: [
    { description: "Przebieg", date: "2026-01-01", nextMileage: 1100, nextDate: null },
    { description: "Termin", date: "2026-01-02", nextMileage: null, nextDate: "2026-11-01" }
  ] };
  module.getActiveBike = () => bike;
  assert.equal(module.getNextService().description, "Przebieg");
  bike.mileage = 1200;
  assert.equal(module.getNextService().description, "Przebieg");
  bike.services[0].nextMileage = null;
  assert.equal(module.getNextService().description, "Termin");
});

test("failed direct persistence validation does not call the session layer", async () => {
  const module = loadService();
  let sessions = 0;
  module.getSession = async () => { sessions += 1; return null; };
  assert.equal(await module.addService(validService({ laborCost: NaN })), false);
  assert.equal(sessions, 0);
});
