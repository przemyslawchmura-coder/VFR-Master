// NON-PRODUCTION RESEARCH DATA. Never import this module from production runtime.
"use strict";

const sources = [
  { id: "research.honda.vfr.history", type: "official-technical-publication", title: "Honda 75 Years: VFR history", manufacturer: "Honda", url: "https://global.honda/en/about/history-digest/75years-history/chapter3/section1_2/page2.html", accessedAt: "2026-08-29" },
  { id: "research.honda.africa-twin.history", type: "official-technical-publication", title: "Honda Africa Twin model history", manufacturer: "Honda", url: "https://global.honda/en/tech/innovation/technology/motorcycle/tech-views/vol08_africatwin/history.html", accessedAt: "2026-08-29" },
  { id: "research.yamaha.mt07.2021.factsheet", type: "official-technical-publication", title: "2021 MT-07 Factsheet", manufacturer: "Yamaha", url: "https://cdn2.yamaha-motor.eu/prod/product-assets/2021/MT07/Factsheets/2021-MT07_en.pdf", accessedAt: "2026-08-29" },
  { id: "research.yamaha.mt07.2025.release", type: "official-technical-publication", title: "2025 MT-07 release", manufacturer: "Yamaha", url: "https://www.yamaha-motor.eu/is/en/news/2024/mt-07-2025/", accessedAt: "2026-08-29" },
  { id: "research.kawasaki.zx6r.2019.release", type: "official-technical-publication", title: "2019 Ninja ZX-6R announcement and specifications", manufacturer: "Kawasaki", url: "https://global.kawasaki.com/en/corp/newsroom/news/detail/?f=20181012_9701", accessedAt: "2026-08-29" },
  { id: "research.kawasaki.zx6r.2025.spec", type: "official-technical-publication", title: "2025 Ninja ZX-6R specifications", manufacturer: "Kawasaki", url: "https://content.kawasaki.com/en-us/motorcycle/ninja/supersport/ninja-zx-6r/2025-ninja-zx-6r", accessedAt: "2026-08-29" },
  { id: "research.suzuki.gsxr750.2025.spec", type: "official-technical-publication", title: "2025 GSX-R750 specifications", manufacturer: "Suzuki", url: "https://suzukicycles.com/sportbike/2025/gsx-r750", accessedAt: "2026-08-29" },
  { id: "research.suzuki.vstrom800de.2025.spec", type: "official-technical-publication", title: "2025 V-Strom 800DE specifications", manufacturer: "Suzuki", url: "https://suzukicycles.com/adventure/2025/v-strom-800de", accessedAt: "2026-08-29" },
  { id: "research.bmw.r1250gs.release", type: "official-technical-publication", title: "BMW R 1250 GS and Adventure press information", manufacturer: "BMW", url: "https://www.press.bmwgroup.com/global/article/detail/T0317720EN/the-new-bmw-r-1250-gs-and-r-1250-gs-adventure", accessedAt: "2026-08-29" },
  { id: "research.ducati.panigale-v4.2024.spec", type: "official-technical-publication", title: "Panigale V4 technical specifications", manufacturer: "Ducati", url: "https://www.ducati.com/us/en/bikes/panigale/panigale-v4-2024", accessedAt: "2026-08-29" },
  { id: "research.ducati.monster.gen5.release", type: "official-technical-publication", title: "Fifth-generation Monster production announcement", manufacturer: "Ducati", url: "https://www.ducati.com/us/en/news/production-begins-for-ducati-s-fifth-generation-monster", accessedAt: "2026-08-29" },
  { id: "research.triumph.bonneville-t120.spec", type: "official-technical-publication", title: "Bonneville T120 specifications", manufacturer: "Triumph", url: "https://www.triumphmotorcycles.com/motorcycles/classic/bonneville-t120/specification", accessedAt: "2026-08-29" },
  { id: "research.ktm.1290-super-adventure-s.2021.release", type: "official-technical-publication", title: "2021 KTM 1290 Super Adventure S release", manufacturer: "KTM", url: "https://press.ktm.com/news-nouveaut-la-nouvelle-ktm-1290-super-adventure-s-annonce-une-nouvelle-re-en-matire-de-matrise-technologique-et-de-performance?id=123741&imageid=440492&l=switzerland+%28fr%29&menueid=6458", accessedAt: "2026-08-29" },
  { id: "research.aprilia.tuareg660.spec", type: "official-technical-publication", title: "Tuareg 660 technical specifications", manufacturer: "Aprilia", url: "https://wlassets.aprilia.com/wlassets/aprilia/master/tech_spec/Tuareg/Tuareg-660_tech_spec_EN/original/Tuareg-660_tech_spec_EN.pdf?1740496338030=", accessedAt: "2026-08-29" },
  { id: "research.aprilia.rsv4.spec", type: "official-technical-publication", title: "Aprilia RSV4 technical specifications", manufacturer: "Aprilia", url: "https://wlassets.aprilia.com/wlassets/aprilia/au/tech-spec/aprilia_RSV4_en/original/aprilia_RSV4_en.pdf", accessedAt: "2026-08-29" },
  { id: "research.motoguzzi.stelvio.2024.spec", type: "official-technical-publication", title: "2024 Stelvio technical specifications", manufacturer: "Moto Guzzi", url: "https://wlassets.motoguzzi.com/wlassets/moto-guzzi/gb/tech_spec/2024/Stelvio_tech_spec_EN_2024-%281%29/original/Stelvio_tech_spec_EN_2024%2B%281%29.pdf?1708594603417=", accessedAt: "2026-08-29" },
  { id: "research.motoguzzi.v7.current", type: "official-technical-publication", title: "Moto Guzzi V7 model page", manufacturer: "Moto Guzzi", url: "https://www.motoguzzi.com/en_EN/moto-guzzi/en/new-moto-guzzi-v7/", accessedAt: "2026-08-29" },
  { id: "research.harley.sportster-s.spec", type: "official-technical-publication", title: "Sportster S specifications", manufacturer: "Harley-Davidson", url: "https://www.harley-davidson.com/us/en/motorcycles/models/sportster/sportster-s.html", accessedAt: "2026-08-29" },
  { id: "research.harley.2022.owner-manual", type: "official-owner-manual", title: "2022 Harley-Davidson Owner's Manual", manufacturer: "Harley-Davidson", url: "https://serviceinfo.harley-davidson.com/sip/service/document/original/1802738810358052210/2022-08-23%2094001064%20English%20%28United%20States%29%208%20DOM%20HARLEY-DAVIDSON%20OWNERS%20MANUAL.pdf", accessedAt: "2026-08-29" }
];

