// NON-PRODUCTION deterministic planner priority.
"use strict";

function priorityTuple(candidate, policy) {
  const safety = new Set(candidate.gapPlan.safetyCriticalRemainingFields);
  const practical = new Set(policy.practicalFieldIds);
  return Object.freeze([
    -candidate.addressedFields.filter(field => safety.has(field)).length,
    -candidate.addressedFields.filter(field => practical.has(field)).length,
    policy.sourceClassPriority.indexOf(candidate.prospect.documentClass),
    policy.sourceTierPriority.indexOf(candidate.prospect.sourceTier),
    -candidate.addressedFields.length,
    candidate.maxAttempts,
    `${candidate.target.id}|${candidate.prospect.id}|${candidate.capability.operation}`
  ]);
}

function comparePriority(a, b, policy) {
  const left = priorityTuple(a, policy); const right = priorityTuple(b, policy);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] === right[index]) continue;
    return typeof left[index] === "number" ? left[index] - right[index] : left[index].localeCompare(right[index]);
  }
  return 0;
}

module.exports = Object.freeze({ priorityTuple, comparePriority });
