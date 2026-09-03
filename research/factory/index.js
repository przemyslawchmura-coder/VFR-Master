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
const executionContracts = require("./execution-contracts.js");
const acquisitionAdapters = require("./source-acquisition-adapters.js");
const executionAgent = require("./execution-agent.js");
const extractionContracts = require("./extraction-contracts.js");
const extractionAdapters = require("./extraction-adapters.js");
const extractionAgent = require("./extraction-agent.js");
const reviewQueueContracts = require("./review-queue-contracts.js");
const reviewQueue = require("./review-queue.js");
const reviewDecisionContracts = require("./review-decision-contracts.js");
const reviewDecisions = require("./review-decisions.js");
const evidenceProcessingContracts = require("./evidence-processing-contracts.js");
const evidenceProcessing = require("./evidence-processing.js");
const promotionContracts = require("./promotion-contracts.js");
const promotionReadiness = require("./promotion-readiness.js");
const promotionReviewContracts = require("./promotion-review-contracts.js");
const promotionReview = require("./promotion-review.js");
const promotionReviewDecisionContracts = require("./promotion-review-decision-contracts.js");

module.exports = Object.freeze({ ...contracts, ...orchestratorContracts, ...plannerContracts, ...executionContracts, ...extractionContracts, ...reviewQueueContracts, ...reviewDecisionContracts, ...evidenceProcessingContracts, ...promotionContracts, ...promotionReviewContracts, ...promotionReviewDecisionContracts, ...applicability, ...readiness, ...gapPlan, ...reducer, ...checkpoint, ...orchestrator, ...planner, ...executionAgent, ...extractionAgent, ...reviewQueue, ...reviewDecisions, ...evidenceProcessing, ...promotionReadiness, ...promotionReview, adapters, acquisitionAdapters, extractionAdapters, ids, events, orchestrationJson, plannerPriority: priority });
