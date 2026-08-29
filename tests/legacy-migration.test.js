const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = { window: {} };
context.window = context;
vm.createContext(context);

[
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js"
].forEach(relativePath => {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
});

const catalog = context.MotorcycleCatalog;

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertUnique(motorcycle, expectedCatalogVariantKey) {
  const result = plain(catalog.analyzeLegacyMotorcycle(motorcycle));
  assert.equal(result.status, "unique");
  assert.equal(result.candidateCount, 1);
  assert.equal(result.catalogVariantKey, expectedCatalogVariantKey);
  assert.equal(result.candidates[0].catalogVariantKey, expectedCatalogVariantKey);
  return result;
}

assertUnique(
  { brand: "Honda", model: "VFR800 VTEC", year: 2002 },
  "honda.vfr800.rc46.vtec.gen1"
);
assertUnique(
  { brand: "Honda", model: "VFR800 VTEC 2006", year: 2006 },
  "honda.vfr800.rc46.vtec.gen2"
);
assertUnique(
  { brand: "Yamaha", model: "FZ1-N", year: 2010 },
  "yamaha.fz1.gen2.n"
);
assertUnique(
  { brand: "Yamaha", model: "FZ1-S", year: 2010 },
  "yamaha.fz1.gen2.s"
);

const alreadyMigrated = plain(catalog.analyzeLegacyMotorcycle({
  brand: "Nieistotna marka",
  model: "Nieistotny model",
  year: null,
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
}));
assert.equal(alreadyMigrated.status, "already_migrated");
assert.equal(
  alreadyMigrated.catalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1"
);
assert.equal(alreadyMigrated.candidateCount, 0);

assert.deepEqual(
  plain(catalog.analyzeLegacyMotorcycle({
    brand: "Mój motocykl",
    model: "Custom",
    year: 2005
  })),
  { status: "not_found", candidates: [], candidateCount: 0 }
);

[null, "", undefined].forEach(year => {
  const result = plain(catalog.analyzeLegacyMotorcycle({
    brand: "Honda",
    model: "VFR800 VTEC",
    year
  }));
  assert.equal(result.status, "not_found");
  assert.equal(result.candidateCount, 0);
});

assertUnique(
  {
    brand: "Yamaha",
    model: "FZ1-N",
    year: 2010,
    catalogVariantKey: null
  },
  "yamaha.fz1.gen2.n"
);
assertUnique(
  { brand: "Yamaha", model: "FZ1-S", year: 2010 },
  "yamaha.fz1.gen2.s"
);

const immutableInput = {
  brand: "  HONDA ",
  model: " VFR800   VTEC ",
  year: "2002",
  catalogVariantKey: null
};
const immutableSnapshot = JSON.stringify(immutableInput);
assertUnique(immutableInput, "honda.vfr800.rc46.vtec.gen1");
assert.equal(JSON.stringify(immutableInput), immutableSnapshot);

const examples = {
  mt07: assertUnique(
    { brand: "Yamaha", model: "MT-07 2014", year: 2015 },
    "yamaha.mt-07.gen1"
  ),
  bmwGs: assertUnique(
    { brand: "BMW", model: "R 1200 GS K50 2017", year: 2017 },
    "bmw.r1200gs.k50.gen2"
  ),
  africaTwin: assertUnique(
    {
      brand: "Honda",
      model: "CRF1100L Africa Twin 2020",
      year: 2022
    },
    "honda.africa-twin.crf1100l-1"
  ),
  panigale: assertUnique(
    { brand: "Ducati", model: "Panigale V4 2018", year: 2020 },
    "ducati.panigale.v4-1"
  )
};

let variantCount = 0;
let variantYearCount = 0;
let uniqueCount = 0;
const ambiguous = [];
const notFound = [];

catalog.brands.forEach(brand => {
  brand.models.forEach(model => {
    model.variants.forEach(variant => {
      variantCount += 1;
      catalog.getYears(brand.id, model.id, variant.id).forEach(year => {
        variantYearCount += 1;
        const motorcycle = {
          brand: brand.name,
          model: variant.storedModel,
          year
        };
        const result = plain(catalog.analyzeLegacyMotorcycle(motorcycle));

        if (result.status === "unique" &&
            result.catalogVariantKey === variant.key) {
          uniqueCount += 1;
        } else if (result.status === "ambiguous") {
          ambiguous.push({ motorcycle, candidates: result.candidates });
        } else {
          notFound.push({ motorcycle, result });
        }
      });
    });
  });
});

assert.equal(variantCount, 719);
assert.equal(variantYearCount, 3238);
assert.equal(uniqueCount, variantYearCount);
assert.deepEqual(ambiguous, []);
assert.deepEqual(notFound, []);

const vfrModel = catalog.getModel("honda", "vfr800");
vfrModel.variants.push({
  id: "synthetic-conflict",
  key: "test.synthetic.conflict",
  name: "Synthetic conflict",
  storedModel: "VFR800 VTEC",
  yearFrom: 2002,
  yearTo: 2002
});
const syntheticAmbiguity = plain(catalog.analyzeLegacyMotorcycle({
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002
}));
vfrModel.variants.pop();
assert.equal(syntheticAmbiguity.status, "ambiguous");
assert.equal(syntheticAmbiguity.candidateCount, 2);

console.log(JSON.stringify({
  variants: variantCount,
  variantYears: variantYearCount,
  unique: uniqueCount,
  ambiguous: ambiguous.length,
  notFound: notFound.length,
  examples: {
    mt07: examples.mt07.catalogVariantKey,
    bmwGs: examples.bmwGs.catalogVariantKey,
    africaTwin: examples.africaTwin.catalogVariantKey,
    panigale: examples.panigale.catalogVariantKey
  },
  inputNotModified: true,
  syntheticAmbiguityClassification: true,
  status: "OK"
}, null, 2));
