# RevLog project memory

This directory is the durable, repository-backed memory of RevLog. It records current truth, decisions, chronological work, planned work, and optional session context without replacing executable code or tests.

Before accepting meaningful implementation, read and apply `AUDIT_STANDARD.md`; it is the independent falsification gate for this project.

Authority order (highest first):

1. current executable code + tests
2. `CURRENT_STATE.md`
3. `DECISIONS.md`
4. `WORKLOG.md`
5. git history
6. current technical/research reports
7. historical reports
8. chat archive

Chat exports are historical context only. They are never production truth or technical evidence.

## How to resume this project

1. Inspect `git status`, `HEAD`, and `origin/main`.
2. Read `CURRENT_STATE.md`.
3. Read `ROADMAP.md` and the newest `WORKLOG.md` entries.
4. Inspect relevant decisions in `DECISIONS.md`.
5. Verify claims against code and tests before acting.

## Update contract

Every meaningful task must complete a **PROJECT MEMORY UPDATE** before commit:

- append `WORKLOG.md`;
- update `CURRENT_STATE.md` when current truth changes;
- update `ROADMAP.md` when phase/task status changes;
- update `DECISIONS.md` for architectural decisions;
- put deferred ideas in `BACKLOG.md`;
- add a session summary for major sessions;
- run `node scripts/project-state-audit.js --write`, consistency tests, syntax checks, and `git diff --check`.

Optional manual exports belong in `chat-archive/YYYY-MM-DD-topic.*` (`.md`, `.txt`, `.json`, or `.html`). Reconcile useful claims with code, tests, and git before promoting them into authoritative memory.
