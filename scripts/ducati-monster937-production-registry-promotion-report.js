#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const reportPath = path.join(__dirname, "../research/reports/ducati-monster937-production-registry-promotion.json");
require("../research/data/ducati-monster937-production-registry-promotion.js").buildReport().then(report => { const output = `${JSON.stringify(report, null, 2)}\n`; if (process.argv.includes("--write")) fs.writeFileSync(reportPath, output); process.stdout.write(output); });
