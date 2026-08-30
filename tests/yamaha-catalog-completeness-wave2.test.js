"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const reportModule = require("../scripts/motorcycle-catalog-report.js");

const data = reportModule.loadCatalog();
const yamaha = data.find(item => item.id === "yamaha");
const family = id => yamaha.models.find(item => item.id === id);
const variants = yamaha.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant })));
const allVariants = data.flatMap(brand => brand.models).flatMap(model => model.variants);
const originalKeys = new Set(["yamaha.fz1.gen2.n","yamaha.fz1.gen2.s","yamaha.yzf-r1.rn01","yamaha.yzf-r1.rn04","yamaha.yzf-r1.rn09","yamaha.yzf-r1.rn12","yamaha.yzf-r1.rn19","yamaha.yzf-r1.rn22-1","yamaha.yzf-r1.rn22-2","yamaha.yzf-r1.rn32","yamaha.yzf-r1.rn49","yamaha.yzf-r1.rn65","yamaha.mt-07.gen1","yamaha.mt-07.gen2","yamaha.mt-07.gen3","yamaha.mt-07.gen4","yamaha.mt-09.gen1","yamaha.mt-09.gen2","yamaha.mt-09.gen3","yamaha.mt-09.gen4","yamaha.tracer.mt09","yamaha.tracer.900","yamaha.tracer.9-1","yamaha.tracer.9-2","yamaha.tenere-700.gen1","yamaha.tenere-700.gen2","yamaha.fz6.n","yamaha.fz6.s","yamaha.fz6.n-s2","yamaha.fz6.s2","yamaha.yzf-r6.rj03","yamaha.yzf-r6.rj05","yamaha.yzf-r6.rj095","yamaha.yzf-r6.rj11","yamaha.yzf-r6.rj15","yamaha.yzf-r6.rj27","yamaha.yzf-r7.rm39","yamaha.yzf-r3-mt03.r3-rh07","yamaha.yzf-r3-mt03.r3-rh12","yamaha.yzf-r3-mt03.r3-2025","yamaha.yzf-r3-mt03.mt03-rh07","yamaha.yzf-r3-mt03.mt03-rh12","yamaha.yzf-r3-mt03.mt03-2025","yamaha.mt-10.gen1","yamaha.mt-10.gen2","yamaha.xsr700.gen1","yamaha.xsr700.gen2","yamaha.xsr900.gen1","yamaha.xsr900.gen2","yamaha.xsr900.gen2-2025","yamaha.fjr1300.rp04","yamaha.fjr1300.rp08","yamaha.fjr1300.rp13","yamaha.fjr1300.rp23-1","yamaha.fjr1300.rp23-2","yamaha.tdm.850-1","yamaha.tdm.850-2","yamaha.tdm.900","yamaha.xj6.n","yamaha.xj6.diversion","yamaha.xj6.diversion-f","yamaha.super-tenere.gen1","yamaha.super-tenere.gen2"]);

test("Yamaha Wave 2 counts and global counts are deterministic", () => {
  const report = reportModule.buildReport(data);
  assert.deepEqual(reportModule.buildReport(data), report);
  assert.deepEqual(
    { manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears },
    { manufacturers: 13, families: 269, variants: 870, variantYears: 4232 }
  );
  assert.deepEqual(report.perManufacturer.find(item => item.id === "yamaha"), {
    id: "yamaha", manufacturer: "Yamaha", families: 60, variants: 177,
    variantYears: 905, earliestYear: 1990, latestYear: 2025
  });
});

