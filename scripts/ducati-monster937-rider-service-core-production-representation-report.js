"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-rider-service-core-production-representation.js").buildReport();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-production-representation.json"), `${JSON.stringify(report, null, 2)}\n`);
