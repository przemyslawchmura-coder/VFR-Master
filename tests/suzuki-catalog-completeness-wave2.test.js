"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const reportModule = require("../scripts/motorcycle-catalog-report.js");
const registry = require("../data/technical/technical-profile-registry.js");

const data = reportModule.loadCatalog();
const brand = id => data.find(item => item.id === id);
const flatten = manufacturer => manufacturer.models.flatMap(model =>
  model.variants.map(variant => ({ familyId: model.id, ...variant }))
).sort((left, right) => left.key.localeCompare(right.key));
const suzuki = brand("suzuki");
const variants = flatten(suzuki);
const family = id => suzuki.models.find(item => item.id === id);
const originalKeys = new Set(["suzuki.bandit.1200-1","suzuki.bandit.1200-2","suzuki.bandit.1250","suzuki.bandit.600-1","suzuki.bandit.600-2","suzuki.bandit.650-1","suzuki.bandit.650-2","suzuki.gsr.600","suzuki.gsr.750","suzuki.gsx-8.8r","suzuki.gsx-8.8s","suzuki.gsx-r1000.k1","suzuki.gsx-r1000.k3","suzuki.gsx-r1000.k5","suzuki.gsx-r1000.k7","suzuki.gsx-r1000.k9","suzuki.gsx-r1000.l2","suzuki.gsx-r1000.l7","suzuki.gsx-r600.k1","suzuki.gsx-r600.k4","suzuki.gsx-r600.k6","suzuki.gsx-r600.k8","suzuki.gsx-r600.l1","suzuki.gsx-r600.srad","suzuki.gsx-r750.gr7ad","suzuki.gsx-r750.gr7bb","suzuki.gsx-r750.k1","suzuki.gsx-r750.k4","suzuki.gsx-r750.k6","suzuki.gsx-r750.k8","suzuki.gsx-r750.l1","suzuki.gsx-r750.srad","suzuki.gsx-r750.y","suzuki.gsx-s1000.gen1","suzuki.gsx-s1000.gen2","suzuki.gsx-s1000.gen2-2025","suzuki.gsx-s1000gt.gen1","suzuki.gsx-s750.euro5","suzuki.gsx-s750.gen1","suzuki.hayabusa.gen1","suzuki.hayabusa.gen2","suzuki.hayabusa.gen3","suzuki.katana.gen2","suzuki.katana.gen2-e5","suzuki.katana.gsx1100","suzuki.sv1000.n","suzuki.sv1000.s","suzuki.sv650.gen1","suzuki.sv650.gen2","suzuki.sv650.gen3","suzuki.sv650.gladius","suzuki.v-strom-1000-1050.1000-1","suzuki.v-strom-1000-1050.1000-2","suzuki.v-strom-1000-1050.1000-3","suzuki.v-strom-1000-1050.1050-1","suzuki.v-strom-1000-1050.1050-2","suzuki.v-strom-650.gen1","suzuki.v-strom-650.gen2","suzuki.v-strom-650.gen3","suzuki.v-strom-650.xt2","suzuki.v-strom-650.xt3","suzuki.v-strom-800.de","suzuki.v-strom-800.re"]);
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

test("Suzuki Wave 2 counts and global totals are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(reportModule.buildReport(data), report);
  assert.deepEqual(report.perManufacturer.find(item => item.id === "suzuki"), {
    id: "suzuki", manufacturer: "Suzuki", families: 54, variants: 146,
    variantYears: 881, earliestYear: 1990, latestYear: 2025
  });
  assert.deepEqual(
    { manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears },
    { manufacturers: 13, families: 318, variants: 1095, variantYears: 5317 }
  );
});

