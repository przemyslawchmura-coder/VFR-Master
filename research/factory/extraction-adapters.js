// NON-PRODUCTION deterministic local/synthetic raw extractor adapters.
"use strict";

const contracts = require("./extraction-contracts.js");
const json = require("./json.js");

const fixtures = Object.freeze({
  candidates: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "CANDIDATES-PRODUCED", candidates: [
    { fieldId: "lubrication.capacity-filter", rawValue: "3.1", rawUnit: "L", sourceLocation: { page: 7, section: "Lubrication", locator: "line:2" }, extractionMethod: "SYNTHETIC-EXACT", applicability: { note: "explicit fixture scope" }, context: { condition: "with filter" }, ordinal: 2 },
    { fieldId: "lubrication.oil-specification", rawValue: "SAE 10W-30", rawUnit: null, sourceLocation: { page: 7, section: "Lubrication", locator: "line:1" }, extractionMethod: "SYNTHETIC-EXACT", applicability: null, context: null, ordinal: 1 }
  ], observations: [{ type: "CANDIDATE-EXTRACTED", detailCode: "LOCAL_SYNTHETIC_CANDIDATES", metadata: { count: 2 } }] } }),
  none: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "NO-CANDIDATES", candidates: [], observations: [{ type: "NO-CANDIDATES", detailCode: "NO_MAPPED_VALUES", metadata: {} }] } }),
  unsupportedMedia: Object.freeze({ supportedMediaTypes: ["application/json"], output: null }),
  unmapped: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "FIELD-UNMAPPED", candidates: [], observations: [{ type: "FIELD-UNMAPPED", detailCode: "UNKNOWN_FIELD_LABEL", metadata: {} }] } }),
  parseFailure: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "PARSE-FAILURE", candidates: [], observations: [{ type: "PARSE-FAILED", detailCode: "LOCAL_PARSE_FAILURE", metadata: {} }] } }),
  permanent: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "PERMANENT-EXTRACTION-FAILURE", candidates: [], observations: [{ type: "PERMANENT-FAILURE", detailCode: "LOCAL_PERMANENT_FAILURE", metadata: {} }] } }),
  malformed: Object.freeze({ supportedMediaTypes: ["text/plain"], output: { disposition: "CANDIDATES-PRODUCED", candidates: [{ fieldId: "unknown.field", rawValue: "x", rawUnit: null, sourceLocation: { page: 1, section: null, locator: null }, extractionMethod: "BAD", applicability: null, context: null, ordinal: 1 }], observations: [] } })
});

function createSyntheticExtractorAdapter(name) {
  if (!Object.prototype.hasOwnProperty.call(fixtures, name)) throw new TypeError(`unknown synthetic extractor fixture: ${name}`);
  const fixture = fixtures[name];
  const declaration = contracts.validateExtractorAdapterDeclaration({ schemaVersion: contracts.EXTRACTION_SCHEMA_VERSION, adapterId: `synthetic-extractor.${name}`, adapterVersion: "1", supportedMediaTypes: fixture.supportedMediaTypes, supportedOperations: [contracts.EXTRACTION_OPERATION], deterministic: true, localOnly: true });
  return Object.freeze({ ...declaration, execute(request) {
    json.assertJsonSafe(request);
    if (request.operation !== contracts.EXTRACTION_OPERATION) throw new TypeError("synthetic extractor operation is unsupported");
    return fixture.output === null ? null : json.immutableClone(fixture.output);
  } });
}

const syntheticExtractorAdapters = Object.freeze(Object.fromEntries(Object.keys(fixtures).map(name => [name, createSyntheticExtractorAdapter(name)])));
module.exports = Object.freeze({ syntheticExtractorAdapters, createSyntheticExtractorAdapter });
