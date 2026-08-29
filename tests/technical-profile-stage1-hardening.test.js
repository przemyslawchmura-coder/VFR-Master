"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const profile = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const validator = require("../js/technical/technical-profile-validator.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const formatter = require("../js/technical/technical-value-formatter.js");
const search = require("../js/technical/technical-profile-search.js");
const quality = require("../js/technical/technical-profile-quality-report.js");
const uiApi = require("../js/technical/technical-profile-ui.js");
const readinessApi = require("../js/technical/technical-profile-readiness.js");
const storeApi = require("../js/technical/technical-profile-browser-store.js");

const ROOT = path.resolve(__dirname, "..");
const MOTORCYCLE = { id: "hardening-bike", catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", year: 2002 };
const CONTEXT = { catalogVariantKey: MOTORCYCLE.catalogVariantKey, year: 2002, region: null, abs: null, equipment: null };
const KNOWN_CONTEXT = { ...CONTEXT, region: "EU", abs: false, equipment: [] };
const clone = value => JSON.parse(JSON.stringify(value));

test("stale asynchronous render cannot overwrite the current container", async () => {
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  const localUi = uiApi.createTechnicalProfileUi({ readiness: { async getTechnicalProfileReadiness() { await waiting; return { status: "not-found" }; } } });
  const container = { innerHTML: "current motorcycle B", querySelector() { return null; } };
  const pending = localUi.renderTechnicalProfile(container, MOTORCYCLE, { shouldCommit: () => false });
  release();
  const result = await pending;
  assert.equal(result.stale, true);
  assert.equal(container.innerHTML, "current motorcycle B");
});

test("readiness includeProfile preserves semantics and performs one bridge call", async () => {
  let calls = 0;
  const opened = { status: "loaded", discovery: { status: "found" }, descriptor: { profileId: profile.profile.id }, profile, validation: validator.validate(profile), applicability: { status: "profile-applicable" }, technicalContext: CONTEXT };
  const service = readinessApi.createReadinessService({
    contextAdapter: { buildTechnicalContext() { return { status: "ready", context: CONTEXT }; } },
    bridge: { async openProfileForMotorcycle() { calls += 1; return opened; } }
  });
  const light = await service.getTechnicalProfileReadiness(MOTORCYCLE);
  const included = await service.getTechnicalProfileReadiness(MOTORCYCLE, { includeProfile: true });
  assert.equal(light.status, included.status);
  assert.equal(light.profile, undefined);
  assert.equal(included.profile.profile.id, profile.profile.id);
  assert.deepEqual(included.technicalContext, CONTEXT);
  assert.equal(calls, 2, "exactly one bridge/open operation per readiness invocation");
});

test("browser store rejects whitespace IDs, custom prototypes, unsafe keys and uncloneable data", () => {
  const store = storeApi.createProfileStore();
  const whitespace = clone(profile); whitespace.profile.id = ` ${profile.profile.id} `;
  const custom = clone(profile); Object.setPrototypeOf(custom, { injected: true });
  const unsafe = clone(profile); unsafe.metadata = JSON.parse('{"__proto__":{"polluted":true}}');
  const uncloneable = clone(profile); uncloneable.metadata = { value: 1n };
  for (const item of [whitespace, custom, unsafe, uncloneable]) assert.equal(store.registerProfile(item).status, "invalid-profile");
  assert.equal({}.polluted, undefined);
});

test("browser store isolates mutations before registration and after retrieval", () => {
  const store = storeApi.createProfileStore();
  const input = clone(profile);
  assert.equal(store.registerProfile(input).status, "registered");
  input.profile.revision = 999;
  const fetched = store.getProfile(profile.profile.id);
  fetched.profile.revision = 777;
  assert.equal(store.getProfile(profile.profile.id).profile.revision, 1);
});

test("full VFR profile validates and source/citation graph has no dangling references", () => {
  const result = validator.validate(profile);
  assert.equal(result.valid, true);
  const citationIds = new Set(Object.keys(profile.citations));
  const documentIds = new Set(Object.keys(profile.documents));
  const allSourceIds = profile.entries.flatMap(entry => [ ...(entry.sourceIds || []), ...(entry.variants || []).flatMap(variant => variant.sourceIds || []) ]);
  assert.ok(allSourceIds.every(id => citationIds.has(id)));
  assert.ok(Object.values(profile.citations).every(citation => documentIds.has(citation.documentId) && citation.section && (!citation.pages || citation.pages.every(page => (Number.isInteger(page) && page > 0) || (typeof page === "string" && page.trim())))));
  assert.ok(Object.values(profile.documents).every(document => document.title.trim()));
});

test("quality report exactly matches the 99-entry production profile", () => {
  const report = quality.buildQualityReport(profile, validator.validate(profile));
  assert.deepEqual({ total: report.totalEntries, verified: report.verified, pending: report.pendingVerification, conflicting: report.conflictingSources, legacy: report.legacyUnverified }, { total: 99, verified: 94, pending: 5, conflicting: 0, legacy: 0 });
  assert.deepEqual(report.unresolvedReferences, { sourceIds: [], relatedEntryIds: [], categoryIds: [] });
});

test("formatter handles every resolved VFR value without invalid output", () => {
  for (const entry of profile.entries) {
    const result = resolver.resolveEntry(entry, KNOWN_CONTEXT);
    if (result.status !== "resolved" || !result.entry.value) continue;
    const output = formatter.formatValue(result.entry.value, { locale: "pl-PL" });
    assert.ok(output.length > 0, entry.id);
    assert.doesNotMatch(output, /\[object Object\]|undefined|NaN/, entry.id);
  }
});

test("full production view contains all 99 unique entries with deterministic grouping", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const entries = view.categories.flatMap(category => category.entries);
  assert.equal(entries.length, 99);
  assert.equal(new Set(entries.map(entry => entry.id)).size, 99);
  assert.ok(entries.every(entry => entry.statusLabel && profile.categories.some(category => category.id === entry.categoryId)));
  assert.deepEqual(view.categories.map(category => category.id), profile.categories.slice().sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.label.localeCompare(b.label, "pl") || a.id.localeCompare(b.id)).map(category => category.id));
});

