#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/mass-scale-bmw-c600-schema-conversion.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-bmw-c600-schema-conversion.json"), output);
process.stdout.write(output);
