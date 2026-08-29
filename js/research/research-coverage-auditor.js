// NON-PRODUCTION RESEARCH TOOLING. Audits candidates against the canonical field checklist.
"use strict";

const standard = require("../../research/schema/research-coverage-standard.js");

const STATUS = Object.freeze(["not-researched", "researched-no-evidence", "partial", "evidence-found", "conflicting"]);

// These lists document fields explicitly reviewed in the cited owner/specification material
// but not represented by a reliable candidate. Everything else with no candidate remains not-researched.
const REVIEWED_NO_EVIDENCE = Object.freeze({
  "honda.cbr500r.gen4": Object.freeze([
    "engine.firing-ignition-details", "engine.service-limits", "lubrication.oil-pressure-service-limits", "lubrication.oil-filter", "lubrication.drain-plug-torque", "lubrication.filter-torque", "lubrication.sealing-washer-oem", "cooling.thermostat", "cooling.fan-switch", "cooling.related-consumables", "fuel_intake.intake-service", "ignition.spark-plug-alternative", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "transmission_clutch.gear-ratios", "transmission_clutch.clutch-type", "transmission_clutch.clutch-fluid", "transmission_clutch.clutch-free-play", "final_drive.chain-wear-limit", "final_drive.axle-alignment", "final_drive.oem-chain-sprocket", "electrical.charging-voltage", "electrical.alternator-output", "electrical.charging-test-values", "electrical.ignition-electrical", "lighting.low-beam", "lighting.high-beam", "lighting.front-position", "lighting.drl", "lighting.dashboard-illumination", "lighting.warning-indicator-lamps", "lighting.other-replaceable-sources", "lighting.source-designation", "lighting.base-socket", "lighting.replaceability", "lighting.oem-part-number", "lighting.model-year-applicability", "lighting.market-applicability", "suspension.front-type", "suspension.rear-type", "suspension.adjustment-ranges", "suspension.fork-oil-specification", "suspension.fork-oil-quantity", "suspension.fork-oil-level", "suspension.fork-service-limits", "suspension.suspension-torques", "suspension.oem-seals", "brakes.disc-thickness", "brakes.disc-service-limit", "brakes.pad-thickness-limit", "brakes.oem-pad-numbers", "brakes.fluid-interval", "brakes.caliper-torque", "brakes.master-cylinder-service", "brakes.abs-differences", "tires_wheels.rim-sizes", "tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque", "tires_wheels.pinch-bolt-torque", "tires_wheels.wheel-fasteners", "steering_chassis.steering-service", "steering_chassis.chassis-fasteners", "dimensions_mass.dry-mass", "maintenance.initial-service", "maintenance.severe-use", "maintenance.market-differences", "oem_parts.oil-filter", "oem_parts.air-filter", "oem_parts.spark-plugs", "oem_parts.front-brake-pads", "oem_parts.rear-brake-pads", "oem_parts.chain", "oem_parts.front-sprocket", "oem_parts.rear-sprocket", "oem_parts.drain-washer", "oem_parts.fork-seals", "oem_parts.wheel-seals-bearings", "oem_parts.coolant-consumables", "oem_parts.scheduled-service-parts", "torques.oil-drain-bolt", "torques.front-axle", "torques.rear-axle", "torques.axle-pinch-bolts", "torques.brake-calipers", "torques.brake-discs", "torques.sprockets", "torques.chain-adjusters", "torques.suspension-fasteners", "torques.steering-fasteners", "torques.routine-service-fasteners", "service_limits.brake-disc", "service_limits.brake-pad", "service_limits.chain", "service_limits.valve-clearance", "service_limits.clutch-adjustment", "service_limits.throttle-free-play", "service_limits.tire", "service_limits.suspension", "service_limits.engine"
  ]),
  "yamaha.mt09.gen3": Object.freeze([
    "engine.firing-ignition-details", "engine.service-limits", "lubrication.capacity-disassembly", "lubrication.oil-pressure-service-limits", "lubrication.oil-filter", "lubrication.drain-plug-torque", "lubrication.filter-torque", "lubrication.sealing-washer-oem", "cooling.thermostat", "cooling.fan-switch", "cooling.related-consumables", "fuel_intake.air-filter", "fuel_intake.intake-service", "ignition.spark-plug-alternative", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "transmission_clutch.gear-ratios", "transmission_clutch.clutch-type", "transmission_clutch.clutch-fluid", "transmission_clutch.clutch-free-play", "final_drive.front-sprocket", "final_drive.rear-sprocket", "final_drive.final-ratio", "final_drive.chain-wear-limit", "final_drive.axle-alignment", "final_drive.oem-chain-sprocket", "electrical.charging-voltage", "electrical.alternator-output", "electrical.charging-test-values", "electrical.ignition-electrical", "lighting.low-beam", "lighting.high-beam", "lighting.front-position", "lighting.rear-tail", "lighting.brake-light", "lighting.front-indicators", "lighting.rear-indicators", "lighting.drl", "lighting.dashboard-illumination", "lighting.warning-indicator-lamps", "lighting.other-replaceable-sources", "lighting.source-designation", "lighting.base-socket", "lighting.replaceability", "lighting.oem-part-number", "lighting.model-year-applicability", "lighting.market-applicability", "suspension.adjustment-ranges", "suspension.fork-oil-specification", "suspension.fork-oil-quantity", "suspension.fork-oil-level", "suspension.fork-service-limits", "suspension.suspension-torques", "suspension.oem-seals", "brakes.disc-thickness", "brakes.disc-service-limit", "brakes.pad-thickness-limit", "brakes.oem-pad-numbers", "brakes.fluid-interval", "brakes.caliper-torque", "brakes.master-cylinder-service", "brakes.abs-differences", "tires_wheels.rim-sizes", "tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque", "tires_wheels.pinch-bolt-torque", "tires_wheels.wheel-fasteners", "steering_chassis.rake", "steering_chassis.trail", "steering_chassis.steering-service", "steering_chassis.chassis-fasteners", "dimensions_mass.length", "dimensions_mass.width", "dimensions_mass.height", "dimensions_mass.ground-clearance", "dimensions_mass.rake-trail", "dimensions_mass.dry-mass", "maintenance.initial-service", "maintenance.severe-use", "maintenance.market-differences", "oem_parts.oil-filter", "oem_parts.air-filter", "oem_parts.spark-plugs", "oem_parts.front-brake-pads", "oem_parts.rear-brake-pads", "oem_parts.chain", "oem_parts.front-sprocket", "oem_parts.rear-sprocket", "oem_parts.drain-washer", "oem_parts.fork-seals", "oem_parts.wheel-seals-bearings", "oem_parts.coolant-consumables", "oem_parts.scheduled-service-parts", "torques.front-axle", "torques.axle-pinch-bolts", "torques.brake-calipers", "torques.brake-discs", "torques.sprockets", "torques.suspension-fasteners", "torques.steering-fasteners", "torques.routine-service-fasteners", "service_limits.brake-disc", "service_limits.brake-pad", "service_limits.chain", "service_limits.valve-clearance", "service_limits.spark-plug-gap", "service_limits.clutch-adjustment", "service_limits.throttle-free-play", "service_limits.tire", "service_limits.suspension", "service_limits.engine"
  ]),
  "yamaha.tenere700.gen1": Object.freeze([
    "engine.firing-ignition-details", "engine.service-limits", "lubrication.capacity-disassembly", "lubrication.oil-pressure-service-limits", "lubrication.oil-filter", "lubrication.drain-plug-torque", "lubrication.filter-torque", "lubrication.sealing-washer-oem", "cooling.thermostat", "cooling.fan-switch", "cooling.related-consumables", "fuel_intake.air-filter", "fuel_intake.intake-service", "ignition.spark-plug-alternative", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "transmission_clutch.gear-ratios", "transmission_clutch.clutch-type", "transmission_clutch.clutch-fluid", "transmission_clutch.clutch-free-play", "final_drive.front-sprocket", "final_drive.rear-sprocket", "final_drive.final-ratio", "final_drive.chain-wear-limit", "final_drive.axle-alignment", "final_drive.oem-chain-sprocket", "electrical.charging-voltage", "electrical.alternator-output", "electrical.charging-test-values", "electrical.ignition-electrical", "lighting.low-beam", "lighting.high-beam", "lighting.front-position", "lighting.rear-tail", "lighting.brake-light", "lighting.front-indicators", "lighting.rear-indicators", "lighting.drl", "lighting.dashboard-illumination", "lighting.warning-indicator-lamps", "lighting.other-replaceable-sources", "lighting.source-designation", "lighting.base-socket", "lighting.replaceability", "lighting.oem-part-number", "lighting.model-year-applicability", "lighting.market-applicability", "suspension.adjustment-ranges", "suspension.fork-oil-specification", "suspension.fork-oil-quantity", "suspension.fork-oil-level", "suspension.fork-service-limits", "suspension.suspension-torques", "suspension.oem-seals", "brakes.disc-thickness", "brakes.disc-service-limit", "brakes.pad-thickness-limit", "brakes.oem-pad-numbers", "brakes.fluid-interval", "brakes.caliper-torque", "brakes.master-cylinder-service", "brakes.abs-differences", "tires_wheels.rim-sizes", "tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque", "tires_wheels.pinch-bolt-torque", "tires_wheels.wheel-fasteners", "steering_chassis.rake", "steering_chassis.trail", "steering_chassis.steering-service", "steering_chassis.chassis-fasteners", "dimensions_mass.length", "dimensions_mass.width", "dimensions_mass.height", "dimensions_mass.ground-clearance", "dimensions_mass.rake-trail", "dimensions_mass.dry-mass", "maintenance.initial-service", "maintenance.severe-use", "maintenance.market-differences", "oem_parts.oil-filter", "oem_parts.air-filter", "oem_parts.spark-plugs", "oem_parts.front-brake-pads", "oem_parts.rear-brake-pads", "oem_parts.chain", "oem_parts.front-sprocket", "oem_parts.rear-sprocket", "oem_parts.drain-washer", "oem_parts.fork-seals", "oem_parts.wheel-seals-bearings", "oem_parts.coolant-consumables", "oem_parts.scheduled-service-parts", "torques.front-axle", "torques.axle-pinch-bolts", "torques.brake-calipers", "torques.brake-discs", "torques.sprockets", "torques.suspension-fasteners", "torques.steering-fasteners", "torques.routine-service-fasteners", "service_limits.brake-disc", "service_limits.brake-pad", "service_limits.chain", "service_limits.valve-clearance", "service_limits.spark-plug-gap", "service_limits.clutch-adjustment", "service_limits.throttle-free-play", "service_limits.tire", "service_limits.suspension", "service_limits.engine"
  ])
});

