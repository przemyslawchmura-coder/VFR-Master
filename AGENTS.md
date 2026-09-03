# AGENTS.md — RevLog / VFR-Master Repository Instructions

These instructions apply to all automated coding agents working in this repository.

## 1. Core Working Principle

Work in small, bounded, reviewable waves.

Do not broaden the requested scope.

If an adjacent improvement is useful but not required for the current task,
record it in the project backlog when appropriate instead of implementing it.

Prefer completing one architectural layer correctly over touching multiple
future layers.

## 2. Resource / Token Discipline

Agent usage is a constrained resource.

Use the minimum repository exploration necessary to complete the task.

Do not:
- broadly inspect unrelated directories
- repeatedly reread large files
- rerun identical tests without a reason
- regenerate reports repeatedly
- perform repository-wide audits unless explicitly requested

Prefer:
1. git status / current HEAD
2. directly relevant implementation files
3. directly relevant tests
4. targeted validation
5. full validation only when justified

If the user supplies verified test results from the current working tree,
do not rerun those tests unless subsequent changes could invalidate them.

## 3. Existing Work Must Be Preserved

Before editing, inspect:

    git status --short --branch

Never assume a dirty working tree is disposable.

Pre-existing modified or untracked files may contain valuable unfinished work.

Do not use destructive cleanup operations on existing work unless explicitly
requested.

In particular, do not automatically:

    git reset --hard
    git clean
    git checkout -- <file>
    git restore <file>

Do not overwrite unrelated user or agent work.

If unexpected dirty changes exist, preserve them and work around them whenever
the requested task can safely continue.

## 4. Scope Discipline

Implement only what the current task requires.

Do not add future architectural layers merely because they are obvious next
steps.

Do not perform opportunistic refactors.

Do not rename/reorganize unrelated code.

Do not silently change established contracts.

If the requested feature already exists, verify it instead of implementing a
duplicate.

## 5. Technical Research Factory Boundaries

The Technical Research Factory is non-production research infrastructure.

Maintain strict separation between research staging and production runtime.

Research modules must not silently:
- mutate production Technical Profiles
- register research candidates as production data
- convert extracted values into verified evidence
- infer missing technical values
- resolve conflicts without the designated layer
- manufacture researched-no-evidence states
- change readiness without the appropriate evidence/review process

Architectural stages must remain distinct.

Acquisition is not extraction.
Extraction is not normalization.
Review Queue entry is not a human decision.
Human ACCEPT is not verified evidence.
Conflict resolution is not implicit acceptance.
Research data is not production data.

Preserve raw values and provenance across research boundaries.

Applicability must remain explicit and fail closed where required.

Unknown values must not be silently converted into assumptions.

## 6. Human Review Decision Semantics

Unless a later explicit architecture decision changes these contracts:

ACCEPT:
- is pre-evidence
- does not mean verified production evidence
- does not normalize the candidate
- does not resolve conflicts automatically

REJECT:
- is candidate-local
- must not erase unrelated candidates or provenance

NEEDS-MORE-REVIEW:
- does not trigger acquisition retry
- does not trigger extraction
- does not create Orchestrator lifecycle transitions
- does not consume retry budget

Human Review Decisions remain outside production runtime.

## 7. Production Safety

Production data and existing verified Technical Profiles must remain unchanged
unless the task explicitly targets production promotion or correction.

Do not infer technical values from:
- similar motorcycles
- shared platforms
- model names
- enthusiast assumptions
- nearby model years

Shared-platform evidence is usable only when source applicability explicitly
supports the target.

Regional, ABS, transmission, equipment and model-year applicability must remain
explicit.

## 8. Testing Strategy

Use targeted tests first.

When targeted tests pass, run broader validation only when justified.

Avoid repeatedly running the complete suite during implementation.

Normally:
1. run directly affected tests
2. fix actual failures
3. rerun affected tests
4. run the full suite once near completion if required

Also use, where applicable:

    node --check <changed-js-file>
    git diff --check

Do not treat unrelated pre-existing failures as part of the current task without
evidence that the task caused them.

Never weaken or delete tests merely to obtain a passing result.

## 9. Determinism and Immutability

Technical Research Factory outputs should remain deterministic wherever the
existing architecture requires determinism.

Equivalent semantic inputs should not produce unstable identities or ordering.

Preserve existing deterministic ID conventions.

Do not mutate input contracts, acquisition artifacts, extraction candidates,
queue entries or other immutable research records.

Fail closed on malformed identity, provenance or applicability relationships.

## 10. Project Memory Contract

Repository project memory is part of the implementation process.

For completed implementation waves, inspect and update only the memory files
required by the existing repository convention.

Typical files include:

    docs/project/WORKLOG.md
    docs/project/CURRENT_STATE.md
    docs/project/ROADMAP.md
    docs/project/DECISIONS.md
    docs/project/BACKLOG.md
    docs/project/sessions/

Rules:

WORKLOG:
- append completed work
- do not rewrite historical entries

CURRENT_STATE:
- reflect the actual verified repository state

ROADMAP:
- maintain one clear active next phase where the repository convention requires it

DECISIONS:
- update only for genuine architecture/governance decisions
- do not create an ADR for routine implementation details

BACKLOG:
- record useful out-of-scope ideas instead of interrupting the current wave
- do not implement backlog ideas automatically

Session summaries:
- create/update only when required by repository convention

Run the existing project-memory consistency/audit mechanism when required.

Do not rewrite historical project memory merely to make an audit pass.

## 11. Git Discipline

Before implementation, know:
- current branch
- HEAD
- working-tree state
- ahead/behind state when relevant

Prefer one normal commit per completed bounded wave.

Do not:

    git commit --amend
    git rebase
    git squash

unless explicitly requested.

Do not push automatically.

Push only when the current user instruction explicitly requests it or an
unambiguous repository instruction requires it.

Never force-push unless explicitly requested for a specifically understood
reason.

After committing, report:
- commit SHA
- working-tree status
- ahead/behind state

## 12. Validation Claims

Do not claim validation that was not actually performed.

Clearly distinguish:
- targeted tests
- full suite
- syntax checks
- diff checks
- project-memory consistency checks

If a previously supplied validation result is reused because no relevant files
changed afterward, state that it was reused rather than rerun.

## 13. Reporting Discipline

Final reports should be concise.

Prefer reporting:
- what changed
- important semantics/boundaries
- tests/checks performed
- commit SHA
- git status
- blockers/deferred work

Do not spend substantial tokens narrating routine exploration.

## 14. Stop Conditions

Stop and report rather than guessing when:
- required provenance cannot be established
- applicability is ambiguous and the architecture requires certainty
- completing the task would require crossing an explicitly excluded boundary
- a destructive operation would be required on unexplained existing work
- repository state contradicts the supplied baseline in a way that materially
  changes the task

Otherwise, complete the bounded task instead of stopping after planning.

## 15. RevLog Development Rule

New ideas should normally go to BACKLOG rather than interrupting the active
development stage.

Finish the current bounded stage first.

The repository should evolve through controlled, validated increments rather
than simultaneous unfinished feature branches.