test("Yamaha identities and years are valid and collision-free", () => {
  assert.equal(new Set(yamaha.models.map(item => item.id)).size, yamaha.models.length);
  yamaha.models.forEach(model => {
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
  const identities = new Set();
  variants.forEach(variant => {
    for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) {
      const identity = `${variant.storedModel}\0${year}`;
      assert.equal(identities.has(identity), false, identity);
      identities.add(identity);
    }
  });
});

test("sport lineages cover historical and modern platforms without name merging", () => {
  ["fzr", "yzf750", "thunderace", "thundercat", "trx850", "szr660", "yzf-r125", "yzf-r3-mt03", "yzf-r6", "yzf-r7", "yzf-r1", "yzf-r9"].forEach(id => assert.ok(family(id), id));
  assert.equal(family("yzf-r7").variants.find(item => item.id === "r7-ow02").yearFrom, 1999);
  assert.equal(family("yzf-r7").variants.find(item => item.id === "rm39").yearFrom, 2022);
  assert.ok(family("thunderace").variants.some(item => item.storedModel.includes("Thunderace")));
  assert.ok(family("thundercat").variants.some(item => item.storedModel.includes("Thundercat")));
});

test("roadster, touring, adventure and unusual-road domains are represented", () => {
  ["fz750", "fazer-600", "fazer-1000", "fz8-fazer8", "fz1", "fz6", "mt-01", "mt-03-660", "mt-125", "mt-07", "mt-09", "mt-10", "xsr125", "xsr700", "xsr900", "xj600-diversion", "xj900-diversion", "xj6", "xjr"].forEach(id => assert.ok(family(id), id));
  ["tdm", "tracer-7", "tracer", "fj1200", "fjr1300"].forEach(id => assert.ok(family(id), id));
  ["xt", "tenere", "tenere-700", "super-tenere", "wr-road", "tt-road"].forEach(id => assert.ok(family(id), id));
  ["gts1000", "bt1100-bulldog", "niken"].forEach(id => assert.ok(family(id), id));
});

test("cruisers, classics, two-strokes and commuters retain distinct service identities", () => {
  ["vmax", "virago", "drag-star", "wild-star", "warrior", "midnight-star-1900", "xv950", "sr", "srx", "tzr", "tdr", "dt125", "ybr125", "ys125"].forEach(id => assert.ok(family(id), id));
  assert.deepEqual(family("vmax").variants.map(item => item.yearFrom), [1990, 2009]);
  assert.ok(family("dt125").variants.some(item => item.storedModel === "DT125X"));
  assert.ok(family("ys125").variants.some(item => item.storedModel === "YS125"));
});

test("parallel technical variants and documented discontinuities remain explicit", () => {
  assert.ok(family("mt-09").variants.some(item => item.storedModel === "MT-09 SP 2024"));
  assert.ok(family("fjr1300").variants.some(item => item.storedModel === "FJR1300AS 2016"));
  assert.ok(family("tracer").variants.some(item => item.storedModel === "Tracer 9 GT+"));
  assert.equal(family("vmax").variants.some(item => item.yearFrom <= 2007 && item.yearTo >= 2007), false);
  assert.equal(family("sr").variants.some(item => item.yearFrom <= 2010 && item.yearTo >= 2010), false);
  assert.equal(variants.some(item => /anniversary|race blu|world gp/i.test(item.storedModel)), false);
});

test("all 63 pre-wave Yamaha semantic identities remain unchanged", () => {
  const original = variants.filter(item => originalKeys.has(item.key)).map(item => ({
    familyId: item.familyId, id: item.id, key: item.key, name: item.name,
    storedModel: item.storedModel, yearFrom: item.yearFrom, yearTo: item.yearTo
  })).sort((a, b) => a.key.localeCompare(b.key));
  assert.equal(original.length, 63);
  assert.equal(crypto.createHash("sha256").update(JSON.stringify(original)).digest("hex"), "1f42f9012afcedd19aecf94938dcce639419cb7570d5034755839038873ca5ed");
});

test("all 177 Wave 2 variant keys survive family normalization", () => {
  const keys = variants.map(item => item.key).sort();
  assert.equal(keys.length, 177);
  assert.equal(crypto.createHash("sha256").update(JSON.stringify(keys)).digest("hex"), "27298cee5483848f07d16de22156acbc77faab489a229d743df8ef3dc88ac6c0");
});

test("generic form ordering and Technical Profile isolation remain intact", () => {
  const context = { window: {} }; context.window = context; vm.createContext(context);
  ["data/motorcycle-catalog.js", "js/motorcycle-catalog.js"].forEach(file => vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context));
  assert.deepEqual(JSON.parse(JSON.stringify(context.MotorcycleCatalog.getYears("yamaha", "fzr", "fzr600-3he"))), [1993, 1992, 1991, 1990]);
  const registry = require("../data/technical/technical-profile-registry.js");
  assert.equal(registry.some(item => item.catalogVariantKeys.some(key => key.startsWith("yamaha."))), false);
});
