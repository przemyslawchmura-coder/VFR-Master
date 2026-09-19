// NON-PRODUCTION bounded authorization projection for one CBR500R conversion.
"use strict";

const factory = require("../factory/index.js");
const conversion = require("./cbr500r-pc70-schema-conversion.js");

const schemaConversionId = "schema-conversion.0408c67195304a42913cbbb4";
const authorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildAuthorization() {
  const projection = conversion.buildProjection();
  if (projection.id !== schemaConversionId) throw new Error("Schema conversion input is out of scope");
  if (projection.conversionState !== "CONVERSION-READY" || projection.blockedReasons.length !== 0) throw new Error("Schema conversion input is not ready for authorization");
  const result = factory.authorizeSchemaConversion(projection);
  if (result.id !== authorizationId) throw new Error("Unexpected CBR500R authorization identity");
  return result;
}

function buildReport() {
  const projection = conversion.buildProjection();
  const before = factory.orchestrationJson.canonicalSerialize(projection);
  const authorization = buildAuthorization();
  if (factory.orchestrationJson.canonicalSerialize(projection) !== before) throw new Error("Authorization mutated schema conversion input");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-schema-conversion-authorization/v1",
    authorizationSchemaVersion: factory.AUTHORIZATION_SCHEMA_VERSION,
    schemaConversionId,
    authorization,
    assertions: {
      exactlyOneConversionConsumed: true,
      conversionReadyConsumed: projection.conversionState === "CONVERSION-READY" && projection.blockedReasons.length === 0,
      authorizationDerived: authorization.authorizationState === "AUTHORIZATION-READY" && authorization.reasons.length === 0,
      completeLineage: authorization.schemaConversionProjectionId === schemaConversionId,
      tierAProvenancePreserved: authorization.sourceIdentity.tier === "A",
      rawInputPreserved: authorization.rawSource.rawValue === projection.sourceProvenance.packet.rawValue,
      proposedProductionPreserved: authorization.proposedProduction.entryId === "lubrication.engine-oil.specification",
      boundedApplicabilityPreserved: authorization.targetApplicability.abs === "KNOWN" && authorization.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noConflictChange: true,
      noMaterialization: authorization.productionCreated === false,
      noPromotion: true,
      productionChanged: false
    },
    next: "Separately authorize the bounded production document, citation, Technical Profile entry and registry materialization requirements; do not materialize or promote production data."
  });
}

module.exports = Object.freeze({ buildAuthorization, buildReport });
