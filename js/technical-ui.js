/* =========================================================
   VFR MASTER — INTERFEJS BAZY TECHNICZNEJ
   ========================================================= */
function openTechnicalBase() {
  const container =
    document.getElementById("technical");
  if (!container || !window.VFRTechnical) {
    return;
  }
  const model =
    VFRTechnical.getModel();
  const data =
    VFRTechnical.getAll();
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
        ${Object.entries(data)
          .map(([key, section]) => `
            <button
              class="tile"
              onclick="openTechnicalSection('${key}')">
              <span class="icon">
                ${section.icon}
              </span>
              ${escapeHtml(section.title)}
            </button>
          `)
          .join("")}
      </div>
    </div>
  `;
}
function openTechnicalSection(sectionKey) {
  const section =
    VFRTechnical.get(sectionKey);
  const container =
    document.getElementById("technical");
  if (!section || !container) {
    return;
  }
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
        ${section.icon}
        ${escapeHtml(section.title)}
      </h2>
    </div>
    <div class="card">
      ${section.items
        .map(item => `
          <div class="list-item">
            <span class="muted">
              ${escapeHtml(item[0])}
            </span>
            <br>
            <b>
              ${escapeHtml(item[1])}
            </b>
          </div>
        `)
        .join("")}
      ${
        section.note
          ? `
            <div
              class="section-note"
              style="margin-top:14px;">
              ℹ️
              ${escapeHtml(section.note)}
            </div>
          `
          : ""
      }
    </div>
  `;
}
/* =========================================================
   PODPIĘCIE DO NAWIGACJI
   ========================================================= */
(function setupTechnicalUI() {
  const originalNavigateTo =
    window.navigateTo;
  if (
    typeof originalNavigateTo !==
    "function"
  ) {
    return;
  }
  window.navigateTo =
    function(pageId) {
      originalNavigateTo(pageId);
      if (
        pageId ===
        "technical"
      ) {
        openTechnicalBase();
      }
    };
})();