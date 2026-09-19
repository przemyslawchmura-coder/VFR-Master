#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/mass-scale-planning-pilot.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-planning-pilot.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ considered: report.selection.targetsConsidered, selected: report.selection.targetsSelected, readiness: report.readinessDistribution, manufacturers: report.selection.diversityManufacturers }, null, 2));
