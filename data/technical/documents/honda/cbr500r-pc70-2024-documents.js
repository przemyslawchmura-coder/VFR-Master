(function attachHondaCbr500rPc70Documents(root, factory) {
  const registry = factory();
  if (typeof module === "object" && module.exports) module.exports = registry;
  if (root) root.RevLogHondaCbr500rPc70Documents = registry;
})(typeof globalThis !== "undefined" ? globalThis : this, function createHondaCbr500rPc70Documents() {
"use strict";

// Production document only. Citation, Technical Profile and registry
// materialization remain separate lifecycle boundaries.
const documentId = "doc.97c1a14816208eaedcccd588";
const documents = {
  [documentId]: {
    id: documentId,
    type: "oem-owners-manual",
    title: "2024 CB500F / CBR500R / NX500 Owner's Manual",
    manufacturer: "American Honda Motor Co., Inc.",
    publicationId: "31MLRB00 / 00X31-MLR-B000",
    edition: null,
    revision: null,
    language: "en",
    regions: ["USA", "CA"],
    years: { from: 2024, to: 2024 },
    url: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf",
    notes: "Authenticated Tier A Honda owner manual for the preserved USA/Canada MY2024 source scope."
  }
};

const citations = {
  "cite.44cd7d15b9c97a991b87056f": {
    id: "cite.44cd7d15b9c97a991b87056f",
    documentId,
    canonicalFieldId: "lubrication.oil-specification",
    section: "derived text",
    subsection: "document:full",
    pages: [],
    locator: "lines:55-64;chars:731-1026",
    sourceLocation: {
      locator: "lines:55-64;chars:731-1026",
      page: null,
      section: "derived text",
      tableOrSubsection: "document:full"
    }
  }
};

return Object.freeze({ documentId, documents: Object.freeze(documents), citations: Object.freeze(citations) });
});
