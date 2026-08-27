const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = { window: {} };
context.window = context;
vm.createContext(context);

[
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js",
  "js/technical-database.js",
  "js/technical.js",
  "data/yamaha-fz1.js"
].forEach(relativePath => {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
});

const catalog = context.MotorcycleCatalog;
const technicalDatabase = context.TechnicalDatabase;

const hondaCatalog = catalog.resolve(
  "honda", "vfr800", "vtec", 2002
);
assert.equal(
  technicalDatabase.getForMotorcycle(hondaCatalog),
  context.VFRTechnical
);

assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  }),
  context.VFRTechnical
);
assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: ""
  }),
  context.VFRTechnical
);
assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002
  }),
  context.VFRTechnical
);

assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2002,
    catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  }),
  context.VFRTechnical,
  "catalogVariantKey powinien mieć pierwszeństwo przed polami tekstowymi"
);

assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: "test.unsupported.catalog-variant"
  }),
  null,
  "Nieobsługiwany klucz nie może uruchomić legacy matching"
);

const yamahaN = catalog.resolve("yamaha", "fz1", "n", 2010);
const yamahaS = catalog.resolve("yamaha", "fz1", "s", 2010);
assert.equal(
  technicalDatabase.getForMotorcycle(yamahaN),
  context.YamahaFZ1NTechnical
);
assert.equal(
  technicalDatabase.getForMotorcycle(yamahaS),
  context.YamahaFZ1STechnical
);

assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Yamaha",
    model: "FZ1-N",
    year: 2010
  }),
  context.YamahaFZ1NTechnical
);
assert.equal(
  technicalDatabase.getForMotorcycle({
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2010,
    catalogVariantKey: null
  }),
  context.YamahaFZ1STechnical
);

const unsupportedCatalogBike = catalog.resolve(
  "yamaha", "mt-07", "gen1", 2015
);
assert.ok(unsupportedCatalogBike);
assert.equal(
  technicalDatabase.getForMotorcycle(unsupportedCatalogBike),
  null
);

assert.equal(
  technicalDatabase.getForMotorcycle({
    ...hondaCatalog,
    year: 2003
  }),
  null,
  "Klucz katalogowy nie może ominąć zakresu roczników profilu"
);

const registeredCatalogKeys = technicalDatabase.registrations
  .flatMap(registration => registration.catalogVariantKeys);
[
  "honda.vfr800.rc46.vtec.gen1",
  "yamaha.fz1.gen2.n",
  "yamaha.fz1.gen2.s"
].forEach(catalogVariantKey => {
  assert.equal(
    registeredCatalogKeys.filter(
      value => value === catalogVariantKey
    ).length,
    1,
    `${catalogVariantKey} powinien mieć dokładnie jedną rejestrację`
  );
});

const testDatabaseA = {
  model: { brand: "Test", model: "A" },
  getCategory() { return null; },
  getCategoryList() { return []; }
};
const testDatabaseB = {
  model: { brand: "Test", model: "B" },
  getCategory() { return null; },
  getCategoryList() { return []; }
};

technicalDatabase.register({
  brand: "Test",
  model: "Profile A",
  yearFrom: 2000,
  yearTo: 2010,
  catalogVariantKeys: ["test.conflict.variant"],
  database: testDatabaseA
});
assert.throws(
  () => technicalDatabase.register({
    brand: "Test",
    model: "Profile B",
    yearFrom: 2010,
    yearTo: 2020,
    catalogVariantKeys: ["test.conflict.variant"],
    database: testDatabaseB
  }),
  /nakładające się profile techniczne/
);

console.log(JSON.stringify({
  hondaCatalogKey: true,
  hondaLegacyNull: true,
  hondaLegacyMissingProperty: true,
  hondaLegacyEmptyKey: true,
  catalogKeyPrecedence: true,
  unsupportedKeyBlocksLegacyFallback: true,
  yamahaNCatalogKey: true,
  yamahaSCatalogKey: true,
  yamahaNLegacy: true,
  yamahaSLegacy: true,
  catalogBikeWithoutProfile: true,
  profileYearRangeProtected: true,
  registeredKeysGloballyUnambiguous: true,
  overlappingCatalogKeyRejected: true,
  status: "OK"
}, null, 2));
