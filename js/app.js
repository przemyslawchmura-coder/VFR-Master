function getFriendlyVariantName(bike) {
  const match = window.MotorcycleCatalog && MotorcycleCatalog.getVariantByKey
    ? MotorcycleCatalog.getVariantByKey(bike && bike.catalogVariantKey)
    : null;
  return match ? match.variant.name : "Wariant katalogowy niedostępny";
}

function getServicePlanStatus(bike, nextService, today = new Date()) {
  if (!bike || !nextService) return { key: "empty", label: "Brak danych do oceny" };
  const dueByMileage = nextService.nextMileage && Number(nextService.nextMileage) <= Number(bike.mileage || 0);
  const dueByDate = nextService.nextDate && new Date(nextService.nextDate).getTime() <= today.getTime();
  if (dueByMileage || dueByDate) return { key: "danger", label: "Serwis do wykonania" };
  const kmLeft = nextService.nextMileage ? Number(nextService.nextMileage) - Number(bike.mileage || 0) : Infinity;
  const daysLeft = nextService.nextDate ? (new Date(nextService.nextDate).getTime() - today.getTime()) / 86400000 : Infinity;
  if (kmLeft <= 1000 || daysLeft <= 30) return { key: "warning", label: "Serwis zbliża się" };
  return { key: "ok", label: "Plan serwisowy OK" };
}

function formatNextService(nextService, bike) {
  if (!nextService) return "Brak zaplanowanego serwisu";
  if (nextService.nextMileage) {
    const left = Number(nextService.nextMileage) - Number(bike.mileage || 0);
    return left > 0 ? `za ${left.toLocaleString("pl-PL")} km` : "do wykonania";
  }
  return nextService.nextDate ? `do ${nextService.nextDate}` : "zaplanowany";
}

function renderDashboard() {
  const container = document.getElementById("dashboardContent");
  if (!container) return;
  const bike = MotorcycleDatabase.getActive();
  if (!bike) {
    container.innerHTML = `<div class="card hero-dashboard"><div class="hero-kicker">RevLog</div><h1>Twój garaż zaczyna się tutaj.</h1><p class="hero-meta">Dodaj pierwszy motocykl i zacznij budować jego historię.</p><button class="primary" onclick="navigateTo('garage')">🏍️ Dodaj motocykl</button></div>`;
    return;
  }
  const services = ServiceModule.getSortedServices();
  const nextService = ServiceModule.getNextService();
  const status = getServicePlanStatus(bike, nextService);
  const variant = getFriendlyVariantName(bike);
  const recent = services.slice(0, 3);
  container.innerHTML = `<div class="dashboard-grid">
    <div class="card hero-dashboard dashboard-wide">
      <div class="hero-kicker">Aktywny motocykl</div>
      <h1>${escapeHtml(bike.nickname || `${bike.brand} ${bike.model}`)}</h1>
      <div class="hero-meta">${escapeHtml(bike.brand)} ${escapeHtml(bike.model)} · ${escapeHtml(bike.year || "—")} · ${escapeHtml(variant)}</div>
      <div class="hero-mileage">${Number(bike.mileage || 0).toLocaleString("pl-PL")} <small>km przebiegu</small></div>
      <div class="status-row status-${status.key}"><span class="status-dot"></span>${escapeHtml(status.label)}</div>
    </div>
    <div><div class="dashboard-section-title"><h2>Najbliższy serwis</h2><span>plan</span></div><div class="card next-service-card"><div><b>${nextService ? escapeHtml(nextService.description) : "Brak zaplanowanego serwisu"}</b><div class="muted">${nextService && nextService.nextDate ? escapeHtml(nextService.nextDate) : ""}</div></div><div class="next-service-value">${escapeHtml(formatNextService(nextService, bike))}</div></div></div>
    <div><div class="dashboard-section-title"><h2>Szybkie akcje</h2></div><div class="quick-actions"><button class="quick-action" onclick="openServiceForActiveBike()"><span class="icon">＋</span>Dodaj serwis<small>Nowy wpis</small></button><button class="quick-action" onclick="navigateTo('service')"><span class="icon">📓</span>Historia<small>RevLog</small></button><button class="quick-action" onclick="navigateTo('technical')"><span class="icon">📖</span>Techniczne<small>Dane modelu</small></button><button class="quick-action" onclick="navigateTo('garage')"><span class="icon">🏍️</span>Garaż<small>Wszystkie motocykle</small></button></div></div>
    <div class="dashboard-wide"><div class="dashboard-section-title"><h2>Ostatnia aktywność</h2><span>${services.length ? `${services.length} wpisów` : "RevLog"}</span></div><div class="card">${recent.length ? recent.map(service => `<div class="activity-item"><span>🔧</span><div><b>${escapeHtml(service.description || service.type || "Serwis")}</b><div class="muted">${escapeHtml(service.date || "—")} · ${Number(service.mileage || 0).toLocaleString("pl-PL")} km</div></div></div>`).join("") : `<div class="empty">Nie masz jeszcze historii serwisowej.<br><button class="secondary" onclick="openServiceForActiveBike()">Dodaj pierwszy wpis</button></div>`}${services.length > 3 ? `<button class="secondary" onclick="navigateTo('service')">Zobacz całą historię</button>` : ""}</div></div>
  </div>`;
}

