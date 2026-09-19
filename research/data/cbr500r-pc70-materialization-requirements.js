// NON-PRODUCTION bounded materialization-requirements evaluation for CBR500R.
"use strict";

const factory = require("../factory/index.js");
const authorization = require("./cbr500r-pc70-schema-conversion-authorization.js");

const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildResult() {
  const upstream = authorization.buildAuthorization();
  if (upstream.id !== productionAuthorizationId || upstream.authorizationState !== "AUTHORIZATION-READY" || upstream.reasons.length !== 0 || upstream.productionCreated !== false) throw new Error("CBR500R materialization input is out of scope or not ready");
  const result = factory.authorizeMaterializationRequirements(upstream, {});
  if (result.productionAuthorizationId !== productionAuthorizationId) throw new Error("CBR500R materialization lineage is incomplete");
  return result;
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R materialization result is not deterministic");
  return first;
}

module.exports = Object.freeze({ buildResult, buildReport });
