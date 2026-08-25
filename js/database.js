const MotorcycleDatabase = {

  motorcycles: [],

  activeMotorcycleId: null,

  add(motorcycle) {

    this.motorcycles.push(motorcycle);

    if (this.activeMotorcycleId === null) {
      this.activeMotorcycleId = motorcycle.id;
    }

    this.save();
  },

  remove(index) {

    const removed =
      this.motorcycles[index];

    this.motorcycles.splice(index, 1);

    if (
      removed &&
      removed.id === this.activeMotorcycleId
    ) {
      this.activeMotorcycleId =
        this.motorcycles.length
          ? this.motorcycles[0].id
          : null;
    }

    this.save();
  },

  getAll() {
    return this.motorcycles;
  },

  getActive() {

    return this.motorcycles.find(
      bike =>
        bike.id === this.activeMotorcycleId
    ) || null;
  },

  setActive(id) {

    this.activeMotorcycleId = id;

    this.save();
  },

  save() {

    localStorage.setItem(
      "vfrMasterMotorcycles",
      JSON.stringify(this.motorcycles)
    );

    localStorage.setItem(
      "vfrMasterActiveMotorcycle",
      String(
        this.activeMotorcycleId ?? ""
      )
    );
  },

  load() {

    const saved =
      localStorage.getItem(
        "vfrMasterMotorcycles"
      );

    if (saved) {
      this.motorcycles =
        JSON.parse(saved);
    }

    const active =
      localStorage.getItem(
        "vfrMasterActiveMotorcycle"
      );

    if (active) {
      this.activeMotorcycleId =
        Number(active);
    }

    if (
      !this.activeMotorcycleId &&
      this.motorcycles.length
    ) {
      this.activeMotorcycleId =
        this.motorcycles[0].id;

      this.save();
    }
  }
};

MotorcycleDatabase.load();

window.MotorcycleDatabase =
  MotorcycleDatabase;
