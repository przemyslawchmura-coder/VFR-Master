// NON-PRODUCTION canonical JSON utilities for factory persistence.
"use strict";

function assertJsonSafe(value, path = "$", ancestors = new WeakSet()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain only finite JSON numbers`);
    return;
  }
  if (typeof value !== "object" || value instanceof Date || value instanceof Map || value instanceof Set) throw new TypeError(`${path} is not JSON-safe`);
  if (ancestors.has(value)) throw new TypeError(`${path} contains a circular reference`);
  ancestors.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (item === undefined) throw new TypeError(`${path}[${index}] is undefined`);
      assertJsonSafe(item, `${path}[${index}]`, ancestors);
    });
    ancestors.delete(value);
    return;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new TypeError(`${path} must be a plain object`);
  Object.entries(value).forEach(([key, item]) => {
    if (item === undefined) throw new TypeError(`${path}.${key} is undefined`);
    assertJsonSafe(item, `${path}.${key}`, ancestors);
  });
  ancestors.delete(value);
}

function canonicalize(value) {
  assertJsonSafe(value);
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
}

const canonicalSerialize = value => JSON.stringify(canonicalize(value));
const clone = value => JSON.parse(canonicalSerialize(value));
function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
const immutableClone = value => deepFreeze(clone(value));

module.exports = Object.freeze({ assertJsonSafe, canonicalize, canonicalSerialize, clone, deepFreeze, immutableClone });
