/* =========================================================
   VFR MASTER
   Yamaha FZ1 II generacji, 2006–2015

   Wspólny rdzeń jest współdzielony przez FZ1-N i FZ1-S.
   Warianty nadpisują wyłącznie potwierdzone różnice.

   Główne źródła OEM:
   - Yamaha FZ1-N(V)/FZ1-S(V) Service Manual,
     2D1-28197-E0, wydanie 2006
   - Yamaha FZ1-N/FZ1-NA Owner's Manual,
     wydanie 2011
   - Yamaha FZ1-S/FZ1-SA Owner's Manual,
     1CA-28199-EB, wydanie 2011
   - Yamaha Motor global press information, export model 2006:
     global.yamaha-motor.com/news/2005/0929/fz1.html
   - Yamaha Motor official 2014 Japan specification:
     global.yamaha-motor.com/jp/news/2014/0121/fz1-fazer.html

   Instrukcje rozróżniają rynki oraz wersje z ABS. Dane,
   których nie można bezpiecznie uogólnić na cały zakres
   2006–2015, pozostają celowo niewprowadzone.
   ========================================================= */

const YamahaFZ1Core = {
  model: {
    brand: "Yamaha",
    generation: "II",
    yearFrom: 2006,
    yearTo: 2015
  },

  categories: {
    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // confirmed in Yamaha N/S Owner's Manuals (2011).
    general: {
      title: "📋 Dane ogólne",
      icon: "📋",
      items: {
        generation: {
          name: "Generacja",
          value: "II generacja (2006–2015)"
        },
        variants: {
          name: "Warianty nadwozia",
          value: "FZ1-N (naked) oraz FZ1-S / Fazer (owiewka)"
        }
      }
    },

    // Wymiary wspólne N/S. Wysokość i masa są nadpisywane
    // osobno w wariantach poniżej.
    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    dimensions: {
      title: "📐 Wymiary",
      icon: "📐",
      items: {
        length: {
          name: "Długość całkowita",
          value: "2140 mm"
        },
        width: {
          name: "Szerokość całkowita",
          value: "770 mm"
        },
        seatHeight: {
          name: "Wysokość siedzenia",
          value: "815 mm"
        },
        wheelbase: {
          name: "Rozstaw osi",
          value: "1460 mm"
        },
        groundClearance: {
          name: "Prześwit",
          value: "135 mm"
        },
        turningRadius: {
          name: "Minimalny promień skrętu",
          value: "3000 mm"
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    engine: {
      title: "⚙️ Silnik",
      icon: "⚙️",
      items: {
        type: {
          name: "Typ silnika",
          value: "4-suwowy, DOHC, chłodzony cieczą"
        },
        cylinders: {
          name: "Układ cylindrów",
          value: "4 cylindry rzędowe, pochylone do przodu"
        },
        displacement: {
          name: "Pojemność silnika",
          value: "998 cm³"
        },
        boreStroke: {
          name: "Średnica × skok tłoka",
          value: "77,0 × 53,6 mm"
        },
        starter: {
          name: "Rozrusznik",
          value: "Elektryczny"
        },
        transmission: {
          name: "Skrzynia biegów",
          value: "6-biegowa, o stałym zazębieniu"
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    lubrication: {
      title: "🛢️ Olej i smarowanie",
      icon: "🛢️",
      items: {
        system: {
          name: "Układ smarowania",
          value: "Mokra miska olejowa"
        },
        oilWithoutFilter: {
          name: "Ilość oleju bez wymiany filtra",
          value: "2,90 l"
        },
        oilWithFilter: {
          name: "Ilość oleju z wymianą filtra",
          value: "3,10 l"
        },
        oilTotal: {
          name: "Całkowita ilość oleju",
          value: "3,80 l",
          description: "Wartość serwisowa po całkowitym opróżnieniu układu, nie standardowa ilość przy okresowej wymianie."
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    cooling: {
      title: "💧 Chłodzenie",
      icon: "💧",
      items: {
        system: {
          name: "Układ chłodzenia",
          value: "Chłodzenie cieczą"
        },
        reservoirCapacity: {
          name: "Pojemność zbiornika wyrównawczego",
          value: "0,25 l do poziomu maksymalnego"
        },
        radiatorCapacity: {
          name: "Pojemność chłodnicy z przewodami",
          value: "2,25 l"
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    // Rodzaj/oktanowość paliwa zależy od rynku i nie jest tu
    // prezentowana jako jedna uniwersalna wartość.
    fuel: {
      title: "⛽ Układ paliwowy",
      icon: "⛽",
      items: {
        system: {
          name: "Układ zasilania",
          value: "Wtrysk paliwa"
        },
        tankCapacity: {
          name: "Pojemność zbiornika paliwa",
          value: "18,0 l"
        },
        reserve: {
          name: "Rezerwa paliwa",
          value: "3,4 l"
        }
      }
    },

    // Source: official Yamaha export specification (2006) and
    // official Yamaha Japan FZ1 Fazer specification (2014).
    brakes: {
      title: "🛑 Hamulce",
      icon: "🛑",
      items: {
        frontBrake: {
          name: "Hamulec przedni",
          value: "Hydrauliczny, dwie tarcze"
        },
        rearBrake: {
          name: "Hamulec tylny",
          value: "Hydrauliczny, jedna tarcza"
        }
      }
    },

    // Source: official Yamaha export specification (2006) and
    // official Yamaha Japan FZ1 Fazer specification (2014).
    // Ciśnienia celowo nie dodano bez pełnego potwierdzenia
    // warunków obciążenia dla wszystkich rynków i roczników.
    tires: {
      title: "🛞 Koła i opony",
      icon: "🛞",
      items: {
        frontTire: {
          name: "Opona przednia",
          value: "120/70 ZR17 M/C (58W), bezdętkowa"
        },
        rearTire: {
          name: "Opona tylna",
          value: "190/50 ZR17 M/C (73W), bezdętkowa"
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    drivetrain: {
      title: "🔩 Napęd",
      icon: "🔩",
      items: {
        finalDrive: {
          name: "Napęd końcowy",
          value: "Łańcuch"
        },
        secondaryRatio: {
          name: "Przełożenie wtórne",
          value: "2,647 (45/17)"
        },
        clutch: {
          name: "Sprzęgło",
          value: "Mokre, wielotarczowe"
        }
      }
    },

    // Source: Yamaha Service Manual 2D1-28197-E0 (2006),
    // Yamaha N/S Owner's Manuals (2011), Specifications.
    spark: {
      title: "⚡ Zapłon",
      icon: "⚡",
      items: {
        sparkPlug: {
          name: "Świeca zapłonowa",
          value: "NGK CR9E"
        },
        sparkPlugGap: {
          name: "Przerwa elektrody świecy",
          value: "0,7–0,8 mm"
        }
      }
    },

    // Celowo puste: momenty wymagają potwierdzenia dla danego
    // rocznika, rynku oraz konkretnej wersji wyposażenia.
    torque: {
      title: "🔧 Momenty dokręcania",
      icon: "🔧",
      items: {}
    },

    // Celowo puste: harmonogramy różnią się między wydaniami
    // instrukcji i rynkami.
    maintenance: {
      title: "📅 Obsługa okresowa",
      icon: "📅",
      items: {}
    },

    // Source: Yamaha N/S Owner's Manuals (2011), rozdział
    // Multi-function meter unit / Self-diagnosis device.
    diagnostics: {
      title: "🚨 Diagnostyka",
      icon: "🚨",
      items: {
        selfDiagnosis: {
          name: "Samodiagnostyka",
          value: "Wyświetlacz wielofunkcyjny pokazuje kod błędu",
          description: "Zanotuj kod i skonsultuj motocykl z serwisem Yamaha. Lista kodów nie została dodana bez kompletnej dokumentacji dla danego rocznika."
        }
      }
    }
  }
};

function createYamahaFZ1Variant({ model, variant, overrides }) {
  const categories = Object.fromEntries(
    Object.entries(YamahaFZ1Core.categories)
      .map(([categoryId, category]) => {
        const categoryOverride = overrides[categoryId] || {};

        return [categoryId, {
          ...category,
          ...categoryOverride,
          items: {
            ...category.items,
            ...(categoryOverride.items || {})
          }
        }];
      })
  );

  return {
    model: {
      ...YamahaFZ1Core.model,
      brand: "Yamaha",
      model,
      variant
    },
    categories,
    getCategory(category) {
      return this.categories[category] || null;
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
}

// Source: Yamaha Service Manual 2D1-28197-E0 (2006) and
// Yamaha FZ1-N/FZ1-NA Owner's Manual (2011).
const YamahaFZ1NTechnical = createYamahaFZ1Variant({
  model: "FZ1-N",
  variant: "N — naked",
  overrides: {
    dimensions: {
      items: {
        overallHeight: {
          name: "Wysokość całkowita",
          value: "1060 mm"
        },
        curbWeight: {
          name: "Masa gotowa do jazdy",
          value: "214 kg (FZ1-N); 221 kg (FZ1-NA z ABS)",
          description: "Wersja ABS ma inną masę. Oznaczenia i dostępność zależą od rynku."
        },
        bodywork: {
          name: "Nadwozie",
          value: "Wersja naked, bez przedniej owiewki FZ1-S"
        }
      }
    }
  }
});

// Source: Yamaha Service Manual 2D1-28197-E0 (2006) and
// Yamaha FZ1-S/FZ1-SA Owner's Manual 1CA-28199-EB (2011).
const YamahaFZ1STechnical = createYamahaFZ1Variant({
  model: "FZ1-S",
  variant: "S / Fazer — owiewka",
  overrides: {
    dimensions: {
      items: {
        overallHeight: {
          name: "Wysokość całkowita",
          value: "1205 mm"
        },
        curbWeight: {
          name: "Masa gotowa do jazdy",
          value: "220 kg (FZ1-S); 226 kg (FZ1-SA z ABS)",
          description: "Wersja ABS ma inną masę. Oznaczenia i dostępność zależą od rynku."
        },
        bodywork: {
          name: "Nadwozie",
          value: "Wersja Fazer z przednią owiewką"
        }
      }
    }
  }
});

window.YamahaFZ1Core = YamahaFZ1Core;
window.YamahaFZ1NTechnical = YamahaFZ1NTechnical;
window.YamahaFZ1STechnical = YamahaFZ1STechnical;

window.TechnicalDatabase.register({
  brand: "Yamaha",
  model: "FZ1-N",
  aliases: ["FZ1 N", "FZ1N", "FZ1 Naked"],
  yearFrom: 2006,
  yearTo: 2015,
  catalogVariantKeys: ["yamaha.fz1.gen2.n"],
  database: YamahaFZ1NTechnical
});

window.TechnicalDatabase.register({
  brand: "Yamaha",
  model: "FZ1-S",
  aliases: ["FZ1 S", "FZ1S", "FZ1 Fazer", "Fazer FZ1"],
  yearFrom: 2006,
  yearTo: 2015,
  catalogVariantKeys: ["yamaha.fz1.gen2.s"],
  database: YamahaFZ1STechnical
});

window.TechnicalDatabase.registerAmbiguity({
  brand: "Yamaha",
  model: "FZ1",
  yearFrom: 2006,
  yearTo: 2015,
  message: "Wybierz wariant Yamaha FZ1: N (naked) lub S (owiewka)."
});
