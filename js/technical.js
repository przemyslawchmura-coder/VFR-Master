const VFRTechnical = {

  getData(bike) {

    if (!bike) return null;

    return {

      model: "Honda VFR800 VTEC",
      year: 2002,

      engine: {
        type: "V4, DOHC, VTEC",
        displacement: "782 cm³",
        bore: "72.0 mm",
        stroke: "48.0 mm",
        cooling: "Ciecz",
        lubrication: "Mokra miska olejowa",
        fuelSystem: "PGM-FI",
        transmission: "6-biegowa"
      },

      fuel: {
        tankCapacity: "22.0 l",
        system: "PGM-FI",
        throttleBore: "36 mm"
      },

      oil: {
        recommendedViscosity: "SAE 10W-40",
        specification: "JASO MA",
        afterDraining: "2.9 l",
        afterFilterChange: "3.1 l",
        afterEngineDisassembly: "3.8 l"
      },

      cooling: {
        capacity: "1.6 l",
        thermostatStart: "84°C",
        thermostatFullyOpen: "96°C",
        coolantType:
          "Płyn na bazie glikolu etylenowego z inhibitorami korozji",
        standardMixture:
          "50% płyn / 50% miękka woda"
      },

      valves: {

        normalVFRSide: {
          intake: "0.20 ± 0.03 mm",
          exhaust: "0.35 ± 0.03 mm"
        },

        vtecSide: {
          intake: "0.20 ± 0.08 mm",
          exhaust: "0.35 ± 0.08 mm"
        }
      },

      sparkPlug: {
        gap: "0.80–0.90 mm"
      },

      idle: {
        rpm: "1,200 ± 100 rpm"
      },

      tires: {

        front:
          "120/70 ZR17",

        rear:
          "180/55 ZR17",

        pressureSolo: {
          front: "250 kPa / 36 psi",
          rear: "290 kPa / 42 psi"
        },

        pressureWithPassenger: {
          front: "250 kPa / 36 psi",
          rear: "290 kPa / 42 psi"
        }
      },

      brakes: {
        front: "Hydrauliczne, podwójna tarcza",
        rear: "Hydrauliczne, pojedyncza tarcza",
        fluid: "DOT 4"
      },

      electrical: {
        ignition:
          "Komputerowo sterowany zapłon tranzystorowy",
        alternator:
          "Trójfazowy",
        regulator:
          "Regulator/prostownik"
      },

      torque: {

        oilDrainBolt:
          "29 N·m",

        oilFilter:
          "26 N·m",

        sparkPlug:
          "12 N·m",

        timingHoleCap:
          "18 N·m",

        driveSprocket:
          "51 N·m",

        finalDrivenSprocket:
          "64 N·m"
      }

    };
  },


  getSection(
    section,
    bike
  ) {

    const data =
      this.getData(bike);

    if (!data) {
      return null;
    }

    return data[section] || null;
  }

};


window.VFRTechnical =
  VFRTechnical;