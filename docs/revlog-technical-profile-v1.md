# RevLog Technical Profile v1

Status: accepted foundation contract
Schema identifier: `revlog-technical-profile/v1`

## 1. Purpose and scope

RevLog Technical Profile v1 is the canonical, model-independent format for motorcycle technical data. Profiles are plain JavaScript data objects. They do not contain UI, DOM access, lookup methods, formatters, resolvers, or Supabase logic.

The format is designed for hundreds of motorcycle models and thousands of variants while keeping each individual profile independently loadable and validatable. Only the active profile needs to be loaded by the future UI.

This document defines the data contract. Applicability resolution, search, UI, profile loading, and migration of existing Honda and Yamaha data are separate implementation stages.

## 2. Source-of-truth rule

Technical data MUST NOT receive `verified` status merely because it previously existed in RevLog. Existing RevLog code and data are not OEM sources.

`verified` means that the value has been checked against an accepted source and the relevant citation is attached to the record.

Source authority, in descending order, is:

1. OEM Service Manual
2. OEM Owner's Manual
3. OEM Parts Catalogue
4. OEM Supplement or Technical Bulletin
5. another verified source

A lower-ranked source must never be presented as an OEM source. Aftermarket catalogues may support an aftermarket replacement record, but cannot establish an OEM part number or OEM technical value.

The runtime authority ranks are defined centrally in `technical-profile-sources.js`:

```text
1  oem-service-manual
2  oem-owners-manual
3  oem-parts-catalogue
4  oem-supplement / oem-technical-bulletin / oem-wiring-diagram
5  verified-secondary
6  aftermarket-catalogue
```

Lower rank numbers mean stronger authority. Authority rank is metadata for review and presentation; it MUST NOT automatically resolve conflicting values. When accepted sources disagree, the entry or variant should use `conflicting-sources` until a human resolves and documents the conflict.

## 3. Top-level profile contract

```js
{
  schemaVersion: "revlog-technical-profile/v1",

  profile: {
    id: "manufacturer.family.generation.profile-scope",
    revision: 1,
    status: "draft",
    language: "pl"
  },

  motorcycle: {
    brand: "Example",
    model: "Example 1000",
    applicability: {
      catalogVariantKeys: ["example.example-1000.gen1"],
      years: { from: 2000, to: 2004 }
    }
  },

  categories: [],
  documents: {},
  citations: {},
  entries: []
}
```

Required top-level properties are `schemaVersion`, `profile`, `motorcycle`, `categories`, `documents`, `citations`, and `entries`.

### `schemaVersion`

MUST equal exactly:

```text
revlog-technical-profile/v1
```

Schema changes incompatible with v1 require a new schema identifier. Corrections to the data of one profile increase `profile.revision`, not `schemaVersion`.

### `profile.id`

A globally stable, lowercase identifier using ASCII letters, digits, dots, and hyphens. It identifies the logical profile and MUST NOT change when labels, sources, or values are corrected.

Recommended pattern:

```text
manufacturer.family.generation.scope
```

### `profile.revision`

A positive integer. It is increased whenever published profile data changes. It is not a timestamp and MUST NOT be a numeric string.

### `profile.status`

Profile publication status is separate from entry verification status. Allowed profile statuses are:

- `draft` — incomplete work not intended as a complete public profile;
- `review` — prepared for technical review;
- `published` — accepted for normal use;
- `deprecated` — retained for compatibility but replaced by another profile.

## 4. Motorcycle identity and applicability

The canonical link to the motorcycle catalogue is `motorcycle.applicability.catalogVariantKeys`.

```js
motorcycle: {
  brand: "Honda",
  model: "VFR800 VTEC",
  applicability: {
    catalogVariantKeys: ["honda.vfr800.rc46.vtec.gen1"],
    years: { from: 2002, to: 2002 },
    regions: ["EU", "USA", "UK", "AU"],
    abs: null,
    equipment: []
  }
}
```

Rules:

