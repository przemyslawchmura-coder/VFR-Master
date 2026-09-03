"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-rider-service-core-promotion.js").buildReport();
fs.writeFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-promotion.json"), `${JSON.stringify(report, null, 2)}\n`);
