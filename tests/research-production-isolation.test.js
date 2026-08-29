"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const registryData = require("../data/technical/technical-profile-registry.js");
const vfr = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const search = require("../js/technical/technical-profile-search.js");

const root = path.resolve(__dirname, "..");

test("production index and runtime JavaScript do not load research staging", () => {
  const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /research\/(?:data|motorcycles|technical-data)|research-dataset/));
});

test("production registry contains only the VFR reference profile", () => {
  assert.deepEqual(registryData.map(item => item.profileId), ["honda.vfr800.rc46-vtec-gen1.2002"]);
});

test("research candidates do not alter production VFR search results", () => {
  const context = { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", year: 2002, region: "EU", abs: false, equipment: [] };
  const results = search.search(search.buildSearchIndex(vfr, context), "korek oleju");
  assert.equal(results[0].entryId, "torque.engine.oil-drain-bolt");
  assert.equal(results[0].formattedValue, "30 N·m");
});

test("research tree contains no Supabase, UI, browser registration or production profile calls", () => {
  const files = fs.readdirSync(path.join(root, "research/data"), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath || entry.path, entry.name));
  const content = files.map(file => fs.readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(content, /supabase|registerProfile\s*\(|RevLogTechnicalProfileRegistry|TechnicalDatabase|MotorcycleDatabase/);
});
