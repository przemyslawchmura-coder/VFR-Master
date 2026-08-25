const VFRApp = {
  init() {
    this.renderGarage();
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
            onclick="selectMotorcycle(${bike.id})">
            ${
              active
                ? "✅ AKTYWNY MOTOCYKL"
                : "🏍️ USTAW JAKO AKTYWNY"
            }
          </button>
          <button
            class="secondary"
            onclick="openBikeCard(${bike.id})">
            🔍 Otwórz kartę motocykla
          </button>
          <button
            class="danger"
            onclick="deleteMotorcycle(${index})">
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
function addMotorcycle() {
  const brand =
    document.getElementById("garageBrand").value.trim();
  const model =
    document.getElementById("garageModel").value.trim();
  const year =
    document.getElementById("garageYear").value.trim();
  const mileage =
    document.getElementById("garageMileage").value.trim();
  const vin =
    document.getElementById("garageVin").value.trim();
  const nickname =
    document.getElementById("garageNickname").value.trim();
  if (!brand || !model) {
    alert("Podaj przynajmniej markę i model.");
    return;
  }
  const motorcycle = {
    id: Date.now(),
    brand,
    model,
    year,
    mileage: Number(mileage || 0),
    vin,
    nickname,
    services: [],
    costs: [],
    history: []
  };
  MotorcycleDatabase.add(motorcycle);
  [
    "garageBrand",
    "garageModel",
    "garageYear",
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
  VFRApp.renderGarage();
  alert("Motocykl dodany do garażu 🏍️");
}
/* =====================================================
   WYBÓR MOTOCYKLA
   ===================================================== */
function selectMotorcycle(id) {
  MotorcycleDatabase.setActive(id);
  VFRApp.renderGarage();
  const bike =
    MotorcycleDatabase.getActive();
  if (bike) {
    alert(
      "Aktywny motocykl:\n\n" +
      bike.brand +
      " " +
      bike.model
    );
  }
}
function openBikeCard(id) {
  MotorcycleDatabase.setActive(id);
  const bike =
    MotorcycleDatabase.getActive();
  if (!bike) return;
  showBikeCard(bike);
}
function deleteMotorcycle(index) {
  if (!confirm("Na pewno usunąć ten motocykl?")) {
    return;
  }
  MotorcycleDatabase.remove(index);
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
        onclick="openServiceModule()">
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
function saveServiceEntry() {
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
      ServiceModule.updateService(
        window.editingServiceId,
        service
      );
  } else {
    saved =
      ServiceModule.addService(
        service
      );
  }
  if (!saved) return;
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
  renderServiceHistory();
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
function removeService(id) {
  if (
    !confirm(
      "Usunąć ten wpis z historii serwisowej?"
    )
  ) {
    return;
  }
  const deleted =
    ServiceModule.deleteService(id);
  if (deleted) {
    renderServiceHistory();
  }
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
function renderServiceHistory() {
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
          onclick="editService(${service.id})">
          ✏️ Edytuj
        </button>
        <button
          class="danger"
          onclick="removeService(${service.id})">
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
function navigateTo(pageId) {
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
    renderServiceHistory();
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
document.addEventListener(
  "DOMContentLoaded",
  () => {
    VFRApp.init();
  }
);