#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/catalogue-coverage-queue.js").buildReport();
const output = path.join(__dirname, "../research/reports/catalogue-coverage-queue.json");
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.counts, null, 2));
