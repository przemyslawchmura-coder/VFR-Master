const MotorcycleDatabase = {

  motorcycles: [],

  add(motorcycle) {
    this.motorcycles.push(motorcycle);
    this.save();
  },

  remove(index) {
    this.motorcycles.splice(index, 1);
    this.save();
  },

  getAll() {
    return this.motorcycles;
  },

  save() {
    localStorage.setItem(
      "vfrMasterMotorcycles",
      JSON.stringify(this.motorcycles)
    );
  },

  load() {
    const saved = localStorage.getItem(
      "vfrMasterMotorcycles"
    );

    if (saved) {
      this.motorcycles = JSON.parse(saved);
    }
  }
};

MotorcycleDatabase.load();

window.MotorcycleDatabase = MotorcycleDatabase;
