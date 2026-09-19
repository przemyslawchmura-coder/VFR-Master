// NON-PRODUCTION synthetic demonstration of source discovery/prospect registration.
"use strict";

const contracts = require("../factory/source-discovery-prospect-contracts.js");

const base = { schemaVersion: contracts.SCHEMA_VERSION, targetId: "target.fixture.2024", catalogVariantKey: "fixture.model", year: 2024, identity: { manufacturer: "Fixture Motor", model: "Fixture", generation: "I" }, documentClass: "owner manual", sourceRoute: { state: "UNKNOWN", officialUrl: null }, authority: { state: "UNKNOWN", value: null }, publication: { state: "UNKNOWN", value: null }, authenticationState: "UNKNOWN", accessState: "UNKNOWN", exhaustionState: "ACTIVE", applicability: { model: { state: "KNOWN", value: "Fixture" }, year: { state: "KNOWN", value: 2024 }, market: { state: "UNKNOWN", value: null }, abs: { state: "UNKNOWN", value: null }, transmission: { state: "UNKNOWN", value: null }, equipment: { state: "UNKNOWN", value: null } }, provenance: ["synthetic-fixture"], blockers: ["SOURCE-IDENTITY-NOT-REGISTERED"] };
const inputOf = candidate => { const { id, state, ...input } = candidate; return input; };

function buildReport() {
  const unresolved = contracts.validateCandidate(base);
  const discovered = contracts.validateCandidate({ ...base, sourceRoute: { state: "KNOWN", officialUrl: "https://manuals.fixture.example/2024.pdf" }, provenance: ["synthetic-fixture", "operator-supplied-route"], blockers: ["SOURCE-NOT-AUTHENTICATED"] });
  const partial = contracts.validateCandidate({ ...inputOf(discovered), authenticationState: "AUTHENTICATED", authority: { state: "KNOWN", value: "Fixture Motor" }, publication: { state: "KNOWN", value: "FIXTURE-2024-MANUAL" }, applicability: { ...base.applicability, market: { state: "KNOWN", value: "EU" }, transmission: { state: "KNOWN", value: "manual" }, equipment: { state: "PARTIAL", value: "standard" } }, provenance: ["synthetic-fixture", "authenticated-metadata"], blockers: ["EQUIPMENT-SCOPE-PARTIAL"] });
  const { unresolvedDimensions, ...partialApplicability } = partial.applicability;
  const ready = contracts.validateCandidate({ ...inputOf(partial), applicability: { ...partialApplicability, equipment: { state: "KNOWN", value: "standard" }, abs: { state: "KNOWN", value: true } }, accessState: "ACCESSIBLE-OFFICIAL", blockers: [] });
  const readyProspect = contracts.toExistingSourceProspect(ready);
  return { schemaVersion: "revlog-source-discovery-prospect-foundation/v1", syntheticOnly: true, candidates: [unresolved, discovered, partial, ready], transition: { state: ready.state, existingProspectId: readyProspect.id, readinessClassification: readyProspect.readinessClassification }, productionChanged: false, acquisitionPerformed: false, evidenceCreated: false };
}

module.exports = Object.freeze({ buildReport });
