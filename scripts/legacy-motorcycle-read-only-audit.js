#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MOTORCYCLE_AUDIT_COLUMNS =
  "id, brand, model, year, catalog_variant_key";
const CATALOG_VARIANT_KEY_PATTERN =
  /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

function blockedOperation(name) {
  return () => {
    throw new Error(
      `Read-only audit blocks Supabase operation: ${name}.`
    );
  };
}

function createReadOnlySupabaseClient(client) {
  if (!client || typeof client.from !== "function") {
    throw new Error("Read-only audit requires an explicit client.");
  }

  return Object.freeze({
    from(table) {
      const query = client.from(table);

      if (!query || typeof query.select !== "function") {
        throw new Error("Read-only client does not support SELECT.");
      }

      return Object.freeze({
        select(columns) {
          const selection = query.select(columns);

          if (!selection || typeof selection.order !== "function") {
            throw new Error("Read-only SELECT does not support ordering.");
          }

          return Object.freeze({
            order(column, options) {
              return selection.order(column, options);
            },
            update: blockedOperation("update"),
            insert: blockedOperation("insert"),
            upsert: blockedOperation("upsert"),
            delete: blockedOperation("delete"),
            rpc: blockedOperation("rpc")
          });
        },
        update: blockedOperation("update"),
        insert: blockedOperation("insert"),
        upsert: blockedOperation("upsert"),
        delete: blockedOperation("delete"),
        rpc: blockedOperation("rpc")
      });
    },
    update: blockedOperation("update"),
    insert: blockedOperation("insert"),
    upsert: blockedOperation("upsert"),
    delete: blockedOperation("delete"),
    rpc: blockedOperation("rpc")
  });
}

function validateMigrationPreview(analysis, plan) {
  const operationIds = new Set();
  const excludedIds = new Set(
    analysis.results
      .filter(result => result.status !== "unique")
      .map(result => result.id)
      .filter(id => id !== null)
  );
  const errors = [];

  plan.operations.forEach(operation => {
    const idIsValid =
      typeof operation.id === "string" && operation.id.trim() !== "";
    const targetIsValid =
      typeof operation.toCatalogVariantKey === "string" &&
      CATALOG_VARIANT_KEY_PATTERN.test(operation.toCatalogVariantKey);
    const sourceIsEmpty =
      operation.fromCatalogVariantKey === null ||
      operation.fromCatalogVariantKey === undefined ||
      (
        typeof operation.fromCatalogVariantKey === "string" &&
        operation.fromCatalogVariantKey.trim() === ""
      );

    if (!idIsValid) errors.push("operation_invalid_id");
    if (!targetIsValid) errors.push("operation_invalid_target_key");
    if (!sourceIsEmpty) errors.push("operation_source_key_present");
    if (operationIds.has(operation.id)) errors.push("duplicate_operation_id");
    if (excludedIds.has(operation.id)) errors.push("excluded_record_in_operations");
    operationIds.add(operation.id);
  });

  const skippedTotal =
    plan.skippedAlreadyMigrated +
    plan.skippedAmbiguous +
    plan.skippedNotFound +
    plan.skippedMissingId;

  if (plan.total !== plan.safeToMigrate + skippedTotal) {
    errors.push("plan_counter_mismatch");
  }
  if (plan.operations.length !== plan.safeToMigrate) {
    errors.push("operation_counter_mismatch");
  }
  if (plan.skipped.length !== skippedTotal) {
    errors.push("skipped_counter_mismatch");
  }

  return {
    valid: errors.length === 0,
    errors,
    duplicateOperationIds: errors.includes("duplicate_operation_id"),
    targetKeysValid: !errors.includes("operation_invalid_target_key")
  };
}

async function runLegacyMotorcycleReadOnlyAudit(client, database) {
  if (
    !database ||
    typeof database.analyzeLegacyMotorcycles !== "function" ||
    typeof database.prepareLegacyMigration !== "function"
  ) {
    throw new Error("MotorcycleDatabase audit functions are required.");
  }

  const readOnlyClient = createReadOnlySupabaseClient(client);
  const { data, error } = await readOnlyClient
    .from("motorcycles")
    .select(MOTORCYCLE_AUDIT_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!Array.isArray(data)) {
    throw new Error("Supabase SELECT did not return an array.");
  }

  const motorcycles = data.map(record =>
    database.deserializeMotorcycle(record)
  );
  const snapshot = JSON.stringify(motorcycles);
  const references = [...motorcycles];
  const analysis = database.analyzeLegacyMotorcycles(motorcycles);
  const plan = database.prepareLegacyMigration(motorcycles);
  const inputUnchanged =
    JSON.stringify(motorcycles) === snapshot &&
    references.every((record, index) => motorcycles[index] === record);
  const validation = validateMigrationPreview(analysis, plan);

  if (!inputUnchanged) {
    throw new Error("Read-only analysis modified its input.");
  }
  if (!validation.valid) {
    throw new Error(
      `Unsafe migration preview: ${validation.errors.join(", ")}`
    );
  }

  return {
    requestCount: 1,
    selectedColumns: MOTORCYCLE_AUDIT_COLUMNS,
    inputUnchanged,
    analysis,
    plan,
    validation
  };
}

function createRestSelectClient({ url, key, accessToken, fetchImpl }) {
  if (!url || !key || !accessToken || typeof fetchImpl !== "function") {
    throw new Error(
      "Set VFR_AUDIT_SUPABASE_URL, VFR_AUDIT_SUPABASE_PUBLISHABLE_KEY " +
      "and VFR_AUDIT_SUPABASE_ACCESS_TOKEN for an authenticated read-only audit."
    );
  }

  return {
    from(table) {
      return {
        select(columns) {
          return {
            async order(column, { ascending } = {}) {
              const endpoint = new URL(
                `/rest/v1/${encodeURIComponent(table)}`,
                url
              );
              endpoint.searchParams.set("select", columns);
              endpoint.searchParams.set(
                "order",
                `${column}.${ascending === false ? "desc" : "asc"}`
              );
              const response = await fetchImpl(endpoint, {
                method: "GET",
                headers: {
                  apikey: key,
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json"
                }
              });
              const body = await response.json();

              return response.ok
                ? { data: body, error: null }
                : {
                    data: null,
                    error: {
                      message: body.message || `HTTP ${response.status}`
                    }
                  };
            }
          };
        }
      };
    }
  };
}

function loadMotorcycleDatabase(repositoryRoot) {
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
    const filename = path.join(repositoryRoot, relativePath);
    vm.runInContext(fs.readFileSync(filename, "utf8"), context, {
      filename: relativePath
    });
  });

  return context.MotorcycleDatabase;
}

async function main() {
  const client = createRestSelectClient({
    url: process.env.VFR_AUDIT_SUPABASE_URL,
    key: process.env.VFR_AUDIT_SUPABASE_PUBLISHABLE_KEY,
    accessToken: process.env.VFR_AUDIT_SUPABASE_ACCESS_TOKEN,
    fetchImpl: globalThis.fetch
  });
  const database = loadMotorcycleDatabase(path.join(__dirname, ".."));
  const report = await runLegacyMotorcycleReadOnlyAudit(client, database);
  console.log(JSON.stringify(report, null, 2));
}

module.exports = {
  MOTORCYCLE_AUDIT_COLUMNS,
  createReadOnlySupabaseClient,
  validateMigrationPreview,
  runLegacyMotorcycleReadOnlyAudit,
  createRestSelectClient,
  loadMotorcycleDatabase
};

if (require.main === module) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
