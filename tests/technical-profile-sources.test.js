"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const sources = require("../js/technical/technical-profile-sources.js");
const validator = require("../js/technical/technical-profile-validator.js");
const fixture = require("./fixtures/technical-profile-v1.fixture.js");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("source authority hierarchy is explicit and stable", () => {
  assert.equal(sources.getAuthorityRank("oem-service-manual"), 1);
  assert.equal(sources.getAuthorityRank("oem-owners-manual"), 2);
  assert.equal(sources.getAuthorityRank("oem-parts-catalogue"), 3);
  assert.equal(sources.getAuthorityRank("oem-supplement"), 4);
  assert.equal(sources.getAuthorityRank("oem-technical-bulletin"), 4);
  assert.equal(sources.getAuthorityRank("verified-secondary"), 5);
});

test("authority rank accepts a document and unknown types return null", () => {
  assert.equal(
    sources.getAuthorityRank({ type: "oem-service-manual" }),
    1
  );
  assert.equal(sources.getAuthorityRank("unregistered-source"), null);
});

test("OEM source classification does not classify secondary sources as OEM", () => {
  assert.equal(sources.isOemDocumentType("oem-parts-catalogue"), true);
  assert.equal(sources.isOemDocumentType("verified-secondary"), false);
});

test("source registry and validator accept exactly the same document types", () => {
  for (const type of sources.documentTypes) {
    const profile = clone(fixture);
    const document = profile.documents["doc.fixture.synthetic-manual"];
    document.type = type;
    if (sources.isOemDocumentType(type)) {
      document.manufacturer = "Fixture Manufacturer";
    }

    const report = validator.validate(profile);
    assert.equal(
      report.errors.some(error => error.code === "UNKNOWN_DOCUMENT_TYPE"),
      false,
      `validator rejected registry type ${type}`
    );
  }

  const invalid = clone(fixture);
  invalid.documents["doc.fixture.synthetic-manual"].type = "unregistered-source";
  assert.equal(
    validator.validate(invalid).errors.some(
      error => error.code === "UNKNOWN_DOCUMENT_TYPE"
    ),
    true
  );
});
