#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const acquisition = require("../research/data/mass-scale-bmw-c600-source-acquisition.js");

acquisition.run().then(report => {
  fs.writeFileSync(path.join(__dirname, "../research/reports/mass-scale-bmw-c600-source-acquisition.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ targetId: report.targetId, first: report.firstExecution, repeat: report.repeatExecution }, null, 2));
}).catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
