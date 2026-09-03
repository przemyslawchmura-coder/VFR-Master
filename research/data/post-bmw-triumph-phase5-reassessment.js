// NON-PRODUCTION Phase 5 reassessment. Uses repository-known prospect state only.
"use strict";

const candidates = Object.freeze([
  { id: "unknown.ducati.monster937", catalogVariantKey: "ducati.monster.937", manufacturer: "Ducati", disposition: "HELD-PRE-PROMOTION", exclusionReason: "27 pre-promotion processing records are held; no promotion is authorized." },
  { id: "unknown.bmw.f900r", catalogVariantKey: "bmw.f-roadster-xr.f900r-1", manufacturer: "BMW", disposition: "HELD-PRE-PROMOTION", exclusionReason: "13 processing records, including 2 unresolved conflicts, are held." },
  { id: "unknown.triumph.streettriple765", catalogVariantKey: "triumph.street-triple.765-3", manufacturer: "Triumph", disposition: "APPLICABILITY-BLOCKED", exclusionReason: "EU and base/R/R LRH/RS applicability and catalogue mapping remain unresolved." },
  { id: "unknown.kawasaki.ninja650", catalogVariantKey: "kawasaki.ninja-650.gen2", manufacturer: "Kawasaki", disposition: "ACCESS-BLOCKED", exclusionReason: "Exact official EU identity remains unavailable and the route is blocked." },
  { id: "unknown.suzuki.sv650", catalogVariantKey: "suzuki.sv650.gen3", manufacturer: "Suzuki", disposition: "APPLICABILITY-BLOCKED", exclusionReason: "Exact year, standard/X and transmission applicability remain unresolved behind blocked access." },
  { id: "yamaha.tenere700.service.bw3-f8197-e0", catalogVariantKey: "yamaha.tenere-700.gen1", manufacturer: "Yamaha", disposition: "ACCESS-BLOCKED", exclusionReason: "Authentication path remains exhausted/blocked and MY2019 EU standard applicability is unresolved." },
  { id: "yamaha.mt09.service.b7n-28197-e0", catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", disposition: "ACCESS-BLOCKED", exclusionReason: "B7N/LIT relationship, EU scope and standard/SP applicability remain unresolved; path exhausted." },
  { id: "honda.cbr500r.service-family.2024", catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", disposition: "ACCESS-BLOCKED", exclusionReason: "Exact publication identity and authenticated service access remain unavailable." },
  { id: "honda.vfr800.service-mirror.61mcw07", catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", manufacturer: "Honda", disposition: "EXPLICITLY-DEFERRED", exclusionReason: "Mirror-only identity conflicts with repository history; dedicated reconciliation is deferred." },
  { id: "harley.sportster-rh.94001064", catalogVariantKey: "harley-davidson.revolution-max.sportster-s", manufacturer: "Harley-Davidson", disposition: "REJECTED-MISMATCH", exclusionReason: "Official source is MY2023 while the selected target is MY2022; access is also blocked." },
  { id: "honda.africa-twin.owner.31mks800", catalogVariantKey: "honda.africa-twin.crf1100l-1", manufacturer: "Honda", disposition: "REJECTED-MISMATCH", exclusionReason: "Known USA source does not safely cover the selected EU/UK standard target." },
  { id: "honda.cbr500r.owner.31mlrb00", catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", disposition: "EXHAUSTED", exclusionReason: "Owner-manual field yield is exhausted at 26/44; pilot added zero net-new slots." },
  { id: "honda.vfr800.service-card", catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", manufacturer: "Honda", disposition: "EXHAUSTED", exclusionReason: "All authenticated fields are already represented; pilot added zero slots." },
  { id: "honda.nc750x.owner.34mkw600", catalogVariantKey: "honda.nc750x.rh09-1", manufacturer: "Honda", disposition: "EXHAUSTED", exclusionReason: "Bounded owner-manual fields are exhausted after yielding 25 slots." },
  { id: "honda.cbr600rr.owner.32mkz700", catalogVariantKey: "honda.cbr600rr.rh10", manufacturer: "Honda", disposition: "EXHAUSTED", exclusionReason: "Bounded owner-manual fields are exhausted after yielding 25 slots." },
  { id: "yamaha.mt09.owner.b7n-28199-e0", catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", disposition: "EXHAUSTED", exclusionReason: "Owner manual yielded 27 practical slots; remaining gaps require another class." },
  { id: "yamaha.tenere700.owner.bw3-f8199-e0", catalogVariantKey: "yamaha.tenere-700.gen1", manufacturer: "Yamaha", disposition: "EXHAUSTED", exclusionReason: "Owner manual yielded 27 practical slots; remaining gaps require another class." },
  { id: "yamaha.mt09.service.b7n-28197-e0:historical", catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", disposition: "EXPLICITLY-DEFERRED", exclusionReason: "No new repository-known prospect exists after the exhausted authentication route; do not repeat it." }
]);

function buildReport() {
  const counts = Object.fromEntries([...new Set(candidates.map(candidate => candidate.disposition))].map(disposition => [disposition, candidates.filter(candidate => candidate.disposition === disposition).length]));
  return Object.freeze({
    schemaVersion: "revlog-post-bmw-triumph-phase5-reassessment/v1",
    date: "2026-09-03",
    candidatesReassessed: candidates.length,
    candidates,
    exclusionCounts: Object.freeze(counts),
    viableCandidatesRemaining: Object.freeze([]),
    selectedNextTarget: null,
    ranking: Object.freeze({ criteria: Object.freeze(["exact catalogue identity quality", "Tier A/B authentication likelihood", "accessibility feasibility", "applicability risk", "expected practical Service Core gain", "expected research cost"]), rankedViableCandidates: Object.freeze([]), conclusion: "No defensible candidate remains: all repository-known routes are held, blocked, exhausted, mismatched or explicitly deferred." }),
    newExternalResearchPerformed: false,
    technicalValuesInspected: false,
    evidenceRowsAdded: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", candidateSupply: "EXHAUSTED-OR-BLOCKED", conclusion: "Post-BMW/Triumph reassessment used repository metadata only and selected no next prospect-registration target. Phase 5 remains paused until a genuinely new, in-scope prospect becomes available." }),
    exactNextTask: "Record a new repository-known Tier A/B prospect only when it is not held, exhausted, access-blocked, applicability-blocked or explicitly deferred; otherwise keep Phase 5 paused."
  });
}

module.exports = Object.freeze({ candidates, buildReport });
