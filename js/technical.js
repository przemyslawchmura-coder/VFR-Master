/*
=========================================================
 VFR MASTER
 BAZA TECHNICZNA
 Honda VFR800 VTEC 2002
=========================================================
*/
const VFRTechnical = {
  model: {
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002
  },
  categories: {
    general: {
      title: "📋 Dane ogólne",
      icon: "📋",
      items: {
        displacement: {
          name: "Pojemność silnika",
          value: "782 cm³",
          description: "Czterocylindrowy silnik V4 z systemem VTEC."
        },
        bore: {
          name: "Średnica cylindra",
          value: "72,0 mm"
        },
        stroke: {
          name: "Skok tłoka",
          value: "48,0 mm"
        },
        compression: {
          name: "Stopień sprężania",
          value: "11,6 : 1"
        },
        cooling: {
          name: "Chłodzenie",
          value: "Ciecz"
        },
        lubrication: {
          name: "Smarowanie",
          value: "Mokre, wymuszone ciśnieniowo"
        },
        fuelSystem: {
          name: "Układ zasilania",
          value: "PGM-FI"
        },
        throttleBody: {
          name: "Średnica przepustnicy",
          value: "36 mm"
        },
        cylinders: {
          name: "Liczba cylindrów",
          value: "4"
        },
        valveTrain: {
          name: "Rozrząd",
          value: "DOHC + VTEC"
        },
        transmission: {
          name: "Skrzynia biegów",
          value: "6-biegowa"
        }
      }
    },
    dimensions: {
      title: "📐 Wymiary",
      icon: "📐",
      items: {
        length: {
          name: "Długość całkowita",
          value: "2120 mm"
        },
        width: {
          name: "Szerokość całkowita",
          value: "735 mm"
        },
        wheelbase: {
          name: "Rozstaw osi",
          value: "1460 mm"
        },
        seatHeight: {
          name: "Wysokość siedzenia",
          value: "805 mm"
        },
        groundClearance: {
          name: "Prześwit",
          value: "125 mm"
        },
        fuelCapacity: {
          name: "Pojemność zbiornika",
          value: "22,0 l"
        }
      }
    },
    engine: {
      title: "⚙️ Silnik",
      icon: "⚙️",
      items: {
        idle: {
          name: "Prędkość biegu jałowego",
          value: "1200 ± 100 obr./min"
        },
        firingOrder: {
          name: "Kolejność zapłonu",
          value: "1 → 3 → 2 → 4"
        },
        starter: {
          name: "Rozrusznik",
          value: "Elektryczny"
        },
        alternator: {
          name: "Alternator",
          value: "Trójfazowy"
        },
        ignition: {
          name: "Zapłon",
          value: "Elektroniczny, tranzystorowy"
        }
      }
    },
    vtec: {
      title: "🔥 VTEC",
      icon: "🔥",
      items: {
        system: {
          name: "System",
          value: "Honda VTEC"
        },
        normalIntake: {
          name: "Luzy zaworowe — ssące, strona normalna",
          value: "0,20 ± 0,03 mm"
        },
        normalExhaust: {
          name: "Luzy zaworowe — wydechowe, strona normalna",
          value: "0,35 ± 0,03 mm"
        },
        vtecIntake: {
          name: "Luzy zaworowe — ssące, VTEC",
          value: "0,25 ± 0,03 mm"
        },
        vtecExhaust: {
          name: "Luzy zaworowe — wydechowe, VTEC",
          value: "0,30 ± 0,03 mm"
        },
        note: {
          name: "Uwaga",
          value:
            "Regulacja zaworów wymaga przestrzegania procedury ustawienia wału i pozycji VTEC."
        }
      }
    },
    lubrication: {
      title: "🛢️ Olej i smarowanie",
      icon: "🛢️",
      items: {
        oilAfterDrain: {
          name: "Olej po spuszczeniu",
          value: "2,9 l"
        },
        oilWithFilter: {
          name: "Olej + filtr",
          value: "3,1 l"
        },
        oilAfterDisassembly: {
          name: "Po całkowitym rozebraniu silnika",
          value: "3,8 l"
        },
        oilViscosity: {
          name: "Zalecana lepkość",
          value: "SAE 10W-40"
        },
        oilSpecification: {
          name: "Specyfikacja",
          value: "API SF / SG lub wyższa, JASO MA"
        },
        drainBoltTorque: {
          name: "Korek spustowy oleju",
          value: "29 N·m"
        },
        oilFilterTorque: {
          name: "Filtr oleju",
          value: "26 N·m"
        },
        oilPressure: {
          name: "Ciśnienie oleju",
          value: "480 kPa przy 6000 obr./min i 80°C"
        }
      }
    },
    cooling: {
      title: "💧 Chłodzenie",
      icon: "💧",
      items: {
        coolantCapacity: {
          name: "Pojemność układu",
          value: "2,6 l"
        },
        coolantMixture: {
          name: "Standardowa mieszanka",
          value: "50% płyn / 50% woda miękka"
        },
        thermostatOpening: {
          name: "Początek otwierania termostatu",
          value: "80–84°C"
        },
        thermostatFullyOpen: {
          name: "Pełne otwarcie termostatu",
          value: "96°C"
        },
        radiatorCap: {
          name: "Ciśnienie otwarcia korka chłodnicy",
          value: "108–137 kPa"
        }
      }
    },
    fuel: {
      title: "⛽ PGM-FI",
      icon: "⛽",
      items: {
        system: {
          name: "Układ",
          value: "PGM-FI — Programmed Fuel Injection"
        },
        throttleBody: {
          name: "Korpus przepustnicy",
          value: "36 mm"
        },
        throttleFreePlay: {
          name: "Luz manetki gazu",
          value: "2–6 mm"
        },
        fuelPressure: {
          name: "Ciśnienie paliwa",
          value: "250 kPa"
        },
        fuelPumpFlow: {
          name: "Minimalna wydajność pompy",
          value: "150 cm³ / 10 s przy 12 V"
        },
        mapSensorIdle: {
          name: "MAP — podciśnienie na biegu jałowym",
          value: "200–250 mmHg"
        }
      }
    },
    brakes: {
      title: "🛑 Hamulce",
      icon: "🛑",
      items: {
        front: {
          name: "Hamulce przednie",
          value: "Hydrauliczne, podwójna tarcza"
        },
        rear: {
          name: "Hamulec tylny",
          value: "Hydrauliczny, pojedyncza tarcza"
        },
        fluid: {
          name: "Płyn hamulcowy",
          value: "DOT 4"
        }
      }
    },
    tires: {
      title: "🛞 Koła i opony",
      icon: "🛞",
      items: {
        frontSize: {
          name: "Opona przednia",
          value: "120/70 ZR17 M/C"
        },
        rearSize: {
          name: "Opona tylna",
          value: "180/55 ZR17 M/C"
        },
        frontPressureSolo: {
          name: "Ciśnienie przód — kierowca",
          value: "250 kPa / 2,50 bar / 36 psi"
        },
        rearPressureSolo: {
          name: "Ciśnienie tył — kierowca",
          value: "290 kPa / 2,90 bar / 42 psi"
        },
        frontPressurePassenger: {
          name: "Ciśnienie przód — kierowca + pasażer",
          value: "250 kPa / 2,50 bar / 36 psi"
        },
        rearPressurePassenger: {
          name: "Ciśnienie tył — kierowca + pasażer",
          value: "290 kPa / 2,90 bar / 42 psi"
        },
        minimumTread: {
          name: "Minimalna głębokość bieżnika",
          value: "2,0 mm"
        }
      }
    },
    drivetrain: {
      title: "🔩 Napęd",
      icon: "🔩",
      items: {
        transmission: {
          name: "Skrzynia",
          value: "6-biegowa"
        },
        clutch: {
          name: "Sprzęgło",
          value: "Wielotarczowe, mokre, hydrauliczne"
        },
        primaryReduction: {
          name: "Przełożenie pierwotne",
          value: "1,939"
        },
        finalReduction: {
          name: "Przełożenie końcowe",
          value: "2,687"
        },
        chainSlack: {
          name: "Luz łańcucha",
          value: "25–35 mm"
        },
        driveSprocketTorque: {
          name: "Śruba przedniej zębatki",
          value: "51 N·m"
        },
        drivenSprocketTorque: {
          name: "Nakrętka tylnej zębatki",
          value: "64 N·m"
        }
      }
    },
    spark: {
      title: "⚡ Zapłon",
      icon: "⚡",
      items: {
        plugTorque: {
          name: "Moment dokręcania świecy",
          value: "12 N·m"
        },
        ignitionType: {
          name: "Rodzaj zapłonu",
          value: "Cyfrowy, tranzystorowy"
        }
      }
    },
    torque: {
      title: "🔧 Momenty dokręcania",
      icon: "🔧",
      items: {
        oilDrain: {
          name: "Korek spustowy oleju",
          value: "29 N·m"
        },
        oilFilter: {
          name: "Filtr oleju",
          value: "26 N·m"
        },
        sparkPlug: {
          name: "Świeca zapłonowa",
          value: "12 N·m"
        },
        timingHoleCap: {
          name: "Korek otworu kontrolnego",
          value: "18 N·m"
        },
        rearAxleHolder: {
          name: "Śruba zaciskowa uchwytu osi tylnej",
          value: "74 N·m"
        },
        driveSprocket: {
          name: "Śruba zębatki napędowej",
          value: "51 N·m"
        },
        drivenSprocket: {
          name: "Nakrętka zębatki napędzanej",
          value: "64 N·m"
        },
        rearMasterCylinderJoint: {
          name: "Nakrętka przegubu pompy tylnego hamulca",
          value: "18 N·m"
        },
        camshaftHolder: {
          name: "Uchwyt wałka rozrządu",
          value: "12 N·m"
        }
      }
    },
    maintenance: {
      title: "📅 Obsługa okresowa",
      icon: "📅",
      items: {
        oil: {
          name: "Olej silnikowy",
          value: "Kontrola / wymiana wg harmonogramu"
        },
        oilFilter: {
          name: "Filtr oleju",
          value: "Wymiana wg harmonogramu"
        },
        valveClearance: {
          name: "Luzy zaworowe",
          value: "Kontrola wg harmonogramu"
        },
        airFilter: {
          name: "Filtr powietrza",
          value: "Kontrola / wymiana wg harmonogramu"
        },
        sparkPlugs: {
          name: "Świece",
          value: "Kontrola / wymiana wg harmonogramu"
        },
        coolant: {
          name: "Płyn chłodniczy",
          value: "Kontrola / wymiana wg harmonogramu"
        },
        brakeFluid: {
          name: "Płyn hamulcowy",
          value: "Kontrola / wymiana wg harmonogramu"
        },
        chain: {
          name: "Łańcuch napędowy",
          value: "Kontrola, czyszczenie, smarowanie i regulacja"
        }
      }
    },
    diagnostics: {
      title: "🚨 Diagnostyka",
      icon: "🚨",
      items: {
        engineLight: {
          name: "Kontrolka FI",
          value: "Diagnostyka układu PGM-FI"
        },
        fuelPressure: {
          name: "Ciśnienie paliwa",
          value: "250 kPa"
        },
        injectorResistance: {
          name: "Rezystancja wtryskiwacza",
          value: "10–13 Ω przy 20°C"
        },
        ectResistance: {
          name: "Czujnik temperatury ECT",
          value: "Około 2,3–2,6 kΩ przy 20°C"
        },
        iatResistance: {
          name: "Czujnik temperatury powietrza IAT",
          value: "Około 2,3–2,6 kΩ przy 20°C"
        },
        idleMap: {
          name: "MAP na biegu jałowym",
          value: "200–250 mmHg"
        }
      }
    }
  },
  get(category, item) {
    if (
      !this.categories[category] ||
      !this.categories[category].items[item]
    ) {
      return null;
    }
    return this.categories[category].items[item];
  },
  getCategory(category) {
    return this.categories[category] || null;
  },
  getAll() {
    return this.categories;
  },
  getCategoryList() {
    return Object.entries(this.categories)
      .map(([id, category]) => ({
        id,
        title: category.title,
        icon: category.icon
      }));
  }
};
/*
=========================================================
 GLOBAL
=========================================================
*/
window.VFRTechnical = VFRTechnical;

// Rejestracje kolejnych modeli umieszczamy w ich osobnych
// plikach, ładowanych po technical-database.js.
window.TechnicalDatabase.register({
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKeys: [
    "honda.vfr800.rc46.vtec.gen1"
  ],
  database: VFRTechnical
});
