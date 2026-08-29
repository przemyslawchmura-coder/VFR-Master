(function attachTechnicalProfileUi(root, factory) {
  let readinessApi = root && root.RevLogTechnicalProfileReadiness;
  let resolverApi = root && root.RevLogTechnicalProfileResolver;
  let formatterApi = root && root.RevLogTechnicalValueFormatter;
  let searchApi = root && root.RevLogTechnicalProfileSearch;
  if (typeof module === "object" && module.exports) {
    readinessApi = readinessApi || require("./technical-profile-readiness.js");
    resolverApi = resolverApi || require("./technical-profile-resolver.js");
    formatterApi = formatterApi || require("./technical-value-formatter.js");
    searchApi = searchApi || require("./technical-profile-search.js");
  }

  const api = factory(readinessApi, resolverApi, formatterApi, searchApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileUi = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createUiModule(
  defaultReadiness,
  defaultResolver,
  defaultFormatter,
  defaultSearch
) {
  "use strict";

  const STATUS_LABELS = Object.freeze({
    verified: "Zweryfikowane",
    "pending-verification": "Do weryfikacji",
    "conflicting-sources": "Sprzeczne źródła",
    "legacy-unverified": "Niezweryfikowane",
    deprecated: "Wycofane"
  });

  function createTechnicalProfileUi(options = {}) {
    const readiness = options.readiness || defaultReadiness;
    const resolver = options.resolver || defaultResolver;
    const formatter = options.formatter || defaultFormatter;
    const search = options.search || defaultSearch;

    async function prepareTechnicalProfileView(motorcycle) {
      if (!motorcycle) return { status: "empty", message: "Najpierw wybierz motocykl w garażu." };
      const readinessResult = await readiness.getTechnicalProfileReadiness(motorcycle, { includeProfile: true });
      if (readinessResult.status !== "ready") return readinessView(readinessResult);
      const profile = readinessResult.profile;
      const context = readinessResult.technicalContext;
      const categoryMap = new Map(profile.categories.map(category => [category.id, category]));
      const entryViews = profile.entries.map(entry => buildEntryView(
        entry,
        resolver.resolveEntry(entry, context),
        profile,
        formatter
      ));
      const grouped = groupEntries(profile.categories, entryViews);
      const searchIndex = search.buildSearchIndex(profile, context);

      return {
        status: "ready",
        profileId: profile.profile.id,
        profileName: `${profile.motorcycle.brand} ${profile.motorcycle.model}`,
        profileRevision: profile.profile.revision,
        motorcycleYear: context.year,
        resolutionContext: readinessResult.resolutionContext,
        clarification: motorcycle && motorcycle.clarification ? { ...motorcycle.clarification } : {},
        categories: grouped,
        entriesById: Object.fromEntries(entryViews.map(entry => [entry.id, entry])),
        searchIndex,
        categoryLabels: Object.fromEntries([...categoryMap].map(([id, category]) => [id, category.label]))
      };
    }

    async function renderTechnicalProfile(container, motorcycle, renderOptions = {}) {
      if (!container || typeof container !== "object") return { status: "missing-container" };
      let view;
      try {
        view = await prepareTechnicalProfileView(motorcycle);
      } catch (error) {
        view = readinessView({ status: "load-error" });
        if (typeof console !== "undefined" && console.error) console.error(error);
      }
      if (typeof renderOptions.shouldCommit === "function" && !renderOptions.shouldCommit()) {
        return { ...view, stale: true };
      }
      container.innerHTML = renderTechnicalProfileHtml(view, renderOptions);
      bindInteractions(container, view, renderOptions, search);
      return view;
    }

    return Object.freeze({ prepareTechnicalProfileView, renderTechnicalProfile });
  }

  function buildEntryView(entry, resolution, profile, formatter) {
    const resolved = resolution.status === "resolved";
    const effective = resolved ? resolution.entry : entry;
    return {
      id: entry.id,
      categoryId: entry.categoryId,
      label: entry.label,
      resolutionStatus: resolution.status,
      requiredContext: [...(resolution.requiredContext || [])],
      candidates: resolution.candidates || {},
      formattedValue: resolved && effective.value ? safeFormat(formatter, effective.value) : null,
      status: effective.status || entry.status || null,
      statusLabel: STATUS_LABELS[effective.status || entry.status] || "Status nieznany",
      description: effective.description || effective.notes || "",
      sources: buildSources(effective.sourceIds || entry.sourceIds || [], profile)
    };
  }

  function buildSources(sourceIds, profile) {
    return sourceIds.map(sourceId => {
      const citation = profile.citations[sourceId];
      const document = citation && profile.documents[citation.documentId];
      if (!citation || !document) return null;
      return {
        id: sourceId,
        title: document.title,
        section: citation.section || "",
        subsection: citation.subsection || "",
        pages: Array.isArray(citation.pages) ? [...citation.pages] : []
      };
    }).filter(Boolean);
  }

  function groupEntries(categories, entries) {
    const categoryOrder = [...categories].sort((left, right) =>
      (Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER) -
        (Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER) ||
      String(left.label).localeCompare(String(right.label), "pl") ||
      String(left.id).localeCompare(String(right.id))
    );
    return categoryOrder.map(category => ({
      id: category.id,
      label: category.label,
      entries: entries.filter(entry => entry.categoryId === category.id).sort((left, right) =>
        String(left.label).localeCompare(String(right.label), "pl") || String(left.id).localeCompare(String(right.id))
      )
    })).filter(category => category.entries.length);
  }

  function readinessView(result) {
    const messages = {
      "insufficient-context": "Nowa baza wymaga katalogowego wariantu i rocznika motocykla.",
      "not-found": "Nowa baza techniczna nie jest jeszcze dostępna dla tego motocykla.",
      "ambiguous-profile": "Nie można jednoznacznie wybrać profilu technicznego.",
      "load-error": "Baza techniczna dla tego motocykla jest chwilowo niedostępna.",
      "invalid-profile": "Profil techniczny nie przeszedł kontroli poprawności."
    };
    return { status: result.status || "load-error", message: messages[result.status] || messages["load-error"] };
  }

  function renderTechnicalProfileHtml(view, options = {}) {
    if (view.status !== "ready") return renderStateHtml(view, options);
    return `
      <div class="card hero technical-profile-hero">
        <div class="logo">REVLOG • TECHNICAL PROFILE</div>
        <h2>${escapeHtml(view.profileName)}</h2>
        <p class="section-note">Rok ${escapeHtml(view.motorcycleYear)} · Profil ${escapeHtml(view.profileId)}</p>
      </div>
      ${renderContextNotice(view.resolutionContext)}
      ${renderClarificationHtml(view)}
      <div class="card technical-profile-search-card">
        <label for="technicalProfileSearch">Szukaj danych technicznych</label>
        <input id="technicalProfileSearch" type="search" inputmode="search" autocomplete="off" placeholder="np. korek oleju, świeca, bezpiecznik FI">
      </div>
      <div id="technicalProfileResults" aria-live="polite">${renderCategoryHtml(view.categories)}</div>
    `;
  }

  function renderClarificationHtml(view) {
    const required = [...new Set(Object.values(view.entriesById || {}).flatMap(entry => entry.resolutionStatus === "ambiguous-context" ? entry.requiredContext : []))];
    if (!required.length) return "";
    const field = name => {
      if (!required.includes(name)) return "";
      const current = view.clarification || {};
      const key = name === "region" ? "market" : name;
      const options = [...new Set(Object.values(view.entriesById || {}).flatMap(entry => (entry.candidates && entry.candidates[name]) || []))].filter(Boolean);
      const optionLabels = { EU: "Europa", USA: "USA", UK: "Wielka Brytania", AU: "Australia", JP: "Japonia", true: "ABS", false: "Bez ABS" };
      const choices = name === "equipment" ? options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("") : options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(optionLabels[value] || value)}</option>`).join("");
      return `<label>${escapeHtml(name === "region" ? "Rynek / region" : name === "abs" ? "Wersja ABS" : "Wyposażenie")}<select data-technical-clarification="${escapeHtml(name)}"><option value="">Nie wiem</option>${choices}</select></label>`;
    };
    return `<div class="card technical-clarification"><h3>Doprecyzuj wersję motocykla</h3><p class="section-note">Znaleźliśmy więcej niż jeden pasujący wariant. Podaj tylko informacje potrzebne do wyboru właściwych danych technicznych.</p><form data-technical-clarification-form>${required.map(field).join("")}<button type="submit" class="primary">Zapisz i dobierz dane</button></form></div>`;
  }

  function renderStateHtml(view, options = {}) {
    return `<div class="card"><div class="empty">${escapeHtml(view.message || "Baza techniczna jest niedostępna.")}</div>${options.legacyAvailable ? '<button class="secondary" data-technical-legacy-fallback>Otwórz starszą bazę techniczną</button>' : ""}</div>`;
  }

  function renderContextNotice(context = {}) {
    const unknown = Object.entries(context).filter(([, state]) => state === "unknown");
    if (!unknown.length) return "";
    const labels = { region: "Region", abs: "ABS", equipment: "Wyposażenie" };
    return `<div class="card technical-context-notice"><b>Niektóre dane wymagają dodatkowych informacji o motocyklu.</b><div class="muted">${unknown.map(([field]) => `${escapeHtml(labels[field] || field)}: nieznane`).join(" · ")}</div></div>`;
  }

  function renderCategoryHtml(categories) {
    return categories.map(category => `<section class="card technical-profile-category"><h3>${escapeHtml(category.label)}</h3>${category.entries.map(renderEntryHtml).join("")}</section>`).join("");
  }

  function renderEntryHtml(entry) {
    const value = entry.resolutionStatus === "resolved"
      ? `<strong class="technical-entry-value">${escapeHtml(entry.formattedValue || "—")}</strong>`
      : `<strong class="technical-entry-ambiguous">Wymaga doprecyzowania: ${escapeHtml(entry.requiredContext.map(contextLabel).join(", "))}</strong>`;
    const sourceDetails = entry.sources.length
      ? `<details class="technical-entry-sources"><summary>Źródła (${entry.sources.length})</summary>${entry.sources.map(source => `<div class="muted"><b>${escapeHtml(source.title)}</b>${source.section ? ` · ${escapeHtml(source.section)}` : ""}${source.subsection ? ` / ${escapeHtml(source.subsection)}` : ""}${source.pages.length ? ` · s. ${escapeHtml(source.pages.join(", "))}` : ""}</div>`).join("")}</details>`
      : "";
    return `<article class="list-item technical-profile-entry" data-entry-id="${escapeHtml(entry.id)}"><div class="technical-entry-heading"><b>${escapeHtml(entry.label)}</b><span class="technical-quality technical-quality-${escapeHtml(entry.status || "unknown")}">${escapeHtml(entry.statusLabel)}</span></div>${value}${entry.description ? `<p class="section-note">${escapeHtml(entry.description)}</p>` : ""}${sourceDetails}</article>`;
  }

  function renderSearchResultsHtml(view, query, search) {
    if (!String(query || "").trim()) return renderCategoryHtml(view.categories);
    let results;
    try {
      results = search.search(view.searchIndex, query);
    } catch (error) {
      return '<div class="card"><div class="empty">Nie udało się przeszukać bazy technicznej.</div></div>';
    }
    if (!results.length) return '<div class="card"><div class="empty">Brak wyników wyszukiwania.</div></div>';
    const entries = results.map(result => view.entriesById[result.entryId]).filter(Boolean);
    return `<section class="card technical-profile-category"><h3>Wyniki wyszukiwania</h3>${entries.map(renderEntryHtml).join("")}</section>`;
  }

  function bindInteractions(container, view, options, search) {
    const fallback = container.querySelector && container.querySelector("[data-technical-legacy-fallback]");
    if (fallback && typeof options.onLegacyFallback === "function") fallback.addEventListener("click", options.onLegacyFallback);
    if (view.status !== "ready" || !container.querySelector) return;
    const input = container.querySelector("#technicalProfileSearch");
    const results = container.querySelector("#technicalProfileResults");
    if (input && results) input.addEventListener("input", () => { results.innerHTML = renderSearchResultsHtml(view, input.value, search); });
    const form = container.querySelector("[data-technical-clarification-form]");
    if (form && typeof options.onClarificationSave === "function") form.addEventListener("submit", async event => { event.preventDefault(); const clarification = { ...(view.clarification || {}) }; form.querySelectorAll("[data-technical-clarification]").forEach(select => { const field = select.dataset.technicalClarification; const key = field === "region" ? "market" : field; const value = select.value; clarification[key] = field === "abs" ? (value === "" ? null : value === "true") : (value || null); }); const result = await options.onClarificationSave(clarification); if (result && result.status === "cloud-error") { const notice = container.querySelector("[data-technical-clarification-error]"); if (notice) notice.textContent = "Nie udało się zapisać zmiany w chmurze. Spróbuj ponownie."; else if (form.insertAdjacentHTML) form.insertAdjacentHTML("beforeend", '<p class="section-note" data-technical-clarification-error>Nie udało się zapisać zmiany w chmurze. Spróbuj ponownie.</p>'); } });
  }

  function contextLabel(field) {
    return ({ region: "region motocykla", abs: "informacja o ABS", equipment: "wyposażenie" })[field] || field;
  }

  function safeFormat(formatter, value) {
    try { return formatter.formatValue(value, { locale: "pl-PL" }); } catch (error) { return "Nieprawidłowa wartość"; }
  }

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  const defaultUi = createTechnicalProfileUi();
  return Object.freeze({
    ...defaultUi,
    createTechnicalProfileUi,
    groupEntries,
    renderTechnicalProfileHtml,
    renderSearchResultsHtml,
    renderEntryHtml,
    escapeHtml,
    STATUS_LABELS
  });
});
