// NON-PRODUCTION synthetic field-policy fixture; contains no motorcycle data.
"use strict";

const fixture = {
  schemaVersion: 1,
  groupDefaults: [
    { fieldGroup: "BASIC_FITMENT", allowedSourceClasses: ["TIER_A_OEM", "TIER_B_AUTHORIZED", "TIER_C_SPECIALIST"], preferredSourceClasses: ["TIER_A_OEM"], forbiddenSourceClasses: ["DISCOVERY_ONLY"], minimumAuthority: "TIER_C_SPECIALIST", tierAMandatory: false, specialistDomain: "TIRES", corroboration: { mode: "ONE_EXACT_AUTHORITATIVE", minimumIndependentSources: 0, exactOemAccepted: false }, requiredApplicability: ["model", "modelYear"], requiredProvenance: ["sourceIdentity", "sourceLocation"], fastPathAllowed: true, deepPathRequired: false, searchBudget: { maxDiscoveryAttempts: 3, maxAuthenticatedSources: 2, maxSourceClasses: 2, maxRawCandidates: 4 } },
    { fieldGroup: "SAFETY_CRITICAL", allowedSourceClasses: ["TIER_A_OEM", "TIER_B_AUTHORIZED"], preferredSourceClasses: ["TIER_A_OEM"], forbiddenSourceClasses: ["TIER_C_SPECIALIST", "TIER_D_SECONDARY", "DISCOVERY_ONLY"], minimumAuthority: "TIER_A_OEM", tierAMandatory: true, specialistDomain: null, corroboration: { mode: "TIER_A_DEEP_ONLY", minimumIndependentSources: 0, exactOemAccepted: true }, requiredApplicability: ["model", "modelYear", "market", "variant"], requiredProvenance: ["sourceIdentity", "sourceLocation", "acquisitionArtifact"], fastPathAllowed: false, deepPathRequired: true, searchBudget: { maxDiscoveryAttempts: 2, maxAuthenticatedSources: 1, maxSourceClasses: 1, maxRawCandidates: 2 } },
    { fieldGroup: "INTERNAL_WORKSHOP", allowedSourceClasses: ["TIER_A_OEM"], preferredSourceClasses: ["TIER_A_OEM"], forbiddenSourceClasses: ["TIER_B_AUTHORIZED", "TIER_C_SPECIALIST", "TIER_D_SECONDARY", "DISCOVERY_ONLY"], minimumAuthority: "TIER_A_OEM", tierAMandatory: true, specialistDomain: null, corroboration: { mode: "TIER_A_DEEP_ONLY", minimumIndependentSources: 0, exactOemAccepted: true }, requiredApplicability: ["model", "generation", "modelYear"], requiredProvenance: ["sourceIdentity", "sourceLocation"], fastPathAllowed: false, deepPathRequired: true, searchBudget: { maxDiscoveryAttempts: 2, maxAuthenticatedSources: 1, maxSourceClasses: 1, maxRawCandidates: 2 } }
  ],
  fieldOverrides: []
};

module.exports = Object.freeze(fixture);
