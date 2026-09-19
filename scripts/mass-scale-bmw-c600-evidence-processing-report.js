"use strict";

const fs = require("node:fs");
const processing = require("../research/data/mass-scale-bmw-c600-evidence-processing.js");

fs.writeFileSync("research/reports/mass-scale-bmw-c600-evidence-processing.json", `${JSON.stringify(processing.buildReport(), null, 2)}\n`);
