// NON-PRODUCTION public entry point for the Technical Research Factory foundations.
"use strict";

const contracts = require("./contracts.js");
const orchestratorContracts = require("./orchestrator-contracts.js");
const applicability = require("./applicability.js");
const readiness = require("./readiness.js");
const gapPlan = require("./gap-plan.js");
const adapters = require("./adapters.js");
const ids = require("./ids.js");
const events = require("./events.js");
const reducer = require("./reducer.js");
const checkpoint = require("./checkpoint.js");
const orchestrator = require("./orchestrator.js");
const orchestrationJson = require("./json.js");
const plannerContracts = require("./planner-contracts.js");
const planner = require("./execution-planner.js");
const priority = require("./priority.js");

module.exports = Object.freeze({ ...contracts, ...orchestratorContracts, ...plannerContracts, ...applicability, ...readiness, ...gapPlan, ...reducer, ...checkpoint, ...orchestrator, ...planner, adapters, ids, events, orchestrationJson, plannerPriority: priority });
