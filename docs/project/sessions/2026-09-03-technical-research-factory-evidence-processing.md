# Technical Research Factory Evidence-Processing Contract Foundation session

Date: 2026-09-03

## Objective

Add an explicit, deterministic pre-promotion processing boundary over immutable Human Review Decisions.

## Completed

- Added processing schema 1 with accepted, rejected, deferred, ineligible and cannot-advance states.
- Preserved raw candidate content and complete queue/extraction/acquisition provenance.
- Kept accepted disagreements independent and unresolved; no normalization or winner selection.
- Added focused tests, deterministic report generation and Factory exports.

## Boundaries preserved

No evidence creation, researched-no-evidence conversion, normalization, conflict resolution, promotion, retries, Orchestrator events, production import, Supabase, UI or external research.

## Next

Design the bounded interrupted/resumed Ténéré Batch Pilot without executing it.
