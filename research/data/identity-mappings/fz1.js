// NON-PRODUCTION FZ1 identity fixtures. No technical evidence or values.
"use strict";

const { createIdentityMapping } = require("../../factory/identity-mapping.js");

const unknown = () => ({ state: "UNKNOWN", values: [] });
const years = (from, to) => ({ kind: "RANGE", from, to });
const scope = (yearRange, bodyStyles = unknown()) => ({
  schemaVersion: 1,
  model: unknown(),
  generation: unknown(),
  years: yearRange,
  markets: unknown(),
  transmissions: unknown(),
  abs: unknown(),
  equipment: unknown(),
  bodyStyles
});

const fz1Gen1 = createIdentityMapping({
  researchIdentity: { role: "grouping", key: "yamaha.fz1.gen1" },
  runtimeIdentities: [{ catalogVariantKey: "yamaha.fz-fazer.fzs1000", applicability: scope(years(2001, 2005)) }]
});

const fz1Gen2 = createIdentityMapping({
  researchIdentity: { role: "grouping", key: "yamaha.fz1.gen2" },
  runtimeIdentities: [
    { catalogVariantKey: "yamaha.fz1.gen2.n", applicability: scope(years(2006, 2015), { state: "KNOWN", values: ["naked"] }) },
    { catalogVariantKey: "yamaha.fz1.gen2.s", applicability: scope(years(2006, 2015), { state: "KNOWN", values: ["faired"] }) }
  ]
});

module.exports = Object.freeze({ fz1Gen1, fz1Gen2 });
