/* =========================================================
   REVLOG
   INTERFEJS BAZY TECHNICZNEJ AKTYWNEGO MOTOCYKLA
   ========================================================= */
let activeTechnicalRegistrationKey = null;
let technicalRenderGeneration = 0;

function getActiveTechnicalContext() {
  const container = document.getElementById("technical");
  const bike = window.MotorcycleDatabase
    ? MotorcycleDatabase.getActive()
    : null;
  const registration =
    bike && window.TechnicalDatabase
      ? TechnicalDatabase.getRegistrationForMotorcycle(bike)
      : null;

  return {
    container,
    bike,
    registration,
    database: registration ? registration.database : null
  };
}

function hasCurrentTechnicalContext(context) {
  return Boolean(
    context.registration &&
    context.registration.key === activeTechnicalRegistrationKey
  );
}

/* =========================================================
   OTWARCIE BAZY TECHNICZNEJ
   ========================================================= */
async function openTechnicalBase() {
  const context = getActiveTechnicalContext();
  const renderGeneration = ++technicalRenderGeneration;
  const motorcycleId = context.bike ? context.bike.id : null;
  activeTechnicalRegistrationKey = null;

  if (!context.container) return;

  if (window.RevLogTechnicalProfileUi) {
    try {
      await window.RevLogTechnicalProfileUi.renderTechnicalProfile(
        context.container,
        context.bike,
        {
          legacyAvailable: Boolean(context.database),
          onLegacyFallback: openLegacyTechnicalBase,
          shouldCommit() {
            const activeBike = window.MotorcycleDatabase
              ? MotorcycleDatabase.getActive()
              : null;
            return renderGeneration === technicalRenderGeneration &&
              (activeBike ? activeBike.id : null) === motorcycleId &&
              context.container.classList.contains("active");
          }
        }
      );
      return;
    } catch (error) {
      console.error("Technical Profile UI failed; using legacy fallback.", error);
    }
  }

  openLegacyTechnicalBase();
}

function cancelTechnicalProfileRender() {
  technicalRenderGeneration += 1;
}

function openLegacyTechnicalBase() {
  const context = getActiveTechnicalContext();
  const { container, bike, registration, database } = context;

  activeTechnicalRegistrationKey = registration
    ? registration.key
    : null;

  if (!container) return;

  if (!bike) {
    container.innerHTML = `
      <div class="card">
        <div class="empty">
          Najpierw wybierz motocykl w garażu.
        </div>
      </div>
    `;
    return;
  }

  if (!database) {
    const ambiguity = window.TechnicalDatabase
      ? TechnicalDatabase.getAmbiguityForMotorcycle(bike)
      : null;

    if (ambiguity) {
      container.innerHTML = `
        <div class="card">
          <div class="empty">
            ${escapeHtml(ambiguity.message)}
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="card hero">
        <h2>
          Brak danych technicznych dla:
        </h2>
        <h3>
          ${escapeHtml(bike.brand)}
          ${escapeHtml(bike.model)}
        </h3>
        <p class="section-note">
          Rok: ${escapeHtml(bike.year || "—")}
        </p>
        <p class="section-note">
          Ten model nie został jeszcze dodany do bazy technicznej.
        </p>
      </div>
    `;
    return;
  }

  const model = database.model;
  const categories = database.getCategoryList();

  container.innerHTML = `
    <div class="card hero">
      <div class="logo">
        REVLOG • BAZA TECHNICZNA
      </div>
      <h2>
        ${escapeHtml(model.brand)}
        ${escapeHtml(model.model)}
      </h2>
      <p class="section-note">
        Rok ${escapeHtml(bike.year)}
      </p>
    </div>
    <div class="card">
      <h3>
        📖 Wybierz kategorię
      </h3>
      <div class="grid">
        ${categories.map(category => `
          <button
            class="tile"
            onclick="openTechnicalSection('${escapeHtml(category.id)}')">
            <span class="icon">
              ${escapeHtml(category.icon)}
            </span>
            ${escapeHtml(category.title)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

/* =========================================================
   OTWARCIE KATEGORII
   ========================================================= */
function openTechnicalSection(sectionKey) {
  const context = getActiveTechnicalContext();

  if (!hasCurrentTechnicalContext(context)) {
    openTechnicalBase();
    return;
  }

  const { container, database } = context;
  const section = database.getCategory(sectionKey);

  if (!section || !container) {
    openTechnicalBase();
    return;
  }

  const items = Object.entries(section.items || {});

  container.innerHTML = `
    <button
      class="back"
      onclick="openLegacyTechnicalBase()">
      ← Wszystkie kategorie
    </button>
    <div class="card hero">
      <div class="logo">
        REVLOG
      </div>
      <h2>
        ${escapeHtml(section.icon)}
        ${escapeHtml(section.title)}
      </h2>
    </div>
    <div class="card">
      ${items.length
        ? items.map(([key, item]) => `
            <div
              class="list-item"
              onclick="openTechnicalItem(
                '${escapeHtml(sectionKey)}',
                '${escapeHtml(key)}'
              )"
              style="cursor:pointer;">
              <b>
                ${escapeHtml(item.name)}
              </b>
              <br>
              <span class="muted">
                ${escapeHtml(item.value)}
              </span>
            </div>
          `).join("")
        : `
          <div class="empty">
            Brak danych w tej kategorii.
          </div>
        `
      }
    </div>
  `;
}

/* =========================================================
   SZCZEGÓŁ PARAMETRU
   ========================================================= */
function openTechnicalItem(sectionKey, itemKey) {
  const context = getActiveTechnicalContext();

  if (!hasCurrentTechnicalContext(context)) {
    openTechnicalBase();
    return;
  }

  const { container, database } = context;
  const section = database.getCategory(sectionKey);
  const item = section && section.items
    ? section.items[itemKey]
    : null;

  if (!section || !item || !container) {
    openTechnicalBase();
    return;
  }

  container.innerHTML = `
    <button
      class="back"
      onclick="openTechnicalSection('${escapeHtml(sectionKey)}')">
      ← Wróć do kategorii
    </button>
    <div class="card hero">
      <div class="logo">
        ${escapeHtml(section.icon)}
        ${escapeHtml(section.title)}
      </div>
      <h2>
        ${escapeHtml(item.name)}
      </h2>
    </div>
    <div class="card">
      <div class="list-item">
        <span class="muted">
          Wartość
        </span>
        <br>
        <b style="
          font-size:20px;
          display:block;
          margin-top:6px;
        ">
          ${escapeHtml(item.value)}
        </b>
      </div>
      ${
        item.description
          ? `
            <div
              class="section-note"
              style="
                margin-top:14px;
                padding:12px;
                background:#0f1419;
                border-radius:12px;
              ">
              ℹ️
              ${escapeHtml(item.description)}
            </div>
          `
          : ""
      }
    </div>
  `;
}

/* =========================================================
   GLOBAL
   ========================================================= */
window.openTechnicalBase = openTechnicalBase;
window.openLegacyTechnicalBase = openLegacyTechnicalBase;
window.cancelTechnicalProfileRender = cancelTechnicalProfileRender;
window.openTechnicalSection = openTechnicalSection;
window.openTechnicalItem = openTechnicalItem;
