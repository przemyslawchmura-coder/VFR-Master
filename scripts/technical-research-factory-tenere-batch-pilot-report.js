"use strict";
const fs = require("node:fs"); const path = require("node:path");
const output = `${JSON.stringify(require("../research/data/technical-research-factory-tenere-batch-pilot-report.js").buildReport(), null, 2)}\n`;
process.stdout.write(output);
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/technical-research-factory-tenere-batch-pilot.json"), output);