- `catalogVariantKeys` MUST be a non-empty array of stable catalogue keys.
- `years.from` and `years.to` are inclusive integers and `from <= to`.
- `regions`, `abs`, and `equipment` are optional v1 condition fields. Their resolution is intentionally not implemented in the foundation stage.
- `abs: null` means unknown or not constrained. It is not equivalent to `false`.
- Text matching by brand and model is a legacy compatibility mechanism, not the canonical v1 identity.

Applicability may also be attached to an entry or variant. All specified condition fields are combined with logical AND. Values inside an array are alternatives combined with logical OR.

## 5. Categories

Categories define navigation and grouping, not ownership of entry data.

```js
{
  id: "lubrication",
  label: "Olej i filtry",
  icon: "🛢️",
  order: 20,
  aliases: ["olej", "smarowanie"]
}
```

Required fields:

- `id` — stable and unique inside the profile;
- `label` — user-facing name.

Optional fields include `icon`, `order`, `description`, and `aliases`. Category IDs MUST NOT depend on display language.

## 6. Entries

Every technical fact is an entry with a stable identity.

```js
{
  id: "torque.engine.oil-drain-bolt",
  type: "torque",
  categoryId: "torques",
  label: "Korek spustowy oleju",
  value: { type: "quantity", amount: 29, unit: "N·m" },
  status: "verified",
  sourceIds: ["cite.example.service-manual.oil-drain"],
  tags: ["olej", "moment"],
  aliases: ["śruba spustowa"],
  relatedEntryIds: []
}
```

Required common fields:

- `id` — globally stable within the profile;
- `type` — one of the registered record types;
- `categoryId` — ID of an existing category;
- `label` — user-facing label;
- `status` — verification status;
- `sourceIds` — array of citation IDs, empty only when the status allows unverified data.

Recommended common fields are `tags`, `aliases`, `description`, `notes`, `relatedEntryIds`, `applicability`, and `variants`.

### Stable entry IDs

IDs use lowercase ASCII letters, digits, dots, and hyphens. They describe meaning rather than presentation:

```text
lubrication.engine-oil.capacity-with-filter
torque.engine.oil-drain-bolt
lighting.headlight.low-beam
```

Changing a Polish label MUST NOT change the ID. An ID MUST NOT be reused for a different technical meaning.

### Entry types

The v1 foundation registers these types:

- `specification` — a general technical parameter;
- `torque` — a tightening torque with component and context;
- `fluid` — fluid specification, grade, capacity, or service value;
- `spark-plug` — spark plug manufacturer/model, gap, alternatives, and installation data;
- `light-source` — bulb or lamp application, base, voltage, power, quantity, and optional OEM number;
- `fuse` — amperage, circuit/function, and location;
- `maintenance-task` — distance/time interval, action, conditions, and related technical records;
- `consumable-part` — OEM part identity, specification, and explicitly classified replacements;
- `diagnostic-measurement` — component, measurement, expected range, conditions, procedure reference, and possible next test.

Two additional types are included because they are necessary for the requested domain without misusing `specification`:

- `adjustment` — manufacturer-defined free play, clearance, level, or setting;
- `fault-code` — diagnostic code, meaning, conditions, and related diagnostic measurements.

Record types may define additional fields, but all numeric physical values MUST use the value formats and canonical units in this standard.

## 7. Verification statuses

Allowed entry and variant statuses:

- `verified` — checked against accepted source citations;
- `pending-verification` — structured data awaiting source verification;
- `legacy-unverified` — migrated from old RevLog data and not independently verified;
- `conflicting-sources` — accepted sources disagree and the conflict is unresolved;
- `deprecated` — retained for traceability but no longer current.

Rules:

- `verified` MUST have at least one non-empty `sourceId`.
- Existing RevLog values begin as `legacy-unverified`, never automatically as `verified`.
- A fixture may use `verified` only with an explicitly fictional fixture citation and MUST never be registered in production UI.
- Status describes confidence/provenance, not whether a field is applicable.

## 8. Tags and aliases

`tags` are canonical search concepts and grouping terms:

```js
tags: ["olej", "filtr oleju", "pojemność"]
```

`aliases` are alternate user expressions, abbreviations, translations, or common names:

```js
aliases: ["ile oleju", "oil capacity", "olej z filtrem"]
```

Both are arrays of non-empty strings. They MUST NOT contain hidden applicability logic or source information.

