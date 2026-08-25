const VFR800_2002 = {
  manufacturer: "Honda",
  model: "VFR800 VTEC",
  generation: "RC46",
  year: 2002,

  engine: {
    type: "V4",
    displacement: "782 cm³",
    cooling: "Ciecz",
    fuelSystem: "PGM-FI",
    transmission: "6-biegowa"
  },

  service: {
    valveClearance: {
      standard: {
        intake: "0.20 ± 0.03 mm",
        exhaust: "0.35 ± 0.03 mm"
      },
      vtec: {
        intake: "0.25 ± 0.03 mm",
        exhaust: "0.30 ± 0.03 mm"
      }
    }
  },

  electrical: {
    systemVoltage: "12 V",
    chargingSystem: "Alternator"
  },

  tires: {
    front: "120/70 ZR17",
    rear: "180/55 ZR17"
  }
};

window.VFR800_2002 = VFR800_2002;
