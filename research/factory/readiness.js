// NON-PRODUCTION canonical ADR-012 readiness gate.
"use strict";

const contracts = require("./contracts.js");
const { evaluateApplicability } = require("./applicability.js");

const FEASIBLE_ACCESS = new Set(["ACCESSIBLE-OFFICIAL", "ACCESSIBLE-OFFICIAL-REDIRECT", "ACCESSIBLE-OFFICIAL-HTML"]);

function evaluateReadiness(targetInput, prospectInput) {
  const target = contracts.validateResearchTarget(targetInput);
  const prospect = contracts.validateSourceProspect(prospectInput);
  const applicability = evaluateApplicability(target.scope, prospect.applicability);
  const checks = Object.freeze({
    authorityKnown: prospect.authority.state === "KNOWN",
    documentIdentityKnown: prospect.documentIdentity.state === "KNOWN",
    identifierRelationshipResolved: prospect.publication.relationship !== "RELATIONSHIP-UNRESOLVED",
    documentClassKnown: prospect.documentClass !== "UNKNOWN",
    officialPathKnown: prospect.officialLocations.length > 0,
    modelKnown: applicability.dimensions.model === "MATCH" && applicability.dimensions.generation === "MATCH",
    yearKnown: applicability.dimensions.year === "MATCH",
    marketKnown: applicability.dimensions.market === "MATCH",
    transmissionKnown: applicability.dimensions.transmission === "MATCH",
    absEquipmentSufficient: applicability.dimensions.abs === "MATCH" && applicability.dimensions.equipment === "MATCH",
    accessibilityFeasible: FEASIBLE_ACCESS.has(prospect.accessibility.fullContent),
    notExhausted: prospect.exhaustionState === "ACTIVE",
    tierABIndependent: prospect.sourceTier === "A" || prospect.sourceTier === "B"
  });
  const blockers = Object.freeze([...Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name), ...applicability.reasons].sort());
  const passed = Object.values(checks).every(Boolean) && applicability.overall === "MATCH" && prospect.authenticationState === "AUTHENTICATED";
  let classification;
  if (applicability.overall === "MISMATCH" || prospect.authenticationState === "REJECTED-MISMATCH") classification = "REJECTED-MISMATCH";
  else if (prospect.exhaustionState === "EXHAUSTED" || prospect.exhaustionState === "LOW-MARGINAL-YIELD") classification = "EXHAUSTED / LOW-MARGINAL-YIELD";
  else if (prospect.authenticationState === "REGISTERED-NOT-REAUTHENTICATED") classification = "REGISTERED-NOT-REAUTHENTICATED";
  else if (["ACCESS-BLOCKED-AUTH", "ACCESS-BLOCKED-403", "ACCESS-BROKEN"].includes(prospect.accessibility.fullContent)) classification = "ACCESS-BLOCKED";
  else if (prospect.documentIdentity.state !== "KNOWN" || prospect.authority.state !== "KNOWN" || prospect.publication.relationship === "RELATIONSHIP-UNRESOLVED" || prospect.accessibility.fullContent === "MIRROR-ONLY") classification = "SOURCE-IDENTITY-PARTIAL";
  else if (applicability.overall !== "MATCH") classification = "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL";
  else classification = passed ? "EXECUTION-READY" : "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL";
  return Object.freeze({ passed, rankingEligible: passed, classification, checks, applicability, blockers });
}

module.exports = Object.freeze({ evaluateReadiness });
