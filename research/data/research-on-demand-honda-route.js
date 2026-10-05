// NON-PRODUCTION exact oil-source route. No provider/runtime activation.
"use strict";
const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const historical = require("./cbr500r-pc70-owner-manual-execution.js");
const verification = require("./cbr500r-pc70-abs-applicability.js");
const recorded = require("../reports/cbr500r-pc70-owner-manual-execution.json");

// This new route does not mutate the historical unresolved prospect. The same
// official bytes were reacquired on 2026-10-05: both identifiers are on PDF p184.
// ABS/equipment verification is limited to the existing oil-specification lineage.
if (verification.basis.fieldId !== "lubrication.oil-specification" || verification.basis.verifiedApplicability.abs !== true) throw new TypeError("exact oil applicability verification is required");
const scope = factory.validateApplicabilityScope({ ...historical.target.scope, abs: { state: "KNOWN", values: [true] } });
const target = factory.validateResearchTarget({ ...historical.target, scope });
const prospect = factory.validateSourceProspect({ ...historical.prospect, publication: { ...historical.prospect.publication, relationship: "SAME-UNDERLYING-PUBLICATION-PROVEN" }, applicability: scope });
const route = json.immutableClone({
  id: "rod-source.honda-cbr500r-pc70-2024-oil-v1", target, prospect,
  sourceId: historical.source.id,
  url: historical.source.url,
  fieldIds: [verification.basis.fieldId],
  operation: "read-synthetic-technical-value", // Preserve existing Wave 9 demand identity operation; not an adapter instruction.
  conditions: { requestContext: { modelCode: "PC70" } },
  mediaType: "application/pdf",
  expectedDigest: recorded.acquisition.artifactSha256,
  maxResponseBytes: 8 * 1024 * 1024,
  proof: { authenticatedArtifactId: recorded.acquisition.artifactId, applicabilityVerificationId: verification.id, publicationIdentityPages: [1, 184], identityVerifiedOn: "2026-10-05", independentTechnicalSource: false }
});
module.exports = Object.freeze({ route });