const VFRApp = {
  async init() {
    const loaded =
      await MotorcycleDatabase.load();

    this.renderGarage();
    const activeBike = MotorcycleDatabase.getActive();
    if (activeBike) {
      await ServiceModule.loadServices(activeBike.id);
    }
    renderDashboard();

    if (!loaded) {
      alert(
        MotorcycleDatabase.lastError ||
        "Nie udało się wczytać motocykli."
      );
    }
  },
  getGarage() {
    return MotorcycleDatabase.getAll();
  },
  getActiveBike() {
    return MotorcycleDatabase.getActive();
  },
  renderGarage() {
    const container = document.getElementById("garageList");
    if (!container) return;
    const bikes = this.getGarage();
    if (!bikes.length) {
      container.innerHTML = `
        <div class="empty">
          Garaż jest pusty.<br>
          Dodaj swój pierwszy motocykl.
        </div>
      `;
      return;
    }
    container.innerHTML = bikes.map((bike, index) => {
      const active =
        bike.id === MotorcycleDatabase.activeMotorcycleId;
      return `
        <div class="list-item">
          <b>
            ${escapeHtml(
              bike.nickname ||
              `${bike.brand} ${bike.model}`
            )}
          </b>
          <br>
          <span class="muted">
            ${escapeHtml(bike.brand)}
            ${escapeHtml(bike.model)}
            • ${escapeHtml(bike.year || "—")}
          </span>
          <br><span class="muted">${escapeHtml(getFriendlyVariantName(bike))}</span>
          <br>
          <span class="muted">
            ${Number(bike.mileage || 0)
              .toLocaleString("pl-PL")} km
          </span>
          <button
            class="secondary"
            onclick="selectMotorcycle('${bike.id}')">
            ${
              active
                ? "✅ AKTYWNY MOTOCYKL"
                : "🏍️ USTAW JAKO AKTYWNY"
            }
          </button>
          <button
            class="secondary"
            onclick="openBikeCard('${bike.id}')">
            🔍 Otwórz kartę motocykla
          </button>
          <button
            class="danger"
            onclick="deleteMotorcycle('${bike.id}')">
            🗑️ Usuń
          </button>
        </div>
      `;
    }).join("");
  }
};
/* =====================================================
   DODAWANIE MOTOCYKLA
   ===================================================== */
function setSelectOptions(select, placeholder, options) {
  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.appendChild(placeholderOption);

  options.forEach(option => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    select.appendChild(element);
  });
}

