"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const expectedVersion = "2.116.0";

test("production HTML pins the Supabase browser dependency to the intended exact version", () => {
  const matches = html.match(/<script\s+src="(https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@([^"]+))"><\/script>/g) || [];
  assert.equal(matches.length, 1);

  const dependency = matches[0].match(/@supabase\/supabase-js@([^"]+)/);
  assert.ok(dependency);
  assert.equal(dependency[1], expectedVersion);
  assert.match(dependency[1], /^\d+\.\d+\.\d+$/);
  assert.doesNotMatch(dependency[1], /[xX*^~<>=|]|\s/);
});
