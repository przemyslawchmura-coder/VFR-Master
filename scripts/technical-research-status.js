#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const dataset = require("../research/data/research-dataset.js");
const registry = require("../data/technical/technical-profile-registry.js");
const validator = require("../js/research/research-data-validator.js");

function loadCatalogue() {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../data/motorcycle-catalog.js"), "utf8"), context);
  return JSON.parse(JSON.stringify(context.window.MotorcycleCatalogData));
}

const catalogue = loadCatalogue();
const catalogueTargets = catalogue.flatMap(brand => brand.models.flatMap(model => model.variants.map(variant => ({ manufacturer: brand.name, family: model.name, generation: variant.name, catalogVariantKey: variant.key, years: { from: variant.yearFrom, to: variant.yearTo } }))));
const profiles = registry.map(descriptor => require(path.join(__dirname, "..", descriptor.moduleId)));
const conflictCount = dataset.candidates.filter(item => item.conflictStatus === "conflicting" || item.status === "conflicting-evidence").length;
const readyCount = dataset.candidates.filter(item => item.status === "ready-for-profile-review").length;
const coveredKeys = new Set(registry.flatMap(item => item.catalogVariantKeys));
const summary = {
  schemaVersion: "revlog-technical-research-status/v1",
  catalogueTargets: catalogueTargets.length,
  productionProfiles: registry.length,
  catalogueGenerationsWithProductionProfiles: catalogueTargets.filter(item => coveredKeys.has(item.catalogVariantKey)).length,
  researchTargets: dataset.catalog.length,
  researchCandidates: dataset.candidates.length,
  structurallyValidResearchDataset: validator.validateResearchDataset(dataset).valid,
  verifiedProductionFacts: profiles.reduce((sum, profile) => sum + profile.entries.filter(entry => entry.status === "verified").length, 0),
  missingProductionGenerations: catalogueTargets.filter(item => !coveredKeys.has(item.catalogVariantKey)).length,
  conflicts: conflictCount,
  readyForReviewCandidates: readyCount
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
