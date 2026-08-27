const assert = require("node:assert/strict");
const path = require("node:path");

const {
  MOTORCYCLE_AUDIT_COLUMNS,
  createReadOnlySupabaseClient,
  createRestSelectClient,
  runLegacyMotorcycleReadOnlyAudit,
  loadMotorcycleDatabase
} = require("../scripts/legacy-motorcycle-read-only-audit.js");

const database = loadMotorcycleDatabase(path.join(__dirname, ".."));
const databaseState = [{ id: "database-state-must-not-change" }];
database.motorcycles = databaseState;
let executorCalls = 0;
database.executeLegacyMigrationPlan = () => {
  executorCalls += 1;
  throw new Error("Read-only audit must not call the executor.");
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createFakeSelectClient(records) {
  const rows = clone(records);
  const initialRows = clone(rows);
  const calls = [];
  const blockedCalls = [];
  const blocked = name => () => {
    blockedCalls.push(name);
    throw new Error(`Fake write attempted: ${name}`);
  };

  return {
    rows,
    initialRows,
    calls,
    blockedCalls,
    client: {
      from(table) {
        calls.push({ type: "from", table });
        return {
          select(columns) {
            calls.push({ type: "select", columns });
            return {
              async order(column, options) {
                calls.push({ type: "order", column, options });
                return { data: clone(rows), error: null };
              }
            };
          },
          update: blocked("update"),
          insert: blocked("insert"),
          upsert: blocked("upsert"),
          delete: blocked("delete")
        };
      },
      rpc: blocked("rpc")
    }
  };
}

(async () => {
  const records = [
    {
      id: "legacy-fz1",
      brand: "Yamaha",
      model: "FZ1",
      year: 2006,
      catalog_variant_key: null
    },
    {
      id: "legacy-vfr",
      brand: "Honda",
      model: "VFR800 VTEC",
      year: 2002,
      catalog_variant_key: null
    },
    {
      id: "legacy-fz1s",
      brand: "Yamaha",
      model: "FZ1-S",
      year: 2006,
      catalog_variant_key: null
    },
    {
      id: "mapped",
      brand: "Honda",
      model: "VFR800 VTEC",
      year: 2002,
      catalog_variant_key: "honda.vfr800.rc46.vtec.gen1"
    }
  ];
  const fake = createFakeSelectClient(records);
  const report = await runLegacyMotorcycleReadOnlyAudit(
    fake.client,
    database
  );

  assert.deepEqual(fake.calls, [
    { type: "from", table: "motorcycles" },
    { type: "select", columns: MOTORCYCLE_AUDIT_COLUMNS },
    {
      type: "order",
      column: "created_at",
      options: { ascending: true }
    }
  ]);
  assert.deepEqual(fake.rows, fake.initialRows);
  assert.equal(executorCalls, 0);
  assert.equal(database.motorcycles, databaseState);
  assert.equal(report.requestCount, 1);
  assert.equal(report.inputUnchanged, true);
  assert.equal(report.validation.valid, true);
  assert.deepEqual(
    {
      total: report.analysis.total,
      alreadyMigrated: report.analysis.alreadyMigrated,
      unique: report.analysis.unique,
      ambiguous: report.analysis.ambiguous,
      notFound: report.analysis.notFound
    },
    {
      total: 4,
      alreadyMigrated: 1,
      unique: 2,
      ambiguous: 0,
      notFound: 1
    }
  );
  assert.deepEqual(
    {
      total: report.plan.total,
      safeToMigrate: report.plan.safeToMigrate,
      skippedAlreadyMigrated: report.plan.skippedAlreadyMigrated,
      skippedAmbiguous: report.plan.skippedAmbiguous,
      skippedNotFound: report.plan.skippedNotFound,
      skippedMissingId: report.plan.skippedMissingId
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
  assert.deepEqual(clone(report.plan.operations), [
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

  const guardFake = createFakeSelectClient([]);
  const readOnly = createReadOnlySupabaseClient(guardFake.client);
  const table = readOnly.from("motorcycles");

  for (const method of ["update", "insert", "upsert", "delete", "rpc"]) {
    assert.throws(() => table[method]({}), /Read-only audit blocks/);
  }
  assert.throws(() => readOnly.update({}), /Read-only audit blocks/);
  assert.throws(() => readOnly.insert({}), /Read-only audit blocks/);
  assert.throws(() => readOnly.upsert({}), /Read-only audit blocks/);
  assert.throws(() => readOnly.delete({}), /Read-only audit blocks/);
  assert.throws(() => readOnly.rpc("unsafe"), /Read-only audit blocks/);
  assert.deepEqual(guardFake.rows, guardFake.initialRows);

  const fetchCalls = [];
  const restClient = createRestSelectClient({
    url: "https://example.supabase.co",
    key: "public-test-key",
    accessToken: "user-session-test-token",
    async fetchImpl(url, options) {
      fetchCalls.push({ url: String(url), options });
      return {
        ok: true,
        async json() { return []; }
      };
    }
  });
  const restResponse = await createReadOnlySupabaseClient(restClient)
    .from("motorcycles")
    .select(MOTORCYCLE_AUDIT_COLUMNS)
    .order("created_at", { ascending: true });
  assert.deepEqual(restResponse, { data: [], error: null });
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].options.method, "GET");
  assert.match(fetchCalls[0].url, /\/rest\/v1\/motorcycles\?/);
  assert.match(fetchCalls[0].url, /order=created_at\.asc/);

  console.log(JSON.stringify({
    selectAllowed: true,
    restMethodIsGet: true,
    writesBlocked: true,
    rpcBlocked: true,
    executorNotCalled: executorCalls === 0,
    fakeDataUnchanged: true,
    databaseStateUnchanged: database.motorcycles === databaseState,
    analysis: report.analysis,
    plan: report.plan,
    validation: report.validation,
    status: "OK"
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
