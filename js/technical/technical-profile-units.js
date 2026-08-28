(function attachTechnicalProfileUnits(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalProfileUnits = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createUnits() {
  "use strict";

  const units = Object.freeze([
    "N·m",
    "mm",
    "cm",
    "m",
    "km",
    "cm³",
    "L",
    "mL",
    "kg",
    "g",
    "V",
    "A",
    "W",
    "kW",
    "Ah",
    "CCA",
    "Hz",
    "Ω",
    "kΩ",
    "kPa",
    "bar",
    "psi",
    "°C",
    "rpm",
    "km/h",
    "hp",
    "PS",
    "month",
    "year",
    "link",
    "tooth",
    "percent",
    "count"
  ]);

  const unitSet = new Set(units);

  return Object.freeze({
    units,
    has(unit) {
      return unitSet.has(unit);
    }
  });
});