## 9. Relationships

`relatedEntryIds` contains IDs of other entries in the same resolved profile:

```js
relatedEntryIds: [
  "torque.engine.oil-drain-bolt",
  "consumables.oil-filter"
]
```

All referenced IDs MUST exist. Relationships do not copy values and do not imply applicability. Type-specific relationship fields, such as `installationTorqueEntryId` or `nextDiagnosticEntryId`, may be added later and should follow the same integrity rule.

## 10. Documents, citations, and source IDs

Documents are defined once in the `documents` map:

```js
documents: {
  "doc.example.service-manual": {
    id: "doc.example.service-manual",
    type: "oem-service-manual",
    title: "Example Service Manual",
    manufacturer: "Example",
    publicationId: "EX-001",
    regions: ["ALL"],
    url: null
  }
}
```

Allowed document types initially are:

- `oem-service-manual`
- `oem-owners-manual`
- `oem-parts-catalogue`
- `oem-supplement`
- `oem-technical-bulletin`
- `oem-wiring-diagram`
- `verified-secondary`
- `aftermarket-catalogue`

Citations identify the relevant location within a document:

```js
citations: {
  "cite.example.service-manual.oil": {
    id: "cite.example.service-manual.oil",
    documentId: "doc.example.service-manual",
    section: "Lubrication",
    chapter: "Engine oil",
    pages: ["4-3", "4-4"],
    notes: null
  }
}
```

Entries refer to citations through `sourceIds`. Full URLs and document titles MUST NOT be copied into every entry. Runtime document opening and full source validation are later stages; the v1 contract reserves and defines the structure now.

## 11. Values and numbers

Numbers in profile data MUST be JavaScript `Number` values. Locale-formatted strings are forbidden:

```js
// Correct
{ amount: 3.1, unit: "L" }

// Incorrect
{ amount: "3,1", unit: "L" }
```

Formatting `3.1` as `3,1` belongs to the formatter/UI.

Canonical value forms are:

```js
{ type: "quantity", amount: 29, unit: "N·m" }

{ type: "range", min: 80, max: 84, unit: "°C" }

{
  type: "quantity-with-tolerance",
  nominal: 0.2,
  tolerance: 0.03,
  unit: "mm"
}

{ type: "ratio", numerator: 45, denominator: 17 }

{ type: "text", text: "Mokre, wielotarczowe" }

{
  type: "multi",
  values: [
    { type: "quantity", amount: 250, unit: "kPa" },
    { type: "quantity", amount: 2.5, unit: "bar" }
  ]
}
```

Rules:

- all numeric members MUST be finite `Number` values;
- a range MUST satisfy `min <= max`;
- tolerance MUST be non-negative;
- a ratio denominator MUST not be zero;
- every unit MUST be from the central canonical unit registry;
- descriptive text may supplement a structured value but MUST NOT replace a number required for computation.

## 12. Canonical units

The source of truth for accepted unit codes is `js/technical/technical-profile-units.js`.

Initial canonical units are:

```text
N·m, mm, cm, m, km, cm³, L, mL, kg, g,
V, A, W, kW, Ah, CCA, Hz, Ω, kΩ,
kPa, bar, psi, °C, rpm, km/h, hp, PS,
month, year, link, tooth, percent, count
```

Notes:

- engine torque also uses `N·m`; `Nm` is not canonical;
- `L` is canonical, not lowercase `l`;
- `cm³` is used for displacement;
- `hp` and `PS` remain distinct because they are not identical units;
- `CCA` is retained as the conventional battery rating label;
- dimensionless ratios use the `ratio` value type and no unit;
- revolutions per minute use `rpm`;
- localized labels may be shown by a formatter, but stored codes remain canonical.

## 13. Variants and conditions

An entry may define local variants instead of duplicating the profile:

```js
variants: [
  {
    id: "lighting.headlight.low-beam.eu",
    when: {
      regions: ["EU", "UK"],
      years: { from: 2002, to: 2002 }
    },
    patch: {
      value: {
        type: "quantity",
        amount: 55,
        unit: "W"
      }
    },
    status: "verified",
    sourceIds: ["cite.example.eu-owner-manual.headlight"]
  }
]
```

