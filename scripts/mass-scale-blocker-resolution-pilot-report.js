#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/mass-scale-blocker-resolution-pilot.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-blocker-resolution-pilot.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ after: report.afterStates, ready: report.newlyExecutionReady }, null, 2));
