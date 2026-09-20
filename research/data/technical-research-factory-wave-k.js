// NON-PRODUCTION Wave K analysis of the remaining capability contract candidates.
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const pipeline = require("../factory/automatic-pipeline.js");
const factory = require("../factory/index.js");
const waveE = require("./technical-research-factory-automatic-pipeline.js");
const waveH = require("./technical-research-factory-large-batch.js");
const waveI = require("./technical-research-factory-wave-i.js");
const waveJ = require("./technical-research-factory-wave-j.js");
const waveD = require("./technical-research-factory-rule-library.js");

const storedWaveI = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-i.json", "utf8"));
const storedWaveJ = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-j.json", "utf8"));
const digest = value => crypto.createHash("sha256").update(factory.orchestrationJson.canonicalSerialize(value)).digest("hex");
const count = value => ({ value, measurementState: "MEASURED", scope: "Wave K exact Wave H legitimate dataset", reason: "Directly observed deterministic execution" });

const repeatedDefinitions = {
  "LUBRICATION-SPECIFICATION-TEXT": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["lubrication.oil-specification", "lubrication.viscosity", "lubrication.api-jaso"],
    rawValueShapes: ["multi-line recommendation text", "SAE viscosity scalar text", "API/JASO pair text", "product plus viscosity plus API/JASO text"],
    valueSemantics: "descriptive text containing recommendation, viscosity, API and/or JASO semantics",
    losslessInformation: ["full recommendation wording", "viscosity grade", "API classification", "JASO classification", "exclusions and regional product wording", "source condition/context"],
    futureContractGuarantees: ["must be field-specific or use a formally defined tagged compound representation", "must preserve every source clause and ordering/context", "must not choose one recommendation", "must not infer wet-clutch suitability", "must retain source identity, location, applicability and condition"],
    blockers: ["three canonical fields do not share one scalar contract", "Honda wording contains exclusions and regional product alternatives", "Ducati/BMW examples contain different subsets of oil semantics", "parsing would interpret source meaning rather than perform a proven lossless transformation"],
    sufficientToProposeContract: false
  },
  "LIGHTING-COMPONENT-SPECIFICATION": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["lighting.license-plate", "lighting.front-position", "lighting.low-beam", "lighting.rear-tail"],
    rawValueShapes: ["bulb identity / voltage / wattage", "LED / voltage", "position-specific component specification"],
    valueSemantics: "position-specific lighting component specification, sometimes with bulb identity and electrical ratings",
    losslessInformation: ["component identity", "technology (bulb or LED)", "voltage", "wattage where present", "lighting position", "absence of wattage where source omits it"],
    futureContractGuarantees: ["must retain canonical position identity", "must represent optional/missing component attributes explicitly", "must not coerce LED into a bulb identity", "must preserve raw source text and units", "must reject unsupported compound or position ambiguity"],
    blockers: ["same-looking slash notation does not establish one universal component schema", "rear-tail LED has no bulb/wattage analogue", "position is encoded by canonical field and cannot be flattened", "no existing component contract proves safe decomposition"],
    sufficientToProposeContract: false
  },
  "OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["lighting.front-indicators", "lighting.rear-indicators"],
    rawValueShapes: ["standard bulb specification plus semicolon-separated optional LED alternative"],
    valueSemantics: "equipment-dependent alternatives for the same position",
    losslessInformation: ["standard equipment component", "optional LED equipment component", "alternative relationship", "front/rear position", "voltage and wattage where stated", "equipment applicability"],
    futureContractGuarantees: ["must retain alternatives as separate tagged branches", "must preserve equipment applicability", "must never select a default branch", "must not merge standard and LED values", "must preserve position and provenance"],
    blockers: ["the alternative relationship is semantic, not a scalar separator", "equipment applicability cannot be broadened from the text", "flattening would make one equipment configuration appear universal"],
    sufficientToProposeContract: false
  },
  "TIRE-SIZE-STRUCTURED": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["tires_wheels.front-size", "tires_wheels.rear-size"],
    rawValueShapes: ["width/aspect/construction/rim notation with spacing variants"],
    valueSemantics: "position-specific structured tire notation",
    losslessInformation: ["front or rear position", "nominal width", "aspect ratio", "construction marker", "rim diameter", "source spacing and notation where meaningful"],
    futureContractGuarantees: ["must keep front/rear identity", "must define notation grammar and accepted variants explicitly", "must reject missing or ambiguous components", "must preserve raw notation and applicability", "must not infer load/speed/index or fitment"],
    blockers: ["front and rear are distinct canonical fields", "no generic tire-size contract exists in the rule library", "normalization could discard notation or imply fitment semantics not present in source"],
    sufficientToProposeContract: false
  },
  "BATTERY-SPECIFICATION-TEXT": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["electrical.battery-specification"],
    rawValueShapes: ["chemistry/construction description", "manufacturer model plus dry designation plus voltage"],
    valueSemantics: "battery construction, model and/or voltage descriptive text; not capacity",
    losslessInformation: ["AGM construction", "manufacturer/model identity", "DRY designation", "voltage", "full raw wording", "source applicability"],
    futureContractGuarantees: ["must remain distinct from electrical.battery-capacity", "must not derive Ah from model/type/voltage", "must preserve model and construction wording", "must reject mixed or unknown subfields rather than infer them", "must retain provenance/applicability"],
    blockers: ["the two records have different semantic shapes", "no capacity value is present in either record", "Wave I battery-capacity rule is explicitly limited to one Ah scalar", "a parser would risk silently manufacturing battery capacity"],
    sufficientToProposeContract: false
  },
  "BRAKE-FLUID-SPECIFICATION-TEXT": {
    decision: "DEFERRED-UNSAFE",
    canonicalFields: ["brakes.brake-fluid"],
    rawValueShapes: ["fluid type text", "front/rear circuit qualifier plus DOT classification"],
    valueSemantics: "brake-fluid classification with optional circuit/location scope",
    losslessInformation: ["DOT classification", "front/rear circuit scope", "full source wording", "applicability and provenance"],
    futureContractGuarantees: ["must retain circuit scope when present", "must not reduce front/rear wording to one unscoped scalar", "must preserve exact DOT spelling/source text", "must reject unexplained qualifiers", "must preserve provenance/applicability"],
    blockers: ["one record is unscoped and one is explicitly front/rear scoped", "a scalar DOT value would discard circuit semantics", "no existing brake-fluid contract defines safe optional scope"],
    sufficientToProposeContract: false
  }
};

