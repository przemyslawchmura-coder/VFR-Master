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
})();
