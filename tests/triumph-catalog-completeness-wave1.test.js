"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { loadCatalog, buildReport } = require("../scripts/motorcycle-catalog-report.js");
const catalog = loadCatalog();
const triumph = catalog.find(item => item.id === "triumph");
const flat = triumph.models.flatMap(model => model.variants.map(variant => ({ familyId: model.id, ...variant })));
const hash = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const baselineKeys = ["triumph.street-triple.675-1","triumph.street-triple.675-2","triumph.street-triple.765-1","triumph.street-triple.765-2","triumph.street-triple.765-3","triumph.speed-triple.t300","triumph.speed-triple.955","triumph.speed-triple.1050-1","triumph.speed-triple.1050-2","triumph.speed-triple.1050-3","triumph.speed-triple.1200","triumph.tiger-middle.800-1","triumph.tiger-middle.800-2","triumph.tiger-middle.800-3","triumph.tiger-middle.900-1","triumph.tiger-middle.900-2","triumph.tiger-1200.explorer-1","triumph.tiger-1200.explorer-2","triumph.tiger-1200.1200-1","triumph.tiger-1200.1200-2","triumph.bonneville.790","triumph.bonneville.865","triumph.bonneville.t100","triumph.bonneville.t120","triumph.daytona.675-1","triumph.daytona.675-2","triumph.daytona.675-3","triumph.daytona.660","triumph.trident-tiger-sport.trident-660","triumph.trident-tiger-sport.tiger-sport-660","triumph.trident-tiger-sport.tiger-sport-800","triumph.rocket.iii-1","triumph.rocket.iii-2","triumph.rocket.3","triumph.scrambler.865","triumph.scrambler.900","triumph.scrambler.1200-1","triumph.scrambler.1200-2"].sort();

test("Triumph Wave 1 totals and baseline preservation are deterministic", () => {
  const report = buildReport(catalog);
  assert.ok(triumph.models.length >= 23);
  assert.ok(flat.length >= 85);
  assert.ok(flat.reduce((n, v) => n + v.yearTo - v.yearFrom + 1, 0) >= 480);
  assert.deepEqual({ manufacturers: report.manufacturers, families: report.modelFamilies, variants: report.variants, variantYears: report.variantYears }, { manufacturers: 13, families: 318, variants: 1095, variantYears: 5317 });
  assert.deepEqual(flat.filter(v => baselineKeys.includes(v.key)).map(v => v.key).sort(), baselineKeys);
  const baseline = flat.filter(v => baselineKeys.includes(v.key)).sort((a, b) => a.key.localeCompare(b.key));
  assert.equal(hash(baseline), "902892d6ba55fec4d87e86bf1940b69af174b4a5ba5a29f811566b84252bc537");
});

test("Triumph keys, identities and years are collision-free", () => {
  assert.equal(new Set(flat.map(v => v.key)).size, flat.length);
  const identities = flat.flatMap(v => Array.from({ length: v.yearTo - v.yearFrom + 1 }, (_, i) => `${v.storedModel}|${v.yearFrom + i}`));
  assert.equal(new Set(identities).size, identities.length);
  flat.forEach(v => { assert.ok(v.yearFrom >= 1990 && v.yearTo <= 2025 && v.yearFrom <= v.yearTo); });
});

test("major Triumph families and reused-name generations remain distinct", () => {
  ["trophy", "trident", "sprint", "daytona-classic", "thunderbird", "legend-adventurer", "tt-speed-four", "speedmaster", "bobber", "thruxton", "speed-twin", "tiger-sport", "rocket-config", "tiger-config"].forEach(id => assert.ok(triumph.models.some(m => m.id === id)));
  assert.notEqual(flat.find(v => v.key === "triumph.rocket.iii-1").storedModel, flat.find(v => v.key === "triumph.rocket.3").storedModel);
  assert.notEqual(flat.find(v => v.key === "triumph.tiger-middle.800-3").storedModel, flat.find(v => v.key === "triumph.tiger-middle.900-1").storedModel);
  assert.ok(flat.some(v => v.storedModel === "Daytona T595 / 955i"));
  assert.ok(flat.some(v => v.storedModel === "Street Twin / Speed Twin 900"));
});

test("suffix and special-edition policy excludes cosmetic noise", () => {
  assert.equal(flat.some(v => /Newchurch|Chrome|Gold Line|Stealth|Moto2 race/i.test(v.storedModel)), false);
  assert.ok(flat.some(v => v.storedModel === "Thruxton R"));
  assert.ok(flat.some(v => v.storedModel === "Tiger 900 Rally"));
});

test("previous manufacturers and application version are unchanged", () => {
  const report = buildReport(catalog);
  const totals = Object.fromEntries(report.perManufacturer.map(item => [item.id, [item.families, item.variants, item.variantYears]]));
  assert.deepEqual(totals.honda, [50, 180, 728]);
  assert.deepEqual(totals.yamaha, [60, 177, 905]);
  assert.deepEqual(totals.suzuki, [54, 146, 881]);
  assert.deepEqual(totals.kawasaki, [47, 132, 647]);
  assert.deepEqual(totals.bmw, [29, 135, 653]);
  assert.deepEqual(totals.ducati, [21, 120, 475]);
  assert.equal(require("../js/app-release.js").currentVersion, "0.2.0");
});