function resetCatalogSelect(selectId, placeholder) {
  const select = document.getElementById(selectId);
  setSelectOptions(select, placeholder, []);
  select.disabled = true;
}

function handleCatalogBrandChange() {
  const brandId = document.getElementById("garageCatalogBrand").value;
  const catalogFields = document.getElementById("garageCatalogFields");

  resetCatalogSelect("garageCatalogModel", "Najpierw wybierz markę");
  resetCatalogSelect("garageCatalogVariant", "Najpierw wybierz model");
  resetCatalogSelect("garageCatalogYear", "Najpierw wybierz wariant");
  document.getElementById("garageCatalogYearField").hidden = false;
  catalogFields.hidden = !brandId;

  if (!brandId) return;

  const modelSelect = document.getElementById("garageCatalogModel");
  setSelectOptions(
    modelSelect,
    "Wybierz model",
    MotorcycleCatalog.getModelsByBrand(brandId).map(model => ({
      value: model.id,
      label: model.name
    }))
  );
  modelSelect.disabled = false;
}

function handleCatalogModelChange() {
  const brandId = document.getElementById("garageCatalogBrand").value;
  const modelId = document.getElementById("garageCatalogModel").value;

  resetCatalogSelect("garageCatalogVariant", "Wybierz wariant");
  resetCatalogSelect("garageCatalogYear", "Wybierz rok");

  if (!modelId) return;

  const variantSelect = document.getElementById("garageCatalogVariant");
  setSelectOptions(
    variantSelect,
    "Wybierz wariant",
    MotorcycleCatalog.getVariantsByBrandModel(brandId, modelId).map(variant => ({
      value: variant.key,
      label: `${variant.name} (${variant.yearFrom}–${variant.yearTo})`
    }))
  );
  variantSelect.disabled = false;
}

function handleCatalogVariantChange() {
  const brandId = document.getElementById("garageCatalogBrand").value;
  const modelId = document.getElementById("garageCatalogModel").value;
  const catalogVariantKey =
    document.getElementById("garageCatalogVariant").value;

  resetCatalogSelect("garageCatalogYear", "Wybierz rok");

  if (!catalogVariantKey) return;

  const match = MotorcycleCatalog.getVariantByKey(catalogVariantKey);
  if (!match || match.brand.id !== brandId || match.model.id !== modelId) return;

  const yearSelect = document.getElementById("garageCatalogYear");
  const years = MotorcycleCatalog.getYears(
    brandId,
    modelId,
    match.variant.id
  );
  setSelectOptions(
    yearSelect,
    "Wybierz rok",
    years.map(year => ({ value: String(year), label: String(year) }))
  );
  yearSelect.disabled = years.length === 1;
  yearSelect.value = years.length === 1 ? String(years[0]) : "";
  document.getElementById("garageCatalogYearField").hidden =
    years.length === 1;
}

function initializeMotorcycleForm() {
  const brandSelect = document.getElementById("garageCatalogBrand");

  setSelectOptions(
    brandSelect,
    "Wybierz markę",
    MotorcycleCatalog.getBrands().map(brand => ({
      value: brand.id,
      label: brand.name
    }))
  );
  brandSelect.value = "";
  handleCatalogBrandChange();
}

function getMotorcycleFormSelection() {
  const brandId = document.getElementById("garageCatalogBrand").value;

  const modelId = document.getElementById("garageCatalogModel").value;
  const catalogVariantKey =
    document.getElementById("garageCatalogVariant").value;
  const year = document.getElementById("garageCatalogYear").value;
  const selection = MotorcycleCatalog.resolveByKey(
    brandId,
    modelId,
    catalogVariantKey,
    year
  );

  if (!selection || !MotorcycleCatalog.validateMotorcycleSelection(selection)) {
    alert("Wybierz markę, model, wariant i rok motocykla.");
    return null;
  }

  return selection;
}