Each variant requires a unique stable `id`, a `when` condition, and a limited `patch`. Variants MAY have their own status and sources. They MUST NOT contain arbitrary executable predicates.

Recognized condition fields reserved by v1 are:

- `catalogVariantKeys`
- `years`
- `regions`
- `abs`
- `equipment`
- `marketCodes`

The resolver implements deterministic specificity, missing-context reporting, conflict detection, and restricted object merging. Search and UI integration remain deferred.

The resolution layer returns explicit states rather than guessing:

- profile: `profile-applicable`, `profile-not-applicable`, or `ambiguous-context`;
- entry: `resolved`, `not-applicable`, `ambiguous-context`, or `ambiguous`;
- missing region, ABS, year, equipment, or catalogue identity is never treated as a default value;
- the most specific matching variant wins;
- equally specific variants with different patches produce `ambiguous`;
- resolution includes a developer trace and never mutates profile data.

## 14. Maintenance and diagnostics readiness

Maintenance entries should represent distance and time separately:

```js
interval: {
  distance: { amount: 12000, unit: "km" },
  time: { amount: 12, unit: "month" },
  rule: "whichever-comes-first"
}
```

Diagnostic measurements should keep symptom, component, measurement conditions, expected result, procedure reference, and next-test relationships separate. v1 does not implement the diagnostic flow, but profiles MUST avoid flattening all of these into one display string.

## 15. Authoring and Import Pipeline

Adding a newly released motorcycle should eventually be a data operation, not a change to RevLog application logic. The target pipeline is:

1. **Motorcycle catalogue** — add or confirm the stable `catalogVariantKey`, identity, variant, and year coverage.
2. **Technical Profile** — author a pure-data v1 profile with stable category and entry IDs.
3. **Documents and sources** — register documents once, add precise citations, and attach `sourceIds` to verified values.
4. **Validation** — run the DOM-independent validator, applicability checks, relationship checks, and canonical-unit validation.
5. **Quality report** — produce coverage, verification, missing-source, conflict, and warning statistics without silently changing data.
6. **Manifest/import** — a future `import-technical-profile` tool validates and places the profile in the repository; a future manifest exposes it to loading infrastructure.
7. **Ready** — only validated, reviewed profiles are eligible for production registration.

The future `validate-all-profiles` command should discover profile files, load them one at a time, validate them with the same public modules used by tests, and produce a deterministic CI report. The future importer MUST consume the documented v1 object without requiring a schema change. Neither tool is implemented in this stage.

## 16. Resolved search index

Search operates on the result of profile and entry resolution, never directly on raw `variants`. A search index is built once for a concrete motorcycle context and reused for many queries. Entries with `ambiguous`, `ambiguous-context`, or `not-applicable` resolution MUST NOT expose an unresolved technical value as certain. The index may retain safe metadata and the resolution state so a client can request missing context or explain a conflict.

The search index is a derived cache, not a source of technical truth. It may contain normalized labels, aliases, tags, identifiers, part numbers, structured values, and selected descriptive fields. Document URLs and other source metadata MUST NOT be included as ordinary searchable content. Results retain the entry status, resolution status, citation IDs, selected variant ID, and category identity. Ranking is deterministic and exposes its score and matched fields for diagnosis; it MUST NOT convert source authority into a confidence percentage.

Synonyms are maintained in a separate language-oriented registry. They assist query expansion but are not part of the motorcycle's technical data and cannot change a resolved value.

## 17. Offline-first runtime

Technical Profiles, a resolved search index, and the basic identity/context of the active motorcycle MUST be representable as locally storable data. Internet access may extend RevLog, but it must not be required for basic access to already available technical information. Profile resolution, value formatting, index construction, and searching therefore remain deterministic, DOM-independent, and free of network API dependencies. Persistence, cache invalidation, synchronization, IndexedDB, and Service Worker behavior are outside v1's current runtime scope.

## 18. Reference Production Profile

