// TRUSTED NON-PRODUCTION content-addressed local custody; never a browser store.
"use strict";
const fs = require("node:fs/promises");
const constants = require("node:fs").constants;
const path = require("node:path");
const crypto = require("node:crypto");
const contracts = require("../research/factory/execution-contracts.js");
const digestOf = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const validDigest = value => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const integrityError = message => { const error = new TypeError(message); error.code = "CUSTODY_INTEGRITY_FAILURE"; return error; };

function createFileArtifactStore({ directory }) {
  if (typeof directory !== "string" || !path.isAbsolute(directory)) throw new TypeError("absolute trusted custody directory is required");
  const location = digest => {
    if (!validDigest(digest)) throw new TypeError("custody digest is invalid");
    return path.join(directory, `${digest}.bin`);
  };
  async function read(digest) {
    const handle = await fs.open(location(digest), constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
      const bytes = await handle.readFile();
      if (digestOf(bytes) !== digest) throw integrityError("custody content digest is corrupt");
      return bytes;
    } finally { await handle.close(); }
  }
  async function syncDirectory() {
    const handle = await fs.open(directory, constants.O_RDONLY | constants.O_NOFOLLOW | (constants.O_DIRECTORY || 0));
    try { await handle.sync(); } finally { await handle.close(); }
  }
  async function put(input) {
    const artifact = contracts.validateArtifact(input);
    const encoded = artifact.metadata.contentBase64;
    if (typeof encoded !== "string") throw new TypeError("custody requires acquired bytes");
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.toString("base64") !== encoded || bytes.length !== artifact.byteLength || digestOf(bytes) !== artifact.contentDigest) throw new TypeError("custody bytes do not match acquired artifact digest");
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    const finalLocation = location(artifact.contentDigest);
    const temporaryLocation = path.join(directory, `.${artifact.contentDigest}.${process.pid}.${crypto.randomUUID()}.tmp`);
    let handle = null;
    try {
      handle = await fs.open(temporaryLocation, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
      await handle.writeFile(bytes);
      await handle.sync();
      await handle.close();
      handle = null;
      try { await fs.link(temporaryLocation, finalLocation); } catch (error) { if (error.code !== "EEXIST") throw error; }
    } finally {
      if (handle) await handle.close().catch(() => {});
      await fs.unlink(temporaryLocation).catch(error => { if (error.code !== "ENOENT") throw error; });
    }
    await syncDirectory();
    const stored = await read(artifact.contentDigest);
    if (!stored.equals(bytes)) throw integrityError("custody duplicate content is corrupt");
    return Object.freeze({ storageKey: `sha256:${artifact.contentDigest}`, contentDigest: artifact.contentDigest, byteLength: artifact.byteLength });
  }
  return Object.freeze({ put, read });
}
module.exports = Object.freeze({ createFileArtifactStore });