async function addMotorcycle() {
  const selection = getMotorcycleFormSelection();

  if (!selection) return;

  const mileage =
    document.getElementById("garageMileage").value.trim();
  const vin =
    document.getElementById("garageVin").value.trim();
  const nickname =
    document.getElementById("garageNickname").value.trim();
  const normalizedMileage = Number(mileage || 0);

  if (!Number.isFinite(normalizedMileage) || normalizedMileage < 0) {
    alert("Przebieg musi być liczbą większą lub równą 0.");
    return;
  }

  const motorcycle = {
    ...selection,
    mileage: normalizedMileage,
    vin,
    nickname
  };
  const savedMotorcycle =
    await MotorcycleDatabase.add(motorcycle);

  if (!savedMotorcycle) {
    alert(
      MotorcycleDatabase.lastError ||
      "Nie udało się dodać motocykla."
    );

    return;
  }
  [
    "garageMileage",
    "garageVin",
    "garageNickname"
  ].forEach(id => {
    const element =
      document.getElementById(id);
    if (element) {
      element.value = "";
    }
  });
  initializeMotorcycleForm();
  VFRApp.renderGarage();
  renderDashboard();
  alert("Motocykl dodany do garażu 🏍️");
}
/* =====================================================
   WYBÓR MOTOCYKLA
   ===================================================== */
async function selectMotorcycle(id) {
  const bike =
    await MotorcycleDatabase.setActive(id);

  if (!bike) {
    alert(
      MotorcycleDatabase.lastError ||
      "Nie udało się wybrać motocykla."
    );

    return;
  }

  const loaded =
    await ServiceModule.loadServices(bike.id);

  if (!loaded) {
    alert(
      ServiceModule.lastError ||
      "Nie udało się wczytać historii serwisowej."
    );
  }

  VFRApp.renderGarage();
  renderDashboard();
  alert(
    "Aktywny motocykl:\n\n" +
    bike.brand +
    " " +
    bike.model
  );
}
async function openBikeCard(id) {
  const bike =
    await MotorcycleDatabase.setActive(id);

  if (!bike) {
    alert(
      MotorcycleDatabase.lastError ||
      "Nie udało się otworzyć motocykla."
    );

    return;
  }

  const loaded =
    await ServiceModule.loadServices(bike.id);

  if (!loaded) {
    alert(
      ServiceModule.lastError ||
      "Nie udało się wczytać historii serwisowej."
    );
  }

  showBikeCard(bike);
}
async function deleteMotorcycle(id) {
  if (!confirm("Na pewno usunąć ten motocykl?")) {
    return;
  }

  const deleted =
    await MotorcycleDatabase.remove(id);

  if (!deleted) {
    alert(
      MotorcycleDatabase.lastError ||
      "Nie udało się usunąć motocykla."
    );

    return;
  }

  VFRApp.renderGarage();
  renderDashboard();
}
/* =====================================================
   KARTA MOTOCYKLA
   ===================================================== */
