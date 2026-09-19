// NON-PRODUCTION local deterministic source acquisition adapters.
"use strict";

const crypto = require("node:crypto");
const contracts = require("./execution-contracts.js");
const json = require("./json.js");

const ADAPTER_SCHEMA_VERSION = 1;
const fixtures = Object.freeze({
  acquired: { outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_ARTIFACT_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_FIXTURE_DOCUMENT" }], artifact: { mediaType: "text/plain", byteLength: 18, contentDigest: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://acquired", metadata: {} } },
  noEvidence: { outcome: "NO-EVIDENCE", retryClass: "NON-RETRYABLE", reasonCode: "NO_USABLE_EVIDENCE_IN_DECLARED_SCOPE", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "NO_EVIDENCE" }], artifact: null },
  blocked: { outcome: "ACCESS-BLOCKED", retryClass: "BLOCKED", reasonCode: "ACCESS_POLICY_BLOCKED", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "ACCESS_BLOCKED" }], artifact: null },
  auth: { outcome: "AUTH-REQUIRED", retryClass: "BLOCKED", reasonCode: "AUTHENTICATION_REQUIRED", observations: [{ type: "LOGIN-WALL", detailCode: "AUTH_REQUIRED" }], artifact: null },
  notFound: { outcome: "NOT-FOUND", retryClass: "NON-RETRYABLE", reasonCode: "SOURCE_NOT_FOUND", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "NOT_FOUND" }], artifact: null },
  mismatch: { outcome: "SOURCE-MISMATCH", retryClass: "NON-RETRYABLE", reasonCode: "SOURCE_IDENTITY_MISMATCH", observations: [{ type: "SOURCE-IDENTITY-MISMATCH", detailCode: "MISMATCH" }], artifact: null },
  unknown: { outcome: "APPLICABILITY-UNKNOWN", retryClass: "BLOCKED", reasonCode: "APPLICABILITY_UNKNOWN", observations: [{ type: "DOCUMENT-APPLICABILITY-UNRESOLVED", detailCode: "UNKNOWN" }], artifact: null },
  partial: { outcome: "APPLICABILITY-PARTIAL", retryClass: "BLOCKED", reasonCode: "APPLICABILITY_PARTIAL", observations: [{ type: "DOCUMENT-APPLICABILITY-UNRESOLVED", detailCode: "PARTIAL" }], artifact: null },
  transient: { outcome: "TRANSIENT-FAILURE", retryClass: "RETRYABLE", reasonCode: "LOCAL_TRANSIENT_FAILURE", observations: [], artifact: null },
  permanent: { outcome: "PERMANENT-FAILURE", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_PERMANENT_FAILURE", observations: [], artifact: null }
});

function createSyntheticAdapter(fixtureName) {
  if (!Object.prototype.hasOwnProperty.call(fixtures, fixtureName)) throw new TypeError(`unknown synthetic fixture: ${fixtureName}`);
  return Object.freeze({ adapterId: `synthetic.${fixtureName}`, adapterVersion: "1", supportedOperations: Object.freeze(["attempt-existing-source"]), supportedSourceClasses: Object.freeze(["*"]), authenticationRequired: fixtureName === "auth", networkRequired: false, execute(request) {
    contracts.validateAcquisitionRequest(request);
    const template = fixtures[fixtureName];
    const outcome = { schemaVersion: contracts.EXECUTION_SCHEMA_VERSION, ...template, observations: template.observations.map(json.immutableClone), artifact: template.artifact ? { ...template.artifact, prospectId: request.prospectId, attemptId: request.attemptId, id: contracts.artifactId({ prospectId: request.prospectId, attemptId: request.attemptId, mediaType: template.artifact.mediaType, contentDigest: template.artifact.contentDigest, locator: template.artifact.locator }) } : null };
    return contracts.validateOutcome(outcome);
  } });
}
const syntheticAdapters = Object.freeze(Object.fromEntries(Object.keys(fixtures).map(name => [name, createSyntheticAdapter(name)])));

