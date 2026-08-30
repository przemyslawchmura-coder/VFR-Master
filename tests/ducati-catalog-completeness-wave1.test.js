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
const originalKeys = new Set(["ducati.desertx.gen1","ducati.diavel.1200","ducati.diavel.1260","ducati.diavel.v4","ducati.hypermotard.1100","ducati.hypermotard.821","ducati.hypermotard.939","ducati.hypermotard.950","ducati.monster.1100","ducati.monster.1100-evo","ducati.monster.1200","ducati.monster.620","ducati.monster.695","ducati.monster.696","ducati.monster.796","ducati.monster.821","ducati.monster.937","ducati.monster.m600","ducati.monster.m900","ducati.multistrada.1000","ducati.multistrada.1100","ducati.multistrada.1200-1","ducati.multistrada.1200-dvt","ducati.multistrada.1260","ducati.multistrada.v4-1","ducati.multistrada.v4-2","ducati.panigale.1199","ducati.panigale.1299","ducati.panigale.899","ducati.panigale.959","ducati.panigale.v2-1","ducati.panigale.v2-2","ducati.panigale.v4-1","ducati.panigale.v4-2","ducati.scrambler.desert-sled","ducati.scrambler.icon-1","ducati.scrambler.icon-2","ducati.streetfighter.1098","ducati.streetfighter.848","ducati.streetfighter.v4-1","ducati.streetfighter.v4-2","ducati.superbike-v2.1098","ducati.superbike-v2.1198","ducati.superbike-v2.749","ducati.superbike-v2.848","ducati.superbike-v2.999"]);

test("Ducati Wave 1 counts and catalogue totals are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(report.perManufacturer.find(item => item.id === "ducati"), { id: "ducati", manufacturer: "Ducati", families: 18, variants: 96, variantYears: 404, earliestYear: 1990, latestYear: 2025 });
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 297, variants: 1005, variantYears: 4871 });
});

test("Ducati keys, semantic identities, ranges and stored-model years are unique", () => {
  assert.equal(new Set(ducati.models.map(item => item.id)).size, 18);
  assert.equal(new Set(variants.map(item => item.key)).size, 96);
  assert.equal(hash(variants.map(item => item.key)), "bc550bfb2661ccc4827ea07ffebf7f29331c424bee1663c02894cd2c4a538b5b");
  const semantics = new Set(), storedYears = new Set();
  ducati.models.forEach(model => {
    assert.equal(new Set(model.variants.map(item => item.id)).size, model.variants.length, model.id);
    model.variants.forEach(variant => {
      assert.ok(variant.storedModel.trim());
      assert.ok(Number.isInteger(variant.yearFrom) && Number.isInteger(variant.yearTo) && variant.yearFrom <= variant.yearTo);
      const semantic = `${model.id}\0${variant.id}\0${variant.storedModel}`;
      assert.equal(semantics.has(semantic), false, semantic);
      semantics.add(semantic);
      for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
        const identity = `${variant.storedModel}\0${year}`;
        assert.equal(storedYears.has(identity), false, identity);
        storedYears.add(identity);
      }
    });
  });
});

test("all 46 pre-Wave-1 Ducati identities remain byte-for-byte unchanged", () => {
  const original = variants.filter(item => originalKeys.has(item.key));
  assert.equal(original.length, 46);
  assert.equal(hash(original.map(item => item.key)), "92e36d50ffe08ad5e4c6a6dbf184dddc94ea2fb41d760675a88769ba4c98368a");
  assert.equal(hash(original), "ef58a751bdb02c208c98cf7fee763aa744da057d30b8e33123e0295cd6c0d57d");
});

test("Superbike, Panigale and SuperSport generations cannot collapse", () => {
  ["superbike-classic", "superbike-v2", "panigale", "supersport"].forEach(id => assert.ok(family(id), id));
  ["Ducati 851", "Ducati 888", "Ducati 916", "Ducati 996", "Ducati 998", "Ducati 999", "Ducati 1098", "Panigale 1199", "Panigale 1299", "Panigale V4 2018"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
  assert.ok(family("supersport").variants.some(item => item.storedModel === "Ducati 900 SS 1990"));
  assert.ok(family("supersport").variants.some(item => item.storedModel === "Ducati SuperSport 950"));
});

test("reused Monster, Multistrada and Streetfighter names retain architecture boundaries", () => {
  ["Monster M900", "Monster S4RS", "Monster 1200", "Monster 937", "Multistrada 1000", "Multistrada 1200 DVT", "Multistrada V2", "Multistrada V4 2021", "Streetfighter 1098", "Streetfighter V2", "Streetfighter V4 2020"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
});

test("road, touring, hyper, cruiser and Scrambler production coverage is explicit", () => {
  ["sport-touring", "paso", "sportclassic", "limited-road", "hyperstrada", "xdiavel", "scrambler-1100"].forEach(id => assert.ok(family(id), id));
  ["Ducati ST4S", "Ducati 907 i.e.", "Ducati MH900e", "Hyperstrada 939", "XDiavel V4", "Scrambler 1100 Pro"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
  assert.equal(variants.some(item => /Factory Corse|Tricolore|Senna|Lamborghini|Bentley|prototype/i.test(item.storedModel)), false);
});

test("historical and modern Scrambler identities are not falsely merged", () => {
  assert.ok(family("scrambler").variants.some(item => item.storedModel === "Scrambler Icon 2015"));
  assert.ok(family("scrambler-1100").variants.some(item => item.storedModel === "Scrambler 1100 2018"));
  assert.equal(variants.some(item => /Scrambler (250|350|450)/.test(item.storedModel)), false);
});

test("prior manufacturers and VFR Technical Profile identity remain unchanged", () => {
  const expected = { honda: "0d29e7aeae2a97b206978a741eab612c08539548537698642783ac4bb4d151a0", yamaha: "4eaa2108f162a4700d4fbaa9228345724fbbaef36a7318528503ac84b3f9f373", suzuki: "4a5ec08639a6f18797479f1e2a66bb45df85258364114e067457a6b04c5dae9c", kawasaki: "81519200c36848783e3be044b0e9e81c2ba0de75d199b64dc2e44c4346921c5c", bmw: "fbb6f4e252cc64315539fb0abc85dac7ecb703136ee20fb1fbaa3b5e7b80f4b5" };
  Object.entries(expected).forEach(([id, digest]) => assert.equal(hash(flatten(brand(id))), digest, id));
  assert.deepEqual(flatten(brand("honda")).find(item => item.key === "honda.vfr800.rc46.vtec.gen1"), { familyId: "vfr800", id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1"]);
});
