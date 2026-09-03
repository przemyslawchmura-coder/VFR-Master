"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const BROWSER_SCRIPTS = [
  "data/technical/technical-profile-registry.js",
  "js/technical/technical-profile-browser-store.js",
  "js/technical/technical-profile-units.js",
  "js/technical/technical-profile-sources.js",
  "js/technical/technical-profile-validator.js",
  "js/technical/technical-profile-resolver.js",
  "js/technical/technical-value-formatter.js",
  "js/technical/technical-search-synonyms.js",
  "js/technical/technical-profile-search.js",
  "js/technical/technical-profile-core-matrix.js",
  "js/technical/technical-profile-presentation.js",
  "js/technical/technical-profile-quality-report.js",
  "data/technical/documents/honda/vfr800-2002-documents.js",
  "data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js",
  "data/technical/documents/ducati/monster937-2021-documents.js",
  "data/technical/ducati/monster937/rider-service-core-entries-2021.js",
  "data/technical/ducati/monster937/profile-2021.js",
  "js/technical/technical-profile-registry.js",
  "js/technical/technical-profile-loader.js",
  "js/technical/technical-profile-runtime.js",
  "js/technical/motorcycle-technical-context.js",
  "js/technical/motorcycle-technical-profile-bridge.js",
  "js/technical/technical-profile-readiness.js",
  "js/technical/technical-profile-ui.js"
];
const PROFILE_ID = "honda.vfr800.rc46-vtec-gen1.2002";
const MOTORCYCLE = {
  id: "browser-bike",
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
};
const DUCATI_MOTORCYCLE = {
  id: "browser-ducati-bike",
  brand: "Ducati",
  model: "Monster 937",
  year: 2021,
  catalogVariantKey: "ducati.monster.937"
};

function loadBrowserRuntime() {
  const context = vm.createContext({
    URL,
    console: { error() {}, log() {} }
  });
  for (const relativePath of BROWSER_SCRIPTS) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), "utf8"), context, { filename: relativePath });
  }
  return context;
}

const browser = loadBrowserRuntime();

test("index.html loads the browser runtime in tested dependency order", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const positions = BROWSER_SCRIPTS.map(relativePath => html.indexOf(`src="${relativePath}`));
  assert.ok(positions.every(position => position >= 0));
  assert.match(html, /src="js\/technical\/technical-profile-ui\.js\?v=revlog-polish-1"/);
  assert.deepEqual([...positions].sort((left, right) => left - right), positions);
  assert.ok(positions.at(-1) < html.indexOf('src="js/technical-ui.js'));
});

test("production Technical Profile UI entry point is available in browser runtime", () => {
  assert.equal(typeof browser.RevLogTechnicalProfileUi.renderTechnicalProfile, "function");
});

