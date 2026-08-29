// NON-PRODUCTION RESEARCH DATA. Values remain candidates until human profile review.
"use strict";

const groups = [
  {
    key: "yamaha.mt09.gen3", family: "MT-09", years: { from: 2021, to: 2021 }, region: "EU",
    sourceId: "research.yamaha.mt09.2021-factsheet", section: "Technical specifications", page: null,
    values: [
      ["engine.displacement", "890 cm³", 890, "cm³"], ["engine.configuration", "Liquid-cooled; 4-stroke; 4-valves; 3-Cylinder; DOHC", null, null],
      ["engine.bore", "78.0 mm", 78, "mm"], ["engine.stroke", "62.1 mm", 62.1, "mm"], ["engine.compression-ratio", "11.5 : 1", "11.5:1", null],
      ["lubrication.system", "Wet sump", "wet-sump", null], ["lubrication.total-capacity", "3.50 L", 3.5, "L"],
      ["drive.final", "Chain", "chain", null], ["transmission.gearbox", "Constant Mesh; 6-speed", 6, "count"],
      ["tires.front.size", "120/70 ZR17M/C (58W) Tubeless", "120/70 ZR17M/C (58W)", null], ["tires.rear.size", "180/55 ZR17M/C (73W) Tubeless", "180/55 ZR17M/C (73W)", null],
      ["brakes.front", "Hydraulic dual disc, Ø 298 mm", null, null], ["brakes.rear", "Hydraulic single disc, Ø 245 mm", null, null],
      ["fuel.capacity", "14 L", 14, "L"], ["dimensions.seat-height", "825 mm", 825, "mm"], ["dimensions.wheelbase", "1,430 mm", 1430, "mm"],
      ["mass.wet", "189 kg including full oil and fuel tank", 189, "kg"], ["engine.maximum-torque", "93.0 Nm @ 7,000 rpm", 93, "N·m"]
    ]
  },
  {
    key: "yamaha.tenere700.gen1", family: "Ténéré 700", years: { from: 2021, to: 2021 }, region: "EU",
    sourceId: "research.yamaha.tenere700.2021-factsheet", section: "Technical specifications", page: null,
    values: [
      ["engine.displacement", "689 cc", 689, "cm³"], ["engine.configuration", "EURO5; 4-stroke; 2-Cylinder; Liquid-cooled; DOHC", null, null],
      ["engine.bore", "80.0 mm", 80, "mm"], ["engine.stroke", "68.6 mm", 68.6, "mm"], ["engine.compression-ratio", "11.5 : 1", "11.5:1", null],
      ["lubrication.system", "Wet sump", "wet-sump", null], ["lubrication.total-capacity", "2.6 litres", 2.6, "L"],
      ["drive.final", "Chain", "chain", null], ["transmission.gearbox", "Constant Mesh; 6-speed", 6, "count"],
      ["tires.front.size", "90/90 - 21 M/C 54V", "90/90-21 M/C 54V", null], ["tires.rear.size", "150/70 R 18 M/C 70V", "150/70 R18 M/C 70V", null],
      ["brakes.front", "Hydraulic dual disc, Ø 282 mm", null, null], ["brakes.rear", "Hydraulic single disc, Ø 245 mm", null, null],
      ["fuel.capacity", "16.0 litres", 16, "L"], ["dimensions.seat-height", "875 mm", 875, "mm"], ["dimensions.wheelbase", "1,595 mm", 1595, "mm"],
      ["mass.wet", "204 kg including full oil and fuel tank", 204, "kg"], ["engine.maximum-torque", "68 Nm @ 6,500 rpm", 68, "N·m"]
    ]
  },
  {
    key: "yamaha.yzf-r1.gen6", family: "YZF-R1", years: { from: 2009, to: 2009 }, region: "EU",
    sourceId: "research.yamaha.r1.2009-release", section: "2009 European model main specifications", page: null,
    values: [
      ["engine.displacement", "998 cm³", 998, "cm³"], ["engine.configuration", "Liquid cooled, 4-stroke, DOHC, 4-valve; forward-inclined parallel 4-cylinder", null, null],
      ["engine.bore", "78.0 mm", 78, "mm"], ["engine.stroke", "52.2 mm", 52.2, "mm"], ["engine.compression-ratio", "12.7:1", "12.7:1", null],
      ["engine.maximum-power", "133.9 kW @ 12,500 r/min", 133.9, "kW"], ["engine.maximum-torque", "115.5 N·m @ 10,000 r/min", 115.5, "N·m"],
      ["fuel.capacity", "18 L", 18, "L"], ["tires.front.size", "120/70ZR17M/C (58W)", "120/70ZR17M/C (58W)", null],
      ["tires.rear.size", "190/55ZR17M/C (75W)", "190/55ZR17M/C (75W)", null], ["dimensions.seat-height", "835 mm", 835, "mm"],
      ["dimensions.wheelbase", "1,415 mm", 1415, "mm"], ["dimensions.length", "2,070 mm", 2070, "mm"], ["dimensions.width", "715 mm", 715, "mm"],
      ["dimensions.height", "1,130 mm", 1130, "mm"], ["mass.wet", "206 kg with oil and full fuel tank", 206, "kg"]
    ]
  },
  {
    key: "yamaha.mt09.gen1", family: "MT-09", years: { from: 2014, to: 2014 }, region: "EU",
    sourceId: "research.yamaha.mt09.2014-release", section: "2014 European model main specifications", page: null,
    values: [
      ["engine.displacement", "847 cm³", 847, "cm³"], ["engine.configuration", "Liquid-cooled 4-stroke in-line 3-cylinder DOHC 4-valve", null, null],
      ["engine.bore", "78 mm", 78, "mm"], ["engine.stroke", "59.1 mm", 59.1, "mm"], ["engine.compression-ratio", "11.5:1", "11.5:1", null],
      ["engine.maximum-power", "84.6 kW @ 10,000 r/min", 84.6, "kW"], ["engine.maximum-torque", "87.5 N·m @ 8,500 r/min", 87.5, "N·m"],
      ["fuel.capacity", "14 L", 14, "L"], ["dimensions.seat-height", "815 mm", 815, "mm"], ["dimensions.wheelbase", "1,440 mm", 1440, "mm"],
      ["dimensions.length", "2,075 mm", 2075, "mm"], ["dimensions.width", "815 mm", 815, "mm"], ["dimensions.height", "1,135 mm", 1135, "mm"],
      ["mass.wet", "188 kg with oil and full fuel tank", 188, "kg"]
    ]
  }
];

let sequence = 0;
module.exports = Object.freeze(groups.flatMap(group => group.values.map(value => ({
  researchRecordId: `candidate.yamaha.${String(++sequence).padStart(3, "0")}`,
  proposedCatalogVariantKey: group.key, manufacturer: "Yamaha", family: group.family,
  years: group.years, region: group.region, abs: null, equipment: null,
  technicalField: value[0], rawValue: value[1], normalizedCandidateValue: value[2], unit: value[3],
  sourceIds: [group.sourceId], sourceSection: group.section, sourcePage: group.page,
  evidenceNote: "Short factual value transcribed from the cited official Yamaha release/factsheet; production applicability review is still required.",
  status: "candidate", conflictStatus: "none", conflictGroup: null, notes: null
}))));
