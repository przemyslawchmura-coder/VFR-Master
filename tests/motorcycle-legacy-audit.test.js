const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = {
  window: {},
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  console
};
context.window = context;
vm.createContext(context);

[
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js",
  "js/database.js"
].forEach(relativePath => {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
});

const database = context.MotorcycleDatabase;
const motorcycles = [
  {
    id: "new-honda",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  },
  {
    id: "legacy-honda",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  },
  {
    id: "legacy-yamaha",
    brand: "Yamaha",
    model: "FZ1-N",
    year: 2010
  },
  {
    id: "manual",
    brand: "Mój motocykl",
    model: "Custom",
    year: 2005,
    catalogVariantKey: null
  },
  {
    id: "missing-year",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: null,
    catalogVariantKey: null
  }
];
const inputSnapshot = JSON.stringify(motorcycles);
const databaseState = [{ id: "state-must-not-change" }];
database.motorcycles = databaseState;
context.supabaseClient = new Proxy({}, {
  get() {
    throw new Error("Audyt nie może używać klienta Supabase.");
  }
});

const report = JSON.parse(JSON.stringify(
  database.analyzeLegacyMotorcycles(motorcycles)
));

assert.deepEqual(
  {
    total: report.total,
    alreadyMigrated: report.alreadyMigrated,
    unique: report.unique,
    ambiguous: report.ambiguous,
    notFound: report.notFound
  },
  {
    total: 5,
    alreadyMigrated: 1,
    unique: 2,
    ambiguous: 0,
    notFound: 2
  }
);

const byId = Object.fromEntries(
  report.results.map(result => [result.id, result])
);

assert.equal(byId["new-honda"].status, "already_migrated");
assert.equal(
  byId["new-honda"].currentCatalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);
assert.equal(byId["new-honda"].proposedCatalogVariantKey, null);

assert.equal(byId["legacy-honda"].status, "unique");
assert.equal(
  byId["legacy-honda"].proposedCatalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);
assert.equal(byId["legacy-honda"].currentCatalogVariantKey, null);

assert.equal(byId["legacy-yamaha"].status, "unique");
assert.equal(
  byId["legacy-yamaha"].proposedCatalogVariantKey,
  "yamaha.fz1.gen2.n"
);
assert.equal(byId["legacy-yamaha"].currentCatalogVariantKey, null);

assert.equal(byId.manual.status, "not_found");
assert.equal(byId.manual.proposedCatalogVariantKey, null);
assert.equal(byId["missing-year"].status, "not_found");
assert.equal(byId["missing-year"].proposedCatalogVariantKey, null);

assert.equal(JSON.stringify(motorcycles), inputSnapshot);
assert.equal(database.motorcycles, databaseState);
assert.deepEqual(database.motorcycles, [{ id: "state-must-not-change" }]);

// Anonimowe wartości odczytane ręcznie z produkcyjnego Supabase.
// Test nie zawiera id, user_id ani żadnych UUID i nie łączy się z bazą.
const productionLegacyRecords = [
  {
    brand: "Yamaha",
    model: "FZ1",
    year: 2006,
    catalogVariantKey: null
  },
  {
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  },
  {
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2006,
    catalogVariantKey: null
  }
];
const productionInputSnapshot = JSON.stringify(productionLegacyRecords);
const productionReport = JSON.parse(JSON.stringify(
  database.analyzeLegacyMotorcycles(productionLegacyRecords)
));

assert.deepEqual(
  {
    total: productionReport.total,
    alreadyMigrated: productionReport.alreadyMigrated,
    unique: productionReport.unique,
    ambiguous: productionReport.ambiguous,
    notFound: productionReport.notFound
  },
  {
    total: 3,
    alreadyMigrated: 0,
    unique: 2,
    ambiguous: 0,
    notFound: 1
  }
);

const productionFz1 = productionReport.results[0];
assert.equal(productionFz1.status, "not_found");
assert.equal(productionFz1.candidateCount, 0);
assert.deepEqual(productionFz1.candidates, []);
assert.equal(productionFz1.proposedCatalogVariantKey, null);

const productionHonda = productionReport.results[1];
assert.equal(productionHonda.status, "unique");
assert.equal(productionHonda.candidateCount, 1);
assert.equal(
  productionHonda.proposedCatalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);

const productionFz1S = productionReport.results[2];
assert.equal(productionFz1S.status, "unique");
assert.equal(productionFz1S.candidateCount, 1);
assert.equal(
  productionFz1S.proposedCatalogVariantKey,
  "yamaha.fz1.gen2.s"
);

productionReport.results.forEach(result => {
  assert.equal(
    result.proposedCatalogVariantKey !== null,
    result.status === "unique"
  );
});
assert.equal(JSON.stringify(productionLegacyRecords), productionInputSnapshot);
assert.equal(database.motorcycles, databaseState);

console.log(JSON.stringify({
  total: report.total,
  alreadyMigrated: report.alreadyMigrated,
  unique: report.unique,
  ambiguous: report.ambiguous,
  notFound: report.notFound,
  inputNotModified: true,
  databaseStateNotModified: true,
  supabaseNotCalled: true,
  productionLegacyRecords: {
    total: productionReport.total,
    alreadyMigrated: productionReport.alreadyMigrated,
    unique: productionReport.unique,
    ambiguous: productionReport.ambiguous,
    notFound: productionReport.notFound,
    fz1Status: productionFz1.status,
    hondaProposal: productionHonda.proposedCatalogVariantKey,
    fz1SProposal: productionFz1S.proposedCatalogVariantKey
  },
  status: "OK"
}, null, 2));
