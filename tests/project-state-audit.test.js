"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const snapshot = require("../research/reports/project-state-audit.json");

const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("project-state snapshot contains executable audit invariants", () => {
  assert.match(snapshot.snapshotCommit, /^[0-9a-f]{40}$/);
  assert.match(snapshot.originMain, /^[0-9a-f]{40}$/);
  assert.equal(snapshot.catalogue.manufacturers, 13);
  assert.equal(snapshot.catalogue.variants, 1095);
  assert.equal(snapshot.research.serviceCoreFieldCount, 44);
  assert.equal(snapshot.research.vfr800.verified, 13);
  assert.equal(snapshot.research.cbr500r.verified, 26);
  assert.equal(snapshot.productionBoundary.researchImportedByIndex, false);
  assert.equal(snapshot.productionBoundary.batchPipelineNonProduction, true);
});

test("project memory has one active roadmap phase and unique ADRs", () => {
  const roadmap = read("docs/project/ROADMAP.md");
  assert.equal((roadmap.match(/\(ACTIVE\)/g) || []).length, 1);
  const decisions = read("docs/project/DECISIONS.md");
  const ids = [...decisions.matchAll(/## (ADR-\d+)/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const state = read("docs/project/CURRENT_STATE.md");
  assert.match(state, /\*\*NEXT 1\*\*/);
  assert.match(state, /\*\*NEXT 2\*\*/);
  assert.match(state, /\*\*NEXT 3\*\*/);
});

test("project memory records production/research isolation", () => {
  assert.match(read("docs/project/README.md"), /Authority order/);
  assert.match(read("docs/project/chat-archive/README.md"), /NON-AUTHORITATIVE HISTORICAL CONTEXT/);
  assert.match(read("docs/project/CURRENT_STATE.md"), /Research is quarantined/);
  assert.doesNotMatch(read("index.html"), /research\/data|research\/lib/);
});
