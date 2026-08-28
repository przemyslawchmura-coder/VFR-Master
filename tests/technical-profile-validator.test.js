"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const validator = require(
  "../js/technical/technical-profile-validator.js"
);
const units = require(
  "../js/technical/technical-profile-units.js"
);
const fixture = require(
  "./fixtures/technical-profile-v1.fixture.js"
);

function cloneFixture() {
  return structuredClone(fixture);
}

function findError(report, code) {
  return report.errors.find(error => error.code === code);
}

function expectError(profile, code, expectedPath) {
  const report = validator.validate(profile);
  const error = findError(report, code);

  assert.equal(report.valid, false);
  assert.ok(error, `Expected validation error ${code}`);

  if (expectedPath) {
    assert.equal(error.path, expectedPath);
  }

  return report;
}

test("valid synthetic Technical Profile v1 fixture passes", () => {
  const report = validator.validate(cloneFixture());

  assert.equal(fixture.fixtureOnly, true);
  assert.deepEqual(report, {
    valid: true,
    errors: [],
    warnings: []
  });
});

test("canonical unit registry contains required foundation units", () => {
  [
    "N·m", "mm", "cm", "m", "km", "cm³", "L", "mL", "kg", "g",
    "V", "A", "W", "kW", "Ah", "CCA", "Hz", "Ω", "kΩ", "kPa",
    "bar", "psi", "°C", "rpm", "km/h", "hp", "PS", "month", "year"
  ].forEach(unit => assert.equal(units.has(unit), true, unit));

  assert.equal(units.has("Nm"), false);
  assert.equal(units.has("l"), false);
});

test("missing schemaVersion is rejected", () => {
  const profile = cloneFixture();
  delete profile.schemaVersion;

  expectError(profile, "MISSING_SCHEMA_VERSION", "schemaVersion");
});

test("unsupported schemaVersion is rejected", () => {
  const profile = cloneFixture();
  profile.schemaVersion = "revlog-technical-profile/v2";

  expectError(profile, "UNSUPPORTED_SCHEMA_VERSION", "schemaVersion");
});

test("missing profile id is rejected", () => {
  const profile = cloneFixture();
  delete profile.profile.id;

  expectError(profile, "MISSING_PROFILE_ID", "profile.id");
});

test("missing profile revision is rejected", () => {
  const profile = cloneFixture();
  delete profile.profile.revision;

  expectError(profile, "MISSING_PROFILE_REVISION", "profile.revision");
});

test("missing catalogue applicability is rejected", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.catalogVariantKeys = [];

  expectError(
    profile,
    "MISSING_CATALOG_VARIANT_KEY",
    "motorcycle.applicability.catalogVariantKeys"
  );
});

test("duplicate entry id is rejected", () => {
  const profile = cloneFixture();
  profile.entries[1].id = profile.entries[0].id;

  expectError(profile, "DUPLICATE_ENTRY_ID", "entries[1].id");
});

test("duplicate category id is rejected", () => {
  const profile = cloneFixture();
  profile.categories[1].id = profile.categories[0].id;

  expectError(profile, "DUPLICATE_CATEGORY_ID", "categories[1].id");
});

test("unknown entry type is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].type = "mystery-record";

  expectError(profile, "UNKNOWN_ENTRY_TYPE", "entries[0].type");
});

test("unknown category reference is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].categoryId = "missing-category";

  expectError(
    profile,
    "UNKNOWN_CATEGORY_REFERENCE",
    "entries[0].categoryId"
  );
});

test("verified entry without sourceId is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].sourceIds = [];

  expectError(
    profile,
    "VERIFIED_WITHOUT_SOURCE",
    "entries[0].sourceIds"
  );
});

test("unknown sourceId is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].sourceIds = ["cite.missing"];

  expectError(profile, "UNKNOWN_SOURCE_ID", "entries[0].sourceIds[0]");
});

test("unknown canonical unit is rejected", () => {
  const profile = cloneFixture();
  profile.entries[4].value.unit = "Nm";

  const report = expectError(
    profile,
    "UNKNOWN_UNIT",
    "entries[4].value.unit"
  );
  assert.match(findError(report, "UNKNOWN_UNIT").message, /Nm/);
});

test("amount stored as string is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].value.amount = "3.5";

  expectError(profile, "INVALID_NUMBER", "entries[0].value.amount");
});

test("range with min greater than max is rejected", () => {
  const profile = cloneFixture();
  profile.entries[7].value.min = 3;
  profile.entries[7].value.max = 2;

  expectError(profile, "INVALID_RANGE", "entries[7].value");
});

