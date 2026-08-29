// NON-PRODUCTION RESEARCH METADATA. These states are not technical evidence.
"use strict";

const STATES = Object.freeze(["publication-identified", "content-accessible", "authenticity-verified", "relevant-section-inspected", "field-evidence-extracted"]);
const profiles = {
  "honda.cbr500r.gen4": {
    ownerManual: { publicationIdentified: true, contentAccessible: true, authenticityVerified: true, relevantSectionInspected: true, fieldEvidenceExtracted: true, sourceIds: ["research.honda.cbr500r.2024.owner-manual"] },
    serviceManual: { publicationIdentified: true, contentAccessible: false, authenticityVerified: false, relevantSectionInspected: false, fieldEvidenceExtracted: false, publicationId: null },
    partsCatalogue: { publicationIdentified: true, contentAccessible: false, authenticityVerified: false, relevantSectionInspected: false, fieldEvidenceExtracted: false }
  },
  "yamaha.mt09.gen3": {
    ownerManual: { publicationIdentified: true, contentAccessible: true, authenticityVerified: true, relevantSectionInspected: true, fieldEvidenceExtracted: true, sourceIds: ["research.yamaha.mt09.2021.owner-manual"] },
    serviceManual: { publicationIdentified: true, contentAccessible: true, authenticityVerified: true, relevantSectionInspected: false, fieldEvidenceExtracted: false, publicationId: "B7N-28197-E0", alternatePublicationId: "LIT-11616-34-61" },
    partsCatalogue: { publicationIdentified: false, contentAccessible: false, authenticityVerified: false, relevantSectionInspected: false, fieldEvidenceExtracted: false }
  },
  "yamaha.tenere700.gen1": {
    ownerManual: { publicationIdentified: true, contentAccessible: true, authenticityVerified: true, relevantSectionInspected: true, fieldEvidenceExtracted: true, sourceIds: ["research.yamaha.tenere700.2019.owner-manual"] },
    serviceManual: { publicationIdentified: true, contentAccessible: false, authenticityVerified: false, relevantSectionInspected: false, fieldEvidenceExtracted: false, publicationId: "BW3-F8197-E0" },
    partsCatalogue: { publicationIdentified: false, contentAccessible: false, authenticityVerified: false, relevantSectionInspected: false, fieldEvidenceExtracted: false }
  }
};
module.exports = Object.freeze({ states: STATES, profiles: Object.freeze(Object.fromEntries(Object.entries(profiles).map(([key, value]) => [key, Object.freeze(Object.fromEntries(Object.entries(value).map(([kind, status]) => [kind, Object.freeze(status)])))]))) });
