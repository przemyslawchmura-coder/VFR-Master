#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/source-discovery-pilot.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/source-discovery-pilot.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ selection: report.selection.selected, metrics: report.metrics }, null, 2));
