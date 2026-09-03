// Unregistered production Technical Profile for the bounded Ducati wave.
"use strict";

const sourceRegistry = require("../../documents/ducati/monster937-2021-documents.js");

module.exports = Object.freeze({
  schemaVersion: "revlog-technical-profile/v1",
  profile: { id: "ducati.monster937.2021", revision: 1, status: "review", language: "en" },
  motorcycle: {
    brand: "Ducati",
    model: "Monster 937",
    generation: "Monster 937",
    applicability: { catalogVariantKeys: ["ducati.monster.937"], years: { from: 2021, to: 2021 }, regions: ["EU"], abs: true, equipment: ["base Monster 937"] }
  },
  categories: [
    { id: "ignition", label: "Ignition", order: 40 },
    { id: "lubrication", label: "Lubrication", order: 20 },
    { id: "electrical", label: "Electrical", order: 90 },
    { id: "brakes", label: "Brakes", order: 80 }
  ],
  documents: sourceRegistry.documents,
  citations: sourceRegistry.citations,
  entries: [
    { id: "ignition.spark-plug.standard", type: "spark-plug", categoryId: "ignition", label: "Spark plug", value: { type: "text", text: "NGK MAR9A-J" }, manufacturer: "NGK", partNumbers: ["MAR9A-J"], status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.spark-plug"] },
    { id: "lubrication.engine-oil.viscosity", type: "fluid", categoryId: "lubrication", label: "Engine oil viscosity", value: { type: "text", text: "SAE 15W-50" }, status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.oil-viscosity"] },
    { id: "lubrication.engine-oil.specification", type: "fluid", categoryId: "lubrication", label: "Engine oil specification", value: { type: "text", text: "API: SN; JASO: MA2" }, status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.oil-api-jaso"] },
    { id: "electrical.battery.capacity", type: "specification", categoryId: "electrical", label: "Battery capacity", value: { type: "quantity", amount: 6.5, unit: "Ah" }, status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.battery-capacity"] },
    { id: "electrical.battery.specification", type: "consumable-part", categoryId: "electrical", label: "Battery", value: { type: "text", text: "YUASA YT 7B-BS DRY, 12 V" }, status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.battery-specification"] },
    { id: "brakes.fluid.specification", type: "fluid", categoryId: "brakes", label: "Brake fluid", value: { type: "text", text: "Front/rear brake circuit: DOT 4" }, status: "verified", sourceIds: ["cite.ducati.monster937-2021.om.brake-fluid"] }
  ]
});
