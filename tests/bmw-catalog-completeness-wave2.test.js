"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const data = reportModule.loadCatalog();
const brand = id => data.find(item => item.id === id);
const flatten = manufacturer => manufacturer.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant }))).sort((a, b) => a.key.localeCompare(b.key));
const bmw = brand("bmw");
const variants = flatten(bmw);
const family = id => bmw.models.find(item => item.id === id);
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const originalKeys = new Set(["bmw.f-gs.f650-single","bmw.f-gs.f650-twin","bmw.f-gs.f700","bmw.f-gs.f800-1","bmw.f-gs.f800-2","bmw.f-gs.f850","bmw.f-gs.f900","bmw.f-roadster-xr.f800r-1","bmw.f-roadster-xr.f800r-2","bmw.f-roadster-xr.f900r-1","bmw.f-roadster-xr.f900r-2","bmw.f-roadster-xr.f900xr-1","bmw.f-roadster-xr.f900xr-2","bmw.g310.gs-1","bmw.g310.gs-2","bmw.g310.r-1","bmw.g310.r-2","bmw.k1600.gen1","bmw.k1600.gen2","bmw.k1600.gen3","bmw.r-ninet.euro4","bmw.r-ninet.euro5","bmw.r-ninet.gen1","bmw.r-ninet.r12","bmw.r1100gs","bmw.r1150gs","bmw.r1200gs.k25.dohc","bmw.r1200gs.k25.facelift","bmw.r1200gs.k25.gen1","bmw.r1200gs.k50.gen1","bmw.r1200gs.k50.gen2","bmw.r1250gs","bmw.r1300gs","bmw.r18.gen1","bmw.rt-boxer.r1100","bmw.rt-boxer.r1150","bmw.rt-boxer.r1200-k26","bmw.rt-boxer.r1200-k52","bmw.rt-boxer.r1250","bmw.s1000r-xr.r-1","bmw.s1000r-xr.r-2","bmw.s1000r-xr.r-3","bmw.s1000r-xr.r-4","bmw.s1000r-xr.xr-1","bmw.s1000r-xr.xr-2","bmw.s1000r-xr.xr-3","bmw.s1000rr.gen1","bmw.s1000rr.gen2","bmw.s1000rr.gen3","bmw.s1000rr.gen3-fl"]);

test("BMW Wave 2 counts and global totals are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(report.perManufacturer.find(item => item.id === "bmw"), { id: "bmw", manufacturer: "BMW", families: 29, variants: 135, variantYears: 653, earliestYear: 1990, latestYear: 2025 });
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 318, variants: 1095, variantYears: 5317 });
});

test("BMW keys, semantic identities, years and stored-model years are collision-free", () => {
  assert.equal(new Set(bmw.models.map(item => item.id)).size, 29);
  assert.equal(new Set(variants.map(item => item.key)).size, 135);
  assert.equal(hash(variants.map(item => item.key)), "6ba4e7d993a3734f9a83626b07e1416a831e4b8c951c66e32651390d67039e37");
  const semantic = new Set(), storedYears = new Set();
  bmw.models.forEach(model => {
    assert.equal(new Set(model.variants.map(item => item.id)).size, model.variants.length, model.id);
    model.variants.forEach(variant => {
      assert.ok(Number.isInteger(variant.yearFrom) && Number.isInteger(variant.yearTo) && variant.yearFrom <= variant.yearTo);
      assert.equal(semantic.has(`${model.id}\0${variant.id}\0${variant.storedModel}`), false);
      semantic.add(`${model.id}\0${variant.id}\0${variant.storedModel}`);
      for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
        const identity = `${variant.storedModel}\0${year}`;
        assert.equal(storedYears.has(identity), false, identity);
        storedYears.add(identity);
      }
    });
  });
});

