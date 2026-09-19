#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const extraction = require("../research/data/mass-scale-bmw-c600-raw-extraction.js");
extraction.run().then(report => {
  fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-bmw-c600-raw-extraction.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ targetId: report.targetId, rawCandidateCount: report.rawCandidateCount, fields: report.rawCandidates.map(item => item.fieldId) }, null, 2));
}).catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