function showBikeCard(bike) {
  const container =
    document.getElementById("garageList");
  if (!container) return;
  const services =
    bike.services || [];
  const totalCost =
    ServiceModule.getTotalCost();
  const lastService =
    ServiceModule.getLastService();
  const nextService =
    ServiceModule.getNextService();
  const catalogMatch = window.MotorcycleCatalog
    ? MotorcycleCatalog.getVariantByKey(bike.catalogVariantKey)
    : null;
  const catalogVariantName = catalogMatch
    ? catalogMatch.variant.name
    : null;
  container.innerHTML = `
    <button
      class="back"
      onclick="VFRApp.renderGarage()">
      ← Wróć do garażu
    </button>
    <div class="card hero">
      <div class="logo">
        AKTYWNY MOTOCYKL
      </div>
      <h2>
        ${escapeHtml(
          bike.nickname ||
          `${bike.brand} ${bike.model}`
        )}
      </h2>
      <div class="muted">
        ${escapeHtml(bike.brand)}
        ${escapeHtml(bike.model)}
        •
        ${escapeHtml(bike.year || "—")}
      </div>
      ${catalogVariantName ? `
        <div class="muted">
          Wariant: ${escapeHtml(catalogVariantName)}
        </div>
      ` : ""}
    </div>
    <div class="stats">
      <div class="stat">
        <div class="stat-value">
          ${Number(
            bike.mileage || 0
          ).toLocaleString("pl-PL")}
        </div>
        <div class="stat-label">
          Przebieg km
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${services.length}
        </div>
        <div class="stat-label">
          Serwisy
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${totalCost.toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>
        <div class="stat-label">
          Koszty zł
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${
            lastService
              ? escapeHtml(lastService.date)
              : "—"
          }
        </div>
        <div class="stat-label">
          Ostatni serwis
        </div>
      </div>
    </div>
    <div class="grid">
      <button
        class="tile"
        onclick="openServiceForActiveBike()">
        <span class="icon">🔧</span>
        Serwis
      </button>
      <button
        class="tile"
        onclick="navigateTo('diagnostics')">
        <span class="icon">⚡</span>
        Diagnostyka
      </button>
      <button
        class="tile"
        onclick="navigateTo('technical')">
        <span class="icon">📖</span>
        Dane techniczne
      </button>
      <button
        class="tile"
        onclick="showCosts()">
        <span class="icon">💰</span>
        Koszty
      </button>
    </div>
    <div class="card">
      <h3>
        🔔 Najbliższy serwis
      </h3>
      ${
        nextService
          ? `
            <div class="list-item">
              <b>
                ${escapeHtml(
                  nextService.description
                )}
              </b>
              <br>
              <span class="muted">
                ${
                  nextService.nextDate
                    ? "📅 " +
                      escapeHtml(
                        nextService.nextDate
                      )
                    : ""
                }
                ${
                  nextService.nextMileage
                    ? "<br>🏍️ " +
                      Number(
                        nextService.nextMileage
                      ).toLocaleString(
                        "pl-PL"
                      ) +
                      " km"
                    : ""
                }
              </span>
            </div>
          `
          : `
            <div class="empty">
              Brak zaplanowanego serwisu.
            </div>
          `
      }
    </div>
    <div class="card">
      <h3>
        📋 Informacje
      </h3>
      <div class="list-item">
        <span class="muted">
          VIN
        </span>
        <br>
        <b>
          ${escapeHtml(
            bike.vin || "Nie podano"
          )}
        </b>
      </div>
      <div class="list-item">
        <span class="muted">
          Rok produkcji
        </span>
        <br>
        <b>
          ${escapeHtml(
            bike.year || "Nie podano"
          )}
        </b>
      </div>
    </div>
  `;
}
/* =====================================================
   SERWIS — ZAPIS
   ===================================================== */
async function saveServiceEntry() {
  const getValue = id => {
    const element =
      document.getElementById(id);
    return element
      ? element.value
      : "";
  };
  const service = {
    type:
      getValue("serviceType"),
    description:
      getValue("serviceDescription").trim(),
    date:
      getValue("serviceDate"),
    mileage:
      getValue("serviceMileage"),
    partsCost:
      getValue("servicePartsCost"),
    laborCost:
      getValue("serviceLaborCost"),
    workshop:
      getValue("serviceWorkshop").trim(),
    note:
      getValue("serviceNote").trim(),
    nextDate:
      getValue("serviceNextDate"),
    nextMileage:
      getValue("serviceNextMileage")
  };
  if (!service.description) {
    alert(
      "Napisz, co zostało zrobione."
    );
    return;
  }
  if (!service.date) {
    alert(
      "Wybierz datę serwisu."
    );
    return;
  }
  let saved;
  if (window.editingServiceId) {
    saved =
      await ServiceModule.updateService(
        window.editingServiceId,
        service
      );
  } else {
    saved =
      await ServiceModule.addService(
        service
      );
  }
  if (!saved) {
    alert(
      ServiceModule.lastError ||
      "Nie udało się zapisać serwisu."
    );

    return;
  }
  window.editingServiceId = null;
  clearServiceForm();
  const button =
    document.querySelector(
      "#service button.primary"
    );
  if (button) {
    button.innerHTML =
      "💾 Zapisz serwis";
  }
  await renderServiceHistory(false);
  alert(
    "Serwis zapisany 🔧"
  );
}
/* =====================================================
   EDYCJA SERWISU
   ===================================================== */
