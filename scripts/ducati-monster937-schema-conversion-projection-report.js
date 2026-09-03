"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-schema-conversion-projection.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/ducati-monster937-schema-conversion-projection.json"), output);
else process.stdout.write(output);
