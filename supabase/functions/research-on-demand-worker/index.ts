// TRUSTED NON-PRODUCTION WORKER. Never import from browser/runtime code.
import { createClient } from "npm:@supabase/supabase-js@2";
import { createBoundedWorker, trustedConfiguration } from "../_shared/research-on-demand-worker.mjs";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function constantTimeEqual(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function boundedFactoryAdapter({ execution, checkpoint }: { execution: Record<string, unknown>; checkpoint: Record<string, unknown> }) {
  return Promise.resolve({
    outcome: "SUCCESS",
    checkpoint: {
      ...checkpoint,
      phase: "FACTORY-COMPLETED",
      factoryBoundary: "existing-wave7-factory-executor-seam",
      continuation: "durable-checkpoint-authoritative",
      productionMaterialized: false,
      externalAcquisition: false,
      attempt: execution.attempt_count ?? execution.attemptCount
    }
  });
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "POST required" }, 405);
  let configuration;
  try { configuration = trustedConfiguration(Deno.env.toObject()); } catch { return json({ error: "trusted non-production worker is not configured" }, 503); }
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ") || !constantTimeEqual(authorization.slice(7), configuration.workerToken)) return json({ error: "trusted worker authorization required" }, 401);
  let body: { demand?: unknown; leaseSeconds?: number };
  try { body = await request.json(); } catch { return json({ error: "JSON body required" }, 400); }
  if (!body || !body.demand) return json({ error: "canonical demand is required" }, 400);
  const client = createClient(configuration.url, configuration.secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const rpc = async (name: string, args: Record<string, unknown>) => {
    const result = await client.rpc(name, args);
    return { data: result.data, error: result.error };
  };
  const worker = createBoundedWorker({ rpc, factoryAdapter: boundedFactoryAdapter, workerId: `edge:${Deno.env.get("SB_EXECUTION_ID") || crypto.randomUUID()}` });
  try {
    const result = await worker.run({ demand: body.demand, leaseSeconds: body.leaseSeconds || 30 });
    return json({ ok: true, ...result });
  } catch (error) {
    return json({ error: "bounded trusted worker execution failed", classification: "BLOCKED" }, 422);
  }
});
