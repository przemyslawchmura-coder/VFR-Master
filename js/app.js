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
    mileage,
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

          ${Number(bike.mileage || 0)
            .toLocaleString("pl-PL")}

        </div>

        <div class="stat-label">
          Przebieg km
        </div>

      </div>


      <div class="stat">

        <div class="stat-value">

          ${bike.services
            ? bike.services.length
            : 0}

        </div>

        <div class="stat-label">
          Serwisy
        </div>

      </div>

    </div>


    <div class="grid">

      <button
        class="tile"
        onclick="alert('Moduł serwisowy — następny etap 🔧')">

        <span class="icon">🔧</span>

        Serwis

      </button>


      <button
        class="tile"
        onclick="alert('Moduł diagnostyczny — następny etap ⚡')">

        <span class="icon">⚡</span>

        Diagnostyka

      </button>


      <button
        class="tile"
        onclick="alert('Baza techniczna — budujemy ją teraz 📖')">

        <span class="icon">📖</span>

        Dane techniczne

      </button>


      <button
        class="tile"
        onclick="alert('Moduł kosztów — następny etap 💰')">

        <span class="icon">💰</span>

        Koszty

      </button>

    </div>


    <div class="card">

      <h3>📋 Informacje</h3>

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


window.VFRApp =
  VFRApp;


document.addEventListener(
  "DOMContentLoaded",
  () => {

    VFRApp.init();

  }
);
