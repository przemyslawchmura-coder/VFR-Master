(function attachVfr800Documents(root, factory) {
"use strict";

// Production source registry for the 2002 Honda VFR800/VFR800A reference
// profile. URLs may point to an archive or mirror; Honda remains the document
// manufacturer. Page labels are the printed document pages where known.
const documents = {
  "doc.honda.vfr800-2002.service-manual": {
    id: "doc.honda.vfr800-2002.service-manual",
    type: "oem-service-manual",
    title: "Honda VFR800/VFR800A 2002 Service Manual",
    manufacturer: "Honda Motor Co., Ltd.",
    publicationId: "61MCW07",
    edition: null,
    revision: null,
    language: "en",
    regions: ["ALL"],
    years: { from: 2002, to: 2002 },
    url: "https://www.manualslib.com/manual/3139216/Honda-Interceptor-2002.html",
    notes: "Honda OEM workshop document. URL is a third-party mirror, not an official Honda host; the mirrored manual identifies VFR800 2002 and VFR800A 2002 as covered models."
  },
  "doc.honda.vfr800-2002.owners-manual": {
    id: "doc.honda.vfr800-2002.owners-manual",
    type: "oem-owners-manual",
    title: "2002 VFR800/A Owner Manual",
    manufacturer: "Honda Motor Co., Ltd.",
    publicationId: "31MCW600",
    edition: null,
    revision: null,
    language: "en",
    regions: ["USA"],
    years: { from: 2002, to: 2002 },
    url: "https://www.helminc.com/helm/product2.asp?Sku=31MCW600&class_2=AHC&itemtype=N",
    notes: "Factory-issued US owner guide identified by Honda publications distributor Helm. The public product page identifies the 2002 Interceptor 800 coverage; it is metadata/order access, not a freely hosted manual."
  },
  "doc.honda.vfr800-2002-2005.service-data-card": {
    id: "doc.honda.vfr800-2002-2005.service-data-card",
    type: "oem-supplement",
    title: "VFR800 (VTEC) RC46 2002–2005 huoltotietoa",
    manufacturer: "Honda",
    publicationId: null,
    edition: null,
    revision: null,
    language: "fi",
    regions: ["EU"],
    years: { from: 2002, to: 2005 },
    url: "https://www.hondabikes.fi/content/download/7049/43710/file/VFR800F%202002-2005%20huoltokortti.pdf",
    notes: "One-page Honda Finland service data card for RC46 VTEC model years 2002–2005, hosted on an official Honda dealer/importer domain."
  },
  "doc.honda.vfr800-2002-2003.wiring-recall": {
    id: "doc.honda.vfr800-2002-2003.wiring-recall",
    type: "oem-technical-bulletin",
    title: "2002–2003 VFR800/VFR800A Modified Wiring Diagram",
    manufacturer: "American Honda Motor Co., Inc.",
    publicationId: "VFR800/A #4",
    edition: "November 2007",
    revision: null,
    language: "en",
    regions: ["USA"],
    years: { from: 2002, to: 2003 },
    url: "https://static.nhtsa.gov/odi/rcl/2007/RCRIT-07V359-6830.pdf",
    notes: "Honda campaign technical material archived by NHTSA. Contains model-specific modified wiring diagrams; NHTSA hosts the file but is not the document manufacturer."
  },
  "doc.honda.vfr800-2002-2005.parts-catalogue": {
    id: "doc.honda.vfr800-2002-2005.parts-catalogue",
    type: "oem-parts-catalogue",
    title: "VFR800/A Interceptor 2002–2005 Parts Catalog",
    manufacturer: "Honda Motor Co., Ltd.",
    publicationId: "14MCW2E1",
    edition: null,
    revision: null,
    language: "en",
    regions: ["USA"],
    years: { from: 2002, to: 2005 },
    url: "https://www.helminc.com/helm/product2.asp?Sku=31MCW600&class_2=AHC&itemtype=N",
    notes: "Honda publication identifier is listed as a related item on the Helm page. No public catalogue content was used for technical values in revision 1."
  },
  "doc.honda.vfr800-2002.jp-press-information": {
    id: "doc.honda.vfr800-2002.jp-press-information",
    type: "oem-supplement",
    title: "V4 VTEC VFR 2002.01 Press Information",
    manufacturer: "Honda Motor Co., Ltd.",
    publicationId: null,
    edition: "January 2002",
    revision: null,
    language: "ja",
    regions: ["JP"],
    years: { from: 2002, to: 2002 },
    url: "https://www.honda.co.jp/factbook/motor/VFR/200201/",
    notes: "Official Honda Japan launch technical publication for model BC-RC46; used only for claims explicitly scoped to the Japanese MY2002 model."
  }
};

const citations = {
  "cite.honda.vfr800-2002.sm.general-specs": { id: "cite.honda.vfr800-2002.sm.general-specs", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "General specifications", pages: ["1-4", "1-5"], notes: "Engine and drivetrain specifications." },
  "cite.honda.vfr800-2002.sm.lubrication-specs": { id: "cite.honda.vfr800-2002.sm.lubrication-specs", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Lubrication system specifications", pages: ["1-6"], notes: "Oil capacities, grade and viscosity." },
  "cite.honda.vfr800-2002.sm.engine-oil-service": { id: "cite.honda.vfr800-2002.sm.engine-oil-service", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Engine oil / oil filter", pages: ["3-14", "3-15", "3-16"], notes: "Drain bolt and oil filter replacement/installation torque." },
  "cite.honda.vfr800-2002.sm.cooling-specs": { id: "cite.honda.vfr800-2002.sm.cooling-specs", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Cooling system specifications", pages: ["1-6"], notes: "Cooling capacity, pressure, thermostat and coolant specification." },
  "cite.honda.vfr800-2002.sm.fuel-specs": { id: "cite.honda.vfr800-2002.sm.fuel-specs", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "PGM-FI specifications", pages: ["1-6"], notes: "Idle speed, throttle free play and fuel pressure." },
  "cite.honda.vfr800-2002.sm.spark-plug": { id: "cite.honda.vfr800-2002.sm.spark-plug", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Spark plug — inspection and installation", pages: ["3-8"], notes: "Specified plugs, 1.0 mm rejection gauge and installation torque." },
  "cite.honda.vfr800-2002.sm.valve-procedure": { id: "cite.honda.vfr800-2002.sm.valve-procedure", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Valve clearance", pages: ["3-9", "3-10", "3-11", "3-12", "3-13"], notes: "Measurement below 35 °C and separate VTEC valve-lifter procedure." },
  "cite.honda.vfr800-2002.sm.frame-torques": { id: "cite.honda.vfr800-2002.sm.frame-torques", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Frame torque values", pages: ["1-17"], notes: "Front/rear axle, wheel, brake-disc, sprocket and bearing-holder fasteners." },
  "cite.honda.vfr800-2002.sm.chassis-specs": { id: "cite.honda.vfr800-2002.sm.chassis-specs", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Front and rear wheel/suspension specifications", pages: ["1-9"], notes: "Wheel and tire specifications for the covered 2002 models." },
  "cite.honda.vfr800-2002.sm.chain-specification": { id: "cite.honda.vfr800-2002.sm.chain-specification", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "General specifications — drive chain", pages: ["1-5"], notes: "OEM drive-chain designation and link count for VFR800/VFR800A MY2002." },
  "cite.honda.vfr800-2002.sm.brake-pad-wear": { id: "cite.honda.vfr800-2002.sm.brake-pad-wear", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Brake pad wear", pages: ["3-26"], notes: "Front and rear pads are replaced when either pad is worn to its wear-limit groove." },
  "cite.honda.vfr800-2002.sm.fork-fluid": { id: "cite.honda.vfr800-2002.sm.fork-fluid", documentId: "doc.honda.vfr800-2002.service-manual", section: "14. Front Wheel/Suspension/Steering", subsection: "Fork assembly — fluid filling and level", pages: ["14-24", "14-25"], notes: "Specified Honda SS-8 fork fluid, per-leg fill quantity and oil level with the fork compressed and spring removed." },
  "cite.honda.vfr800-2002.sm.charging-diagnostics": { id: "cite.honda.vfr800-2002.sm.charging-diagnostics", documentId: "doc.honda.vfr800-2002.service-manual", section: "17. Battery/Charging System", subsection: "Charging voltage inspection / alternator charging coil", pages: ["17-6", "17-7"], notes: "Charging-voltage acceptance test at 5,000 rpm and stator phase-resistance/insulation checks." },
  "cite.honda.vfr800-2002.sm.brake-torques": { id: "cite.honda.vfr800-2002.sm.brake-torques", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Hydraulic brake torque values", pages: ["1-18"], notes: "Front and rear caliper fasteners." },
  "cite.honda.vfr800-2002.sm.brake-discs": { id: "cite.honda.vfr800-2002.sm.brake-discs", documentId: "doc.honda.vfr800-2002.service-manual", section: "15. Hydraulic Brake", subsection: "Brake disc inspection", pages: ["15-20"], notes: "Front and rear disc thickness service limits." },
  "cite.honda.vfr800-2002.sm.engine-torques": { id: "cite.honda.vfr800-2002.sm.engine-torques", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Engine torque values", pages: ["1-13"], notes: "Drive sprocket and cylinder-head-cover fasteners." },
  "cite.honda.vfr800-2002.sm.electrical-output": { id: "cite.honda.vfr800-2002.sm.electrical-output", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Electrical specifications", pages: ["1-14"], notes: "Battery and generator specification." },
  "cite.honda.vfr800-2002.sm.pgm-fi-fuse": { id: "cite.honda.vfr800-2002.sm.pgm-fi-fuse", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information / 2. Frame/Body Panels/Exhaust System", subsection: "Lights/meters/switches specifications / rear fender installation", pages: ["1-14", "2-20"], notes: "The OEM specification table assigns 20 A to the PGM-FI fuse; the rear-fender illustration identifies its separate case beside the battery." },
  "cite.honda.vfr800-2002.sm.lights": { id: "cite.honda.vfr800-2002.sm.lights", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information", subsection: "Lights/meters/switches specifications", pages: ["1-14"], notes: "Bulb ratings and destination-code differences." },
  "cite.honda.vfr800-2002.sm.maintenance-schedule": { id: "cite.honda.vfr800-2002.sm.maintenance-schedule", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Maintenance schedule", pages: ["3-4", "3-5"], notes: "OEM inspection/replacement schedule; distances remain in source units." },
  "cite.honda.vfr800-2002.sm.drive-chain": { id: "cite.honda.vfr800-2002.sm.drive-chain", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Drive chain", pages: ["3-19", "3-20", "3-21"], notes: "Slack inspection, adjustment, wear inspection and lubrication." },
  "cite.honda.vfr800-2002.sm.brake-fluid": { id: "cite.honda.vfr800-2002.sm.brake-fluid", documentId: "doc.honda.vfr800-2002.service-manual", section: "3. Maintenance", subsection: "Brake fluid", pages: ["3-25"], notes: "Specified brake fluid and level inspection." },
  "cite.honda.vfr800-2002.sm.clutch-system": { id: "cite.honda.vfr800-2002.sm.clutch-system", documentId: "doc.honda.vfr800-2002.service-manual", section: "1. General Information / 3. Maintenance", subsection: "General specifications / Clutch system and fluid inspection", pages: ["1-5", "3-29", "3-30"], notes: "Identifies hydraulic clutch operation and the inspection of clutch-fluid level, leakage, hoses and fittings; the OEM procedure specifies no periodic adjustment." },
  "cite.honda.vfr800-2002.card.service-data": { id: "cite.honda.vfr800-2002.card.service-data", documentId: "doc.honda.vfr800-2002-2005.service-data-card", section: "Huoltotietoa", subsection: "Service specifications", pages: ["1"], notes: "Spark plugs, tire pressures, idle, oil, filter and valve clearances for RC46 2002–2005." },
  "cite.honda.vfr800-2002.card.maintenance": { id: "cite.honda.vfr800-2002.card.maintenance", documentId: "doc.honda.vfr800-2002-2005.service-data-card", section: "Huoltotaulukko", subsection: "Maintenance schedule", pages: ["1"], notes: "Condensed Honda Finland schedule through 36,000 km." },
  "cite.honda.vfr800-2002.om.identity": { id: "cite.honda.vfr800-2002.om.identity", documentId: "doc.honda.vfr800-2002.owners-manual", section: "Publication metadata", subsection: "Years and models covered", pages: [], notes: "Helm identifies publication 31MCW600 as the factory-issued guide for 2002 Interceptor 800." },
  "cite.honda.vfr800-2002.om.fuses": { id: "cite.honda.vfr800-2002.om.fuses", documentId: "doc.honda.vfr800-2002.owners-manual", section: "Taking Care of the Unexpected", subsection: "Fuse replacement", pages: ["135", "136"], notes: "Main and circuit fuse locations/ratings; circuit-level assignments are not published in the accessible excerpt." },
  "cite.honda.vfr800-2002.tb.wiring-standard": { id: "cite.honda.vfr800-2002.tb.wiring-standard", documentId: "doc.honda.vfr800-2002-2003.wiring-recall", section: "Modified wiring diagram", subsection: "2002–2003 VFR800 standard type", pages: ["12"], notes: "American Honda's standard-type diagram labels fuse-box positions A–F and ties each 10 A or 20 A fuse to its circuit. The bulletin and affected-VIN table limit this evidence to USA models." },
  "cite.honda.vfr800-2002.tb.wiring-abs": { id: "cite.honda.vfr800-2002.tb.wiring-abs", documentId: "doc.honda.vfr800-2002-2003.wiring-recall", section: "Modified wiring diagram", subsection: "2002–2003 VFR800A ABS type", pages: ["diagram 2002–2003 ABS type"], notes: "ABS-specific wiring and fuse context." },
  "cite.honda.vfr800-2002.jp.general-specs": { id: "cite.honda.vfr800-2002.jp.general-specs", documentId: "doc.honda.vfr800-2002.jp-press-information", section: "Specifications", subsection: "Main specifications", pages: ["Specifications"], notes: "Official Japanese MY2002 BC-RC46 specifications corroborate 1,460 mm wheelbase, 125 mm ground clearance, 25°30′ caster, 95 mm trail and 22 L fuel capacity." },
  "cite.honda.vfr800-2002.jp.dual-cbs": { id: "cite.honda.vfr800-2002.jp.dual-cbs", documentId: "doc.honda.vfr800-2002.jp-press-information", section: "Chassis", subsection: "High-rigidity frame and latest Dual CBS", pages: ["Chassis"], notes: "Honda explicitly names Dual CBS on the Japanese BC-RC46 launched in January 2002; no non-Japan or ABS applicability is inferred." },
  "cite.honda.vfr800-2002.jp.headlight": { id: "cite.honda.vfr800-2002.jp.headlight", documentId: "doc.honda.vfr800-2002.jp-press-information", section: "Styling (2)", subsection: "New quad headlight", pages: ["Styling (2)"], notes: "Japanese MY2002 lighting: two 45 W H4R low-beam bulbs and two 55 W H7 high-beam bulbs." }
};

const registry = { documents, citations };
if (typeof module === "object" && module.exports) module.exports = registry;
if (root) root.RevLogVfr8002002SourceRegistry = registry;
})(typeof globalThis !== "undefined" ? globalThis : this, function createVfr800Documents() {});
