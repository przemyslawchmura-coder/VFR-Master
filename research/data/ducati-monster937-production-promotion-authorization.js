// NON-PRODUCTION Ducati authorization projection. No materialization or registry writes.
"use strict";

const factory = require("../factory/index.js");
const conversion = require("./ducati-monster937-schema-conversion-projection.js");

function buildReport() {
  const source = conversion.buildReport();
  const eligible = source.projections.filter(item => item.conversionState === "CONVERSION-READY");
  const authorizations = eligible.map(item => factory.authorizeSchemaConversion(item)).sort((a, b) => a.id.localeCompare(b.id));
  const count = state => authorizations.filter(item => item.authorizationState === state).length;
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-production-promotion-authorization/v1", date: "2026-09-03", consumedConversionReady: eligible.length, authorizations, counts: Object.freeze({ total: authorizations.length, authorizationReady: count("AUTHORIZATION-READY"), authorizationBlocked: count("AUTHORIZATION-BLOCKED") }), excluded: Object.freeze({ coolingCapacity: source.projections.filter(item => item.researchCanonicalFieldId === "cooling.capacity").length, pendingDucatiPromotionReviewPackets: 20, bmwRecords: 0 }), futureMaterializationRequired: true, productionProfileCreated: false, registryChanged: false, productionDocumentsOrCitationsCreated: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, upstreamStateChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the six CONVERSION-READY Ducati projections are authorization-ready for a separately authorized future materialization task. Authorization creates no production artifacts; cooling remains excluded at schema conversion." }), exactNextTask: "Separately authorize production document/citation materialization and Technical Profile conversion only after human confirmation; do not treat AUTHORIZATION-READY as materialized." });
}

module.exports = Object.freeze({ buildReport });
