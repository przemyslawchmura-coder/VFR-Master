# Technical Research Factory — Review Queue Foundation

Status: NON-PRODUCTION, deterministic, pre-decision queue boundary; schema version 1.

The Review Queue consumes only validated Extraction schema 1 results. A `CANDIDATES-PRODUCED` result creates one immutable `QUEUED` entry per raw candidate. Each entry embeds the unchanged validated candidate and binds it to the canonical batch, target, target-work, source-work, attempt, prospect, artifact, extraction-result, extractor and candidate identities. Queue presence means only eligible for future review.

All other extraction dispositions produce deterministic ineligibility records rather than entries. `NO-CANDIDATES` remains zero machine-extracted candidates, not researched-no-evidence. Unsupported media, incomplete provenance, content-integrity mismatch, unmapped fields and extraction failures remain extraction outcomes; none is a human rejection or evidence decision. Malformed extraction contracts and identity collisions fail closed.

Entry IDs are SHA-256 semantic derivatives of the extraction-result and candidate IDs using canonical Factory JSON. Entries are sorted by entry ID. Exact byte-equivalent duplicate inputs collapse by entry identity; two candidates with the same visible value but different canonical provenance remain distinct. A duplicate identity carrying different raw content is rejected rather than silently collapsed.

The foundation is pure and in-memory. It does not mutate extraction inputs, acquisition attempts or retry budgets; emit Orchestrator events; normalize values or units; resolve conflicts; create human decisions or evidence; convert researched-no-evidence; persist data; access a network; or touch production runtime and Technical Profiles.

Human Review Decisions, reviewer identity, decision transitions, evidence conversion, normalization, conflict handling, persistence and lifecycle integration remain separate future work.
