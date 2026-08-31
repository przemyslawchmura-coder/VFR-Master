"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const snapshot = require("../research/reports/project-state-audit.json");

const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("project-state snapshot contains executable audit invariants", () => {
  assert.equal(snapshot.snapshotBasis, "post-pilot-working-tree");
  assert.match(snapshot.baseCommit, /^[0-9a-f]{40}$/);
  assert.equal(snapshot.aheadAfterContainingCommit, 16);
  assert.match(snapshot.originMain, /^[0-9a-f]{40}$/);
  assert.equal(snapshot.catalogue.manufacturers, 13);
  assert.equal(snapshot.catalogue.variants, 1095);
  assert.equal(snapshot.catalogue.contentCompleteness, "incomplete");
  assert.equal(snapshot.catalogue.latestCompletedExpansion, "Triumph Wave 2");
  assert.equal(snapshot.research.serviceCoreFieldCount, 44);
  assert.equal(snapshot.research.hondaServiceWave1.targets, 8);
  assert.equal(snapshot.research.batchWave2.selectedTargets, 12);
  assert.equal(snapshot.research.batchWave2.targetFieldSlots, 528);
  assert.equal(snapshot.research.batchWave2.netNewVerifiedSlots, 6);
  assert.equal(snapshot.research.highValuePilot.selectedTargets, 5);
  assert.equal(snapshot.research.highValuePilot.minimumPracticalServiceFields, 10);
  assert.equal(snapshot.research.highValuePilot.classification, "ACCEPT-WITH-RISKS");
  assert.equal(snapshot.research.highValuePilot.serviceCoreBefore, 51);
  assert.equal(snapshot.research.highValuePilot.serviceCoreAfter, 101);
  assert.equal(snapshot.research.highValuePilot.practicalServiceFieldGain, 48);
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

test("audit standard and batch metrics prevent circular acceptance", () => {
  const standard = read("docs/project/AUDIT_STANDARD.md");
  assert.match(standard, /IMPLEMENT → AUTHOR TESTS → INDEPENDENT AUDIT/);
  assert.match(standard, /JUSTIFIED-WITH-RISK/);
  assert.match(standard, /ACCEPT-WITH-RISKS/);
  assert.match(standard, /attempts to falsify/);
  assert.equal(snapshot.research.batchWave2.practicalServiceFieldGain, 0);
  assert.equal(snapshot.research.batchWave2.verifiedBefore, 51);
  assert.equal(snapshot.research.batchWave2.verifiedAfter, 57);
});

test("project memory records the executed pilot and operator cloud note", () => {
  const state = read("docs/project/CURRENT_STATE.md");
  assert.match(state, /NEXT 1/);
  assert.match(read("docs/project/WORKLOG.md"), /high-value source-acquisition/);
  assert.match(state, /101\/220/);
  assert.match(state, /post-pilot scaling reassessment/);
  assert.match(read("docs/project/DECISIONS.md"), /ADR-010/);
});
