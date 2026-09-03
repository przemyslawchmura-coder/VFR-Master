"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/post-bmw-triumph-phase5-reassessment.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/post-bmw-triumph-phase5-reassessment.json"), output);
else process.stdout.write(output);