function auditProfile(dataset, key) {
  const candidates = dataset.candidates.filter(candidate => candidate.proposedCatalogVariantKey === key);
  const catalog = dataset.catalog.find(record => record.proposedCatalogVariantKey === key);
  const byField = new Map();
  candidates.forEach(candidate => {
    const canonical = standard.FIELD_ALIASES[candidate.technicalField] || candidate.technicalField;
    if (!byField.has(canonical)) byField.set(canonical, []);
    byField.get(canonical).push(candidate);
  });
  const reviewed = new Set(REVIEWED_NO_EVIDENCE[key] || []);
  const categories = {};
  Object.entries(standard.CATEGORIES).forEach(([category, fields]) => {
    categories[category] = {};
    fields.forEach(field => {
      const id = `${category}.${field}`;
      const matches = byField.get(id) || [];
      let status = "not-researched";
      if (matches.some(candidate => candidate.status === "conflicting")) status = "conflicting";
      else if (matches.length) status = "evidence-found";
      else if (reviewed.has(id)) status = "researched-no-evidence";
      categories[category][field] = { status, candidateIds: matches.map(candidate => candidate.researchRecordId) };
    });
  });
  if (catalog) {
    const catalogEvidence = {
      manufacturer: catalog.manufacturer,
      model: catalog.commercialName || catalog.family,
      generation: catalog.generation,
      "model-year": catalog.years && catalog.years.from === catalog.years.to ? catalog.years.from : null
    };
    Object.entries(catalogEvidence).forEach(([field, value]) => {
      if (value !== null && value !== undefined) categories.identity[field] = { status: "evidence-found", candidateIds: [catalog.researchRecordId] };
    });
  }
  const all = Object.values(categories).flatMap(fields => Object.values(fields));
  const counts = Object.fromEntries(STATUS.map(status => [status, all.filter(item => item.status === status).length]));
  Object.entries(categories).forEach(([category, fields]) => {
    const statuses = Object.values(fields).map(item => item.status);
    const hasEvidence = statuses.some(status => status === "evidence-found" || status === "conflicting");
    const hasMissing = statuses.some(status => status === "not-researched");
    const hasNoEvidence = statuses.some(status => status === "researched-no-evidence");
    categories[category]._status = { status: hasMissing && (hasEvidence || hasNoEvidence) ? "partial" : hasEvidence ? "evidence-found" : hasNoEvidence ? "researched-no-evidence" : "not-researched" };
  });
  return { profileKey: key, fieldCount: all.length, counts, categories };
}