test("all 50 pre-Wave-2 BMW semantic identities remain unchanged", () => {
  const original = variants.filter(item => originalKeys.has(item.key));
  assert.equal(original.length, 50);
  assert.equal(hash(original), "12187e0648c2b329e994ceec40a5af5cf7f3d8b12db702f8ad7b00ee6b7875f5");
});

test("boxer road, touring, GS and Adventure identities remain distinct", () => {
  ["gs-boxer", "gs-adventure-boxer", "r-roadster", "r-sport-touring", "rt-boxer", "r850-special", "r-cruiser"].forEach(id => assert.ok(family(id), id));
  assert.ok(family("gs-boxer").variants.some(item => item.storedModel === "R 1300 GS"));
  assert.ok(family("gs-adventure-boxer").variants.some(item => item.storedModel === "R 1300 GS Adventure"));
});

test("longitudinal, transverse and six-cylinder K architectures are separated", () => {
  ["k-legacy", "k1100", "k1200-brick", "k1200-transverse", "k1300", "k1600"].forEach(id => assert.ok(family(id), id));
  assert.ok(family("k1200-brick").variants.some(item => item.storedModel === "K 1200 GT 2003"));
  assert.ok(family("k1200-transverse").variants.some(item => item.storedModel === "K 1200 GT 2006"));
});

test("F and G badge reuse preserves different platforms and Adventure models", () => {
  ["f650-classic", "f650-special", "f-gs", "g650", "g310", "f-touring", "f-roadster-xr"].forEach(id => assert.ok(family(id), id));
  ["F 650 GS Single", "F 650 GS Twin", "F 700 GS", "F 750 GS", "F 800 GS 2024", "F 850 GS", "F 900 GS", "F 900 GS Adventure"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
});

test("performance, heritage, cruiser, scooter and electric production lines are represented", () => {
  ["s1000rr", "s1000r-xr", "m1000", "hp-road", "r-ninet", "r18", "c-scooter", "c400", "electric-urban"].forEach(id => assert.ok(family(id), id));
  ["R nineT Pure", "R nineT Scrambler", "R nineT Racer", "R nineT Urban G/S", "CE 04", "CE 02"].forEach(name => assert.ok(variants.some(item => item.storedModel === name), name));
  assert.equal(variants.some(item => /Option 719|Triple Black|Trophy|anniversary/i.test(item.storedModel)), false);
});

test("Honda, Yamaha, Suzuki, Kawasaki and VFR production identities remain isolated", () => {
  const honda = flatten(brand("honda")), yamaha = flatten(brand("yamaha")), suzuki = flatten(brand("suzuki")), kawasaki = flatten(brand("kawasaki"));
  assert.equal(hash(honda), "0d29e7aeae2a97b206978a741eab612c08539548537698642783ac4bb4d151a0");
  assert.equal(hash(yamaha), "4eaa2108f162a4700d4fbaa9228345724fbbaef36a7318528503ac84b3f9f373");
  assert.equal(hash(suzuki), "4a5ec08639a6f18797479f1e2a66bb45df85258364114e067457a6b04c5dae9c");
  assert.equal(hash(kawasaki), "81519200c36848783e3be044b0e9e81c2ba0de75d199b64dc2e44c4346921c5c");
  assert.deepEqual([brand("yamaha").models.length, yamaha.length, yamaha.reduce((n,v)=>n+v.yearTo-v.yearFrom+1,0)], [60,177,905]);
  assert.deepEqual([brand("suzuki").models.length, suzuki.length, suzuki.reduce((n,v)=>n+v.yearTo-v.yearFrom+1,0)], [54,146,881]);
  assert.deepEqual([brand("kawasaki").models.length, kawasaki.length, kawasaki.reduce((n,v)=>n+v.yearTo-v.yearFrom+1,0)], [47,132,647]);
  assert.deepEqual(honda.find(item => item.key === "honda.vfr800.rc46.vtec.gen1"), { familyId: "vfr800", id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1", "ducati.monster.937"]);
});
