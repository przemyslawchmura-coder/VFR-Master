(function attachTechnicalProfileSources(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalProfileSources = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createSources() {
  "use strict";

  const authorityByType = Object.freeze({
    "oem-service-manual": 1,
    "oem-owners-manual": 2,
    "oem-parts-catalogue": 3,
    "oem-supplement": 4,
    "oem-technical-bulletin": 4,
    "oem-wiring-diagram": 4,
    "verified-secondary": 5,
    "aftermarket-catalogue": 6
  });

  const documentTypes = Object.freeze(Object.keys(authorityByType));
  const oemDocumentTypes = Object.freeze(
    documentTypes.filter(type => type.startsWith("oem-"))
  );

  function getAuthorityRank(documentOrType) {
    const type = typeof documentOrType === "string"
      ? documentOrType
      : documentOrType && documentOrType.type;

    return authorityByType[type] ?? null;
  }

  return Object.freeze({
    authorityByType,
    documentTypes,
    oemDocumentTypes,
    getAuthorityRank,
    isKnownDocumentType(type) {
      return Object.hasOwn(authorityByType, type);
    },
    isOemDocumentType(type) {
      return oemDocumentTypes.includes(type);
    }
  });
});