const HTTP_ADAPTER_VERSION = "1";
const HTTP_SUPPORTED_MEDIA_TYPES = Object.freeze(["text/html", "application/xhtml+xml", "application/json", "text/plain", "application/pdf"]);
const HTTP_REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const HTTP_RESULT = Object.freeze({ success: "ACQUIRED", transient: "TRANSIENT-FAILURE", blocked: "ACCESS-BLOCKED", auth: "AUTH-REQUIRED", notFound: "NOT-FOUND", permanent: "PERMANENT-FAILURE", empty: "NO-EVIDENCE" });
const DEFAULT_HTTP_LIMITS = Object.freeze({ maxResponseBytes: 5 * 1024 * 1024, maxRedirects: 3, timeoutMs: 10000 });
const sha256Bytes = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const isPrivateIpv4 = hostname => {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 169 && parts[1] === 254);
};
function validatePublicHttpUrl(value, allowLocalhostForTests) {
  let url;
  try { url = new URL(value); } catch { throw new TypeError("HTTP source URL is malformed"); }
  if (!["http:", "https:"].includes(url.protocol)) throw new TypeError("HTTP source URL scheme is unsupported");
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const local = hostname === "localhost" || hostname === "::1" || isPrivateIpv4(hostname);
  if (local && !allowLocalhostForTests) throw new TypeError("HTTP source URL targets a local/private host");
  return url;
}
const mediaTypeOf = response => (response.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
const observation = (type, detailCode, metadata = {}) => ({ type, detailCode, metadata });

function failure(outcome, reasonCode, type, detailCode, metadata = {}) {
  return contracts.validateOutcome({ schemaVersion: contracts.EXECUTION_SCHEMA_VERSION, outcome, retryClass: outcome === HTTP_RESULT.transient ? "RETRYABLE" : outcome === HTTP_RESULT.blocked || outcome === HTTP_RESULT.auth ? "BLOCKED" : "NON-RETRYABLE", reasonCode, observations: [observation(type, detailCode, metadata)], artifact: null });
}

function validateHttpRequest(request, options) {
  contracts.validateAcquisitionRequest(request);
  if (typeof request.url !== "string" || request.url.length === 0) throw new TypeError("HTTP acquisition request URL is required");
  const url = validatePublicHttpUrl(request.url, options.allowLocalhostForTests === true);
  if (request.allowedMediaTypes !== undefined) {
    if (!Array.isArray(request.allowedMediaTypes) || request.allowedMediaTypes.length === 0 || request.allowedMediaTypes.some(type => !HTTP_SUPPORTED_MEDIA_TYPES.includes(type))) throw new TypeError("HTTP acquisition allowed media types are invalid");
  }
  ["maxResponseBytes", "maxRedirects", "timeoutMs"].forEach(key => {
    if (request[key] !== undefined && (!Number.isInteger(request[key]) || request[key] <= 0)) throw new TypeError(`HTTP acquisition ${key} must be a positive integer`);
  });
  if (request.maxRedirects !== undefined && request.maxRedirects > 10) throw new TypeError("HTTP acquisition maxRedirects is too large");
  if (request.maxResponseBytes !== undefined && request.maxResponseBytes > 50 * 1024 * 1024) throw new TypeError("HTTP acquisition maxResponseBytes is too large");
  if (request.timeoutMs !== undefined && request.timeoutMs > 60000) throw new TypeError("HTTP acquisition timeoutMs is too large");
  json.assertJsonSafe(request.sourceMetadata || {});
  return { ...request, url: url.toString(), allowedMediaTypes: request.allowedMediaTypes || HTTP_SUPPORTED_MEDIA_TYPES, ...DEFAULT_HTTP_LIMITS, ...Object.fromEntries(["maxResponseBytes", "maxRedirects", "timeoutMs"].map(key => [key, request[key] === undefined ? DEFAULT_HTTP_LIMITS[key] : request[key]])) };
}

async function readBoundedBody(response, maxResponseBytes) {
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader(); const chunks = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > maxResponseBytes) { await reader.cancel(); throw new RangeError("HTTP response exceeds configured byte limit"); }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, length);
}

