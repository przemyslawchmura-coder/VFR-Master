// NON-PRODUCTION RESEARCH DATA. Boundaries are research proposals, not production identities.
"use strict";

const H = "research.honda.history.75-years";
const V = "research.honda.vfr.official-history";
const A = "research.honda.africa-twin.official-history";
const E08 = "research.honda.europe.2008-lineup";
const E13 = "research.honda.europe.2013-lineup";
const E16 = "research.honda.europe.2016-lineup";
const E19 = "research.honda.europe.2019-lineup";
const E20 = "research.honda.europe.2020-lineup";
const E23 = "research.honda.europe.2023-lineup";
const E24 = "research.honda.europe.2024-lineup";
const READY_KEYS = new Set(["honda.cbr500r.gen4", "honda.cbr650r.gen1", "honda.cbr1000rr-r.gen1", "honda.africa-twin.crf1100l.gen1", "honda.nc750x.gen3"]);

const rows = [
  ["honda.vfr750.gen1", "VFR750", "VFR750F", "First VFR750 generation candidate", null, 1986, 1989, V],
  ["honda.vfr750.gen2", "VFR750", "VFR750F", "1990 full-change generation candidate", null, 1990, 1993, V],
  ["honda.vfr750.gen3", "VFR750", "VFR750F", "1994 generation candidate", null, 1994, 1997, V],
  ["honda.vfr800.fi-gen1", "VFR800", "VFR800Fi", "Pre-VTEC fuel-injected generation", null, 1998, 2001, V],
  ["honda.vfr800.vtec-gen2", "VFR800", "VFR800 VTEC", "Later VTEC update boundary", null, 2006, 2013, V],
  ["honda.vfr800f.gen1", "VFR800", "VFR800F", "2014 VFR800F generation", null, 2014, null, V],
  ["honda.vfr1200f.gen1", "VFR1200", "VFR1200F", "V4 sport-tourer generation", null, 2010, null, H],
  ["honda.cbr600f.gen1", "CBR600F", "CBR600F", "Initial CBR600F generation", null, 1987, 1990, H],
  ["honda.cbr600f.gen2", "CBR600F", "CBR600F", "1991 generation candidate", null, 1991, 1994, H],
  ["honda.cbr600f.gen3", "CBR600F", "CBR600F", "1995 generation candidate", null, 1995, 1998, H],
  ["honda.cbr600f.gen4", "CBR600F", "CBR600F", "1999 generation candidate", null, 1999, 2006, H],
  ["honda.cbr600f.gen5", "CBR600F", "CBR600F", "2011 revival candidate", null, 2011, 2013, H],
  ["honda.cbr600rr.gen1", "CBR600RR", "CBR600RR", "Initial CBR600RR generation", null, 2003, 2004, H],
  ["honda.cbr600rr.gen2", "CBR600RR", "CBR600RR", "2005 full model change", null, 2005, 2006, "research.honda.cbr600rr.2005-release"],
  ["honda.cbr600rr.gen3", "CBR600RR", "CBR600RR", "2007 generation candidate", null, 2007, 2012, H],
  ["honda.cbr600rr.gen4", "CBR600RR", "CBR600RR", "2013 update boundary", null, 2013, 2019, E13],
  ["honda.cbr600rr.gen5-jp", "CBR600RR", "CBR600RR", "2020 Japan model boundary", null, 2020, null, "research.honda.cbr600rr.2020-release"],
  ["honda.cbr600rr.gen5-eu", "CBR600RR", "CBR600RR", "2024 European return boundary", null, 2024, null, E24],
  ["honda.fireblade.gen1", "CBR900RR / FireBlade", "CBR900RR FireBlade", "Initial FireBlade generation", null, 1992, 1995, H],
  ["honda.fireblade.gen2", "CBR900RR / FireBlade", "CBR900RR FireBlade", "1996 generation candidate", null, 1996, 1999, H],
  ["honda.fireblade.cbr929rr", "CBR929RR", "CBR929RR FireBlade", "929 cc generation", null, 2000, 2001, H],
  ["honda.fireblade.cbr954rr", "CBR954RR", "CBR954RR FireBlade", "954 cc generation", null, 2002, 2003, H],
  ["honda.cbr1000rr.gen1", "CBR1000RR", "CBR1000RR Fireblade", "Initial 1000RR generation", null, 2004, 2007, H],
  ["honda.cbr1000rr.gen2", "CBR1000RR", "CBR1000RR Fireblade", "2008 full model change", null, 2008, 2011, E08],
  ["honda.cbr1000rr.gen3", "CBR1000RR", "CBR1000RR Fireblade", "2012 generation update", null, 2012, 2016, H],
  ["honda.cbr1000rr.gen4", "CBR1000RR", "CBR1000RR Fireblade", "2017 generation candidate", null, 2017, 2019, H],
  ["honda.cbr1000rr-r.gen1", "CBR1000RR-R", "CBR1000RR-R Fireblade", "Initial RR-R generation", null, 2020, 2023, E20],
  ["honda.cbr1000rr-r.gen2", "CBR1000RR-R", "CBR1000RR-R Fireblade", "2024 major update boundary", null, 2024, null, E24],
  ["honda.cbr650f.gen1", "CBR650F", "CBR650F", "Initial CBR650F generation", null, 2014, 2018, E16],
  ["honda.cbr650r.gen1", "CBR650R", "CBR650R", "Initial CBR650R generation", null, 2019, 2023, E19],
  ["honda.cbr650r.gen2", "CBR650R", "CBR650R", "2024 E-Clutch update boundary", null, 2024, null, E24],
  ["honda.cb500.twin-gen1", "CB500", "CB500", "1990s parallel-twin family", null, 1994, 2003, H],
  ["honda.cb500f.gen1", "CB500F", "CB500F", "Initial 471 cc platform", null, 2013, 2015, E13],
  ["honda.cb500f.gen2", "CB500F", "CB500F", "2016 update boundary", null, 2016, 2018, E16],
  ["honda.cb500f.gen3", "CB500F", "CB500F", "2019 update boundary", null, 2019, 2023, E19],
  ["honda.cb500-hornet.gen1", "CB500 Hornet", "CB500 Hornet", "Renamed 500 roadster boundary", null, 2024, null, E24],
  ["honda.cb500x.gen1", "CB500X", "CB500X", "Initial CB500X generation", null, 2013, 2015, E13],
  ["honda.cb500x.gen2", "CB500X", "CB500X", "2016 update boundary", null, 2016, 2018, E16],
  ["honda.cb500x.gen3", "CB500X", "CB500X", "2019 update boundary", null, 2019, 2023, E19],
  ["honda.nx500.gen1", "NX500", "NX500", "NX500 rename/update boundary", null, 2024, null, E24],
  ["honda.cbr500r.gen1", "CBR500R", "CBR500R", "Initial CBR500R generation", null, 2013, 2015, E13],
  ["honda.cbr500r.gen2", "CBR500R", "CBR500R", "2016 update boundary", null, 2016, 2018, E16],
  ["honda.cbr500r.gen3", "CBR500R", "CBR500R", "2019 update boundary", null, 2019, 2023, E19],
  ["honda.cbr500r.gen4", "CBR500R", "CBR500R", "2024 update boundary", null, 2024, null, E24],
  ["honda.hornet600.gen1", "CB600F Hornet", "CB600F Hornet", "Initial Hornet 600 generation", null, 1998, 2006, H],
  ["honda.hornet600.gen2", "CB600F Hornet", "CB600F Hornet", "2007 generation candidate", null, 2007, 2013, H],
  ["honda.cb650f.gen1", "CB650F", "CB650F", "Initial CB650F generation", null, 2014, 2018, E16],
  ["honda.cb650r.gen1", "CB650R", "CB650R", "Initial CB650R generation", null, 2019, 2023, E19],
  ["honda.cb650r.gen2", "CB650R", "CB650R", "2024 E-Clutch update boundary", null, 2024, null, E24],
  ["honda.cb750-hornet.gen1", "CB750 Hornet", "CB750 Hornet", "755 cc Hornet generation", null, 2023, null, E23],
  ["honda.cb900f-hornet.gen1", "CB900F Hornet", "CB900F Hornet", "919 cc Hornet generation", null, 2002, 2007, H],
  ["honda.cb1000r.gen1", "CB1000R", "CB1000R", "Initial modern CB1000R generation", null, 2008, 2017, E08],
  ["honda.cb1000r.gen2", "CB1000R", "CB1000R", "Neo Sports Café generation", null, 2018, null, E19],
  ["honda.cb1000-hornet.gen1", "CB1000 Hornet", "CB1000 Hornet", "Initial CB1000 Hornet generation", null, 2024, null, E24],
  ["honda.africa-twin.xrv650.gen1", "Africa Twin", "XRV650 Africa Twin", "First Africa Twin generation", "XRV650", 1988, 1989, A],
  ["honda.africa-twin.xrv750.gen2", "Africa Twin", "XRV750 Africa Twin", "Second Africa Twin generation", "XRV750", 1990, 1992, A],
  ["honda.africa-twin.xrv750.gen3", "Africa Twin", "XRV750 Africa Twin", "1993 full model change", "XRV750", 1993, 2000, A],
  ["honda.africa-twin.crf1100l.gen1", "Africa Twin", "CRF1100L Africa Twin", "1100 platform generation", "CRF1100L", 2020, 2023, E20],
  ["honda.africa-twin.crf1100l.gen2", "Africa Twin", "CRF1100L Africa Twin", "2024 update boundary", "CRF1100L", 2024, null, E24],
  ["honda.transalp.xl600v.gen1", "Transalp", "XL600V Transalp", "Initial Transalp generation", "XL600V", 1987, null, H],
  ["honda.transalp.xl650v.gen1", "Transalp", "XL650V Transalp", "650 generation", "XL650V", 2000, 2007, H],
  ["honda.transalp.xl700v.gen1", "Transalp", "XL700V Transalp", "700 generation", "XL700V", 2008, null, E08],
  ["honda.transalp.xl750.gen1", "Transalp", "XL750 Transalp", "755 cc parallel-twin generation", "XL750", 2023, null, E23],
  ["honda.nc700.gen1", "NC700", "NC700S / NC700X", "Initial New Concept platform", null, 2012, 2013, H],
  ["honda.nc750.gen1", "NC750", "NC750S / NC750X", "750 platform introduction", null, 2014, 2015, H],
  ["honda.nc750.gen2", "NC750", "NC750S / NC750X", "2016 update boundary", null, 2016, 2020, E16],
  ["honda.nc750x.gen3", "NC750", "NC750X", "2021 generation candidate", null, 2021, null, "research.honda.uk.2021-adventure-brochure"],
  ["honda.nt1100.gen1", "NT1100", "NT1100", "Initial NT1100 generation", "NT1100", 2022, null, "research.honda.europe.2022-lineup"],
  ["honda.gold-wing.gl1800.gen2", "Gold Wing / GL1800", "GL1800 Gold Wing", "2018 flat-six generation", "GL1800", 2018, null, H],
  ["honda.rebel.cmx500.gen1", "Rebel CMX500", "CMX500 Rebel", "471 cc Rebel generation", "CMX500", 2017, null, H],
  ["honda.rebel.cmx1100.gen1", "Rebel CMX1100", "CMX1100 Rebel", "1084 cc Rebel generation", "CMX1100", 2021, null, H],
  ["honda.crf300l.gen1", "CRF300L", "CRF300L", "Initial CRF300L generation", "CRF300L", 2021, null, H],
  ["honda.deauville.nt650v.gen1", "NT650V Deauville", "NT650V Deauville", "650 V-twin touring generation", "NT650V", 1998, 2005, H],
  ["honda.deauville.nt700v.gen1", "NT700V Deauville", "NT700V Deauville", "700 fuel-injected touring generation", "NT700V", 2006, 2013, H],
  ["honda.varadero.xl1000v.gen1", "Varadero XL1000V", "XL1000V Varadero", "Initial litre-class adventure generation", "XL1000V", 1999, null, H],
  ["honda.gold-wing.gl1500.gen1", "Gold Wing / GL1500", "GL1500 Gold Wing", "Fourth-generation Gold Wing", "GL1500", 1988, 2000, "research.honda.gold-wing.official-history"],
  ["honda.gold-wing.gl1800.gen1", "Gold Wing / GL1800", "GL1800 Gold Wing", "Fifth-generation Gold Wing", "GL1800", 2001, 2017, "research.honda.gold-wing.official-history"],
  ["honda.pan-european.st1100.gen1", "ST1100 Pan European", "ST1100 Pan European", "Initial Pan European generation", "ST1100", 1990, 2001, H],
  ["honda.pan-european.st1300.gen1", "ST1300 Pan European", "ST1300 Pan European", "1300 Pan European generation", "ST1300", 2002, null, H],
  ["honda.shadow.vt750.gen1", "Shadow VT series", "VT750 Shadow", "VT750 research boundary", "VT750", 2004, null, H],
  ["honda.crf250l.gen1", "CRF250L", "CRF250L", "Initial road-legal CRF250L generation", "CRF250L", 2012, 2019, "research.honda.crf.official-history"],
  ["honda.crf450l.gen1", "CRF450L/RL", "CRF450L", "Road-legal CRF450L generation", "CRF450L", 2018, null, "research.honda.crf.official-history"],
  ["honda.forza300.gen1", "Forza", "NSS300 Forza", "300-class Forza generation", "NSS300", 2013, null, E13]
];

module.exports = Object.freeze(rows.map((row, index) => ({
  researchRecordId: `catalog.honda.${String(index + 1).padStart(3, "0")}`,
  proposedCatalogVariantKey: row[0], manufacturer: "Honda", family: row[1], commercialName: row[2],
  generation: row[3], modelCode: row[4], years: { from: row[5], to: row[7] === H ? null : row[6] }, region: null,
  abs: null, equipment: null, status: READY_KEYS.has(row[0]) ? "ready-for-profile-review" : row[7] === H ? "discovered" : "source-located", sourceIds: [row[7]],
  notes: row[7] === H
    ? "Official history is a discovery lead for the start boundary; end year and regional applicability remain unasserted."
    : "Research boundary derived from the cited official history/release; regional cutovers and applicability require human review."
})));
