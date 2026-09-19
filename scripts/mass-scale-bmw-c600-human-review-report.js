"use strict";

const fs = require("node:fs");
const review = require("../research/data/mass-scale-bmw-c600-human-review.js");

fs.writeFileSync("research/reports/mass-scale-bmw-c600-human-review.json", `${JSON.stringify(review.buildReport(), null, 2)}\n`);
