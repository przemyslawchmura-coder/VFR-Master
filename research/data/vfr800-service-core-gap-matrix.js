// NON-PRODUCTION RESEARCH AUDIT. This matrix is a deterministic recovery boundary.
"use strict";

const data = require("./honda-service-wave1.js");

const target = "honda.vfr800.rc46.vtec.gen1";
const blockedSource = "research.honda.service.vfr800.2002-manual";
const directSource = "research.honda.service.vfr800.2002-service-card";
const directFields = new Set(data.evidence
  .filter(item => item.catalogVariantKey === target && item.proofStatus === "VERIFIED-DIRECT")
  .map(item => item.field));
const blockedFields = new Set(data.evidence
  .filter(item => item.catalogVariantKey === target && item.proofStatus === "SOURCE-IDENTITY-UNCERTAIN")
  .map(item => item.field));

const rows = Object.freeze(data.serviceCore.map(field => {
  if (directFields.has(field)) return Object.freeze({
    catalogVariantKey: target,
    field,
    initialStatus: "VERIFIED",
    finalStatus: "evidence-found",
    evidenceSourceIds: Object.freeze([directSource]),
    proofStatus: "VERIFIED-DIRECT",
    applicability: Object.freeze({ model: "VFR800 (VTEC) RC46", years: "MY2002–2005", region: "EU", abs: null }),
    comparison: "MATCH-NORMALIZED",
    blocker: null
  });
  if (blockedFields.has(field)) return Object.freeze({
    catalogVariantKey: target,
    field,
    initialStatus: "BLOCKED-MANUAL",
    finalStatus: "not-researched",
    evidenceSourceIds: Object.freeze([blockedSource]),
    proofStatus: "SOURCE-IDENTITY-UNCERTAIN",
    applicability: Object.freeze({ model: null, years: null, region: null, abs: null }),
    comparison: "NOT-COMPARABLE",
    blocker: "manual publication identity and field-level applicability unproven"
  });
  return Object.freeze({
    catalogVariantKey: target,
    field,
    initialStatus: "NOT-RESEARCHED",
    finalStatus: "not-researched",
    evidenceSourceIds: Object.freeze([]),
    proofStatus: "NOT-RESEARCHED",
    applicability: Object.freeze({ model: null, years: null, region: null, abs: null }),
    comparison: "NOT-COMPARABLE",
    blocker: "no independent authoritative source acquired"
  });
}));

const counts = Object.freeze(rows.reduce((acc, row) => {
  acc.initial[row.initialStatus] = (acc.initial[row.initialStatus] || 0) + 1;
  acc.final[row.finalStatus] = (acc.final[row.finalStatus] || 0) + 1;
  return acc;
}, { initial: {}, final: {} }));

module.exports = Object.freeze({ target, rows, counts, directFields, blockedFields });
