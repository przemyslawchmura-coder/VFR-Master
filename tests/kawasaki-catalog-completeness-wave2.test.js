"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const data = reportModule.loadCatalog();
const brand = id => data.find(item => item.id === id);
const flatten = manufacturer => manufacturer.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant }))).sort((a, b) => a.key.localeCompare(b.key));
const kawasaki = brand("kawasaki");
const variants = flatten(kawasaki);
const family = id => kawasaki.models.find(item => item.id === id);
const originalKeys = new Set(["kawasaki.er-6.f1","kawasaki.er-6.f2","kawasaki.er-6.f3","kawasaki.er-6.n1","kawasaki.er-6.n2","kawasaki.er-6.n3","kawasaki.gtr1400.gen1","kawasaki.gtr1400.gen2","kawasaki.h2.ninja","kawasaki.h2.sx-1","kawasaki.h2.sx-2","kawasaki.h2.z","kawasaki.ninja-250-500.250-ex250j","kawasaki.ninja-250-500.300-ex300a","kawasaki.ninja-250-500.400-ex400g","kawasaki.ninja-250-500.500-ex500g","kawasaki.ninja-650.gen1","kawasaki.ninja-650.gen2","kawasaki.ninja-650.gen3","kawasaki.ninja-zx-10r.2021","kawasaki.ninja-zx-10r.c","kawasaki.ninja-zx-10r.d","kawasaki.ninja-zx-10r.e","kawasaki.ninja-zx-10r.j-k","kawasaki.ninja-zx-10r.s","kawasaki.ninja-zx-4r.zx400p","kawasaki.ninja-zx-4r.zx400s","kawasaki.ninja-zx-6r.a","kawasaki.ninja-zx-6r.b","kawasaki.ninja-zx-6r.c","kawasaki.ninja-zx-6r.e-f","kawasaki.ninja-zx-6r.g","kawasaki.ninja-zx-6r.j","kawasaki.ninja-zx-6r.j-2024","kawasaki.ninja-zx-6r.p","kawasaki.ninja-zx-6r.r","kawasaki.ninja-zx-6r.zx600f","kawasaki.ninja-zx-6r.zx600g","kawasaki.versys-1000-1100.1100","kawasaki.versys-1000-1100.gen1","kawasaki.versys-1000-1100.gen2","kawasaki.versys-1000-1100.gen3","kawasaki.versys-650.gen1","kawasaki.versys-650.gen2","kawasaki.versys-650.gen3","kawasaki.versys-650.gen4","kawasaki.vulcan-s.gen1","kawasaki.vulcan-s.gen2","kawasaki.z-small.z300","kawasaki.z-small.z400","kawasaki.z-small.z500","kawasaki.z1000.gen1","kawasaki.z1000.gen2","kawasaki.z1000.gen3","kawasaki.z1000.gen4","kawasaki.z650.gen1","kawasaki.z650.gen2","kawasaki.z650.gen3","kawasaki.z750.gen1","kawasaki.z750.gen2","kawasaki.z800.gen1","kawasaki.z900.gen1","kawasaki.z900.gen2","kawasaki.z900.gen3"]);
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

test("Kawasaki Wave 2 counts and global totals are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(report.perManufacturer.find(item => item.id === "kawasaki"), { id: "kawasaki", manufacturer: "Kawasaki", families: 47, variants: 132, variantYears: 647, earliestYear: 1990, latestYear: 2025 });
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 314, variants: 1076, variantYears: 5236 });
});

test("Kawasaki keys, years and stored-model years are collision-free", () => {
  assert.equal(new Set(kawasaki.models.map(item => item.id)).size, 47);
  assert.equal(new Set(variants.map(item => item.key)).size, 132);
  assert.equal(hash(variants.map(item => item.key)), "998eb66401c49f345f0dfc9105c155f6f64f084bcd09705355c0f15726695ad9");
  const identities = new Set();
  kawasaki.models.forEach(model => {
    assert.equal(new Set(model.variants.map(item => item.id)).size, model.variants.length, model.id);
    model.variants.forEach(variant => {
      assert.ok(Number.isInteger(variant.yearFrom) && Number.isInteger(variant.yearTo) && variant.yearFrom <= variant.yearTo);
      for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
        const identity = `${variant.storedModel}\0${year}`;
        assert.equal(identities.has(identity), false, identity);
        identities.add(identity);
      }
    });
  });
});

test("all 64 pre-Wave-2 Kawasaki semantic identities remain unchanged", () => {
  const original = variants.filter(item => originalKeys.has(item.key));
  assert.equal(original.length, 64);
  assert.equal(hash(original), "8c28ecce82b1a7dd57823197cf43f18ac8bf7e267b9da827340e5bcb4bc27303");
});

test("historical and modern sport lineages remain distinct", () => {
  ["zxr400", "zxr750-zx7r", "ninja-zx-6r", "ninja-zx-9r", "ninja-zx-10r", "ninja-zx-12r", "zzr600", "zzr1100", "zzr1200", "zzr1400", "gpz500s", "ninja-1000sx"].forEach(id => assert.ok(family(id), id));
  assert.equal(family("zzr1400").variants.some(item => /Ninja ZX-14/.test(item.storedModel)), false);
});

test("standards, adventure, classics and cruisers have natural families", () => {
  ["er-5", "er-6", "zrx", "zephyr", "z750", "z900rs", "w"].forEach(id => assert.ok(family(id), id));
  ["kle500", "klr650", "klx-road", "versys-x300", "versys-650"].forEach(id => assert.ok(family(id), id));
  ["vulcan-750-800", "vulcan-900", "vulcan-1500-1600", "vulcan-1700", "eliminator"].forEach(id => assert.ok(family(id), id));
});

test("European aliases and new powertrains do not create duplicate identities", () => {
  assert.ok(family("ninja-1000sx").variants.some(item => item.storedModel === "Z1000SX 2011"));
  assert.ok(family("gtr1000").variants.some(item => item.storedModel === "1000GTR"));
  assert.ok(family("electric").variants.some(item => item.storedModel === "Ninja e-1"));
  assert.ok(family("hybrid").variants.some(item => item.storedModel === "Z7 Hybrid"));
  assert.equal(variants.some(item => /Concours|ZX-14/.test(item.storedModel)), false);
});

test("Honda, Yamaha, Suzuki and VFR production identities remain isolated", () => {
  const honda = flatten(brand("honda")), yamaha = flatten(brand("yamaha")), suzuki = flatten(brand("suzuki"));
  assert.equal(hash(honda), "0d29e7aeae2a97b206978a741eab612c08539548537698642783ac4bb4d151a0");
  assert.equal(hash(yamaha), "4eaa2108f162a4700d4fbaa9228345724fbbaef36a7318528503ac84b3f9f373");
  assert.equal(hash(suzuki), "4a5ec08639a6f18797479f1e2a66bb45df85258364114e067457a6b04c5dae9c");
  assert.deepEqual([brand("yamaha").models.length, yamaha.length, yamaha.reduce((n,v)=>n+v.yearTo-v.yearFrom+1,0)], [60,177,905]);
  assert.deepEqual([brand("suzuki").models.length, suzuki.length, suzuki.reduce((n,v)=>n+v.yearTo-v.yearFrom+1,0)], [54,146,881]);
  assert.deepEqual(honda.find(item => item.key === "honda.vfr800.rc46.vtec.gen1"), { familyId: "vfr800", id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1"]);
});
