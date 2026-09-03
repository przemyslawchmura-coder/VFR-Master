(function attachTechnicalProfilePresentation(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfilePresentation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPresentation() {
  "use strict";

  const CATEGORY_LABELS = Object.freeze({
    general: "Dane ogólne", lubrication: "Olej i filtry", cooling: "Układ chłodzenia", ignition: "Świece i zapłon", valves: "Zawory i VTEC", wheels: "Koła i opony", "final-drive": "Napęd końcowy", brakes: "Hamulce", electrical: "Instalacja elektryczna", fuses: "Bezpieczniki", lighting: "Oświetlenie", adjustments: "Regulacje", maintenance: "Obsługa okresowa", consumables: "Części eksploatacyjne", torques: "Momenty dokręcania"
  });
  const ENTRY_LABELS = Object.freeze({
    "ignition.spark-plug.standard": "Zalecana świeca zapłonowa",
    "lubrication.engine-oil.specification": "Specyfikacja oleju silnikowego",
    "lubrication.engine-oil.viscosity": "Lepkość oleju silnikowego",
    "lubrication.engine-oil.capacity-drain": "Ilość oleju po spuszczeniu",
    "lubrication.engine-oil.capacity-with-filter": "Ilość oleju z wymianą filtra",
    "lubrication.engine-oil.capacity-overhaul": "Ilość oleju po rozbiórce silnika",
    "cooling.coolant.specification": "Specyfikacja płynu chłodniczego",
    "cooling.coolant.capacity-engine-radiator": "Pojemność układu chłodzenia — silnik i chłodnice",
    "cooling.coolant.capacity-reserve": "Pojemność zbiornika wyrównawczego",
    "valves.clearance.intake-standard": "Luz zaworowy dolotowy",
    "valves.clearance.exhaust-standard": "Luz zaworowy wydechowy",
    "final-drive.chain.slack": "Luz łańcucha",
    "brakes.fluid.specification": "Specyfikacja płynu hamulcowego",
    "electrical.battery.capacity": "Pojemność akumulatora",
    "electrical.battery.specification": "Akumulator",
    "wheels.tire-pressure.front": "Ciśnienie przedniej opony",
    "wheels.tire-pressure.rear": "Ciśnienie tylnej opony"
  });
  const DOCUMENT_TITLE_LABELS = Object.freeze({
    "Honda VFR800/VFR800A 2002 Service Manual": "Instrukcja serwisowa Honda VFR800/VFR800A 2002",
    "2002 VFR800/A Owner Manual": "Instrukcja obsługi VFR800/A 2002",
    "Monster 937 / 937 Plus Owner's Manual": "Instrukcja obsługi Monster 937 / 937 Plus"
  });
  const STATUS_LABELS = Object.freeze({ verified: "Zweryfikowane", "pending-verification": "Do weryfikacji", "conflicting-sources": "Sprzeczne źródła", "legacy-unverified": "Niezweryfikowane", deprecated: "Wycofane" });
  const TEXT_VALUE_LABELS = Object.freeze({
    "brakes.fluid.specification": Object.freeze({ "Front/rear brake circuit: DOT 4": "Obwód hamulca przedni/tylny: DOT 4" })
  });
  const CORE_SEGMENT_LABELS = Object.freeze({
    engine: "Silnik", service: "Obsługa", limits: "ograniczenia", configuration: "konfiguracja", displacement: "pojemność silnika", bore: "średnica cylindra", stroke: "skok tłoka", "compression-ratio": "stopień sprężania",
    dimensions_mass: "wymiary i masa", "wet-kerb-mass": "masa własna z płynami", "dry-mass": "masa sucha", "seat-height": "wysokość siedzenia", wheelbase: "rozstaw osi",
    steering_chassis: "układ jezdny", rake: "kąt główki ramy", trail: "wyprzedzenie", fuel_intake: "zasilanie", "fuel-type-octane": "liczba oktanowa paliwa",
    transmission_clutch: "skrzynia i sprzęgło", "transmission-type": "skrzynia biegów", "clutch-type": "sprzęgło", tires_wheels: "koła i opony", "oem-tire-models": "model opon", "rim-sizes": "rozmiary obręczy",
    final_drive: "napęd końcowy", "final-ratio": "przełożenie końcowe", "chain-size": "łańcuch napędowy", "front-sprocket": "przednia zębatka", "rear-sprocket": "tylna zębatka", "oem-chain-sprocket": "łańcuch i zębatki",
    brakes: "hamulce", "disc-diameter": "średnica tarcz", "disc-thickness": "grubość tarcz", "disc-service-limit": "granica zużycia tarcz", electrical: "instalacja elektryczna", "alternator-output": "wydajność alternatora", "fuse-ratings": "bezpieczniki",
    lighting: "oświetlenie", "combined-high-low": "reflektor mijania i drogowy", "front-indicators": "przednie kierunkowskazy", "rear-indicators": "tylne kierunkowskazy", "rear-tail": "tylne światło pozycyjne", "brake-light": "światło hamowania", "license-plate": "oświetlenie tablicy",
    maintenance: "obsługa okresowa", inspect: "kontrola", replace: "wymiana", adjust: "regulacja", lubricate: "smarowanie", clean: "czyszczenie", "severe-use": "trudne warunki eksploatacji"
  });
  const CORE_FIELD_LABELS = Object.freeze({
    "engine.service-limits": "Ograniczenia pracy silnika", "engine.configuration": "Konfiguracja silnika", "engine.displacement": "Pojemność skokowa silnika", "engine.compression-ratio": "Stopień sprężania", "engine.bore": "Średnica cylindra", "engine.stroke": "Skok tłoka",
    "dimensions_mass.wet-kerb-mass": "Masa własna z płynami", "dimensions_mass.dry-mass": "Masa sucha", "dimensions_mass.seat-height": "Wysokość siedzenia", "dimensions_mass.wheelbase": "Rozstaw osi",
    "steering_chassis.rake": "Kąt główki ramy", "steering_chassis.trail": "Wyprzedzenie", "fuel_intake.fuel-type-octane": "Liczba oktanowa paliwa", "transmission_clutch.transmission-type": "Typ skrzyni biegów", "transmission_clutch.clutch-type": "Typ sprzęgła",
    "tires_wheels.oem-tire-models": "Model opon", "tires_wheels.rim-sizes": "Rozmiary obręczy", "final_drive.final-ratio": "Przełożenie napędu końcowego", "final_drive.chain-size": "Rozmiar łańcucha napędowego", "final_drive.front-sprocket": "Przednia zębatka", "final_drive.rear-sprocket": "Tylna zębatka", "final_drive.oem-chain-sprocket": "Łańcuch i zębatki",
    "brakes.disc-diameter": "Średnica tarcz hamulcowych", "brakes.disc-thickness": "Grubość tarcz hamulcowych", "brakes.disc-service-limit": "Granica zużycia tarcz hamulcowych", "electrical.alternator-output": "Wydajność alternatora", "electrical.fuse-ratings": "Parametry bezpieczników",
    "lighting.combined-high-low": "Reflektor — światła mijania i drogowe", "lighting.front-indicators": "Przednie kierunkowskazy", "lighting.rear-indicators": "Tylne kierunkowskazy", "lighting.rear-tail": "Tylne światło pozycyjne", "lighting.brake-light": "Światło hamowania", "lighting.license-plate": "Oświetlenie tablicy rejestracyjnej",
    "maintenance.inspect": "Kontrola okresowa", "maintenance.replace": "Wymiana okresowa", "maintenance.adjust": "Regulacja okresowa", "maintenance.clean": "Czyszczenie okresowe", "maintenance.lubricate": "Smarowanie okresowe", "maintenance.severe-use": "Trudne warunki eksploatacji"
  });
  const CORE_TEXT_REPLACEMENTS = Object.freeze([
    ["Dealer operations include checking and/or adjusting", "Czynności serwisowe obejmują kontrolę i/lub regulację"], ["Customer operations", "Czynności użytkownika"], ["Customer operation", "Czynność użytkownika"], ["Front and rear", "Przednia i tylna"], ["Front disc maximum wear", "Maksymalne zużycie przedniej tarczy"], ["rear disc maximum wear", "maksymalne zużycie tylnej tarczy"], ["Front disc thickness", "Grubość przedniej tarczy"], ["rear disc thickness", "grubość tylnej tarczy"], ["Max. rotation speed", "Maksymalna prędkość obrotowa"], ["Overall weight", "Masa całkowita"], ["in running order with", "w stanie gotowym do jazdy z"], ["Dry weight", "Masa sucha"], ["without fluids and battery", "bez płynów i akumulatora"], ["Compression ratio", "Stopień sprężania"], ["Gearbox output sprocket/rear chain sprocket ratio", "Przełożenie zębatki wyjściowej skrzyni do tylnej zębatki łańcucha"], ["checking and/or adjusting", "kontrolę i/lub regulację"], ["checking", "kontrolę"], ["checks", "kontrole"], ["changing", "wymianę"], ["cleaning", "czyszczenie"], ["lubrication", "smarowanie"], ["at the listed schedule points", "w punktach podanych w harmonogramie"], ["is described separately", "opisano osobno"], ["is provided", "podano"], ["Front rim", "Przednia obręcz"], ["rear rim", "tylna obręcz"], ["Front:", "Przód:"], ["rear:", "tył:"], ["Drive chain", "Łańcuch napędowy"], ["Gearbox output sprocket", "Zębatka wyjściowa skrzyni"], ["Rear chain sprocket", "Tylna zębatka łańcucha"], ["Seat height", "Wysokość siedzenia"], ["Wheelbase", "Rozstaw osi"], ["Bore", "Średnica cylindra"], ["Stroke", "Skok tłoka"], ["Trail in mm", "Wyprzedzenie w mm"], ["Steering head angle", "Kąt główki ramy"], ["Total displacement", "Pojemność skokowa"], ["Fuel supply", "Zasilanie paliwem"], ["Wet clutch", "Sprzęgło mokre"], ["controlled by the lever on left-hand side of the handlebar", "sterowane dźwignią po lewej stronie kierownicy"], ["LED", "LED"], ["Fuse box", "Skrzynka bezpieczników"], ["protected", "chroniony"], ["Positions and ratings are marked on the box cover", "Położenia i wartości są oznaczone na pokrywie skrzynki"], ["Tail light", "Tylne światło"], ["Headlight", "Reflektor"], ["turn indicators", "kierunkowskazy"], ["parking light", "światło pozycyjne"], ["number plate light", "oświetlenie tablicy"], ["no.", "nr"], ["per cylinder", "na cylinder"], ["desmodromic timing system", "rozrząd desmodromiczny"], ["liquid cooling", "chłodzenie cieczą"], ["tubeless radial type", "bezdętkowy typ radialny"], ["teeth", "zębów"]
  ]);

  function categoryLabel(category) {
    const id = typeof category === "string" ? category : category && category.id;
    return CATEGORY_LABELS[id] || (typeof category === "object" && category && category.label) || id || "Kategoria";
  }
  function riderServiceCoreLabel(fieldId) {
    if (CORE_FIELD_LABELS[fieldId]) return CORE_FIELD_LABELS[fieldId];
    const parts = String(fieldId || "").split(/[.-]/g).filter(Boolean);
    const known = CORE_SEGMENT_LABELS[parts.at(-1)] || CORE_SEGMENT_LABELS[parts.slice(1).join("_")] || parts.at(-1);
    const domain = CORE_SEGMENT_LABELS[parts[0]] || "Dane techniczne";
    return `${domain} — ${known}`;
  }
  function entryLabel(entry) {
    if (!entry) return "Pole techniczne";
    return ENTRY_LABELS[entry.id] || (entry.riderServiceCore && riderServiceCoreLabel(entry.riderServiceCore.canonicalFieldId)) || entry.label || entry.id || "Pole techniczne";
  }
  function statusLabel(status) { return STATUS_LABELS[status] || "Status nieznany"; }
  function sourceTitle(document) { return document && (DOCUMENT_TITLE_LABELS[document.title] || document.title || document.id) || "Źródło techniczne"; }
  function sourceSection(section) {
    if (!section) return "";
    return String(section).replace(/\bMaintenance\b/g, "Obsługa okresowa").replace(/\bTechnical data\b/g, "Dane techniczne").replace(/\bEngine oil\b/g, "Olej silnikowy").replace(/\boil filter\b/g, "filtr oleju").replace(/\bSpark plugs\b/g, "Świece zapłonowe").replace(/\bFuel, lubricants and other fluids\b/g, "Paliwo, smary i inne płyny").replace(/\bElectric system\b/g, "Instalacja elektryczna").replace(/\bTransmission\b/g, "Skrzynia biegów").replace(/\bFrame\b/g, "Rama").replace(/\bTyres\b/g, "Opony").replace(/\bWheels\b/g, "Koła").replace(/\bBrakes\b/g, "Hamulce").replace(/\bFuses\b/g, "Bezpieczniki");
  }
  function valueText(entry, formattedValue) {
    let value = TEXT_VALUE_LABELS[entry && entry.id]?.[formattedValue] || formattedValue;
    const core = entry && entry.riderServiceCore;
    if (core) {
      CORE_TEXT_REPLACEMENTS.forEach(([from, to]) => { value = value.replaceAll(from, to); });
      if (core.structureType === "maintenance" && core.details && core.details.action) value = `${({ INSPECT: "Kontrola", REPLACE: "Wymiana", ADJUST: "Regulacja", CLEAN: "Czyszczenie", LUBRICATE: "Smarowanie" })[core.details.action]}: ${value}`;
      if (core.structureType === "lighting" && core.details && core.details.technology === "LED" && !value.startsWith("LED")) value = `LED — ${value}`;
    }
    return value;
  }
  function contextLabel(field) { return ({ region: "region motocykla", abs: "informacja o ABS", equipment: "wyposażenie" })[field] || field; }

  return Object.freeze({ CATEGORY_LABELS, ENTRY_LABELS, DOCUMENT_TITLE_LABELS, STATUS_LABELS, TEXT_VALUE_LABELS, CORE_SEGMENT_LABELS, CORE_FIELD_LABELS, categoryLabel, entryLabel, statusLabel, sourceTitle, sourceSection, valueText, contextLabel, riderServiceCoreLabel });
});