test("ambiguous regional and ABS values never leak candidate values to UI or search", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const headlightHtml = uiApi.renderEntryHtml(view.entriesById["lighting.headlight"]);
  assert.doesNotMatch(headlightHtml, /55 W|60\/55 W/);
  const index = search.buildSearchIndex(profile, CONTEXT);
  const headlight = index.items.find(item => item.entryId === "lighting.headlight");
  assert.equal(headlight.resolutionStatus, "ambiguous-context");
  assert.equal(headlight.formattedValue, null);
  const abs = index.items.find(item => item.entryId === "fuses.circuit.abs");
  assert.equal(abs.resolutionStatus, "ambiguous-context");
  assert.equal(abs.formattedValue, null);
});

test("production search sweep is normalized, deterministic and source/status preserving", () => {
  const index = search.buildSearchIndex(profile, KNOWN_CONTEXT);
  const queries = ["korek oleju", "olej", "filtr oleju", "15410-MCJ-505", "ŚWIECA", "  luz   zaworowy  ", "ladowanie"];
  queries.forEach(query => assert.ok(search.search(index, query).length > 0, query));
  assert.deepEqual(search.search(index, "korek oleju"), search.search(index, "korek oleju"));
  assert.deepEqual(search.search(index, ""), []);
  assert.deepEqual(search.search(index, "nonsens-xyz"), []);
  const pgmFi = search.search(index, "PGM-FI").find(item => item.entryId === "fuses.pgm-fi");
  assert.equal(pgmFi.status, "verified");
  assert.ok(search.search(index, "korek oleju")[0].sourceIds.length > 0);
});

test("expanded UI escaping covers every profile-controlled presentation field", () => {
  const payloads = ['<img src=x onerror=alert(1)>', '<svg onload=alert(1)>', '" onmouseover="alert(1)', "A&B<'\""];
  const entry = { id: payloads[0], label: payloads[1], resolutionStatus: "resolved", formattedValue: payloads[2], requiredContext: [], status: "verified", statusLabel: payloads[3], description: payloads[0], sources: [{ id: "x", title: payloads[1], section: payloads[2], subsection: payloads[3], pages: [payloads[0]] }] };
  const html = uiApi.renderEntryHtml(entry);
  assert.doesNotMatch(html, /<img|<svg/i);
  assert.doesNotMatch(html, /data-entry-id="[^"]*"\s+on/i);
  assert.match(html, /&lt;|&quot;|&amp;/);
  const state = uiApi.renderTechnicalProfileHtml({ status: "ready", profileName: payloads[0], profileId: payloads[1], motorcycleYear: payloads[2], resolutionContext: { [payloads[3]]: "unknown" }, categories: [{ id: "x", label: payloads[1], entries: [entry] }] });
  assert.doesNotMatch(state, /<img|<svg/i);
});

test("search and formatter failures produce controlled UI output without stack traces", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const failedSearch = uiApi.renderSearchResultsHtml(view, "olej", { search() { throw new Error("secret stack"); } });
  assert.match(failedSearch, /Nie udało się przeszukać/);
  assert.doesNotMatch(failedSearch, /secret stack|Error:/);
  const localUi = uiApi.createTechnicalProfileUi({ formatter: { formatValue() { throw new Error("broken"); } } });
  const localView = await localUi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(localView.entriesById["torque.engine.oil-drain-bolt"].formattedValue, "Nieprawidłowa wartość");
});

