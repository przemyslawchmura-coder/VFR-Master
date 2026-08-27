#!/usr/bin/env node

const path = require("node:path");

const {
  MOTORCYCLE_AUDIT_COLUMNS,
  createReadOnlySupabaseClient,
  createRestSelectClient,
  loadMotorcycleDatabase,
  runLegacyMotorcycleReadOnlyAudit,
  validateMigrationPreview
} = require("./legacy-motorcycle-read-only-audit.js");

const EXPECTED_TARGET_KEYS = Object.freeze([
  "honda.vfr800.rc46.vtec.gen1",
  "yamaha.fz1.gen2.s"
]);

function evaluateControlledMigrationReadiness({
  analysis,
  plan,
  initialMotorcycles,
  currentMotorcycles,
  database
}) {
  const errors = [];
  const validation = validateMigrationPreview(analysis, plan);
  const operations = Array.isArray(plan.operations) ? plan.operations : [];
  const operationIds = new Set();
  const expectedTargets = new Set(EXPECTED_TARGET_KEYS);
  const actualTargets = new Set(
    operations.map(operation => operation.toCatalogVariantKey)
  );

  if (!validation.valid) errors.push(...validation.errors);
  if (analysis.total !== 3) errors.push("unexpected_total");
  if (analysis.alreadyMigrated !== 1) {
    errors.push("unexpected_already_migrated");
  }
  if (analysis.unique !== 2) errors.push("unexpected_unique");
  if (analysis.ambiguous !== 0) errors.push("ambiguous_records_present");
  if (analysis.notFound !== 0) errors.push("not_found_records_present");
  if (plan.safeToMigrate !== 2) errors.push("unexpected_safe_count");
  if (operations.length !== 2) errors.push("unexpected_operation_count");
  if (plan.skippedAlreadyMigrated !== 1) {
    errors.push("unexpected_already_migrated_skip_count");
  }
  if (plan.skippedAmbiguous !== 0) errors.push("ambiguous_plan_entries");
  if (plan.skippedNotFound !== 0) errors.push("not_found_plan_entries");
  if (plan.skippedMissingId !== 0) errors.push("missing_id_plan_entries");
  if (
    actualTargets.size !== expectedTargets.size ||
    [...expectedTargets].some(target => !actualTargets.has(target))
  ) {
    errors.push("unexpected_target_key_set");
  }

  const sanity = operations.map(operation => {
    const idIsValid =
      typeof operation.id === "string" && operation.id.trim() !== "";
    const normalizedId = idIsValid ? operation.id.trim() : null;
    const duplicateId = idIsValid && operationIds.has(normalizedId);
    if (idIsValid) operationIds.add(normalizedId);

    const initialMatches = initialMotorcycles.filter(
      motorcycle => motorcycle.id === operation.id
    );
    const currentMatches = currentMotorcycles.filter(
      motorcycle => motorcycle.id === operation.id
    );
    const initial = initialMatches.length === 1 ? initialMatches[0] : null;
    const current = currentMatches.length === 1 ? currentMatches[0] : null;
    const sourceIsNull = operation.fromCatalogVariantKey === null;
    const currentKeyIsNull = Boolean(
      current && current.catalogVariantKey === null
    );
    const identityUnchanged = Boolean(
      initial && current &&
      initial.brand === current.brand &&
      initial.model === current.model &&
      Number(initial.year) === Number(current.year)
    );
    const currentAnalysis = current
      ? database.analyzeLegacyMotorcycles([current]).results[0]
      : null;
    const remainsUnique = Boolean(
      currentAnalysis &&
      currentAnalysis.status === "unique" &&
      currentAnalysis.proposedCatalogVariantKey ===
        operation.toCatalogVariantKey
    );
    const initialResult = analysis.results.find(
      result => result.id === operation.id
    );
    const initiallyUnique = Boolean(
      initialResult &&
      initialResult.status === "unique" &&
      initialResult.proposedCatalogVariantKey ===
        operation.toCatalogVariantKey
    );
    const valid = Boolean(
      idIsValid &&
      !duplicateId &&
      sourceIsNull &&
      initialMatches.length === 1 &&
      currentMatches.length === 1 &&
      currentKeyIsNull &&
      identityUnchanged &&
      initiallyUnique &&
      remainsUnique
    );

    if (!idIsValid) errors.push("operation_invalid_id");
    if (duplicateId) errors.push("duplicate_operation_id");
    if (!sourceIsNull) errors.push("source_key_not_null");
    if (initialMatches.length !== 1) errors.push("initial_record_not_unique");
    if (currentMatches.length === 0) errors.push("current_record_missing");
    if (currentMatches.length > 1) errors.push("current_record_duplicated");
    if (current && !currentKeyIsNull) errors.push("current_key_changed");
    if (current && !identityUnchanged) errors.push("identity_changed");
    if (!initiallyUnique) errors.push("initial_analysis_mismatch");
    if (current && !remainsUnique) errors.push("current_analysis_mismatch");

    return {
      operationNumber: sanityOperationNumber(operation, operations),
      targetKey: operation.toCatalogVariantKey,
      recordExists: currentMatches.length === 1,
      currentKeyIsNull,
      identityUnchanged,
      remainsUnique,
      valid
    };
  });

  return {
    readyForControlledMigration: errors.length === 0,
    errors: [...new Set(errors)],
    validation,
    sanity
  };
}

