// NON-PRODUCTION intended Technical Profile identity for CBR500R.
"use strict";

const factory = require("../factory/index.js");
const applicability = require("./cbr500r-pc70-abs-applicability.js");

const targetId = "target.honda.cbr500r.pc70.2024.usa-canada";
const catalogVariantKey = "honda.cbr500r.pc70";

function buildReference() {
  const verified = applicability.buildReport().verifiedApplicability;
  const reference = factory.createTechnicalProfileDefinitionRef({
    profileIdentity: { targetId, catalogVariantKey, manufacturer: "Honda", model: "CBR500R", generation: "PC70", modelYear: verified.modelYear, market: "USA/Canada", transmission: verified.transmission, equipment: verified.equipment, abs: verified.abs },
    catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId, catalogVariantKey }
  });
  return reference;
}

function buildReport() {
  const first = buildReference();
  const second = buildReference();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R Technical Profile identity is not deterministic");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-technical-profile-identity/v1",
    reference: first,
    targetId,
    catalogVariantKey,
    sourceApplicabilityVerificationId: applicability.id,
    productionProfileExists: false,
    registryMembership: "NOT-REGISTERED",
    productionCreated: false,
    assertions: { repositoryProvenance: true, exactTargetBound: true, nonProduction: true, noProfileContents: true, noRegistryInsertion: true, productionChanged: false }
  });
}

module.exports = Object.freeze({ buildReference, buildReport });
