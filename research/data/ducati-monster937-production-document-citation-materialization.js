// NON-PRODUCTION report for bounded production-compatible source definitions.
"use strict";

const factory = require("../factory/index.js");
const source = require("../../data/technical/documents/ducati/monster937-2021-documents.js");
const conversion = require("./ducati-monster937-production-promotion-authorization.js");
const fields = Object.freeze({
  "ignition.spark-plug-oem": "cite.ducati.monster937-2021.om.spark-plug",
  "lubrication.viscosity": "cite.ducati.monster937-2021.om.oil-viscosity",
  "lubrication.api-jaso": "cite.ducati.monster937-2021.om.oil-api-jaso",
  "electrical.battery-capacity": "cite.ducati.monster937-2021.om.battery-capacity",
  "electrical.battery-specification": "cite.ducati.monster937-2021.om.battery-specification",
  "brakes.brake-fluid": "cite.ducati.monster937-2021.om.brake-fluid"
});

function buildReport() {
  const authorization = conversion.buildReport();
  const report = { schemaVersion: "revlog-ducati-monster937-production-document-citation-materialization/v1", date: "2026-09-03", documentCount: Object.keys(source.documents).length, documentId: source.documentId, citationCount: Object.keys(source.citations).length, coveredFields: Object.keys(fields).sort(), citations: Object.entries(fields).map(([researchField, citationId]) => ({ researchField, citationId, documentId: source.citations[citationId].documentId, section: source.citations[citationId].section, pages: source.citations[citationId].pages })).sort((a, b) => a.citationId.localeCompare(b.citationId)), authorizationReadyConsumed: authorization.authorizations.length, coolingExcluded: true, pendingDucatiExcluded: 20, bmwInvolvement: false, productionProfileCreated: false, registryChanged: false, evidenceChanged: false, coverageChanged: false, upstreamStateChanged: false };
  return factory.orchestrationJson.immutableClone(report);
}

module.exports = Object.freeze({ fields, buildReport });