function sanityOperationNumber(operation, operations) {
  return operations.indexOf(operation) + 1;
}

async function prepareControlledMigrationPreflight(client, database) {
  const audit = await runLegacyMotorcycleReadOnlyAudit(client, database);
  const initialMotorcycles = audit.analysis.results.map(result => ({
    id: result.id,
    brand: result.brand,
    model: result.model,
    year: result.year,
    catalogVariantKey: result.currentCatalogVariantKey
  }));
  const readOnlyClient = createReadOnlySupabaseClient(client);
  const { data, error } = await readOnlyClient
    .from("motorcycles")
    .select(MOTORCYCLE_AUDIT_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!Array.isArray(data)) {
    throw new Error("Final sanity SELECT did not return an array.");
  }

  const currentMotorcycles = data.map(record =>
    database.deserializeMotorcycle(record)
  );
  const initialSnapshot = JSON.stringify(initialMotorcycles);
  const currentSnapshot = JSON.stringify(currentMotorcycles);
  const readiness = evaluateControlledMigrationReadiness({
    analysis: audit.analysis,
    plan: audit.plan,
    initialMotorcycles,
    currentMotorcycles,
    database
  });
  const inputUnchanged =
    JSON.stringify(initialMotorcycles) === initialSnapshot &&
    JSON.stringify(currentMotorcycles) === currentSnapshot;

  if (!inputUnchanged) {
    readiness.readyForControlledMigration = false;
    readiness.errors.push("input_modified");
  }

  return {
    requestCount: 2,
    readyForControlledMigration:
      readiness.readyForControlledMigration,
    errors: readiness.errors,
    inputUnchanged,
    analysis: audit.analysis,
    plan: audit.plan,
    validation: readiness.validation,
    sanity: readiness.sanity
  };
}

function redactPreflightReport(report) {
  return {
    READY_FOR_CONTROLLED_MIGRATION:
      report.readyForControlledMigration,
    requestCount: report.requestCount,
    inputUnchanged: report.inputUnchanged,
    errors: report.errors,
    analysis: {
      total: report.analysis.total,
      alreadyMigrated: report.analysis.alreadyMigrated,
      unique: report.analysis.unique,
      ambiguous: report.analysis.ambiguous,
      notFound: report.analysis.notFound
    },
    plan: {
      total: report.plan.total,
      safeToMigrate: report.plan.safeToMigrate,
      skippedAlreadyMigrated: report.plan.skippedAlreadyMigrated,
      skippedAmbiguous: report.plan.skippedAmbiguous,
      skippedNotFound: report.plan.skippedNotFound,
      skippedMissingId: report.plan.skippedMissingId,
      operations: report.plan.operations.map((operation, index) => ({
        operationNumber: index + 1,
        fromCatalogVariantKey: operation.fromCatalogVariantKey,
        toCatalogVariantKey: operation.toCatalogVariantKey
      }))
    },
    sanity: report.sanity
  };
}

async function main() {
  const client = createRestSelectClient({
    url: process.env.VFR_AUDIT_SUPABASE_URL,
    key: process.env.VFR_AUDIT_SUPABASE_PUBLISHABLE_KEY,
    accessToken: process.env.VFR_AUDIT_SUPABASE_ACCESS_TOKEN,
    fetchImpl: globalThis.fetch
  });
  const database = loadMotorcycleDatabase(path.join(__dirname, ".."));
  const report = await prepareControlledMigrationPreflight(client, database);
  console.log(JSON.stringify(redactPreflightReport(report), null, 2));
}

module.exports = {
  EXPECTED_TARGET_KEYS,
  evaluateControlledMigrationReadiness,
  prepareControlledMigrationPreflight,
  redactPreflightReport
};

if (require.main === module) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
