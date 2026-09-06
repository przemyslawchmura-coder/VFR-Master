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
- Build and validate an authorized complete Supabase baseline migration and
  document the remaining dashboard-managed Auth/project configuration so an
  empty project can be reconstructed reproducibly. The current audit remains
  documentation-only and does not prove the live schema.
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
- **Research Factory throughput optimization / OEM-direct fast path** — explicitly
  deferred until the current Technical Research Factory scope is formally closed
  out. Verify the authoritative OEM publication and exact applicability first;
  an authenticated publication may eventually support straight-through handling
  of a directly stated, losslessly representable value without mandatory
  redundant second-source confirmation. Applicability must be explicit for
  manufacturer/model, year, market, ABS, transmission and equipment wherever
  material; unknown context remains unknown and conditional records route only
  the affected value to blocking or review. Preserve the zero-inference rule:
  no ABS/non-ABS, DCT/manual, regional, year, equipment, model or conditional-
  alternative inheritance is allowed. Future risk routing should distinguish
  **OEM DIRECT**, **OEM CONDITIONAL** and **SUPPORTING / EXTERNAL** material;
  these are design concepts only and are not current schema or runtime classes.
  Prefer document-centric authenticate-once, extract-once, applicability-map and
  project-many processing when one publication explicitly covers multiple
  motorcycles, years or variants, while retaining field/table/section scope.
  Human Review should be exception-driven for ambiguity, conflict, uncertain
  extraction, unit or semantic mapping issues, multiple conditional variants,
  safety-critical conflicts or lossless-representation failures. A safe record
  must not be blocked by an unrelated problematic record from the same
  publication. After Factory closeout, audit bottlenecks and run only a measured
  pilot of approximately 10 motorcycles, tracking authenticated/extracted
  publications, covered scopes, extracted/straight-through/review/blocked
  records, conflicts, practical Rider Service Core gain, review workload and
  effort per motorcycle before considering any scale-up. Governing rule: **one
  authoritative OEM source may be sufficient; clear applicability is mandatory;
  ambiguity and conflict require review; missing information remains missing;
  no inference is introduced for throughput.**
- Resolve the VFR800 research-versus-production `61MCW07` source-identity history in a dedicated non-production reconciliation task; do not use the mirror-only prospect for immediate acquisition.
- Build controlled evidence-to-production promotion packets.
- Improve source acquisition for blocked service manuals and OEM parts.
- Add document content hashing where local copies are legally available.
- Add richer field-level conflict explanations and applicability review.
- Clarify the five Ducati Rider Service Core candidates left `NEEDS-MORE-REVIEW` (payload/GVWR, main-fuse rating, DRL applicability, LED replaceability and initial-service semantics); keep cooling capacity blocked until complete-circuit scope is proven and keep all production promotion separately authorized.
- Evaluate richer typed materialization for repeating Rider Service Core records if future evidence/promotion requires it; current aligned processing preserves raw source/context and association semantics without normalization.
- Evaluate a genuinely separate authoritative Ducati publication for technical cross-checks where useful; the owner-manual identity mirror remains document verification only.
- Define field-level production mappings for the now-representable Rider Service Core records before promotion; keep maintenance and lighting semantics explicit and do not flatten structured records. The shared processing context now retains fuse rating/function/location associations.

## Future manufacturers

KTM, Aprilia, Moto Guzzi, Harley-Davidson, Indian and Royal Enfield are present in the catalogue; systematic service research remains deferred until the batch pipeline is proven across Honda/Yamaha fixtures.
