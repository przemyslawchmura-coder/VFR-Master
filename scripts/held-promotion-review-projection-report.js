"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/held-promotion-review-projection.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/held-promotion-review-projection.json"), output);
else process.stdout.write(output);
