# Research on Demand Source Acquisition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Execution was explicitly delegated to the assistant by the user.

**Goal:** Complete one source-acquisition layer preserving exact source identity and fail-closed applicability.

**Architecture:** Trusted server route selection delegates to existing Factory asynchronous acquisition. A local content-addressed custody store retains bytes; execution stops before extraction.

**Tech Stack:** Node.js built-ins and existing Factory contracts, no dependencies.

**Spec:** docs/superpowers/specs/2026-10-05-rod-source-acquisition-design.md

## Global Constraints

No production/live Supabase/RLS/secrets changes, no automatic promotion, no 95-field/14-category changes, no push. Preserve provenance and historical objects. One normal commit for the completed wave.

## Review Focus

- Wrong model/year/market/ABS/equipment/conditions: reject before network.
- Redirect to an unlisted endpoint: reject before contacting it.
- Different bytes at the same official URL: reject before custody.
- Custody corruption or write failure: never report acquired.
- Duplicate job: no network repeat or reusable knowledge write.

### Task 1: Exact route and custody integration

**Files:** server/research-on-demand-acquisition.js, server/research-artifact-store.js, research/data/research-on-demand-honda-route.js, research/factory/source-acquisition-adapters.js, tests/research-on-demand-wave11.test.js.

**Interfaces:** createSourceAcquisitionExecutor({routes, artifactStore}) returns an executor for createTrustedAsyncExecutionService. createFileArtifactStore({directory}) exposes put(artifact) and read(digest). Route data exports the exact Honda route.

- [ ] Write behavioral tests for the review focus, Factory lineage, failure classification and initial route proof.
- [ ] Run node --test tests/research-on-demand-wave11.test.js; expect missing implementation failures.
- [ ] Implement validated routes, exact-URL guard in existing HTTP adapter, file custody and asynchronous Factory composition.
- [ ] Run targeted tests including Waves 7/9/10 and HTTP/Factory acquisition; expect zero failures.
- [ ] Perform one local real-source proof; record actual outcomes, no live database writes.

### Task 2: Closure

**Files:** docs/project/CURRENT_STATE.md, ROADMAP.md, WORKLOG.md; generated project-state audit report.

**Interfaces:** Task 1 checkpoint becomes the documented next extraction boundary.

- [ ] Obtain one fresh whole-diff review; fix important findings with behavioral tests.
- [ ] Update project memory truthfully; stage new tracked files before report regeneration so inventory reflects them.
- [ ] Run syntax and diff checks, project-state audit, full node --test tests/*.test.js once near completion; expect zero failures.
- [ ] Create one normal commit; verify clean branch and report ahead/behind. Do not push or deploy.
