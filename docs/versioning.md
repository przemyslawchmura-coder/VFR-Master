# RevLog application versioning

## Policy

RevLog uses Semantic Versioning (`MAJOR.MINOR.PATCH`). `PATCH` covers fixes, catalogue/data corrections, and minor internal improvements. `MINOR` covers meaningful user-visible features or larger catalogue/data capabilities. `MAJOR` marks an incompatible change or stable-product milestone.

The single source of truth is `js/app-release.js`. Its `currentVersion` identifies the application release, and its newest-first `releases` collection contains the date, title, and concise user-facing changes. Formal numbered history begins with `0.1.0`; older development must be described as pre-versioning history, never assigned fabricated version numbers.

## Required release workflow

Every deliberate production release push to `main` must:

1. update the canonical application version when appropriate;
2. add or update the corresponding newest-first release-history entry;
3. ensure O aplikacji renders that canonical metadata;
4. pass release-metadata, About rendering, static-load, and full-suite validation.

Production behavior must not change silently without an appropriate release-history entry. Release notes should describe user-visible outcomes, avoid internal test/build detail, and must not overstate catalogue coverage.

## VERSION / CHANGELOG final-push gate

Every future final verification prompt before pushing `origin/main` must explicitly verify:

- the intended SemVer application version;
- a unique matching latest release entry and valid release date;
- About/O aplikacji version and changelog consistency;
- newest-first history ordering;
- passing `tests/app-versioning.test.js` and relevant UI/static-load tests.

The metadata ships with the static application and must never depend on GitHub, Supabase, a CDN, or another network source. Commit SHAs are not mandatory release metadata because embedding the SHA in the same commit would be self-referential.