test("real browser/runtime path renders Ducati labels in Polish", async () => {
  const container = { innerHTML: "", querySelector() { return null; } };
  const view = await browser.RevLogTechnicalProfileUi.renderTechnicalProfile(container, DUCATI_MOTORCYCLE, { shouldCommit: () => true });
  assert.equal(view.profileId, "ducati.monster937.2021");
  assert.equal(view.categories.length, 14);
  for (const label of ["Olej i filtry", "Świece i zapłon", "Hamulce", "Instalacja elektryczna", "Specyfikacja oleju silnikowego", "Lepkość oleju silnikowego", "Zalecana świeca zapłonowa", "Pojemność akumulatora", "Akumulator", "Specyfikacja płynu hamulcowego"]) assert.match(container.innerHTML, new RegExp(label));
  for (const label of ["Lubrication", "Engine oil specification", "Engine oil viscosity", "Ignition", "Spark plug"]) assert.doesNotMatch(container.innerHTML, new RegExp(label));
  for (const value of ["NGK MAR9A-J", "SAE 15W-50", "API: SN; JASO: MA2", "6,5 Ah", "YUASA YT 7B-BS DRY, 12 V", "Obwód hamulca przedni/tylny: DOT 4"]) assert.match(container.innerHTML, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(Object.keys(view.entriesById).length, 113);
});

test("Ducati Rider Service Core presentation keeps structured meanings", async () => {
  const container = { innerHTML: "", querySelector() { return null; } };
  const view = await browser.RevLogTechnicalProfileUi.renderTechnicalProfile(container, DUCATI_MOTORCYCLE, { shouldCommit: () => true });
  assert.equal(view.categories.length, 14);
  assert.match(container.innerHTML, /Kontrola okresowa|Wymiana okresowa|Regulacja okresowa|Smarowanie okresowe/);
  assert.match(container.innerHTML, /Skrzynka bezpieczników/);
  assert.match(container.innerHTML, /LED/);
  assert.match(container.innerHTML, /Rozmiary obręczy/);
  const visibleText = container.innerHTML.replace(/<[^>]*>/g, " ");
  assert.doesNotMatch(visibleText, /engine\.service-limits|dimensions_mass\.|final_drive\.|lighting\./);
  assert.equal(view.entriesById["rider-core.lighting.combined-high-low"].label, "Reflektor — światła mijania i drogowe");
  assert.equal(view.entriesById["rider-core.maintenance.inspect"].label, "Kontrola okresowa");
});

test("browser profile store registers the reference profile", () => {
  assert.equal(browser.RevLogTechnicalProfileBrowserStore.hasProfile(PROFILE_ID), true);
});

test("browser profile store retrieves a profile by profileId", () => {
  assert.equal(browser.RevLogTechnicalProfileBrowserStore.getProfile(PROFILE_ID).profile.id, PROFILE_ID);
});

test("duplicate browser registration does not overwrite the profile", () => {
  const store = browser.RevLogTechnicalProfileBrowserStore.createProfileStore();
  const original = browser.RevLogTechnicalProfileBrowserStore.getProfile(PROFILE_ID);
  assert.equal(store.registerProfile(original).status, "registered");
  const changed = JSON.parse(JSON.stringify(original));
  changed.profile.revision = 999;
  assert.equal(store.registerProfile(changed).status, "duplicate-profile");
  assert.equal(store.getProfile(PROFILE_ID).profile.revision, original.profile.revision);
});

test("invalid browser registration returns an explicit status", () => {
  const result = browser.RevLogTechnicalProfileBrowserStore.createProfileStore().registerProfile({ profile: {} });
  assert.equal(result.status, "invalid-profile");
  assert.ok(result.errors.length >= 1);
});

test("browser loader loads without Node require", async () => {
  assert.equal("require" in browser, false);
  const result = await browser.RevLogTechnicalProfileLoader.loadProfileForContext({
    catalogVariantKey: MOTORCYCLE.catalogVariantKey,
    year: MOTORCYCLE.year
  });
  assert.equal(result.status, "loaded");
});

test("browser discovery is still owned by Technical Profile Registry", () => {
  assert.equal(browser.RevLogTechnicalProfileRegistry.findProfileDescriptor({}).status, "insufficient-context");
});

test("browser registry discovers VFR800 2002", () => {
  const result = browser.RevLogTechnicalProfileRegistry.findProfileDescriptor({
    catalogVariantKey: MOTORCYCLE.catalogVariantKey,
    year: MOTORCYCLE.year
  });
  assert.equal(result.status, "found");
  assert.equal(result.descriptor.profileId, PROFILE_ID);
});

test("browser bridge loads VFR800 2002", async () => {
  const result = await browser.RevLogMotorcycleTechnicalProfileBridge.openProfileForMotorcycle(MOTORCYCLE);
  assert.equal(result.status, "loaded");
  assert.equal(result.profile.profile.id, PROFILE_ID);
});

test("browser-loaded profile passes validator", async () => {
  const result = await browser.RevLogMotorcycleTechnicalProfileBridge.openProfileForMotorcycle(MOTORCYCLE);
  assert.equal(result.validation.valid, true);
  assert.equal(result.validation.errors.length, 0);
});

test("readiness for stored VFR800 2002 is ready", async () => {
  assert.equal((await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness(MOTORCYCLE)).status, "ready");
});

test("readiness reports region as unknown", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness(MOTORCYCLE);
  assert.equal(result.resolutionContext.region, "unknown");
});

test("readiness reports ABS as unknown", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness(MOTORCYCLE);
  assert.equal(result.resolutionContext.abs, "unknown");
});

test("readiness reports equipment as unknown", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness(MOTORCYCLE);
  assert.equal(result.resolutionContext.equipment, "unknown");
});

test("readiness reports missing catalogVariantKey", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness({ ...MOTORCYCLE, catalogVariantKey: null });
  assert.equal(result.status, "insufficient-context");
  assert.ok(result.requiredContext.includes("catalogVariantKey"));
});

test("readiness reports missing year", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness({ ...MOTORCYCLE, year: null });
  assert.equal(result.status, "insufficient-context");
  assert.ok(result.requiredContext.includes("year"));
});

test("readiness reports unsupported motorcycle as not-found", async () => {
  const result = await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness({ ...MOTORCYCLE, catalogVariantKey: "unsupported.model.variant" });
  assert.equal(result.status, "not-found");
});

