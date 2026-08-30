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
const addVariants = (brandId, modelId, variants) => {
  const brand = window.MotorcycleCatalogData.find(item => item.id === brandId);
  const model = brand && brand.models.find(item => item.id === modelId);
  if (model) model.variants.push(...variants);
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

/* Honda Completeness Wave 2: Europe-oriented road range inventory. */
addModels("honda", [
  m("vtr", "VTR", [
    v("vtr1000f-sc36", "honda.vtr.vtr1000f-sc36", "VTR1000F SC36", "VTR1000F FireStorm", 1997, 2006),
    v("sp1-sc45", "honda.vtr.sp1-sc45", "VTR1000 SP-1 SC45", "VTR1000 SP-1", 2000, 2001),
    v("sp2-sc45", "honda.vtr.sp2-sc45", "VTR1000 SP-2 SC45", "VTR1000 SP-2", 2002, 2006)
  ]),
  m("cbr125r", "CBR125R", [
    v("jc34", "honda.cbr125r.jc34", "JC34", "CBR125R JC34", 2004, 2006),
    v("jc39", "honda.cbr125r.jc39", "JC39", "CBR125R JC39", 2007, 2010),
    v("jc50", "honda.cbr125r.jc50", "JC50", "CBR125R JC50", 2011, 2016)
  ]),
  m("cbr250-300", "CBR250R / CBR300R", [
    v("cbr250r-mc41", "honda.cbr250-300.cbr250r-mc41", "CBR250R MC41", "CBR250R MC41", 2011, 2013),
    v("cbr300r-nc51", "honda.cbr250-300.cbr300r-nc51", "CBR300R NC51", "CBR300R NC51", 2014, 2016)
  ]),
  m("cbr600f", "CBR600F", [
    v("pc25", "honda.cbr600f.pc25", "PC25", "CBR600F PC25", 1991, 1994),
    v("pc31", "honda.cbr600f.pc31", "PC31", "CBR600F PC31", 1995, 1998),
    v("pc35-carb", "honda.cbr600f.pc35-carb", "PC35 carburettor", "CBR600F PC35 1999", 1999, 2000),
    v("pc35-efi", "honda.cbr600f.pc35-efi", "PC35 PGM-FI", "CBR600F PC35 2001", 2001, 2006),
    v("pc35-sport", "honda.cbr600f.pc35-sport", "PC35 Sport", "CBR600F Sport", 2001, 2002),
    v("pc41", "honda.cbr600f.pc41", "PC41", "CBR600F PC41", 2011, 2013)
  ]),
  m("cbr1000f", "CBR1000F", [
    v("sc24-1", "honda.cbr1000f.sc24-1", "SC24 — I", "CBR1000F SC24 1990", 1990, 1992),
    v("sc24-2", "honda.cbr1000f.sc24-2", "SC24 — II Dual CBS", "CBR1000F SC24 1993", 1993, 2000)
  ]),
  m("cbr1100xx", "CBR1100XX Super Blackbird", [
    v("sc35-carb", "honda.cbr1100xx.sc35-carb", "SC35 carburettor", "CBR1100XX 1996", 1996, 1998),
    v("sc35-efi-1", "honda.cbr1100xx.sc35-efi-1", "SC35 PGM-FI — I", "CBR1100XX 1999", 1999, 2000),
    v("sc35-efi-2", "honda.cbr1100xx.sc35-efi-2", "SC35 PGM-FI — II", "CBR1100XX 2001", 2001, 2006)
  ]),
  m("vfr400r", "VFR400R", [v("nc30-eu", "honda.vfr400r.nc30-eu", "NC30 Europe", "VFR400R NC30", 1990, 1991)]),
  m("vfr750f", "VFR750F", [
    v("rc36-1", "honda.vfr750f.rc36-1", "RC36 — I", "VFR750F RC36 1990", 1990, 1993),
    v("rc36-2", "honda.vfr750f.rc36-2", "RC36 — II", "VFR750F RC36 1994", 1994, 1997)
  ]),
  m("crossrunner", "VFR800X Crossrunner", [
    v("rc60", "honda.crossrunner.rc60", "RC60", "VFR800X Crossrunner 2011", 2011, 2014),
    v("rc80", "honda.crossrunner.rc80", "RC80", "VFR800X Crossrunner 2015", 2015, 2020)
  ]),
  m("nsr125r", "NSR125R", [
    v("jc20", "honda.nsr125r.jc20", "JC20", "NSR125R JC20", 1990, 1992),
    v("jc22", "honda.nsr125r.jc22", "JC22", "NSR125R JC22", 1993, 2003)
  ]),
  m("cb500", "CB500 / CB500S", [
    v("pc26", "honda.cb500.pc26", "CB500 PC26", "CB500 PC26", 1994, 1995),
    v("pc32", "honda.cb500.pc32", "CB500 PC32", "CB500 PC32", 1996, 2003),
    v("pc32-s", "honda.cb500.pc32-s", "CB500S PC32", "CB500S PC32", 1998, 2003)
  ]),
  m("cb-seven-fifty", "CB Seven Fifty", [v("rc42", "honda.cb-seven-fifty.rc42", "RC42", "CB Seven Fifty RC42", 1992, 2003)]),
  m("cb1100", "CB1100", [
    v("sc65", "honda.cb1100.sc65", "SC65", "CB1100 2013", 2013, 2016),
    v("sc65-ex", "honda.cb1100.sc65-ex", "SC65 EX", "CB1100 EX 2014", 2014, 2016),
    v("sc78-ex", "honda.cb1100.sc78-ex", "SC78 EX", "CB1100 EX", 2017, 2020),
    v("sc78-rs", "honda.cb1100.sc78-rs", "SC78 RS", "CB1100 RS", 2017, 2020)
  ]),
  m("x-eleven", "X-Eleven", [v("sc42", "honda.x-eleven.sc42", "SC42", "X-Eleven SC42", 1999, 2003)]),
  m("cbf500", "CBF500", [v("pc39", "honda.cbf500.pc39", "PC39", "CBF500 PC39", 2004, 2008)]),
  m("cbf600", "CBF600", [
    v("pc38-n", "honda.cbf600.pc38-n", "PC38 N", "CBF600N PC38", 2004, 2007),
    v("pc38-s", "honda.cbf600.pc38-s", "PC38 S", "CBF600S PC38", 2004, 2007),
    v("pc43-n", "honda.cbf600.pc43-n", "PC43 N", "CBF600N PC43", 2008, 2013),
    v("pc43-s", "honda.cbf600.pc43-s", "PC43 S", "CBF600S PC43", 2008, 2013)
  ]),
  m("cbf1000", "CBF1000", [
    v("sc58", "honda.cbf1000.sc58", "SC58", "CBF1000 SC58", 2006, 2009),
    v("sc64", "honda.cbf1000.sc64", "SC64", "CBF1000 SC64", 2010, 2016)
  ]),
  m("cb1300", "CB1300", [
    v("sc54-n", "honda.cb1300.sc54-n", "SC54 Super Four", "CB1300 Super Four", 2003, 2009),
    v("sc54-s", "honda.cb1300.sc54-s", "SC54 Super Bol d'Or", "CB1300S Super Bol d'Or", 2005, 2013)
  ]),
  m("deauville", "Deauville", [
    v("nt650v-rc47", "honda.deauville.nt650v-rc47", "NT650V RC47", "NT650V Deauville", 1998, 2005),
    v("nt700v-rc52", "honda.deauville.nt700v-rc52", "NT700V RC52", "NT700V Deauville", 2006, 2013)
  ]),
  m("varadero", "Varadero", [
    v("xl1000v-carb", "honda.varadero.xl1000v-carb", "XL1000V carburettor", "XL1000V Varadero 1999", 1999, 2002),
    v("xl1000v-efi-1", "honda.varadero.xl1000v-efi-1", "XL1000V PGM-FI — I", "XL1000V Varadero 2003", 2003, 2006),
    v("xl1000v-efi-2", "honda.varadero.xl1000v-efi-2", "XL1000V PGM-FI — II", "XL1000V Varadero 2007", 2007, 2011),
    v("xl125v-1", "honda.varadero.xl125v-1", "XL125V — I", "XL125V Varadero 2001", 2001, 2006),
    v("xl125v-2", "honda.varadero.xl125v-2", "XL125V — II", "XL125V Varadero 2007", 2007, 2013)
  ]),
  m("nc-road", "NC700S / NC750S", [
    v("nc700s-rc61", "honda.nc-road.nc700s-rc61", "NC700S RC61", "NC700S RC61", 2012, 2013),
    v("nc750s-rc70", "honda.nc-road.nc750s-rc70", "NC750S RC70", "NC750S RC70", 2014, 2015),
    v("nc750s-rc88", "honda.nc-road.nc750s-rc88", "NC750S RC88", "NC750S RC88", 2016, 2020)
  ]),
  m("crf-trail", "CRF Road-Legal Trail", [
    v("crf250l-1", "honda.crf-trail.crf250l-1", "CRF250L — I", "CRF250L 2012", 2012, 2016),
    v("crf250l-2", "honda.crf-trail.crf250l-2", "CRF250L — II", "CRF250L 2017", 2017, 2020),
    v("crf250-rally", "honda.crf-trail.crf250-rally", "CRF250 Rally", "CRF250 Rally", 2017, 2020),
    v("crf300l-1", "honda.crf-trail.crf300l-1", "CRF300L — I", "CRF300L 2021", 2021, 2024),
    v("crf300-rally-1", "honda.crf-trail.crf300-rally-1", "CRF300 Rally — I", "CRF300 Rally 2021", 2021, 2024),
    v("crf300l-2", "honda.crf-trail.crf300l-2", "CRF300L — II", "CRF300L 2025", 2025, 2025),
    v("crf300-rally-2", "honda.crf-trail.crf300-rally-2", "CRF300 Rally — II", "CRF300 Rally 2025", 2025, 2025)
  ]),
  m("fmx650", "FMX650", [v("rd12", "honda.fmx650.rd12", "RD12", "FMX650 RD12", 2005, 2008)]),
  m("shadow", "Shadow", [
    v("vt600c-pc21", "honda.shadow.vt600c-pc21", "VT600C PC21", "VT600C Shadow", 1990, 2000),
    v("vt750c-rc44", "honda.shadow.vt750c-rc44", "VT750C RC44", "VT750C Shadow 1997", 1997, 2003),
    v("vt750c-rc50", "honda.shadow.vt750c-rc50", "VT750C RC50", "VT750C Shadow 2004", 2004, 2006),
    v("vt750c-rc53", "honda.shadow.vt750c-rc53", "VT750C RC53", "VT750C Shadow 2007", 2007, 2009),
    v("vt750c-rc58", "honda.shadow.vt750c-rc58", "VT750C RC58", "VT750C Shadow 2010", 2010, 2016),
    v("vt1100c-sc23", "honda.shadow.vt1100c-sc23", "VT1100C SC23", "VT1100C Shadow 1990", 1990, 1994),
    v("vt1100c-sc32", "honda.shadow.vt1100c-sc32", "VT1100C SC32", "VT1100C Shadow 1995", 1995, 2000),
    v("vt1300cx-sc61", "honda.shadow.vt1300cx-sc61", "VT1300CX SC61", "VT1300CX Fury", 2010, 2016)
  ]),
  m("f6c-valkyrie", "F6C Valkyrie", [
    v("sc34", "honda.f6c-valkyrie.sc34", "F6C SC34", "F6C Valkyrie SC34", 1997, 2003),
    v("sc68", "honda.f6c-valkyrie.sc68", "F6C SC68", "F6C Valkyrie SC68", 2014, 2015)
  ]),
  m("dn01", "DN-01", [v("rc55", "honda.dn01.rc55", "RC55", "DN-01", 2008, 2010)]),
  m("ctx700", "CTX700", [v("rc69", "honda.ctx700.rc69", "RC69", "CTX700", 2014, 2016)]),
  m("nm4-vultus", "NM4 Vultus", [v("rc82", "honda.nm4-vultus.rc82", "RC82", "NM4 Vultus", 2014, 2016)]),
  m("cl500", "CL500", [v("pc68", "honda.cl500.pc68", "PC68", "CL500", 2023, 2025)])
]);

addVariants("honda", "cbr-fireblade", [
  v("sc59-sp", "honda.cbr-fireblade.sc59-sp", "CBR1000RR SP SC59", "CBR1000RR SP SC59", 2014, 2016),
  v("sc77-sp", "honda.cbr-fireblade.sc77-sp", "CBR1000RR SP SC77", "CBR1000RR SP SC77", 2017, 2019),
  v("sc82-sp-1", "honda.cbr-fireblade.sc82-sp-1", "CBR1000RR-R SP SC82 — I", "CBR1000RR-R SP 2020", 2020, 2021),
  v("sc82-sp-2", "honda.cbr-fireblade.sc82-sp-2", "CBR1000RR-R SP SC82 — II", "CBR1000RR-R SP 2022", 2022, 2023),
  v("sc82-sp-3", "honda.cbr-fireblade.sc82-sp-3", "CBR1000RR-R SP SC82 — III", "CBR1000RR-R SP 2024", 2024, 2025)
]);
addVariants("honda", "africa-twin", [
  v("crf1000l-adventure-sports", "honda.africa-twin.crf1000l-adventure-sports", "CRF1000L Adventure Sports", "CRF1000L Africa Twin Adventure Sports", 2018, 2019),
  v("crf1100l-adventure-sports-1", "honda.africa-twin.crf1100l-adventure-sports-1", "CRF1100L Adventure Sports — I", "CRF1100L Africa Twin Adventure Sports 2020", 2020, 2023),
  v("crf1100l-adventure-sports-2", "honda.africa-twin.crf1100l-adventure-sports-2", "CRF1100L Adventure Sports — II", "CRF1100L Africa Twin Adventure Sports 2024", 2024, 2025)
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

/* Yamaha Completeness Wave 2: evidence-backed European road range. */
addModels("yamaha", [
  m("fzr", "FZR", [
    v("fzr600-3he", "yamaha.fzr.fzr600-3he", "FZR600 3HE", "FZR600 3HE", 1990, 1993),
    v("fzr600-4jh", "yamaha.fzr.fzr600-4jh", "FZR600R 4JH", "FZR600R 4JH", 1994, 1995),
    v("fzr750r-ow01", "yamaha.fzr.fzr750r-ow01", "FZR750R OW01", "FZR750R OW01", 1990, 1992),
    v("fzr1000-3gm-1", "yamaha.fzr.fzr1000-3gm-1", "FZR1000 EXUP 3GM — I", "FZR1000 EXUP 1990", 1990, 1991),
    v("fzr1000-3gm-2", "yamaha.fzr.fzr1000-3gm-2", "FZR1000 EXUP 3GM — II", "FZR1000 EXUP 1992", 1992, 1995)
  ]),
  m("yzf750", "YZF750", [
    v("r", "yamaha.yzf750.r", "YZF750R", "YZF750R", 1993, 1998),
    v("sp", "yamaha.yzf750.sp", "YZF750SP", "YZF750SP", 1993, 1996)
  ]),
  m("thunderace", "YZF1000R Thunderace", [v("thunderace", "yamaha.yzf-legacy-sport.thunderace", "YZF1000R Thunderace", "YZF1000R Thunderace", 1996, 2001)]),
  m("thundercat", "YZF600R Thundercat", [v("thundercat", "yamaha.yzf-legacy-sport.thundercat", "YZF600R Thundercat", "YZF600R Thundercat", 1996, 2003)]),
  m("trx850", "TRX850", [v("trx850", "yamaha.trx-szr.trx850", "TRX850", "TRX850", 1996, 2000)]),
  m("szr660", "SZR660", [v("szr660", "yamaha.trx-szr.szr660", "SZR660", "SZR660", 1996, 1998)]),
  m("yzf-r125", "YZF-R125", [
    v("re06", "yamaha.yzf-r125.re06", "RE06", "YZF-R125 2008", 2008, 2013),
    v("re11", "yamaha.yzf-r125.re11", "RE11", "YZF-R125 2014", 2014, 2018),
    v("re39", "yamaha.yzf-r125.re39", "RE39", "YZF-R125 2019", 2019, 2022),
    v("2023", "yamaha.yzf-r125.2023", "2023 generation", "YZF-R125 2023", 2023, 2025)
  ]),
  m("yzf-r9", "YZF-R9", [v("2025", "yamaha.yzf-r9.2025", "2025", "YZF-R9", 2025, 2025)]),
  m("fz750", "FZ750", [v("fz750", "yamaha.fz-fazer.fz750", "FZ750", "FZ750", 1990, 1991)]),
  m("fazer-600", "FZS600 Fazer", [
    v("fzs600-1", "yamaha.fz-fazer.fzs600-1", "FZS600 Fazer — I", "FZS600 Fazer 1998", 1998, 2001),
    v("fzs600-2", "yamaha.fz-fazer.fzs600-2", "FZS600 Fazer — II", "FZS600 Fazer 2002", 2002, 2003)
  ]),
  m("fazer-1000", "FZS1000 Fazer", [v("fzs1000", "yamaha.fz-fazer.fzs1000", "FZS1000 Fazer", "FZS1000 Fazer", 2001, 2005)]),
  m("fz8-fazer8", "FZ8 / Fazer8", [
    v("fz8", "yamaha.fz-fazer.fz8", "FZ8", "FZ8-N", 2010, 2015),
    v("fazer8", "yamaha.fz-fazer.fazer8", "Fazer8", "Fazer8", 2010, 2015)
  ]),
  m("mt-01", "MT-01", [v("mt01", "yamaha.mt-legacy.mt01", "MT-01", "MT-01", 2005, 2012)]),
  m("mt-03-660", "MT-03 660", [v("mt03-660", "yamaha.mt-legacy.mt03-660", "MT-03 660", "MT-03 660", 2006, 2014)]),
  m("mt-125", "MT-125", [
    v("mt125-1", "yamaha.mt-legacy.mt125-1", "MT-125 — I", "MT-125 2014", 2014, 2019),
    v("mt125-2", "yamaha.mt-legacy.mt125-2", "MT-125 — II", "MT-125 2020", 2020, 2024),
    v("mt125-3", "yamaha.mt-legacy.mt125-3", "MT-125 — 2025", "MT-125 2025", 2025, 2025)
  ]),
  m("xsr125", "XSR125", [v("gen1", "yamaha.xsr125.gen1", "I generacja", "XSR125", 2021, 2025)]),
  m("xj600-diversion", "XJ600 / Diversion", [
    v("xj600s", "yamaha.xj-diversion.xj600s", "XJ600S Diversion", "XJ600S Diversion", 1992, 2003),
    v("xj600n", "yamaha.xj-diversion.xj600n", "XJ600N", "XJ600N", 1995, 2003)
  ]),
  m("xj900-diversion", "XJ900S Diversion", [v("xj900s", "yamaha.xj-diversion.xj900s", "XJ900S Diversion", "XJ900S Diversion", 1994, 2003)]),
  m("xjr", "XJR", [
    v("xjr1200", "yamaha.xjr.xjr1200", "XJR1200", "XJR1200", 1995, 1998),
    v("xjr1300-carb", "yamaha.xjr.xjr1300-carb", "XJR1300 carburettor", "XJR1300 1999", 1999, 2006),
    v("xjr1300-efi", "yamaha.xjr.xjr1300-efi", "XJR1300 EFI", "XJR1300 2007", 2007, 2014),
    v("xjr1300-final", "yamaha.xjr.xjr1300-final", "XJR1300 final generation", "XJR1300 2015", 2015, 2016)
  ]),
  m("tracer-7", "Tracer 700 / Tracer 7", [
    v("700", "yamaha.tracer-7.700", "Tracer 700", "Tracer 700", 2016, 2019),
    v("7-1", "yamaha.tracer-7.7-1", "Tracer 7 — I", "Tracer 7 2020", 2020, 2024),
    v("7-gt-1", "yamaha.tracer-7.7-gt-1", "Tracer 7 GT — I", "Tracer 7 GT 2021", 2021, 2024),
    v("7-2", "yamaha.tracer-7.7-2", "Tracer 7 — II", "Tracer 7 2025", 2025, 2025),
    v("7-gt-2", "yamaha.tracer-7.7-gt-2", "Tracer 7 GT — II", "Tracer 7 GT 2025", 2025, 2025)
  ]),
  m("fj1200", "FJ1200", [
    v("standard", "yamaha.fj1200.standard", "FJ1200", "FJ1200", 1990, 1995),
    v("abs", "yamaha.fj1200.abs", "FJ1200A ABS", "FJ1200A ABS", 1991, 1995)
  ]),
  m("xt", "XT", [
    v("xt350", "yamaha.xt.xt350", "XT350", "XT350", 1990, 1998),
    v("xt600e", "yamaha.xt.xt600e", "XT600E", "XT600E", 1990, 2003),
    v("xt660r", "yamaha.xt.xt660r", "XT660R", "XT660R", 2004, 2016),
    v("xt660x", "yamaha.xt.xt660x", "XT660X", "XT660X", 2004, 2016)
  ]),
  m("tenere", "Ténéré", [
    v("xtz660", "yamaha.tenere-legacy.xtz660", "XTZ660 Ténéré", "XTZ660 Tenere", 1991, 1998),
    v("xt660z", "yamaha.tenere-legacy.xt660z", "XT660Z Ténéré", "XT660Z Tenere", 2008, 2016)
  ]),
  m("wr-road", "WR Road-Legal", [
    v("wr125r", "yamaha.wr-road.wr125r", "WR125R", "WR125R", 2009, 2016),
    v("wr125x", "yamaha.wr-road.wr125x", "WR125X", "WR125X", 2009, 2016),
    v("wr250r", "yamaha.wr-road.wr250r", "WR250R", "WR250R", 2008, 2015),
    v("wr250x", "yamaha.wr-road.wr250x", "WR250X", "WR250X", 2008, 2015)
  ]),
  m("gts1000", "GTS1000", [v("gts1000", "yamaha.unusual-road.gts1000", "GTS1000 / A", "GTS1000", 1993, 1999)]),
  m("bt1100-bulldog", "BT1100 Bulldog", [v("bt1100", "yamaha.unusual-road.bt1100", "BT1100 Bulldog", "BT1100 Bulldog", 2002, 2006)]),
  m("niken", "Niken", [
    v("niken-1", "yamaha.unusual-road.niken-1", "Niken — I", "Niken", 2018, 2020),
    v("niken-gt-1", "yamaha.unusual-road.niken-gt-1", "Niken GT — I", "Niken GT 2019", 2019, 2020),
    v("niken-gt-2", "yamaha.unusual-road.niken-gt-2", "Niken GT — II", "Niken GT 2023", 2023, 2025)
  ]),
  m("vmax", "V-Max / VMAX", [
    v("1200", "yamaha.vmax.1200", "V-Max 1200", "V-Max 1200", 1990, 2003),
    v("1700", "yamaha.vmax.1700", "VMAX 1700", "VMAX 1700", 2009, 2016)
  ]),
  m("virago", "Virago / XV", [
    v("xv125", "yamaha.virago.xv125", "XV125 Virago", "XV125 Virago", 1997, 2001),
    v("xv250", "yamaha.virago.xv250", "XV250 Virago", "XV250 Virago", 1995, 2000),
    v("xv535", "yamaha.virago.xv535", "XV535 Virago", "XV535 Virago", 1990, 2003),
    v("xv750", "yamaha.virago.xv750", "XV750 Virago", "XV750 Virago", 1990, 1997),
    v("xv1100", "yamaha.virago.xv1100", "XV1100 Virago", "XV1100 Virago", 1990, 1999)
  ]),
  m("drag-star", "Drag Star / XVS", [
    v("xvs125", "yamaha.drag-star.xvs125", "XVS125 Drag Star", "XVS125 Drag Star", 2000, 2004),
    v("xvs650", "yamaha.drag-star.xvs650", "XVS650 Drag Star", "XVS650 Drag Star", 1997, 2006),
    v("xvs1100", "yamaha.drag-star.xvs1100", "XVS1100 Drag Star", "XVS1100 Drag Star", 1999, 2007),
    v("xvs950", "yamaha.drag-star.xvs950", "XVS950A Midnight Star", "XVS950A Midnight Star", 2009, 2016),
    v("xvs1300", "yamaha.drag-star.xvs1300", "XVS1300A Midnight Star", "XVS1300A Midnight Star", 2007, 2016)
  ]),
  m("wild-star", "XV1600 Wild Star", [v("xv1600", "yamaha.large-cruiser.xv1600", "XV1600 Wild Star", "XV1600 Wild Star", 1999, 2004)]),
  m("warrior", "XV1700 Warrior", [v("xv1700", "yamaha.large-cruiser.xv1700", "XV1700 Warrior", "XV1700 Warrior", 2002, 2005)]),
  m("midnight-star-1900", "XV1900 Midnight Star", [v("xv1900", "yamaha.large-cruiser.xv1900", "XV1900A Midnight Star", "XV1900A Midnight Star", 2006, 2016)]),
  m("xv950", "XV950", [
    v("base", "yamaha.xv950.base", "XV950", "XV950", 2014, 2020),
    v("r", "yamaha.xv950.r", "XV950R", "XV950R", 2014, 2020)
  ]),
  m("sr", "SR", [
    v("sr125", "yamaha.sr-srx.sr125", "SR125", "SR125", 1990, 2002),
    v("sr500", "yamaha.sr-srx.sr500", "SR500", "SR500", 1990, 1999),
    v("sr400", "yamaha.sr-srx.sr400", "SR400 European return", "SR400", 2014, 2016)
  ]),
  m("srx", "SRX", [v("srx600", "yamaha.sr-srx.srx600", "SRX600", "SRX600", 1990, 1990)]),
  m("tzr", "TZR", [v("tzr125", "yamaha.road-two-stroke.tzr125", "TZR125", "TZR125", 1990, 1995)]),
  m("tdr", "TDR", [
    v("tdr125", "yamaha.road-two-stroke.tdr125", "TDR125", "TDR125", 1993, 2003),
    v("tdr250", "yamaha.road-two-stroke.tdr250", "TDR250", "TDR250", 1990, 1993)
  ]),
  m("dt125", "DT125", [
    v("dt125r", "yamaha.road-two-stroke.dt125r", "DT125R", "DT125R", 1990, 2003),
    v("dt125re", "yamaha.road-two-stroke.dt125re", "DT125RE", "DT125RE", 2004, 2006),
    v("dt125x", "yamaha.road-two-stroke.dt125x", "DT125X", "DT125X", 2005, 2006)
  ]),
  m("ybr125", "YBR125", [
    v("ybr125-carb", "yamaha.commuter.ybr125-carb", "YBR125 carburettor", "YBR125 2005", 2005, 2006),
    v("ybr125-efi", "yamaha.commuter.ybr125-efi", "YBR125 EFI", "YBR125 2007", 2007, 2016)
  ]),
  m("ys125", "YS125", [v("ys125", "yamaha.commuter.ys125", "YS125", "YS125", 2017, 2020)]),
  m("fzx750", "FZX750", [v("gen1", "yamaha.fzx750.gen1", "FZX750", "FZX750", 1990, 1998)]),
  m("tt-road", "TT Road-Legal", [
    v("tt600e", "yamaha.tt-road.tt600e", "TT600E", "TT600E", 1994, 2001),
    v("tt600r", "yamaha.tt-road.tt600r", "TT600R", "TT600R", 1998, 2003),
    v("tt600re", "yamaha.tt-road.tt600re", "TT600RE", "TT600RE", 2004, 2006)
  ])
]);

addVariants("yamaha", "yzf-r7", [v("r7-ow02", "yamaha.yzf-legacy-sport.r7-ow02", "YZF-R7 OW02", "YZF-R7 OW02", 1999, 2000)]);
addVariants("yamaha", "super-tenere", [v("xtz750", "yamaha.tenere-legacy.xtz750", "XTZ750 Super Ténéré", "XTZ750 Super Tenere", 1990, 1996)]);
addVariants("yamaha", "mt-09", [
  v("sp-2", "yamaha.mt-09.sp-2", "SP — II generation", "MT-09 SP 2018", 2018, 2020),
  v("sp-3", "yamaha.mt-09.sp-3", "SP — III generation", "MT-09 SP 2021", 2021, 2023),
  v("sp-4", "yamaha.mt-09.sp-4", "SP — IV generation", "MT-09 SP 2024", 2024, 2025)
]);
addVariants("yamaha", "mt-10", [
  v("sp-1", "yamaha.mt-10.sp-1", "SP — I generation", "MT-10 SP 2017", 2017, 2021),
  v("sp-2", "yamaha.mt-10.sp-2", "SP — II generation", "MT-10 SP 2022", 2022, 2025)
]);
addVariants("yamaha", "xsr900", [v("gp", "yamaha.xsr900.gp", "XSR900 GP", "XSR900 GP", 2024, 2025)]);
addVariants("yamaha", "tracer", [
  v("900-gt", "yamaha.tracer.900-gt", "Tracer 900 GT", "Tracer 900 GT", 2018, 2020),
  v("9-gt", "yamaha.tracer.9-gt", "Tracer 9 GT", "Tracer 9 GT 2021", 2021, 2024),
  v("9-gt-plus", "yamaha.tracer.9-gt-plus", "Tracer 9 GT+", "Tracer 9 GT+", 2023, 2024),
  v("9-gt-2025", "yamaha.tracer.9-gt-2025", "Tracer 9 GT — 2025", "Tracer 9 GT 2025", 2025, 2025),
  v("9-gt-plus-2025", "yamaha.tracer.9-gt-plus-2025", "Tracer 9 GT+ — 2025", "Tracer 9 GT+ 2025", 2025, 2025)
]);
addVariants("yamaha", "fjr1300", [
  v("as-rp13", "yamaha.fjr1300.as-rp13", "AS RP13", "FJR1300AS RP13", 2006, 2012),
  v("ae-rp23-1", "yamaha.fjr1300.ae-rp23-1", "AE RP23 — I", "FJR1300AE 2013", 2013, 2015),
  v("as-rp23-1", "yamaha.fjr1300.as-rp23-1", "AS RP23 — I", "FJR1300AS 2013", 2013, 2015),
  v("ae-rp23-2", "yamaha.fjr1300.ae-rp23-2", "AE RP23 — II", "FJR1300AE 2016", 2016, 2020),
  v("as-rp23-2", "yamaha.fjr1300.as-rp23-2", "AS RP23 — II", "FJR1300AS 2016", 2016, 2020)
]);
addVariants("yamaha", "super-tenere", [v("ze", "yamaha.super-tenere.ze", "XT1200ZE electronic suspension", "XT1200ZE Super Tenere", 2014, 2020)]);
addVariants("yamaha", "tenere-700", [
  v("world-raid-1", "yamaha.tenere-700.world-raid-1", "World Raid — I", "Tenere 700 World Raid 2022", 2022, 2024),
  v("world-raid-2", "yamaha.tenere-700.world-raid-2", "World Raid — II", "Tenere 700 World Raid 2025", 2025, 2025),
  v("explore", "yamaha.tenere-700.explore", "Explore Edition", "Tenere 700 Explore", 2024, 2024),
  v("extreme", "yamaha.tenere-700.extreme", "Extreme Edition", "Tenere 700 Extreme", 2024, 2024)
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

/* Suzuki Completeness Wave 2: evidence-backed European production range. */
addModels("suzuki", [
  m("gsx-r1100", "GSX-R1100", [
    v("gv73c", "suzuki.gsx-r1100.gv73c", "GV73C", "GSX-R1100 GV73C", 1990, 1992),
    v("gu75c", "suzuki.gsx-r1100.gu75c", "GU75C", "GSX-R1100 GU75C", 1993, 1994),
    v("gu75c-w", "suzuki.gsx-r1100.gu75c-w", "GU75C water-cooled", "GSX-R1100 GU75C 1995", 1995, 1998)
  ]),
  m("gsx600f", "GSX600F", [
    v("gn72b", "suzuki.gsx600f.gn72b", "GN72B", "GSX600F GN72B", 1990, 1997),
    v("aj", "suzuki.gsx600f.aj", "AJ", "GSX600F AJ", 1998, 2006)
  ]),
  m("gsx750f", "GSX750F", [
    v("gr78a", "suzuki.gsx750f.gr78a", "GR78A", "GSX750F GR78A", 1990, 1997),
    v("ak", "suzuki.gsx750f.ak", "AK", "GSX750F AK", 1998, 2006)
  ]),
  m("gsx650f", "GSX650F", [v("gen1", "suzuki.gsx650f.gen1", "GSX650F", "GSX650F", 2008, 2016)]),
  m("gsx1100f", "GSX1100F", [v("gv72c", "suzuki.gsx1100f.gv72c", "GV72C", "GSX1100F", 1990, 1996)]),
  m("rf", "RF", [
    v("rf600r", "suzuki.rf.rf600r", "RF600R", "RF600R", 1993, 1997),
    v("rf900r", "suzuki.rf.rf900r", "RF900R", "RF900R", 1994, 1999)
  ]),
  m("tl1000", "TL1000", [
    v("s", "suzuki.tl1000.s", "TL1000S", "TL1000S", 1997, 2001),
    v("r", "suzuki.tl1000.r", "TL1000R", "TL1000R", 1998, 2003)
  ]),
  m("b-king", "B-King", [v("gen1", "suzuki.b-king.gen1", "GSX1300BK", "GSX1300BK B-King", 2008, 2012)]),
  m("gsx125", "GSX-S125 / GSX-R125", [
    v("s", "suzuki.gsx125.s", "GSX-S125", "GSX-S125", 2017, 2025),
    v("r", "suzuki.gsx125.r", "GSX-R125", "GSX-R125", 2017, 2025)
  ]),
  m("gsx250r", "GSX250R", [v("gen1", "suzuki.gsx250r.gen1", "GSX250R", "GSX250R", 2017, 2021)]),
  m("gsx-s950", "GSX-S950", [v("gen1", "suzuki.gsx-s950.gen1", "GSX-S950", "GSX-S950", 2021, 2025)]),
  m("gsx-s1000f", "GSX-S1000F", [v("gen1", "suzuki.gsx-s1000f.gen1", "GSX-S1000F", "GSX-S1000F", 2015, 2021)]),
  m("gsx-s1000gx", "GSX-S1000GX", [v("gen1", "suzuki.gsx-s1000gx.gen1", "GSX-S1000GX", "GSX-S1000GX", 2024, 2025)]),
  m("gsx1250fa", "GSX1250FA", [v("gen1", "suzuki.gsx1250fa.gen1", "GSX1250FA", "GSX1250FA", 2010, 2016)]),
  m("gs500", "GS500", [
    v("e", "suzuki.gs500.e", "GS500E", "GS500E", 1990, 2000),
    v("gen2", "suzuki.gs500.gen2", "GS500", "GS500 2001", 2001, 2007),
    v("f", "suzuki.gs500.f", "GS500F", "GS500F", 2004, 2008)
  ]),
  m("gsx1100g", "GSX1100G", [v("gen1", "suzuki.gsx1100g.gen1", "GSX1100G", "GSX1100G", 1991, 1996)]),
  m("inazuma", "Inazuma", [
    v("gsx750", "suzuki.inazuma.gsx750", "GSX750 Inazuma", "GSX750 Inazuma", 1998, 2003),
    v("gsx1200", "suzuki.inazuma.gsx1200", "GSX1200 Inazuma", "GSX1200 Inazuma", 1999, 2001),
    v("gw250", "suzuki.inazuma.gw250", "GW250 Inazuma", "GW250 Inazuma", 2012, 2017)
  ]),
  m("gsx1400", "GSX1400", [v("gen1", "suzuki.gsx1400.gen1", "GSX1400", "GSX1400", 2001, 2007)]),
  m("vx800", "VX800", [v("gen1", "suzuki.vx800.gen1", "VX800", "VX800", 1990, 1997)]),
  m("freewind", "Freewind", [v("xf650", "suzuki.freewind.xf650", "XF650", "XF650 Freewind", 1997, 2003)]),
  m("dr350", "DR350", [
    v("s", "suzuki.dr350.s", "DR350S", "DR350S", 1990, 1993),
    v("se", "suzuki.dr350.se", "DR350SE", "DR350SE", 1994, 2000)
  ]),
  m("dr650", "DR650", [
    v("r", "suzuki.dr650.r", "DR650R", "DR650R", 1990, 1995),
    v("rs", "suzuki.dr650.rs", "DR650RS", "DR650RS", 1990, 1995),
    v("se", "suzuki.dr650.se", "DR650SE", "DR650SE", 1996, 2000)
  ]),
  m("dr-big", "DR Big", [v("dr800s", "suzuki.dr-big.dr800s", "DR800S", "DR800S Big", 1990, 1999)]),
  m("dr-z400", "DR-Z400", [
    v("s", "suzuki.dr-z400.s", "DR-Z400S", "DR-Z400S", 2000, 2008),
    v("sm", "suzuki.dr-z400.sm", "DR-Z400SM", "DR-Z400SM", 2005, 2008),
    v("4s", "suzuki.dr-z400.4s", "DR-Z4S", "DR-Z4S", 2025, 2025),
    v("4sm", "suzuki.dr-z400.4sm", "DR-Z4SM", "DR-Z4SM", 2025, 2025)
  ]),
  m("dr125", "DR125", [
    v("s", "suzuki.dr125.s", "DR125S", "DR125S", 1990, 1996),
    v("se", "suzuki.dr125.se", "DR125SE", "DR125SE", 1994, 2002),
    v("sm", "suzuki.dr125.sm", "DR125SM", "DR125SM", 2008, 2014)
  ]),
  m("vanvan", "VanVan", [
    v("rv125", "suzuki.vanvan.rv125", "RV125", "RV125 VanVan", 2003, 2016),
    v("rv200", "suzuki.vanvan.rv200", "RV200", "RV200 VanVan", 2016, 2019)
  ]),
  m("intruder-vs", "Intruder VS", [
    v("vs600", "suzuki.intruder-vs.vs600", "VS600", "VS600 Intruder", 1995, 2000),
    v("vs750", "suzuki.intruder-vs.vs750", "VS750", "VS750 Intruder", 1990, 1991),
    v("vs800", "suzuki.intruder-vs.vs800", "VS800", "VS800 Intruder", 1992, 2000),
    v("vs1400", "suzuki.intruder-vs.vs1400", "VS1400", "VS1400 Intruder", 1990, 2003)
  ]),
  m("intruder-vl", "Intruder VL", [
    v("vl125", "suzuki.intruder-vl.vl125", "VL125 LC", "VL125 Intruder LC", 2000, 2008),
    v("vl250", "suzuki.intruder-vl.vl250", "VL250 LC", "VL250 Intruder LC", 2000, 2007),
    v("vl800", "suzuki.intruder-vl.vl800", "VL800 / C800", "VL800 Intruder C800", 2001, 2017),
    v("vl1500", "suzuki.intruder-vl.vl1500", "VL1500 / C1500", "VL1500 Intruder C1500", 1998, 2009)
  ]),
  m("intruder-m", "Intruder M", [
    v("m800", "suzuki.intruder-m.m800", "M800", "Intruder M800", 2005, 2016),
    v("m1500", "suzuki.intruder-m.m1500", "M1500", "Intruder M1500", 2009, 2017),
    v("m1800r", "suzuki.intruder-m.m1800r", "M1800R", "Intruder M1800R", 2006, 2017)
  ]),
  m("marauder", "Marauder", [
    v("gz125", "suzuki.marauder.gz125", "GZ125", "GZ125 Marauder", 1998, 2011),
    v("gz250", "suzuki.marauder.gz250", "GZ250", "GZ250 Marauder", 1999, 2007),
    v("vz800", "suzuki.marauder.vz800", "VZ800", "VZ800 Marauder", 1997, 2004)
  ]),
  m("savage", "Savage", [v("ls650", "suzuki.savage.ls650", "LS650", "LS650 Savage", 1990, 2004)]),
  m("gn125", "GN125", [v("gen1", "suzuki.gn125.gen1", "GN125", "GN125", 1990, 2001)]),
  m("en125", "EN125", [v("gen1", "suzuki.en125.gen1", "EN125", "EN125", 2003, 2011)]),
  m("burgman-125-200", "Burgman 125 / 200", [
    v("125", "suzuki.burgman-125-200.125", "UH125", "Burgman 125", 2002, 2013),
    v("200-1", "suzuki.burgman-125-200.200-1", "UH200 — I", "Burgman 200 2007", 2007, 2013),
    v("200-2", "suzuki.burgman-125-200.200-2", "UH200 — II", "Burgman 200 2014", 2014, 2020),
    v("street-125ex", "suzuki.burgman-125-200.street-125ex", "Street 125EX", "Burgman Street 125EX", 2023, 2025)
  ]),
  m("burgman-250", "Burgman 250", [v("an250", "suzuki.burgman-250.an250", "AN250", "Burgman 250", 1998, 2002)]),
  m("burgman-400", "Burgman 400", [
    v("gen1", "suzuki.burgman-400.gen1", "AN400 — I", "Burgman 400 1998", 1998, 2002),
    v("gen2", "suzuki.burgman-400.gen2", "AN400 — II", "Burgman 400 2003", 2003, 2006),
    v("gen3", "suzuki.burgman-400.gen3", "AN400 — III", "Burgman 400 2007", 2007, 2016),
    v("gen4", "suzuki.burgman-400.gen4", "AN400 — IV", "Burgman 400 2017", 2017, 2025)
  ]),
  m("burgman-650", "Burgman 650", [
    v("gen1", "suzuki.burgman-650.gen1", "AN650 — I", "Burgman 650 2002", 2002, 2012),
    v("gen2", "suzuki.burgman-650.gen2", "AN650 — II", "Burgman 650 2013", 2013, 2018)
  ]),
  m("address", "Address", [
    v("an125", "suzuki.address.an125", "Address 125 — I", "Address 125 1995", 1995, 2007),
    v("uk110", "suzuki.address.uk110", "Address 110", "Address 110 2015", 2015, 2020),
    v("dp12", "suzuki.address.dp12", "Address 125 — II", "Address 125 2023", 2023, 2025)
  ])
]);

addVariants("suzuki", "sv650", [v("x", "suzuki.sv650.x", "SV650X", "SV650X", 2018, 2021)]);
addVariants("suzuki", "gsx-r1000", [v("r-l7", "suzuki.gsx-r1000.r-l7", "R L7", "GSX-R1000R L7", 2017, 2022)]);
addVariants("suzuki", "gsx-s1000gt", [v("plus", "suzuki.gsx-s1000gt.plus", "GT+", "GSX-S1000GT+", 2022, 2025)]);
addVariants("suzuki", "v-strom-1000-1050", [
  v("1000-xt", "suzuki.v-strom-1000-1050.1000-xt", "DL1000XT", "DL1000XT V-Strom", 2017, 2019),
  v("1050-xt", "suzuki.v-strom-1000-1050.1050-xt", "DL1050XT", "DL1050XT V-Strom", 2020, 2022),
  v("1050-de", "suzuki.v-strom-1000-1050.1050-de", "DL1050DE", "DL1050DE V-Strom", 2023, 2025)
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

/* Kawasaki Completeness Wave 2: conservative European production range. */
addModels("kawasaki", [
  m("zxr400", "ZXR400", [
    v("l1-l2", "kawasaki.zxr400.l1-l2", "L1/L2", "ZXR400 L1", 1991, 1992),
    v("l3-l9", "kawasaki.zxr400.l3-l9", "L3–L9", "ZXR400 L3", 1993, 1999)
  ]),
  m("zxr750-zx7r", "ZXR750 / Ninja ZX-7R", [
    v("h2", "kawasaki.zxr750-zx7r.h2", "ZXR750 H2", "ZXR750 H2", 1990, 1990),
    v("j-l", "kawasaki.zxr750-zx7r.j-l", "ZXR750 J/L", "ZXR750 1991", 1991, 1995),
    v("p", "kawasaki.zxr750-zx7r.p", "Ninja ZX-7R P", "Ninja ZX-7R", 1996, 2003)
  ]),
  m("ninja-zx-9r", "Ninja ZX-9R", [
    v("b", "kawasaki.ninja-zx-9r.b", "B", "Ninja ZX-9R 1994", 1994, 1997),
    v("c", "kawasaki.ninja-zx-9r.c", "C", "Ninja ZX-9R 1998", 1998, 1999),
    v("e", "kawasaki.ninja-zx-9r.e", "E", "Ninja ZX-9R 2000", 2000, 2001),
    v("f", "kawasaki.ninja-zx-9r.f", "F", "Ninja ZX-9R 2002", 2002, 2003)
  ]),
  m("ninja-zx-12r", "Ninja ZX-12R", [
    v("a1-a2", "kawasaki.ninja-zx-12r.a1-a2", "A1/A2", "Ninja ZX-12R 2000", 2000, 2001),
    v("b", "kawasaki.ninja-zx-12r.b", "B", "Ninja ZX-12R 2002", 2002, 2006)
  ]),
  m("zzr600", "ZZR600", [
    v("d", "kawasaki.zzr600.d", "ZX600D", "ZZR600 D", 1990, 1992),
    v("e", "kawasaki.zzr600.e", "ZX600E", "ZZR600 E", 1993, 2006)
  ]),
  m("zzr1100", "ZZR1100", [
    v("c", "kawasaki.zzr1100.c", "ZXT10C", "ZZR1100 C", 1990, 1992),
    v("d", "kawasaki.zzr1100.d", "ZXT10D", "ZZR1100 D", 1993, 2001)
  ]),
  m("zzr1200", "ZZR1200", [v("c", "kawasaki.zzr1200.c", "ZXT20C", "ZZR1200", 2002, 2005)]),
  m("zzr1400", "ZZR1400", [
    v("gen1", "kawasaki.zzr1400.gen1", "ZX-14 / ZZR1400 — I", "ZZR1400 2006", 2006, 2011),
    v("gen2", "kawasaki.zzr1400.gen2", "ZX-14R / ZZR1400 — II", "ZZR1400 2012", 2012, 2020)
  ]),
  m("gpz500s", "GPZ500S", [
    v("ex500a", "kawasaki.gpz500s.ex500a", "EX500A", "GPZ500S 1990", 1990, 1993),
    v("ex500d", "kawasaki.gpz500s.ex500d", "EX500D", "GPZ500S 1994", 1994, 2003)
  ]),
  m("gpz900r", "GPZ900R", [v("a7-a10", "kawasaki.gpz900r.a7-a10", "A7–A10", "GPZ900R", 1990, 1993)]),
  m("gpz1100", "GPZ1100", [v("e", "kawasaki.gpz1100.e", "ZX1100E", "GPZ1100", 1995, 1998)]),
  m("ninja-1000sx", "Z1000SX / Ninja 1000SX", [
    v("gen1", "kawasaki.ninja-1000sx.gen1", "Z1000SX — I", "Z1000SX 2011", 2011, 2013),
    v("gen2", "kawasaki.ninja-1000sx.gen2", "Z1000SX — II", "Z1000SX 2014", 2014, 2016),
    v("gen3", "kawasaki.ninja-1000sx.gen3", "Z1000SX — III", "Z1000SX 2017", 2017, 2019),
    v("gen4", "kawasaki.ninja-1000sx.gen4", "Ninja 1000SX — I", "Ninja 1000SX 2020", 2020, 2024),
    v("gen5", "kawasaki.ninja-1000sx.gen5", "Ninja 1100SX", "Ninja 1100SX", 2025, 2025)
  ]),
  m("ninja-z125", "Ninja 125 / Z125", [
    v("ninja", "kawasaki.ninja-z125.ninja", "Ninja 125", "Ninja 125", 2019, 2025),
    v("z", "kawasaki.ninja-z125.z", "Z125", "Z125", 2019, 2025)
  ]),
  m("electric", "Ninja e-1 / Z e-1", [
    v("ninja-e1", "kawasaki.electric.ninja-e1", "Ninja e-1", "Ninja e-1", 2024, 2025),
    v("z-e1", "kawasaki.electric.z-e1", "Z e-1", "Z e-1", 2024, 2025)
  ]),
  m("hybrid", "Ninja 7 / Z7 Hybrid", [
    v("ninja-7", "kawasaki.hybrid.ninja-7", "Ninja 7 Hybrid", "Ninja 7 Hybrid", 2024, 2025),
    v("z7", "kawasaki.hybrid.z7", "Z7 Hybrid", "Z7 Hybrid", 2024, 2025)
  ]),
  m("er-5", "ER-5", [v("gen1", "kawasaki.er-5.gen1", "ER500", "ER-5", 1997, 2006)]),
  m("zrx", "ZRX", [
    v("1100", "kawasaki.zrx.1100", "ZRX1100", "ZRX1100", 1997, 2000),
    v("1200r", "kawasaki.zrx.1200r", "ZRX1200R", "ZRX1200R", 2001, 2006),
    v("1200s", "kawasaki.zrx.1200s", "ZRX1200S", "ZRX1200S", 2001, 2004)
  ]),
  m("zephyr", "Zephyr", [
    v("550", "kawasaki.zephyr.550", "Zephyr 550", "Zephyr 550", 1991, 1998),
    v("750", "kawasaki.zephyr.750", "Zephyr 750", "Zephyr 750", 1991, 1999),
    v("1100", "kawasaki.zephyr.1100", "Zephyr 1100", "Zephyr 1100", 1992, 1997)
  ]),
  m("z900rs", "Z900RS", [
    v("gen1", "kawasaki.z900rs.gen1", "I generacja", "Z900RS 2018", 2018, 2024),
    v("gen2", "kawasaki.z900rs.gen2", "II generacja", "Z900RS 2025", 2025, 2025)
  ]),
  m("w", "W", [
    v("w650", "kawasaki.w.w650", "W650", "W650", 1999, 2006),
    v("w800-1", "kawasaki.w.w800-1", "W800 — I", "W800 2011", 2011, 2016),
    v("w800-2", "kawasaki.w.w800-2", "W800 — II", "W800 2019", 2019, 2025)
  ]),
  m("kle500", "KLE500", [
    v("gen1", "kawasaki.kle500.gen1", "I generacja", "KLE500 1991", 1991, 2004),
    v("gen2", "kawasaki.kle500.gen2", "II generacja", "KLE500 2005", 2005, 2007)
  ]),
  m("klr650", "KLR650", [v("kl650c", "kawasaki.klr650.kl650c", "KL650C", "KLR650", 1990, 2004)]),
  m("klx-road", "KLX Road", [
    v("klx250", "kawasaki.klx-road.klx250", "KLX250", "KLX250", 2009, 2016),
    v("klx125", "kawasaki.klx-road.klx125", "KLX125", "KLX125", 2010, 2016),
    v("d-tracker125", "kawasaki.klx-road.d-tracker125", "D-Tracker 125", "D-Tracker 125", 2010, 2016)
  ]),
  m("versys-x300", "Versys-X 300", [v("gen1", "kawasaki.versys-x300.gen1", "Versys-X 300", "Versys-X 300", 2017, 2020)]),
  m("gtr1000", "1000GTR", [v("zg1000", "kawasaki.gtr1000.zg1000", "ZG1000", "1000GTR", 1990, 2006)]),
  m("vulcan-750-800", "VN750 / VN800 Vulcan", [
    v("vn750", "kawasaki.vulcan-750-800.vn750", "VN750", "VN750 Vulcan", 1990, 1995),
    v("vn800", "kawasaki.vulcan-750-800.vn800", "VN800", "VN800 Vulcan", 1995, 2006),
    v("vn800-classic", "kawasaki.vulcan-750-800.vn800-classic", "VN800 Classic", "VN800 Vulcan Classic", 1996, 2006)
  ]),
  m("vulcan-900", "VN900 Vulcan", [
    v("classic", "kawasaki.vulcan-900.classic", "Classic", "VN900 Vulcan Classic", 2006, 2016),
    v("custom", "kawasaki.vulcan-900.custom", "Custom", "VN900 Vulcan Custom", 2007, 2016)
  ]),
  m("vulcan-1500-1600", "VN1500 / VN1600 Vulcan", [
    v("vn1500-classic", "kawasaki.vulcan-1500-1600.vn1500-classic", "VN1500 Classic", "VN1500 Vulcan Classic", 1996, 2008),
    v("vn1500-mean-streak", "kawasaki.vulcan-1500-1600.vn1500-mean-streak", "VN1500 Mean Streak", "VN1500 Mean Streak", 2002, 2004),
    v("vn1600-classic", "kawasaki.vulcan-1500-1600.vn1600-classic", "VN1600 Classic", "VN1600 Vulcan Classic", 2003, 2008),
    v("vn1600-mean-streak", "kawasaki.vulcan-1500-1600.vn1600-mean-streak", "VN1600 Mean Streak", "VN1600 Mean Streak", 2004, 2008)
  ]),
  m("vulcan-1700", "VN1700 Vulcan", [
    v("classic", "kawasaki.vulcan-1700.classic", "Classic", "VN1700 Vulcan Classic", 2009, 2014),
    v("voyager", "kawasaki.vulcan-1700.voyager", "Voyager", "VN1700 Vulcan Voyager", 2009, 2016)
  ]),
  m("eliminator", "Eliminator", [
    v("el250", "kawasaki.eliminator.el250", "EL250", "EL250 Eliminator", 1990, 1995),
    v("zl600", "kawasaki.eliminator.zl600", "ZL600", "ZL600 Eliminator", 1995, 1997),
    v("el450", "kawasaki.eliminator.el450", "Eliminator 500", "Eliminator 500", 2024, 2025)
  ])
]);

addVariants("kawasaki", "z750", [v("s", "kawasaki.z750.s", "Z750S", "Z750S", 2005, 2007)]);

addModels("bmw", [
  m("g310", "G 310", [v("r-1", "bmw.g310.r-1", "G 310 R — I", "G 310 R 2017", 2017, 2020), v("r-2", "bmw.g310.r-2", "G 310 R — II", "G 310 R 2021", 2021, 2025), v("gs-1", "bmw.g310.gs-1", "G 310 GS — I", "G 310 GS 2017", 2017, 2020), v("gs-2", "bmw.g310.gs-2", "G 310 GS — II", "G 310 GS 2021", 2021, 2025)]),
  m("f-roadster-xr", "F Roadster / XR", [v("f800r-1", "bmw.f-roadster-xr.f800r-1", "F 800 R — I", "F 800 R 2009", 2009, 2014), v("f800r-2", "bmw.f-roadster-xr.f800r-2", "F 800 R — II", "F 800 R 2015", 2015, 2019), v("f900r-1", "bmw.f-roadster-xr.f900r-1", "F 900 R — I", "F 900 R 2020", 2020, 2024), v("f900r-2", "bmw.f-roadster-xr.f900r-2", "F 900 R — II", "F 900 R 2025", 2025, 2025), v("f900xr-1", "bmw.f-roadster-xr.f900xr-1", "F 900 XR — I", "F 900 XR 2020", 2020, 2024), v("f900xr-2", "bmw.f-roadster-xr.f900xr-2", "F 900 XR — II", "F 900 XR 2025", 2025, 2025)]),
  m("s1000r-xr", "S 1000 R / XR", [v("r-1", "bmw.s1000r-xr.r-1", "S 1000 R — I", "S 1000 R 2014", 2014, 2016), v("r-2", "bmw.s1000r-xr.r-2", "S 1000 R — II", "S 1000 R 2017", 2017, 2020), v("r-3", "bmw.s1000r-xr.r-3", "S 1000 R — III", "S 1000 R 2021", 2021, 2024), v("r-4", "bmw.s1000r-xr.r-4", "S 1000 R — IV", "S 1000 R 2025", 2025, 2025), v("xr-1", "bmw.s1000r-xr.xr-1", "S 1000 XR — I", "S 1000 XR 2015", 2015, 2019), v("xr-2", "bmw.s1000r-xr.xr-2", "S 1000 XR — II", "S 1000 XR 2020", 2020, 2023), v("xr-3", "bmw.s1000r-xr.xr-3", "S 1000 XR — III", "S 1000 XR 2024", 2024, 2025)]),
  m("k1600", "K 1600", [v("gen1", "bmw.k1600.gen1", "GT / GTL — I", "K 1600 GT 2011", 2011, 2016), v("gen2", "bmw.k1600.gen2", "GT / GTL — II", "K 1600 GT 2017", 2017, 2021), v("gen3", "bmw.k1600.gen3", "GT / GTL — III", "K 1600 GT 2022", 2022, 2025)]),
  m("r18", "R 18", [v("gen1", "bmw.r18.gen1", "R 18", "R 18", 2020, 2025)])
]);

/* BMW Completeness Wave 2: conservative European production range. */
addModels("bmw", [
  m("r-roadster", "R Boxer Roadster", [
    v("r850r", "bmw.r-roadster.r850r", "R 850 R", "R 850 R", 1995, 2007),
    v("r1100r", "bmw.r-roadster.r1100r", "R 1100 R", "R 1100 R", 1995, 2001),
    v("r1150r", "bmw.r-roadster.r1150r", "R 1150 R", "R 1150 R", 2001, 2006),
    v("rockster", "bmw.r-roadster.rockster", "R 1150 R Rockster", "R 1150 R Rockster", 2003, 2006),
    v("r1200r-k27", "bmw.r-roadster.r1200r-k27", "R 1200 R K27", "R 1200 R K27", 2007, 2014),
    v("r1200r-k53", "bmw.r-roadster.r1200r-k53", "R 1200 R K53", "R 1200 R K53", 2015, 2018),
    v("r1250r", "bmw.r-roadster.r1250r", "R 1250 R", "R 1250 R", 2019, 2025)
  ]),
  m("r-sport-touring", "R Boxer Sport / RS", [
    v("r1100rs", "bmw.r-sport-touring.r1100rs", "R 1100 RS", "R 1100 RS", 1993, 2001),
    v("r1100s", "bmw.r-sport-touring.r1100s", "R 1100 S", "R 1100 S", 1998, 2005),
    v("r1150rs", "bmw.r-sport-touring.r1150rs", "R 1150 RS", "R 1150 RS", 2001, 2005),
    v("r1200st", "bmw.r-sport-touring.r1200st", "R 1200 ST", "R 1200 ST", 2005, 2007),
    v("r1200s", "bmw.r-sport-touring.r1200s", "R 1200 S", "R 1200 S", 2006, 2008),
    v("r1200rs", "bmw.r-sport-touring.r1200rs", "R 1200 RS", "R 1200 RS", 2015, 2018),
    v("r1250rs", "bmw.r-sport-touring.r1250rs", "R 1250 RS", "R 1250 RS", 2019, 2025)
  ]),
  m("gs-adventure-boxer", "R GS Adventure", [
    v("r1150", "bmw.gs-adventure-boxer.r1150", "R 1150 GS Adventure", "R 1150 GS Adventure", 2002, 2005),
    v("r1200-k25-1", "bmw.gs-adventure-boxer.r1200-k25-1", "R 1200 GS Adventure K25 — I", "R 1200 GS Adventure K25 2006", 2006, 2009),
    v("r1200-k25-dohc", "bmw.gs-adventure-boxer.r1200-k25-dohc", "R 1200 GS Adventure K25 DOHC", "R 1200 GS Adventure K25 DOHC", 2010, 2013),
    v("r1200-k51-1", "bmw.gs-adventure-boxer.r1200-k51-1", "R 1200 GS Adventure K51 — I", "R 1200 GS Adventure K51 2014", 2014, 2016),
    v("r1200-k51-2", "bmw.gs-adventure-boxer.r1200-k51-2", "R 1200 GS Adventure K51 — II", "R 1200 GS Adventure K51 2017", 2017, 2018),
    v("r1250", "bmw.gs-adventure-boxer.r1250", "R 1250 GS Adventure", "R 1250 GS Adventure", 2019, 2024),
    v("r1300", "bmw.gs-adventure-boxer.r1300", "R 1300 GS Adventure", "R 1300 GS Adventure", 2025, 2025)
  ]),
  m("r850-special", "R 850 GS / RT", [
    v("gs", "bmw.r850-special.gs", "R 850 GS", "R 850 GS", 1998, 2000),
    v("rt", "bmw.r850-special.rt", "R 850 RT", "R 850 RT", 1998, 2006)
  ]),
  m("r-cruiser", "R 1200 C / CL", [
    v("c", "bmw.r-cruiser.c", "R 1200 C", "R 1200 C", 1997, 2004),
    v("cl", "bmw.r-cruiser.cl", "R 1200 CL", "R 1200 CL", 2002, 2005)
  ]),
  m("k-legacy", "K 75 / K 100 / K 1", [
    v("k75", "bmw.k-legacy.k75", "K 75", "K 75", 1990, 1996),
    v("k100rs", "bmw.k-legacy.k100rs", "K 100 RS", "K 100 RS", 1990, 1992),
    v("k1", "bmw.k-legacy.k1", "K 1", "K 1", 1990, 1993)
  ]),
  m("k1100", "K 1100", [
    v("rs", "bmw.k1100.rs", "K 1100 RS", "K 1100 RS", 1992, 1996),
    v("lt", "bmw.k1100.lt", "K 1100 LT", "K 1100 LT", 1991, 1999)
  ]),
  m("k1200-brick", "K 1200 Longitudinal", [
    v("rs-1", "bmw.k1200-brick.rs-1", "K 1200 RS — I", "K 1200 RS 1997", 1997, 2000),
    v("rs-2", "bmw.k1200-brick.rs-2", "K 1200 RS — II", "K 1200 RS 2001", 2001, 2005),
    v("lt", "bmw.k1200-brick.lt", "K 1200 LT", "K 1200 LT", 1999, 2008),
    v("gt", "bmw.k1200-brick.gt", "K 1200 GT", "K 1200 GT 2003", 2003, 2005)
  ]),
  m("k1200-transverse", "K 1200 Transverse", [
    v("s", "bmw.k1200-transverse.s", "K 1200 S", "K 1200 S", 2005, 2008),
    v("r", "bmw.k1200-transverse.r", "K 1200 R", "K 1200 R", 2005, 2008),
    v("r-sport", "bmw.k1200-transverse.r-sport", "K 1200 R Sport", "K 1200 R Sport", 2007, 2008),
    v("gt", "bmw.k1200-transverse.gt", "K 1200 GT", "K 1200 GT 2006", 2006, 2008)
  ]),
  m("k1300", "K 1300", [
    v("s", "bmw.k1300.s", "K 1300 S", "K 1300 S", 2009, 2015),
    v("r", "bmw.k1300.r", "K 1300 R", "K 1300 R", 2009, 2015),
    v("gt", "bmw.k1300.gt", "K 1300 GT", "K 1300 GT", 2009, 2011)
  ]),
  m("f650-classic", "F 650 / ST", [
    v("funduro", "bmw.f650-classic.funduro", "F 650", "F 650", 1994, 2000),
    v("st", "bmw.f650-classic.st", "F 650 ST", "F 650 ST", 1997, 2000)
  ]),
  m("f650-special", "F 650 GS Dakar / CS", [
    v("dakar", "bmw.f650-special.dakar", "F 650 GS Dakar", "F 650 GS Dakar", 2000, 2007),
    v("cs", "bmw.f650-special.cs", "F 650 CS Scarver", "F 650 CS Scarver", 2002, 2005)
  ]),
  m("g650", "G 650", [
    v("xchallenge", "bmw.g650.xchallenge", "G 650 Xchallenge", "G 650 Xchallenge", 2007, 2009),
    v("xcountry", "bmw.g650.xcountry", "G 650 Xcountry", "G 650 Xcountry", 2007, 2009),
    v("xmoto", "bmw.g650.xmoto", "G 650 Xmoto", "G 650 Xmoto", 2007, 2009),
    v("gs", "bmw.g650.gs", "G 650 GS", "G 650 GS", 2009, 2015),
    v("sertao", "bmw.g650.sertao", "G 650 GS Sertão", "G 650 GS Sertão", 2012, 2015)
  ]),
  m("f-touring", "F 800 Sport Touring", [
    v("s", "bmw.f-touring.s", "F 800 S", "F 800 S", 2006, 2010),
    v("st", "bmw.f-touring.st", "F 800 ST", "F 800 ST", 2006, 2012),
    v("gt", "bmw.f-touring.gt", "F 800 GT", "F 800 GT", 2013, 2020)
  ]),
  m("hp-road", "HP Road Models", [
    v("hp2-enduro", "bmw.hp-road.hp2-enduro", "HP2 Enduro", "HP2 Enduro", 2005, 2007),
    v("hp2-megamoto", "bmw.hp-road.hp2-megamoto", "HP2 Megamoto", "HP2 Megamoto", 2007, 2009),
    v("hp2-sport", "bmw.hp-road.hp2-sport", "HP2 Sport", "HP2 Sport", 2008, 2010),
    v("hp4", "bmw.hp-road.hp4", "HP4", "HP4", 2013, 2014)
  ]),
  m("m1000", "M 1000", [
    v("rr-1", "bmw.m1000.rr-1", "M 1000 RR — I", "M 1000 RR 2021", 2021, 2022),
    v("rr-2", "bmw.m1000.rr-2", "M 1000 RR — II", "M 1000 RR 2023", 2023, 2025),
    v("r", "bmw.m1000.r", "M 1000 R", "M 1000 R", 2023, 2025),
    v("xr", "bmw.m1000.xr", "M 1000 XR", "M 1000 XR", 2024, 2025)
  ]),
  m("c-scooter", "C 600 / C 650", [
    v("c600-sport", "bmw.c-scooter.c600-sport", "C 600 Sport", "C 600 Sport", 2012, 2015),
    v("c650-sport", "bmw.c-scooter.c650-sport", "C 650 Sport", "C 650 Sport", 2016, 2020),
    v("c650gt-1", "bmw.c-scooter.c650gt-1", "C 650 GT — I", "C 650 GT 2012", 2012, 2015),
    v("c650gt-2", "bmw.c-scooter.c650gt-2", "C 650 GT — II", "C 650 GT 2016", 2016, 2020)
  ]),
  m("c400", "C 400", [
    v("x", "bmw.c400.x", "C 400 X", "C 400 X", 2018, 2025),
    v("gt", "bmw.c400.gt", "C 400 GT", "C 400 GT", 2019, 2025)
  ]),
  m("electric-urban", "Electric Urban Mobility", [
    v("c-evolution", "bmw.electric-urban.c-evolution", "C evolution", "C evolution", 2014, 2020),
    v("ce04", "bmw.electric-urban.ce04", "CE 04", "CE 04", 2022, 2025),
    v("ce02", "bmw.electric-urban.ce02", "CE 02", "CE 02", 2024, 2025)
  ])
]);

addVariants("bmw", "f-gs", [
  v("f800-adventure", "bmw.f-gs.f800-adventure", "F 800 GS Adventure", "F 800 GS Adventure", 2013, 2018),
  v("f750", "bmw.f-gs.f750", "F 750 GS", "F 750 GS", 2018, 2023),
  v("f850-adventure", "bmw.f-gs.f850-adventure", "F 850 GS Adventure", "F 850 GS Adventure", 2019, 2023),
  v("f800-later", "bmw.f-gs.f800-later", "F 800 GS (895 cc)", "F 800 GS 2024", 2024, 2025),
  v("f900-adventure", "bmw.f-gs.f900-adventure", "F 900 GS Adventure", "F 900 GS Adventure", 2024, 2025)
]);

addVariants("bmw", "r-ninet", [
  v("pure", "bmw.r-ninet.pure", "Pure", "R nineT Pure", 2017, 2023),
  v("scrambler", "bmw.r-ninet.scrambler", "Scrambler", "R nineT Scrambler", 2017, 2023),
  v("racer", "bmw.r-ninet.racer", "Racer", "R nineT Racer", 2017, 2019),
  v("urban-gs", "bmw.r-ninet.urban-gs", "Urban G/S", "R nineT Urban G/S", 2017, 2023)
]);

addVariants("bmw", "k1600", [
  v("gtl", "bmw.k1600.gtl", "GTL", "K 1600 GTL", 2011, 2025),
  v("b", "bmw.k1600.b", "B", "K 1600 B", 2017, 2025),
  v("grand-america", "bmw.k1600.grand-america", "Grand America", "K 1600 Grand America", 2018, 2025)
]);

addVariants("bmw", "r18", [
  v("classic", "bmw.r18.classic", "Classic", "R 18 Classic", 2021, 2025),
  v("b", "bmw.r18.b", "B", "R 18 B", 2022, 2025),
  v("transcontinental", "bmw.r18.transcontinental", "Transcontinental", "R 18 Transcontinental", 2022, 2025)
]);

addModels("ducati", [
  m("superbike-v2", "749 / 999 / 848 / 1098 / 1198", [v("749", "ducati.superbike-v2.749", "749", "Ducati 749", 2003, 2006), v("999", "ducati.superbike-v2.999", "999", "Ducati 999", 2003, 2006), v("848", "ducati.superbike-v2.848", "848", "Ducati 848", 2008, 2013), v("1098", "ducati.superbike-v2.1098", "1098", "Ducati 1098", 2007, 2009), v("1198", "ducati.superbike-v2.1198", "1198", "Ducati 1198", 2009, 2011)]),
  m("streetfighter", "Streetfighter", [v("1098", "ducati.streetfighter.1098", "1098", "Streetfighter 1098", 2009, 2013), v("848", "ducati.streetfighter.848", "848", "Streetfighter 848", 2012, 2015), v("v4-1", "ducati.streetfighter.v4-1", "V4 — I", "Streetfighter V4 2020", 2020, 2024), v("v4-2", "ducati.streetfighter.v4-2", "V4 — II", "Streetfighter V4 2025", 2025, 2025)]),
  m("hypermotard", "Hypermotard", [v("1100", "ducati.hypermotard.1100", "1100", "Hypermotard 1100", 2007, 2012), v("821", "ducati.hypermotard.821", "821", "Hypermotard 821", 2013, 2015), v("939", "ducati.hypermotard.939", "939", "Hypermotard 939", 2016, 2018), v("950", "ducati.hypermotard.950", "950", "Hypermotard 950", 2019, 2025)]),
  m("desertx", "DesertX", [v("gen1", "ducati.desertx.gen1", "I generacja", "DesertX", 2022, 2025)])
]);

/* Ducati Completeness Wave 1: production road motorcycles within MY1990–2025. */
addModels("ducati", [
  m("superbike-classic", "851 / 888 / 748 / 916 / 996 / 998", [
    v("851", "ducati.superbike-classic.851", "851 Strada", "Ducati 851", 1990, 1992),
    v("888", "ducati.superbike-classic.888", "888 Strada", "Ducati 888", 1991, 1994),
    v("748", "ducati.superbike-classic.748", "748", "Ducati 748", 1995, 2002),
    v("916", "ducati.superbike-classic.916", "916", "Ducati 916", 1994, 1998),
    v("996", "ducati.superbike-classic.996", "996", "Ducati 996", 1999, 2001),
    v("998", "ducati.superbike-classic.998", "998", "Ducati 998", 2002, 2004)
  ]),
  m("supersport", "SS / SuperSport", [
    v("750-carb", "ducati.supersport.750-carb", "750 SS carburettor", "Ducati 750 SS 1991", 1991, 1998),
    v("900-carb", "ducati.supersport.900-carb", "900 SS carburettor", "Ducati 900 SS 1990", 1990, 1998),
    v("750-ie", "ducati.supersport.750-ie", "750 SS i.e.", "Ducati 750 SS i.e.", 1999, 2002),
    v("900-ie", "ducati.supersport.900-ie", "900 SS i.e.", "Ducati 900 SS i.e.", 1999, 2002),
    v("800", "ducati.supersport.800", "800 SS", "Ducati 800 SS", 2003, 2007),
    v("1000-ds", "ducati.supersport.1000-ds", "1000 DS", "Ducati 1000 SS DS", 2003, 2006),
    v("939", "ducati.supersport.939", "SuperSport 939", "Ducati SuperSport 939", 2017, 2020),
    v("950", "ducati.supersport.950", "SuperSport 950", "Ducati SuperSport 950", 2021, 2025)
  ]),
  m("sport-touring", "ST Sport Touring", [
    v("st2", "ducati.sport-touring.st2", "ST2", "Ducati ST2", 1997, 2003),
    v("st4", "ducati.sport-touring.st4", "ST4", "Ducati ST4", 1999, 2003),
    v("st4s", "ducati.sport-touring.st4s", "ST4S", "Ducati ST4S", 2001, 2005),
    v("st3", "ducati.sport-touring.st3", "ST3", "Ducati ST3", 2004, 2007)
  ]),
  m("paso", "Paso", [
    v("906", "ducati.paso.906", "906 Paso", "Ducati 906 Paso", 1990, 1990),
    v("907-ie", "ducati.paso.907-ie", "907 i.e.", "Ducati 907 i.e.", 1990, 1992)
  ]),
  m("sportclassic", "SportClassic", [
    v("sport-1000", "ducati.sportclassic.sport-1000", "Sport 1000", "Ducati Sport 1000", 2006, 2009),
    v("gt-1000", "ducati.sportclassic.gt-1000", "GT 1000", "Ducati GT 1000", 2007, 2010),
    v("paul-smart", "ducati.sportclassic.paul-smart", "Paul Smart 1000 LE", "Ducati Paul Smart 1000 LE", 2006, 2006)
  ]),
  m("limited-road", "Limited-production road", [
    v("mh900e", "ducati.limited-road.mh900e", "MH900e", "Ducati MH900e", 2001, 2002),
    v("desmosedici-rr", "ducati.limited-road.desmosedici-rr", "Desmosedici RR", "Ducati Desmosedici RR", 2008, 2009)
  ]),
  m("hyperstrada", "Hyperstrada", [
    v("821", "ducati.hyperstrada.821", "821", "Hyperstrada 821", 2013, 2015),
    v("939", "ducati.hyperstrada.939", "939", "Hyperstrada 939", 2016, 2017)
  ]),
  m("xdiavel", "XDiavel", [
    v("1262", "ducati.xdiavel.1262", "1262", "XDiavel 1262", 2016, 2024),
    v("v4", "ducati.xdiavel.v4", "V4", "XDiavel V4", 2025, 2025)
  ]),
  m("scrambler-1100", "Scrambler 1100", [
    v("gen1", "ducati.scrambler-1100.gen1", "1100 — I", "Scrambler 1100 2018", 2018, 2020),
    v("pro", "ducati.scrambler-1100.pro", "1100 Pro", "Scrambler 1100 Pro", 2020, 2025),
    v("sport-pro", "ducati.scrambler-1100.sport-pro", "1100 Sport Pro", "Scrambler 1100 Sport Pro", 2020, 2025)
  ])
]);

addVariants("ducati", "monster", [
  v("m750", "ducati.monster.m750", "M750", "Monster M750", 1996, 2002),
  v("800", "ducati.monster.800", "800", "Monster 800", 2003, 2005),
  v("s2r-800", "ducati.monster.s2r-800", "S2R 800", "Monster S2R 800", 2005, 2007),
  v("s2r-1000", "ducati.monster.s2r-1000", "S2R 1000", "Monster S2R 1000", 2006, 2008),
  v("s4", "ducati.monster.s4", "S4", "Monster S4", 2001, 2003),
  v("s4r", "ducati.monster.s4r", "S4R", "Monster S4R", 2003, 2006),
  v("s4rs", "ducati.monster.s4rs", "S4RS", "Monster S4RS", 2006, 2008)
]);

addVariants("ducati", "multistrada", [
  v("620", "ducati.multistrada.620", "620", "Multistrada 620", 2005, 2006),
  v("950", "ducati.multistrada.950", "950", "Multistrada 950", 2017, 2021),
  v("v2", "ducati.multistrada.v2", "V2", "Multistrada V2", 2022, 2025)
]);

addVariants("ducati", "streetfighter", [
  v("v2", "ducati.streetfighter.v2", "V2", "Streetfighter V2", 2022, 2025)
]);

addVariants("ducati", "hypermotard", [
  v("796", "ducati.hypermotard.796", "796", "Hypermotard 796", 2010, 2012),
  v("698-mono", "ducati.hypermotard.698-mono", "698 Mono", "Hypermotard 698 Mono", 2024, 2025)
]);

addVariants("ducati", "scrambler", [
  v("full-throttle-1", "ducati.scrambler.full-throttle-1", "Full Throttle — I", "Scrambler Full Throttle 2015", 2015, 2022),
  v("full-throttle-2", "ducati.scrambler.full-throttle-2", "Full Throttle — II", "Scrambler Full Throttle 2023", 2023, 2025),
  v("cafe-racer", "ducati.scrambler.cafe-racer", "Café Racer", "Scrambler Café Racer", 2017, 2020),
  v("nightshift-1", "ducati.scrambler.nightshift-1", "Nightshift — I", "Scrambler Nightshift 2021", 2021, 2022),
  v("nightshift-2", "ducati.scrambler.nightshift-2", "Nightshift — II", "Scrambler Nightshift 2023", 2023, 2025)
]);

/* Ducati Completeness Wave 2: audited production and homologation gaps. */
addModels("ducati", [
  m("superbike-r", "Superbike R homologation", [
    v("996-r", "ducati.superbike-r.996-r", "996 R", "Ducati 996 R", 2001, 2001),
    v("998-r", "ducati.superbike-r.998-r", "998 R", "Ducati 998 R", 2002, 2002),
    v("999-r", "ducati.superbike-r.999-r", "999 R", "Ducati 999 R", 2003, 2006),
    v("1098-r", "ducati.superbike-r.1098-r", "1098 R", "Ducati 1098 R", 2008, 2009),
    v("1198-r", "ducati.superbike-r.1198-r", "1198 R", "Ducati 1198 R", 2010, 2011),
    v("panigale-r", "ducati.superbike-r.panigale-r", "Panigale R", "Ducati Panigale R", 2015, 2017),
    v("v4-r-1", "ducati.superbike-r.v4-r-1", "Panigale V4 R — I", "Panigale V4 R 2019", 2019, 2022),
    v("v4-r-2", "ducati.superbike-r.v4-r-2", "Panigale V4 R — II", "Panigale V4 R 2023", 2023, 2025)
  ]),
  m("superleggera", "Superleggera", [
    v("1199", "ducati.superleggera.1199", "1199 Superleggera", "Ducati 1199 Superleggera", 2014, 2014),
    v("1299", "ducati.superleggera.1299", "1299 Superleggera", "Ducati 1299 Superleggera", 2017, 2017),
    v("v4", "ducati.superleggera.v4", "Superleggera V4", "Ducati Superleggera V4", 2020, 2020)
  ]),
  m("multistrada-special", "Multistrada Enduro / performance", [
    v("1200-enduro", "ducati.multistrada-special.1200-enduro", "1200 Enduro", "Multistrada 1200 Enduro", 2016, 2018),
    v("1260-enduro", "ducati.multistrada-special.1260-enduro", "1260 Enduro", "Multistrada 1260 Enduro", 2019, 2021),
    v("v4-pikes-peak", "ducati.multistrada-special.v4-pikes-peak", "V4 Pikes Peak", "Multistrada V4 Pikes Peak", 2022, 2025),
    v("v4-rally", "ducati.multistrada-special.v4-rally", "V4 Rally", "Multistrada V4 Rally", 2023, 2025),
    v("v4-rs", "ducati.multistrada-special.v4-rs", "V4 RS", "Multistrada V4 RS", 2024, 2025)
  ])
]);

addVariants("ducati", "supersport", [
  v("600-carb", "ducati.supersport.600-carb", "600 SS carburettor", "Ducati 600 SS", 1994, 1998),
  v("900-superlight", "ducati.supersport.900-superlight", "900 Superlight", "Ducati 900 Superlight", 1992, 1998)
]);

addVariants("ducati", "monster", [
  v("1000", "ducati.monster.1000", "1000", "Monster 1000", 2003, 2005),
  v("1200-r", "ducati.monster.1200-r", "1200 R", "Monster 1200 R", 2016, 2019),
  v("937-sp", "ducati.monster.937-sp", "937 SP", "Monster SP 937", 2023, 2025)
]);

addVariants("ducati", "sport-touring", [
  v("st3s", "ducati.sport-touring.st3s", "ST3S", "Ducati ST3S", 2006, 2007)
]);

addVariants("ducati", "scrambler", [
  v("sixty2", "ducati.scrambler.sixty2", "Sixty2", "Scrambler Sixty2", 2016, 2021)
]);

addVariants("ducati", "sportclassic", [
  v("sport-1000-s", "ducati.sportclassic.sport-1000-s", "Sport 1000 S", "Ducati Sport 1000 S", 2007, 2009)
]);

addModels("triumph", [
  m("daytona", "Daytona", [v("675-1", "triumph.daytona.675-1", "675 — I", "Daytona 675 2006", 2006, 2008), v("675-2", "triumph.daytona.675-2", "675 — II", "Daytona 675 2009", 2009, 2012), v("675-3", "triumph.daytona.675-3", "675 — III", "Daytona 675 2013", 2013, 2017), v("660", "triumph.daytona.660", "660", "Daytona 660", 2024, 2025)]),
  m("trident-tiger-sport", "Trident / Tiger Sport", [v("trident-660", "triumph.trident-tiger-sport.trident-660", "Trident 660", "Trident 660", 2021, 2025), v("tiger-sport-660", "triumph.trident-tiger-sport.tiger-sport-660", "Tiger Sport 660", "Tiger Sport 660", 2022, 2025), v("tiger-sport-800", "triumph.trident-tiger-sport.tiger-sport-800", "Tiger Sport 800", "Tiger Sport 800", 2025, 2025)]),
  m("rocket", "Rocket", [v("iii-1", "triumph.rocket.iii-1", "Rocket III — I", "Rocket III 2004", 2004, 2009), v("iii-2", "triumph.rocket.iii-2", "Rocket III — II", "Rocket III 2010", 2010, 2018), v("3", "triumph.rocket.3", "Rocket 3", "Rocket 3", 2020, 2025)]),
  m("scrambler", "Scrambler", [v("865", "triumph.scrambler.865", "865", "Scrambler 865", 2006, 2016), v("900", "triumph.scrambler.900", "900", "Street Scrambler 900", 2017, 2025), v("1200-1", "triumph.scrambler.1200-1", "1200 — I", "Scrambler 1200 2019", 2019, 2023), v("1200-2", "triumph.scrambler.1200-2", "1200 — II", "Scrambler 1200 2024", 2024, 2025)])
]);

/* Triumph Wave 1: conservative MY1990–2025 road-production coverage.
   Official Triumph timeline/model archives establish the Hinckley launches;
   handbooks, brochures and period technical references corroborate boundaries. */
addModels("triumph", [
  m("trophy", "Trophy", [
    v("900", "triumph.trophy.900", "900", "Trophy 900", 1991, 2002),
    v("1200", "triumph.trophy.1200", "1200", "Trophy 1200", 1991, 2003)
  ]),
  m("trident", "Trident", [
    v("750", "triumph.trident.750", "750", "Trident 750", 1991, 1998),
    v("900", "triumph.trident.900", "900", "Trident 900", 1991, 1998)
  ]),
  m("sprint", "Sprint", [
    v("900", "triumph.sprint.900", "900", "Sprint 900", 1993, 1998),
    v("955i", "triumph.sprint.955i", "955i", "Sprint ST 955i", 1999, 2004),
    v("1050", "triumph.sprint.1050", "1050", "Sprint ST 1050", 2005, 2010),
    v("gt", "triumph.sprint.gt", "GT", "Sprint GT", 2010, 2013)
  ]),
  m("daytona-classic", "Daytona (classic)", [
    v("750", "triumph.daytona-classic.750", "750", "Daytona 750", 1991, 1992),
    v("900", "triumph.daytona-classic.900", "900", "Daytona 900", 1993, 1996),
    v("1000", "triumph.daytona-classic.1000", "1000", "Daytona 1000", 1991, 1993),
    v("1200", "triumph.daytona-classic.1200", "1200", "Daytona 1200", 1993, 1998),
    v("super-iii", "triumph.daytona-classic.super-iii", "Super III", "Daytona Super III", 1994, 1996),
    v("t595-955i", "triumph.daytona-classic.t595-955i", "T595 / 955i", "Daytona T595 / 955i", 1997, 2006),
    v("600", "triumph.daytona-classic.600", "600", "Daytona 600", 2003, 2005),
    v("650", "triumph.daytona-classic.650", "650", "Daytona 650", 2005, 2006),
    v("moto2-765", "triumph.daytona-classic.moto2-765", "Moto2 765", "Daytona Moto2 765", 2020, 2020)
  ]),
  m("thunderbird", "Thunderbird", [
    v("900", "triumph.thunderbird.900", "900", "Thunderbird 900", 1995, 2003),
    v("sport", "triumph.thunderbird.sport", "Sport", "Thunderbird Sport", 1997, 2004),
    v("1600", "triumph.thunderbird.1600", "1600", "Thunderbird 1600", 2009, 2011),
    v("storm", "triumph.thunderbird.storm", "Storm", "Thunderbird Storm", 2011, 2018),
    v("commander", "triumph.thunderbird.commander", "Commander", "Thunderbird Commander", 2014, 2018),
    v("lt", "triumph.thunderbird.lt", "LT", "Thunderbird LT", 2014, 2018)
  ]),
  m("legend-adventurer", "Legend / Adventurer", [
    v("legend", "triumph.legend-adventurer.legend", "Legend TT", "Legend TT", 1999, 2001),
    v("adventurer", "triumph.legend-adventurer.adventurer", "Adventurer", "Adventurer", 1996, 2001)
  ]),
  m("tt-speed-four", "TT / Speed Four", [
    v("tt600", "triumph.tt-speed-four.tt600", "TT600", "TT600", 2000, 2004),
    v("speed-four", "triumph.tt-speed-four.speed-four", "Speed Four", "Speed Four", 2002, 2006)
  ]),
  m("speedmaster", "Speedmaster", [
    v("865", "triumph.speedmaster.865", "865", "Speedmaster 865", 2003, 2016),
    v("1200", "triumph.speedmaster.1200", "1200", "Speedmaster 1200", 2018, 2025)
  ]),
  m("bobber", "Bobber", [
    v("1200", "triumph.bobber.1200", "1200", "Bonneville Bobber 1200", 2017, 2020),
    v("1200-2", "triumph.bobber.1200-2", "1200 — II", "Bonneville Bobber 1200 2021", 2021, 2025)
  ]),
  m("thruxton", "Thruxton", [
    v("900", "triumph.thruxton.900", "900", "Thruxton 900", 2004, 2015),
    v("1200", "triumph.thruxton.1200", "1200", "Thruxton 1200", 2016, 2019),
    v("r", "triumph.thruxton.r", "R", "Thruxton R", 2016, 2020),
    v("rs", "triumph.thruxton.rs", "RS", "Thruxton RS", 2020, 2024)
  ]),
  m("speed-twin", "Speed Twin", [
    v("1200", "triumph.speed-twin.1200", "1200", "Speed Twin 1200", 2019, 2024),
    v("900", "triumph.speed-twin.900", "900", "Street Twin / Speed Twin 900", 2016, 2025)
  ]),
  m("tiger-sport", "Tiger Sport", [
    v("1050", "triumph.tiger-sport.1050", "1050", "Tiger Sport 1050", 2013, 2020)
  ]),
  m("rocket-config", "Rocket III configurations", [
    v("classic", "triumph.rocket-config.classic", "Classic", "Rocket III Classic", 2006, 2010),
    v("touring", "triumph.rocket-config.touring", "Touring", "Rocket III Touring", 2008, 2018),
    v("roadster", "triumph.rocket-config.roadster", "Roadster", "Rocket III Roadster", 2010, 2018)
  ]),
  m("tiger-config", "Tiger road/adventure configurations", [
    v("800-xc", "triumph.tiger-config.800-xc", "800 XC", "Tiger 800 XC", 2011, 2019),
    v("800-xr", "triumph.tiger-config.800-xr", "800 XR", "Tiger 800 XR", 2015, 2019),
    v("900-gt", "triumph.tiger-config.900-gt", "900 GT", "Tiger 900 GT", 2020, 2025),
    v("900-rally", "triumph.tiger-config.900-rally", "900 Rally", "Tiger 900 Rally", 2020, 2025),
    v("1200-gt", "triumph.tiger-config.1200-gt", "1200 GT", "Tiger 1200 GT", 2022, 2025),
    v("1200-rally", "triumph.tiger-config.1200-rally", "1200 Rally", "Tiger 1200 Rally", 2022, 2025)
  ]),
  m("street-triple-config", "Street Triple performance configurations", [
    v("675-r-1", "triumph.street-triple-config.675-r-1", "675 R — I", "Street Triple 675 R 2009", 2009, 2012),
    v("675-r-2", "triumph.street-triple-config.675-r-2", "675 R — II", "Street Triple 675 R 2013", 2013, 2016),
    v("765-r", "triumph.street-triple-config.765-r", "765 R", "Street Triple 765 R", 2017, 2022),
    v("765-rs", "triumph.street-triple-config.765-rs", "765 RS", "Street Triple 765 RS", 2017, 2025),
    v("moto2", "triumph.street-triple-config.moto2", "Moto2 Edition", "Street Triple Moto2 Edition", 2023, 2023)
  ]),
  m("speed-triple-config", "Speed Triple performance configurations", [
    v("1050-r", "triumph.speed-triple-config.1050-r", "1050 R", "Speed Triple 1050 R", 2012, 2015),
    v("1050-rs", "triumph.speed-triple-config.1050-rs", "1050 RS", "Speed Triple 1050 RS", 2018, 2020),
    v("1200-rr", "triumph.speed-triple-config.1200-rr", "1200 RR", "Speed Triple 1200 RR", 2022, 2025)
  ]),
  m("speed-400", "Speed 400", [
    v("gen1", "triumph.speed-400.gen1", "400", "Speed 400", 2024, 2025)
  ]),
  m("scrambler-400", "Scrambler 400 X", [
    v("gen1", "triumph.scrambler-400.gen1", "400 X", "Scrambler 400 X", 2024, 2025)
  ]),

]);

addVariants("triumph", "bonneville", [
  v("t100-865", "triumph.bonneville.t100-865", "T100 865", "Bonneville T100 865", 2007, 2016)
]);

addVariants("triumph", "tiger-config", [
  v("900-gt-pro", "triumph.tiger-config.900-gt-pro", "900 GT Pro", "Tiger 900 GT Pro", 2020, 2025),
  v("900-rally-pro", "triumph.tiger-config.900-rally-pro", "900 Rally Pro", "Tiger 900 Rally Pro", 2020, 2025),
  v("1200-gt-pro", "triumph.tiger-config.1200-gt-pro", "1200 GT Pro", "Tiger 1200 GT Pro", 2022, 2025),
  v("1200-gt-explorer", "triumph.tiger-config.1200-gt-explorer", "1200 GT Explorer", "Tiger 1200 GT Explorer", 2022, 2025),
  v("1200-rally-pro", "triumph.tiger-config.1200-rally-pro", "1200 Rally Pro", "Tiger 1200 Rally Pro", 2022, 2025),
  v("1200-rally-explorer", "triumph.tiger-config.1200-rally-explorer", "1200 Rally Explorer", "Tiger 1200 Rally Explorer", 2022, 2025)
]);

addVariants("triumph", "rocket-config", [
  v("3-storm-r", "triumph.rocket-config.3-storm-r", "3 Storm R", "Rocket 3 Storm R", 2024, 2025),
  v("3-storm-gt", "triumph.rocket-config.3-storm-gt", "3 Storm GT", "Rocket 3 Storm GT", 2024, 2025)
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
