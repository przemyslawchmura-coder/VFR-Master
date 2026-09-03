"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/bmw-f900r-human-review.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/bmw-f900r-human-review.json"), output);
else process.stdout.write(output);
