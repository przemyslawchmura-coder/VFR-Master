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

    const container =
      document.getElementById("garageList");

    if (!container) return;

    const bikes = this.getGarage();

    if (bikes.length === 0) {

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
            • ${escapeHtml(bike.year || "")}
          </span>

          <br>

          <span class="muted">
            ${Number(bike.mileage || 0)
              .toLocaleString("pl-PL")} km
          </span>


          <button
            class="secondary"
            onclick="selectMotorcycle(${bike.id})">

            ${active
              ? "✅ AKTYWNY MOTOCYKL"
              : "🏍️ USTAW JAKO AKTYWNY"}

          </button>


          <button
            class="secondary"
            onclick="openBikeCard(${bike.id})">

            🔍 Otwórz kartę motocykla

          </button>


          <button
            class="secondary"
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

    alert(
      "Podaj przynajmniej markę i model."
    );

    return;
  }


  const motorcycle = {

    id: Date.now(),

    brand,
    model,
    year,

    mileage:
      Number(mileage || 0),

    vin,
    nickname,

    services: [],
    costs: [],
    history: []
  };


  MotorcycleDatabase.add(motorcycle);


  document.getElementById("garageBrand").value = "";
  document.getElementById("garageModel").value = "";
  document.getElementById("garageYear").value = "";
  document.getElementById("garageMileage").value = "";
  document.getElementById("garageVin").value = "";
  document.getElementById("garageNickname").value = "";


  VFRApp.renderGarage();


  alert(
    "Motocykl dodany do garażu 🏍️"
  );
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
      bike.brand + " " + bike.model
    );
  }
}


/* =====================================================
   KARTA MOTOCYKLA
   ===================================================== */

function openBikeCard(id) {

  MotorcycleDatabase.setActive(id);

  const bike =
    MotorcycleDatabase.getActive();


  if (!bike) return;


  showBikeCard(bike);
}


