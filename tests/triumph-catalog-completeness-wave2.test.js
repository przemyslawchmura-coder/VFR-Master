"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { loadCatalog, buildReport } = require("../scripts/motorcycle-catalog-report.js");
const catalog = loadCatalog();
const triumph = catalog.find(item => item.id === "triumph");
const flat = triumph.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant })));
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const wave1Keys = ["triumph.street-triple.675-1","triumph.street-triple.675-2","triumph.street-triple.765-1","triumph.street-triple.765-2","triumph.street-triple.765-3","triumph.speed-triple.t300","triumph.speed-triple.955","triumph.speed-triple.1050-1","triumph.speed-triple.1050-2","triumph.speed-triple.1050-3","triumph.speed-triple.1200","triumph.tiger-middle.800-1","triumph.tiger-middle.800-2","triumph.tiger-middle.800-3","triumph.tiger-middle.900-1","triumph.tiger-middle.900-2","triumph.tiger-1200.explorer-1","triumph.tiger-1200.explorer-2","triumph.tiger-1200.1200-1","triumph.tiger-1200.1200-2","triumph.bonneville.790","triumph.bonneville.865","triumph.bonneville.t100","triumph.bonneville.t120","triumph.daytona.675-1","triumph.daytona.675-2","triumph.daytona.675-3","triumph.daytona.660","triumph.trident-tiger-sport.trident-660","triumph.trident-tiger-sport.tiger-sport-660","triumph.trident-tiger-sport.tiger-sport-800","triumph.rocket.iii-1","triumph.rocket.iii-2","triumph.rocket.3","triumph.scrambler.865","triumph.scrambler.900","triumph.scrambler.1200-1","triumph.scrambler.1200-2"].sort();

test("Wave 2 totals and Wave 1 freeze remain deterministic", () => {
  const report = buildReport(catalog);
  assert.deepEqual([triumph.models.length, flat.length, flat.reduce((n, v) => n + v.yearTo - v.yearFrom + 1, 0)], [27, 104, 561]);
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 318, variants: 1095, variantYears: 5317 });
  assert.deepEqual(flat.filter(v => wave1Keys.includes(v.key)).map(v => v.key).sort(), wave1Keys);
  const baseline = flat.filter(v => wave1Keys.includes(v.key)).sort((a, b) => a.key.localeCompare(b.key));
  assert.equal(hash(baseline), "902892d6ba55fec4d87e86bf1940b69af174b4a5ba5a29f811566b84252bc537");
});

test("Wave 2 production identities and generation boundaries are present", () => {
  ["triumph.speed-400.gen1","triumph.scrambler-400.gen1","triumph.street-triple-config.765-rs","triumph.speed-triple-config.1200-rr","triumph.tiger-config.900-rally-pro","triumph.tiger-config.1200-gt-explorer","triumph.rocket-config.3-storm-r","triumph.bonneville.t100-865"].forEach(key => assert.ok(flat.some(v => v.key === key), key));
  assert.ok(flat.some(v => v.storedModel === "Tiger Sport 800" && v.yearFrom === 2025));
  assert.notEqual(flat.find(v => v.key === "triumph.rocket.iii-1").storedModel, flat.find(v => v.key === "triumph.rocket.3").storedModel);
  assert.notEqual(flat.find(v => v.key === "triumph.tiger-middle.800-3").storedModel, flat.find(v => v.key === "triumph.tiger-middle.900-1").storedModel);
});

test("suffixes and aliases do not create prohibited duplicates", () => {
  assert.ok(flat.some(v => v.storedModel === "Daytona T595 / 955i"));
  assert.ok(flat.some(v => v.storedModel === "Street Twin / Speed Twin 900"));
  assert.equal(flat.some(v => /Chrome|Newchurch|Gold Line|Stealth|Moto2 race/i.test(v.storedModel)), false);
  const identities = flat.flatMap(v => Array.from({ length: v.yearTo - v.yearFrom + 1 }, (_, i) => `${v.storedModel}|${v.yearFrom + i}`));
  assert.equal(new Set(identities).size, identities.length);
  flat.forEach(v => assert.ok(v.yearFrom >= 1990 && v.yearTo <= 2025 && v.yearFrom <= v.yearTo));
});

test("prior manufacturers, VFR and version boundary remain unchanged", () => {
  const totals = Object.fromEntries(buildReport(catalog).perManufacturer.map(item => [item.id, [item.families, item.variants, item.variantYears]]));
  assert.deepEqual(totals.honda, [50, 180, 728]); assert.deepEqual(totals.yamaha, [60, 177, 905]); assert.deepEqual(totals.suzuki, [54, 146, 881]); assert.deepEqual(totals.kawasaki, [47, 132, 647]); assert.deepEqual(totals.bmw, [29, 135, 653]); assert.deepEqual(totals.ducati, [21, 120, 475]);
  assert.equal(require("../js/app-release.js").currentVersion, "0.2.0");
});
