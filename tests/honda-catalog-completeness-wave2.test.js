"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const data = reportModule.loadCatalog();
const honda = data.find(item => item.id === "honda");
const family = id => honda.models.find(item => item.id === id);
const allVariants = data.flatMap(brand => brand.models).flatMap(model => model.variants);

test("Honda Wave 2 counts are deterministic", () => {
  const report = reportModule.buildReport(data);
  const hondaReport = report.perManufacturer.find(item => item.id === "honda");
  assert.deepEqual(hondaReport, { id: "honda", manufacturer: "Honda", families: 50, variants: 180, variantYears: 728, earliestYear: 1990, latestYear: 2025 });
  assert.deepEqual(reportModule.buildReport(data), report);
});

test("Honda family, variant and global key identities are unique and years are valid", () => {
  assert.equal(new Set(honda.models.map(item => item.id)).size, honda.models.length);
  honda.models.forEach(model => {
    assert.equal(new Set(model.variants.map(item => item.id)).size, model.variants.length, model.id);
    model.variants.forEach(variant => {
      assert.equal(Number.isInteger(variant.yearFrom), true);
      assert.equal(Number.isInteger(variant.yearTo), true);
      assert.match(String(variant.yearFrom), /^\d{4}$/);
      assert.match(String(variant.yearTo), /^\d{4}$/);
      assert.ok(variant.yearFrom <= variant.yearTo);
    });
  });
  assert.equal(new Set(allVariants.map(item => item.key)).size, allVariants.length);
});

test("sport inventory covers VTR, CBR, VFR and documented European NC30", () => {
  ["vtr", "cbr125r", "cbr250-300", "cbr600f", "cbr600rr", "cbr-fireblade", "cbr1100xx", "vfr400r", "vfr750f", "vfr800"].forEach(id => assert.ok(family(id), id));
  assert.deepEqual(family("vtr").variants.map(item => item.storedModel), ["VTR1000F FireStorm", "VTR1000 SP-1", "VTR1000 SP-2"]);
  assert.ok(family("cbr-fireblade").variants.some(item => item.key === "honda.cbr-fireblade.sc82-sp-3"));
  assert.deepEqual(family("vfr400r").variants.map(item => [item.yearFrom, item.yearTo]), [[1990, 1991]]);
  assert.equal(family("rvf400"), undefined);
  assert.equal(family("cbr400rr"), undefined);
});

test("roadster, touring, adventure, dual-sport and cruiser domains are represented", () => {
  ["cb500", "cb500f", "hornet", "cb650", "cb1000r", "cb1100", "cbf500", "cbf600", "cbf1000"].forEach(id => assert.ok(family(id), id));
  ["pan-european", "deauville", "nt1100", "gold-wing", "f6c-valkyrie"].forEach(id => assert.ok(family(id), id));
  ["africa-twin", "transalp", "varadero", "crossrunner", "crosstourer", "nc700x", "nc750x", "x-adv"].forEach(id => assert.ok(family(id), id));
  ["crf-trail", "fmx650"].forEach(id => assert.ok(family(id), id));
  ["shadow", "rebel"].forEach(id => assert.ok(family(id), id));
});

test("documented discontinuities and parallel service variants are preserved", () => {
  const rr = family("cbr600rr").variants;
  assert.equal(rr.some(item => 2020 >= item.yearFrom && 2020 <= item.yearTo), false);
  assert.ok(rr.some(item => 2024 >= item.yearFrom && 2024 <= item.yearTo));
  const fireblade2024 = family("cbr-fireblade").variants.filter(item => 2024 >= item.yearFrom && 2024 <= item.yearTo);
  assert.ok(fireblade2024.some(item => item.storedModel === "CBR1000RR-R SC82 2024"));
  assert.ok(fireblade2024.some(item => item.storedModel === "CBR1000RR-R SP 2024"));
  const africa2024 = family("africa-twin").variants.filter(item => 2024 >= item.yearFrom && 2024 <= item.yearTo);
  assert.ok(africa2024.some(item => item.storedModel === "CRF1100L Africa Twin 2024"));
  assert.ok(africa2024.some(item => item.storedModel.includes("Adventure Sports")));
});

test("VFR identity, profile mapping, form ordering contract and production isolation remain stable", () => {
  const vtec = family("vfr800").variants.find(item => item.id === "vtec");
  assert.deepEqual(vtec, { id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.map(item => item.catalogVariantKeys), [["honda.vfr800.rc46.vtec.gen1"], ["ducati.monster.937"]]);
  const context = { window: {} }; context.window = context; vm.createContext(context);
  ["data/motorcycle-catalog.js", "js/motorcycle-catalog.js"].forEach(file => vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context));
  assert.deepEqual(JSON.parse(JSON.stringify(context.MotorcycleCatalog.getYears("honda", "cbr600f", "pc35-efi"))), [2006, 2005, 2004, 2003, 2002, 2001]);
  assert.equal(registry.some(item => item.catalogVariantKeys.includes("honda.vtr.vtr1000f-sc36")), false);
});
