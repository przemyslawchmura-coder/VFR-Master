const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createElement() {
  return {
    value: "",
    disabled: false,
    hidden: false,
    children: [],
    appendChild(child) {
      this.children.push(child);
    },
    set innerHTML(value) {
      this.children = [];
      this.value = "";
    },
    get innerHTML() {
      return "";
    }
  };
}

const elementIds = [
  "garageCatalogBrand",
  "garageCatalogFields",
  "garageCatalogModel",
  "garageCatalogVariant",
  "garageCatalogYear",
  "garageCatalogYearField"
];
const elements = Object.fromEntries(
  elementIds.map(id => [id, createElement()])
);
const context = {
  window: {},
  document: {
    getElementById(id) { return elements[id] || null; },
    createElement() { return createElement(); },
    addEventListener() {}
  },
  alert() {}
};
context.window = context;
vm.createContext(context);

for (const relativePath of [
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js"
]) {
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8"),
    context,
    { filename: relativePath }
  );
}

const catalog = context.MotorcycleCatalog;
const hondaModels = catalog.getModelsByBrand("honda");
const yamahaModels = catalog.getModelsByBrand("yamaha");

assert.ok(hondaModels.some(model => model.name === "VFR800"));
assert.ok(!hondaModels.some(model => model.name === "FZ1"));
assert.ok(yamahaModels.some(model => model.name === "FZ1"));

const hondaVariants = catalog.getVariantsByBrandModel("honda", "vfr800");
const yamahaVariants = catalog.getVariantsByBrandModel("yamaha", "fz1");
assert.ok(hondaVariants.some(variant =>
  variant.key === "honda.vfr800.rc46.vtec.gen1"
));
assert.ok(yamahaVariants.some(variant =>
  variant.key === "yamaha.fz1.gen2.s"
));

vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", "js/app.js"), "utf8"),
  context,
  { filename: "js/app.js" }
);

vm.runInContext("initializeMotorcycleForm()", context);
elements.garageCatalogBrand.value = "honda";
vm.runInContext("handleCatalogBrandChange()", context);
assert.ok(elements.garageCatalogModel.children.some(option =>
  option.textContent === "VFR800"
));
elements.garageCatalogModel.value = "vfr800";
vm.runInContext("handleCatalogModelChange()", context);
elements.garageCatalogVariant.value =
  "honda.vfr800.rc46.vtec.gen1";
vm.runInContext("handleCatalogVariantChange()", context);
elements.garageCatalogYear.value = "2002";
assert.equal(
  vm.runInContext("getMotorcycleFormSelection().catalogVariantKey", context),
  "honda.vfr800.rc46.vtec.gen1"
);

elements.garageCatalogBrand.value = "yamaha";
vm.runInContext("handleCatalogBrandChange()", context);
assert.equal(elements.garageCatalogModel.value, "");
assert.equal(elements.garageCatalogVariant.value, "");
assert.equal(elements.garageCatalogVariant.disabled, true);

elements.garageCatalogModel.value = "fz1";
vm.runInContext("handleCatalogModelChange()", context);
assert.equal(elements.garageCatalogVariant.value, "");

elements.garageCatalogVariant.value = "missing.variant";
elements.garageCatalogYear.value = "2006";
assert.equal(vm.runInContext("getMotorcycleFormSelection()", context), null);

assert.equal(vm.runInContext(
  "getServicePlanStatus({ mileage: 1000 }, { nextMileage: 5000 }, new Date('2026-01-01')).key",
  context
), "ok");
assert.equal(vm.runInContext(
  "getServicePlanStatus({ mileage: 1000 }, { nextMileage: 1900 }, new Date('2026-01-01')).key",
  context
), "warning");
assert.equal(vm.runInContext(
  "getServicePlanStatus({ mileage: 1000 }, { nextMileage: 900 }, new Date('2026-01-01')).key",
  context
), "danger");
assert.equal(vm.runInContext(
  "getServicePlanStatus({ mileage: 1000 }, null, new Date('2026-01-01')).key",
  context
), "empty");

const selection = catalog.resolveByKey(
  "honda",
  "vfr800",
  "honda.vfr800.rc46.vtec.gen1",
  2002
);
assert.equal(selection.catalogVariantKey,
  "honda.vfr800.rc46.vtec.gen1");
assert.equal(catalog.resolveByKey(
  "honda", "vfr800", "yamaha.fz1.gen2.s", 2006
), null);
assert.equal(catalog.resolveByKey("honda", "vfr800", "", 2002), null);

console.log(JSON.stringify({
  brandFiltersModels: true,
  modelFiltersVariants: true,
  dependentSelectionsReset: true,
  variantSetsCatalogVariantKey: true,
  invalidAndMissingVariantRejected: true,
  status: "OK"
}, null, 2));
