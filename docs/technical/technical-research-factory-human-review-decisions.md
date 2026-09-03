# Technical Research Factory — Human Review Decisions Foundation

Status: NON-PRODUCTION, deterministic, post-queue/pre-evidence boundary; schema version 1.

The Human Review Decisions layer consumes only structurally valid Review Queue schema 1 entries plus explicit caller-supplied decisions. It produces immutable decision records using the closed vocabulary `ACCEPT`, `REJECT` and `NEEDS-MORE-REVIEW`. Queue entries and all upstream acquisition/extraction state remain unchanged.

Each decision retains canonical references to the queue entry, raw candidate, extraction result, target/work, acquisition attempt, prospect, artifact and extractor. The reviewer ID is required, opaque caller metadata; it is not inferred from authentication, the OS, Git or environment. An optional comment is preserved byte-for-byte as metadata and does not affect identity.

Decision IDs are canonical SHA-256 derivatives of queue-entry ID, decision and reviewer ID. Output is sorted by decision ID. Exact duplicate records are idempotent. Different decisions or inconsistent metadata for one queue entry in the same bounded set fail closed; no conflict is resolved automatically.

`ACCEPT` means only suitable to proceed to a future evidence-processing stage. `REJECT` applies only to that candidate's future consideration. `NEEDS-MORE-REVIEW` triggers no routing or work. None creates evidence, researched-no-evidence, normalization, conflict resolution, retries, Orchestrator events, persistence or production changes.

Evidence processing, supersession/correction, conflict resolution, normalization, researched-no-evidence conversion, promotion, persistence and production integration remain separate future layers.
