"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");
const pipeline = require("../js/research/technical-research-pipeline.js");
const standard = require("../research/schema/technical-coverage-standard-v1.js");
const validator = require("../js/technical/technical-profile-validator.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const search = require("../js/technical/technical-profile-search.js");
const vfr = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const synthetic = require("./fixtures/technical-profile-v1.fixture.js");

const sources = { "cite.fixture.oem": { id: "cite.fixture.oem" } };
const entry = (id = "engine.displacement", amount = 500) => ({ id, type: "specification", categoryId: "engine", label: id, value: { type: "quantity", amount, unit: "cm³" }, status: "verified", sourceIds: ["cite.fixture.oem"] });
const candidate = (overrides = {}) => ({ id: "candidate.fixture.1", manufacturer: "Example", family: "Example 500", generation: "gen1", years: { from: 2020, to: 2022 }, applicability: { regions: ["EU"], abs: false, equipment: [] }, category: "engine.displacement", coverageField: "engine.displacement", proposedEntryId: "engine.displacement", proposedValue: { type: "quantity", amount: 500, unit: "cm³" }, proposedEntry: entry(), conditions: {}, sourceIds: ["cite.fixture.oem"], sourceSection: "Specifications", sourcePage: "1-2", evidenceGrade: "A", researchStatus: "verified-evidence-candidate", notes: null, conflictIds: [], ...overrides });

test("candidate validation preserves research statuses and enforces grade, scope, source and entry identity", () => {
  assert.equal(pipeline.validateCandidates([candidate()], { sources, technicalValidator: validator }).valid, true);
  const invalid = candidate({ evidenceGrade: "E", applicability: { abs: "false" }, proposedEntryId: "Bad ID" });
  const codes = pipeline.validateCandidates([invalid], { sources }).errors.map(item => item.code);
  assert.ok(codes.includes("INVALID_EVIDENCE_GRADE"));
  assert.ok(codes.includes("INVALID_ABS_SCOPE"));
  assert.ok(codes.includes("INVALID_ENTRY_ID"));
  assert.notDeepEqual(pipeline.RESEARCH_STATUSES, validator.ENTRY_STATUSES);
});

test("promotion policy admits only conflict-free grade A candidates with resolvable valid evidence", () => {
  assert.deepEqual(pipeline.isPromotionReady(candidate(), { sources, candidates: [candidate()], technicalValidator: validator }), { ready: true, status: "ready-for-profile-review", blockers: [] });
  assert.ok(pipeline.isPromotionReady(candidate({ evidenceGrade: "B" }), { sources }).blockers.includes("EVIDENCE_POLICY"));
  assert.ok(pipeline.isPromotionReady(candidate({ researchStatus: "applicability-unresolved" }), { sources }).blockers.includes("APPLICABILITY_UNRESOLVED"));
  assert.ok(pipeline.isPromotionReady(candidate({ researchStatus: "researched-no-evidence", proposedEntry: undefined }), { sources }).blockers.includes("RESEARCH_STATUS_NOT_PROMOTABLE"));
});

test("composition inherits only evidence whose scope covers the target and records its owning layer", () => {
  const base = { id: "example.gen1", scope: { years: { from: 2020, to: 2023 } }, evidenceScope: { years: { from: 2020, to: 2022 } }, operations: [{ action: "add", entryId: "engine.displacement", entry: entry() }] };
  const inside = pipeline.composeLayers([base], { year: 2021, region: "EU", abs: false, equipment: [] });
  assert.equal(inside.status, "composed");
  assert.equal(inside.ownership["engine.displacement"].owningLayerId, "example.gen1");
  assert.deepEqual(pipeline.composeLayers([base], { year: 2023, region: "EU", abs: false, equipment: [] }).entries, []);
  assert.deepEqual(pipeline.composeLayers([base], { year: null, region: "EU", abs: false, equipment: [] }).requiredContext, ["year"]);
});

test("narrow explicit replacement and removal are deterministic; implicit replacement is a conflict", () => {
  const base = { id: "base", scope: { years: { from: 2020, to: 2024 } }, evidenceScope: { years: { from: 2020, to: 2024 } }, operations: [{ action: "add", entryId: "engine.displacement", entry: entry() }] };
  const replacement = { id: "year", scope: { years: { from: 2022, to: 2022 } }, evidenceScope: { years: { from: 2022, to: 2022 } }, operations: [{ action: "replace", entryId: "engine.displacement", entry: entry("engine.displacement", 600) }] };
  assert.equal(pipeline.composeLayers([replacement, base], { year: 2022, region: "EU", abs: false, equipment: [] }).entries[0].value.amount, 600);
  const implicit = { ...replacement, operations: [{ action: "add", entryId: "engine.displacement", entry: entry("engine.displacement", 600) }] };
  assert.equal(pipeline.composeLayers([base, implicit], { year: 2022, region: "EU", abs: false, equipment: [] }).status, "conflicting-layers");
  const removal = { ...replacement, operations: [{ action: "remove", entryId: "engine.displacement" }] };
  assert.deepEqual(pipeline.composeLayers([base, removal], { year: 2022, region: "EU", abs: false, equipment: [] }).entries, []);
});

test("equal-specificity overlaps conflict while market, ABS and equipment variants remain explicit", () => {
  const make = (id, scope, amount) => ({ id, scope, evidenceScope: scope, operations: [{ action: "replace", entryId: "engine.displacement", entry: entry("engine.displacement", amount) }] });
  const euA = make("eu-a", { years: { from: 2020, to: 2022 }, regions: ["EU"] }, 500);
  const euB = make("eu-b", { years: { from: 2020, to: 2022 }, regions: ["EU"] }, 600);
  assert.equal(pipeline.composeLayers([euA, euB], { year: 2021, region: "EU", abs: false, equipment: [] }).status, "conflicting-layers");
  const absFalse = make("non-abs", { years: { from: 2020, to: 2022 }, abs: false }, 500);
  const absTrue = make("abs", { years: { from: 2020, to: 2022 }, abs: true }, 501);
  assert.equal(pipeline.composeLayers([absTrue, absFalse], { year: 2021, region: "EU", abs: false, equipment: [] }).entries[0].value.amount, 500);
  assert.deepEqual(pipeline.composeLayers([absTrue, absFalse], { year: 2021, region: "EU", abs: null, equipment: [] }).requiredContext, ["abs"]);
  const touring = make("touring", { years: { from: 2020, to: 2022 }, equipment: ["touring"] }, 502);
  assert.equal(pipeline.composeLayers([touring], { year: 2021, region: "EU", abs: false, equipment: ["touring"] }).entries[0].value.amount, 502);
  assert.equal(pipeline.composeLayers([euB, absFalse], { year: 2021, region: "EU", abs: false, equipment: [] }).status, "conflicting-layers");
});

test("coverage distinguishes verified, candidates, no-evidence, conflicts, ambiguity and conditional N/A", () => {
  const localStandard = { fields: [
    { id: "engine.displacement", category: "engine", importance: "required", productionEntryId: "engine.displacement" },
    { id: "final-drive.chain-spec", category: "final-drive", importance: "conditional", appliesWhen: "chain-drive" },
    { id: "brakes.pads", category: "brakes", importance: "required" }, { id: "electrical.charging-diagnostics", category: "electrical", importance: "required" }
  ] };
  const candidates = [candidate({ id: "candidate.no", coverageField: "brakes.pads", category: "brakes.pads", researchStatus: "researched-no-evidence" }), candidate({ id: "candidate.conflict", coverageField: "electrical.charging-diagnostics", category: "electrical.charging-diagnostics", researchStatus: "conflicting-evidence" })];
  const report = pipeline.analyzeCoverage({ context: { year: 2021, region: "EU", abs: false, equipment: [] }, productionEntries: [entry()], candidates, standard: localStandard, capabilities: ["shaft-drive"] });
  assert.equal(report.counts.verified, 1); assert.equal(report.counts["not-applicable"], 1); assert.equal(report.counts["researched-no-evidence"], 1); assert.equal(report.counts.conflicting, 1); assert.equal(report.totalDesiredFacts, 3);
});

test("coverage standard spans all requested domains and conditional fields", () => {
  assert.equal(standard.schemaVersion, "revlog-technical-coverage/v1");
  const categories = new Set(standard.fields.map(item => item.category));
  ["identity", "engine", "fluids", "fuel", "electrical", "brakes", "final-drive", "wheels", "suspension", "dimensions-mass", "maintenance", "oem-parts", "torques"].forEach(category => assert.ok(categories.has(category)));
  assert.ok(standard.fields.some(item => item.importance === "conditional" && item.appliesWhen === "chain-drive"));
});

test("deduplication requires identical evidence scope, not merely an identical value", () => {
  const same = candidate({ id: "candidate.fixture.2" });
  assert.equal(pipeline.detectDuplicateCandidates([candidate(), same])[0].safeToMerge, true);
  const nextYear = candidate({ id: "candidate.fixture.3", years: { from: 2023, to: 2023 } });
  assert.equal(pipeline.detectDuplicateCandidates([candidate(), nextYear])[0].safeToMerge, false);
});

test("queue and batching are stable across manufacturers, families and generation limits", () => {
  const targets = [
    { manufacturer: "Yamaha", family: "MT", generation: "g2", years: { from: 2022, to: 2023 }, catalogVariantKey: "yamaha.mt.g2", hasProductionGeneration: true },
    { manufacturer: "Honda", family: "CB", generation: "g1", years: { from: 2020, to: 2021 }, catalogVariantKey: "honda.cb.g1", hasProductionGeneration: false },
    { manufacturer: "Honda", family: "CB", generation: "g2", years: { from: 2022, to: 2023 }, catalogVariantKey: "honda.cb.g2", hasProductionGeneration: true }
  ];
  const report = status => ({ fields: [{ category: "brakes", status }], counts: status === "conflicting" ? { conflicting: 1 } : {} });
  const reports = { "yamaha.mt.g2": report("missing"), "honda.cb.g1": report("missing"), "honda.cb.g2": report("conflicting") };
  const first = pipeline.generateResearchQueue(targets, reports);
  assert.deepEqual(first, pipeline.generateResearchQueue(targets.slice().reverse(), reports));
  assert.equal(first[0].reason, "missing-generation");
  assert.equal(pipeline.batchQueue(first, { manufacturer: "Honda", maxGenerations: 1, maxTargets: 5 }).length, 1);
});

test("draft generation is explicitly non-production and contains only ready proposals", () => {
  const ready = candidate(); const blocked = candidate({ id: "candidate.fixture.2", evidenceGrade: "C" });
  const draft = pipeline.generateDraftProposal({ identity: { catalogVariantKey: "example.500.gen1" }, candidates: [ready, blocked], sources, technicalValidator: validator });
  assert.equal(draft.production, false); assert.equal(draft.registered, false); assert.deepEqual(draft.proposals.map(item => item.candidateId), [ready.id]); assert.equal(draft.rejected.length, 1);
});

test("VFR golden fixture remains byte-identical and resolver/search behavior is unchanged", () => {
  const profilePath = path.join(__dirname, "../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
  const beforeFile = fs.readFileSync(profilePath, "utf8"), before = JSON.stringify(vfr);
  const context = { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", year: 2002, region: "EU", abs: false, equipment: [] };
  const resolvedBefore = vfr.entries.map(item => resolver.resolveEntry(item, context));
  const searchBefore = search.search(search.buildSearchIndex(vfr, context), "ładowanie");
  pipeline.analyzeCoverage({ context, productionEntries: vfr.entries, candidates: [], standard: { fields: [] }, capabilities: [] });
  assert.equal(JSON.stringify(vfr), before); assert.equal(fs.readFileSync(profilePath, "utf8"), beforeFile);
  assert.deepEqual(vfr.entries.map(item => resolver.resolveEntry(item, context)), resolvedBefore); assert.deepEqual(search.search(search.buildSearchIndex(vfr, context), "ładowanie"), searchBefore);
});

test("non-VFR synthetic Technical Profile is accepted as a second fixture", () => {
  assert.equal(validator.validate(synthetic).valid, true);
  const report = pipeline.analyzeCoverage({ context: { year: 2020 }, productionEntries: synthetic.entries, candidates: [], standard: { fields: [{ id: synthetic.entries[0].id, productionEntryId: synthetic.entries[0].id, category: "engine", importance: "required" }] }, capabilities: [] });
  assert.equal(report.verifiedCount, 1);
});

test("synthetic scale covers multiple manufacturers, families, generations, ranges and contexts", () => {
  const targets = [];
  for (const manufacturer of ["Honda", "Yamaha", "BMW"]) for (let family = 1; family <= 3; family += 1) for (let generation = 1; generation <= 2; generation += 1) targets.push({ manufacturer, family: `family-${family}`, generation: `gen-${generation}`, years: { from: 2000 + generation, to: 2002 + generation }, catalogVariantKey: `${manufacturer.toLowerCase()}.family-${family}.gen-${generation}`, hasProductionGeneration: generation === 1 });
  const reports = Object.fromEntries(targets.map(item => [item.catalogVariantKey, { fields: [{ category: item.generation === "gen-1" ? "oem-parts" : "brakes", status: "missing" }], counts: {} }]));
  const queue = pipeline.generateResearchQueue(targets, reports);
  assert.equal(queue.length, 18); assert.deepEqual(queue, pipeline.generateResearchQueue(targets, reports)); assert.equal(new Set(queue.map(item => item.manufacturer)).size, 3);
});

test("developer status CLI is deterministic, valid JSON and reports production isolation", () => {
  const command = [path.join(__dirname, "../scripts/technical-research-status.js")];
  const first = childProcess.execFileSync(process.execPath, command, { encoding: "utf8" });
  assert.equal(first, childProcess.execFileSync(process.execPath, command, { encoding: "utf8" }));
  const output = JSON.parse(first); assert.ok(output.catalogueTargets > output.productionProfiles); assert.equal(output.productionProfiles, 1); assert.equal(output.structurallyValidResearchDataset, true);
});

test("research pipeline is not imported by production runtime or browser store", () => {
  const root = path.join(__dirname, "..");
  const production = ["index.html", "data/technical/technical-profile-registry.js", ...fs.readdirSync(path.join(root, "js/technical")).map(name => `js/technical/${name}`)];
  production.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /technical-research-pipeline|technical-coverage-standard-v1/));
});
