#!/usr/bin/env node
"use strict";

const dataset = require("../research/data/research-dataset.js");
const generator = require("../js/research/research-report-generator.js");

const deepKeys = ["honda.cbr500r.gen4", "yamaha.mt09.gen3", "yamaha.tenere700.gen1"];
const output = process.argv.includes("--deep-profile-markdown")
  ? generator.renderDeepProfileReadinessReport(dataset, deepKeys)
  : JSON.stringify({ aggregate: generator.buildResearchMetrics(dataset), deepProfiles: generator.buildDeepProfileMetrics(dataset, deepKeys) }, null, 2);
process.stdout.write(`${output}\n`);
