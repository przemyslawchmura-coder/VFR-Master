"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-production-promotion-authorization.js").buildReport;

test("consumes exactly six ready Ducati conversions and excludes cooling/pending/BMW", () => { const result = report(); assert.equal(result.consumedConversionReady, 6); assert.deepEqual(result.counts, { total: 6, authorizationReady: 6, authorizationBlocked: 0 }); assert.deepEqual(result.excluded, { coolingCapacity: 1, pendingDucatiPromotionReviewPackets: 20, bmwRecords: 0 }); assert.ok(result.authorizations.every(item => item.productionCreated === false)); });
test("authorization report is deterministic and stored output matches", () => { const first = report(); assert.deepEqual(report(), first); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-production-promotion-authorization.json"), "utf8")), first); });
