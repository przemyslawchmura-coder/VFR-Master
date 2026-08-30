"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const data = reportModule.loadCatalog();
const brand = id => data.find(item => item.id === id);
const flatten = manufacturer => manufacturer.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant }))).sort((a, b) => a.key.localeCompare(b.key));
const ducati = brand("ducati");
const variants = flatten(ducati);
const family = id => ducati.models.find(item => item.id === id);
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const wave2Keys = new Set(["ducati.monster.1000","ducati.monster.1200-r","ducati.monster.937-sp","ducati.multistrada-special.1200-enduro","ducati.multistrada-special.1260-enduro","ducati.multistrada-special.v4-pikes-peak","ducati.multistrada-special.v4-rally","ducati.multistrada-special.v4-rs","ducati.scrambler.sixty2","ducati.sport-touring.st3s","ducati.sportclassic.sport-1000-s","ducati.superbike-r.1098-r","ducati.superbike-r.1198-r","ducati.superbike-r.996-r","ducati.superbike-r.998-r","ducati.superbike-r.999-r","ducati.superbike-r.panigale-r","ducati.superbike-r.v4-r-1","ducati.superbike-r.v4-r-2","ducati.superleggera.1199","ducati.superleggera.1299","ducati.superleggera.v4","ducati.supersport.600-carb","ducati.supersport.900-superlight"]);

test("Ducati Wave 2 and global totals are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(report.perManufacturer.find(item => item.id === "ducati"), { id: "ducati", manufacturer: "Ducati", families: 21, variants: 120, variantYears: 475, earliestYear: 1990, latestYear: 2025 });
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 300, variants: 1029, variantYears: 4942 });
});

test("all 96 Wave 1 families, records and storedModel/year identities are frozen", () => {
  const wave1 = variants.filter(item => !wave2Keys.has(item.key));
  const storedYears = wave1.flatMap(variant => Array.from({ length: variant.yearTo - variant.yearFrom + 1 }, (_, index) => `${variant.storedModel}\0${variant.yearFrom + index}`)).sort();
  assert.equal(wave1.length, 96);
  assert.equal(hash(wave1.map(item => item.key)), "bc550bfb2661ccc4827ea07ffebf7f29331c424bee1663c02894cd2c4a538b5b");
  assert.equal(hash(wave1), "0629eee163b6a4f4e6b904d023e521a6654fcd14e846331e23ae6d13f34eb5fc");
  assert.equal(hash(storedYears), "7d1ecfbac52d7f6bf304536e55bbaaf8ddec2a4c54550a336112c78f6dfae538");
  assert.equal(hash([...new Set(wave1.map(item => item.familyId))].sort()), "c1efe8b4332b7273bf3280977647fadde37b46918055487ee17b4ff3b4383d54");
});

test("the 24 evidence-backed Wave 2 keys are exact and stable", () => {
  const added = variants.filter(item => wave2Keys.has(item.key));
  assert.equal(added.length, 24);
  assert.equal(hash(added.map(item => item.key)), "867652e90724267184e26898ee28f5ec317d684f5c834b13db50f166b0bc73fe");
});

test("all final Ducati identities, ranges and storedModel years are collision-free", () => {
  assert.equal(new Set(ducati.models.map(item => item.id)).size, 21);
  assert.equal(new Set(variants.map(item => item.key)).size, 120);
  assert.equal(hash(variants.map(item => item.key)), "50e7fa3172b4b0fb715fe07b9e7ab61e7891e48529ded4c556f1b5ff5a192ba5");
  const semantic = new Set(), storedYears = new Set();
  ducati.models.forEach(model => model.variants.forEach(variant => {
    assert.ok(Number.isInteger(variant.yearFrom) && Number.isInteger(variant.yearTo) && variant.yearFrom <= variant.yearTo);
    const identity = `${model.id}\0${variant.id}\0${variant.storedModel}`;
    assert.equal(semantic.has(identity), false, identity);
    semantic.add(identity);
    for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
      const storedYear = `${variant.storedModel}\0${year}`;
      assert.equal(storedYears.has(storedYear), false, storedYear);
      storedYears.add(storedYear);
    }
  }));
});

test("customer homologation R and Superleggera motorcycles remain distinct", () => {
  ["Ducati 996 R", "Ducati 998 R", "Ducati 999 R", "Ducati 1098 R", "Ducati 1198 R", "Ducati Panigale R", "Panigale V4 R 2019", "Panigale V4 R 2023"].forEach(name => assert.ok(family("superbike-r").variants.some(item => item.storedModel === name), name));
  ["Ducati 1199 Superleggera", "Ducati 1299 Superleggera", "Ducati Superleggera V4"].forEach(name => assert.ok(family("superleggera").variants.some(item => item.storedModel === name), name));
  assert.equal(variants.some(item => /\b955\b/.test(item.storedModel)), false);
});

test("mechanically distinct road gaps are present without trim explosion", () => {
  ["Ducati 600 SS", "Ducati 900 Superlight", "Monster 1000", "Monster 1200 R", "Monster SP 937", "Ducati ST3S", "Scrambler Sixty2", "Ducati Sport 1000 S", "Multistrada 1200 Enduro", "Multistrada 1260 Enduro", "Multistrada V4 Pikes Peak", "Multistrada V4 Rally", "Multistrada V4 RS"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
  assert.equal(variants.some(item => /V4 SP2|Streetfighter V4 SP|XDiavel S|SuperSport S|GT 1000 Touring|Mach 2\.0|Urban Enduro|Scrambler Classic/.test(item.storedModel)), false);
});

test("same-name generations and production-versus-racing boundaries remain explicit", () => {
  assert.ok(family("superbike-r").variants.some(item => item.storedModel === "Panigale V4 R 2019"));
  assert.ok(family("superbike-r").variants.some(item => item.storedModel === "Panigale V4 R 2023"));
  assert.ok(family("limited-road").variants.some(item => item.storedModel === "Ducati Desmosedici RR"));
  assert.equal(variants.some(item => /Desmosedici GP|Factory Corse|Supermono/.test(item.storedModel)), false);
});

test("prior manufacturers and VFR remain isolated", () => {
  const expected = { honda: [50,180,728,"0d29e7aeae2a97b206978a741eab612c08539548537698642783ac4bb4d151a0"], yamaha: [60,177,905,"4eaa2108f162a4700d4fbaa9228345724fbbaef36a7318528503ac84b3f9f373"], suzuki: [54,146,881,"4a5ec08639a6f18797479f1e2a66bb45df85258364114e067457a6b04c5dae9c"], kawasaki: [47,132,647,"81519200c36848783e3be044b0e9e81c2ba0de75d199b64dc2e44c4346921c5c"], bmw: [29,135,653,"fbb6f4e252cc64315539fb0abc85dac7ecb703136ee20fb1fbaa3b5e7b80f4b5"] };
  Object.entries(expected).forEach(([id, [families, count, years, digest]]) => {
    const manufacturer = brand(id), records = flatten(manufacturer);
    assert.deepEqual([manufacturer.models.length, records.length, records.reduce((sum, item) => sum + item.yearTo - item.yearFrom + 1, 0)], [families, count, years]);
    assert.equal(hash(records), digest, id);
  });
  assert.deepEqual(flatten(brand("honda")).find(item => item.key === "honda.vfr800.rc46.vtec.gen1"), { familyId: "vfr800", id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1"]);
});
