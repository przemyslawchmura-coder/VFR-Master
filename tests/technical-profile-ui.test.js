"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const uiApi = require("../js/technical/technical-profile-ui.js");
const readinessApi = require("../js/technical/technical-profile-readiness.js");
const resolverApi = require("../js/technical/technical-profile-resolver.js");
const formatterApi = require("../js/technical/technical-value-formatter.js");
const searchApi = require("../js/technical/technical-profile-search.js");
const ducatiProfile = require("../data/technical/ducati/monster937/profile-2021.js");
const vfrProfile = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const riderServiceCoreSchema = require("../js/technical/technical-profile-core-matrix.js");

const MOTORCYCLE = Object.freeze({
  id: "bike-ui",
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
});

const DUCATI_MOTORCYCLE = Object.freeze({
  id: "ducati-ui",
  brand: "Ducati",
  model: "Monster 937",
  year: 2021,
  catalogVariantKey: "ducati.monster.937"
});

function stateUi(status) {
  return uiApi.createTechnicalProfileUi({
    readiness: {
      async getTechnicalProfileReadiness() {
        return { status, context: {}, resolutionContext: {} };
      }
    }
  });
}

function findEntry(view, id) {
  return view.entriesById[id];
}

function fakeContainer(selectorMap = {}) {
  return {
    innerHTML: "",
    querySelector(selector) { return selectorMap[selector] || null; }
  };
}

test("missing active motorcycle produces controlled empty state", async () => {
  assert.deepEqual(await uiApi.prepareTechnicalProfileView(null), {
    status: "empty",
    message: "Najpierw wybierz motocykl w garażu."
  });
});

test("ready VFR motorcycle prepares a production profile view", async () => {
  assert.equal((await uiApi.prepareTechnicalProfileView(MOTORCYCLE)).status, "ready");
});

test("profile name and stable ID are exposed to the view", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(view.profileName, "Honda VFR800 VTEC");
  assert.equal(view.profileId, "honda.vfr800.rc46-vtec-gen1.2002");
});

test("Ducati and VFR use the same closed Rider Service Core matrix", async () => {
  const vfr = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const ducati = await uiApi.prepareTechnicalProfileView(DUCATI_MOTORCYCLE);
  assert.deepEqual(vfr.coreMatrix.fieldIds, riderServiceCoreSchema.fieldIds);
  assert.deepEqual(ducati.coreMatrix.fieldIds, riderServiceCoreSchema.fieldIds);
  assert.deepEqual(ducati.coreMatrix.fieldIds, vfr.coreMatrix.fieldIds);
  assert.equal(vfr.coreMatrix.fieldIds.length, 95);
  assert.deepEqual(riderServiceCoreSchema.domains.map(domain => domain.fieldIds.length), [4, 9, 4, 5, 6, 10, 10, 9, 5, 4, 8, 3, 12, 6]);
  assert.equal(riderServiceCoreSchema.fieldIds.includes("chain.size"), false);
  assert.equal(riderServiceCoreSchema.fieldIds.includes("oem.chain"), true);
});

test("Ducati presentation is Polish while values and profile semantics remain unchanged", async () => {
  const before = JSON.stringify(ducatiProfile);
  const view = await uiApi.prepareTechnicalProfileView(DUCATI_MOTORCYCLE);
  assert.equal(view.profileId, "ducati.monster937.2021");
  assert.deepEqual(view.categories.map(category => category.label), ["Dane podstawowe", "Olej i filtry", "Układ chłodzenia", "Świece i zapłon", "Zawory", "Koła i opony", "Napęd końcowy", "Hamulce", "Instalacja elektryczna i akumulator", "Bezpieczniki", "Oświetlenie", "Obsługa okresowa", "Materiały eksploatacyjne", "Praktyczne momenty dokręcania"]);
  assert.equal(view.entriesById["rider-core.oil.viscosity"].label, "Lepkość oleju");
  assert.equal(view.entriesById["rider-core.battery.capacity"].label, "Pojemność akumulatora Ah");
  assert.equal(view.entriesById["rider-core.battery.capacity"].formattedValue, "6,5 Ah");
  assert.equal(view.entriesById["rider-core.brake-fluid.specification"].formattedValue, "Obwód hamulca przedni/tylny: DOT 4");
  assert.equal(JSON.stringify(ducatiProfile), before);
});

