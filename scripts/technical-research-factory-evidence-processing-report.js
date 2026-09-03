"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/technical-research-factory-evidence-processing.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
process.stdout.write(output);
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/technical-research-factory-evidence-processing.json"), output);
