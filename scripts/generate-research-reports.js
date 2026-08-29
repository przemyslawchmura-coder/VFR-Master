#!/usr/bin/env node
"use strict";

const dataset = require("../research/data/research-dataset.js");
const { buildResearchMetrics } = require("../js/research/research-report-generator.js");

process.stdout.write(`${JSON.stringify(buildResearchMetrics(dataset), null, 2)}\n`);