function auditProfiles(dataset, keys) { return Object.fromEntries(keys.map(key => [key, auditProfile(dataset, key)])); }

function sourceClassForField(fieldId) {
  if (fieldId.startsWith("lighting.")) return "owner-manual follow-up";
  if (fieldId.startsWith("maintenance.")) return "owner-manual follow-up";
  if (fieldId.startsWith("oem_parts.")) return "OEM parts catalogue";
  if (fieldId.startsWith("identity.region") || fieldId.startsWith("identity.abs") || fieldId.startsWith("identity.equipment") || fieldId.startsWith("identity.emissions")) return "applicability/market research";
  if (fieldId.startsWith("service_limits.") || fieldId.startsWith("torques.") || fieldId.startsWith("suspension.") || fieldId.startsWith("brakes.")) return "service/workshop manual";
  if (fieldId.startsWith("dimensions_mass.") || fieldId.startsWith("steering_chassis.")) return "official specification/homologation source";
  return "service/workshop manual";
}

function renderOwnerManualExhaustionReport(dataset, keys) {
  const audits = auditProfiles(dataset, keys);
  const lines = ["# Owner-manual evidence exhaustion audit", "", "> **NON-PRODUCTION RESEARCH DATA. This report distinguishes inspected evidence from unresolved fields.**", "", "The audit revisits all 183 canonical fields for each profile. Owner manuals are not treated as substitutes for workshop manuals or parts catalogues.", ""];
  keys.forEach(key => {
    const audit = audits[key];
    lines.push(`## ${key}`, "", `Fields audited: ${audit.fieldCount}`, `Evidence summary: evidence-found=${audit.counts["evidence-found"]}, researched-no-evidence=${audit.counts["researched-no-evidence"]}, not-researched=${audit.counts["not-researched"]}, conflicting=${audit.counts.conflicting}`, "");
    const grouped = {};
    Object.entries(audit.categories).forEach(([category, fields]) => Object.entries(fields).forEach(([field, item]) => {
      if (field === "_status" || item.status !== "not-researched") return;
      const id = `${category}.${field}`;
      const cls = sourceClassForField(id);
      (grouped[cls] ||= []).push(id);
    }));
    Object.keys(grouped).sort().forEach(cls => { lines.push(`### Remaining not-researched fields — ${cls}`, ""); grouped[cls].sort().forEach(id => lines.push("- `" + id + "`")); lines.push(""); });
    lines.push("### Lighting", "", "Lighting is audited per function; one headlight or LED candidate does not close low/high beam, socket or replaceability fields.", "");
    Object.entries(audit.categories.lighting).filter(([field]) => field !== "_status").forEach(([field, item]) => lines.push("- `" + field + "`: **" + item.status + "**"));
    lines.push("", "### Maintenance", "", "Periodic schedule rows are represented by action-specific candidates. `maintenance.schedule-mileage-intervals` records the set of action-specific mileage intervals; it is not a single scalar. Time intervals and initial service remain separate fields.", "");
  });
  return lines.join("\n");
}

function renderFieldGapReport(dataset, keys) {
  const audits = auditProfiles(dataset, keys);
  const lines = ["# Deep profile field-level coverage audit", "", "> **NON-PRODUCTION RESEARCH DATA. Missing evidence is not a production claim.**", ""];
  keys.forEach(key => {
    const audit = audits[key];
    lines.push(`## ${key}`, "", `Field status counts: ${Object.entries(audit.counts).map(([status, count]) => `${status}=${count}`).join(", ")}`, "");
    Object.entries(audit.categories).forEach(([category, fields]) => {
      lines.push(`### ${category} — ${fields._status.status}`, "");
      Object.entries(fields).filter(([field]) => field !== "_status").forEach(([field, item]) => lines.push("- `" + field + "`: **" + item.status + "**" + (item.candidateIds.length ? " (" + item.candidateIds.join(", ") + ")" : "")));
      lines.push("");
    });
  });
  return lines.join("\n");
}

module.exports = Object.freeze({ STATUS, REVIEWED_NO_EVIDENCE, auditProfile, auditProfiles, renderFieldGapReport, sourceClassForField, renderOwnerManualExhaustionReport });
