// NON-PRODUCTION fail-closed applicability evaluator.
"use strict";

const contracts = require("./contracts.js");

function setResult(target, source) {
  if (target.state === "UNKNOWN" || source.state === "UNKNOWN") return "UNKNOWN";
  if (target.state === "PARTIAL" || source.state === "PARTIAL") return "PARTIAL";
  const targetValues = new Set(target.values.map(value => JSON.stringify(value)));
  const sourceValues = new Set(source.values.map(value => JSON.stringify(value)));
  const matches = [...targetValues].filter(value => sourceValues.has(value)).length;
  if (!matches) return "MISMATCH";
  return matches === targetValues.size ? "MATCH" : "PARTIAL";
}

function yearResult(target, source) {
  if (target.kind === "UNKNOWN" || source.kind === "UNKNOWN") return "UNKNOWN";
  if (source.to < target.from || source.from > target.to) return "MISMATCH";
  if (source.from <= target.from && source.to >= target.to) return "MATCH";
  return "PARTIAL";
}

function evaluateApplicability(targetInput, sourceInput) {
  const target = contracts.validateApplicabilityScope(targetInput);
  const source = contracts.validateApplicabilityScope(sourceInput);
  const dimensions = Object.freeze({
    model: setResult(target.model, source.model),
    generation: setResult(target.generation, source.generation),
    year: yearResult(target.years, source.years),
    market: setResult(target.markets, source.markets),
    transmission: setResult(target.transmissions, source.transmissions),
    abs: setResult(target.abs, source.abs),
    equipment: setResult(target.equipment, source.equipment)
  });
  const values = Object.values(dimensions);
  const overall = values.includes("MISMATCH") ? "MISMATCH" : values.includes("UNKNOWN") ? "UNKNOWN" : values.includes("PARTIAL") ? "PARTIAL" : "MATCH";
  const blockingDimensions = Object.freeze(Object.entries(dimensions).filter(([, value]) => value !== "MATCH").map(([key]) => key));
  return Object.freeze({ overall, dimensions, blockingDimensions, reasons: Object.freeze(blockingDimensions.map(dimension => `${dimension}:${dimensions[dimension]}`)) });
}

module.exports = Object.freeze({ evaluateApplicability });
