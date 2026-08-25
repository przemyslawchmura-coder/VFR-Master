/* =========================================================
   VFR MASTER
   INTERFEJS BAZY TECHNICZNEJ
   Honda VFR800 VTEC 2002
   ========================================================= */
/* =========================================================
   OTWARCIE BAZY TECHNICZNEJ
   ========================================================= */
function openTechnicalBase() {
  const container =
    document.getElementById("technical");
  if (
    !container ||
    !window.VFRTechnical
  ) {
    return;
  }
  const model =
    VFRTechnical.model;
  const categories =
    VFRTechnical.getCategoryList();
  container.innerHTML = `
    <div class="card hero">
      <div class="logo">
        VFR MASTER • BAZA TECHNICZNA
      </div>
      <h2>
        ${escapeHtml(model.brand)}
        ${escapeHtml(model.model)}
      </h2>
      <p class="section-note">
        Rok ${escapeHtml(model.year)}
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
  const section =
    VFRTechnical.getCategory(
      sectionKey
    );
  const container =
    document.getElementById(
      "technical"
    );
  if (
    !section ||
    !container
  ) {
    return;
  }
  const items =
    Object.entries(
      section.items || {}
    );
  container.innerHTML = `
    <button
      class="back"
      onclick="openTechnicalBase()">
      ← Wszystkie kategorie
    </button>
    <div class="card hero">
      <div class="logo">
        VFR MASTER
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
function openTechnicalItem(
  sectionKey,
  itemKey
) {
  const section =
    VFRTechnical.getCategory(
      sectionKey
    );
  if (!section) {
    return;
  }
  const item =
    section.items &&
    section.items[itemKey];
  if (!item) {
    return;
  }
  const container =
    document.getElementById(
      "technical"
    );
  if (!container) {
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
              ${escapeHtml(
                item.description
              )}
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
window.openTechnicalBase =
  openTechnicalBase;
window.openTechnicalSection =
  openTechnicalSection;
window.openTechnicalItem =
  openTechnicalItem;