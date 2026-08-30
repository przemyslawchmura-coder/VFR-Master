// NON-PRODUCTION Honda batch research Wave 2. Evidence remains quarantined.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const service = require("./honda-service-wave1.js");
const catalog = require("../../scripts/motorcycle-catalog-report.js").loadCatalog();

const selectedTargetKeys = Object.freeze([
  "honda.vfr800.rc46.vtec.gen1", "honda.cbr500r.pc70", "honda.cbr600rr.rh10",
  "honda.cbr-fireblade.sc82-1", "honda.africa-twin.crf1100l-1", "honda.cb500f.pc63-1",
  "honda.nc750x.rh09-1", "honda.transalp.xl750", "honda.cbr650.cbr650r-2",
  "honda.cb500x-nx500.nx500", "honda.rebel.cmx500-1", "honda.cb1000r.sc80-1"
]);

const sources = Object.freeze([
  ...service.sources.map(source => ({ ...source, documentId: source.id, sourceClass: source.type, accessState: source.metadataOnly ? "metadata-only" : "acquired-content" })),
  { id: "research.honda.uk.2021-supersport-brochure-mirror", documentId: "research.honda.service.2021-supersport-brochure", type: "official-technical-publication", sourceClass: "official-technical-publication", title: "Honda UK 2021 Super Sport brochure (mirror location)", manufacturer: "Honda", publicationDate: 2021, url: "https://www.honda.co.uk/content/dam/local/uk/brochures/motorcycles/21YMBrochures/21YMHUKMCSUPERSPORTLR1.pdf?mirror=1", accessState: "acquired-content" }
]);

const evidence = Object.freeze([
  ["honda.cbr600rr.rh10", "engine.configuration", "Liquid-cooled 4-stroke DOHC inline-4", "Liquid-cooled 4-stroke DOHC inline-4", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR600RR", "6"],
  ["honda.cbr-fireblade.sc82-1", "engine.configuration", "Water-cooled 4-stroke DOHC inline 4-cylinder", "Water-cooled 4-stroke DOHC inline 4-cylinder", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR1000RR-R", "6"],
  ["honda.africa-twin.crf1100l-1", "engine.configuration", "Liquid-cooled 4-stroke 8-valve parallel Twin with 270° crank and Unicam", "Liquid-cooled parallel twin, 270° crank, Unicam", null, "research.honda.service.2021-adventure-brochure", "Specifications — CRF1100L Africa Twin", "18"],
  ["honda.nc750x.rh09-1", "engine.configuration", "Liquid-cooled 4-stroke 8-valve SOHC parallel 2-cylinder", "Liquid-cooled SOHC parallel twin", null, "research.honda.service.2021-adventure-brochure", "Specifications — NC750X", "19"],
  ["honda.cbr650.cbr650r-2", "engine.configuration", "Liquid-cooled 4-stroke DOHC inline-4", "Liquid-cooled DOHC inline-4", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR650R", "6"],
  ["honda.cbr650.cbr650r-2", "engine.displacement", "649 cc", 649, "cm³", "research.honda.service.2021-supersport-brochure", "Specifications — CBR650R", "6"]
].map(([catalogVariantKey, canonicalFieldId, rawValue, normalizedValue, unit, sourceId, section, page], index) => Object.freeze({
  id: `honda.batch.wave2.evidence.${String(index + 1).padStart(3, "0")}`, catalogVariantKey, canonicalFieldId,
  sourceId, sourceClass: "official-technical-publication", publisher: "Honda UK", documentTitle: "Honda UK 2021 motorcycle brochure",
  publicationId: "Honda UK 2021 Super Sport / Adventure brochure", sourceLocation: sources.find(source => source.id === sourceId)?.url,
  printedPage: page, viewerPage: page, section, rawValue, normalizedValue, unit,
  modelApplicability: catalogVariantKey, yearApplicability: { from: 2021, to: 2021 }, marketApplicability: "EU/UK",
  absApplicability: null, transmissionApplicability: null, contentInspected: true, verificationMethod: "official Honda brochure page inspection",
  proofStatus: "VERIFIED-DIRECT", comparison: "PRODUCTION-MISSING", conflictGroup: null
})));

function runBatch() {
  const existing = service.evidence.map(item => ({ ...item, canonicalFieldId: item.field }));
  const allEvidence = existing.concat(evidence);
  const targets = pipeline.generateTargets(catalog, { catalogVariantKeys: selectedTargetKeys }, allEvidence);
  return Object.freeze({ selectedTargetKeys, sources, evidence, documents: pipeline.buildDocumentRegistry(sources), targets, reviewQueue: pipeline.buildReviewQueue(targets), report: pipeline.buildBatchReport(targets) });
}

module.exports = Object.freeze({ selectedTargetKeys, sources, evidence, runBatch });
