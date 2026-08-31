# Yamaha transfer acquisition batch — executed result

Date: 2026-08-31<br>
Classification: **ACCEPT-WITH-RISKS**<br>
Boundary: **NON-PRODUCTION RESEARCH**

## Outcome

The fixed two-target Yamaha batch exceeded its +24 verified/+22 practical gates using one authenticated Tier A owner manual per target. Combined Service Core coverage moved 0/88 → 58/88: +58 verified slots, +54 practical-service and +4 generic tire-size slots. Both manuals yielded 29 slots, including 27 practical slots. There were zero conflicts, no Tier C/D contribution and no source-budget overrun.

This supports transferability of the service-rich official-owner-manual method from Honda to Yamaha for these exact editions. It does not establish coverage for MT-09 MY2022–2023, Ténéré 700 MY2020–2024, MT-09 SP, named Ténéré editions, or Yamaha generally.

## Sources and identity

| Target | Document | Edition | Authority | Scope | PDF pages | SHA-256 |
|---|---|---|---|---|---:|---|
| `yamaha.mt-09.gen3` | MTN890 (MT-09) Owner's Manual, `B7N-28199-E0` | 1st, August 2020 | Yamaha Motor Co., Ltd.; official Yamaha Europe CDN | MY2021 EU, manual, ABS-equipped standard MT-09; SP excluded | 108 | `44d573bd16e757ec587c14a19a33c1f4de945dc8e9b928df4844d332a67a2ce1` |
| `yamaha.tenere-700.gen1` | XTZ690 / XTZ690-U Owner's Manual, `BW3-F8199-E0` | 1st, July 2019 | MBK Industrie / Yamaha Motor Europe; official Yamaha Europe CDN | MY2019 EU, manual, ABS-equipped standard XTZ690/XTZ690-U; named editions excluded | 102 | `734700f970986ec394bcfb04242a668bbd10437b1b534cdf62a397238409b649` |

Each internal title/publication page matched the registered official URL. The two URLs identify different underlying publications; no mirror or duplicate location was counted. Both are English Tier A owner manuals with maintenance, adjustment and specification chapters.

## Reproducible metrics

- Targets: 2.
- Documents inspected / unique / yielding: 2 / 2 / 2.
- Hosting locations / duplicates: 2 / 0.
- Tier distribution: A=2, B=0, C=0, D=0.
- Evidence rows: 58; rows per yielding document: 29.
- Verified slots: 0 → 58; net +58.
- Practical gain: +54; generic gain: +4.
- Conflicts: 0.
- Unresolved applicability cases: 2 (later years in both catalogue generations remain outside the selected editions).
- Primary budget: 2/4 overall, 1/2 per target; not exceeded.
- Researched-no-evidence targets: 0. Ten explicit practical gaps per target were inspected but not directly evidenced.

## Per-target result

| Target | Before | After | Gain | Practical | Generic | Primary documents | Conflicts |
|---|---:|---:|---:|---:|---:|---:|---:|
| `yamaha.mt-09.gen3` MY2021 EU standard | 0/44 | 29/44 | +29 | +27 | +2 | 1 | 0 |
| `yamaha.tenere-700.gen1` MY2019 EU standard | 0/44 | 29/44 | +29 | +27 | +2 | 1 | 0 |

The highest-value gains were oil grade/viscosity/API-JASO and drain/filter quantities; coolant type and capacities; spark plug and gap; 40,000 km valve inspection; periodic mileage/time schedules; chain slack plus 1,000 km/wet-use inspection and lubrication; DOT 4 and two-year replacement; cold solo/loaded pressures; battery and main fuse; and oil-filter, drain-bolt, spark-plug and rear-axle torques. The four generic slots are the front/rear tire sizes; they are useful but do not contribute to practical-threshold success.

## Applicability handling

- All rows are restricted to the single manual edition year, EU market, manual transmission, ABS `true`, and a named standard-equipment scope.
- MTN890 rows do not apply to MT-09 SP. No SP table or value was used.
- XTZ690/XTZ690-U rows do not apply to World Raid, Rally, Extreme, Explore or another named edition.
- Ténéré road solo and two-person pressures remain 220/250 kPa cold. The separately documented 200/200 kPa off-road condition is retained as an excluded condition and is not collapsed into road coverage.
- Chain slack preserves the manual's unloaded/on-sidestand measurement condition. MT-09 is 36–41 mm; Ténéré is 43–48 mm.
- Later catalogue-generation years remain unresolved and receive no evidence.

## Remaining practical gaps and researched-no-evidence

For each target the authenticated owner manual did not directly establish a Service Core value for oil-filter identity, coolant replacement interval, alternative spark plug, spark-plug replacement interval, intake/exhaust valve clearances, valve measurement conditions, chain specification, OEM brake-pad numbers, or front-axle torque. These remain explicit researched-no-evidence outcomes rather than inferred values. A second primary source was not justified: the first document already exceeded the practical gate, and the remaining fields mainly require a workshop manual or parts publication rather than continued unbounded hunting.

## Independent audit

Audit classification: **ACCEPT-WITH-RISKS**.

Falsification checks found:

1. Both identities are authenticated by official Yamaha Europe hosting, internal model title, publication code and edition page; content hashes make the acquired copies reproducible.
2. Both are Tier A official owner manuals, not brochures or mirrors.
3. Evidence is limited to MY2021 MTN890 and MY2019 XTZ690/XTZ690-U; later years are not inferred.
4. MT-09 SP and named Ténéré variants are excluded explicitly.
5. ABS is recorded as `true`, transmission as `manual`, and equipment scopes are non-null.
6. Road, two-person and off-road tire-pressure semantics remain distinct.
7. Document identity deduplication yields two documents at two locations; no count inflation occurred.
8. Both starting coverages recompute to zero in the generic Service Core pipeline; older unverified Yamaha candidates do not inflate gain.
9. Conflict detection returns zero. No values were averaged or silently selected.
10. Practical gain is 54/58 slots. The four generic tire sizes are reported separately.
11. Tier C/D practical contribution is zero.
12. Only two of four allowed primary documents were used.
13. Production registry, profiles, runtime/browser, catalogue, Supabase and VFR800 are unchanged.

Contrary evidence limits the success interpretation: both successful documents were preselected because repository candidates already showed rich content; both targets are Yamaha; and each result covers one edition rather than a full generation. Thus the method transfers beyond Honda for these cases, but broad manufacturer scaling remains unproven.

## Exact next task

Design, without acquiring evidence, a bounded post-Yamaha transfer batch using the measured Honda/Yamaha document yield, edition-scope risks and unknown-source eligibility rule; decide whether one additional manufacturer has enough repository-known Tier A/B source prospect to justify execution.
