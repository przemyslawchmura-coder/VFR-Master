"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const metadata = require("../js/app-release.js");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const date = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

test("canonical release metadata is complete and current", () => {
  assert.equal(metadata.applicationName, "RevLog");
  assert.equal(metadata.currentVersion, "0.2.0");
  assert.match(metadata.currentVersion, semver);
  assert.ok(Array.isArray(metadata.releases) && metadata.releases.length > 0);
  assert.equal(metadata.releases[0].version, metadata.currentVersion);
  assert.equal(metadata.releases[0].date, "2026-08-30");
  assert.ok(metadata.releases.some(release => release.version === "0.1.0"));
});

test("release history has unique SemVer versions, valid dates and meaningful content", () => {
  const versions = metadata.releases.map(release => release.version);
  assert.equal(new Set(versions).size, versions.length);
  metadata.releases.forEach(release => {
    assert.match(release.version, semver);
    assert.match(release.date, date);
    assert.equal(new Date(`${release.date}T00:00:00Z`).toISOString().slice(0, 10), release.date);
    assert.ok(release.title.trim().length >= 8);
    assert.ok(Array.isArray(release.changes) && release.changes.length > 0);
    release.changes.forEach(change => assert.ok(change.trim().length >= 12));
  });
});

test("release history is newest-first", () => {
  const compare = (left, right) => {
    const leftParts = left.split(".").map(Number);
    const rightParts = right.split(".").map(Number);
    for (let index = 0; index < 3; index += 1) {
      if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
    }
    return 0;
  };
  for (let index = 1; index < metadata.releases.length; index += 1) {
    assert.ok(compare(metadata.releases[index - 1].version, metadata.releases[index].version) > 0);
    assert.ok(metadata.releases[index - 1].date >= metadata.releases[index].date);
  }
});

test("About loads canonical metadata before app rendering and has no independent version literal", () => {
  assert.match(html, /<script src="js\/app-release\.js"><\/script>\s*<script src="js\/app\.js/);
  assert.match(html, /id="aboutCurrentVersion"/);
  assert.match(html, /id="releaseHistoryList"/);
  assert.doesNotMatch(html, /0\.[12]\.0/);
  assert.match(appSource, /window\.RevLogRelease/);
  assert.doesNotMatch(appSource, /0\.[12]\.0/);
});

test("About rendering path displays canonical release data using text nodes", () => {
  class Element {
    constructor(tag = "div") { this.tag = tag; this.children = []; this.textContent = ""; this.className = ""; }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.children.push(child); }
    replaceChildren(...children) { this.children = children; }
  }
  const elements = Object.fromEntries(["aboutAppName", "aboutCurrentVersion", "aboutReleaseDate", "releaseHistoryList"].map(id => [id, new Element()]));
  const context = { window: { RevLogRelease: metadata }, document: { getElementById: id => elements[id] || null, createElement: tag => new Element(tag) } };
  vm.createContext(context);
  const renderSource = appSource.slice(appSource.indexOf("function renderAboutReleaseHistory"), appSource.indexOf("/* =====================================================", appSource.indexOf("function renderAboutReleaseHistory")));
  vm.runInContext(`${renderSource}; this.result = renderAboutReleaseHistory();`, context);
  assert.equal(context.result, true);
  assert.equal(elements.aboutAppName.textContent, metadata.applicationName);
  assert.equal(elements.aboutCurrentVersion.textContent, `Wersja ${metadata.currentVersion}`);
  assert.equal(elements.aboutReleaseDate.textContent, `Data wydania: ${metadata.releases[0].date}`);
  assert.equal(elements.releaseHistoryList.children.length, metadata.releases.length);
  assert.doesNotMatch(renderSource, /innerHTML|insertAdjacentHTML/);
});

test("release metadata is bundled and offline", () => {
  const source = fs.readFileSync(path.join(ROOT, "js/app-release.js"), "utf8");
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|supabase|github\.com|https?:\/\//i);
  assert.match(html, /@media \(max-width: 359px\)/);
  assert.match(html, /\.release-entry \{ overflow-wrap:anywhere; \}/);
});
