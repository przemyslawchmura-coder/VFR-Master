// NON-PRODUCTION public entry point for Technical Research Factory Foundation #1.
"use strict";

const contracts = require("./contracts.js");
const applicability = require("./applicability.js");
const readiness = require("./readiness.js");
const gapPlan = require("./gap-plan.js");
const adapters = require("./adapters.js");

module.exports = Object.freeze({ ...contracts, ...applicability, ...readiness, ...gapPlan, adapters });
