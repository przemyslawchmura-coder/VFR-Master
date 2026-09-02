# Technical Research Factory — Extraction Agent / Local Extractor Adapter Foundation

Status: NON-PRODUCTION raw-extraction boundary; schema version 1.

This wave consumes one canonical `ACQUIRED` `ExecutionResult`, its immutable Orchestrator event history, the matching canonical `ResearchTarget`, a digest-bound UTF-8 `ArtifactContentEnvelope`, and one declared deterministic local extractor. It produces an immutable `ExtractionResult` containing raw `ExtractionCandidate` records and extraction observations.

Acquisition metadata and content remain separate. The envelope must match the acquisition artifact ID, media type, byte length, and SHA-256 digest before adapter invocation. Network, browser, filesystem discovery, PDF parsing, OCR, and authentication are excluded.

Canonical ownership is resolved through `SourceWorkItem.targetWorkId → TargetWork.batchId/targetId`. `SourceWorkItem` does not gain a parallel batch ID. The completed acquisition attempt and stored result must match the supplied execution result. Extractors cannot provide or override canonical Factory identities.

Candidates preserve the original value, optional original unit, explicit source location, extraction method, and only explicitly supplied applicability/context. They are raw machine-produced candidates—not verified evidence, accepted data, normalized values, researched-no-evidence, or production-ready records. Candidate and result identities are semantic SHA-256 derivatives with deterministic ordering.

Extraction does not emit Orchestrator events, consume acquisition attempts, change work state, mutate checkpoints, perform review, resolve conflicts, or persist output. Repeating extraction after checkpoint-verified acquisition replay yields byte-identical output for identical content and adapter versions.

Review Queue, human decisions, normalization, conflict integration, durable extraction persistence, real parsers, real research, and production promotion remain explicitly deferred.