function editService(id) {
  const service =
    ServiceModule
      .getServices()
      .find(
        item =>
          item.id === id
      );
  if (!service) {
    alert(
      "Nie znaleziono wpisu."
    );
    return;
  }
  const fields = {
    serviceType:
      service.type || "Inne",
    serviceDescription:
      service.description || "",
    serviceDate:
      service.date || "",
    serviceMileage:
      service.mileage || "",
    servicePartsCost:
      service.partsCost || "",
    serviceLaborCost:
      service.laborCost || "",
    serviceWorkshop:
      service.workshop || "",
    serviceNote:
      service.note || "",
    serviceNextDate:
      service.nextDate || "",
    serviceNextMileage:
      service.nextMileage || ""
  };
  Object.entries(fields)
    .forEach(([id, value]) => {
      const element =
        document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });
  window.editingServiceId = id;
  const button =
    document.querySelector(
      "#service button.primary"
    );
  if (button) {
    button.innerHTML =
      "💾 Zapisz zmiany";
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
/* =====================================================
   USUWANIE SERWISU
   ===================================================== */
async function removeService(id) {

  const confirmed =
    confirm(
      "Usunąć ten wpis serwisowy?"
    );

  if (!confirmed) {
    return;
  }

  const deleted =
    await ServiceModule.deleteService(id);

  if (!deleted) {
    alert(
      ServiceModule.lastError ||
      "Nie udało się usunąć serwisu."
    );

    return;
  }

  await renderServiceHistory(false);
}
/* =====================================================
   CZYSZCZENIE FORMULARZA
   ===================================================== */
function clearServiceForm() {
  [
    "serviceDescription",
    "serviceMileage",
    "servicePartsCost",
    "serviceLaborCost",
    "serviceWorkshop",
    "serviceNote",
    "serviceNextDate",
    "serviceNextMileage"
  ].forEach(id => {
    const element =
      document.getElementById(id);
    if (element) {
      element.value = "";
    }
  });
}
/* =====================================================
   HISTORIA SERWISOWA
   ===================================================== */
async function renderServiceHistory(loadFromSupabase = true) {
  const container =
    document.getElementById(
      "serviceHistory"
    );
  if (!container) return;
  const bike =
    MotorcycleDatabase.getActive();
  if (!bike) {
    container.innerHTML = `
      <div class="empty">
        Najpierw wybierz motocykl
        w garażu.
      </div>
    `;
    return;
  }
  const motorcycleId = bike.id;
  const loaded = loadFromSupabase
    ? await ServiceModule.loadServices(motorcycleId)
    : true;

  if (
    MotorcycleDatabase.activeMotorcycleId !==
    motorcycleId
  ) {
    return;
  }

  if (!loaded) {
    alert(
      ServiceModule.lastError ||
      "Nie udało się wczytać historii serwisowej."
    );
  }
  const services =
    ServiceModule.getSortedServices();
  const total =
    ServiceModule.getTotalCost();
  const parts =
    ServiceModule.getPartsCost();
  const labor =
    ServiceModule.getLaborCost();
  let html = `
    <div class="stats">
      <div class="stat">
        <div class="stat-value">
          ${services.length}
        </div>
        <div class="stat-label">
          Wszystkie serwisy
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${total.toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>
        <div class="stat-label">
          Razem zł
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${parts.toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>
        <div class="stat-label">
          Części zł
        </div>
      </div>
      <div class="stat">
        <div class="stat-value">
          ${labor.toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>
        <div class="stat-label">
          Robocizna zł
        </div>
      </div>
    </div>
  `;
  if (!services.length) {
    html += `
      <div class="empty">
        Brak historii serwisowej.
      </div>
    `;
    container.innerHTML = html;
    return;
  }
  html += `<div class="timeline">` + services.map(service => {
    const total =
      Number(service.partsCost || 0) +
      Number(service.laborCost || 0);
    return `
      <div class="timeline-item">
        <b>
          ${escapeHtml(
            service.description
          )}
        </b>
        <br>
        <span class="muted">
          ${escapeHtml(
            service.type || "Inne"
          )}
          •
          ${escapeHtml(
            service.date || "—"
          )}
          •
          ${Number(
            service.mileage || 0
          ).toLocaleString(
            "pl-PL"
          )}
          km
        </span>
        <br><br>
        💰
        <b>
          ${total.toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
          zł
        </b>
        <br>
        <span class="muted">
          Części:
          ${Number(
            service.partsCost || 0
          ).toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2
            }
          )} zł
          •
          Robocizna:
          ${Number(
            service.laborCost || 0
          ).toLocaleString(
            "pl-PL",
            {
              minimumFractionDigits: 2
            }
          )} zł
        </span>
        ${
          service.workshop
            ? `
              <br>
              <span class="muted">
                🔧
                ${escapeHtml(
                  service.workshop
                )}
              </span>
            `
            : ""
        }
        ${
          service.note
            ? `
              <br><br>
              <span class="muted">
                📝
                ${escapeHtml(
                  service.note
                )}
              </span>
            `
            : ""
        }
        ${
          service.nextDate ||
          service.nextMileage
            ? `
              <br><br>
              <span class="muted">
                🔔 Następny serwis:
                ${
                  service.nextDate
                    ? "<br>📅 " +
                      escapeHtml(
                        service.nextDate
                      )
                    : ""
                }
                ${
                  service.nextMileage
                    ? "<br>🏍️ " +
                      Number(
                        service.nextMileage
                      ).toLocaleString(
                        "pl-PL"
                      ) +
                      " km"
                    : ""
                }
              </span>
            `
            : ""
        }
        <button
          class="secondary"
          onclick="editService('${service.id}')">
          ✏️ Edytuj
        </button>
        <button
          class="danger"
          onclick="removeService('${service.id}')">
          🗑️ Usuń wpis
        </button>
      </div>
    `;
  }).join("") + `</div>`;
  container.innerHTML =
    html;
}
/* =====================================================
   KOSZTY
   ===================================================== */
function showCosts() {
  const bike =
    MotorcycleDatabase.getActive();
  if (!bike) {
    alert(
      "Najpierw wybierz motocykl."
    );
    return;
  }
  const total =
    ServiceModule.getTotalCost();
  const parts =
    ServiceModule.getPartsCost();
  const labor =
    ServiceModule.getLaborCost();
  alert(
    "💰 KOSZTY MOTOCYKLA\n\n" +
    "Razem: " +
    total.toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 2
      }
    ) +
    " zł\n\n" +
    "Części: " +
    parts.toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 2
      }
    ) +
    " zł\n\n" +
    "Robocizna: " +
    labor.toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 2
      }
    ) +
    " zł"
  );
}
/* =====================================================
   NAWIGACJA
   ===================================================== */
