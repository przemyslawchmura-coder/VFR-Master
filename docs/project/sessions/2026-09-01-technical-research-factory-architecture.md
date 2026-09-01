# Technical Research Factory architecture — 2026-09-01

Starting state: clean `main`, HEAD `92fa8bbedaef6b8956c10a3b2714050e3a8fabdd`, origin/main `97484bf004c466a6f26a5e42ae07b91214e95962`, ahead 7/behind 0.

The architecture audit reconstructed the implemented research pipeline rather than treating prior design prose as implementation. RevLog already has reusable research schemas and validators, canonical Service Core coverage, document identity/deduplication, limited normalization, comparison/conflict handling, coverage/yield reporting, review-queue primitives and strong production isolation. It does not yet have one versioned target/prospect/applicability contract, one canonical readiness/applicability gate, deterministic acquisition budgets and state transitions, stable attempt/event/checkpoint identities, or a resumable multi-target orchestrator.

The accepted-with-risks design uses a manufacturer-neutral core with optional manufacturer discovery adapters. Adapters may supply endpoint and publication-code hints but cannot declare readiness, applicability or evidence. External agents may discover, authenticate and extract, but must return typed findings that deterministic repository logic validates and records. Research-to-production promotion remains manual.

The MVP is split into Foundation, Orchestrator, Work Items, Batch Pilot and Scale-Up waves. Ténéré 700 service prospect `BW3-F8197-E0` remains `REGISTERED-NOT-REAUTHENTICATED` and is preserved as `FACTORY-PILOT-CANDIDATE`; it was not authenticated here.

Exact NEXT: implement the bounded Factory Foundation with versioned manufacturer-neutral `ResearchTarget`, `SourceProspect`, `ApplicabilityScope` and `GapPlan` contracts, validators, compatibility adapters and one canonical fail-closed readiness/applicability gate. No external research, live-data migration, acquisition, extraction or production change is part of that task.

No external motorcycle research, evidence rows, researched-no-evidence states, Service Core coverage, production profile/registry, runtime/browser, catalogue, cloud backend or VFR800 production data changed.
