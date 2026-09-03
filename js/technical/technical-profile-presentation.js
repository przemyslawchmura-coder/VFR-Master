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

  function categoryLabel(category) {
    const id = typeof category === "string" ? category : category && category.id;
    return CATEGORY_LABELS[id] || (typeof category === "object" && category && category.label) || id || "Kategoria";
  }
  function entryLabel(entry) { return entry && (ENTRY_LABELS[entry.id] || entry.label || entry.id) || "Pole techniczne"; }
  function statusLabel(status) { return STATUS_LABELS[status] || "Status nieznany"; }
  function sourceTitle(document) { return document && (DOCUMENT_TITLE_LABELS[document.title] || document.title || document.id) || "Źródło techniczne"; }
  function sourceSection(section) {
    if (!section) return "";
    return String(section).replace(/\bMaintenance\b/g, "Obsługa okresowa").replace(/\bEngine oil\b/g, "Olej silnikowy").replace(/\boil filter\b/g, "filtr oleju").replace(/\bSpark plugs\b/g, "Świece zapłonowe").replace(/\bFuel, lubricants and other fluids\b/g, "Paliwo, smary i inne płyny").replace(/\bElectric system\b/g, "Instalacja elektryczna");
  }
  function contextLabel(field) { return ({ region: "region motocykla", abs: "informacja o ABS", equipment: "wyposażenie" })[field] || field; }

  return Object.freeze({ CATEGORY_LABELS, ENTRY_LABELS, DOCUMENT_TITLE_LABELS, STATUS_LABELS, categoryLabel, entryLabel, statusLabel, sourceTitle, sourceSection, contextLabel });
});