async function navigateTo(pageId) {
  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove(
        "active"
      );
    });
  const page =
    document.getElementById(
      pageId
    );
  if (page) {
    page.classList.add(
      "active"
    );
  }
  document
    .querySelectorAll(".nav-btn")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page ===
          pageId
      );
    });
  if (pageId === "garage") {
    VFRApp.renderGarage();
  }
  if (pageId === "home") {
    renderDashboard();
  }
  if (pageId === "service") {
    await renderServiceHistory();
  }
  if (
    pageId === "technical" &&
    window.openTechnicalBase
  ) {
    openTechnicalBase();
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
/* =====================================================
   POMOCNICZE
   ===================================================== */
function openServiceForActiveBike() {
  navigateTo("service");
}
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
window.VFRApp =
  VFRApp;

function setAuthMessage(message) {
  const element =
    document.getElementById("authMessage");

  if (element) {
    element.textContent = message || "";
  }
}

function showAuthPanel(message = "") {
  document.getElementById("authPanel").hidden = false;
  document.getElementById("appHeader").hidden = true;
  document.getElementById("appContent").hidden = true;
  document.getElementById("bottomNav").hidden = true;
  setAuthMessage(message);
}

function showApplication() {
  document.getElementById("authPanel").hidden = true;
  document.getElementById("appHeader").hidden = false;
  document.getElementById("appContent").hidden = false;
  document.getElementById("bottomNav").hidden = false;
  setAuthMessage("");
}

function getAuthCredentials() {
  return {
    email: document
      .getElementById("authEmail")
      .value.trim(),
    password: document
      .getElementById("authPassword")
      .value
  };
}

function validateAuthCredentials(email, password) {
  if (!email || !password) {
    setAuthMessage("Podaj email i hasło.");
    return false;
  }

  return true;
}

async function handleSignIn() {
  const { email, password } = getAuthCredentials();

  if (!validateAuthCredentials(email, password)) return;

  setAuthMessage("Logowanie...");

  try {
    await window.signIn(email, password);
    showApplication();
    await VFRApp.init();
  } catch (error) {
    showAuthPanel(
      error && error.message
        ? error.message
        : "Nie udało się zalogować. Sprawdź połączenie z siecią."
    );
  }
}

async function handleSignUp() {
  const { email, password } = getAuthCredentials();

  if (!validateAuthCredentials(email, password)) return;

  setAuthMessage("Tworzenie konta...");

  try {
    const data = await window.signUp(email, password);

    if (data.session) {
      showApplication();
      await VFRApp.init();
      return;
    }

    showAuthPanel(
      "Konto utworzone. Sprawdź email i potwierdź rejestrację."
    );
  } catch (error) {
    showAuthPanel(
      error && error.message
        ? error.message
        : "Nie udało się utworzyć konta. Sprawdź połączenie z siecią."
    );
  }
}

function clearRuntimeCache() {
  MotorcycleDatabase.motorcycles = [];
  MotorcycleDatabase.activeMotorcycleId = null;
  MotorcycleDatabase.lastError = null;
  MotorcycleDatabase.legacyServiceData = {};
  ServiceModule.servicesByMotorcycleId = {};
  ServiceModule.lastError = null;
  window.editingServiceId = null;
}

async function handleSignOut() {
  try {
    await window.signOut();
    clearRuntimeCache();
    showAuthPanel();
  } catch (error) {
    alert(
      error && error.message
        ? error.message
        : "Nie udało się wylogować. Sprawdź połączenie z siecią."
    );
  }
}

async function initializeAuth() {
  try {
    const session = await window.getCurrentSession();

    if (!session) {
      showAuthPanel();
      return;
    }

    showApplication();
    await VFRApp.init();
  } catch (error) {
    showAuthPanel(
      error && error.message
        ? error.message
        : "Nie udało się sprawdzić sesji. Sprawdź połączenie z siecią."
    );
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeMotorcycleForm();
    initializeAuth();
  }
);

window.handleCatalogBrandChange = handleCatalogBrandChange;
window.handleCatalogModelChange = handleCatalogModelChange;
window.handleCatalogVariantChange = handleCatalogVariantChange;