function createHttpAdapter(options = {}) {
  const adapterId = Object.prototype.hasOwnProperty.call(options, "adapterId") ? options.adapterId : "http.public-bounded";
  if (typeof adapterId !== "string" || adapterId.length === 0) throw new TypeError("HTTP adapterId is required");
  return Object.freeze({ adapterId, adapterVersion: HTTP_ADAPTER_VERSION, supportedOperations: Object.freeze(["attempt-existing-source"]), supportedSourceClasses: Object.freeze(["*"]), supportedMediaTypes: HTTP_SUPPORTED_MEDIA_TYPES, authenticationRequired: false, networkRequired: true, async execute(input) {
    let request;
    try { request = validateHttpRequest(input, options); } catch (error) { return failure(HTTP_RESULT.permanent, "INVALID_HTTP_REQUEST", "CONTENT-UNAVAILABLE", "INVALID_REQUEST", { message: error.message }); }
    let currentUrl = request.url; let redirectCount = 0;
    while (true) {
      let response;
      try {
        response = await fetch(currentUrl, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(request.timeoutMs), headers: { "accept": request.allowedMediaTypes.join(", ") } });
      } catch (error) {
        const timedOut = error && (error.name === "TimeoutError" || error.name === "AbortError");
        return failure(HTTP_RESULT.transient, timedOut ? "REQUEST_TIMEOUT" : "NETWORK_FAILURE", "CONTENT-UNAVAILABLE", timedOut ? "TIMEOUT" : "NETWORK_ERROR");
      }
      if (HTTP_REDIRECT_STATUSES.has(response.status)) {
        const location = response.headers.get("location");
        if (!location) return failure(HTTP_RESULT.permanent, "REDIRECT_LOCATION_MISSING", "CONTENT-UNAVAILABLE", "REDIRECT_INVALID");
        if (redirectCount >= request.maxRedirects) return failure(HTTP_RESULT.permanent, "REDIRECT_LIMIT_EXCEEDED", "CONTENT-UNAVAILABLE", "REDIRECT_LIMIT");
        try { currentUrl = validatePublicHttpUrl(new URL(location, currentUrl).toString(), options.allowLocalhostForTests === true).toString(); } catch (error) { return failure(HTTP_RESULT.permanent, "REDIRECT_TARGET_REJECTED", "CONTENT-UNAVAILABLE", "REDIRECT_INVALID", { message: error.message }); }
        redirectCount += 1; continue;
      }
      if (response.status === 401) return failure(HTTP_RESULT.auth, "AUTHENTICATION_REQUIRED", "LOGIN-WALL", "HTTP_401", { requestedUrl: request.url, finalUrl: currentUrl });
      if (response.status === 403) return failure(HTTP_RESULT.blocked, "ACCESS_POLICY_BLOCKED", "CONTENT-UNAVAILABLE", "HTTP_403", { requestedUrl: request.url, finalUrl: currentUrl });
      if (response.status === 404) return failure(HTTP_RESULT.notFound, "SOURCE_NOT_FOUND", "CONTENT-UNAVAILABLE", "HTTP_404", { requestedUrl: request.url, finalUrl: currentUrl });
      if (response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500) return failure(HTTP_RESULT.transient, "HTTP_TEMPORARY_FAILURE", "CONTENT-UNAVAILABLE", `HTTP_${response.status}`, { requestedUrl: request.url, finalUrl: currentUrl });
      if (response.status < 200 || response.status >= 300) return failure(HTTP_RESULT.permanent, "HTTP_PERMANENT_FAILURE", "CONTENT-UNAVAILABLE", `HTTP_${response.status}`, { requestedUrl: request.url, finalUrl: currentUrl });
      const mediaType = mediaTypeOf(response);
      if (!request.allowedMediaTypes.includes(mediaType)) return failure(HTTP_RESULT.permanent, "UNSUPPORTED_MEDIA_TYPE", "CONTENT-UNAVAILABLE", "MEDIA_TYPE_REJECTED", { mediaType, requestedUrl: request.url, finalUrl: currentUrl });
      const contentLength = Number(response.headers.get("content-length"));
      if (Number.isInteger(contentLength) && contentLength > request.maxResponseBytes) return failure(HTTP_RESULT.permanent, "RESPONSE_TOO_LARGE", "CONTENT-UNAVAILABLE", "BYTE_LIMIT", { contentLength, maxResponseBytes: request.maxResponseBytes });
      let body;
      try { body = await readBoundedBody(response, request.maxResponseBytes); } catch { return failure(HTTP_RESULT.permanent, "RESPONSE_TOO_LARGE", "CONTENT-UNAVAILABLE", "BYTE_LIMIT", { maxResponseBytes: request.maxResponseBytes }); }
      if (body.length === 0) return failure(HTTP_RESULT.empty, "EMPTY_RESPONSE", "CONTENT-UNAVAILABLE", "EMPTY_BODY", { requestedUrl: request.url, finalUrl: currentUrl });
      const contentDigest = sha256Bytes(body);
      const artifact = contracts.validateArtifact({
        id: contracts.artifactId({ prospectId: request.prospectId, attemptId: request.attemptId, mediaType, contentDigest, locator: currentUrl }),
        prospectId: request.prospectId, attemptId: request.attemptId, mediaType, byteLength: body.length, contentDigest,
        originClassification: "REMOTE_HTTP_SOURCE", acquisitionMethod: adapterId, locator: currentUrl,
        metadata: { requestedUrl: request.url, finalUrl: currentUrl, httpStatus: response.status, redirectCount, adapterId, adapterVersion: HTTP_ADAPTER_VERSION, contentBase64: body.toString("base64"), sourceMetadata: request.sourceMetadata || {} }
      });
      return contracts.validateOutcome({ schemaVersion: contracts.EXECUTION_SCHEMA_VERSION, outcome: HTTP_RESULT.success, retryClass: "NON-RETRYABLE", reasonCode: "REMOTE_ARTIFACT_ACQUIRED", observations: [observation("DOCUMENT-ACQUIRED", "HTTP_SOURCE_ACQUIRED", { requestedUrl: request.url, finalUrl: currentUrl, mediaType, byteLength: body.length, contentDigest, httpStatus: response.status, redirectCount, adapterId, adapterVersion: HTTP_ADAPTER_VERSION })], artifact });
    }
  } });
}

module.exports = Object.freeze({ ADAPTER_SCHEMA_VERSION, HTTP_ADAPTER_VERSION, HTTP_SUPPORTED_MEDIA_TYPES, syntheticAdapters, createSyntheticAdapter, createHttpAdapter });
