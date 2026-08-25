const VFRApp = {

  init() {
    console.log("VFR Master uruchomiony");

    if (window.VFR800_2002) {
      console.log(
        "Załadowano bazę:",
        VFR800_2002.manufacturer,
        VFR800_2002.model,
        VFR800_2002.year
      );
    }

    if (window.MotorcycleDatabase) {
      console.log(
        "Liczba motocykli w garażu:",
        MotorcycleDatabase.getAll().length
      );
    }
  },

  getBikeData() {
    return window.VFR800_2002;
  },

  getGarage() {
    return window.MotorcycleDatabase.getAll();
  }
};

window.VFRApp = VFRApp;

document.addEventListener("DOMContentLoaded", () => {
  VFRApp.init();
});
