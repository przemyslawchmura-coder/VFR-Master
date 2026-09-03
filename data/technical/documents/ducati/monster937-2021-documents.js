(function attachDucatiMonster937Documents(root, factory) {
  const registry = factory();
  if (typeof module === "object" && module.exports) module.exports = registry;
  if (root) root.RevLogDucatiMonster937SourceRegistry = registry;
})(typeof globalThis !== "undefined" ? globalThis : this, function createDucatiMonster937Documents() {
"use strict";

// Production-compatible Ducati source definitions only. No Technical Profile.

const documentId = "doc.ducati.monster937-2021.owners-manual";
const documents = {
  [documentId]: {
    id: documentId,
    type: "oem-owners-manual",
    title: "Monster 937 / 937 Plus Owner's Manual",
    manufacturer: "Ducati Motor Holding S.p.A.",
    publicationId: "OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf",
    edition: "English, MY2021",
    revision: null,
    language: "en",
    regions: ["EU"],
    years: { from: 2021, to: 2021 },
    url: "https://downloads.ctfassets.net/oifkva25gsx4/5QuxXJmK68Pe7ueYLU75eP/6f6770f7782edcbbd23ff8fcd68e4d8c/OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf",
    notes: "Authenticated Ducati-controlled MY2021 EU owner manual; Monster 937 / Monster 937 Plus scope, with Monster SP excluded."
  }
};

const citations = {
  "cite.ducati.monster937-2021.om.spark-plug": { id: "cite.ducati.monster937-2021.om.spark-plug", documentId, section: "Spark plugs", pages: ["216"] },
  "cite.ducati.monster937-2021.om.oil-viscosity": { id: "cite.ducati.monster937-2021.om.oil-viscosity", documentId, section: "Recommendations concerning oil; Fuel, lubricants and other fluids", pages: ["196", "211"] },
  "cite.ducati.monster937-2021.om.oil-api-jaso": { id: "cite.ducati.monster937-2021.om.oil-api-jaso", documentId, section: "Recommendations concerning oil; Fuel, lubricants and other fluids", pages: ["195–196", "211"] },
  "cite.ducati.monster937-2021.om.battery-capacity": { id: "cite.ducati.monster937-2021.om.battery-capacity", documentId, section: "Electric system", pages: ["220"] },
  "cite.ducati.monster937-2021.om.battery-specification": { id: "cite.ducati.monster937-2021.om.battery-specification", documentId, section: "Electric system", pages: ["220"] },
  "cite.ducati.monster937-2021.om.brake-fluid": { id: "cite.ducati.monster937-2021.om.brake-fluid", documentId, section: "Fuel, lubricants and other fluids", pages: ["177", "212"] }
};

return Object.freeze({ documentId, documents: Object.freeze(documents), citations: Object.freeze(citations) });
});
