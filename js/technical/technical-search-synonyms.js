(function attachTechnicalSearchSynonyms(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalSearchSynonyms = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createSynonyms() {
  "use strict";

  const synonyms = Object.freeze({
    aku: Object.freeze(["akumulator", "bateria"]),
    bateria: Object.freeze(["akumulator"]),
    "kapeć": Object.freeze(["opona"]),
    laczek: Object.freeze(["opona"]),
    guma: Object.freeze(["opona"]),
    "świeczka": Object.freeze(["świeca"]),
    "filtr oliwy": Object.freeze(["filtr oleju"]),
    korek: Object.freeze(["korek spustowy"]),
    hebla: Object.freeze(["hamulec"]),
    "bezpiecznik fi": Object.freeze([
      "fi fuse",
      "pgm-fi fuse",
      "bezpiecznik pgm-fi"
    ])
  });

  return Object.freeze({
    synonyms,
    entries() {
      return Object.entries(synonyms);
    }
  });
});
