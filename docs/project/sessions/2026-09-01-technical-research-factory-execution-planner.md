# Technical Research Factory Execution Planner — 2026-09-01

Starting state: clean `main`, HEAD `67f547273972c441f4870cd425974f359eaf0427`, origin/main `97484bf004c466a6f26a5e42ae07b91214e95962`, ahead 10/behind 0.

Implemented planner schema 1 under `research/factory/`: PlanningPolicy semantic IDs, explicit KNOWN/UNKNOWN SourceCapabilities, typed PlanningDecisions, deterministic safety/practical/source-class/tier/coverage/cost priority, gap-only eligibility, semantic deduplication, finite target/batch/attempt limits and canonical Orchestrator output. Missing, conflict and researched-no-evidence states remain distinct.

Falsification covered spoofed readiness, unknown capability, no-gap candidates, blocked/mirror/UNKNOWN/PARTIAL/exhausted/mismatched sources, class/tier ordering, policy identity omissions, array order, duplicates, batch packing, attempt bounds, ABS false/unknown, manual/DCT, EU/US, year, standard/SP, JSON safety, mutation and direct reducer consumption. Existing Honda CBR500R, Yamaha MT-09 and VFR800 defer as exhausted; Harley rejects mismatch; Ténéré remains blocked / REGISTERED-NOT-REAUTHENTICATED. No source was contacted.

Audit: `ACCEPT-WITH-RISKS`. The planner does not override Foundation readiness or invent capability, and no material defect remains. Risks are that capability declarations are trusted local inputs pending typed outcome validation, expected coverage is declared rather than future measured yield, and no current real prospect is ready, so PLANNED compatibility uses a synthetic fixture.

Expectation classification: 13 added planner tests and the suite-total change from 467 to 480 are `JUSTIFIED`; they add planner behavior without changing historical semantics or prior expectations.

Production/research boundary: no external research, authentication, remote manual, evidence, researched-no-evidence addition, Service Core/coverage, production profile/source registry, runtime/browser, catalogue, Supabase, release, VFR800 production or historical data changed. Ténéré was not authenticated.

Exact NEXT: bounded Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation—typed attempts and immutable outcomes/events for already-planned SourceWorkItems under existing readiness, attempt and checkpoint limits, using synthetic/local fixtures only.
