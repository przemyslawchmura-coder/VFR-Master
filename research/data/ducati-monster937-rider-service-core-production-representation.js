// NON-PRODUCTION read-only representability projection for Rider Service Core.
"use strict";

const json = require("../factory/json.js");
const source = require("./ducati-monster937-rider-service-core-promotion-readiness.js");
const records = require("../../data/technical/rider-service-core-records.js");

function buildReport() {
  const readiness = source.buildReport();
  const before = json.canonicalSerialize(readiness);
  const represented = readiness.outcomes.map(outcome => records.validateRecord(outcome.productionRecord)).sort((a, b) => a.id.localeCompare(b.id));
  const byType = type => represented.filter(record => record.recordType === type).length;
  const byDomain = Object.fromEntries([...new Set(readiness.outcomes.map(item => item.riderServiceCoreDomain))].sort().map(domain => [domain, readiness.outcomes.filter(item => item.riderServiceCoreDomain === domain).length]));
  if (json.canonicalSerialize(readiness) !== before) throw new Error("production representation mutated readiness input");
  return Object.freeze({ schemaVersion: "revlog-rider-service-core-production-representation/v1", target: readiness.target, processedInputsInspected: readiness.processedInputsReceived, losslesslyRepresentable: represented.length, stillNotRepresentable: readiness.outcomes.length - represented.length, remainingStructuralBlockers: [], recordTypes: Object.freeze({ scalar: byType("scalar"), structured: byType("structured"), repeating: byType("repeating") }), outputsByDomain: Object.freeze(byDomain), records: represented, excludedNeedsMoreReview: readiness.excludedNeedsMoreReview, coolingCapacity: readiness.coolingCapacity, humanReviewDecisionsChanged: false, evidenceProcessingMeaningChanged: false, productionDucatiChanged: false, productionDucatiEntryCount: 6, vfrChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The generic Rider Service Core production representation validates all 39 processed Ducati inputs without changing production state. Scalar values remain raw/value pairs; structured and repeating records retain source text, explicit action/type and source associations. This establishes representability only, not promotion." }), exactNextTask: "Re-run promotion readiness using the generic representation contract before any separately authorized production materialization." });
}

module.exports = Object.freeze({ buildReport });
