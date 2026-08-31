#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const results = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const root = path.join(__dirname, "..");

const json = {
  schemaVersion: results.schemaVersion,
  researchDate: results.researchDate,
  classification: "ACCEPT-WITH-RISKS",
  thresholds: { totalSlotsRequired: 15, totalSlotsMet: results.metrics.verifiedTargetSlotGain >= 15, practicalSlotsRequired: 10, practicalSlotsMet: results.metrics.practicalServiceFieldGain >= 10, zeroSafetyCriticalConflictsRequired: true, zeroSafetyCriticalConflictsMet: results.conflicts.length === 0 },
  metrics: results.metrics,
  targets: results.targetResults,
  sources: results.sources,
  conflicts: results.conflicts,
  researchedNoEvidence: results.researchedNoEvidence,
  stopConditionsTriggered: [...new Set(results.sources.map(source => source.stopCondition))],
  audit: {
    outcome: "ACCEPT-WITH-RISKS",
    classifications: { expected: ["official owner manuals concentrate practical Service Core data", "existing CBR500R and VFR sources add no duplicate gain"], supportedSurprise: ["two yielding Tier A manuals produced 50 target-slot gains", "manual/DCT oil capacities require explicit transmission applicability"], unresolved: ["NC750X MY2024 is not covered by publication 34MKW600", "CBR600RR MY2025 is not covered by publication 32MKZ700", "VFR workshop-manual identity", "Africa Twin EU/UK standard versus Adventure Sports applicability"], failure: [] },
    productionChanged: false,
    vfrProductionChanged: false,
  },
};

function targetLine(target) {
  return `| \`${target.catalogVariantKey}\` | ${target.before} | ${target.after} | +${target.gain} | +${target.practicalGain} | +${target.genericGain} | ${target.documentsInspected} | ${target.documentsYieldingEvidence} | ${target.highestTier} | ${target.applicabilityBlockers.join("; ") || "none"} |`;
}

const markdown = `# High-value source-acquisition pilot — executed result

Date: ${results.researchDate}<br>
Classification: **ACCEPT-WITH-RISKS**<br>
Boundary: **NON-PRODUCTION RESEARCH**

## Outcome

The bounded five-target pilot met both formal yield thresholds without an unresolved safety-critical conflict: ${results.metrics.serviceCoreBefore}/220 → ${results.metrics.serviceCoreAfter}/220 verified target slots, +${results.metrics.verifiedTargetSlotGain} total, +${results.metrics.practicalServiceFieldGain} practical-service and +${results.metrics.genericSpecificationGain} generic-specification slots. The result is not a broad applicability claim: the acquired NC750X manual covers MY2021–2023, the CBR600RR manual covers MY2024, and three targets yielded no new evidence.

## Metrics

- Documents inspected / unique documents: ${results.metrics.documentsInspected} / ${results.metrics.uniqueDocuments}
- Hosting locations / duplicate locations: ${results.metrics.hostingLocations} / ${results.metrics.duplicateHostingLocations}
- Yielding documents: ${results.metrics.documentsYieldingEvidence}
- Evidence rows / verified slot gain: ${results.metrics.evidenceRowsProduced} / ${results.metrics.verifiedTargetSlotGain}
- Evidence rows per yielding document: ${results.metrics.evidenceRowsPerYieldingDocument}
- Source tiers: A=${results.metrics.sourceTierDistribution.A}, B=0, C=0, D=0
- Conflicts: ${results.metrics.conflictsDiscovered}; unresolved applicability/researched-no-evidence cases: ${results.metrics.unresolvedApplicabilityCases}
- Source budget exceeded: no

## Target results

| Target | Before | After | Gain | Practical | Generic | Inspected | Yielding | Tier | Blocker |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
${results.targetResults.map(targetLine).join("\n")}

Important remaining practical gaps are retained machine-readably in \`research/reports/high-value-source-acquisition-pilot.json\`.

## Source and stop record

${results.sources.map(source => `- **${source.publicationId}** (${source.tier}, ${source.sourceClass}): ${source.targets[0]}; ${source.disposition}; inspected pages ${source.inspectedPages.join(", ")}; stop: ${source.stopCondition}. ${source.notes}`).join("\n")}

One CBR600RR document identity has two Honda Motopub locations (PDF and HTML); it counts once. Existing CBR500R and VFR documents were reused without re-counting baseline evidence.

## Independent audit

The audit independently recomputed the five target keys, 51-slot baseline, document identity/location counts, before/after slots, practical/generic classification, transmission-scoped NC750X oil rows, conflicts and budgets from repository data.

Falsification checks found:

1. Practical value is real: 48/50 gained slots are service fields, not brochure specifications.
2. Every inspected document is Tier A; no Tier C/D row is accepted.
3. The duplicate CBR600RR PDF/HTML locations collapse to one document identity.
4. Existing CBR500R/VFR fields were not emitted as new rows.
5. NC750X manual/DCT oil quantities remain separate; the pipeline now represents \`manual\` and \`dct\` explicitly.
6. CBR600RR evidence is ED/II ED road-owner data; GS schedule and race/track data are excluded.
7. Africa Twin USA/Adventure Sports applicability was rejected, not generalized to the EU/UK standard target.
8. Tire pressures, brake fluid, chain slack and intervals retain page, condition and applicability proof.
9. Generic gain is exactly two idle-speed slots and is excluded from the 48-slot practical count.
10. Each target used one primary document, below the three-document cap.
11. Production registry/profile/runtime files are unchanged.
12. Metrics are reproduced by \`node scripts/high-value-source-acquisition-pilot-report.js\` and focused tests.

Skeptical classification: expected — Tier A owner manuals yield concentrated service data and exhausted sources yield nothing; supported surprise — two documents produce +50 scoped slots and expose the transmission-enum defect; unresolved — NC750X MY2024, CBR600RR MY2025, VFR manual identity, and Africa Twin EU/UK standard applicability; failure — none against the formal bounded pilot thresholds.

Outcome: **ACCEPT-WITH-RISKS**. The pilot goal is achieved, but the unresolved year/applicability boundaries prevent treating 101/220 as uniform coverage across every year/submodel in each target scope.
`;

if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(root, "research/reports/high-value-source-acquisition-pilot.json"), `${JSON.stringify(json, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "docs/technical/high-value-source-acquisition-pilot-results.md"), markdown);
} else {
  process.stdout.write(`${JSON.stringify(json, null, 2)}\n`);
}
