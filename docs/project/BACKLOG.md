# Deferred backlog

Planning items only; none are executed by this stocktake.

## Application / UX

- Expand production Technical Profiles beyond the VFR reference path.
- Review mobile/iOS interaction and offline error states.
- Improve authenticated empty/loading/error flows.
- Add future “Instrukcja źródłowa” presentation: show a profile’s lawful principal manual link with title, type, applicability and publication number, plus an optional verification link. Do not download/copy manuals or expose internal source IDs as the primary UX.
- Integrate periodic-maintenance mileage/time inspect/replace/adjust data with Garage and Service history reminders. Preserve model applicability and keep this separate from the current governance foundation.
- **RevLog PL/EN internationalization (i18n)** — future bounded feature. Polish remains the default language; add a Polish/English selector through one centralized deterministic i18n/presentation layer. Gradually move user-facing strings to translation keys instead of duplicated hard-coded PL/EN branches. Keep technical data single-source and language-independent: translate presentation labels/descriptions, not canonical technical identities or values. Persist the language preference for the user/device when implemented. Cover authentication, dashboard, garage, service, Technical Database, search, errors, empty states, source presentation and About consistently. Do not implement i18n or add the selector in the current wave.

## Cloud/backend

- Verify Supabase schema, RLS and ownership in a controlled live environment.
- Add operational sync diagnostics and recovery documentation.

## Catalogue and market coverage

- **GLOBAL CATALOGUE GAP / COVERAGE AUDIT** — inventory current manufacturers/families/variants/years; identify missing manufacturers, generations, regional/ABS/transmission identities and prioritize additions. Planning only.
- Audit 125/A1-class motorcycles and scooters.
- Future audit: Chinese manufacturers — CFMoto, Voge, Zontes, QJMotor, Kove.
- Future audit: Polish-market brands/rebrands — Junak, Barton, Romet.
- Audit regional aliases, discontinued models and current MY2025+ boundaries.

## Technical profiles / research / tooling

- **Technical Profile user-facing textual-value localization** — future bounded presentation work for source values containing human-readable descriptions, such as Ducati `Front/rear brake circuit: DOT 4`. Preserve the canonical technical/source value internally while allowing the Polish UI to present a natural Polish description; do not alter the stored value or technical identity.
- Complete the deferred Technical Research Factory waves after the completed contract/orchestrator/planner/execution-agent/extraction-agent/review-queue/human-decision/evidence-processing foundations: interrupted/resumed Ténéré Batch Pilot, then measured 10/25-target scale-up. Do not attempt 100 targets before checkpoint/review bottlenecks are measured.
- Resolve the VFR800 research-versus-production `61MCW07` source-identity history in a dedicated non-production reconciliation task; do not use the mirror-only prospect for immediate acquisition.
- Build controlled evidence-to-production promotion packets.
- Improve source acquisition for blocked service manuals and OEM parts.
- Add document content hashing where local copies are legally available.
- Add richer field-level conflict explanations and applicability review.
- Run Human Review Decisions for the 44 newly queued Ducati Rider Service Core candidates; keep cooling capacity blocked until complete-circuit scope is proven and keep all production promotion separately authorized.
- Evaluate a genuinely separate authoritative Ducati publication for technical cross-checks where useful; the owner-manual identity mirror remains document verification only.

## Future manufacturers

KTM, Aprilia, Moto Guzzi, Harley-Davidson, Indian and Royal Enfield are present in the catalogue; systematic service research remains deferred until the batch pipeline is proven across Honda/Yamaha fixtures.
