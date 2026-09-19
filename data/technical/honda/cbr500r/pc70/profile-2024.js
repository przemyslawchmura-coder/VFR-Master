(function attachHondaCbr500rPc70Profile(root, factory) {
  let sourceRegistry = root && root.RevLogHondaCbr500rPc70Documents;
  if (typeof module === "object" && module.exports) {
    sourceRegistry = sourceRegistry || require("../../../documents/honda/cbr500r-pc70-2024-documents.js");
  }
  const profile = factory(sourceRegistry);
  if (typeof module === "object" && module.exports) module.exports = profile;
  if (root && root.RevLogTechnicalProfileBrowserStore) {
    root.RevLogTechnicalProfileBrowserStore.registerProfile(profile);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createHondaCbr500rPc70Profile(sourceRegistry) {
"use strict";

// Production container only. Entry materialization and registry insertion remain separate boundaries.
return Object.freeze({
  schemaVersion: "revlog-technical-profile/v1",
  id: "honda.cbr500r.pc70.2024",
  registryMembership: "NOT-REGISTERED",
  profile: {
    id: "honda.cbr500r.pc70.2024",
    revision: 1,
    status: "review",
    language: "en"
  },
  motorcycle: {
    brand: "Honda",
    model: "CBR500R",
    generation: "PC70",
    applicability: {
      catalogVariantKeys: ["honda.cbr500r.pc70"],
      years: { from: 2024, to: 2024 },
      regions: ["USA", "CA"],
      abs: true,
      equipment: ["standard road model"]
    }
  },
  categories: [
    { id: "general", label: "Dane ogólne", order: 10 },
    { id: "lubrication", label: "Olej i filtry", order: 20 },
    { id: "cooling", label: "Układ chłodzenia", order: 30 },
    { id: "ignition", label: "Świece i zapłon", order: 40 },
    { id: "valves", label: "Zawory", order: 50 },
    { id: "wheels", label: "Koła i opony", order: 60 },
    { id: "final-drive", label: "Napęd końcowy", order: 70 },
    { id: "brakes", label: "Hamulce", order: 80 },
    { id: "electrical", label: "Elektryka", order: 90 },
    { id: "fuses", label: "Bezpieczniki", order: 100 },
    { id: "lighting", label: "Oświetlenie", order: 110 },
    { id: "adjustments", label: "Regulacje", order: 120 },
    { id: "maintenance", label: "Obsługa okresowa", order: 130 },
    { id: "consumables", label: "Części eksploatacyjne", order: 140 },
    { id: "torques", label: "Momenty dokręcania", order: 150 }
  ],
  documents: sourceRegistry.documents,
  citations: sourceRegistry.citations,
  entries: [
    {
      id: "lubrication.engine-oil.specification",
      type: "fluid",
      categoryId: "lubrication",
      value: {
        type: "text",
        text: "API Service Classification SJ or higher\nexcept oils labeled as energy conserving or\nresource conserving on the circular API\nservice label, SAE 10W-30, JASO T 903\nstandard MA, Pro Honda GN4 4-stroke oil\n(USA & Canada) or Honda 4-stroke oil, or\nan equivalent motorcycle oil"
      },
      applicability: {
        modelYear: "KNOWN",
        market: "KNOWN",
        transmission: "KNOWN",
        equipment: ["standard road model"],
        abs: true,
        context: "SUFFICIENT"
      },
      status: "verified",
      sourceIds: ["cite.44cd7d15b9c97a991b87056f"]
    }
  ]
});
});
