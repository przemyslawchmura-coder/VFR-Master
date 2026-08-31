#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/post-yamaha-transfer-batch-design.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "..", "research/reports/post-yamaha-transfer-batch-design.json"), output);
else process.stdout.write(output);