test("Suzuki identities, keys, years and stored-model years are collision-free", () => {
  assert.equal(new Set(suzuki.models.map(item => item.id)).size, suzuki.models.length);
  assert.equal(new Set(variants.map(item => item.key)).size, 146);
  assert.equal(hash(variants.map(item => item.key)), "b9cf6ef80d11e0e605f1dc9ff66032c26a509f653a05926380453e724eadc20a");
  const identities = new Set();
  suzuki.models.forEach(model => {
    assert.equal(new Set(model.variants.map(item => item.id)).size, model.variants.length, model.id);
    model.variants.forEach(variant => {
      assert.equal(Number.isInteger(variant.yearFrom), true);
      assert.equal(Number.isInteger(variant.yearTo), true);
      assert.match(String(variant.yearFrom), /^\d{4}$/);
      assert.match(String(variant.yearTo), /^\d{4}$/);
      assert.ok(variant.yearFrom <= variant.yearTo);
      for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
        const identity = `${variant.storedModel}\0${year}`;
        assert.equal(identities.has(identity), false, identity);
        identities.add(identity);
      }
    });
  });
});

test("all 63 pre-Wave-2 Suzuki semantic identities remain unchanged", () => {
  const original = variants.filter(item => originalKeys.has(item.key));
  assert.equal(original.length, 63);
  assert.equal(hash(original), "eae33013ceb99a72c52e526fd884362efd06d70d20128af891cf4ee2dc092689");
});

test("sport and sport-touring coverage preserves distinct Suzuki lineages", () => {
  ["gsx-r600", "gsx-r750", "gsx-r1000", "gsx-r1100", "gsx600f", "gsx750f", "gsx650f", "rf", "tl1000", "hayabusa", "b-king", "gsx125", "gsx250r"].forEach(id => assert.ok(family(id), id));
  assert.ok(family("gsx-r1000").variants.some(item => item.storedModel === "GSX-R1000R L7"));
  assert.deepEqual(family("tl1000").variants.map(item => item.storedModel), ["TL1000S", "TL1000R"]);
});

test("roadster, adventure, dual-sport and historical standards are represented", () => {
  ["gs500", "gsx1100g", "inazuma", "gsx1400", "vx800", "gsx-s950", "gsx-s1000f", "gsx-s1000gx"].forEach(id => assert.ok(family(id), id));
  ["freewind", "dr125", "dr350", "dr650", "dr-big", "dr-z400", "vanvan", "v-strom-650", "v-strom-800", "v-strom-1000-1050"].forEach(id => assert.ok(family(id), id));
  assert.ok(family("dr-z400").variants.some(item => item.key === "suzuki.dr-z400.4sm" && item.yearFrom === 2025));
});

test("European cruiser and scooter identities use model lineages, not market aliases", () => {
  ["intruder-vs", "intruder-vl", "intruder-m", "marauder", "savage", "burgman-125-200", "burgman-250", "burgman-400", "burgman-650", "address"].forEach(id => assert.ok(family(id), id));
  assert.ok(family("intruder-m").variants.some(item => item.storedModel === "Intruder M1800R"));
  assert.equal(variants.some(item => /boulevard/i.test(item.storedModel)), false);
});

test("Honda, Yamaha and VFR Technical Profile identities remain isolated", () => {
  const honda = flatten(brand("honda"));
  const yamaha = flatten(brand("yamaha"));
  assert.equal(hash(honda), "0d29e7aeae2a97b206978a741eab612c08539548537698642783ac4bb4d151a0");
  assert.equal(hash(yamaha), "4eaa2108f162a4700d4fbaa9228345724fbbaef36a7318528503ac84b3f9f373");
  assert.equal(yamaha.length, 177);
  assert.equal(yamaha.reduce((sum, item) => sum + item.yearTo - item.yearFrom + 1, 0), 905);
  const vfr = honda.find(item => item.key === "honda.vfr800.rc46.vtec.gen1");
  assert.deepEqual(vfr, { familyId: "vfr800", id: "vtec", key: "honda.vfr800.rc46.vtec.gen1", name: "VTEC — I", storedModel: "VFR800 VTEC", yearFrom: 2002, yearTo: 2005 });
  assert.deepEqual(registry.flatMap(item => item.catalogVariantKeys), ["honda.vfr800.rc46.vtec.gen1"]);
  assert.equal(registry.some(item => item.catalogVariantKeys.some(key => key.startsWith("suzuki."))), false);
});
