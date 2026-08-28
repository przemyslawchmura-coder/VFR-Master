"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const sources = require("../js/technical/technical-profile-sources.js");

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
