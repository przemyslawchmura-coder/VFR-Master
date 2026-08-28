"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const formatter = require("../js/technical/technical-value-formatter.js");

test("formats localized quantity and retains canonical unit", () => {
  assert.equal(
    formatter.formatValue({ type: "quantity", amount: 3.5, unit: "L" }),
    "3,5 L"
  );
  assert.equal(
    formatter.formatValue({ type: "quantity", amount: 29, unit: "N·m" }),
    "29 N·m"
  );
});

test("formats localized range", () => {
  assert.equal(
    formatter.formatValue({ type: "range", min: 0.7, max: 0.8, unit: "mm" }),
    "0,7–0,8 mm"
  );
});

test("formats quantity with tolerance", () => {
  assert.equal(
    formatter.formatValue({
      type: "quantity-with-tolerance",
      nominal: 0.2,
      tolerance: 0.03,
      unit: "mm"
    }),
    "0,2 ± 0,03 mm"
  );
});

test("formats ratio", () => {
  assert.equal(
    formatter.formatValue({ type: "ratio", numerator: 45, denominator: 17 }),
    "45:17"
  );
});

test("returns text value without changing it", () => {
  assert.equal(
    formatter.formatValue({ type: "text", text: "Synthetic value" }),
    "Synthetic value"
  );
});

test("formats multi value", () => {
  assert.equal(
    formatter.formatValue({
      type: "multi",
      values: [
        { type: "quantity", amount: 250, unit: "kPa" },
        { type: "quantity", amount: 2.5, unit: "bar" }
      ]
    }),
    "250 kPa / 2,5 bar"
  );
});

test("formats without localization for tests and debug traces", () => {
  assert.equal(
    formatter.formatValue(
      { type: "quantity", amount: 3.5, unit: "L" },
      { localized: false }
    ),
    "3.5 L"
  );
  assert.equal(
    formatter.formatValue(
      { type: "range", min: 0.7, max: 0.8, unit: "mm" },
      { localized: false }
    ),
    "0.7–0.8 mm"
  );
});

test("formatter does not mutate source value", () => {
  const value = {
    type: "multi",
    values: [
      { type: "quantity", amount: 3.5, unit: "L" }
    ]
  };
  const before = JSON.stringify(value);

  formatter.formatValue(value);

  assert.equal(JSON.stringify(value), before);
});
