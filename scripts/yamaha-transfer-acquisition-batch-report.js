#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const results = require("../research/data/yamaha-transfer-acquisition-batch-results.js").runBatch();
const output = `${JSON.stringify(results, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "..", "research/reports/yamaha-transfer-acquisition-batch.json"), output);
else process.stdout.write(output);
