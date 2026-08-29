# Motorcycle research catalogue coverage

> **NON-PRODUCTION RESEARCH DATA — partial seed catalogue, not a complete motorcycle database.**

Snapshot: 2026-08-29.

- Manufacturers: 11
- Model families: 16
- Generation/variant records: 18
- Year coverage with known lower bound: 2002–2026; open-ended records are explicitly nullable
- Records with a model/chassis code: 5
- Records with a proposed catalogVariantKey: 18

| Manufacturer | Records |
|---|---:|
| Aprilia | 2 |
| BMW | 1 |
| Ducati | 2 |
| Harley-Davidson | 1 |
| Honda | 2 |
| Kawasaki | 2 |
| KTM | 1 |
| Moto Guzzi | 2 |
| Suzuki | 2 |
| Triumph | 1 |
| Yamaha | 2 |

Known gaps and ambiguity include regional model codes, exact generation cutovers, market-specific ABS packaging and currently open-ended production years. Labels such as `current research boundary` are deliberately not claims of an official generation name.

Stable-key proposal: lowercase dot-separated `manufacturer.family.platform-or-code.generation`; display names and year remain separate. A missing official platform/code may use a reviewed generation token, never an invented chassis code. Existing `honda.vfr800.rc46.vtec.gen1` remains unchanged.
