const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createContext() {
  const context = {
    window: {},
    localStorage: {
      getItem() { return null; },
      setItem() {}
    },
    console: {
      error() {},
      log() {}
    }
  };
  context.window = context;
  vm.createContext(context);
  return context;
}

function load(context, relativePath) {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
}

function createSupabaseMock({ insertResponses = [], loadResponses = [] }) {
  const inserts = [];
  const selects = [];
  const insertQueue = [...insertResponses];
  const loadQueue = [...loadResponses];

  return {
    inserts,
    selects,
    client: {
      auth: {
        async getSession() {
          return {
            data: { session: { user: { id: "user-1" } } },
            error: null
          };
        }
      },
      from(table) {
        assert.equal(table, "motorcycles");
        return {
          insert(payload) {
            inserts.push(payload);
            return {
              select(columns) {
                selects.push(columns);
                return {
                  async single() {
                    return insertQueue.shift();
                  }
                };
              }
            };
          },
          select(columns) {
            selects.push(columns);
            return {
              async order() {
                return loadQueue.shift();
              }
            };
          }
        };
      }
    }
  };
}

const context = createContext();
load(context, "data/motorcycle-catalog.js");
load(context, "js/motorcycle-catalog.js");
load(context, "js/database.js");
load(context, "js/technical-database.js");
load(context, "js/technical.js");
load(context, "data/yamaha-fz1.js");

const catalog = context.MotorcycleCatalog;
const database = context.MotorcycleDatabase;
const honda = catalog.resolve("honda", "vfr800", "vtec", 2002);

assert.equal(
  honda.catalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);

const payload = database.serializeMotorcycle(honda, "user-1");
assert.equal(
  payload.catalog_variant_key,
  "honda.vfr800.rc46.vtec.gen1"
);
assert.equal(payload.brand, "Honda");
assert.equal(payload.model, "VFR800 VTEC");
assert.equal(payload.year, 2002);

const roundTrip = database.deserializeMotorcycle(
  database.serializeMotorcycle(honda, "user-1")
);
assert.equal(roundTrip.catalogVariantKey, honda.catalogVariantKey);

const deserialized = database.deserializeMotorcycle({
    id: "bike-1",
    catalog_variant_key: "honda.vfr800.rc46.vtec.gen1"
  });
assert.equal(
  deserialized.catalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);
assert.equal(Object.hasOwn(deserialized, "catalog_variant_key"), false);
assert.equal(
  database.deserializeMotorcycle({
    id: "legacy-null",
    catalog_variant_key: null
  }).catalogVariantKey,
  null
);
assert.equal(
  database.deserializeMotorcycle({ id: "legacy-missing" })
    .catalogVariantKey,
  null
);

assert.equal(
  context.TechnicalDatabase.getForMotorcycle(honda),
  context.VFRTechnical
);

const missingColumnError = {
  code: "PGRST204",
  message: "Could not find the 'catalog_variant_key' column"
};
const savedLegacyRow = {
  id: "bike-legacy",
  user_id: "user-1",
  brand: honda.brand,
  model: honda.model,
  year: honda.year,
  mileage: 0,
  vin: null,
  nickname: null,
  created_at: "2026-01-01"
};
const fallbackMock = createSupabaseMock({
  insertResponses: [{ data: null, error: missingColumnError }]
});
context.supabaseClient = fallbackMock.client;
database.motorcycles = [];
database.activeMotorcycleId = null;

(async () => {
  const saved = await database.add(honda);
  assert.equal(saved, null);
  assert.equal(fallbackMock.inserts.length, 1);
  assert.equal(
    fallbackMock.inserts[0].catalog_variant_key,
    "honda.vfr800.rc46.vtec.gen1"
  );

  const invalidSelection = await database.add({
    ...honda,
    catalogVariantKey: "missing.variant"
  });
  assert.equal(invalidSelection, null);
  assert.equal(fallbackMock.inserts.length, 1);

  const negativeMileage = await database.add({ ...honda, mileage: -1 });
  assert.equal(negativeMileage, null);
  assert.equal(fallbackMock.inserts.length, 1);

  const unrelatedError = {
    code: "42501",
    message: "new row violates row-level security policy"
  };
  const unrelatedMock = createSupabaseMock({
    insertResponses: [{ data: null, error: unrelatedError }]
  });
  context.supabaseClient = unrelatedMock.client;
  const rejected = await database.add(honda);
  assert.equal(rejected, null);
  assert.equal(unrelatedMock.inserts.length, 1);
  assert.equal(database.lastError, unrelatedError.message);

  const loadMock = createSupabaseMock({
    loadResponses: [
      { data: null, error: missingColumnError },
      { data: [savedLegacyRow], error: null }
    ]
  });
  context.supabaseClient = loadMock.client;
  assert.equal(await database.load(), true);
  assert.equal(loadMock.selects.length, 2);
  assert.equal(database.getAll()[0].catalogVariantKey, null);

  const falsePositiveMock = createSupabaseMock({
    insertResponses: [{
      data: null,
      error: {
        code: "PGRST204",
        message: "Could not find the 'different_column' column"
      }
    }]
  });
  context.supabaseClient = falsePositiveMock.client;
  assert.equal(await database.add(honda), null);
  assert.equal(falsePositiveMock.inserts.length, 1);

  console.log(JSON.stringify({
    catalogMapping: true,
    serialization: true,
    deserialization: true,
    legacyNull: true,
    legacyMissingProperty: true,
    technicalDatabaseLegacyMatching: true,
    missingColumnInsertRejected: true,
    missingColumnLoadFallback: true,
    unrelatedErrorsNotMasked: true,
    fallbackRestrictedToCatalogColumn: true,
    catalogValidationBeforeInsert: true,
    mileageValidationBeforeInsert: true,
    catalogVariantKeyRoundTrip: true,
    status: "OK"
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