test("Node and browser profile modules expose semantically identical data", () => {
  const context = vm.createContext({ URL, console: { error() {} } });
  const scripts = ["js/technical/technical-profile-browser-store.js", "data/technical/documents/honda/vfr800-2002-documents.js", "data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js"];
  scripts.forEach(file => vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file }));
  const browserProfile = context.RevLogTechnicalProfileBrowserStore.getProfile(profile.profile.id);
  const summary = item => ({ id: item.profile.id, schema: item.schemaVersion, categories: item.categories.map(value => value.id), entries: item.entries.map(value => value.id), documents: Object.keys(item.documents), citations: Object.keys(item.citations), statuses: quality.buildQualityReport(item) });
  assert.deepEqual(clone(summary(browserProfile)), clone(summary(profile)));
});

test("technical UI coordinator keeps legacy back path and generation guard", () => {
  const coordinator = fs.readFileSync(path.join(ROOT, "js/technical-ui.js"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");
  assert.match(coordinator, /technicalRenderGeneration/);
  assert.match(coordinator, /onLegacyFallback:\s*openLegacyTechnicalBase/);
  assert.match(coordinator, /openLegacyTechnicalBase\(\)/);
  assert.match(app, /cancelTechnicalProfileRender/);
});

test("failure matrix maps expected subsystem failures to controlled states", async () => {
  const cases = [
    [null, "empty"],
    ["insufficient-context", "insufficient-context"],
    ["not-found", "not-found"],
    ["ambiguous-profile", "ambiguous-profile"],
    ["load-error", "load-error"],
    ["invalid-profile", "invalid-profile"]
  ];
  for (const [input, expected] of cases) {
    const localUi = input === null ? uiApi : uiApi.createTechnicalProfileUi({ readiness: { async getTechnicalProfileReadiness() { return { status: input }; } } });
    const view = await localUi.prepareTechnicalProfileView(input === null ? null : MOTORCYCLE);
    assert.equal(view.status, expected);
    assert.doesNotMatch(uiApi.renderTechnicalProfileHtml(view), /Error:|\n\s+at\s/);
  }
  assert.deepEqual(await uiApi.renderTechnicalProfile(null, MOTORCYCLE), { status: "missing-container" });
});

test("one render resolves entries once, builds one index, and queries reuse it", async () => {
  let resolutionCalls = 0;
  let indexBuilds = 0;
  let readinessCalls = 0;
  const localUi = uiApi.createTechnicalProfileUi({
    readiness: { async getTechnicalProfileReadiness(motorcycle, options) { readinessCalls += 1; return readinessApi.getTechnicalProfileReadiness(motorcycle, options); } },
    resolver: { ...resolver, resolveEntry(entry, context) { resolutionCalls += 1; return resolver.resolveEntry(entry, context); } },
    search: { ...search, buildSearchIndex(item, context) { indexBuilds += 1; return search.buildSearchIndex(item, context); } }
  });
  const view = await localUi.prepareTechnicalProfileView(MOTORCYCLE);
  uiApi.renderSearchResultsHtml(view, "olej", search);
  uiApi.renderSearchResultsHtml(view, "korek oleju", search);
  assert.deepEqual({ readinessCalls, resolutionCalls, indexBuilds }, { readinessCalls: 1, resolutionCalls: 99, indexBuilds: 1 });
});

test("browser integrity reports an orphan store registration as warning, not fatal", async () => {
  const context = vm.createContext({ URL, console: { error() {} } });
  const scripts = [
    "data/technical/technical-profile-registry.js", "js/technical/technical-profile-browser-store.js",
    "js/technical/technical-profile-units.js", "js/technical/technical-profile-sources.js",
    "js/technical/technical-profile-validator.js", "data/technical/documents/honda/vfr800-2002-documents.js",
    "data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js", "js/technical/technical-profile-registry.js",
    "js/technical/technical-profile-loader.js"
  ];
  scripts.forEach(file => vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file }));
  const orphan = clone(profile); orphan.profile.id = "research.orphan.profile";
  assert.equal(context.RevLogTechnicalProfileBrowserStore.registerProfile(orphan).status, "registered");
  const integrity = await context.RevLogTechnicalProfileLoader.validateRegistryIntegrity();
  assert.equal(integrity.valid, true);
  assert.ok(integrity.warnings.some(warning => warning.code === "ORPHAN_BROWSER_PROFILE" && warning.profileId === orphan.profile.id));
});
