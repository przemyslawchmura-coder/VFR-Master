#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadCatalog(filePath = path.join(__dirname, "../data/motorcycle-catalog.js")) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  return JSON.parse(JSON.stringify(context.window.MotorcycleCatalogData));
}

function buildReport(catalog) {
  const perManufacturer = catalog.map(brand => {
    const variants = brand.models.flatMap(model => model.variants);
    return {
      id: brand.id,
      manufacturer: brand.name,
      families: brand.models.length,
      variants: variants.length,
      variantYears: variants.reduce((sum, item) => sum + item.yearTo - item.yearFrom + 1, 0),
      earliestYear: Math.min(...variants.map(item => item.yearFrom)),
      latestYear: Math.max(...variants.map(item => item.yearTo))
    };
  }).sort((left, right) => left.manufacturer.localeCompare(right.manufacturer, "en"));
  return {
    schemaVersion: "revlog-motorcycle-catalog-report/v1",
    manufacturers: catalog.length,
    modelFamilies: perManufacturer.reduce((sum, item) => sum + item.families, 0),
    variants: perManufacturer.reduce((sum, item) => sum + item.variants, 0),
    variantYears: perManufacturer.reduce((sum, item) => sum + item.variantYears, 0),
    earliestYear: Math.min(...perManufacturer.map(item => item.earliestYear)),
    latestYear: Math.max(...perManufacturer.map(item => item.latestYear)),
    perManufacturer
  };
}

if (require.main === module) process.stdout.write(`${JSON.stringify(buildReport(loadCatalog()), null, 2)}\n`);

module.exports = Object.freeze({ loadCatalog, buildReport });
