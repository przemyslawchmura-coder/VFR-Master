# Technical Research Factory Orchestrator Foundation — 2026-09-01

Starting state: clean `main`, HEAD `04bfd1b6885cb8fc4b87fb660545db6144376fa3`, origin/main `97484bf004c466a6f26a5e42ae07b91214e95962`, ahead 9/behind 0.

Implemented orchestration schema 1 under `research/factory/`: versioned ResearchBatch, TargetWork, SourceWorkItem, ResearchAttempt, ResearchEvent, ResearchSnapshot and Checkpoint contracts; canonical JSON safety; stable local SHA-256 semantic IDs; immutable append-only events; pure replay reduction; bounded transitions/attempts; and checkpoint/resume verification. Foundation #1 target/prospect validation and readiness remain authoritative.

Falsification covered hidden clock/randomness, order-sensitive batch IDs, insufficient identities, event/content ID tampering, non-contiguous replay, duplicate target/source work, duplicate active attempts, completion before start, terminal restart, unresolved batch completion, budget overrun, retry exhaustion, blocked/mirror/UNKNOWN/PARTIAL promotion, non-JSON values, circular input, mutation, checkpoint version/history/snapshot mismatch and replay drift. Honda CBR500R and Yamaha MT-09 remain EXHAUSTED, Harley remains REJECTED, and Ténéré remains BLOCKED / REGISTERED-NOT-REAUTHENTICATED. ABS false/unknown, manual/DCT, EU/US, year and standard/SP boundaries remain Foundation-owned and fail closed.

Audit: `ACCEPT-WITH-RISKS`. No falsification exposed a material state-safety defect. Risks are that durable event storage is caller-owned, planner/scheduler and typed external-result ingestion are absent, and historical records remain behind adapters. These omissions are explicit future boundaries, so they do not require REJECT, but they preclude unqualified ACCEPT.

Expectation classification: the added orchestrator tests and suite-total increase from 454 to 467 are `JUSTIFIED`; they add new state-machine/replay invariants without changing historical behavior. No prior expectation was edited merely to match implementation output.

Production/research boundary: no external research, authentication, evidence, researched-no-evidence, Service Core/coverage, production profile/source registry, runtime/browser, catalogue, Supabase, release, VFR800 or historical dataset changed. The Ténéré source was not contacted.

Exact NEXT: bounded Technical Research Factory Execution Planner—translate canonical GapPlans and SourceProspects into deterministic ResearchBatch, TargetWork and SourceWorkItem plans under explicit readiness/source-class/attempt budgets, with local fixtures only and no external execution.
