/* Potwierdzone roczniki modelowe europejskiego katalogu.
   Źródła: archiwa modeli, komunikaty prasowe, instrukcje oraz
   katalogi części producentów; Louis Motorrad Bike-Datenbank;
   historie generacji MCN i Bennetts/Carole Nash.
   Ostatni uwzględniony rocznik modelowy: 2025. */
(() => {
/*
  variant.id
  = lokalny identyfikator wariantu wewnątrz danego modelu.

  variant.key
  = globalny, trwały identyfikator katalogowy przeznaczony do
    przyszłego pola catalog_variant_key.

  storedModel
  = kompatybilna nazwa modelu używana przez obecny zapis
    motocykla i legacy matching TechnicalDatabase.

  Te wartości mają różne zastosowania i nie są zamienne.
*/
const v = (id, key, name, storedModel, yearFrom, yearTo) =>
  ({ id, key, name, storedModel, yearFrom, yearTo });
const m = (id, name, variants) => ({ id, name, variants });

window.MotorcycleCatalogData = [
  {
    id: "honda", name: "Honda", models: [
      m("vfr800", "VFR800", [
        v("fi-rc46", "honda.vfr800.rc46.fi", "FI (RC46)", "VFR800 FI RC46", 1998, 2001),
        // Zachowuje istniejący klucz TechnicalDatabase dla MY2002.
        v("vtec", "honda.vfr800.rc46.vtec.gen1", "VTEC — I", "VFR800 VTEC", 2002, 2005),
        v("vtec-2", "honda.vfr800.rc46.vtec.gen2", "VTEC — II", "VFR800 VTEC 2006", 2006, 2013),
        v("f-rc79", "honda.vfr800.rc79.f", "F (RC79)", "VFR800F RC79", 2014, 2020)
      ]),
      m("cbr600rr", "CBR600RR", [
        v("pc37", "honda.cbr600rr.pc37", "PC37", "CBR600RR PC37", 2003, 2006),
        v("pc40-1", "honda.cbr600rr.pc40-1", "PC40 — I", "CBR600RR PC40 2007", 2007, 2012),
        v("pc40-2", "honda.cbr600rr.pc40-2", "PC40 — II", "CBR600RR PC40 2013", 2013, 2016),
        v("rh10", "honda.cbr600rr.rh10", "RH10", "CBR600RR RH10", 2024, 2025)
      ]),
      // Source: Honda UK, Fireblade History — oficjalne punkty
      // zmian 1994, 1996, 1998, 2004, 2006, 2008, 2012,
      // 2014, 2017, 2020, 2022 i 2024.
      m("cbr-fireblade", "CBR Fireblade", [
        v("sc28-1", "honda.cbr-fireblade.sc28-1", "CBR900RR SC28 — I", "CBR900RR SC28 1992", 1992, 1993),
        v("sc28-2", "honda.cbr-fireblade.sc28-2", "CBR900RR SC28 — II", "CBR900RR SC28 1994", 1994, 1995),
        v("sc33-1", "honda.cbr-fireblade.sc33-1", "CBR900RR SC33 — I", "CBR900RR SC33 1996", 1996, 1997),
        v("sc33-2", "honda.cbr-fireblade.sc33-2", "CBR900RR SC33 — II", "CBR900RR SC33 1998", 1998, 1999),
        v("sc44", "honda.cbr-fireblade.sc44", "CBR929RR SC44", "CBR929RR SC44", 2000, 2001),
        v("sc50", "honda.cbr-fireblade.sc50", "CBR954RR SC50", "CBR954RR SC50", 2002, 2003),
        v("sc57-1", "honda.cbr-fireblade.sc57-1", "CBR1000RR SC57 — I", "CBR1000RR SC57 2004", 2004, 2005),
        v("sc57-2", "honda.cbr-fireblade.sc57-2", "CBR1000RR SC57 — II", "CBR1000RR SC57 2006", 2006, 2007),
        v("sc59-1", "honda.cbr-fireblade.sc59-1", "CBR1000RR SC59 — I", "CBR1000RR SC59 2008", 2008, 2011),
        v("sc59-2", "honda.cbr-fireblade.sc59-2", "CBR1000RR SC59 — II", "CBR1000RR SC59 2012", 2012, 2013),
        v("sc59-3", "honda.cbr-fireblade.sc59-3", "CBR1000RR SC59 — III", "CBR1000RR SC59 2014", 2014, 2016),
        v("sc77", "honda.cbr-fireblade.sc77", "CBR1000RR SC77", "CBR1000RR SC77", 2017, 2019),
        v("sc82-1", "honda.cbr-fireblade.sc82-1", "CBR1000RR-R SC82 — I", "CBR1000RR-R SC82 2020", 2020, 2021),
        v("sc82-2", "honda.cbr-fireblade.sc82-2", "CBR1000RR-R SC82 — II", "CBR1000RR-R SC82 2022", 2022, 2023),
        v("sc82-3", "honda.cbr-fireblade.sc82-3", "CBR1000RR-R SC82 — III", "CBR1000RR-R SC82 2024", 2024, 2025)
      ]),
      m("africa-twin", "Africa Twin", [
        v("rd04", "honda.africa-twin.rd04", "XRV750 RD04", "XRV750 Africa Twin RD04", 1990, 1992),
        v("rd07", "honda.africa-twin.rd07", "XRV750 RD07", "XRV750 Africa Twin RD07", 1993, 1995),
        v("rd07a", "honda.africa-twin.rd07a", "XRV750 RD07A", "XRV750 Africa Twin RD07A", 1996, 2003),
        v("crf1000l", "honda.africa-twin.crf1000l", "CRF1000L", "CRF1000L Africa Twin", 2016, 2019),
        v("crf1100l-1", "honda.africa-twin.crf1100l-1", "CRF1100L — I", "CRF1100L Africa Twin 2020", 2020, 2023),
        v("crf1100l-2", "honda.africa-twin.crf1100l-2", "CRF1100L — II", "CRF1100L Africa Twin 2024", 2024, 2025)
      ]),
      m("cb500f", "CB500F", [
        v("pc45", "honda.cb500f.pc45", "PC45", "CB500F PC45", 2013, 2015),
        v("pc58", "honda.cb500f.pc58", "PC58", "CB500F PC58", 2016, 2018),
        v("pc63-1", "honda.cb500f.pc63-1", "PC63 — I", "CB500F PC63 2019", 2019, 2021),
        v("pc63-2", "honda.cb500f.pc63-2", "PC63 — II", "CB500F PC63 2022", 2022, 2023)
      ]),
      m("nc750x", "NC750X", [
        v("rc72", "honda.nc750x.rc72", "RC72", "NC750X RC72", 2014, 2015),
        v("rc90", "honda.nc750x.rc90", "RC90", "NC750X RC90", 2016, 2020),
        v("rh09-1", "honda.nc750x.rh09-1", "RH09 — I", "NC750X RH09 2021", 2021, 2024),
        v("rh09-2", "honda.nc750x.rh09-2", "RH09 — II", "NC750X RH09 2025", 2025, 2025)
      ]),
      m("transalp", "Transalp", [
        v("xl600v-pd06", "honda.transalp.xl600v-pd06", "XL600V PD06", "XL600V Transalp PD06", 1990, 1996),
        v("xl600v-pd10", "honda.transalp.xl600v-pd10", "XL600V PD10", "XL600V Transalp PD10", 1997, 1999),
        v("xl650v", "honda.transalp.xl650v", "XL650V", "XL650V Transalp", 2000, 2007),
        v("xl700v", "honda.transalp.xl700v", "XL700V", "XL700V Transalp", 2008, 2012),
        v("xl750", "honda.transalp.xl750", "XL750", "XL750 Transalp", 2023, 2025)
      ])
    ]
  },
  {
    id: "yamaha", name: "Yamaha", models: [
      m("fz1", "FZ1", [
        v("n", "yamaha.fz1.gen2.n", "N", "FZ1-N", 2006, 2015),
        v("s", "yamaha.fz1.gen2.s", "S / Fazer", "FZ1-S", 2006, 2015)
      ]),
      // Source: Yamaha Motor, The R-Series Pedigree oraz oficjalne
      // premiery europejskich modeli 2002, 2004, 2007, 2009 i 2015.
      m("yzf-r1", "YZF-R1", [
        v("rn01", "yamaha.yzf-r1.rn01", "RN01", "YZF-R1 RN01", 1998, 1999),
        v("rn04", "yamaha.yzf-r1.rn04", "RN04", "YZF-R1 RN04", 2000, 2001),
        v("rn09", "yamaha.yzf-r1.rn09", "RN09", "YZF-R1 RN09", 2002, 2003),
        v("rn12", "yamaha.yzf-r1.rn12", "RN12", "YZF-R1 RN12", 2004, 2006),
        v("rn19", "yamaha.yzf-r1.rn19", "RN19", "YZF-R1 RN19", 2007, 2008),
        v("rn22-1", "yamaha.yzf-r1.rn22-1", "RN22 — VI generacja", "YZF-R1 RN22 2009", 2009, 2011),
        v("rn22-2", "yamaha.yzf-r1.rn22-2", "RN22 — VII generacja", "YZF-R1 RN22 2012", 2012, 2014),
        v("rn32", "yamaha.yzf-r1.rn32", "RN32", "YZF-R1 RN32", 2015, 2016),
        v("rn49", "yamaha.yzf-r1.rn49", "RN49", "YZF-R1 RN49", 2017, 2019),
        v("rn65", "yamaha.yzf-r1.rn65", "RN65", "YZF-R1 RN65", 2020, 2024)
      ]),
      m("mt-07", "MT-07", [
        v("gen1", "yamaha.mt-07.gen1", "I generacja", "MT-07 2014", 2014, 2017),
        v("gen2", "yamaha.mt-07.gen2", "II generacja", "MT-07 2018", 2018, 2020),
        v("gen3", "yamaha.mt-07.gen3", "III generacja", "MT-07 2021", 2021, 2024),
        v("gen4", "yamaha.mt-07.gen4", "IV generacja", "MT-07 2025", 2025, 2025)
      ]),
      m("mt-09", "MT-09", [
        v("gen1", "yamaha.mt-09.gen1", "I generacja", "MT-09 2014", 2014, 2016),
        v("gen2", "yamaha.mt-09.gen2", "II generacja", "MT-09 2017", 2017, 2020),
        v("gen3", "yamaha.mt-09.gen3", "III generacja", "MT-09 2021", 2021, 2023),
        v("gen4", "yamaha.mt-09.gen4", "IV generacja", "MT-09 2024", 2024, 2025)
      ]),
      m("tracer", "Tracer", [
        v("mt09", "yamaha.tracer.mt09", "MT-09 Tracer", "MT-09 Tracer", 2015, 2017),
        v("900", "yamaha.tracer.900", "Tracer 900 / GT", "Tracer 900", 2018, 2020),
        v("9-1", "yamaha.tracer.9-1", "Tracer 9 / GT", "Tracer 9 2021", 2021, 2024),
        v("9-2", "yamaha.tracer.9-2", "Tracer 9 / GT — 2025", "Tracer 9 2025", 2025, 2025)
      ]),
      m("tenere-700", "Ténéré 700", [
        v("gen1", "yamaha.tenere-700.gen1", "I generacja", "Tenere 700 2019", 2019, 2024),
        v("gen2", "yamaha.tenere-700.gen2", "II generacja", "Tenere 700 2025", 2025, 2025)
      ]),
      m("fz6", "FZ6", [
        v("n", "yamaha.fz6.n", "N", "FZ6-N", 2004, 2006),
        v("s", "yamaha.fz6.s", "S / Fazer", "FZ6-S Fazer", 2004, 2006),
        v("n-s2", "yamaha.fz6.n-s2", "N S2", "FZ6-N S2", 2007, 2010),
        v("s2", "yamaha.fz6.s2", "S2 Fazer", "FZ6-S2 Fazer", 2007, 2010)
      ])
    ]
  },
  {
    id: "suzuki", name: "Suzuki", models: [
      m("sv650", "SV650", [
        v("gen1", "suzuki.sv650.gen1", "I generacja", "SV650 1999", 1999, 2002),
        v("gen2", "suzuki.sv650.gen2", "II generacja", "SV650 2003", 2003, 2008),
        v("gladius", "suzuki.sv650.gladius", "SFV650 Gladius", "SFV650 Gladius", 2009, 2015),
        v("gen3", "suzuki.sv650.gen3", "III generacja", "SV650 2016", 2016, 2025)
      ]),
      m("v-strom-650", "V-Strom 650", [
        v("gen1", "suzuki.v-strom-650.gen1", "I generacja", "DL650 V-Strom 2004", 2004, 2011),
        v("gen2", "suzuki.v-strom-650.gen2", "II generacja", "DL650 V-Strom 2012", 2012, 2016),
        v("gen3", "suzuki.v-strom-650.gen3", "III generacja", "DL650 V-Strom 2017", 2017, 2025),
        v("xt2", "suzuki.v-strom-650.xt2", "XT — II generacja", "DL650XT V-Strom 2015", 2015, 2016),
        v("xt3", "suzuki.v-strom-650.xt3", "XT — III generacja", "DL650XT V-Strom 2017", 2017, 2025)
      ]),
      m("v-strom-1000-1050", "V-Strom 1000 / 1050", [
        v("1000-1", "suzuki.v-strom-1000-1050.1000-1", "DL1000 — I", "DL1000 V-Strom 2002", 2002, 2009),
        v("1000-2", "suzuki.v-strom-1000-1050.1000-2", "DL1000 — II", "DL1000 V-Strom 2014", 2014, 2016),
        v("1000-3", "suzuki.v-strom-1000-1050.1000-3", "DL1000 — III", "DL1000 V-Strom 2017", 2017, 2019),
        v("1050-1", "suzuki.v-strom-1000-1050.1050-1", "DL1050", "DL1050 V-Strom 2020", 2020, 2022),
        v("1050-2", "suzuki.v-strom-1000-1050.1050-2", "DL1050 / DE", "DL1050 V-Strom 2023", 2023, 2025)
      ]),
      m("hayabusa", "Hayabusa", [
        v("gen1", "suzuki.hayabusa.gen1", "I generacja", "GSX1300R Hayabusa 1999", 1999, 2007),
        v("gen2", "suzuki.hayabusa.gen2", "II generacja", "GSX1300R Hayabusa 2008", 2008, 2018),
        v("gen3", "suzuki.hayabusa.gen3", "III generacja", "GSX1300R Hayabusa 2021", 2021, 2025)
      ]),
      // Source: Global Suzuki, Development of a Winner:
      // MY2000 nosi oznaczenie Y; K1 zaczyna się w MY2001.
      m("gsx-r750", "GSX-R750", [
        v("gr7ad", "suzuki.gsx-r750.gr7ad", "GR7AD", "GSX-R750 GR7AD", 1990, 1991),
        v("gr7bb", "suzuki.gsx-r750.gr7bb", "GR7BB", "GSX-R750 GR7BB", 1992, 1995),
        v("srad", "suzuki.gsx-r750.srad", "SRAD", "GSX-R750 SRAD", 1996, 1999),
        v("y", "suzuki.gsx-r750.y", "Y", "GSX-R750 Y", 2000, 2000),
        v("k1", "suzuki.gsx-r750.k1", "K1–K3", "GSX-R750 K1", 2001, 2003),
        v("k4", "suzuki.gsx-r750.k4", "K4–K5", "GSX-R750 K4", 2004, 2005),
        v("k6", "suzuki.gsx-r750.k6", "K6–K7", "GSX-R750 K6", 2006, 2007),
        v("k8", "suzuki.gsx-r750.k8", "K8–L0", "GSX-R750 K8", 2008, 2010),
        v("l1", "suzuki.gsx-r750.l1", "L1", "GSX-R750 L1", 2011, 2017)
      ]),
      m("gsx-r1000", "GSX-R1000", [
        v("k1", "suzuki.gsx-r1000.k1", "K1–K2", "GSX-R1000 K1", 2001, 2002),
        v("k3", "suzuki.gsx-r1000.k3", "K3–K4", "GSX-R1000 K3", 2003, 2004),
        v("k5", "suzuki.gsx-r1000.k5", "K5–K6", "GSX-R1000 K5", 2005, 2006),
        v("k7", "suzuki.gsx-r1000.k7", "K7–K8", "GSX-R1000 K7", 2007, 2008),
        v("k9", "suzuki.gsx-r1000.k9", "K9–L1", "GSX-R1000 K9", 2009, 2011),
        v("l2", "suzuki.gsx-r1000.l2", "L2–L6", "GSX-R1000 L2", 2012, 2016),
        v("l7", "suzuki.gsx-r1000.l7", "L7 / R", "GSX-R1000 L7", 2017, 2022)
      ])
    ]
  },
  {
    id: "kawasaki", name: "Kawasaki", models: [
      // Source: Kawasaki OEM model catalogues. ZX600P (2007–2008)
      // i ZX600R (2009–2012) są osobnymi iteracjami. W Europie
      // model był nieobecny w MY2017–2018 oraz MY2021–2023;
      // Kawasaki oficjalnie ogłosiło jego powrót na MY2024.
      m("ninja-zx-6r", "Ninja ZX-6R", [
        v("zx600f", "kawasaki.ninja-zx-6r.zx600f", "ZX600F", "Ninja ZX-6R ZX600F", 1995, 1997),
        v("zx600g", "kawasaki.ninja-zx-6r.zx600g", "ZX600G", "Ninja ZX-6R ZX600G", 1998, 1999),
        v("j", "kawasaki.ninja-zx-6r.j", "ZX600J", "Ninja ZX-6R 2000", 2000, 2002),
        v("a", "kawasaki.ninja-zx-6r.a", "ZX636A", "Ninja ZX-6R 636 2002", 2002, 2002),
        v("b", "kawasaki.ninja-zx-6r.b", "ZX636B", "Ninja ZX-6R 2003", 2003, 2004),
        v("c", "kawasaki.ninja-zx-6r.c", "ZX636C", "Ninja ZX-6R 2005", 2005, 2006),
        v("p", "kawasaki.ninja-zx-6r.p", "ZX600P", "Ninja ZX-6R 2007", 2007, 2008),
        v("r", "kawasaki.ninja-zx-6r.r", "ZX600R", "Ninja ZX-6R 2009", 2009, 2012),
        v("e-f", "kawasaki.ninja-zx-6r.e-f", "ZX636E/F", "Ninja ZX-6R 2013", 2013, 2016),
        v("g", "kawasaki.ninja-zx-6r.g", "ZX636G", "Ninja ZX-6R 2019", 2019, 2020),
        v("j-2024", "kawasaki.ninja-zx-6r.j-2024", "ZX636J", "Ninja ZX-6R 2024", 2024, 2025)
      ]),
      m("ninja-zx-10r", "Ninja ZX-10R", [
        v("c", "kawasaki.ninja-zx-10r.c", "C1/C2", "Ninja ZX-10R 2004", 2004, 2005),
        v("d", "kawasaki.ninja-zx-10r.d", "D6F/D7F", "Ninja ZX-10R 2006", 2006, 2007),
        v("e", "kawasaki.ninja-zx-10r.e", "E8F/E9F", "Ninja ZX-10R 2008", 2008, 2010),
        v("j-k", "kawasaki.ninja-zx-10r.j-k", "J/K", "Ninja ZX-10R 2011", 2011, 2015),
        v("s", "kawasaki.ninja-zx-10r.s", "S", "Ninja ZX-10R 2016", 2016, 2020),
        v("2021", "kawasaki.ninja-zx-10r.2021", "2021", "Ninja ZX-10R 2021", 2021, 2025)
      ]),
      m("z750", "Z750", [
        v("gen1", "kawasaki.z750.gen1", "I generacja", "Z750 2004", 2004, 2006),
        v("gen2", "kawasaki.z750.gen2", "II generacja", "Z750 2007", 2007, 2012)
      ]),
      m("z800", "Z800", [v("gen1", "kawasaki.z800.gen1", "ZR800A", "Z800", 2013, 2016)]),
      m("z900", "Z900", [
        v("gen1", "kawasaki.z900.gen1", "I generacja", "Z900 2017", 2017, 2019),
        v("gen2", "kawasaki.z900.gen2", "II generacja", "Z900 2020", 2020, 2024),
        v("gen3", "kawasaki.z900.gen3", "III generacja", "Z900 2025", 2025, 2025)
      ]),
      m("er-6", "ER-6", [
        v("n1", "kawasaki.er-6.n1", "ER-6n — I", "ER-6n 2006", 2006, 2008),
        v("f1", "kawasaki.er-6.f1", "ER-6f — I", "ER-6f 2006", 2006, 2008),
        v("n2", "kawasaki.er-6.n2", "ER-6n — II", "ER-6n 2009", 2009, 2011),
        v("f2", "kawasaki.er-6.f2", "ER-6f — II", "ER-6f 2009", 2009, 2011),
        v("n3", "kawasaki.er-6.n3", "ER-6n — III", "ER-6n 2012", 2012, 2016),
        v("f3", "kawasaki.er-6.f3", "ER-6f — III", "ER-6f 2012", 2012, 2016)
      ]),
      m("versys-650", "Versys 650", [
        v("gen1", "kawasaki.versys-650.gen1", "I generacja", "Versys 650 2007", 2007, 2009),
        v("gen2", "kawasaki.versys-650.gen2", "II generacja", "Versys 650 2010", 2010, 2014),
        v("gen3", "kawasaki.versys-650.gen3", "III generacja", "Versys 650 2015", 2015, 2021),
        v("gen4", "kawasaki.versys-650.gen4", "IV generacja", "Versys 650 2022", 2022, 2025)
      ])
    ]
  },
  {
    id: "bmw", name: "BMW", models: [
      // Source: BMW Motorrad GS History oraz oficjalne materiały
      // modelowe: K25 facelift MY2008, DOHC MY2010, K50 MY2013
      // i aktualizacja K50 MY2017.
      m("gs-boxer", "GS Boxer", [
        v("r1100", "bmw.r1100gs", "R 1100 GS", "R 1100 GS", 1994, 1999),
        v("r1150", "bmw.r1150gs", "R 1150 GS", "R 1150 GS", 1999, 2004),
        v("r1200-k25-1", "bmw.r1200gs.k25.gen1", "R 1200 GS K25 — I", "R 1200 GS K25 2004", 2004, 2007),
        v("r1200-k25-2", "bmw.r1200gs.k25.facelift", "R 1200 GS K25 — II", "R 1200 GS K25 2008", 2008, 2009),
        v("r1200-k25-dohc", "bmw.r1200gs.k25.dohc", "R 1200 GS K25 DOHC", "R 1200 GS K25 DOHC", 2010, 2012),
        v("r1200-k50-1", "bmw.r1200gs.k50.gen1", "R 1200 GS K50 — I", "R 1200 GS K50 2013", 2013, 2016),
        v("r1200-k50-2", "bmw.r1200gs.k50.gen2", "R 1200 GS K50 — II", "R 1200 GS K50 2017", 2017, 2018),
        v("r1250", "bmw.r1250gs", "R 1250 GS", "R 1250 GS", 2019, 2023),
        v("r1300", "bmw.r1300gs", "R 1300 GS", "R 1300 GS", 2024, 2025)
      ]),
      m("f-gs", "F GS", [
        v("f650-single", "bmw.f-gs.f650-single", "F 650 GS Single", "F 650 GS Single", 2000, 2007),
        v("f650-twin", "bmw.f-gs.f650-twin", "F 650 GS Twin", "F 650 GS Twin", 2008, 2012),
        v("f700", "bmw.f-gs.f700", "F 700 GS", "F 700 GS", 2013, 2018),
        v("f800-1", "bmw.f-gs.f800-1", "F 800 GS — I", "F 800 GS 2008", 2008, 2012),
        v("f800-2", "bmw.f-gs.f800-2", "F 800 GS — II", "F 800 GS 2013", 2013, 2018),
        v("f850", "bmw.f-gs.f850", "F 850 GS", "F 850 GS", 2018, 2023),
        v("f900", "bmw.f-gs.f900", "F 900 GS", "F 900 GS", 2024, 2025)
      ]),
      m("s1000rr", "S 1000 RR", [
        v("gen1", "bmw.s1000rr.gen1", "I generacja", "S 1000 RR 2009", 2009, 2014),
        v("gen2", "bmw.s1000rr.gen2", "II generacja", "S 1000 RR 2015", 2015, 2018),
        v("gen3", "bmw.s1000rr.gen3", "III generacja", "S 1000 RR 2019", 2019, 2022),
        v("gen3-fl", "bmw.s1000rr.gen3-fl", "III generacja — facelift", "S 1000 RR 2023", 2023, 2025)
      ]),
      m("r-ninet", "R nineT", [
        v("gen1", "bmw.r-ninet.gen1", "I generacja", "R nineT 2014", 2014, 2016),
        v("euro4", "bmw.r-ninet.euro4", "Euro 4", "R nineT 2017", 2017, 2020),
        v("euro5", "bmw.r-ninet.euro5", "Euro 5", "R nineT 2021", 2021, 2023),
        v("r12", "bmw.r-ninet.r12", "R 12 nineT", "R 12 nineT", 2024, 2025)
      ]),
      m("rt-boxer", "RT Boxer", [
        v("r1100", "bmw.rt-boxer.r1100", "R 1100 RT", "R 1100 RT", 1996, 2001),
        v("r1150", "bmw.rt-boxer.r1150", "R 1150 RT", "R 1150 RT", 2001, 2004),
        v("r1200-k26", "bmw.rt-boxer.r1200-k26", "R 1200 RT K26", "R 1200 RT K26", 2005, 2013),
        v("r1200-k52", "bmw.rt-boxer.r1200-k52", "R 1200 RT K52", "R 1200 RT K52", 2014, 2018),
        v("r1250", "bmw.rt-boxer.r1250", "R 1250 RT", "R 1250 RT", 2019, 2025)
      ])
    ]
  },
  {
    id: "ducati", name: "Ducati", models: [
      m("monster", "Monster", [
        v("m900", "ducati.monster.m900", "M900", "Monster M900", 1993, 2002),
        // Source: Ducati Monster Chronology — M600 od 1995.
        v("m600", "ducati.monster.m600", "M600", "Monster M600", 1995, 2001),
        v("620", "ducati.monster.620", "620", "Monster 620", 2002, 2006),
        v("695", "ducati.monster.695", "695", "Monster 695", 2007, 2008),
        v("696", "ducati.monster.696", "696", "Monster 696", 2008, 2014),
        v("796", "ducati.monster.796", "796", "Monster 796", 2010, 2014),
        // Source: Ducati Monster chronology / MY2011 launch.
        v("1100", "ducati.monster.1100", "1100", "Monster 1100", 2009, 2010),
        v("1100-evo", "ducati.monster.1100-evo", "1100 EVO", "Monster 1100 EVO", 2011, 2013),
        v("821", "ducati.monster.821", "821", "Monster 821", 2014, 2020),
        v("1200", "ducati.monster.1200", "1200", "Monster 1200", 2014, 2021),
        v("937", "ducati.monster.937", "937", "Monster 937", 2021, 2025)
      ]),
      m("multistrada", "Multistrada", [
        v("1000", "ducati.multistrada.1000", "1000", "Multistrada 1000", 2003, 2006),
        v("1100", "ducati.multistrada.1100", "1100", "Multistrada 1100", 2007, 2009),
        v("1200-1", "ducati.multistrada.1200-1", "1200 — I", "Multistrada 1200 2010", 2010, 2014),
        v("1200-dvt", "ducati.multistrada.1200-dvt", "1200 DVT", "Multistrada 1200 DVT", 2015, 2017),
        v("1260", "ducati.multistrada.1260", "1260", "Multistrada 1260", 2018, 2020),
        v("v4-1", "ducati.multistrada.v4-1", "V4", "Multistrada V4 2021", 2021, 2024),
        v("v4-2", "ducati.multistrada.v4-2", "V4 — 2025", "Multistrada V4 2025", 2025, 2025)
      ]),
      m("panigale", "Panigale", [
        v("899", "ducati.panigale.899", "899", "Panigale 899", 2013, 2015),
        v("959", "ducati.panigale.959", "959", "Panigale 959", 2016, 2019),
        v("1199", "ducati.panigale.1199", "1199", "Panigale 1199", 2012, 2014),
        v("1299", "ducati.panigale.1299", "1299", "Panigale 1299", 2015, 2017),
        v("v2-1", "ducati.panigale.v2-1", "V2", "Panigale V2 2020", 2020, 2024),
        v("v2-2", "ducati.panigale.v2-2", "V2 — II", "Panigale V2 2025", 2025, 2025),
        v("v4-1", "ducati.panigale.v4-1", "V4 — I", "Panigale V4 2018", 2018, 2024),
        v("v4-2", "ducati.panigale.v4-2", "V4 — II", "Panigale V4 2025", 2025, 2025)
      ]),
      m("scrambler", "Scrambler", [
        v("icon-1", "ducati.scrambler.icon-1", "Icon — I", "Scrambler Icon 2015", 2015, 2022),
        v("icon-2", "ducati.scrambler.icon-2", "Icon — II", "Scrambler Icon 2023", 2023, 2025),
        v("desert-sled", "ducati.scrambler.desert-sled", "Desert Sled", "Scrambler Desert Sled", 2017, 2022)
      ]),
      m("diavel", "Diavel", [
        v("1200", "ducati.diavel.1200", "1200", "Diavel 1200", 2011, 2018),
        v("1260", "ducati.diavel.1260", "1260", "Diavel 1260", 2019, 2022),
        v("v4", "ducati.diavel.v4", "V4", "Diavel V4", 2023, 2025)
      ])
    ]
  },
  {
    id: "triumph", name: "Triumph", models: [
      // Source: Triumph MY2013 Owner's Handbook. MY2013 rozpoczyna
      // kolejną iterację 675; MY2012 należy do wcześniejszej.
      m("street-triple", "Street Triple", [
        v("675-1", "triumph.street-triple.675-1", "675 — I", "Street Triple 675 2007", 2007, 2012),
        v("675-2", "triumph.street-triple.675-2", "675 — II", "Street Triple 675 2013", 2013, 2016),
        v("765-1", "triumph.street-triple.765-1", "765 — I", "Street Triple 765 2017", 2017, 2019),
        v("765-2", "triumph.street-triple.765-2", "765 — II", "Street Triple 765 2020", 2020, 2022),
        v("765-3", "triumph.street-triple.765-3", "765 — III", "Street Triple 765 2023", 2023, 2025)
      ]),
      m("speed-triple", "Speed Triple", [
        v("t300", "triumph.speed-triple.t300", "T300", "Speed Triple T300", 1994, 1996),
        v("955", "triumph.speed-triple.955", "T509 / 955i", "Speed Triple 955", 1997, 2004),
        v("1050-1", "triumph.speed-triple.1050-1", "1050 — I", "Speed Triple 1050 2005", 2005, 2010),
        v("1050-2", "triumph.speed-triple.1050-2", "1050 — II", "Speed Triple 1050 2011", 2011, 2015),
        v("1050-3", "triumph.speed-triple.1050-3", "1050 — III", "Speed Triple 1050 2016", 2016, 2020),
        v("1200", "triumph.speed-triple.1200", "1200 RS / RR", "Speed Triple 1200", 2021, 2025)
      ]),
      m("tiger-middle", "Tiger 800 / 900", [
        v("800-1", "triumph.tiger-middle.800-1", "Tiger 800 — I", "Tiger 800 2011", 2011, 2014),
        v("800-2", "triumph.tiger-middle.800-2", "Tiger 800 — II", "Tiger 800 2015", 2015, 2017),
        v("800-3", "triumph.tiger-middle.800-3", "Tiger 800 — III", "Tiger 800 2018", 2018, 2019),
        v("900-1", "triumph.tiger-middle.900-1", "Tiger 900 — I", "Tiger 900 2020", 2020, 2023),
        v("900-2", "triumph.tiger-middle.900-2", "Tiger 900 — II", "Tiger 900 2024", 2024, 2025)
      ]),
      m("tiger-1200", "Tiger 1200", [
        v("explorer-1", "triumph.tiger-1200.explorer-1", "Tiger Explorer", "Tiger Explorer 1200", 2012, 2015),
        v("explorer-2", "triumph.tiger-1200.explorer-2", "Tiger Explorer — II", "Tiger Explorer 1200 2016", 2016, 2017),
        v("1200-1", "triumph.tiger-1200.1200-1", "Tiger 1200", "Tiger 1200 2018", 2018, 2021),
        v("1200-2", "triumph.tiger-1200.1200-2", "Tiger 1200 — II", "Tiger 1200 2022", 2022, 2025)
      ]),
      m("bonneville", "Bonneville", [
        v("790", "triumph.bonneville.790", "790", "Bonneville 790", 2001, 2006),
        v("865", "triumph.bonneville.865", "865", "Bonneville 865", 2007, 2015),
        v("t100", "triumph.bonneville.t100", "T100 900", "Bonneville T100 900", 2017, 2025),
        v("t120", "triumph.bonneville.t120", "T120 1200", "Bonneville T120", 2016, 2025)
      ])
    ]
  },
  {
    id: "ktm", name: "KTM", models: [
      m("390-duke", "390 Duke", [
        v("gen1", "ktm.390-duke.gen1", "I generacja", "390 Duke 2013", 2013, 2016),
        v("gen2", "ktm.390-duke.gen2", "II generacja", "390 Duke 2017", 2017, 2023),
        v("gen3", "ktm.390-duke.gen3", "III generacja", "390 Duke 2024", 2024, 2025)
      ]),
      m("690-duke", "690 Duke", [
        v("gen3", "ktm.690-duke.gen3", "III generacja", "690 Duke 2008", 2008, 2011),
        v("gen4-1", "ktm.690-duke.gen4-1", "IV generacja", "690 Duke 2012", 2012, 2015),
        v("gen4-2", "ktm.690-duke.gen4-2", "IV generacja — facelift", "690 Duke 2016", 2016, 2019)
      ]),
      m("super-duke", "Super Duke R", [
        v("1290-1", "ktm.super-duke.1290-1", "1290 — I", "1290 Super Duke R 2014", 2014, 2016),
        v("1290-2", "ktm.super-duke.1290-2", "1290 — II", "1290 Super Duke R 2017", 2017, 2019),
        v("1290-3", "ktm.super-duke.1290-3", "1290 — III", "1290 Super Duke R 2020", 2020, 2023),
        v("1390", "ktm.super-duke.1390", "1390", "1390 Super Duke R", 2024, 2025)
      ]),
      // Source: KTM press archive and OEM Spare Parts Finder.
      // S/R nie są traktowane jako kosmetyczne wersje: różnią się
      // m.in. zawieszeniem, kołami i elementami wymagającymi serwisu.
      m("adventure-lc8", "Adventure LC8", [
        v("950", "ktm.adventure-lc8.950", "950", "950 Adventure", 2003, 2005),
        v("990", "ktm.adventure-lc8.990", "990", "990 Adventure", 2006, 2012),
        v("1190", "ktm.adventure-lc8.1190", "1190", "1190 Adventure", 2013, 2016),
        v("1190-r", "ktm.adventure-lc8.1190-r", "1190 R", "1190 Adventure R", 2013, 2016),
        v("1290-1", "ktm.adventure-lc8.1290-1", "1290 — I", "1290 Super Adventure 2015", 2015, 2016),
        v("1290-s-2", "ktm.adventure-lc8.1290-s-2", "1290 S — II", "1290 Super Adventure S 2017", 2017, 2020),
        v("1290-r-2", "ktm.adventure-lc8.1290-r-2", "1290 R — II", "1290 Super Adventure R 2017", 2017, 2020),
        v("1290-s-3", "ktm.adventure-lc8.1290-s-3", "1290 S — III", "1290 Super Adventure S 2021", 2021, 2024),
        v("1290-r-3", "ktm.adventure-lc8.1290-r-3", "1290 R — III", "1290 Super Adventure R 2021", 2021, 2024)
      ]),
      m("adventure-middle", "790 / 890 Adventure", [
        v("790-1", "ktm.adventure-middle.790-1", "790", "790 Adventure 2019", 2019, 2020),
        v("790-r-1", "ktm.adventure-middle.790-r-1", "790 R", "790 Adventure R 2019", 2019, 2020),
        v("790-2", "ktm.adventure-middle.790-2", "790 — powrót", "790 Adventure 2023", 2023, 2024),
        v("890-1", "ktm.adventure-middle.890-1", "890", "890 Adventure 2021", 2021, 2024),
        v("890-r-1", "ktm.adventure-middle.890-r-1", "890 R", "890 Adventure R 2021", 2021, 2024),
        v("890-r-2", "ktm.adventure-middle.890-r-2", "890 R — 2025", "890 Adventure R 2025", 2025, 2025)
      ])
    ]
  },
  {
    id: "aprilia", name: "Aprilia", models: [
      m("rsv", "RSV", [
        v("mille", "aprilia.rsv.mille", "RSV Mille", "RSV Mille", 1998, 2003),
        v("1000r", "aprilia.rsv.1000r", "RSV 1000 R", "RSV 1000 R", 2004, 2008),
        v("v4-1", "aprilia.rsv.v4-1", "RSV4 — I", "RSV4 2009", 2009, 2014),
        v("v4-2", "aprilia.rsv.v4-2", "RSV4 — II", "RSV4 2015", 2015, 2020),
        v("v4-3", "aprilia.rsv.v4-3", "RSV4 — III", "RSV4 2021", 2021, 2024),
        v("v4-4", "aprilia.rsv.v4-4", "RSV4 — 2025", "RSV4 2025", 2025, 2025)
      ]),
      m("tuono", "Tuono", [
        v("v2-1", "aprilia.tuono.v2-1", "1000 V2 — I", "Tuono 1000 V2 2003", 2003, 2005),
        v("v2-2", "aprilia.tuono.v2-2", "1000 V2 — II", "Tuono 1000 V2 2006", 2006, 2010),
        v("v4-1", "aprilia.tuono.v4-1", "V4 — I", "Tuono V4 2011", 2011, 2014),
        v("v4-2", "aprilia.tuono.v4-2", "V4 — II", "Tuono V4 2015", 2015, 2020),
        v("v4-3", "aprilia.tuono.v4-3", "V4 — III", "Tuono V4 2021", 2021, 2024),
        v("v4-4", "aprilia.tuono.v4-4", "V4 — 2025", "Tuono V4 2025", 2025, 2025)
      ]),
      m("rs660", "RS 660", [
        v("gen1", "aprilia.rs660.gen1", "I generacja", "RS 660 2021", 2021, 2024),
        v("gen2", "aprilia.rs660.gen2", "II generacja", "RS 660 2025", 2025, 2025)
      ]),
      m("tuono660", "Tuono 660", [
        v("gen1", "aprilia.tuono660.gen1", "I generacja", "Tuono 660 2021", 2021, 2024),
        v("gen2", "aprilia.tuono660.gen2", "II generacja", "Tuono 660 2025", 2025, 2025)
      ]),
      m("caponord", "Caponord", [
        v("etv1000", "aprilia.caponord.etv1000", "ETV 1000", "ETV 1000 Caponord", 2001, 2007),
        v("1200", "aprilia.caponord.1200", "1200", "Caponord 1200", 2013, 2017)
      ])
    ]
  }
];

/* Coverage Wave 1. Generation boundaries are documented in
   docs/catalog/global-motorcycle-catalog-wave1.md. Existing records above
   remain byte-stable for stored-garage compatibility. */
const addModels = (brandId, models) => {
  const brand = window.MotorcycleCatalogData.find(item => item.id === brandId);
  if (brand) brand.models.push(...models);
};

addModels("honda", [
  m("cb500x-nx500", "CB500X / NX500", [
    v("pc46", "honda.cb500x.pc46", "CB500X PC46", "CB500X PC46", 2013, 2015),
    v("pc59", "honda.cb500x.pc59", "CB500X PC59", "CB500X PC59", 2016, 2018),
    v("pc64-1", "honda.cb500x.pc64-1", "CB500X PC64 — I", "CB500X PC64 2019", 2019, 2021),
    v("pc64-2", "honda.cb500x.pc64-2", "CB500X PC64 — II", "CB500X PC64 2022", 2022, 2023),
    v("nx500", "honda.cb500x-nx500.nx500", "NX500", "NX500", 2024, 2025)
  ]),
  m("cbr500r", "CBR500R", [
    v("pc44", "honda.cbr500r.pc44", "PC44", "CBR500R PC44", 2013, 2015),
    v("pc57", "honda.cbr500r.pc57", "PC57", "CBR500R PC57", 2016, 2018),
    v("pc62-1", "honda.cbr500r.pc62-1", "PC62 — I", "CBR500R PC62 2019", 2019, 2021),
    v("pc62-2", "honda.cbr500r.pc62-2", "PC62 — II", "CBR500R PC62 2022", 2022, 2023),
    v("pc70", "honda.cbr500r.pc70", "PC70", "CBR500R PC70", 2024, 2025)
  ]),
  m("cb650", "CB650F / CB650R", [
    v("cb650f-1", "honda.cb650.cb650f-1", "CB650F — I", "CB650F 2014", 2014, 2016),
    v("cb650f-2", "honda.cb650.cb650f-2", "CB650F — II", "CB650F 2017", 2017, 2018),
    v("cb650r-1", "honda.cb650.cb650r-1", "CB650R — I", "CB650R 2019", 2019, 2020),
    v("cb650r-2", "honda.cb650.cb650r-2", "CB650R — II", "CB650R 2021", 2021, 2023),
    v("cb650r-3", "honda.cb650.cb650r-3", "CB650R — III", "CB650R 2024", 2024, 2025)
  ]),
  m("cbr650", "CBR650F / CBR650R", [
    v("cbr650f-1", "honda.cbr650.cbr650f-1", "CBR650F — I", "CBR650F 2014", 2014, 2016),
    v("cbr650f-2", "honda.cbr650.cbr650f-2", "CBR650F — II", "CBR650F 2017", 2017, 2018),
    v("cbr650r-1", "honda.cbr650.cbr650r-1", "CBR650R — I", "CBR650R 2019", 2019, 2020),
    v("cbr650r-2", "honda.cbr650.cbr650r-2", "CBR650R — II", "CBR650R 2021", 2021, 2023),
    v("cbr650r-3", "honda.cbr650.cbr650r-3", "CBR650R — III", "CBR650R 2024", 2024, 2025)
  ]),
  m("hornet", "Hornet", [
    v("cb600f-pc34", "honda.hornet.cb600f-pc34", "CB600F PC34", "CB600F Hornet PC34", 1998, 2002),
    v("cb600f-pc36", "honda.hornet.cb600f-pc36", "CB600F PC36", "CB600F Hornet PC36", 2003, 2006),
    v("cb600f-pc41-1", "honda.hornet.cb600f-pc41-1", "CB600F PC41 — I", "CB600F Hornet PC41 2007", 2007, 2010),
    v("cb600f-pc41-2", "honda.hornet.cb600f-pc41-2", "CB600F PC41 — II", "CB600F Hornet PC41 2011", 2011, 2013),
    v("cb750", "honda.hornet.cb750", "CB750 Hornet", "CB750 Hornet", 2023, 2024),
    v("cb750-2", "honda.hornet.cb750-2", "CB750 Hornet — II", "CB750 Hornet 2025", 2025, 2025),
    v("cb900f", "honda.hornet.cb900f", "CB900F SC48", "CB900F Hornet", 2002, 2007),
    v("cb1000", "honda.hornet.cb1000", "CB1000 Hornet", "CB1000 Hornet", 2025, 2025)
  ]),
  m("cb1000r", "CB1000R", [
    v("sc60-1", "honda.cb1000r.sc60-1", "SC60 — I", "CB1000R SC60 2008", 2008, 2010),
    v("sc60-2", "honda.cb1000r.sc60-2", "SC60 — II", "CB1000R SC60 2011", 2011, 2017),
    v("sc80-1", "honda.cb1000r.sc80-1", "SC80 — I", "CB1000R SC80 2018", 2018, 2020),
    v("sc80-2", "honda.cb1000r.sc80-2", "SC80 — II", "CB1000R SC80 2021", 2021, 2024)
  ]),
  m("vfr1200f", "VFR1200F", [
    v("sc63-1", "honda.vfr1200f.sc63-1", "SC63 — I", "VFR1200F 2010", 2010, 2011),
    v("sc63-2", "honda.vfr1200f.sc63-2", "SC63 — II", "VFR1200F 2012", 2012, 2016)
  ]),
  m("crosstourer", "VFR1200X Crosstourer", [
    v("sc70-1", "honda.crosstourer.sc70-1", "SC70 — I", "VFR1200X Crosstourer 2012", 2012, 2015),
    v("sc70-2", "honda.crosstourer.sc70-2", "SC70 — II", "VFR1200X Crosstourer 2016", 2016, 2020)
  ]),
  m("pan-european", "Pan European", [
    v("st1100", "honda.pan-european.st1100", "ST1100", "ST1100 Pan European", 1990, 2001),
    v("st1300", "honda.pan-european.st1300", "ST1300", "ST1300 Pan European", 2002, 2016)
  ]),
  m("gold-wing", "Gold Wing", [
    v("gl1500", "honda.gold-wing.gl1500", "GL1500", "Gold Wing GL1500", 1990, 2000),
    v("gl1800-sc47", "honda.gold-wing.gl1800-sc47", "GL1800 SC47", "Gold Wing GL1800 SC47", 2001, 2011),
    v("gl1800-sc68", "honda.gold-wing.gl1800-sc68", "GL1800 SC68", "Gold Wing GL1800 SC68", 2012, 2017),
    v("gl1800-sc79-1", "honda.gold-wing.gl1800-sc79-1", "GL1800 SC79 — I", "Gold Wing GL1800 2018", 2018, 2020),
    v("gl1800-sc79-2", "honda.gold-wing.gl1800-sc79-2", "GL1800 SC79 — II", "Gold Wing GL1800 2021", 2021, 2025)
  ]),
  m("rebel", "Rebel", [
    v("cmx500-1", "honda.rebel.cmx500-1", "CMX500 — I", "CMX500 Rebel 2017", 2017, 2019),
    v("cmx500-2", "honda.rebel.cmx500-2", "CMX500 — II", "CMX500 Rebel 2020", 2020, 2024),
    v("cmx500-3", "honda.rebel.cmx500-3", "CMX500 — III", "CMX500 Rebel 2025", 2025, 2025),
    v("cmx1100-1", "honda.rebel.cmx1100-1", "CMX1100 — I", "CMX1100 Rebel 2021", 2021, 2024),
    v("cmx1100-2", "honda.rebel.cmx1100-2", "CMX1100 — II", "CMX1100 Rebel 2025", 2025, 2025)
  ]),
  m("nc700x", "NC700X", [v("rc63", "honda.nc700x.rc63", "RC63", "NC700X RC63", 2012, 2013)]),
  m("x-adv", "X-ADV", [
    v("rc95-1", "honda.x-adv.rc95-1", "RC95 — I", "X-ADV 2017", 2017, 2020),
    v("rh10-1", "honda.x-adv.rh10-1", "RH10 — I", "X-ADV 2021", 2021, 2024),
    v("rh10-2", "honda.x-adv.rh10-2", "RH10 — II", "X-ADV 2025", 2025, 2025)
  ]),
  m("nt1100", "NT1100", [v("sc84-1", "honda.nt1100.sc84-1", "SC84 — I", "NT1100 2022", 2022, 2024), v("sc84-2", "honda.nt1100.sc84-2", "SC84 — II", "NT1100 2025", 2025, 2025)])
]);

addModels("yamaha", [
  m("yzf-r6", "YZF-R6", [
    v("rj03", "yamaha.yzf-r6.rj03", "RJ03", "YZF-R6 RJ03", 1999, 2002),
    v("rj05", "yamaha.yzf-r6.rj05", "RJ05", "YZF-R6 RJ05", 2003, 2004),
    v("rj095", "yamaha.yzf-r6.rj095", "RJ095", "YZF-R6 RJ095", 2005, 2005),
    v("rj11", "yamaha.yzf-r6.rj11", "RJ11", "YZF-R6 RJ11", 2006, 2007),
    v("rj15", "yamaha.yzf-r6.rj15", "RJ15", "YZF-R6 RJ15", 2008, 2016),
    v("rj27", "yamaha.yzf-r6.rj27", "RJ27", "YZF-R6 RJ27", 2017, 2020)
  ]),
  m("yzf-r7", "YZF-R7", [v("rm39", "yamaha.yzf-r7.rm39", "RM39", "YZF-R7", 2022, 2025)]),
  m("yzf-r3-mt03", "YZF-R3 / MT-03", [
    v("r3-rh07", "yamaha.yzf-r3-mt03.r3-rh07", "YZF-R3 RH07", "YZF-R3 2015", 2015, 2018),
    v("r3-rh12", "yamaha.yzf-r3-mt03.r3-rh12", "YZF-R3 RH12", "YZF-R3 2019", 2019, 2024),
    v("r3-2025", "yamaha.yzf-r3-mt03.r3-2025", "YZF-R3 — 2025", "YZF-R3 2025", 2025, 2025),
    v("mt03-rh07", "yamaha.yzf-r3-mt03.mt03-rh07", "MT-03 RH07", "MT-03 2016", 2016, 2019),
    v("mt03-rh12", "yamaha.yzf-r3-mt03.mt03-rh12", "MT-03 RH12", "MT-03 2020", 2020, 2024),
    v("mt03-2025", "yamaha.yzf-r3-mt03.mt03-2025", "MT-03 — 2025", "MT-03 2025", 2025, 2025)
  ]),
  m("mt-10", "MT-10", [v("gen1", "yamaha.mt-10.gen1", "I generacja", "MT-10 2016", 2016, 2021), v("gen2", "yamaha.mt-10.gen2", "II generacja", "MT-10 2022", 2022, 2025)]),
  m("xsr700", "XSR700", [v("gen1", "yamaha.xsr700.gen1", "I generacja", "XSR700 2016", 2016, 2021), v("gen2", "yamaha.xsr700.gen2", "II generacja", "XSR700 2022", 2022, 2025)]),
  m("xsr900", "XSR900", [v("gen1", "yamaha.xsr900.gen1", "I generacja", "XSR900 2016", 2016, 2021), v("gen2", "yamaha.xsr900.gen2", "II generacja", "XSR900 2022", 2022, 2024), v("gen2-2025", "yamaha.xsr900.gen2-2025", "II generacja — 2025", "XSR900 2025", 2025, 2025)]),
  m("fjr1300", "FJR1300", [
    v("rp04", "yamaha.fjr1300.rp04", "RP04", "FJR1300 RP04", 2001, 2002),
    v("rp08", "yamaha.fjr1300.rp08", "RP08", "FJR1300 RP08", 2003, 2005),
    v("rp13", "yamaha.fjr1300.rp13", "RP13", "FJR1300 RP13", 2006, 2012),
    v("rp23-1", "yamaha.fjr1300.rp23-1", "RP23 — I", "FJR1300 RP23 2013", 2013, 2015),
    v("rp23-2", "yamaha.fjr1300.rp23-2", "RP23 — II", "FJR1300 RP23 2016", 2016, 2020)
  ]),
  m("tdm", "TDM", [v("tdm850-1", "yamaha.tdm.850-1", "TDM850 3VD", "TDM850 3VD", 1991, 1995), v("tdm850-2", "yamaha.tdm.850-2", "TDM850 4TX", "TDM850 4TX", 1996, 2001), v("tdm900", "yamaha.tdm.900", "TDM900", "TDM900", 2002, 2013)]),
  m("xj6", "XJ6", [v("n", "yamaha.xj6.n", "N", "XJ6-N", 2009, 2016), v("diversion", "yamaha.xj6.diversion", "Diversion", "XJ6 Diversion", 2009, 2016), v("diversion-f", "yamaha.xj6.diversion-f", "Diversion F", "XJ6 Diversion F", 2010, 2016)]),
  m("super-tenere", "XT1200Z Super Ténéré", [v("gen1", "yamaha.super-tenere.gen1", "I generacja", "XT1200Z Super Tenere 2010", 2010, 2013), v("gen2", "yamaha.super-tenere.gen2", "II generacja", "XT1200Z Super Tenere 2014", 2014, 2020)])
]);

addModels("suzuki", [
  m("gsx-r600", "GSX-R600", [
    v("srad", "suzuki.gsx-r600.srad", "SRAD", "GSX-R600 SRAD", 1997, 2000), v("k1", "suzuki.gsx-r600.k1", "K1–K3", "GSX-R600 K1", 2001, 2003),
    v("k4", "suzuki.gsx-r600.k4", "K4–K5", "GSX-R600 K4", 2004, 2005), v("k6", "suzuki.gsx-r600.k6", "K6–K7", "GSX-R600 K6", 2006, 2007),
    v("k8", "suzuki.gsx-r600.k8", "K8–L0", "GSX-R600 K8", 2008, 2010), v("l1", "suzuki.gsx-r600.l1", "L1", "GSX-R600 L1", 2011, 2017)
  ]),
  m("gsx-s750", "GSX-S750", [v("gen1", "suzuki.gsx-s750.gen1", "I generacja", "GSX-S750 2017", 2017, 2020), v("euro5", "suzuki.gsx-s750.euro5", "Euro 5", "GSX-S750 2021", 2021, 2022)]),
  m("gsx-s1000", "GSX-S1000", [v("gen1", "suzuki.gsx-s1000.gen1", "I generacja", "GSX-S1000 2015", 2015, 2020), v("gen2", "suzuki.gsx-s1000.gen2", "II generacja", "GSX-S1000 2021", 2021, 2024), v("gen2-2025", "suzuki.gsx-s1000.gen2-2025", "II generacja — 2025", "GSX-S1000 2025", 2025, 2025)]),
  m("gsx-s1000gt", "GSX-S1000GT", [v("gen1", "suzuki.gsx-s1000gt.gen1", "I generacja", "GSX-S1000GT", 2022, 2025)]),
  m("gsx-8", "GSX-8", [v("8s", "suzuki.gsx-8.8s", "GSX-8S", "GSX-8S", 2023, 2025), v("8r", "suzuki.gsx-8.8r", "GSX-8R", "GSX-8R", 2024, 2025)]),
  m("v-strom-800", "V-Strom 800", [v("de", "suzuki.v-strom-800.de", "800DE", "V-Strom 800DE", 2023, 2025), v("re", "suzuki.v-strom-800.re", "800RE", "V-Strom 800RE", 2024, 2025)]),
  m("bandit", "Bandit", [
    v("600-1", "suzuki.bandit.600-1", "GSF600 — I", "Bandit 600 1995", 1995, 1999), v("600-2", "suzuki.bandit.600-2", "GSF600 — II", "Bandit 600 2000", 2000, 2004),
    v("650-1", "suzuki.bandit.650-1", "GSF650 — I", "Bandit 650 2005", 2005, 2006), v("650-2", "suzuki.bandit.650-2", "GSF650 — II", "Bandit 650 2007", 2007, 2016),
    v("1200-1", "suzuki.bandit.1200-1", "GSF1200 — I", "Bandit 1200 1996", 1996, 2000), v("1200-2", "suzuki.bandit.1200-2", "GSF1200 — II", "Bandit 1200 2001", 2001, 2006),
    v("1250", "suzuki.bandit.1250", "GSF1250", "Bandit 1250", 2007, 2016)
  ]),
  m("gsr", "GSR", [v("600", "suzuki.gsr.600", "GSR600", "GSR600", 2006, 2011), v("750", "suzuki.gsr.750", "GSR750", "GSR750", 2011, 2016)]),
  m("sv1000", "SV1000", [v("n", "suzuki.sv1000.n", "N", "SV1000", 2003, 2007), v("s", "suzuki.sv1000.s", "S", "SV1000S", 2003, 2007)]),
  m("katana", "Katana", [v("gsx1100", "suzuki.katana.gsx1100", "GSX1100S", "GSX1100S Katana", 1990, 2001), v("gen2", "suzuki.katana.gen2", "1000 — I", "Katana 1000 2019", 2019, 2020), v("gen2-e5", "suzuki.katana.gen2-e5", "1000 — II", "Katana 1000 2022", 2022, 2025)])
]);

addModels("kawasaki", [
  m("ninja-250-500", "Ninja 250 / 300 / 400 / 500", [
    v("250-ex250j", "kawasaki.ninja-250-500.250-ex250j", "Ninja 250 EX250J", "Ninja 250R", 2008, 2012),
    v("300-ex300a", "kawasaki.ninja-250-500.300-ex300a", "Ninja 300 EX300A", "Ninja 300", 2013, 2017),
    v("400-ex400g", "kawasaki.ninja-250-500.400-ex400g", "Ninja 400 EX400G", "Ninja 400", 2018, 2023),
    v("500-ex500g", "kawasaki.ninja-250-500.500-ex500g", "Ninja 500 EX500G", "Ninja 500", 2024, 2025)
  ]),
  m("ninja-650", "Ninja 650", [v("gen1", "kawasaki.ninja-650.gen1", "I generacja", "Ninja 650 2017", 2017, 2019), v("gen2", "kawasaki.ninja-650.gen2", "II generacja", "Ninja 650 2020", 2020, 2022), v("gen3", "kawasaki.ninja-650.gen3", "III generacja", "Ninja 650 2023", 2023, 2025)]),
  m("ninja-zx-4r", "Ninja ZX-4R", [v("zx400p", "kawasaki.ninja-zx-4r.zx400p", "ZX400P", "Ninja ZX-4R", 2023, 2025), v("zx400s", "kawasaki.ninja-zx-4r.zx400s", "ZX400S RR", "Ninja ZX-4RR", 2023, 2025)]),
  m("z-small", "Z300 / Z400 / Z500", [v("z300", "kawasaki.z-small.z300", "Z300", "Z300", 2015, 2018), v("z400", "kawasaki.z-small.z400", "Z400", "Z400", 2019, 2023), v("z500", "kawasaki.z-small.z500", "Z500", "Z500", 2024, 2025)]),
  m("z650", "Z650", [v("gen1", "kawasaki.z650.gen1", "I generacja", "Z650 2017", 2017, 2019), v("gen2", "kawasaki.z650.gen2", "II generacja", "Z650 2020", 2020, 2022), v("gen3", "kawasaki.z650.gen3", "III generacja", "Z650 2023", 2023, 2025)]),
  m("z1000", "Z1000", [v("gen1", "kawasaki.z1000.gen1", "I generacja", "Z1000 2003", 2003, 2006), v("gen2", "kawasaki.z1000.gen2", "II generacja", "Z1000 2007", 2007, 2009), v("gen3", "kawasaki.z1000.gen3", "III generacja", "Z1000 2010", 2010, 2013), v("gen4", "kawasaki.z1000.gen4", "IV generacja", "Z1000 2014", 2014, 2020)]),
  m("h2", "H2", [v("ninja", "kawasaki.h2.ninja", "Ninja H2", "Ninja H2", 2015, 2025), v("sx-1", "kawasaki.h2.sx-1", "Ninja H2 SX — I", "Ninja H2 SX 2018", 2018, 2021), v("sx-2", "kawasaki.h2.sx-2", "Ninja H2 SX — II", "Ninja H2 SX 2022", 2022, 2025), v("z", "kawasaki.h2.z", "Z H2", "Z H2", 2020, 2025)]),
  m("versys-1000-1100", "Versys 1000 / 1100", [v("gen1", "kawasaki.versys-1000-1100.gen1", "1000 — I", "Versys 1000 2012", 2012, 2014), v("gen2", "kawasaki.versys-1000-1100.gen2", "1000 — II", "Versys 1000 2015", 2015, 2018), v("gen3", "kawasaki.versys-1000-1100.gen3", "1000 — III", "Versys 1000 2019", 2019, 2024), v("1100", "kawasaki.versys-1000-1100.1100", "1100", "Versys 1100", 2025, 2025)]),
  m("vulcan-s", "Vulcan S", [v("gen1", "kawasaki.vulcan-s.gen1", "I generacja", "Vulcan S", 2015, 2021), v("gen2", "kawasaki.vulcan-s.gen2", "II generacja", "Vulcan S 2022", 2022, 2025)]),
  m("gtr1400", "1400GTR", [v("gen1", "kawasaki.gtr1400.gen1", "I generacja", "1400GTR 2007", 2007, 2009), v("gen2", "kawasaki.gtr1400.gen2", "II generacja", "1400GTR 2010", 2010, 2017)])
]);

addModels("bmw", [
  m("g310", "G 310", [v("r-1", "bmw.g310.r-1", "G 310 R — I", "G 310 R 2017", 2017, 2020), v("r-2", "bmw.g310.r-2", "G 310 R — II", "G 310 R 2021", 2021, 2025), v("gs-1", "bmw.g310.gs-1", "G 310 GS — I", "G 310 GS 2017", 2017, 2020), v("gs-2", "bmw.g310.gs-2", "G 310 GS — II", "G 310 GS 2021", 2021, 2025)]),
  m("f-roadster-xr", "F Roadster / XR", [v("f800r-1", "bmw.f-roadster-xr.f800r-1", "F 800 R — I", "F 800 R 2009", 2009, 2014), v("f800r-2", "bmw.f-roadster-xr.f800r-2", "F 800 R — II", "F 800 R 2015", 2015, 2019), v("f900r-1", "bmw.f-roadster-xr.f900r-1", "F 900 R — I", "F 900 R 2020", 2020, 2024), v("f900r-2", "bmw.f-roadster-xr.f900r-2", "F 900 R — II", "F 900 R 2025", 2025, 2025), v("f900xr-1", "bmw.f-roadster-xr.f900xr-1", "F 900 XR — I", "F 900 XR 2020", 2020, 2024), v("f900xr-2", "bmw.f-roadster-xr.f900xr-2", "F 900 XR — II", "F 900 XR 2025", 2025, 2025)]),
  m("s1000r-xr", "S 1000 R / XR", [v("r-1", "bmw.s1000r-xr.r-1", "S 1000 R — I", "S 1000 R 2014", 2014, 2016), v("r-2", "bmw.s1000r-xr.r-2", "S 1000 R — II", "S 1000 R 2017", 2017, 2020), v("r-3", "bmw.s1000r-xr.r-3", "S 1000 R — III", "S 1000 R 2021", 2021, 2024), v("r-4", "bmw.s1000r-xr.r-4", "S 1000 R — IV", "S 1000 R 2025", 2025, 2025), v("xr-1", "bmw.s1000r-xr.xr-1", "S 1000 XR — I", "S 1000 XR 2015", 2015, 2019), v("xr-2", "bmw.s1000r-xr.xr-2", "S 1000 XR — II", "S 1000 XR 2020", 2020, 2023), v("xr-3", "bmw.s1000r-xr.xr-3", "S 1000 XR — III", "S 1000 XR 2024", 2024, 2025)]),
  m("k1600", "K 1600", [v("gen1", "bmw.k1600.gen1", "GT / GTL — I", "K 1600 GT 2011", 2011, 2016), v("gen2", "bmw.k1600.gen2", "GT / GTL — II", "K 1600 GT 2017", 2017, 2021), v("gen3", "bmw.k1600.gen3", "GT / GTL — III", "K 1600 GT 2022", 2022, 2025)]),
  m("r18", "R 18", [v("gen1", "bmw.r18.gen1", "R 18", "R 18", 2020, 2025)])
]);

addModels("ducati", [
  m("superbike-v2", "749 / 999 / 848 / 1098 / 1198", [v("749", "ducati.superbike-v2.749", "749", "Ducati 749", 2003, 2006), v("999", "ducati.superbike-v2.999", "999", "Ducati 999", 2003, 2006), v("848", "ducati.superbike-v2.848", "848", "Ducati 848", 2008, 2013), v("1098", "ducati.superbike-v2.1098", "1098", "Ducati 1098", 2007, 2009), v("1198", "ducati.superbike-v2.1198", "1198", "Ducati 1198", 2009, 2011)]),
  m("streetfighter", "Streetfighter", [v("1098", "ducati.streetfighter.1098", "1098", "Streetfighter 1098", 2009, 2013), v("848", "ducati.streetfighter.848", "848", "Streetfighter 848", 2012, 2015), v("v4-1", "ducati.streetfighter.v4-1", "V4 — I", "Streetfighter V4 2020", 2020, 2024), v("v4-2", "ducati.streetfighter.v4-2", "V4 — II", "Streetfighter V4 2025", 2025, 2025)]),
  m("hypermotard", "Hypermotard", [v("1100", "ducati.hypermotard.1100", "1100", "Hypermotard 1100", 2007, 2012), v("821", "ducati.hypermotard.821", "821", "Hypermotard 821", 2013, 2015), v("939", "ducati.hypermotard.939", "939", "Hypermotard 939", 2016, 2018), v("950", "ducati.hypermotard.950", "950", "Hypermotard 950", 2019, 2025)]),
  m("desertx", "DesertX", [v("gen1", "ducati.desertx.gen1", "I generacja", "DesertX", 2022, 2025)])
]);

addModels("triumph", [
  m("daytona", "Daytona", [v("675-1", "triumph.daytona.675-1", "675 — I", "Daytona 675 2006", 2006, 2008), v("675-2", "triumph.daytona.675-2", "675 — II", "Daytona 675 2009", 2009, 2012), v("675-3", "triumph.daytona.675-3", "675 — III", "Daytona 675 2013", 2013, 2017), v("660", "triumph.daytona.660", "660", "Daytona 660", 2024, 2025)]),
  m("trident-tiger-sport", "Trident / Tiger Sport", [v("trident-660", "triumph.trident-tiger-sport.trident-660", "Trident 660", "Trident 660", 2021, 2025), v("tiger-sport-660", "triumph.trident-tiger-sport.tiger-sport-660", "Tiger Sport 660", "Tiger Sport 660", 2022, 2025), v("tiger-sport-800", "triumph.trident-tiger-sport.tiger-sport-800", "Tiger Sport 800", "Tiger Sport 800", 2025, 2025)]),
  m("rocket", "Rocket", [v("iii-1", "triumph.rocket.iii-1", "Rocket III — I", "Rocket III 2004", 2004, 2009), v("iii-2", "triumph.rocket.iii-2", "Rocket III — II", "Rocket III 2010", 2010, 2018), v("3", "triumph.rocket.3", "Rocket 3", "Rocket 3", 2020, 2025)]),
  m("scrambler", "Scrambler", [v("865", "triumph.scrambler.865", "865", "Scrambler 865", 2006, 2016), v("900", "triumph.scrambler.900", "900", "Street Scrambler 900", 2017, 2025), v("1200-1", "triumph.scrambler.1200-1", "1200 — I", "Scrambler 1200 2019", 2019, 2023), v("1200-2", "triumph.scrambler.1200-2", "1200 — II", "Scrambler 1200 2024", 2024, 2025)])
]);

addModels("ktm", [
  m("rc390", "RC 390", [v("gen1", "ktm.rc390.gen1", "I generacja", "RC 390 2014", 2014, 2016), v("gen1-fl", "ktm.rc390.gen1-fl", "I generacja — facelift", "RC 390 2017", 2017, 2021), v("gen2", "ktm.rc390.gen2", "II generacja", "RC 390 2022", 2022, 2025)]),
  m("duke-middle", "790 / 890 / 990 Duke", [v("790-1", "ktm.duke-middle.790-1", "790 — I", "790 Duke 2018", 2018, 2020), v("790-2", "ktm.duke-middle.790-2", "790 — powrót", "790 Duke 2023", 2023, 2025), v("890", "ktm.duke-middle.890", "890", "890 Duke", 2021, 2023), v("990", "ktm.duke-middle.990", "990", "990 Duke", 2024, 2025)]),
  m("690-enduro-smc", "690 Enduro R / SMC R", [v("enduro-1", "ktm.690-enduro-smc.enduro-1", "Enduro R — I", "690 Enduro R 2009", 2009, 2018), v("enduro-2", "ktm.690-enduro-smc.enduro-2", "Enduro R — II", "690 Enduro R 2019", 2019, 2025), v("smc-1", "ktm.690-enduro-smc.smc-1", "SMC R — I", "690 SMC R 2012", 2012, 2017), v("smc-2", "ktm.690-enduro-smc.smc-2", "SMC R — II", "690 SMC R 2019", 2019, 2025)]),
  m("rc8", "1190 RC8", [v("rc8", "ktm.rc8.rc8", "RC8", "1190 RC8", 2008, 2010), v("rc8-r", "ktm.rc8.rc8-r", "RC8 R", "1190 RC8 R", 2009, 2015)])
]);

addModels("aprilia", [
  m("shiver", "Shiver", [v("750", "aprilia.shiver.750", "750", "Shiver 750", 2007, 2016), v("900", "aprilia.shiver.900", "900", "Shiver 900", 2017, 2020)]),
  m("dorsoduro", "Dorsoduro", [v("750", "aprilia.dorsoduro.750", "750", "Dorsoduro 750", 2008, 2016), v("900", "aprilia.dorsoduro.900", "900", "Dorsoduro 900", 2017, 2020), v("1200", "aprilia.dorsoduro.1200", "1200", "Dorsoduro 1200", 2011, 2016)]),
  m("tuareg-660", "Tuareg 660", [v("gen1", "aprilia.tuareg-660.gen1", "I generacja", "Tuareg 660", 2022, 2025)])
]);

window.MotorcycleCatalogData.push(
  { id: "harley-davidson", name: "Harley-Davidson", models: [
    m("sportster-evolution", "Sportster Evolution", [
      v("883-rigid", "harley-davidson.sportster-evolution.883-rigid", "883 rigid-mount", "Sportster 883 1990", 1990, 2003),
      v("883-rubber-carb", "harley-davidson.sportster-evolution.883-rubber-carb", "883 rubber-mount carb", "Sportster 883 2004", 2004, 2006),
      v("883-efi", "harley-davidson.sportster-evolution.883-efi", "883 EFI", "Sportster 883 2007", 2007, 2013),
      v("883-abs", "harley-davidson.sportster-evolution.883-abs", "883 ABS", "Sportster 883 2014", 2014, 2020),
      v("1200-rigid", "harley-davidson.sportster-evolution.1200-rigid", "1200 rigid-mount", "Sportster 1200 1991", 1991, 2003),
      v("1200-rubber-carb", "harley-davidson.sportster-evolution.1200-rubber-carb", "1200 rubber-mount carb", "Sportster 1200 2004", 2004, 2006),
      v("1200-efi", "harley-davidson.sportster-evolution.1200-efi", "1200 EFI", "Sportster 1200 2007", 2007, 2013),
      v("1200-abs", "harley-davidson.sportster-evolution.1200-abs", "1200 ABS", "Sportster 1200 2014", 2014, 2020)
    ]),
    m("revolution-max", "Revolution Max", [v("pan-america", "harley-davidson.revolution-max.pan-america", "Pan America", "Pan America 1250", 2021, 2025), v("sportster-s", "harley-davidson.revolution-max.sportster-s", "Sportster S", "Sportster S", 2021, 2025), v("nightster", "harley-davidson.revolution-max.nightster", "Nightster", "Nightster", 2022, 2025)]),
    m("touring", "Touring", [v("twin-cam-1", "harley-davidson.touring.twin-cam-1", "Twin Cam — I", "Harley-Davidson Touring Twin Cam 1999", 1999, 2006), v("twin-cam-2", "harley-davidson.touring.twin-cam-2", "Twin Cam — II", "Harley-Davidson Touring Twin Cam 2007", 2007, 2013), v("twin-cam-3", "harley-davidson.touring.twin-cam-3", "Twin Cam — III", "Harley-Davidson Touring Twin Cam 2014", 2014, 2016), v("milwaukee-eight", "harley-davidson.touring.milwaukee-eight", "Milwaukee-Eight", "Harley-Davidson Touring Milwaukee-Eight", 2017, 2025)])
  ]},
  { id: "indian", name: "Indian", models: [
    m("scout", "Scout", [v("gen1", "indian.scout.gen1", "I generacja", "Indian Scout 2015", 2015, 2024), v("gen2", "indian.scout.gen2", "II generacja", "Indian Scout 2025", 2025, 2025)]),
    m("ftr", "FTR", [v("gen1", "indian.ftr.gen1", "I generacja", "Indian FTR 2019", 2019, 2020), v("gen2", "indian.ftr.gen2", "II generacja", "Indian FTR 2021", 2021, 2025)]),
    m("chief", "Chief", [v("thunder-stroke", "indian.chief.thunder-stroke", "Thunder Stroke", "Indian Chief 2014", 2014, 2021), v("gen2", "indian.chief.gen2", "II generacja", "Indian Chief 2022", 2022, 2025)])
  ]},
  { id: "moto-guzzi", name: "Moto Guzzi", models: [
    m("v7", "V7", [v("gen1", "moto-guzzi.v7.gen1", "V7 — I", "Moto Guzzi V7 2008", 2008, 2011), v("gen1-2", "moto-guzzi.v7.gen1-2", "V7 — II", "Moto Guzzi V7 2012", 2012, 2014), v("gen2", "moto-guzzi.v7.gen2", "V7 II", "Moto Guzzi V7 II", 2015, 2016), v("gen3", "moto-guzzi.v7.gen3", "V7 III", "Moto Guzzi V7 III", 2017, 2020), v("850", "moto-guzzi.v7.850", "V7 850", "Moto Guzzi V7 850", 2021, 2025)]),
    m("v85-tt", "V85 TT", [v("gen1", "moto-guzzi.v85-tt.gen1", "I generacja", "Moto Guzzi V85 TT 2019", 2019, 2023), v("gen2", "moto-guzzi.v85-tt.gen2", "II generacja", "Moto Guzzi V85 TT 2024", 2024, 2025)]),
    m("stelvio", "Stelvio", [v("1200-1", "moto-guzzi.stelvio.1200-1", "1200 — I", "Moto Guzzi Stelvio 1200 2008", 2008, 2010), v("1200-2", "moto-guzzi.stelvio.1200-2", "1200 — II", "Moto Guzzi Stelvio 1200 2011", 2011, 2016), v("v100", "moto-guzzi.stelvio.v100", "V100", "Moto Guzzi Stelvio V100", 2024, 2025)]),
    m("v100-mandello", "V100 Mandello", [v("gen1", "moto-guzzi.v100-mandello.gen1", "I generacja", "Moto Guzzi V100 Mandello", 2023, 2025)])
  ]},
  { id: "royal-enfield", name: "Royal Enfield", models: [
    m("himalayan", "Himalayan", [v("411", "royal-enfield.himalayan.411", "Himalayan 411", "Royal Enfield Himalayan 411", 2017, 2023), v("450", "royal-enfield.himalayan.450", "Himalayan 450", "Royal Enfield Himalayan 450", 2024, 2025)]),
    m("650-twins", "650 Twins", [v("interceptor", "royal-enfield.650-twins.interceptor", "Interceptor 650", "Royal Enfield Interceptor 650", 2019, 2025), v("continental-gt", "royal-enfield.650-twins.continental-gt", "Continental GT 650", "Royal Enfield Continental GT 650", 2019, 2025)]),
    m("j-series-350", "J-series 350", [v("meteor", "royal-enfield.j-series-350.meteor", "Meteor 350", "Royal Enfield Meteor 350", 2021, 2025), v("classic", "royal-enfield.j-series-350.classic", "Classic 350", "Royal Enfield Classic 350", 2022, 2025), v("hunter", "royal-enfield.j-series-350.hunter", "Hunter 350", "Royal Enfield Hunter 350", 2023, 2025)])
  ]}
);
})();