const catalog = [
  ["honda.vfr800.rc46-vtec-gen1", "Honda", "VFR800", "VFR800 VTEC", "RC46 VTEC early", "RC46", 2002, 2005, "research.honda.vfr.history"],
  ["honda.africa-twin.crf1000l.gen1", "Honda", "Africa Twin", "CRF1000L Africa Twin", "CRF1000L first generation", "CRF1000L", 2016, 2019, "research.honda.africa-twin.history"],
  ["yamaha.mt07.rm33.gen3", "Yamaha", "MT-07", "MT-07", "Third generation", "RM33", 2021, 2024, "research.yamaha.mt07.2021.factsheet"],
  ["yamaha.mt07.gen4", "Yamaha", "MT-07", "MT-07", "Fourth generation candidate", null, 2025, null, "research.yamaha.mt07.2025.release"],
  ["kawasaki.ninja-zx6r.zx636g", "Kawasaki", "Ninja ZX-6R", "Ninja ZX-6R", "2019 update", "ZX636G", 2019, 2023, "research.kawasaki.zx6r.2019.release"],
  ["kawasaki.ninja-zx6r.current", "Kawasaki", "Ninja ZX-6R", "Ninja ZX-6R", "Current research boundary", null, 2024, null, "research.kawasaki.zx6r.2025.spec"],
  ["suzuki.gsxr750.current", "Suzuki", "GSX-R750", "GSX-R750", "Current research boundary", null, 2025, null, "research.suzuki.gsxr750.2025.spec"],
  ["suzuki.vstrom800de.gen1", "Suzuki", "V-Strom 800DE", "V-Strom 800DE", "First generation", null, 2023, null, "research.suzuki.vstrom800de.2025.spec"],
  ["bmw.r1250gs.k50", "BMW", "R 1250 GS", "R 1250 GS", "K50 research boundary", "K50", 2019, 2023, "research.bmw.r1250gs.release"],
  ["ducati.panigale-v4.gen2", "Ducati", "Panigale V4", "Panigale V4", "Pre-2025 research boundary", null, 2022, 2024, "research.ducati.panigale-v4.2024.spec"],
  ["ducati.monster.gen5", "Ducati", "Monster", "Monster", "Fifth generation", null, 2026, null, "research.ducati.monster.gen5.release"],
  ["triumph.bonneville-t120.liquid-cooled", "Triumph", "Bonneville T120", "Bonneville T120", "Liquid-cooled generation", null, 2016, null, "research.triumph.bonneville-t120.spec"],
  ["ktm.1290-super-adventure-s.gen2", "KTM", "1290 Super Adventure S", "1290 Super Adventure S", "2021 generation", null, 2021, 2024, "research.ktm.1290-super-adventure-s.2021.release"],
  ["aprilia.tuareg660.gen1", "Aprilia", "Tuareg 660", "Tuareg 660", "First generation", null, 2022, null, "research.aprilia.tuareg660.spec"],
  ["aprilia.rsv4.1100.current", "Aprilia", "RSV4", "RSV4", "1100 current research boundary", null, 2021, null, "research.aprilia.rsv4.spec"],
  ["moto-guzzi.stelvio.v100.gen1", "Moto Guzzi", "Stelvio", "Stelvio", "V100 generation", null, 2024, null, "research.motoguzzi.stelvio.2024.spec"],
  ["moto-guzzi.v7.850.gen1", "Moto Guzzi", "V7", "V7", "850 generation research boundary", null, 2021, null, "research.motoguzzi.v7.current"],
  ["harley-davidson.sportster-s.rh1250s", "Harley-Davidson", "Sportster S", "Sportster S", "Revolution Max Sportster S", "RH1250S", 2021, null, "research.harley.sportster-s.spec"]
].map((row, index) => ({ researchRecordId: `catalog.${String(index + 1).padStart(3, "0")}`, proposedCatalogVariantKey: row[0], manufacturer: row[1], family: row[2], commercialName: row[3], generation: row[4], modelCode: row[5], years: { from: row[6], to: row[7] }, region: null, abs: null, equipment: null, status: "source-located", sourceIds: [row[8]], notes: "Partial research boundary; requires model-year and regional review before production use." }));