test("default visibility is identity-based and keeps practical VFR data", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.ok(view.entriesById["rider-core.engine.displacement"]);
  assert.ok(view.entriesById["rider-core.oil.quantity-filter"]);
  assert.equal(view.entriesById["rider-core.engine.bore"], undefined);
  assert.equal(view.entriesById["rider-core.dimensions_mass.wheelbase"], undefined);
  assert.ok(view.entriesById["rider-core.lighting.headlight"]);
  assert.match(view.entriesById["rider-core.charging.voltage"].formattedValue, /poniżej 15,5 V/);
  assert.equal(uiApi.STATUS_LABELS.verified, "Zweryfikowane");
});

test("verified VFR fuse and rear light records recover into Rider Core cells", async () => {
  const before = JSON.stringify(vfrProfile);
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(view.entriesById["rider-core.fuse.main-rating"].formattedValue, /30 A · 30 A/);
  assert.match(view.entriesById["rider-core.fuse.main-location"].formattedValue, /pod siedzeniem|Pod siedzeniem/);
  assert.match(view.entriesById["rider-core.fuse.table"].formattedValue, /20 A.*PGM-FI/);
  assert.match(view.entriesById["rider-core.lighting.rear-stop"].formattedValue, /12 V 21\/5 W/);
  assert.equal(view.entriesById["rider-core.lighting.headlight"].formattedValue, "Brak danych");
  assert.equal(JSON.stringify(vfrProfile), before);
});

test("categories and their entries are grouped deterministically", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(view.categories[0].id, "basic-motorcycle-data");
  assert.deepEqual(view.categories.flatMap(category => category.entries).map(entry => entry.id), view.coreMatrix.fieldIds.map(fieldId => `rider-core.${fieldId}`));
});

test("resolved oil drain bolt renders 30 N·m", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.oil.drain-plug-torque");
  assert.equal(entry.resolutionStatus, "resolved");
  assert.equal(entry.formattedValue, "30 N·m");
});

test("existing Technical Value Formatter is used", async () => {
  let calls = 0;
  const ui = uiApi.createTechnicalProfileUi({
    formatter: { formatValue(value, options) { calls += 1; return formatterApi.formatValue(value, options); } }
  });
  await ui.prepareTechnicalProfileView(MOTORCYCLE);
  assert.ok(calls > 0);
});

test("search for korek oleju finds the oil drain bolt", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const html = uiApi.renderSearchResultsHtml(view, "korek oleju", searchApi);
  assert.match(html, /rider-core\.oil\.drain-plug-torque/);
  assert.match(html, /30 N·m/);
});

test("empty search returns the category view without crashing", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(uiApi.renderSearchResultsHtml(view, "   ", searchApi), /Dane podstawowe/);
});

test("search with no results renders an explicit message", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(uiApi.renderSearchResultsHtml(view, "zzzz-nie-istnieje", searchApi), /Brak wyników wyszukiwania/);
});

test("unverified VFR reference lighting data is hidden from the default view", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(findEntry(view, "rider-core.lighting.headlight").formattedValue, "Brak danych");
  assert.doesNotMatch(uiApi.renderTechnicalProfileHtml(view), /data-entry-id="lighting\.headlight"/);
});

test("hidden VFR reference lighting data is not searchable by default", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const html = uiApi.renderSearchResultsHtml(view, "headlight", searchApi);
  assert.match(html, /Brak wyników wyszukiwania/);
});

test("known VFR fuse data remains visible without inventing ABS context", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.fuse.table");
  assert.match(entry.formattedValue, /PGM-FI/);
});

