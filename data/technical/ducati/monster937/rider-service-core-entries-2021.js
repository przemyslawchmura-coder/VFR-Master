// Generated from the existing read-only Ducati Rider Service Core representation; production promotion consumes no research module at runtime.
(function attachDucatiMonster937RiderServiceCoreEntries(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogDucatiMonster937RiderServiceCoreEntries = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEntries() {
"use strict";
const entries = Object.freeze([
  {
    "id": "rider-service-core.engine-service-limits",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.service-limits",
    "value": {
      "type": "text",
      "text": "Max. rotation speed: 10200 rpm."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.service-limits",
      "details": null,
      "id": "service-core-record.00b1f736416a00f4f5917703",
      "provenance": {
        "candidateId": "extraction-candidate.c53fc0a5d51ab4c2f5658e3a",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Max. rotation speed: 10200 rpm."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-service-limits"
    ]
  },
  {
    "id": "rider-service-core.dimensions-mass-wet-kerb-mass",
    "type": "specification",
    "categoryId": "general",
    "label": "dimensions_mass.wet-kerb-mass",
    "value": {
      "type": "text",
      "text": "Overall weight (in running order with 90% of fuel - 44/2014/EU Annex XI): 166 kg (365.97 lb)."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "dimensions_mass.wet-kerb-mass",
      "details": null,
      "id": "service-core-record.01966297dd0de728f2342ba2",
      "provenance": {
        "candidateId": "extraction-candidate.e5370c8ab314ee63f11e4efa",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:208",
          "page": null,
          "section": "Technical data; Weights"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Overall weight (in running order with 90% of fuel - 44/2014/EU Annex XI): 166 kg (365.97 lb)."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.dimensions_mass-wet-kerb-mass"
    ]
  },
  {
    "id": "rider-service-core.maintenance-adjust",
    "type": "maintenance-task",
    "categoryId": "maintenance",
    "label": "maintenance.adjust",
    "value": {
      "type": "text",
      "text": "Dealer operations include checking and/or adjusting valve clearance; customer operation includes checking drive-chain tension."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.adjust",
      "details": {
        "action": "ADJUST",
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.040",
          "printedPage": "204, 207",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Dealer operations include checking and/or adjusting valve clearance; customer operation includes checking drive-chain tension.",
        "technology": null
      },
      "id": "service-core-record.06bff3a2bec0bb4287f2d788",
      "provenance": {
        "candidateId": "extraction-candidate.1d5db0e803dbb9e206755856",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:204, 207",
          "page": null,
          "section": "Scheduled maintenance chart"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "maintenance",
      "value": {
        "rawUnit": null,
        "rawValue": "Dealer operations include checking and/or adjusting valve clearance; customer operation includes checking drive-chain tension."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-adjust"
    ]
  },
  {
    "id": "rider-service-core.brakes-disc-service-limit",
    "type": "specification",
    "categoryId": "brakes",
    "label": "brakes.disc-service-limit",
    "value": {
      "type": "text",
      "text": "Front disc maximum wear: 4.0 mm; rear disc maximum wear: 3.6 mm."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "brakes.disc-service-limit",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.026",
          "printedPage": "217",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Front disc maximum wear: 4.0 mm; rear disc maximum wear: 3.6 mm.",
        "technology": null
      },
      "id": "service-core-record.07daa7c512af0ce89c0c344f",
      "provenance": {
        "candidateId": "extraction-candidate.70fae5d1e3ec3a93119d80eb",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:217",
          "page": null,
          "section": "Technical data; Brakes"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "generic-structured",
      "value": {
        "rawUnit": null,
        "rawValue": "Front disc maximum wear: 4.0 mm; rear disc maximum wear: 3.6 mm."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.brakes-disc-service-limit"
    ]
  },
  {
    "id": "rider-service-core.lighting-rear-indicators",
    "type": "specification",
    "categoryId": "lighting",
    "label": "lighting.rear-indicators",
    "value": {
      "type": "text",
      "text": "LED rear turn indicators: no. 7."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.rear-indicators",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; no bulb/socket claimed"
        },
        "sourceText": "LED rear turn indicators: no. 7.",
        "technology": "LED"
      },
      "id": "service-core-record.115ee829d95e4b5fce6526b8",
      "provenance": {
        "candidateId": "extraction-candidate.66935eac00e12d9997ead630",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "LED rear turn indicators: no. 7."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-rear-indicators"
    ]
  },
  {
    "id": "rider-service-core.dimensions-mass-wheelbase",
    "type": "specification",
    "categoryId": "general",
    "label": "dimensions_mass.wheelbase",
    "value": {
      "type": "text",
      "text": "Wheelbase: 1474 mm (58.03 in)."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "dimensions_mass.wheelbase",
      "details": null,
      "id": "service-core-record.13edba4e9a2a6ef7f0f62e94",
      "provenance": {
        "candidateId": "extraction-candidate.9ae8c2022ca34615784b02f9",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:209",
          "page": null,
          "section": "Technical data; Dimensions; Monster 937"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Wheelbase: 1474 mm (58.03 in)."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.dimensions_mass-wheelbase"
    ]
  },
  {
    "id": "rider-service-core.final-drive-final-ratio",
    "type": "specification",
    "categoryId": "final-drive",
    "label": "final_drive.final-ratio",
    "value": {
      "type": "text",
      "text": "Gearbox output sprocket/rear chain sprocket ratio: 15/43."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "final_drive.final-ratio",
      "details": null,
      "id": "service-core-record.1780d597c1227f40d5f1a43a",
      "provenance": {
        "candidateId": "extraction-candidate.7071da1f545cd79994c6b5ba",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Gearbox output sprocket/rear chain sprocket ratio: 15/43."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.final_drive-final-ratio"
    ]
  },
  {
    "id": "rider-service-core.dimensions-mass-dry-mass",
    "type": "specification",
    "categoryId": "general",
    "label": "dimensions_mass.dry-mass",
    "value": {
      "type": "text",
      "text": "Dry weight (without fluids and battery): 188 kg (414.47 lb)."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "dimensions_mass.dry-mass",
      "details": null,
      "id": "service-core-record.27fb970c223f1978cd992630",
      "provenance": {
        "candidateId": "extraction-candidate.fe07608fdfbd5da7cbc49889",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:208",
          "page": null,
          "section": "Technical data; Weights"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Dry weight (without fluids and battery): 188 kg (414.47 lb)."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.dimensions_mass-dry-mass"
    ]
  },
  {
    "id": "rider-service-core.lighting-combined-high-low",
    "type": "light-source",
    "categoryId": "lighting",
    "label": "lighting.combined-high-low",
    "value": {
      "type": "text",
      "text": "Headlight: LED low beam no. 1; LED high beam no. 4."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.combined-high-low",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; no bulb/socket claimed"
        },
        "sourceText": "Headlight: LED low beam no. 1; LED high beam no. 4.",
        "technology": "LED"
      },
      "id": "service-core-record.28250101f329880873ce6754",
      "provenance": {
        "candidateId": "extraction-candidate.8e3b2d4db57b4fe127f5bf1d",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "Headlight: LED low beam no. 1; LED high beam no. 4."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-combined-high-low"
    ]
  },
  {
    "id": "rider-service-core.lighting-brake-light",
    "type": "specification",
    "categoryId": "lighting",
    "label": "lighting.brake-light",
    "value": {
      "type": "text",
      "text": "Tail light: LED rear stop light no. 9."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.brake-light",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; no bulb/socket claimed"
        },
        "sourceText": "Tail light: LED rear stop light no. 9.",
        "technology": "LED"
      },
      "id": "service-core-record.2bc62b0cc7ac5877adf92257",
      "provenance": {
        "candidateId": "extraction-candidate.fb1dd164958e426f0f91e1b4",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "Tail light: LED rear stop light no. 9."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-brake-light"
    ]
  },
  {
    "id": "rider-service-core.maintenance-lubricate",
    "type": "maintenance-task",
    "categoryId": "maintenance",
    "label": "maintenance.lubricate",
    "value": {
      "type": "text",
      "text": "Customer operation: check the drive chain tension and lubrication; chain lubrication procedure is described separately."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.lubricate",
      "details": {
        "action": "LUBRICATE",
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.041",
          "printedPage": "185-187, 207",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Customer operation: check the drive chain tension and lubrication; chain lubrication procedure is described separately.",
        "technology": null
      },
      "id": "service-core-record.31601479aa62d0d91ffc5565",
      "provenance": {
        "candidateId": "extraction-candidate.2c09a62ed7fbbcd5391369c7",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:185-187, 207",
          "page": null,
          "section": "Lubricating the drive chain; Scheduled maintenance chart"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "maintenance",
      "value": {
        "rawUnit": null,
        "rawValue": "Customer operation: check the drive chain tension and lubrication; chain lubrication procedure is described separately."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-lubricate"
    ]
  },
  {
    "id": "rider-service-core.maintenance-inspect",
    "type": "maintenance-task",
    "categoryId": "maintenance",
    "label": "maintenance.inspect",
    "value": {
      "type": "text",
      "text": "Customer operations: check engine oil level; brake fluid level; tyre pressure and wear; drive chain tension and lubrication; brake pads. Dealer operations include checks of air filter, brake/clutch fluid, discs/pads, wheel fasteners, bearings and other listed items."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.inspect",
      "details": {
        "action": "INSPECT",
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.038",
          "printedPage": "204-207",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Customer operations: check engine oil level; brake fluid level; tyre pressure and wear; drive chain tension and lubrication; brake pads. Dealer operations include checks of air filter, brake/clutch fluid, discs/pads, wheel fasteners, bearings and other listed items.",
        "technology": null
      },
      "id": "service-core-record.49d1fc56a470e482ad616493",
      "provenance": {
        "candidateId": "extraction-candidate.e096b66d25dd2ba312687a5b",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:204-207",
          "page": null,
          "section": "Scheduled maintenance chart"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "maintenance",
      "value": {
        "rawUnit": null,
        "rawValue": "Customer operations: check engine oil level; brake fluid level; tyre pressure and wear; drive chain tension and lubrication; brake pads. Dealer operations include checks of air filter, brake/clutch fluid, discs/pads, wheel fasteners, bearings and other listed items."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-inspect"
    ]
  },
  {
    "id": "rider-service-core.brakes-disc-thickness",
    "type": "specification",
    "categoryId": "brakes",
    "label": "brakes.disc-thickness",
    "value": {
      "type": "text",
      "text": "Front disc thickness: 4.5 mm; rear disc thickness: 4.2 mm."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "brakes.disc-thickness",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.025",
          "printedPage": "217",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Front disc thickness: 4.5 mm; rear disc thickness: 4.2 mm.",
        "technology": null
      },
      "id": "service-core-record.50e1e2430b3f76ac4be1dbd6",
      "provenance": {
        "candidateId": "extraction-candidate.bbbd14a9d39214026b6a9907",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:217",
          "page": null,
          "section": "Technical data; Brakes"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "generic-structured",
      "value": {
        "rawUnit": null,
        "rawValue": "Front disc thickness: 4.5 mm; rear disc thickness: 4.2 mm."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.brakes-disc-thickness"
    ]
  },
  {
    "id": "rider-service-core.tires-wheels-oem-tire-models",
    "type": "specification",
    "categoryId": "wheels",
    "label": "tires_wheels.oem-tire-models",
    "value": {
      "type": "text",
      "text": "Front and rear: Pirelli Diablo Rosso III, tubeless radial type."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "tires_wheels.oem-tire-models",
      "details": null,
      "id": "service-core-record.5210a5c46284f38dc30b4065",
      "provenance": {
        "candidateId": "extraction-candidate.2d373e75f0e42f0f5e16e82f",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:219",
          "page": null,
          "section": "Technical data; Tyres"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Front and rear: Pirelli Diablo Rosso III, tubeless radial type."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.tires_wheels-oem-tire-models"
    ]
  },
  {
    "id": "rider-service-core.brakes-disc-diameter",
    "type": "specification",
    "categoryId": "brakes",
    "label": "brakes.disc-diameter",
    "value": {
      "type": "text",
      "text": "Front: 2 drilled stainless steel discs, 320 mm; rear: fixed drilled steel disk, 245 mm."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "brakes.disc-diameter",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.024",
          "printedPage": "217",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Front: 2 drilled stainless steel discs, 320 mm; rear: fixed drilled steel disk, 245 mm.",
        "technology": null
      },
      "id": "service-core-record.5ad36bcd7c20c1f5954470f8",
      "provenance": {
        "candidateId": "extraction-candidate.d40bd4d5acb956fa2b293658",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:217",
          "page": null,
          "section": "Technical data; Brakes"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "generic-structured",
      "value": {
        "rawUnit": null,
        "rawValue": "Front: 2 drilled stainless steel discs, 320 mm; rear: fixed drilled steel disk, 245 mm."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.brakes-disc-diameter"
    ]
  },
  {
    "id": "rider-service-core.engine-compression-ratio",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.compression-ratio",
    "value": {
      "type": "text",
      "text": "Compression ratio: 13.3±0.5:1"
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.compression-ratio",
      "details": null,
      "id": "service-core-record.5c3db72874b2a00cfd7b4279",
      "provenance": {
        "candidateId": "extraction-candidate.71b060837bc3cb3a238df95a",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Compression ratio: 13.3±0.5:1"
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-compression-ratio"
    ]
  },
  {
    "id": "rider-service-core.transmission-clutch-transmission-type",
    "type": "specification",
    "categoryId": "general",
    "label": "transmission_clutch.transmission-type",
    "value": {
      "type": "text",
      "text": "6-speed gearbox with constant mesh gears, and gear change pedal on left side of motorcycle."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "transmission_clutch.transmission-type",
      "details": null,
      "id": "service-core-record.60a5ef19881ea068dc607696",
      "provenance": {
        "candidateId": "extraction-candidate.f16f41038e98cd82c4785179",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "6-speed gearbox with constant mesh gears, and gear change pedal on left side of motorcycle."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.transmission_clutch-transmission-type"
    ]
  },
  {
    "id": "rider-service-core.steering-chassis-trail",
    "type": "specification",
    "categoryId": "general",
    "label": "steering_chassis.trail",
    "value": {
      "type": "text",
      "text": "Trail in mm: 93 (3.66 in)."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "steering_chassis.trail",
      "details": null,
      "id": "service-core-record.6102d5567766c297115bdc38",
      "provenance": {
        "candidateId": "extraction-candidate.7b8ded1ed8d740cf80116893",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:219",
          "page": null,
          "section": "Technical data; Frame"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Trail in mm: 93 (3.66 in)."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.steering_chassis-trail"
    ]
  },
  {
    "id": "rider-service-core.tires-wheels-rim-sizes",
    "type": "specification",
    "categoryId": "wheels",
    "label": "tires_wheels.rim-sizes",
    "value": {
      "type": "text",
      "text": "Front rim MT3.50x17; rear rim MT5.50x17."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "tires_wheels.rim-sizes",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.023",
          "printedPage": "219",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Front rim MT3.50x17; rear rim MT5.50x17.",
        "technology": null
      },
      "id": "service-core-record.6b40fb954366c0e58ef7b8f1",
      "provenance": {
        "candidateId": "extraction-candidate.959e99505a0c73875ec57414",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:219",
          "page": null,
          "section": "Technical data; Wheels"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "tire-pressure",
      "value": {
        "rawUnit": null,
        "rawValue": "Front rim MT3.50x17; rear rim MT5.50x17."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.tires_wheels-rim-sizes"
    ]
  },
  {
    "id": "rider-service-core.electrical-alternator-output",
    "type": "specification",
    "categoryId": "electrical",
    "label": "electrical.alternator-output",
    "value": {
      "type": "text",
      "text": "Generator Denso 14V - 490W."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "electrical.alternator-output",
      "details": null,
      "id": "service-core-record.74d2bc592bd5e3cd133de2b8",
      "provenance": {
        "candidateId": "extraction-candidate.4963af1e9835ac6d75d1e210",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Generator Denso 14V - 490W."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.electrical-alternator-output"
    ]
  },
  {
    "id": "rider-service-core.final-drive-oem-chain-sprocket",
    "type": "specification",
    "categoryId": "final-drive",
    "label": "final_drive.oem-chain-sprocket",
    "value": {
      "type": "text",
      "text": "Drive chain: Regina 520 ZRDK, 106 links; gearbox output sprocket/rear chain sprocket ratio 15/43."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "final_drive.oem-chain-sprocket",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.021",
          "printedPage": "218",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Drive chain: Regina 520 ZRDK, 106 links; gearbox output sprocket/rear chain sprocket ratio 15/43.",
        "technology": null
      },
      "id": "service-core-record.835f7cbbbe87fea744fca136",
      "provenance": {
        "candidateId": "extraction-candidate.059c61b30866b216e47be83d",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "generic-structured",
      "value": {
        "rawUnit": null,
        "rawValue": "Drive chain: Regina 520 ZRDK, 106 links; gearbox output sprocket/rear chain sprocket ratio 15/43."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.final_drive-oem-chain-sprocket"
    ]
  },
  {
    "id": "rider-service-core.final-drive-chain-size",
    "type": "specification",
    "categoryId": "final-drive",
    "label": "final_drive.chain-size",
    "value": {
      "type": "text",
      "text": "Drive chain from gearbox to rear wheel. Make: Regina; Type: 520 ZRDK; Links: 106."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "final_drive.chain-size",
      "details": null,
      "id": "service-core-record.839a8614b19163b87b0c87a1",
      "provenance": {
        "candidateId": "extraction-candidate.421632574c7e45ff769341b6",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Drive chain from gearbox to rear wheel. Make: Regina; Type: 520 ZRDK; Links: 106."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.final_drive-chain-size"
    ]
  },
  {
    "id": "rider-service-core.final-drive-front-sprocket",
    "type": "specification",
    "categoryId": "final-drive",
    "label": "final_drive.front-sprocket",
    "value": {
      "type": "text",
      "text": "Gearbox output sprocket: 15 teeth."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "final_drive.front-sprocket",
      "details": null,
      "id": "service-core-record.90d53155be0fa1a5b6e89139",
      "provenance": {
        "candidateId": "extraction-candidate.838a900a1dd66226f281f99d",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Gearbox output sprocket: 15 teeth."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.final_drive-front-sprocket"
    ]
  },
  {
    "id": "rider-service-core.engine-bore",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.bore",
    "value": {
      "type": "text",
      "text": "Bore: 94 mm (3.70 in)"
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.bore",
      "details": null,
      "id": "service-core-record.925ea25af7a6c74e43342764",
      "provenance": {
        "candidateId": "extraction-candidate.01f432aa1f9f8e79721ad06e",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Bore: 94 mm (3.70 in)"
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-bore"
    ]
  },
  {
    "id": "rider-service-core.final-drive-rear-sprocket",
    "type": "specification",
    "categoryId": "final-drive",
    "label": "final_drive.rear-sprocket",
    "value": {
      "type": "text",
      "text": "Rear chain sprocket: 43 teeth."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "final_drive.rear-sprocket",
      "details": null,
      "id": "service-core-record.9a3707e7628a2c24a4f23f9f",
      "provenance": {
        "candidateId": "extraction-candidate.69d6c5ec9cc194373f6d7636",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Rear chain sprocket: 43 teeth."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.final_drive-rear-sprocket"
    ]
  },
  {
    "id": "rider-service-core.steering-chassis-rake",
    "type": "specification",
    "categoryId": "general",
    "label": "steering_chassis.rake",
    "value": {
      "type": "text",
      "text": "Steering head angle: 24°"
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "steering_chassis.rake",
      "details": null,
      "id": "service-core-record.a104eb2be41775ef912e341e",
      "provenance": {
        "candidateId": "extraction-candidate.9ab4ea8bb73e7be99ea92f56",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:219",
          "page": null,
          "section": "Technical data; Frame"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Steering head angle: 24°"
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.steering_chassis-rake"
    ]
  },
  {
    "id": "rider-service-core.maintenance-severe-use",
    "type": "specification",
    "categoryId": "maintenance",
    "label": "maintenance.severe-use",
    "value": {
      "type": "text",
      "text": "Extreme damp/muddy or dusty/dry conditions can cause above-average wear of the drive system, brakes or air filter and may require earlier service or replacement."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.severe-use",
      "details": {
        "action": null,
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.044",
          "printedPage": "30, 203, 207",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Extreme damp/muddy or dusty/dry conditions can cause above-average wear of the drive system, brakes or air filter and may require earlier service or replacement.",
        "technology": null
      },
      "id": "service-core-record.a54ac25de747d6b32162ad54",
      "provenance": {
        "candidateId": "extraction-candidate.7f6a6f9769b8f3d8d3c55069",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:30, 203, 207",
          "page": null,
          "section": "Intended use; Scheduled maintenance chart"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "generic-structured",
      "value": {
        "rawUnit": null,
        "rawValue": "Extreme damp/muddy or dusty/dry conditions can cause above-average wear of the drive system, brakes or air filter and may require earlier service or replacement."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-severe-use"
    ]
  },
  {
    "id": "rider-service-core.electrical-fuse-ratings",
    "type": "fuse",
    "categoryId": "fuses",
    "label": "electrical.fuse-ratings",
    "value": {
      "type": "text",
      "text": "Fuse box A: Key 1 ECU/ABS/IMU 5 A; Key 2 Dashboard/BBS 15 A; Key 3 Accessories 10 A; Diagnostics 7.5 A; Fuel pump relay 10 A. Fuse box B: El. loads relay 25 A; Starter relay 7.5 A; Dashboard 20 A; BBS 10 A; ABS 20 A; ABS 25 A. Positions and ratings are marked on the box cover."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "electrical.fuse-ratings",
      "details": {
        "action": null,
        "association": {
          "location": "RH central side under RH side cover; box A LH, box B RH",
          "structure": "function-amperage-location"
        },
        "sourceText": "Fuse box A: Key 1 ECU/ABS/IMU 5 A; Key 2 Dashboard/BBS 15 A; Key 3 Accessories 10 A; Diagnostics 7.5 A; Fuel pump relay 10 A. Fuse box B: El. loads relay 25 A; Starter relay 7.5 A; Dashboard 20 A; BBS 10 A; ABS 20 A; ABS 25 A. Positions and ratings are marked on the box cover.",
        "technology": null
      },
      "id": "service-core-record.a7ab78ffa69012ec00efa0f0",
      "provenance": {
        "candidateId": "extraction-candidate.0cadd1fa0027b4d9117c881f",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:222-224",
          "page": null,
          "section": "Technical data; Fuses"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "fuse",
      "value": {
        "rawUnit": null,
        "rawValue": "Fuse box A: Key 1 ECU/ABS/IMU 5 A; Key 2 Dashboard/BBS 15 A; Key 3 Accessories 10 A; Diagnostics 7.5 A; Fuel pump relay 10 A. Fuse box B: El. loads relay 25 A; Starter relay 7.5 A; Dashboard 20 A; BBS 10 A; ABS 20 A; ABS 25 A. Positions and ratings are marked on the box cover."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.electrical-fuse-ratings"
    ]
  },
  {
    "id": "rider-service-core.engine-configuration",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.configuration",
    "value": {
      "type": "text",
      "text": "Testastretta 11°, V2 90°, 4 valves per cylinder, desmodromic timing system, liquid cooling."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.configuration",
      "details": null,
      "id": "service-core-record.bd9e5a1a2a81e21ae4ab8bd4",
      "provenance": {
        "candidateId": "extraction-candidate.e0c799a4873bdfc597af773a",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Testastretta 11°, V2 90°, 4 valves per cylinder, desmodromic timing system, liquid cooling."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-configuration"
    ]
  },
  {
    "id": "rider-service-core.dimensions-mass-seat-height",
    "type": "specification",
    "categoryId": "general",
    "label": "dimensions_mass.seat-height",
    "value": {
      "type": "text",
      "text": "Seat height: 820 mm (32.28 in), lowered seat (Performance) 800 mm (31.50 in)."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "dimensions_mass.seat-height",
      "details": null,
      "id": "service-core-record.c4fb270df4ff7493bcc63ad5",
      "provenance": {
        "candidateId": "extraction-candidate.742db18c70854d2f2b34d152",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:209",
          "page": null,
          "section": "Technical data; Dimensions; Monster 937"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Seat height: 820 mm (32.28 in), lowered seat (Performance) 800 mm (31.50 in)."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.dimensions_mass-seat-height"
    ]
  },
  {
    "id": "rider-service-core.maintenance-replace",
    "type": "maintenance-task",
    "categoryId": "maintenance",
    "label": "maintenance.replace",
    "value": {
      "type": "text",
      "text": "Dealer operations include changing engine oil and filter, air filter, timing belts, spark plugs, coolant, front fork fluid and brake/clutch fluid at the listed schedule points."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.replace",
      "details": {
        "action": "REPLACE",
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.039",
          "printedPage": "203-205",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Dealer operations include changing engine oil and filter, air filter, timing belts, spark plugs, coolant, front fork fluid and brake/clutch fluid at the listed schedule points.",
        "technology": null
      },
      "id": "service-core-record.d6abf07ab6d1dfdc6136e268",
      "provenance": {
        "candidateId": "extraction-candidate.f82840f67cbe31ec181f7075",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:203-205",
          "page": null,
          "section": "Scheduled maintenance chart"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "maintenance",
      "value": {
        "rawUnit": null,
        "rawValue": "Dealer operations include changing engine oil and filter, air filter, timing belts, spark plugs, coolant, front fork fluid and brake/clutch fluid at the listed schedule points."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-replace"
    ]
  },
  {
    "id": "rider-service-core.fuel-intake-fuel-type-octane",
    "type": "specification",
    "categoryId": "general",
    "label": "fuel_intake.fuel-type-octane",
    "value": {
      "type": "text",
      "text": "Fuel supply: 95-98 RON."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "fuel_intake.fuel-type-octane",
      "details": null,
      "id": "service-core-record.e7f15ddd98fcfa04c51830ba",
      "provenance": {
        "candidateId": "extraction-candidate.4575f31910a59f46a186b6f9",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:216",
          "page": null,
          "section": "Performance data; Fuel system"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Fuel supply: 95-98 RON."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.fuel_intake-fuel-type-octane"
    ]
  },
  {
    "id": "rider-service-core.lighting-front-indicators",
    "type": "specification",
    "categoryId": "lighting",
    "label": "lighting.front-indicators",
    "value": {
      "type": "text",
      "text": "LED front turn indicators: no. 6; LED front turn indicators (USA-ROK): no. 3."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.front-indicators",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; market-specific USA-ROK alternative retained"
        },
        "sourceText": "LED front turn indicators: no. 6; LED front turn indicators (USA-ROK): no. 3.",
        "technology": "LED"
      },
      "id": "service-core-record.ed31530577c14fa4a13db1c0",
      "provenance": {
        "candidateId": "extraction-candidate.e905fe19a848c8b061d8ced2",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "LED front turn indicators: no. 6; LED front turn indicators (USA-ROK): no. 3."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-front-indicators"
    ]
  },
  {
    "id": "rider-service-core.lighting-license-plate",
    "type": "specification",
    "categoryId": "lighting",
    "label": "lighting.license-plate",
    "value": {
      "type": "text",
      "text": "Tail light: LED number plate light no. 3."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.license-plate",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; no bulb/socket claimed"
        },
        "sourceText": "Tail light: LED number plate light no. 3.",
        "technology": "LED"
      },
      "id": "service-core-record.ef9d383069ac5586b73abf4d",
      "provenance": {
        "candidateId": "extraction-candidate.14005ff03b277a8608fb649e",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "Tail light: LED number plate light no. 3."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-license-plate"
    ]
  },
  {
    "id": "rider-service-core.engine-displacement",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.displacement",
    "value": {
      "type": "text",
      "text": "Total displacement: 937 cu. cm (57.18 cu in)"
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.displacement",
      "details": null,
      "id": "service-core-record.f45632094cee31cdb6f56b42",
      "provenance": {
        "candidateId": "extraction-candidate.cf01bdc17689c758e99374d7",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Total displacement: 937 cu. cm (57.18 cu in)"
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-displacement"
    ]
  },
  {
    "id": "rider-service-core.maintenance-clean",
    "type": "maintenance-task",
    "categoryId": "maintenance",
    "label": "maintenance.clean",
    "value": {
      "type": "text",
      "text": "Dealer operations include checking and cleaning the air filter; chain cleaning guidance is provided in the drive-chain maintenance section."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "maintenance.clean",
      "details": {
        "action": "CLEAN",
        "association": {
          "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
          "originalCandidateId": "ducati.monster937.core.raw.042",
          "printedPage": "185, 204",
          "sourceContext": null,
          "sourceId": "ducati.acquisition.monster937.owner.my21"
        },
        "sourceText": "Dealer operations include checking and cleaning the air filter; chain cleaning guidance is provided in the drive-chain maintenance section.",
        "technology": null
      },
      "id": "service-core-record.f70c52c547954c420e11edfa",
      "provenance": {
        "candidateId": "extraction-candidate.d82d25a3079b703345ae60e0",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:185, 204",
          "page": null,
          "section": "Checking drive chain tension; Scheduled maintenance chart"
        }
      },
      "recordType": "repeating",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "maintenance",
      "value": {
        "rawUnit": null,
        "rawValue": "Dealer operations include checking and cleaning the air filter; chain cleaning guidance is provided in the drive-chain maintenance section."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.maintenance-clean"
    ]
  },
  {
    "id": "rider-service-core.transmission-clutch-clutch-type",
    "type": "specification",
    "categoryId": "general",
    "label": "transmission_clutch.clutch-type",
    "value": {
      "type": "text",
      "text": "Wet clutch controlled by the lever on left-hand side of the handlebar."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "transmission_clutch.clutch-type",
      "details": null,
      "id": "service-core-record.f86383605ad17fcd39bfc5e6",
      "provenance": {
        "candidateId": "extraction-candidate.9b3013f70c7459e2f618ebd8",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:218",
          "page": null,
          "section": "Technical data; Transmission"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Wet clutch controlled by the lever on left-hand side of the handlebar."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.transmission_clutch-clutch-type"
    ]
  },
  {
    "id": "rider-service-core.engine-stroke",
    "type": "specification",
    "categoryId": "general",
    "label": "engine.stroke",
    "value": {
      "type": "text",
      "text": "Stroke: 67.5 mm (2.66 in)"
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "engine.stroke",
      "details": null,
      "id": "service-core-record.f9385d5c1b87a9ab531c3791",
      "provenance": {
        "candidateId": "extraction-candidate.e3937800396a66b35584ee27",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:214",
          "page": null,
          "section": "Engine"
        }
      },
      "recordType": "scalar",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": null,
      "value": {
        "rawUnit": null,
        "rawValue": "Stroke: 67.5 mm (2.66 in)"
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.engine-stroke"
    ]
  },
  {
    "id": "rider-service-core.lighting-rear-tail",
    "type": "specification",
    "categoryId": "lighting",
    "label": "lighting.rear-tail",
    "value": {
      "type": "text",
      "text": "Tail light: LED parking light no. 4."
    },
    "riderServiceCore": {
      "applicability": {
        "abs": true,
        "equipment": "base Monster 937",
        "market": "EU",
        "modelYear": 2021,
        "transmission": "manual"
      },
      "canonicalFieldId": "lighting.rear-tail",
      "details": {
        "action": null,
        "association": {
          "replaceability": "LED module; no bulb/socket claimed"
        },
        "sourceText": "Tail light: LED parking light no. 4.",
        "technology": "LED"
      },
      "id": "service-core-record.fb8eb12e9e33f3816be2e63f",
      "provenance": {
        "candidateId": "extraction-candidate.134a5f9753ed5cf3692acb24",
        "documentId": "Ducati|OM-Monster-937-937-Plus-EN-MY21",
        "sourceId": "ducati.acquisition.monster937.owner.my21",
        "sourceLocation": {
          "locator": "printed-page:221",
          "page": null,
          "section": "Technical data; Electric system"
        }
      },
      "recordType": "structured",
      "schemaVersion": "revlog-rider-service-core-record/v1",
      "structureType": "lighting",
      "value": {
        "rawUnit": null,
        "rawValue": "Tail light: LED parking light no. 4."
      }
    },
    "status": "verified",
    "sourceIds": [
      "cite.ducati.monster937-2021.om.core.lighting-rear-tail"
    ]
  }
]);
return Object.freeze({ records: Object.freeze([]), entries });
});
