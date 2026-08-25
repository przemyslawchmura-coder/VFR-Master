/* =========================================================
   VFR MASTER
   BAZA TECHNICZNA — HONDA VFR800 VTEC 2002
   ========================================================= */
const VFRTechnical = {
  model: {
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002
  },
  data: {
    engine: {
      title: "🔥 Silnik",
      icon: "🔥",
      items: [
        ["Typ silnika", "V4, DOHC, VTEC"],
        ["Pojemność", "782 cm³"],
        ["Średnica cylindra", "72,0 mm"],
        ["Skok tłoka", "48,0 mm"],
        ["Chłodzenie", "Cieczą"],
        ["Układ rozrządu", "DOHC"],
        ["Zasilanie", "PGM-FI"],
        ["Skrzynia biegów", "6-biegowa"]
      ]
    },
    oil: {
      title: "🛢️ Olej i smarowanie",
      icon: "🛢️",
      items: [
        ["Zalecana lepkość", "SAE 10W-40"],
        ["Specyfikacja", "JASO MA"],
        ["Po zwykłym spuszczeniu", "2,9 l"],
        ["Po wymianie filtra", "3,1 l"],
        ["Po całkowitym demontażu silnika", "3,8 l"]
      ]
    },
    cooling: {
      title: "💧 Układ chłodzenia",
      icon: "💧",
      items: [
        ["Pojemność układu", "1,6 l"],
        ["Początek otwarcia termostatu", "84°C"],
        ["Pełne otwarcie termostatu", "96°C"],
        [
          "Zalecana mieszanka",
          "50% płyn chłodniczy / 50% miękka woda"
        ]
      ]
    },
    valves: {
      title: "🔧 Zawory",
      icon: "🔧",
      items: [
        ["Ssące", "0,20 ± 0,03 mm"],
        ["Wydechowe", "0,35 ± 0,03 mm"]
      ],
      note:
        "Dane dotyczą kontroli luzu zaworowego. " +
        "Procedurę regulacji oraz elementy mechanizmu VTEC " +
        "dodamy w osobnym module diagnostyczno-serwisowym."
    },
    fuel: {
      title: "⛽ PGM-FI / Paliwo",
      icon: "⛽",
      items: [
        ["Układ zasilania", "Honda PGM-FI"],
        ["Pojemność zbiornika", "22,0 l"],
        ["Średnica przepustnicy", "36 mm"]
      ]
    },
    electrical: {
      title: "⚡ Elektryka",
      icon: "⚡",
      items: [
        ["Zapłon", "Tranzystorowy, sterowany elektronicznie"],
        ["Alternator", "Trójfazowy"],
        ["Układ ładowania", "Regulator / prostownik"]
      ]
    },
    tires: {
      title: "🛞 Koła i opony",
      icon: "🛞",
      items: [
        ["Przód", "120/70 ZR17"],
        ["Tył", "180/55 ZR17"],
        ["Ciśnienie przód", "250 kPa / 36 psi"],
        ["Ciśnienie tył", "290 kPa / 42 psi"]
      ]
    },
    brakes: {
      title: "🛑 Hamulce",
      icon: "🛑",
      items: [
        ["Przód", "Podwójna tarcza hydrauliczna"],
        ["Tył", "Pojedyncza tarcza hydrauliczna"],
        ["Płyn hamulcowy", "DOT 4"]
      ]
    },
    torque: {
      title: "🔩 Momenty dokręcania",
      icon: "🔩",
      items: [
        ["Korek spustowy oleju", "29 N·m"],
        ["Filtr oleju", "26 N·m"],
        ["Świeca zapłonowa", "12 N·m"],
        ["Korek otworu kontrolnego", "18 N·m"],
        ["Zębatka zdawcza", "51 N·m"],
        ["Zębatka tylna", "64 N·m"]
      ],
      note:
        "Przed użyciem konkretnego momentu podczas naprawy " +
        "należy sprawdzić odpowiednią procedurę w dokumentacji serwisowej."
    },
    idle: {
      title: "📈 Regulacja silnika",
      icon: "📈",
      items: [
        ["Prędkość biegu jałowego", "1 200 ± 100 obr./min"],
        ["Przerwa elektrod świecy", "0,80–0,90 mm"]
      ]
    }
  },
  get(section) {
    return this.data[section] || null;
  },
  getAll() {
    return this.data;
  },
  getModel() {
    return this.model;
  }
};
window.VFRTechnical = VFRTechnical;