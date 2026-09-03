"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const uiApi = require("../js/technical/technical-profile-ui.js");
const readinessApi = require("../js/technical/technical-profile-readiness.js");
const resolverApi = require("../js/technical/technical-profile-resolver.js");
const formatterApi = require("../js/technical/technical-value-formatter.js");
const searchApi = require("../js/technical/technical-profile-search.js");
const ducatiProfile = require("../data/technical/ducati/monster937/profile-2021.js");

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

test("Ducati presentation is Polish while values and profile semantics remain unchanged", async () => {
  const before = JSON.stringify(ducatiProfile);
  const view = await uiApi.prepareTechnicalProfileView(DUCATI_MOTORCYCLE);
  assert.equal(view.profileId, "ducati.monster937.2021");
  assert.deepEqual(view.categories.map(category => category.label), ["Olej i filtry", "Świece i zapłon", "Hamulce", "Instalacja elektryczna"]);
  assert.equal(view.entriesById["lubrication.engine-oil.viscosity"].label, "Lepkość oleju silnikowego");
  assert.equal(view.entriesById["electrical.battery.capacity"].label, "Pojemność akumulatora");
  assert.equal(view.entriesById["electrical.battery.capacity"].formattedValue, "6,5 Ah");
  assert.equal(view.entriesById["brakes.fluid.specification"].formattedValue, "Front/rear brake circuit: DOT 4");
  assert.equal(JSON.stringify(ducatiProfile), before);
});

test("categories and their entries are grouped deterministically", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.equal(view.categories[0].id, "general");
  for (const category of view.categories) {
    const labels = category.entries.map(entry => entry.label);
    assert.deepEqual(labels, [...labels].sort((a, b) => a.localeCompare(b, "pl")));
  }
});

test("resolved oil drain bolt renders 30 N·m", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "torque.engine.oil-drain-bolt");
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
  assert.match(html, /torque\.engine\.oil-drain-bolt/);
  assert.match(html, /30 N·m/);
});

test("empty search returns the category view without crashing", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(uiApi.renderSearchResultsHtml(view, "   ", searchApi), /Dane ogólne/);
});

test("search with no results renders an explicit message", async () => {
  const view = await uiApi.prepareTechnicalProfileView(MOTORCYCLE);
  assert.match(uiApi.renderSearchResultsHtml(view, "zzzz-nie-istnieje", searchApi), /Brak wyników wyszukiwania/);
});

test("headlight without region is rendered as ambiguous", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "lighting.headlight");
  assert.equal(entry.resolutionStatus, "ambiguous-context");
  assert.match(uiApi.renderEntryHtml(entry), /Wymaga doprecyzowania: region motocykla/);
});

test("ambiguous headlight does not expose EU or USA values", async () => {
  const html = uiApi.renderEntryHtml(findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "lighting.headlight"));
  assert.doesNotMatch(html, /55 W|60\/55 W/);
});

test("unknown ABS leaves ABS-dependent entry ambiguous", async () => {
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "fuses.circuit.abs");
  assert.equal(entry.resolutionStatus, "ambiguous-context");
  assert.match(uiApi.renderEntryHtml(entry), /informacja o ABS/);
});

test("unknown region is represented by an actionable refinement field", async () => {
  assert.match(uiApi.renderTechnicalProfileHtml(await uiApi.prepareTechnicalProfileView(MOTORCYCLE)), /data-technical-clarification="region"/);
});

test("unknown ABS is represented by an actionable refinement field", async () => {
  assert.match(uiApi.renderTechnicalProfileHtml(await uiApi.prepareTechnicalProfileView(MOTORCYCLE)), /data-technical-clarification="abs"/);
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
  const entry = findEntry(await uiApi.prepareTechnicalProfileView(MOTORCYCLE), "torque.engine.oil-drain-bolt");
  const html = uiApi.renderEntryHtml(entry);
  assert.match(html, /Zweryfikowane/);
  assert.match(html, /Instrukcja serwisowa Honda VFR800\/VFR800A 2002/);
  assert.match(html, /Olej silnikowy \/ filtr oleju/);
});
