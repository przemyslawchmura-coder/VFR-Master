# RevLog Rider Service Core and Source Trust Model

Status: permanent project architecture and governance. This document defines
priority and coverage; it does not add motorcycle data.

## Owner-first priority

The Technical Database primarily serves the motorcycle owner. Research
prioritizes practical service usefulness over encyclopedic specification count.
Length, width, bore/stroke, rake/trail and similar secondary chassis facts may
remain useful, but are not Rider Service Core acquisition priorities.

## Rider Service Core taxonomy

The canonical Core domains and practical field families are:

- **Basic motorcycle data:** displacement; reliably documented power;
  wet/kerb mass; fuel-tank capacity; useful seat height.
- **Engine oil / filter:** specification; viscosity; quantity after drain;
  quantity with filter change; overhaul quantity when available; OEM/reference
  filter; drain-plug and applicable filter torque; replacement interval.
- **Cooling:** coolant specification; service quantity; replacement interval;
  practical bleed/fill information only when safely representable.
- **Spark plugs / ignition:** plug model; gap; inspection/replacement
  interval; tightening torque.
- **Valves:** intake and exhaust clearance; measurement conditions; inspection
  interval; model-specific valve-system notes when required.
- **Wheels / tires:** front/rear sizes; rim sizes; front/rear pressures;
  separate passenger/load pressures; practical wheel/axle torques; tire
  applicability conditions.
- **Final drive:** chain type/size; slack; sprocket specification when
  reliable; inspection/lubrication/adjustment guidance; rear-axle/adjuster
  torques.
- **Brakes:** fluid specification and interval; pad references; useful
  disc/pad limits; practical caliper/related torques.
- **Electrical / battery:** battery type/model; voltage; capacity; useful,
  documented charging specification.
- **Fuses:** for each documented fuse, amperage, protected function/circuit
  and location where documented; bare amperage lists are lower value.
- **Lighting:** owner-replaceable function, bulb/type/socket, voltage and
  wattage; explicitly represent non-replaceable LED modules.
- **Periodic maintenance:** mileage and time intervals; inspect/replace/
  adjust distinctions; exact model-year applicability for future Garage/Service
  integration.
- **Consumables:** practical owner-purchased filters, plugs, pads,
  chain/sprockets, seals/washers and other documented service consumables;
  OEM numbers and equivalents only when supported.
- **Practical torques:** drain plug, oil filter, spark plugs, axles, calipers,
  chain/rear axle and other common service-access fasteners; engine-internal
  rebuild tables are not priorities.

The shared Technical Profile taxonomy may remain broader. Rider Service Core is
a priority/coverage layer, not a destructive rewrite and not a reason to remove
useful secondary VFR or Ducati data.

Coverage reports must show Core fields supported, missing, blocked by
applicability, blocked by conflict and secondary/non-Core fields. The
closed presentation matrix is `js/technical/technical-profile-core-matrix.js`:
14 domains and 95
stable field IDs with deterministic domain and field ordering. Every motorcycle
uses that same denominator and field sequence. A verified value fills a cell;
otherwise the presentation is exactly `Brak danych`, except for an explicitly
evidenced not-applicable state. Additional canonical profile data never expands
the default Core rows, and research targets missing cells rather than adding
profile-specific fields.

## Source trust and verification

Prefer an official owner manual, workshop/service manual, official service-data
publication or other manufacturer publication whose exact identity and
applicability are established. Once verified, explicitly stated values are
authoritative within that documented scope; arbitrary multiple independent
sources are not required for every value.

Document-identity verification may use an independently hosted copy of the
same publication to confirm publication identity, model/year applicability,
document number/revision or deterministic completeness/integrity. A same-
publication mirror is not an independent technical claim.

A technical cross-check is separate: where available, another authoritative
manufacturer publication, an owner manual versus service manual, or an
appropriate official parts fiche may independently support a technical value.
Its absence does not by itself disqualify an applicable primary manual, unless
the existing conflict or safety rules require it.

The zero-inference rule remains absolute: do not guess, inherit from a platform
or similar model, expand year/market/ABS/transmission/equipment applicability,
or promote unresolved conflicts. Missing data remains missing.

## Future source presentation

Profiles should eventually expose a user-facing **Instrukcja źródłowa** for a
principal publication when a stable lawful URL exists: title, document type,
model/year applicability, publication number when known, primary link and an
optional alternate verification link. The UI should not make internal source
IDs the primary experience. RevLog must link to the lawful source rather than
download or copy copyrighted manuals; where no stable URL is guaranteed,
internal provenance remains valid without fabricating a link.

## Reusable workflow

Identify motorcycle identity → acquire the best applicable primary manual →
verify document identity and applicability → extract Rider Service Core first →
cross-check where available/required → preserve conflicts and applicability →
human/promotion review → production Technical Profile → expose the principal
source link → later integrate maintenance intervals with Garage/Service state.

This workflow is manufacturer-neutral and applies equally to Honda, Ducati,
Yamaha, Suzuki, Kawasaki, BMW and future manufacturers.
