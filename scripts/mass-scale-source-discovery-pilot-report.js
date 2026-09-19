#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/mass-scale-source-discovery-pilot.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-source-discovery-pilot.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ targets: report.targetsSelected, routes: report.metrics.officialRoutesFound, after: report.afterDiscoveryStates }, null, 2));
