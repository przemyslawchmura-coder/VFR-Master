"use strict";
const report = require("../research/data/ducati-monster937-rider-service-core-evidence-processing.js").buildReport();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
