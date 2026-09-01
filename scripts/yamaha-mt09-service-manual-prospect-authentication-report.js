#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/yamaha-mt09-service-manual-prospect-authentication.js").buildReport();
const output = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "..", "research/reports/yamaha-mt09-service-manual-prospect-authentication.json"), output);
else process.stdout.write(output);
