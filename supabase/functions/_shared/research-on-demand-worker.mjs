// TRUSTED NON-PRODUCTION EDGE WORKER CORE. No browser/runtime import.

const MAX_ATTEMPTS = 3;
const EXECUTION_STATES = new Set(["READY", "RUNNING", "RETRYABLE", "COMPLETED", "TERMINAL", "BLOCKED", "UNSUPPORTED", "AWAITING_HUMAN_REVIEW"]);
const OUTCOMES = new Set(["SUCCESS", "RETRYABLE", "PERMANENT", "BLOCKED", "UNSUPPORTED", "AWAITING_HUMAN_REVIEW"]);
const FORBIDDEN_KEYS = new Set(["id", "knowledgeKey", "demandId", "status", "provenance", "lineage", "userId", "garageRowId", "batchId", "targetWorkId", "sourceWorkItemId", "attemptId"]);

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function assertJsonSafe(value, path = "$", ancestors = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") { assert(Number.isFinite(value), `${path} must contain finite JSON numbers`); return; }
  assert(value && typeof value === "object", `${path} must be JSON-safe`);
  assert(!ancestors.has(value), `${path} contains a cycle`);
  ancestors.add(value);
  if (Array.isArray(value)) value.forEach((item, index) => assertJsonSafe(item, `${path}[${index}]`, ancestors));
  else Object.entries(value).forEach(([key, item]) => { assert(key.length > 0, `${path} contains an empty key`); assertJsonSafe(item, `${path}.${key}`, ancestors); });
  ancestors.delete(value);
}

function canonicalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
}

const canonicalSerialize = value => JSON.stringify(canonicalize(value));
const digest = async value => {
  const bytes = new TextEncoder().encode(canonicalSerialize(value));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
};

function rejectForbiddenKeys(value, path = "demand") {
  assertJsonSafe(value);
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) return value.forEach((item, index) => rejectForbiddenKeys(item, `${path}[${index}]`));
  Object.entries(value).forEach(([key, item]) => {
    assert(!FORBIDDEN_KEYS.has(key), `${path}.${key} is derived by the trusted boundary`);
    rejectForbiddenKeys(item, `${path}.${key}`);
  });
}

async function canonicalDemand(input) {
  assert(input && typeof input === "object" && !Array.isArray(input), "canonical demand is required");
  rejectForbiddenKeys(input);
  assert(typeof input.catalogVariantKey === "string" && input.catalogVariantKey.length > 0, "catalogVariantKey is required");
  assert(typeof input.canonicalFieldId === "string" && input.canonicalFieldId.length > 0, "canonicalFieldId is required");
  assert(typeof input.operation === "string" && input.operation.length > 0, "operation is required");
  assert(input.applicability && typeof input.applicability === "object", "applicability is required");
  assert(Array.isArray(input.requiredApplicabilityDimensions) && input.requiredApplicabilityDimensions.length > 0, "required applicability dimensions are required");
  const identity = {
    applicability: input.applicability,
    canonicalFieldId: input.canonicalFieldId.trim(),
    catalogVariantKey: input.catalogVariantKey.trim(),
    conditions: input.conditions === undefined ? null : input.conditions,
    operation: input.operation.trim(),
    requiredApplicabilityDimensions: [...new Set(input.requiredApplicabilityDimensions)].sort()
  };
  assertJsonSafe(identity);
  const identityDigest = await digest(identity);
  return Object.freeze({ schemaVersion: 1, id: `reusable-demand.${identityDigest}`, knowledgeKey: `reusable-knowledge.${identityDigest}`, ...identity });
}

function trustedConfiguration(env) {
  const url = env.SUPABASE_URL;
  const workerToken = env.RESEARCH_WORKER_TOKEN;
  const environment = env.RESEARCH_WORKER_ENVIRONMENT;
  let secretKey = null;
  if (env.SUPABASE_SECRET_KEYS) {
    try {
      const keys = JSON.parse(env.SUPABASE_SECRET_KEYS);
      secretKey = keys.default || Object.values(keys)[0] || null;
    } catch { secretKey = null; }
  }
  secretKey ||= env.SUPABASE_SERVICE_ROLE_KEY || null;
  if (!url || !secretKey || !workerToken || environment !== "non-production") throw new Error("trusted non-production worker configuration is incomplete");
  return Object.freeze({ url, secretKey, workerToken, environment });
}