Honda VFR800 VTEC model year 2002 is the first Reference Production Profile. It is used to verify that the shared v1 schema remains practical for real workshop, roadside, maintenance, regional, ABS, citation, resolution, and search use cases. It does not receive a motorcycle-specific schema or custom runtime logic: the profile is local data governed by the same contract intended for every future motorcycle.

For a Reference Production Profile:

- `verified` means the exact value was checked against the attached accepted citation; prior RevLog data is not evidence;
- missing, unclear, or inaccessible source material cannot produce a `verified` record;
- differences by region, ABS state, year, or equipment must be explicit applicability or variants, never hidden defaults;
- source conflicts remain visible and are not settled automatically by authority rank;
- future motorcycles must use this same schema and generic validator, resolver, formatter, search, and quality-report modules.

Reference status describes the profile's architectural role, not perfection or completeness. Its factual coverage and known gaps are reported as counts, without a synthetic confidence score.

## 19. Technical Profile Registry & Loader

Technical Profile discovery is data-driven. A central registry contains only stable profile identity, catalogue keys, year coverage, module identity, schema version, and lifecycle status. It MUST NOT duplicate entries, values, citations, or documents from a profile. Matching requires `catalogVariantKey` and `year`, prefers the narrowest matching year scope, and reports `not-found`, `insufficient-context`, or `ambiguous` rather than selecting an arbitrary descriptor.

The loader accepts a descriptor and resolves its local module through an adapter boundary. Its public API is asynchronous even though the current Node adapter loads CommonJS files locally. This permits a future dynamic-import or offline-cache adapter without changing consumers. Normal discovery failure never attempts a module load. Loaded profiles are passed through the existing validator and remain immutable. Network fetching, lazy loading, IndexedDB, and Service Worker caching remain outside this stage.

Responsibility flows through these layers:

1. **Motorcycle Catalog** identifies the user's motorcycle and its stable `catalogVariantKey`.
2. **Technical Profile Registry** discovers metadata for an available profile.
3. **Profile Loader** supplies the local profile data object.
4. **Validator** checks the shared data contract and references.
5. **Resolver** evaluates profile applicability and entry variants against explicit context.
6. **Formatter** renders canonical values without changing source data.
7. **Search** indexes and queries resolved entries.
8. **Quality Report** reports factual coverage and unresolved references.
9. **UI** consumes these layers; it does not define profile identity, matching, loading, or technical values.

Registry integrity requires unique profile IDs, stable catalogue keys, valid year ranges, resolvable module IDs, matching loaded profile identity, descriptor/profile applicability agreement, and no equally specific overlapping descriptors. Multiple profiles may cover one catalogue key when matching remains deterministic, for example when a single-year descriptor is more specific than a broader range.

## 20. Motorcycle Technical Context

The Motorcycle Technical Context Adapter translates explicit fields from an application-level stored motorcycle into the context used by Technical Profile discovery and resolution:

```text
Stored Motorcycle
  → Motorcycle Technical Context Adapter
  → Technical Profile Registry
  → Profile Loader
  → Resolver / Search
  → UI
```

`catalogVariantKey` and `year` are discovery fields. Both are required before registry lookup. `region`, `abs`, and `equipment` are resolution fields: their absence does not prevent profile discovery, but may cause a specific entry to return `ambiguous-context`. Unknown values remain `null`; an explicit empty equipment array means that the stored record explicitly declares no equipment options.

The adapter only translates stored, explicit data. It does not infer a catalogue key from brand/model text, infer region from year or user locale, parse ABS from a model name, or treat a missing ABS flag as `false`. Legacy motorcycles without `catalogVariantKey` return `insufficient-context` and are not mutated or migrated. Storage access is outside the adapter: a future UI may pass `MotorcycleDatabase.getActive()` to the bridge, while tests and other consumers can pass any motorcycle object directly.

## 21. Validation policy

The validator returns a report and never mutates or silently repairs a profile:

```js
{
  valid: false,
  errors: [
    {
      code: "UNKNOWN_UNIT",
      path: "entries[12].value.unit",
      message: "Unknown canonical unit: Nm"
    }
  ],
  warnings: []
}
```

Errors make the profile invalid. Warnings identify incomplete but structurally usable data. CI may apply a stricter publication policy later, but validator output remains deterministic and independent of the DOM.
