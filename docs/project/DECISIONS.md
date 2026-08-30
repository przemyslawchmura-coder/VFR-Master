# Architectural decisions

## ADR-001 — Stable catalogue identity is the join key

Date: 2026-08-30 (recovered from history)
Decision: catalogue variant keys and explicit year ranges identify motorcycles; textual names are not heuristic identity.
Rationale: migration, resolver, profile and search tests enforce explicit identity.
Consequences: aliases and legacy records require deterministic mapping; unknown context remains unresolved.
Status: ACTIVE. Related commits: catalogue waves and migration work in `origin/main..HEAD`.

## ADR-002 — Missing data stays unknown

Decision: missing technical/research values remain null or explicit not-researched; they are never guessed, zero-filled, or copied from similar models.
Rationale: research validators and applicability tests enforce this.
Consequences: partial coverage is valid and review queues remain honest.
Status: ACTIVE. Related commits: `60692a7`, `a69191f`, `fe2df11`.

## ADR-003 — Production and research are isolated

Decision: `research/` datasets are non-production and require deliberate promotion.
Rationale: runtime-boundary tests prove production does not import research.
Consequences: research can remain incomplete without changing user behavior.
Status: ACTIVE. Related commits: `1db7d6d`, `fe2df11`.

## ADR-004 — Technical Profiles resolve through registry and context

Decision: profile discovery, loading, applicability, clarification and search are resolver/registry responsibilities.
Rationale: VFR runtime and browser tests exercise this path.
Consequences: profiles must declare catalogue/year/context applicability.
Status: ACTIVE.

## ADR-005 — ABS and other applicability dimensions are tri-state

Decision: true, false and null remain distinct; unknown is not common applicability.
Rationale: resolver and clarification tests explicitly preserve false and unknown.
Consequences: ambiguous context is surfaced instead of guessed.
Status: ACTIVE.

## ADR-006 — Evidence requires source proof, not metadata

Decision: only verified proof statuses count; metadata-only, partial-content, uncertain identity and fingerprint-only material do not.
Rationale: VFR audits and evidence tests enforce page/source/applicability provenance.
Consequences: source recovery may leave fields blocked.
Status: ACTIVE. Related commits: `a60cf26`, `edac48a`, `7f8d406`.

## ADR-007 — Service Core is one shared subset

Decision: all research targets use the canonical 44-field Service Core.
Rationale: Honda reporting and batch tests enforce one deterministic list.
Consequences: partial coverage is comparable across manufacturers.
Status: ACTIVE. Related commits: `1db7d6d`, `a69191f`.

## ADR-008 — Batch research reuses documents and preserves applicability

Decision: source identity is independent of hosting URL; one document may support multiple explicitly covered targets, while extraction candidates remain separate from evidence.
Rationale: generic pipeline tests prove mirror deduplication, reuse, normalization, conflicts and review queues.
Consequences: batch work prioritizes high-leverage sources without inflating corroboration.
Status: ACTIVE. Related commit: `fe2df11`.

## ADR-009 — Independent Audit Gate precedes roadmap advancement

Date: 2026-08-30
Decision: meaningful work must be independently audited for falsification before memory is updated or the roadmap advances.
Rationale: the Honda batch audit showed that passing tests and a 100% row-yield metric can coexist with zero practical-service gain.
Consequences: expectation changes require semantic justification; batch reports distinguish row yield from target-slot and practical-field gain.
Status: ACTIVE. Related commit: `45f43ae` and this audit.
