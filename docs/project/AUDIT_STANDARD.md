# Project Audit Standard

This is the permanent independent acceptance gate for RevLog. The lifecycle is:

`IMPLEMENT → AUTHOR TESTS → INDEPENDENT AUDIT → ACCEPT / ACCEPT-WITH-RISKS / REJECT → PROJECT MEMORY UPDATE → NEXT`.

An independent audit attempts to falsify the work. It inspects implementation, tests, data flow, source evidence, applicability, boundaries, edge cases, regressions, assumptions, generated artifacts, documentation, and git diff/history. Passing tests only proves that the tested behavior is internally consistent; it does not prove the underlying claim is correct.

## Evidence and expectation discipline

Generated reports, snapshots, expected counts and implementation output are not independent proof of themselves. Test fixtures must be checked against source data, semantics and boundary behavior. Changing an expected value merely because current output changed is insufficient. Every expectation change is classified `JUSTIFIED`, `JUSTIFIED-WITH-RISK`, `UNJUSTIFIED`, or `UNKNOWN`, with the old expectation, new expectation, semantic reason, independent evidence, and whether behavior or only the expectation changed.

## Outcomes

- **ACCEPT** — independently supported; no material unresolved risk blocks continuation.
- **ACCEPT-WITH-RISKS** — usable, but documented risks remain.
- **REJECT** — material correctness, evidence, regression, architecture or verification problems remain.

Roadmap advancement and project-memory completion require an audit outcome; tests alone never advance a phase.

## Required record

Before acceptance, record the scope, independent checks, falsification attempts, expectation classifications, unresolved risks, production/research boundary, git state, test/check results, and final outcome. Then update `CURRENT_STATE.md`, `WORKLOG.md`, `ROADMAP.md`, `DECISIONS.md`, `BACKLOG.md` where applicable. Future meaningful prompts may say: **Apply the repository Audit Standard before acceptance.**

## This audit

The remanent is **ACCEPT-WITH-RISKS**: memory structure and repository counts are sound, but Honda Batch Wave 2 produced only six generic specification slots across 528 target slots and zero practical-service fields. Scaling is therefore premature until source strategy and productivity metrics are improved.
