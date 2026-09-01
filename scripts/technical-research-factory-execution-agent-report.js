"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/technical-research-factory-execution-agent.js").buildReport();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/technical-research-factory-execution-agent.json"), `${JSON.stringify(report, null, 2)}\n`);
