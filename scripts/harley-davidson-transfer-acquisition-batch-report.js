#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const result = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js").runBatch();
const output = `${JSON.stringify(result, null, 2)}\n`;
if (process.argv.includes("--write")) fs.writeFileSync(path.join(__dirname, "..", "research/reports/harley-davidson-transfer-acquisition-batch.json"), output);
else process.stdout.write(output);