function createBoundedWorker({ rpc, factoryAdapter, workerId }) {
  assert(typeof rpc === "function", "trusted RPC client is required");
  assert(typeof factoryAdapter === "function", "Factory adapter is required");
  assert(typeof workerId === "string" && workerId.length > 0 && workerId.length <= 160, "trusted worker ID is required");

  const call = async (name, args) => {
    const result = await rpc(name, args);
    if (!result || result.error) throw new Error(result?.error?.message || `trusted RPC ${name} failed`);
    return result.data;
  };

  async function run({ demand: input, leaseSeconds = 30 }) {
    assert(Number.isInteger(leaseSeconds) && leaseSeconds > 0 && leaseSeconds <= 60, "bounded leaseSeconds is invalid");
    const demand = await canonicalDemand(input);
    const identity = { executionId: `research-execution.${await digest(demand.id)}`, jobKey: demand.id, demandId: demand.id };
    const durableDemand = { demandId: demand.id, knowledgeKey: demand.knowledgeKey, catalogVariantKey: demand.catalogVariantKey, canonicalFieldId: demand.canonicalFieldId, operation: demand.operation, identity: { applicability: demand.applicability, canonicalFieldId: demand.canonicalFieldId, catalogVariantKey: demand.catalogVariantKey, conditions: demand.conditions, operation: demand.operation, requiredApplicabilityDimensions: demand.requiredApplicabilityDimensions }, applicability: demand.applicability, conditions: demand.conditions, requiredApplicabilityDimensions: demand.requiredApplicabilityDimensions, status: "IN_PROGRESS", lifecycle: { boundary: "trusted-wave8-edge", handoff: "PENDING" } };
    const demandClaim = await call("claim_research_demand", { p_demand: durableDemand });
    assert(["CREATED", "REUSED"].includes(demandClaim?.outcome), "trusted demand claim did not create or reuse a durable demand");
    const ensured = await call("create_research_execution", { p_execution: { ...identity, maxAttempts: MAX_ATTEMPTS, checkpoint: null } });
    assert(["CREATED", "REUSED"].includes(ensured?.outcome), "trusted execution did not create or reuse a durable job");
    const claim = await call("claim_research_execution", { p_execution_id: identity.executionId, p_worker_id: workerId, p_lease_seconds: leaseSeconds });
    if (claim?.outcome !== "CLAIMED") return Object.freeze({ demand: demand.id, executionId: identity.executionId, outcome: claim?.outcome || "UNKNOWN", record: claim?.record || null });
    const handoff = { phase: "FACTORY-HANDOFF", boundary: "trusted-wave8-edge", executionId: identity.executionId, demandId: demand.id, attempt: claim.record.attemptCount ?? claim.record.attempt_count };
    const checkpoint = await call("checkpoint_research_execution", { p_execution_id: identity.executionId, p_worker_id: workerId, p_checkpoint: handoff });
    assert(checkpoint?.outcome === "CHECKPOINTED", "trusted Factory handoff checkpoint failed");
    const factory = await factoryAdapter({ demand, execution: checkpoint.record, checkpoint: handoff });
    assert(factory && OUTCOMES.has(factory.outcome), "Factory adapter returned an unsupported outcome");
    assertJsonSafe(factory.checkpoint === undefined ? handoff : factory.checkpoint);
    const finished = await call("finish_research_execution", { p_execution_id: identity.executionId, p_worker_id: workerId, p_outcome: factory.outcome, p_failure: factory.failure || null, p_checkpoint: factory.checkpoint === undefined ? handoff : factory.checkpoint });
    assert(finished?.outcome === "FINISHED", "trusted execution finish failed");
    assert(finished.record && EXECUTION_STATES.has(finished.record.status), "trusted execution returned an invalid status");
    return Object.freeze({ demand: demand.id, executionId: identity.executionId, outcome: finished.record.status, record: finished.record, factory: { outcome: factory.outcome } });
  }

  return Object.freeze({ run });
}

export { MAX_ATTEMPTS, canonicalDemand, trustedConfiguration, createBoundedWorker };
