// NON-PRODUCTION generic parent-bound HTML-to-text derivation.
"use strict";

const derivedContent = require("./derived-content-contracts.js");
const execution = require("./execution-contracts.js");

const HTML_DERIVED_CONTENT_SCHEMA_VERSION = 1;
const HTML_TRANSFORMER_ID = "html.normalized-text";
const HTML_TRANSFORMER_VERSION = "1";
const HTML_INPUT_MEDIA_TYPES = Object.freeze(["text/html", "application/xhtml+xml"]);
const HTML_OUTPUT_MEDIA_TYPE = "text/plain";
const HTML_DOCUMENT_LOCATOR = "document:full";
const DEFAULT_MAX_DERIVED_BYTES = 1024 * 1024;
const BLOCK_TAGS = new Set(["address", "article", "aside", "blockquote", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul"]);
const ENTITY_NAMES = Object.freeze({ amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' });
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function decodeEntities(text) {
  return text.replace(/&(?:#x([0-9a-f]+)|#([0-9]+)|([a-z][a-z0-9]+));/gi, (match, hex, decimal, name) => {
    if (name) return Object.prototype.hasOwnProperty.call(ENTITY_NAMES, name.toLowerCase()) ? ENTITY_NAMES[name.toLowerCase()] : match;
    const codePoint = Number.parseInt(hex || decimal, hex ? 16 : 10);
    return Number.isInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff) ? String.fromCodePoint(codePoint) : match;
  });
}

function tagName(tag) {
  const match = tag.match(/^\/?\s*([a-z][a-z0-9:-]*)/i);
  return match ? match[1].toLowerCase() : null;
}

function findTagEnd(html, start) {
  let quote = null;
  for (let index = start; index < html.length; index += 1) {
    const character = html[index];
    if (quote) { if (character === quote) quote = null; } else if (character === "\"" || character === "'") quote = character;
    else if (character === ">") return index;
  }
  return -1;
}

function normalizeHtmlToText(bytes) {
  let html;
  try { html = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new TypeError("HTML parent bytes are not valid UTF-8"); }
  const chunks = []; let cursor = 0; let skipTag = null;
  const append = value => { if (value) chunks.push(value); };
  while (cursor < html.length) {
    if (skipTag) {
      const closeStart = html.toLowerCase().indexOf(`</${skipTag}`, cursor);
      if (closeStart < 0) break;
      const closeEnd = findTagEnd(html, closeStart + 2 + skipTag.length);
      if (closeEnd < 0) break;
      append("\n"); cursor = closeEnd + 1; skipTag = null; continue;
    }
    if (html.startsWith("<!--", cursor)) {
      const commentEnd = html.indexOf("-->", cursor + 4); cursor = commentEnd < 0 ? html.length : commentEnd + 3; continue;
    }
    if (html[cursor] === "<") {
      const tagEnd = findTagEnd(html, cursor + 1);
      if (tagEnd < 0) break;
      const rawTag = html.slice(cursor + 1, tagEnd); const name = tagName(rawTag); const closing = /^\s*\//.test(rawTag);
      if (!closing && (name === "script" || name === "style")) { skipTag = name; append("\n"); }
      else if (name === "br") append("\n");
      else if (name && BLOCK_TAGS.has(name)) append("\n");
      cursor = tagEnd + 1; continue;
    }
    const nextTag = html.indexOf("<", cursor); const end = nextTag < 0 ? html.length : nextTag;
    append(decodeEntities(html.slice(cursor, end))); cursor = end;
  }
  const lines = chunks.join("").replace(/\r\n?/g, "\n").split("\n").map(line => line.replace(/[\t\f\v ]+/g, " ").trim()).filter(Boolean);
  return lines.join("\n");
}

function decodeParentBytes(parentArtifact) {
  const parent = execution.validateArtifact(parentArtifact);
  assert(HTML_INPUT_MEDIA_TYPES.includes(parent.mediaType), "HTML parent media type is unsupported");
  const encoded = parent.metadata?.contentBase64;
  assert(typeof encoded === "string" && encoded.length > 0 && encoded.length % 4 === 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded), "HTML parent bytes are missing or invalid");
  const bytes = Buffer.from(encoded, "base64");
  assert(bytes.length === parent.byteLength && derivedContent.digestBytes(bytes) === parent.contentDigest, "HTML parent bytes do not match artifact identity");
  return { parent, bytes };
}

function createHtmlDerivedContent({ parentArtifact, approvedRegionIds = [HTML_DOCUMENT_LOCATOR], transformerId = HTML_TRANSFORMER_ID, transformerVersion = HTML_TRANSFORMER_VERSION, maxDerivedBytes = DEFAULT_MAX_DERIVED_BYTES }) {
  assert(Number.isInteger(maxDerivedBytes) && maxDerivedBytes > 0 && maxDerivedBytes <= 10 * 1024 * 1024, "HTML derived content size bound is invalid");
  const { parent, bytes } = decodeParentBytes(parentArtifact);
  const content = normalizeHtmlToText(bytes);
  assert(content.length > 0, "HTML derived content is empty");
  assert(Buffer.byteLength(content, "utf8") <= maxDerivedBytes, "HTML derived content exceeds configured bound");
  return derivedContent.createDerivedContent({ parentArtifact: parent, parentBytes: bytes, transformerId, transformerVersion, region: { id: HTML_DOCUMENT_LOCATOR, documentLocator: HTML_DOCUMENT_LOCATOR, mediaType: parent.mediaType }, approvedRegionIds, content, contentEncoding: "utf8", mediaType: HTML_OUTPUT_MEDIA_TYPE });
}

module.exports = Object.freeze({ HTML_DERIVED_CONTENT_SCHEMA_VERSION, HTML_TRANSFORMER_ID, HTML_TRANSFORMER_VERSION, HTML_INPUT_MEDIA_TYPES, HTML_OUTPUT_MEDIA_TYPE, HTML_DOCUMENT_LOCATOR, DEFAULT_MAX_DERIVED_BYTES, normalizeHtmlToText, createHtmlDerivedContent });