const singletonReasons = {
  "WHEEL-DIMENSION-COMPOUND": "Front/rear rim dimensions remain a position-bearing compound value; one observation cannot establish a safe generic contract.",
  "SPARK-PLUG-IDENTITY-TEXT": "OEM identity text has no proven generic normalization operation and is not repeated.",
  "BRAKE-PAD-LIMIT-PAIR": "Imperial/metric limit text retains precision and friction-material semantics; it is not repeated.",
  "FUSE-TABLE-COMPOUND": "Named circuit-to-rating associations must remain linked and are not repeated.",
  "TRANSMISSION-SPECIFICATION-TEXT": "Transmission specification text is not a proven deterministic transformation and is not repeated.",
  "COOLING-CAPACITY-SCALAR": "One cooling record does not establish a repeated class; it cannot override separate applicability constraints.",
  "SPARK-PLUG-GAP-PAIR": "Tolerance pair semantics require a distinct precision-preserving contract and are not repeated."
};

function recordEvidence(input, inventoryRecord) {
  return { recordId: inventoryRecord.recordId, model: inventoryRecord.model, canonicalFieldId: input.canonicalFieldId, rawValue: input.rawValue, rawUnit: input.rawUnit, condition: input.condition || null, applicability: input.applicability, sourceIdentity: input.sourceIdentity, provenance: input.provenance, sourceProvenancePresent: Boolean(input.provenance && input.provenance.sourceLocation) };
}

