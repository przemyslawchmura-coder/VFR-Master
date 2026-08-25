const VFRApp = {

  init() {
    this.renderGarage();
  },

  getGarage() {
    return MotorcycleDatabase.getAll();
  },

  renderGarage() {

    const container = document.getElementById("garageList");

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
            ${Number(bike.mileage || 0).toLocaleString("pl-PL")} km
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
    alert("Podaj przynajmniej markę i model.");
    return;
  }

  const motorcycle = {

    id: Date.now(),

    brand: brand,
    model: model,
    year: year,
    mileage: mileage,
    vin: vin,
    nickname: nickname,

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

  alert("Motocykl dodany do garażu 🏍️");
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


function deleteMotorcycle(index) {

  if (!confirm("Na pewno usunąć ten motocykl?")) {
    return;
  }

  MotorcycleDatabase.remove(index);

  VFRApp.renderGarage();
}


function escapeHtml(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


window.VFRApp = VFRApp;


document.addEventListener(
  "DOMContentLoaded",
  () => {
    VFRApp.init();
  }
);
