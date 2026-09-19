#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/source-discovery-prospect-foundation.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/source-discovery-prospect-foundation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ states: report.candidates.map(item => item.state), transition: report.transition }, null, 2));
