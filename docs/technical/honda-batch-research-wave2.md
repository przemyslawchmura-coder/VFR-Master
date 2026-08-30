# Honda Batch Research Wave 2

This wave is the first scaling test of the generic research pipeline. It selected
12 catalogue-backed Honda targets across sport, adventure, roadster and V4 families,
then reused official Honda owner-manual and UK brochure documents instead of creating
one research script per motorcycle.

The batch uses `research/lib/batch-research-pipeline.js` for target generation, gap
calculation, proof filtering, applicability, document deduplication, prioritization,
review queues and reporting. The 2021 Honda Super Sport brochure supports multiple
supersport targets and the Adventure brochure supports multiple adventure targets;
the mirrored Super Sport URL is one underlying document, not independent evidence.

Six new field/target slots were verified from inspected official brochure pages:
engine configuration for CBR600RR RH10, CBR1000RR-R SC82, CRF1100L Africa Twin,
NC750X RH09 and CBR650R 2021, plus CBR650R displacement. Applicability is retained
as EU/UK, model-specific and MY2021. No DCT/manual, ABS or regional assumptions are
inferred. Existing VFR800 remains 13/44 with 24 uncertain rows blocked; CBR500R
remains 26/44. Research stays quarantined and no production value is promoted.

Partial coverage is normal. The generated review queue prioritizes unresolved fields,
conflicts and applicability blockers for later human review rather than blocking work
on the rest of the catalogue.
