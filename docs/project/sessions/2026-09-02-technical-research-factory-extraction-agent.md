# Technical Research Factory Extraction Agent session

Date: 2026-09-02

## Objective

Implement one bounded, non-production boundary from a canonical successful acquisition result and supplied local content to immutable machine-produced raw extraction candidates.

## Completed

- Added closed versioned contracts for content envelopes, local extractor declarations, raw candidates, extraction observations and results.
- Added deterministic synthetic adapters covering candidates, no candidates, unsupported media, unmapped fields, parse failure, permanent extraction failure and malformed output.
- Added a pure Extraction Agent that resolves ownership through canonical Factory state, validates acquisition metadata and content integrity, rejects forged adapter identity, preserves raw provenance and generates stable candidate identities/order.
- Replayed the same acquisition checkpoint and proved byte-identical extraction with the same content and adapter.
- Added deterministic reporting, public Factory exports, isolation coverage and focused technical documentation.

## Validation

- Extraction Agent tests: 23/23 passed.
- Related Factory tests: 87/87 passed.
- Full suite: 522/522 passed; 0 failed, 0 skipped, 0 todo.
- Changed JavaScript: `node --check` passed.
- `git diff --check`: clean.
- Extraction Agent and project-state reports: byte-for-byte deterministic.

## Boundaries preserved

No network, PDF/OCR/browser parsing, normalization, evidence conversion, acquisition retry/state change, Orchestrator extraction events, durable extraction persistence, production import or motorcycle research was added. Review Queue remains NOT STARTED.

## Next

Implement Review Queue only as a separate bounded wave over validated raw extraction outputs.
