const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = { window: {} };
context.window = context;
vm.createContext(context);

for (const relativePath of [
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js"
]) {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
}

const catalog = context.MotorcycleCatalog;
const errors = [];
const normalize = value =>
  String(value || "").trim().toLocaleLowerCase("pl-PL");

function checkUnique(items, property, scope) {
  const seen = new Set();
  items.forEach(item => {
    const value = normalize(item[property]);
    if (!value) errors.push(`${scope}: puste ${property}`);
    if (seen.has(value)) {
      errors.push(`${scope}: duplikat ${property} "${item[property]}"`);
    }
    seen.add(value);
  });
}

assert.ok(catalog, "MotorcycleCatalog nie jest dostępny globalnie");
assert.deepEqual(
  JSON.parse(JSON.stringify(catalog.getBrands().map(brand => brand.name))),
  [...catalog.getBrands().map(brand => brand.name)].sort((a, b) =>
    a.localeCompare(b, "pl-PL")
  )
);
assert.equal(new Set(catalog.getBrands().map(brand => brand.name)).size,
  catalog.getBrands().length);
assert.ok(catalog.getBrands().some(brand => brand.name === "Honda"));
assert.ok(catalog.getBrands().some(brand => brand.name === "Yamaha"));
checkUnique(catalog.brands, "id", "katalog");
checkUnique(catalog.brands, "name", "katalog");

const storedModelYears = new Map();
const catalogVariantKeys = new Map();
const safeCatalogVariantKey = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
let modelCount = 0;
let variantCount = 0;
let variantYearCount = 0;

catalog.brands.forEach(brand => {
  checkUnique(brand.models, "id", brand.name);
  checkUnique(brand.models, "name", brand.name);
  modelCount += brand.models.length;

  brand.models.forEach(model => {
    const scope = `${brand.name} / ${model.name}`;
    checkUnique(model.variants, "id", scope);
    checkUnique(model.variants, "name", scope);
    variantCount += model.variants.length;

    model.variants.forEach(variant => {
      const keyScope = `${scope} / ${variant.id}`;

      if (typeof variant.key !== "string") {
        errors.push(`${keyScope}: key nie jest stringiem`);
      } else if (!variant.key) {
        errors.push(`${keyScope}: pusty key`);
      } else {
        if (variant.key !== variant.key.toLowerCase()) {
          errors.push(`${keyScope}: key nie jest lowercase`);
        }
        if (/\s/.test(variant.key)) {
          errors.push(`${keyScope}: key zawiera spację`);
        }
        if (!safeCatalogVariantKey.test(variant.key)) {
          errors.push(`${keyScope}: key ma niebezpieczny format`);
        }

        const previousKeyOwner = catalogVariantKeys.get(variant.key);
        if (previousKeyOwner) {
          errors.push(
            `${keyScope}: globalny duplikat key z ${previousKeyOwner}`
          );
        } else {
          catalogVariantKeys.set(variant.key, keyScope);
        }
      }

      if (!normalize(variant.storedModel)) {
        errors.push(`${scope} / ${variant.id}: puste storedModel`);
      }
      if (!Number.isInteger(variant.yearFrom) ||
          !Number.isInteger(variant.yearTo)) {
        errors.push(`${scope} / ${variant.id}: niecałkowity rocznik`);
      }
      if (variant.yearFrom < 1990 || variant.yearTo > 2025) {
        errors.push(`${scope} / ${variant.id}: rocznik poza 1990–2025`);
      }
      if (variant.yearFrom > variant.yearTo) {
        errors.push(`${scope} / ${variant.id}: odwrócony zakres`);
        return;
      }

      const years = catalog.getYears(brand.id, model.id, variant.id);
      const expectedLength = variant.yearTo - variant.yearFrom + 1;
      variantYearCount += expectedLength;

      if (years.length !== expectedLength ||
          years[0] !== variant.yearFrom ||
          years[years.length - 1] !== variant.yearTo) {
        errors.push(`${scope} / ${variant.id}: błędny wynik getYears`);
      }

      years.forEach(year => {
        const key = [
          normalize(brand.name),
          normalize(variant.storedModel),
          year
        ].join("|");
        const previous = storedModelYears.get(key);

        if (previous) {
          errors.push(
            `${scope} / ${variant.id}: konflikt ${variant.storedModel} ` +
            `${year} z ${previous}`
          );
        } else {
          storedModelYears.set(key, `${scope} / ${variant.id}`);
        }

        const resolved = catalog.resolve(
          brand.id,
          model.id,
          variant.id,
          year
        );
        if (!resolved || resolved.brand !== brand.name ||
            resolved.model !== variant.storedModel ||
            resolved.year !== year ||
            resolved.catalogVariantKey !== variant.key) {
          errors.push(`${scope} / ${variant.id}: błędny resolve dla ${year}`);
        }
      });

      if (catalog.resolve(
        brand.id, model.id, variant.id, variant.yearFrom - 1
      ) !== null || catalog.resolve(
        brand.id, model.id, variant.id, variant.yearTo + 1
      ) !== null) {
        errors.push(`${scope} / ${variant.id}: zaakceptowano rok spoza zakresu`);
      }
    });
  });
});

assert.deepEqual(
  JSON.parse(JSON.stringify(
    catalog.resolve("honda", "vfr800", "vtec", 2002)
  )),
  {
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  }
);

const hondaVariant = catalog.getVariantByKey(
  "honda.vfr800.rc46.vtec.gen1"
);
assert.ok(hondaVariant);
assert.equal(hondaVariant.brand.name, "Honda");
assert.equal(hondaVariant.model.name, "VFR800");
assert.equal(hondaVariant.variant.storedModel, "VFR800 VTEC");

const yamahaVariant = catalog.getVariantByKey("yamaha.fz1.gen2.s");
assert.ok(yamahaVariant);
assert.equal(yamahaVariant.brand.name, "Yamaha");
assert.equal(yamahaVariant.variant.storedModel, "FZ1-S");
assert.equal(catalog.getVariantByKey("missing.variant"), null);

assert.equal(catalog.validateMotorcycleSelection({
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
}), true);
assert.equal(catalog.validateMotorcycleSelection({
  brand: "Honda",
  model: "FZ1-S",
  year: 2006,
  catalogVariantKey: "yamaha.fz1.gen2.s"
}), false);
assert.deepEqual(
  JSON.parse(JSON.stringify(
    catalog.resolve("yamaha", "fz1", "n", 2010)
  )),
  {
    brand: "Yamaha",
    model: "FZ1-N",
    year: 2010,
    catalogVariantKey: "yamaha.fz1.gen2.n"
  }
);
assert.deepEqual(
  JSON.parse(JSON.stringify(
    catalog.resolve("yamaha", "fz1", "s", 2012)
  )),
  {
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2012,
    catalogVariantKey: "yamaha.fz1.gen2.s"
  }
);

assert.deepEqual(errors, [], errors.join("\n"));
console.log(JSON.stringify({
  brands: catalog.brands.length,
  models: modelCount,
  variants: variantCount,
  catalogVariantKeys: catalogVariantKeys.size,
  variantYears: variantYearCount,
  status: "OK"
}, null, 2));
