// NON-PRODUCTION RESEARCH DATA. Values remain candidates until human profile review.
"use strict";

const groups = [
  {
    key: "honda.cbr500r.gen4", family: "CBR500R", years: { from: 2026, to: 2026 }, region: "UK",
    sourceId: "research.honda.uk.cbr500r.2026-spec", section: "CBR500R E-Clutch 2026 Specifications", page: null,
    values: [
      ["engine.displacement", "471 cc", 471, "cm³"], ["engine.configuration", "Liquid-cooled 4-stroke DOHC parallel twin", "Liquid-cooled 4-stroke DOHC parallel twin", null],
      ["engine.bore", "67 mm", 67, "mm"], ["engine.stroke", "66.8 mm", 66.8, "mm"], ["engine.compression-ratio", "10.7:1", "10.7:1", null],
      ["lubrication.total-capacity", "3.2 L", 3.2, "L"], ["tires.front.size", "120/70ZR17M/C (58W)", "120/70ZR17M/C (58W)", null],
      ["tires.rear.size", "160/60ZR17M/C (69W)", "160/60ZR17M/C (69W)", null], ["electrical.battery", "12 V 7.4 Ah; AGM", null, null],
      ["fuel.capacity", "17.1 L", 17.1, "L"], ["dimensions.wheelbase", "1,410 mm", 1410, "mm"], ["dimensions.seat-height", "785 mm", 785, "mm"],
      ["mass.kerb", "194 kg", 194, "kg"], ["drive.final", "Chain", "chain", null], ["transmission.gearbox", "6-speed", 6, "count"],
      ["brakes.front", "Dual 296 mm x 4 mm disc with Nissin radial-mount four piston calipers", null, null],
      ["brakes.rear", "Single 240 mm x 5 mm disc with single piston caliper", null, null], ["lighting.headlight", "LED", "LED", null]
    ]
  },
  {
    key: "honda.cbr650r.gen1", family: "CBR650R", years: { from: 2021, to: 2021 }, region: "UK",
    sourceId: "research.honda.uk.2021-supersport-brochure", section: "Specifications — CBR650R", page: "6",
    values: [
      ["engine.displacement", "649 cc", 649, "cm³"], ["engine.configuration", "Liquid-cooled 4 stroke DOHC inline-4", "Liquid-cooled 4 stroke DOHC inline-4", null],
      ["engine.maximum-power", "70 kW @ 12,000 rpm", 70, "kW"], ["engine.maximum-torque", "63 Nm @ 9,500 rpm", 63, "N·m"],
      ["dimensions.length", "2,120 mm", 2120, "mm"], ["dimensions.width", "750 mm", 750, "mm"], ["dimensions.height", "1,150 mm", 1150, "mm"],
      ["dimensions.seat-height", "810 mm", 810, "mm"], ["dimensions.wheelbase", "1,450 mm", 1450, "mm"], ["mass.kerb", "208 kg", 208, "kg"],
      ["tires.front.size", "120/70ZR17M/C", "120/70ZR17M/C", null], ["tires.rear.size", "180/55ZR17M/C", "180/55ZR17M/C", null],
      ["brakes.front", "310 mm double disc with four piston caliper", null, null], ["brakes.rear", "240 mm disc with single piston caliper", null, null]
    ]
  },
  {
    key: "honda.cbr1000rr-r.gen1", family: "CBR1000RR-R", years: { from: 2021, to: 2021 }, region: "UK",
    sourceId: "research.honda.uk.2021-supersport-brochure", section: "Specifications — CBR1000RR-R Fireblade", page: "6",
    values: [
      ["engine.displacement", "1,000 cc", 1000, "cm³"], ["engine.configuration", "Water-cooled, 4-stroke, DOHC, inline 4-cylinder", "Water-cooled, 4-stroke, DOHC, inline 4-cylinder", null],
      ["engine.maximum-power", "160 kW @ 14,500 rpm", 160, "kW"], ["engine.maximum-torque", "113 Nm @ 12,500 rpm", 113, "N·m"],
      ["dimensions.length", "2,100 mm", 2100, "mm"], ["dimensions.width", "745 mm", 745, "mm"], ["dimensions.height", "1,140 mm", 1140, "mm"],
      ["dimensions.seat-height", "830 mm", 830, "mm"], ["dimensions.wheelbase", "1,460 mm", 1460, "mm"], ["mass.kerb", "201 kg", 201, "kg"],
      ["tires.front.size", "120/70-ZR17", "120/70-ZR17", null], ["tires.rear.size", "200/55-ZR17", "200/55-ZR17", null],
      ["brakes.front", "330 mm double disc with radial-mount Nissin 4-piston caliper", null, null], ["brakes.rear", "220 mm disc with Brembo 2-piston caliper", null, null]
    ]
  },
  {
    key: "honda.africa-twin.crf1100l.gen1", family: "Africa Twin", years: { from: 2021, to: 2021 }, region: "UK",
    sourceId: "research.honda.uk.2021-adventure-brochure", section: "Specifications — CRF1100L Africa Twin", page: "18",
    values: [
      ["engine.displacement", "1,084 cc", 1084, "cm³"], ["engine.configuration", "Liquid-cooled 4-stroke 8-valve parallel Twin with 270° crank and Unicam", null, null],
      ["engine.maximum-power", "75 kW @ 7,500 rpm", 75, "kW"], ["engine.maximum-torque", "105 Nm @ 6,250 rpm", 105, "N·m"],
      ["dimensions.length", "2,334 mm", 2334, "mm"], ["dimensions.width", "961 mm", 961, "mm"], ["dimensions.height", "1,391 mm", 1391, "mm"],
      ["dimensions.seat-height", "850–870 mm standard", null, "mm"], ["dimensions.wheelbase", "1,575 mm", 1575, "mm"],
      ["mass.kerb", "226 kg; DCT 236 kg", null, "kg"], ["fuel.capacity", "18.8 L", 18.8, "L"],
      ["brakes.front", "310 mm dual wave floating hydraulic disc; radial four-piston caliper", null, null],
      ["brakes.rear", "256 mm wave hydraulic disc; two-piston caliper", null, null], ["brakes.abs", "2-channel; rear ABS on/off mode", null, null]
    ]
  },
  {
    key: "honda.nc750x.gen3", family: "NC750", years: { from: 2021, to: 2021 }, region: "UK",
    sourceId: "research.honda.uk.2021-adventure-brochure", section: "Specifications — NC750X", page: "19",
    values: [
      ["engine.displacement", "745 cc", 745, "cm³"], ["engine.configuration", "Liquid-cooled 4-stroke 8-valve SOHC parallel 2-cylinder", null, null],
      ["engine.maximum-power", "43.1 kW @ 6,750 rpm", 43.1, "kW"], ["engine.maximum-torque", "69 Nm @ 4,750 rpm", 69, "N·m"],
      ["dimensions.length", "2,210 mm", 2210, "mm"], ["dimensions.width", "846 mm", 846, "mm"], ["dimensions.height", "1,330 mm", 1330, "mm"],
      ["dimensions.seat-height", "800 mm", 800, "mm"], ["dimensions.wheelbase", "1,525 mm; DCT 1,535 mm", null, "mm"], ["mass.kerb", "214 kg; DCT 224 kg", null, "kg"]
    ]
  }
];

let sequence = 0;
module.exports = Object.freeze(groups.flatMap(group => group.values.map(value => ({
  researchRecordId: `candidate.honda.${String(++sequence).padStart(3, "0")}`,
  proposedCatalogVariantKey: group.key, manufacturer: "Honda", family: group.family,
  years: group.years, region: group.region, abs: null, equipment: null,
  technicalField: value[0], rawValue: value[1], normalizedCandidateValue: value[2], unit: value[3],
  sourceIds: [group.sourceId], sourceSection: group.section, sourcePage: group.page,
  evidenceNote: "Short factual value transcribed from the cited official Honda specification; production applicability review is still required.",
  status: "candidate", conflictStatus: "none", conflictGroup: null, notes: null
}))));