test("market-specific headlight data stays unavailable without a region", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.lighting.headlight");
  assert.equal(entry.formattedValue, "Brak danych");
});

test("unknown ABS does not fabricate an ABS-specific fuse table", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.fuse.table");
  assert.equal(entry.resolutionStatus, "blocked-applicability");
  assert.ok(entry.requiredContext.includes("abs"));
  assert.doesNotMatch(entry.formattedValue, /wersja ABS/);
});

test("known ABS selects only the applicable fuse variant", async () => {
  const view = await uiApi.prepareTechnicalProfileView({ ...MOTORCYCLE, region: "USA", abs: true });
  const entry = findEntry(view, "rider-core.fuse.table");
  assert.equal(entry.resolutionStatus, "resolved");
  assert.match(entry.formattedValue, /PGM-FI/);
  assert.match(entry.formattedValue, /Obwody chronione/);
  assert.doesNotMatch(entry.formattedValue, /wersja standardowa/);
  assert.ok(entry.sources.some(source => source.id.includes("wiring-abs")));
});

test("known non-ABS selects only the applicable USA fuse variant", async () => {
  const view = await uiApi.prepareTechnicalProfileView({ ...MOTORCYCLE, region: "USA", abs: false });
  const entry = findEntry(view, "rider-core.fuse.table");
  assert.equal(entry.resolutionStatus, "resolved");
  assert.match(entry.formattedValue, /PGM-FI/);
  assert.match(entry.formattedValue, /zegar 10 A/);
  assert.doesNotMatch(entry.formattedValue, /Obwody chronione/);
  assert.ok(entry.sources.some(source => source.id.includes("wiring-standard")));
});

test("VTEC and standard valve clearances remain labelled and separately sourced", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  const entry = findEntry(view, "rider-core.valves.intake-clearance");
  assert.equal(entry.resolutionStatus, "resolved");
  assert.match(entry.formattedValue, /standardowy/);
  assert.match(entry.formattedValue, /VTEC/);
  assert.ok(entry.sources.some(source => source.id.includes("valve-procedure")));
});

test("JP-only brake-system evidence is blocked outside a known region", async () => {
  const unknown = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.brakes.abs-system");
  assert.equal(unknown.resolutionStatus, "blocked-applicability");
  assert.equal(unknown.sources.length, 0);
  const japan = findEntry(await uiApi.prepareTechnicalProfileView({ ...MOTORCYCLE, region: "JP" }), "rider-core.brakes.abs-system");
  assert.equal(japan.resolutionStatus, "resolved");
  assert.ok(japan.sources.some(source => source.id.includes("dual-cbs")));
});

test("VFR Core keeps the frozen 95-field and 14-category shape", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(view.coreMatrix.fieldIds.length, 95);
  assert.equal(view.categories.length, 14);
});

test("unused unknown equipment is not shown as a passive warning", async () => {
  assert.doesNotMatch(uiApi.renderTechnicalProfileHtml(await uiApi.prepareTechnicalProfileView(MOTORCYCLE)), /Wyposażenie: nieznane/);
});

test("insufficient-context renders without throwing", async () => {
  const view = await stateUi("insufficient-context").prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(uiApi.renderTechnicalProfileHtml(view), /wymaga katalogowego wariantu/);
});

test("not-found renders without throwing", async () => {
  assert.match(uiApi.renderTechnicalProfileHtml(await stateUi("not-found").prepareTechnicalProfileView(MOTORCYCLE)), /nie jest jeszcze dostępna/);
});

test("load-error renders without stack trace", async () => {
  const html = uiApi.renderTechnicalProfileHtml(await stateUi("load-error").prepareTechnicalProfileView(MOTORCYCLE));
  assert.match(html, /chwilowo niedostępna/);
  assert.doesNotMatch(html, /Error:| at /);
});

test("invalid-profile renders a controlled state", async () => {
  assert.match(uiApi.renderTechnicalProfileHtml(await stateUi("invalid-profile").prepareTechnicalProfileView(MOTORCYCLE)), /nie przeszedł kontroli/);
});

