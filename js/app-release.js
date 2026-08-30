(function (root, factory) {
  const metadata = factory();
  if (typeof module === "object" && module.exports) module.exports = metadata;
  if (root) root.RevLogRelease = metadata;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const releases = [
    Object.freeze({
      version: "0.2.0",
      date: "2026-08-30",
      title: "Ducati Wave 1 i Wave 2",
      changes: Object.freeze([
        "Rozszerzone pokrycie katalogu motocykli Ducati o główne rodziny i generacje.",
        "Uzupełnione luki po audycie modeli homologacyjnych i technicznie odrębnych wariantów.",
        "Dodane trwałe testy poprawności oraz stabilności tożsamości katalogowych Ducati."
      ])
    }),
    Object.freeze({
      version: "0.1.0",
      date: "2026-08-30",
      title: "BMW Wave 2 i historia wydań",
      changes: Object.freeze([
        "Rozszerzone europejskie pokrycie katalogu BMW Motorrad oraz generacji modelowych.",
        "Dodane jawne wersjonowanie aplikacji zgodne z SemVer.",
        "Historia zmian jest teraz dostępna w sekcji O aplikacji."
      ])
    })
  ];

  return Object.freeze({
    applicationName: "RevLog",
    currentVersion: releases[0].version,
    releases: Object.freeze(releases)
  });
});
