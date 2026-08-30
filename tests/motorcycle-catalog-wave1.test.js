"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const path = require("node:path");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const catalog = reportModule.loadCatalog();
const report = reportModule.buildReport(catalog);
const brand = id => catalog.find(item => item.id === id);
const model = (brandId, modelId) => brand(brandId).models.find(item => item.id === modelId);

test("Wave 1 totals and per-manufacturer sums are exact and deterministic", () => {
  assert.deepEqual(report, reportModule.buildReport(catalog));
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 300, variants: 1029, variantYears: 4942 });
  assert.equal(report.perManufacturer.reduce((sum, item) => sum + item.variants, 0), report.variants);
  assert.equal(report.perManufacturer.reduce((sum, item) => sum + item.variantYears, 0), report.variantYears);
  assert.deepEqual(Object.fromEntries(report.perManufacturer.map(item => [item.id, [item.families, item.variants, item.variantYears]])), {
    aprilia: [8, 24, 110], bmw: [29, 135, 653], ducati: [21, 120, 475], "harley-davidson": [3, 15, 102], honda: [50, 180, 728], indian: [3, 6, 30], kawasaki: [47, 132, 647], ktm: [9, 38, 151], "moto-guzzi": [4, 11, 39], "royal-enfield": [3, 7, 35], suzuki: [54, 146, 881], triumph: [9, 38, 186], yamaha: [60, 177, 905]
  });
  assert.equal(report.earliestYear, 1990);
  assert.equal(report.latestYear, 2025);
  catalog.flatMap(item => item.models).flatMap(item => item.variants).forEach(item => {
    assert.match(String(item.yearFrom), /^\d{4}$/);
    assert.match(String(item.yearTo), /^\d{4}$/);
  });
});

test("developer report CLI is deterministic and matches the counting utility", () => {
  const script = path.join(__dirname, "../scripts/motorcycle-catalog-report.js");
  const first = childProcess.execFileSync(process.execPath, [script], { encoding: "utf8" });
  assert.equal(first, childProcess.execFileSync(process.execPath, [script], { encoding: "utf8" }));
  assert.deepEqual(JSON.parse(first), report);
});

test("new manufacturers and representative European families are present", () => {
  ["harley-davidson", "indian", "moto-guzzi", "royal-enfield"].forEach(id => assert.ok(brand(id)));
  assert.ok(model("honda", "gold-wing"));
  assert.ok(model("yamaha", "yzf-r6"));
  assert.ok(model("suzuki", "bandit"));
  assert.ok(model("kawasaki", "versys-1000-1100"));
  assert.ok(model("bmw", "s1000r-xr"));
});

test("stable VFR and Yamaha FZ1 identities remain unchanged", () => {
  assert.deepEqual(model("honda", "vfr800").variants.find(item => item.id === "vtec"), { id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(model("yamaha", "fz1").variants.find(item => item.id === "s"), { id: "s", key: "yamaha.fz1.gen2.s", name: "S / Fazer", storedModel: "FZ1-S", yearFrom: 2006, yearTo: 2015 });
});

test("parallel technical variants coexist and production gaps remain gaps", () => {
  const h2 = model("kawasaki", "h2").variants;
  assert.ok(h2.some(item => item.storedModel === "Ninja H2" && 2020 >= item.yearFrom && 2020 <= item.yearTo));
  assert.ok(h2.some(item => item.storedModel === "Z H2" && 2020 >= item.yearFrom && 2020 <= item.yearTo));
  const hayabusa = model("suzuki", "hayabusa").variants;
  assert.equal(hayabusa.some(item => 2019 >= item.yearFrom && 2019 <= item.yearTo), false);
  assert.equal(hayabusa.some(item => 2020 >= item.yearFrom && 2020 <= item.yearTo), false);
});

test("catalog expansion does not create or register Technical Profiles", () => {
  assert.equal(registry.length, 1);
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1"]);
  assert.ok(report.variants > registry.length);
});