const candidates = [
  ["kawasaki.ninja-zx6r.zx636g", "Kawasaki", "Ninja ZX-6R", 2019, "engine.displacement", 636, 636, "cm³", "research.kawasaki.zx6r.2019.release"],
  ["kawasaki.ninja-zx6r.zx636g", "Kawasaki", "Ninja ZX-6R", 2019, "lubrication.capacity", "3.6 L", 3.6, "L", "research.kawasaki.zx6r.2019.release"],
  ["kawasaki.ninja-zx6r.zx636g", "Kawasaki", "Ninja ZX-6R", 2019, "tires.front.size", "120/70 ZR17", "120/70 ZR17", null, "research.kawasaki.zx6r.2019.release"],
  ["kawasaki.ninja-zx6r.zx636g", "Kawasaki", "Ninja ZX-6R", 2019, "tires.rear.size", "180/55 ZR17", "180/55 ZR17", null, "research.kawasaki.zx6r.2019.release"],
  ["triumph.bonneville-t120.liquid-cooled", "Triumph", "Bonneville T120", null, "engine.displacement", 1200, 1200, "cm³", "research.triumph.bonneville-t120.spec"],
  ["triumph.bonneville-t120.liquid-cooled", "Triumph", "Bonneville T120", null, "fuel.capacity", "14.5 L", 14.5, "L", "research.triumph.bonneville-t120.spec"],
  ["triumph.bonneville-t120.liquid-cooled", "Triumph", "Bonneville T120", null, "maintenance.interval", "10000 miles / 12 months", null, null, "research.triumph.bonneville-t120.spec"],
  ["aprilia.tuareg660.gen1", "Aprilia", "Tuareg 660", null, "engine.displacement", 659, 659, "cm³", "research.aprilia.tuareg660.spec"],
  ["aprilia.tuareg660.gen1", "Aprilia", "Tuareg 660", null, "fuel.capacity", "18 L", 18, "L", "research.aprilia.tuareg660.spec"],
  ["moto-guzzi.stelvio.v100.gen1", "Moto Guzzi", "Stelvio", 2024, "engine.displacement", 1042, 1042, "cm³", "research.motoguzzi.stelvio.2024.spec"],
  ["moto-guzzi.stelvio.v100.gen1", "Moto Guzzi", "Stelvio", 2024, "fuel.capacity", "21 L", 21, "L", "research.motoguzzi.stelvio.2024.spec"],
  ["harley-davidson.sportster-s.rh1250s", "Harley-Davidson", "Sportster S", 2022, "electrical.battery", "12 V, 12 Ah, 225 CCA", null, null, "research.harley.2022.owner-manual"],
  ["harley-davidson.sportster-s.rh1250s", "Harley-Davidson", "Sportster S", 2022, "electrical.charging-output", "45 A", 45, "A", "research.harley.2022.owner-manual"],
  ["harley-davidson.sportster-s.rh1250s", "Harley-Davidson", "Sportster S", 2022, "ignition.spark-plug-gap", "0.80–0.90 mm", null, "mm", "research.harley.2022.owner-manual"]
].map((row, index) => ({ researchRecordId: `candidate.${String(index + 1).padStart(3, "0")}`, proposedCatalogVariantKey: row[0], manufacturer: row[1], family: row[2], years: row[3] == null ? null : { from: row[3], to: row[3] }, region: null, abs: null, equipment: null, technicalField: row[4], rawValue: row[5], normalizedCandidateValue: row[6], unit: row[7], sourceIds: [row[8]], sourceSection: null, evidenceNote: "Short factual candidate transcribed from the identified official publication; production review still required.", status: "candidate", conflictStatus: "none", conflictGroup: null, notes: null }));

module.exports = Object.freeze({ schemaVersion: "revlog-research-data/v1", sources, catalog, candidates });