test("readiness maps ambiguous discovery to ambiguous-profile", async () => {
  const service = browser.RevLogTechnicalProfileReadiness.createReadinessService({
    bridge: { async openProfileForMotorcycle() { return { status: "ambiguous", matchingProfileIds: ["one", "two"] }; } }
  });
  const result = await service.getTechnicalProfileReadiness(MOTORCYCLE);
  assert.equal(result.status, "ambiguous-profile");
  assert.deepEqual(Array.from(result.matchingProfileIds), ["one", "two"]);
});

test("missing browser profile module becomes load-error", async () => {
  const emptyStore = browser.RevLogTechnicalProfileBrowserStore.createProfileStore();
  const customLoader = browser.RevLogTechnicalProfileLoader.createProfileLoader({
    registry: browser.RevLogTechnicalProfileRegistry,
    loadModule(moduleId, descriptor) {
      const profile = emptyStore.getProfile(descriptor.profileId);
      if (!profile) throw new Error(`Missing local module: ${moduleId}`);
      return profile;
    }
  });
  const customRuntime = browser.RevLogTechnicalProfileRuntime.createTechnicalProfileRuntime({ loader: customLoader });
  const customBridge = browser.RevLogMotorcycleTechnicalProfileBridge.createMotorcycleTechnicalProfileBridge({ runtime: customRuntime });
  const service = browser.RevLogTechnicalProfileReadiness.createReadinessService({ bridge: customBridge });
  assert.equal((await service.getTechnicalProfileReadiness(MOTORCYCLE)).status, "load-error");
});

test("invalid loaded profile becomes invalid-profile", async () => {
  const service = browser.RevLogTechnicalProfileReadiness.createReadinessService({
    bridge: { async openProfileForMotorcycle() { return {
      status: "loaded",
      profile: { profile: { id: "invalid.profile" } },
      validation: { valid: false, errors: [{ code: "TEST" }], warnings: [] },
      discovery: { status: "found" }
    }; } }
  });
  assert.equal((await service.getTechnicalProfileReadiness(MOTORCYCLE)).status, "invalid-profile");
});

test("browser search finds oil drain bolt through loaded profile", async () => {
  const opened = await browser.RevLogMotorcycleTechnicalProfileBridge.openProfileForMotorcycle(MOTORCYCLE);
  const index = browser.RevLogTechnicalProfileSearch.buildSearchIndex(opened.profile, opened.technicalContext);
  assert.equal(browser.RevLogTechnicalProfileSearch.search(index, "korek oleju")[0].entryId, "torque.engine.oil-drain-bolt");
});

test("browser headlight resolution remains ambiguous without region", async () => {
  const result = await browser.RevLogMotorcycleTechnicalProfileBridge.resolveEntryForMotorcycle(MOTORCYCLE, "lighting.headlight");
  assert.equal(result.entryResolution.status, "ambiguous-context");
  assert.ok(result.entryResolution.requiredContext.includes("region"));
});

test("browser ABS resolution remains ambiguous when ABS is null", async () => {
  const result = await browser.RevLogMotorcycleTechnicalProfileBridge.resolveEntryForMotorcycle(MOTORCYCLE, "fuses.circuit.abs");
  assert.equal(result.entryResolution.status, "ambiguous-context");
  assert.ok(result.entryResolution.requiredContext.includes("abs"));
});

test("browser registry-store-profile integrity passes", async () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(await browser.RevLogTechnicalProfileLoader.validateRegistryIntegrity())),
    { valid: true, errors: [], warnings: [] }
  );
});

test("browser store, loader, and readiness are immutable and fail safe", async () => {
  const motorcycle = JSON.parse(JSON.stringify(MOTORCYCLE));
  const motorcycleBefore = JSON.stringify(motorcycle);
  const stored = browser.RevLogTechnicalProfileBrowserStore.getProfile(PROFILE_ID);
  const profileBefore = JSON.stringify(stored);
  stored.profile.revision = 999;
  await browser.RevLogTechnicalProfileReadiness.getTechnicalProfileReadiness(motorcycle);
  assert.equal(JSON.stringify(motorcycle), motorcycleBefore);
  assert.equal(JSON.stringify(browser.RevLogTechnicalProfileBrowserStore.getProfile(PROFILE_ID)), profileBefore);

  const failing = browser.RevLogTechnicalProfileReadiness.createReadinessService({
    bridge: { async openProfileForMotorcycle() { throw new Error("synthetic subsystem failure"); } }
  });
  const failure = await failing.getTechnicalProfileReadiness(motorcycle);
  assert.equal(failure.status, "load-error");
  assert.match(failure.error, /synthetic subsystem failure/);
});
