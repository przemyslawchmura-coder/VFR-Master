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

const catalog = context.MotorcycleCatalog;
const database = context.MotorcycleDatabase;
const databaseState = [{ id: "state-must-not-change" }];
database.motorcycles = databaseState;
context.supabaseClient = new Proxy({}, {
  get() {
    throw new Error("Dry-run nie może używać klienta Supabase.");
  }
});

const motorcycles = [
  {
    id: "legacy-fz1",
    brand: "Yamaha",
    model: "FZ1",
    year: 2006,
    catalogVariantKey: null
  },
  {
    id: "legacy-vfr",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  },
  {
    id: "legacy-fz1s",
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2006,
    catalogVariantKey: null
  },
  {
    id: "already-migrated",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  }
];
const inputObjectReferences = [...motorcycles];
const inputSnapshot = JSON.stringify(motorcycles);
const plan = JSON.parse(JSON.stringify(
  database.prepareLegacyMigration(motorcycles)
));

function assertPlanAccounting(migrationPlan) {
  const skippedTotal =
    migrationPlan.skippedAlreadyMigrated +
    migrationPlan.skippedAmbiguous +
    migrationPlan.skippedNotFound +
    migrationPlan.skippedMissingId;

  assert.equal(
    migrationPlan.total,
    migrationPlan.safeToMigrate + skippedTotal
  );
  assert.equal(
    migrationPlan.operations.length,
    migrationPlan.safeToMigrate
  );
  assert.equal(migrationPlan.skipped.length, skippedTotal);

  const operationIds = new Set(
    migrationPlan.operations.map(operation => operation.id)
  );
  migrationPlan.skipped.forEach(skipped => {
    if (skipped.id !== null) {
      assert.equal(operationIds.has(skipped.id), false);
    }
  });
}

assertPlanAccounting(plan);

assert.deepEqual(
  {
    total: plan.total,
    safeToMigrate: plan.safeToMigrate,
    skippedAlreadyMigrated: plan.skippedAlreadyMigrated,
    skippedAmbiguous: plan.skippedAmbiguous,
    skippedNotFound: plan.skippedNotFound,
    skippedMissingId: plan.skippedMissingId
  },
  {
    total: 4,
    safeToMigrate: 2,
    skippedAlreadyMigrated: 1,
    skippedAmbiguous: 0,
    skippedNotFound: 1,
    skippedMissingId: 0
  }
);
assert.deepEqual(plan.operations, [
  {
    id: "legacy-vfr",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  },
  {
    id: "legacy-fz1s",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "yamaha.fz1.gen2.s"
  }
]);
assert.deepEqual(plan.skipped, [
  {
    id: "legacy-fz1",
    brand: "Yamaha",
    model: "FZ1",
    year: 2006,
    status: "not_found",
    reason: "not_found"
  },
  {
    id: "already-migrated",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    status: "already_migrated",
    reason: "already_migrated"
  }
]);

const withoutId = [{
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKey: null
}];
const withoutIdSnapshot = JSON.stringify(withoutId);
const missingIdPlan = JSON.parse(JSON.stringify(
  database.prepareLegacyMigration(withoutId)
));
assert.equal(missingIdPlan.safeToMigrate, 0);
assert.equal(missingIdPlan.skippedMissingId, 1);
assert.deepEqual(missingIdPlan.operations, []);
assert.equal(missingIdPlan.skipped[0].status, "unique");
assert.equal(missingIdPlan.skipped[0].reason, "missing_id");
assert.equal(JSON.stringify(withoutId), withoutIdSnapshot);
assertPlanAccounting(missingIdPlan);

const vfrModel = catalog.getModel("honda", "vfr800");
vfrModel.variants.push({
  id: "synthetic-conflict",
  key: "test.synthetic.conflict",
  name: "Synthetic conflict",
  storedModel: "VFR800 VTEC",
  yearFrom: 2002,
  yearTo: 2002
});
const ambiguousPlan = JSON.parse(JSON.stringify(
  database.prepareLegacyMigration([{
    id: "ambiguous",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  }])
));
vfrModel.variants.pop();
assert.equal(ambiguousPlan.safeToMigrate, 0);
assert.equal(ambiguousPlan.skippedAmbiguous, 1);
assert.deepEqual(ambiguousPlan.operations, []);
assert.equal(ambiguousPlan.skipped[0].reason, "ambiguous");
assertPlanAccounting(ambiguousPlan);

const originalAnalyzeLegacyMotorcycles =
  database.analyzeLegacyMotorcycles;
database.analyzeLegacyMotorcycles = () => ({
  total: 1,
  results: [{
    id: "defense-in-depth",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    currentCatalogVariantKey: "existing.catalog.key",
    status: "unique",
    proposedCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1",
    candidateCount: 1,
    candidates: []
  }]
});
const defenseInDepthPlan = JSON.parse(JSON.stringify(
  database.prepareLegacyMigration([])
));
database.analyzeLegacyMotorcycles = originalAnalyzeLegacyMotorcycles;
assert.equal(defenseInDepthPlan.safeToMigrate, 0);
assert.equal(defenseInDepthPlan.skippedAlreadyMigrated, 1);
assert.deepEqual(defenseInDepthPlan.operations, []);
assert.equal(
  defenseInDepthPlan.skipped[0].reason,
  "current_key_present"
);
assertPlanAccounting(defenseInDepthPlan);

assert.equal(JSON.stringify(motorcycles), inputSnapshot);
inputObjectReferences.forEach((reference, index) => {
  assert.equal(motorcycles[index], reference);
});
assert.equal(database.motorcycles, databaseState);
assert.deepEqual(database.motorcycles, [{ id: "state-must-not-change" }]);

console.log(JSON.stringify({
  plan,
  missingId: missingIdPlan.skipped[0],
  ambiguous: ambiguousPlan.skipped[0],
  defenseInDepth: defenseInDepthPlan.skipped[0],
  counterEquations: true,
  inputObjectReferencesUnchanged: true,
  inputNotModified: true,
  databaseStateNotModified: true,
  supabaseNotCalled: true,
  status: "OK"
}, null, 2));
