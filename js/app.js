const VFRApp = {
  async init() {
    const loaded =
      await MotorcycleDatabase.load();

    this.renderGarage();

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

function setManualMotorcycleFields(enabled) {
  const container = document.getElementById("garageManualFields");
  container.hidden = !enabled;

  ["garageBrand", "garageModel", "garageYear"].forEach(id => {
    document.getElementById(id).disabled = !enabled;
  });
}

function resetCatalogSelect(selectId, placeholder) {
  const select = document.getElementById(selectId);
  setSelectOptions(select, placeholder, []);
  select.disabled = true;
}

function handleCatalogBrandChange() {
  const brandId = document.getElementById("garageCatalogBrand").value;
  const manualMode = brandId === MotorcycleCatalog.manualBrandId;
  const catalogFields = document.getElementById("garageCatalogFields");

  resetCatalogSelect("garageCatalogModel", "Wybierz model");
  resetCatalogSelect("garageCatalogVariant", "Wybierz wariant");
  resetCatalogSelect("garageCatalogYear", "Wybierz rok");
  catalogFields.hidden = !brandId || manualMode;
  setManualMotorcycleFields(manualMode);

  if (!brandId || manualMode) return;

  const modelSelect = document.getElementById("garageCatalogModel");
  setSelectOptions(
    modelSelect,
    "Wybierz model",
    MotorcycleCatalog.getModels(brandId).map(model => ({
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
    MotorcycleCatalog.getVariants(brandId, modelId).map(variant => ({
      value: variant.id,
      label: variant.name
    }))
  );
  variantSelect.disabled = false;
}

function handleCatalogVariantChange() {
  const brandId = document.getElementById("garageCatalogBrand").value;
  const modelId = document.getElementById("garageCatalogModel").value;
  const variantId = document.getElementById("garageCatalogVariant").value;

  resetCatalogSelect("garageCatalogYear", "Wybierz rok");

  if (!variantId) return;

  const yearSelect = document.getElementById("garageCatalogYear");
  setSelectOptions(
    yearSelect,
    "Wybierz rok",
    MotorcycleCatalog.getYears(brandId, modelId, variantId)
      .map(year => ({ value: String(year), label: String(year) }))
  );
  yearSelect.disabled = false;
}

function initializeMotorcycleForm() {
  const brandSelect = document.getElementById("garageCatalogBrand");

  setSelectOptions(
    brandSelect,
    "Wybierz markę",
    [
      ...MotorcycleCatalog.brands.map(brand => ({
        value: brand.id,
        label: brand.name
      })),
      {
        value: MotorcycleCatalog.manualBrandId,
        label: "Inna / wpisz ręcznie"
      }
    ]
  );
  brandSelect.value = "";
  handleCatalogBrandChange();
}

function getMotorcycleFormSelection() {
  const brandId = document.getElementById("garageCatalogBrand").value;

  if (brandId === MotorcycleCatalog.manualBrandId) {
    const brand = document.getElementById("garageBrand").value.trim();
    const model = document.getElementById("garageModel").value.trim();
    const year = document.getElementById("garageYear").value.trim();

    if (!brand || !model) {
      alert("Podaj markę i model motocykla.");
      return null;
    }

    return { brand, model, year };
  }

  const modelId = document.getElementById("garageCatalogModel").value;
  const variantId = document.getElementById("garageCatalogVariant").value;
  const year = document.getElementById("garageCatalogYear").value;
  const selection = MotorcycleCatalog.resolve(
    brandId,
    modelId,
    variantId,
    year
  );

  if (!selection) {
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
  const motorcycle = {
    ...selection,
    mileage: Number(mileage || 0),
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
  ["garageBrand", "garageModel", "garageYear"].forEach(id => {
    document.getElementById(id).value = "";
  });
  initializeMotorcycleForm();
  VFRApp.renderGarage();
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
  html += services.map(service => {
    const total =
      Number(service.partsCost || 0) +
      Number(service.laborCost || 0);
    return `
      <div class="list-item">
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
  }).join("");
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
