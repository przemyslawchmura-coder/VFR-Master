# Generic batch technical-research pipeline

Research is a quarantine workflow, not a production data source. The pipeline in
`research/lib/batch-research-pipeline.js` makes the VFR800 provenance rules reusable
across manufacturers.

The workflow is:

`catalogue → target generation → gap calculation → source acquisition → document identity → extraction candidates → validated evidence → comparison/conflicts → coverage → review queue`.

The canonical 183-field schema and its 44-field Service Core are shared by every
target. Partial coverage is normal: unresolved fields remain `not-researched`,
`researched-no-evidence`, uncertain, or conflicting and never count as verified.

The generic policy centralizes verified-proof predicates, acquisition dispositions,
document identity/deduplication, applicability (including ABS/transmission tri-state),
unit normalization, comparison semantics, gap calculation, priority scoring and
deterministic review queues/reports. A publication identity deduplicates mirror URLs;
hosting locations are retained separately. Extraction candidates are intentionally
not evidence until provenance, page, applicability and proof status validate them.

VFR800 remains a regression fixture at 13/44 with 24 source-identity-uncertain rows;
CBR500R remains 26/44 Service-Core-Partial. No production profiles, catalogue data,
runtime, release metadata, or persistence systems are imported or modified.