test("ambiguous-profile renders a controlled state", async () => {
  assert.match(uiApi.renderTechnicalProfileHtml(await stateUi("ambiguous-profile").prepareTechnicalProfileView(MOTORCYCLE)), /jednoznacznie/);
});

test("legacy textual motorcycle is not heuristically mapped", async () => {
  const view = await uiApi.prepareTechnicalProfileView({ brand: "Honda", model: "VFR800 VTEC", year: 2002 });
  assert.equal(view.status, "insufficient-context");
});

test("profile is opened once per render through readiness", async () => {
  let readinessCalls = 0;
  const ui = uiApi.createTechnicalProfileUi({
    readiness: {
      async getTechnicalProfileReadiness(motorcycle, options) {
        readinessCalls += 1;
        return readinessApi.getTechnicalProfileReadiness(motorcycle, options);
      }
    }
  });
  await ui.renderTechnicalProfile(fakeContainer(), MOTORCYCLE);
  assert.equal(readinessCalls, 1);
});

test("search index is built once per render", async () => {
  let builds = 0;
  const ui = uiApi.createTechnicalProfileUi({
    search: {
      ...searchApi,
      buildSearchIndex(profile, context) { builds += 1; return searchApi.buildSearchIndex(profile, context); }
    }
  });
  await ui.renderTechnicalProfile(fakeContainer(), MOTORCYCLE);
  assert.equal(builds, 1);
});

test("rendering does not mutate motorcycle", async () => {
  const motorcycle = JSON.parse(JSON.stringify(MOTORCYCLE));
  const before = JSON.stringify(motorcycle);
  await uiApi.renderTechnicalProfile(fakeContainer(), motorcycle);
  assert.equal(JSON.stringify(motorcycle), before);
});

test("rendering does not mutate loaded profile", async () => {
  const readiness = await readinessApi.getTechnicalProfileReadiness(MOTORCYCLE, { includeProfile: true });
  const before = JSON.stringify(readiness.profile);
  const ui = uiApi.createTechnicalProfileUi({ readiness: { async getTechnicalProfileReadiness() { return readiness; } } });
  await ui.renderTechnicalProfile(fakeContainer(), MOTORCYCLE);
  assert.equal(JSON.stringify(readiness.profile), before);
});

test("HTML escaping blocks injected profile markup", () => {
  const html = uiApi.renderEntryHtml({
    id: 'evil"><img src=x onerror=alert(1)>',
    label: "<script>alert(1)</script>",
    resolutionStatus: "resolved",
    formattedValue: '<img src=x onerror="alert(1)">',
    requiredContext: [],
    status: "verified",
    statusLabel: "Zweryfikowane",
    description: "<b>unsafe</b>",
    sources: []
  });
  assert.doesNotMatch(html, /<script>|<img|<b>unsafe/);
  assert.match(html, /&lt;script&gt;|&lt;img/);
});

test("legacy fallback remains available and callable", async () => {
  let clicked = false;
  let handler = null;
  const fallback = { addEventListener(event, callback) { assert.equal(event, "click"); handler = callback; } };
  const container = fakeContainer({ "[data-technical-legacy-fallback]": fallback });
  const ui = stateUi("not-found");
  await ui.renderTechnicalProfile(container, MOTORCYCLE, { legacyAvailable: true, onLegacyFallback() { clicked = true; } });
  assert.match(container.innerHTML, /Otwórz starszą bazę/);
  handler();
  assert.equal(clicked, true);
});

test("verified status and real citation metadata are rendered neutrally", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "rider-core.oil.drain-plug-torque");
  const html = uiApi.renderEntryHtml(entry);
  assert.match(html, /Zweryfikowane/);
  assert.match(html, /Instrukcja serwisowa Honda VFR800\/VFR800A 2002/);
  assert.match(html, /Olej silnikowy \/ filtr oleju/);
});