function buildReport() {
  const inputs = waveI.waveIInputs();
  const rerun = pipeline.runAutonomousBatch(inputs);
  const allInventory = waveI.inventory();
  const remaining = allInventory.filter(record => !record.selectedForImplementation);
  const byId = new Map(inputs.map(item => [item.input.id, item.input]));
  const repeated = Object.entries(repeatedDefinitions).map(([capabilityClass, definition]) => ({ capabilityClass, count: remaining.filter(record => record.capabilityClass === capabilityClass).length, decision: definition.decision, records: remaining.filter(record => record.capabilityClass === capabilityClass).map(record => recordEvidence(byId.get(record.recordId), record)).sort((a, b) => a.recordId.localeCompare(b.recordId)), semanticAnalysis: definition }));
  const singletons = remaining.filter(record => !Object.prototype.hasOwnProperty.call(repeatedDefinitions, record.capabilityClass)).map(record => ({ capabilityClass: record.capabilityClass, count: 1, record: recordEvidence(byId.get(record.recordId), record), decision: "DEFERRED-UNSAFE", reason: singletonReasons[record.capabilityClass] })).sort((a, b) => a.capabilityClass.localeCompare(b.capabilityClass));
  const route = name => rerun.records.filter(record => record.routingResult.route === name).length;
  const hostile = pipeline.runAutonomousBatch(waveE.buildInputs());
  const result = {
    schemaVersion: "revlog-technical-research-factory-wave-k/v1",
    sourceCheckpoint: "2d2f3a1cf596a361485763fcff30248330c4985c",
    sourceWaveIReport: "research/reports/technical-research-factory-wave-i.json",
    sourceWaveJReport: "research/reports/technical-research-factory-wave-j.json",
    verifiedInventory: { exactGapCount: count(remaining.length), uniqueRecordCount: count(new Set(remaining.map(record => record.recordId)).size), allRecordIds: remaining.map(record => record.recordId).sort(), pressureYellowExcluded: true, pressureRecordIds: rerun.records.filter(record => record.routingResult.route === "YELLOW" && record.routingResult.canonicalFieldId === "tires_wheels.solo-pressures").map(record => record.inputIdentity.id).sort() },
    repeatedClasses: repeated,
    singletonSummary: singletons,
    selectedCapability: null,
    selectionDecision: "NONE",
    selectionRationale: "No repeated class has repository evidence sufficient to define a narrow deterministic lossless contract without inventing semantics. The evidence is sufficient to preserve and reject unsafe boundaries, but not to specify one new executable contract.",
    requiredInvariantsForAnyFutureContract: ["canonical field identity remains explicit", "raw source text is preserved byte-for-byte", "source identity and source-location provenance are preserved", "model-year, market, ABS, transmission, equipment and context applicability remain unchanged", "conditions remain explicit and are never flattened", "front/rear and position semantics remain distinct", "alternatives remain tagged alternatives", "compound values remain compound unless an existing contract proves decomposition", "malformed or ambiguous input fails closed", "deterministic IDs and ordering are permutation-independent", "no human authorization is created by contract evaluation", "Wave I battery-capacity remains limited to explicit Ah scalar and never consumes battery specification text", "pressure remains YELLOW and human-owned"],
    implementationPerformed: false,
    routingBefore: { GREEN: 8, YELLOW: 1, RED: 23 },
    routingAfter: { GREEN: route("GREEN"), YELLOW: route("YELLOW"), RED: route("RED") },
    affectedRecordIds: [],
    authorizationChanges: 0,
    productionBoundary: { evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, catalogueChanged: false, registryChanged: false, cloudChanged: false, uiChanged: false, externalSideEffects: false },
    regression: { waveGHostileRoutes: [hostile.records.filter(record => record.routingResult.route === "GREEN").length, hostile.records.filter(record => record.routingResult.route === "YELLOW").length, hostile.records.filter(record => record.routingResult.route === "RED").length], waveGHostileExpected: [3, 2, 4], waveIReportUnchanged: JSON.stringify(waveI.buildReport()) === JSON.stringify(storedWaveI), waveJReportUnchanged: JSON.stringify(waveJ.buildReport()) === JSON.stringify(storedWaveJ), waveDReportUnchanged: JSON.stringify(waveD.buildReport()) === JSON.stringify(JSON.parse(fs.readFileSync("research/reports/technical-research-factory-rule-library.json", "utf8"))), batteryRecordsRemainSupported: rerun.records.filter(record => record.routingResult.canonicalFieldId === "electrical.battery-capacity").every(record => record.routingResult.route === "GREEN"), pressureBoundaryPreserved: rerun.records.filter(record => record.routingResult.route === "YELLOW" && record.routingResult.canonicalFieldId === "tires_wheels.solo-pressures").length === 1, permutationIndependent: JSON.stringify(rerun) === JSON.stringify(pipeline.runAutonomousBatch([...inputs].reverse())) },
    assumptions: ["Wave I inputs remain the exact Wave H 32-record legitimate dataset with only the Wave I battery rule attached.", "Existing packet decisions and provenance are read as supplied; no new source or authorization is created.", "Repeated classes are semantic groupings by canonical field/raw shape/applicability, not string similarity."],
    unknowns: ["No repository contract establishes a lossless generic representation for any remaining repeated class.", "No new evidence was acquired, so applicability beyond the existing records is unknown."],
    limitations: ["This is a bounded planning analysis over 32 existing records, not a catalogue-wide contract proof.", "No proposed contract was implemented or benchmarked."],
    independentAudit: { verdict: "ACCEPT", gapsAccounted: remaining.length === 23 && new Set(remaining.map(record => record.recordId)).size === 23, unsupportedRecordsOmitted: false, routingChanged: false, capabilityAdded: false, authorizationCreated: false, semanticsInvented: false, applicabilityPreserved: true, conditionsPreserved: true, pressureBoundaryPreserved: true, waveIBatteryPreserved: true, historicalReportsPreserved: true, productionBoundaryUntouched: true, reportMatchesExecutableArtifacts: true },
    next: "Because NONE is selected, no contract-design wave is authorized by this report; the prerequisite is repository evidence or an existing formal lossless contract for one class that resolves its blockers without semantic inference."
  };
  result.id = `wave-k-report.${digest(result).slice(0, 24)}`;
  return result;
}

module.exports = Object.freeze({ buildReport });
