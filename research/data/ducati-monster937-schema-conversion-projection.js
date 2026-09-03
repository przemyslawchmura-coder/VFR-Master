// NON-PRODUCTION Ducati schema-conversion projection. No profile or registry writes.
"use strict";

const factory = require("../factory/index.js");
const decisions = require("./ducati-monster937-promotion-review-decisions.js");
const heldReview = require("./held-promotion-review-projection.js");

const mappings = Object.freeze({
  "ignition.spark-plug-oem": { proposedProduction: { entryId: "ignition.spark-plug.standard", categoryId: "ignition", type: "spark-plug", value: { type: "text", text: "NGK MAR9A-J" }, manufacturer: "NGK", partNumbers: ["MAR9A-J"] }, blockedReasons: [] },
  "lubrication.viscosity": { proposedProduction: { entryId: "lubrication.engine-oil.viscosity", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "SAE 15W-50" } }, blockedReasons: [] },
  "lubrication.api-jaso": { proposedProduction: { entryId: "lubrication.engine-oil.specification", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "API: SN; JASO: MA2" } }, blockedReasons: [] },
  "electrical.battery-specification": { proposedProduction: { entryId: "electrical.battery.specification", categoryId: "electrical", type: "consumable-part", value: { type: "text", text: "YUASA YT 7B-BS DRY, 12 V" } }, blockedReasons: [] },
  "electrical.battery-capacity": { proposedProduction: { entryId: "electrical.battery.capacity", categoryId: "electrical", type: "specification", value: { type: "quantity", amount: 6.5, unit: "Ah" } }, blockedReasons: [] },
  "cooling.capacity": { proposedProduction: { entryId: "cooling.coolant.capacity-engine-radiator", categoryId: "cooling", type: "fluid", value: { type: "quantity", amount: 2.25, unit: "L" } }, blockedReasons: ["COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR"] },
  "brakes.brake-fluid": { proposedProduction: { entryId: "brakes.fluid.specification", categoryId: "brakes", type: "fluid", value: { type: "text", text: "Front/rear brake circuit: DOT 4" } }, blockedReasons: [] }
});

function buildReport() {
  const decisionReport = decisions.buildReport();
  const held = heldReview.buildReport();
  const before = factory.orchestrationJson.canonicalSerialize({ decisionReport, held });
  if (decisionReport.counts.reviewed !== 7 || decisionReport.counts.approvedForConversion !== 7 || decisionReport.counts.remainingDucatiPending !== 20) throw new Error("Schema conversion requires exactly seven approved Ducati decisions and twenty pending packets");
  const packetById = new Map(held.ducati.packets.map(packet => [packet.id, packet]));
  const projections = decisionReport.reviewed.map(item => {
    const packet = packetById.get(item.promotionReviewPacketId);
    const mapping = mappings[item.fieldId];
    if (!packet || !mapping) throw new Error(`Missing exact Ducati conversion mapping for ${item.fieldId}`);
    return factory.projectSchemaConversion({ promotionReviewDecision: item.decision, promotionReviewPacket: packet, proposedProduction: mapping.proposedProduction, blockedReasons: mapping.blockedReasons });
  }).sort((a, b) => a.id.localeCompare(b.id));
  if (factory.orchestrationJson.canonicalSerialize({ decisionReport, held }) !== before) throw new Error("Ducati/BMW upstream state was mutated");
  const count = state => projections.filter(item => item.conversionState === state).length;
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-schema-conversion-projection/v2", date: "2026-09-03", approvedSourceFields: decisions.SCOPE, projections, counts: Object.freeze({ total: projections.length, conversionReady: count("CONVERSION-READY"), conversionBlocked: count("CONVERSION-BLOCKED") }), blockedReasons: Object.freeze(Object.fromEntries([...new Set(projections.flatMap(item => item.blockedReasons))].sort().map(reason => [reason, projections.filter(item => item.blockedReasons.includes(reason)).length]))), batteryLossless: true, coolingCapacityExact: false, productionProfileCreated: false, registryChanged: false, upstreamStateChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The seven explicitly approved Ducati records were mapped against existing production entry conventions without schema conversion. Battery specification and battery capacity are now separate lossless projections using existing v1 type semantics; cooling capacity remains blocked because circuit scope is not proven equivalent to engine-and-radiator scope." }), exactNextTask: "Keep this projection read-only; separately authorize production citation/materialization and conversion only after the cooling mapping is resolved." });
}

module.exports = Object.freeze({ mappings, buildReport });