function showBikeCard(bike) {

  const container =
    document.getElementById("garageList");


  if (!container) return;


  const services =
    bike.services || [];


  let totalCost = 0;


  services.forEach(service => {

    totalCost +=
      Number(service.partsCost || 0) +
      Number(service.laborCost || 0);

  });


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
              ? escapeHtml(
                  lastService.date
                )
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

        <span class="icon">
          🔧
        </span>

        Serwis

      </button>


      <button
        class="tile"
        onclick="navigateTo('diagnostics')">

        <span class="icon">
          ⚡
        </span>

        Diagnostyka

      </button>


      <button
        class="tile"
        onclick="navigateTo('technical')">

        <span class="icon">
          📖
        </span>

        Dane techniczne

      </button>


      <button
        class="tile"
        onclick="showCosts()">

        <span class="icon">
          💰
        </span>

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
   OTWARCIE MODUŁU SERWISOWEGO
   ===================================================== */

function openServiceModule() {

  navigateTo("service");

  renderServiceHistory();
}


/* =====================================================
   USUWANIE MOTOCYKLA
   ===================================================== */

function deleteMotorcycle(index) {

  if (
    !confirm(
      "Na pewno usunąć ten motocykl?"
    )
  ) {

    return;
  }


  MotorcycleDatabase.remove(index);

  VFRApp.renderGarage();
}


/* =====================================================
   ZAPIS SERWISU
   ===================================================== */

function saveServiceEntry() {

  const service = {

    type:
      document.getElementById(
        "serviceType"
      ).value,


    description:
      document.getElementById(
        "serviceDescription"
      ).value.trim(),


    date:
      document.getElementById(
        "serviceDate"
      ).value,


    mileage:
      document.getElementById(
        "serviceMileage"
      ).value,


    partsCost:
      document.getElementById(
        "servicePartsCost"
      ).value,


    laborCost:
      document.getElementById(
        "serviceLaborCost"
      ).value,


    workshop:
      document.getElementById(
        "serviceWorkshop"
      ).value.trim(),


    note:
      document.getElementById(
        "serviceNote"
      ).value.trim(),


    nextDate:
      document.getElementById(
        "serviceNextDate"
      ).value,


    nextMileage:
      document.getElementById(
        "serviceNextMileage"
      ).value

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


  const saved =
    ServiceModule.addService(
      service
    );


  if (!saved) {
    return;
  }


  clearServiceForm();

  renderServiceHistory();


  alert(
    "Serwis zapisany 🔧"
  );
}


/* =====================================================
   CZYSZCZENIE FORMULARZA
   ===================================================== */

function clearServiceForm() {

  const fields = [

    "serviceDescription",
    "serviceMileage",
    "servicePartsCost",
    "serviceLaborCost",
    "serviceWorkshop",
    "serviceNote",
    "serviceNextDate",
    "serviceNextMileage"

  ];


  fields.forEach(id => {

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


  if (!container) {
    return;
  }


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


  const totalCost =
    ServiceModule.getTotalCost();


  const partsCost =
    ServiceModule.getPartsCost();


  const laborCost =
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

          ${totalCost.toLocaleString(
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

          ${partsCost.toLocaleString(
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

          ${laborCost.toLocaleString(
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

        <br><br>

        Dodaj pierwszy wpis powyżej.

      </div>

    `;


    container.innerHTML = html;

    return;
  }


  html += services.map(service => {

    const total =
      Number(
        service.partsCost || 0
      ) +

      Number(
        service.laborCost || 0
      );


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

                🔔
                Następny serwis:

                ${
                  service.nextDate
                    ? "📅 " +
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
   EDYCJA SERWISU
   ===================================================== */

function editService(id) {

  const services =
    ServiceModule.getServices();


  const service =
    services.find(
      item => item.id === id
    );


  if (!service) {

    alert(
      "Nie znaleziono wpisu."
    );

    return;
  }


  document.getElementById(
    "serviceType"
  ).value =
    service.type || "Inne";


  document.getElementById(
    "serviceDescription"
  ).value =
    service.description || "";


  document.getElementById(
    "serviceDate"
  ).value =
    service.date || "";


  document.getElementById(
    "serviceMileage"
  ).value =
    service.mileage || "";


  document.getElementById(
    "servicePartsCost"
  ).value =
    service.partsCost || "";


  document.getElementById(
    "serviceLaborCost"
  ).value =
    service.laborCost || "";


  document.getElementById(
    "serviceWorkshop"
  ).value =
    service.workshop || "";


  document.getElementById(
    "serviceNote"
  ).value =
    service.note || "";


  document.getElementById(
    "serviceNextDate"
  ).value =
    service.nextDate || "";


  document.getElementById(
    "serviceNextMileage"
  ).value =
    service.nextMileage || "";


  window.editingServiceId =
    id;


  const saveButton =
    document.querySelector(
      '#service button.primary'
    );


  if (saveButton) {

    saveButton.innerHTML =
      "💾 Zapisz zmiany";

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =====================================================
   ZMIANA ZAPISU SERWISU
   ===================================================== */

const originalSaveServiceEntry =
  saveServiceEntry;


saveServiceEntry = function() {

  if (!window.editingServiceId) {

    originalSaveServiceEntry();

    return;
  }


  const service = {

    type:
      document.getElementById(
        "serviceType"
      ).value,


    description:
      document.getElementById(
        "serviceDescription"
      ).value.trim(),


    date:
      document.getElementById(
        "serviceDate"
      ).value,


    mileage:
      document.getElementById(
        "serviceMileage"
      ).value,


    partsCost:
      document.getElementById(
        "servicePartsCost"
      ).value,


    laborCost:
      document.getElementById(
        "serviceLaborCost"
      ).value,


    workshop:
      document.getElementById(
        "serviceWorkshop"
      ).value.trim(),


    note:
      document.getElementById(
        "serviceNote"
      ).value.trim(),


    nextDate:
      document.getElementById(
        "serviceNextDate"
      ).value,


    nextMileage:
      document.getElementById(
        "serviceNextMileage"
      ).value

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


  const saved =
    ServiceModule.updateService(
      window.editingServiceId,
      service
    );


  if (!saved) {

    alert(
      "Nie udało się zaktualizować wpisu."
    );

    return;
  }


  window.editingServiceId =
    null;


  clearServiceForm();


  const saveButton =
    document.querySelector(
      '#service button.primary'
    );


  if (saveButton) {

    saveButton.innerHTML =
      "💾 Zapisz serwis";

  }


  renderServiceHistory();


  alert(
    "Wpis został zaktualizowany ✏️"
  );

};


/* =====================================================
   USUWANIE SERWISU
   ===================================================== */

function removeService(id) {

  const deleted =
    ServiceModule.deleteService(id);


  if (deleted) {

    renderServiceHistory();

  }

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
   BEZPIECZNE HTML
   ===================================================== */

function escapeHtml(text) {

  return String(text)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
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


  if (
    pageId === "garage" &&
    window.VFRApp
  ) {

    VFRApp.renderGarage();

  }


  if (
    pageId === "service"
  ) {

    renderServiceHistory();

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =====================================================
   START SERWISU
   ===================================================== */

function openServiceForActiveBike() {

  navigateTo(
    "service"
  );

}


/* =====================================================
   START APLIKACJI
   ===================================================== */

window.VFRApp =
  VFRApp;


document.addEventListener(
  "DOMContentLoaded",
  () => {

    VFRApp.init();

  }
);