test("negative tolerance is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].value = {
    type: "quantity-with-tolerance",
    nominal: 3.5,
    tolerance: -0.1,
    unit: "L"
  };

  expectError(
    profile,
    "NEGATIVE_TOLERANCE",
    "entries[0].value.tolerance"
  );
});

test("duplicate variant id is rejected", () => {
  const profile = cloneFixture();
  profile.entries[2].variants.push(
    structuredClone(profile.entries[2].variants[0])
  );

  expectError(
    profile,
    "DUPLICATE_VARIANT_ID",
    "entries[2].variants[3].id"
  );
});

test("variant patch cannot change entry identity", () => {
  const profile = cloneFixture();
  profile.entries[2].variants[0].patch.id = "replacement.identity";

  expectError(
    profile,
    "FORBIDDEN_VARIANT_PATCH_FIELD",
    "entries[2].variants[0].patch.id"
  );
});

test("duplicate declared document id is rejected", () => {
  const profile = cloneFixture();
  profile.documents["doc.fixture.duplicate-key"] = {
    ...structuredClone(profile.documents["doc.fixture.synthetic-manual"])
  };

  expectError(
    profile,
    "DUPLICATE_DOCUMENT_ID",
    "documents.doc.fixture.duplicate-key.id"
  );
});

test("duplicate declared citation id is rejected", () => {
  const profile = cloneFixture();
  profile.citations["cite.fixture.duplicate-key"] = {
    ...structuredClone(profile.citations["cite.fixture.synthetic-manual.general"])
  };

  expectError(
    profile,
    "DUPLICATE_CITATION_ID",
    "citations.cite.fixture.duplicate-key.id"
  );
});

test("citation with unknown documentId is rejected", () => {
  const profile = cloneFixture();
  profile.citations["cite.fixture.synthetic-manual.general"].documentId =
    "doc.fixture.missing";

  expectError(
    profile,
    "UNKNOWN_DOCUMENT_REFERENCE",
    "citations.cite.fixture.synthetic-manual.general.documentId"
  );
});

test("unknown document type is rejected", () => {
  const profile = cloneFixture();
  profile.documents["doc.fixture.synthetic-manual"].type = "internet-rumour";

  expectError(
    profile,
    "UNKNOWN_DOCUMENT_TYPE",
    "documents.doc.fixture.synthetic-manual.type"
  );
});

test("OEM document without manufacturer is rejected", () => {
  const profile = cloneFixture();
  delete profile.documents["doc.fixture.synthetic-manual"].manufacturer;

  expectError(
    profile,
    "OEM_DOCUMENT_WITHOUT_MANUFACTURER",
    "documents.doc.fixture.synthetic-manual.manufacturer"
  );
});

test("invalid document URL is rejected", () => {
  const profile = cloneFixture();
  profile.documents["doc.fixture.synthetic-manual"].url = "not a URL";

  expectError(
    profile,
    "INVALID_DOCUMENT_URL",
    "documents.doc.fixture.synthetic-manual.url"
  );
});

test("document without URL remains valid", () => {
  const profile = cloneFixture();
  delete profile.documents["doc.fixture.synthetic-manual"].url;

  assert.equal(validator.validate(profile).valid, true);
});

test("invalid document year range is rejected", () => {
  const profile = cloneFixture();
  profile.documents["doc.fixture.synthetic-manual"].years = {
    from: 2100,
    to: 2099
  };

  expectError(
    profile,
    "INVALID_YEAR_RANGE",
    "documents.doc.fixture.synthetic-manual.years"
  );
});

test("invalid document regions are rejected", () => {
  const profile = cloneFixture();
  profile.documents["doc.fixture.synthetic-manual"].regions = ["eu"];

  expectError(
    profile,
    "INVALID_REGIONS",
    "documents.doc.fixture.synthetic-manual.regions"
  );
});

test("broken relatedEntryId is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].relatedEntryIds = ["entry.that-does-not-exist"];

  expectError(
    profile,
    "UNKNOWN_RELATED_ENTRY_ID",
    "entries[0].relatedEntryIds[0]"
  );
});

test("unknown entry status is rejected", () => {
  const profile = cloneFixture();
  profile.entries[0].status = "trusted-because-it-was-in-revlog";

  expectError(profile, "UNKNOWN_ENTRY_STATUS", "entries[0].status");
});

test("validator does not mutate the input profile", () => {
  const profile = cloneFixture();
  const before = JSON.stringify(profile);

  validator.validate(profile);

  assert.equal(JSON.stringify(profile), before);
});
