/* =========================================================
   VFR MASTER — CENTRALNY KATALOG MOTOCYKLI
   Dane katalogowe są ładowane z data/motorcycle-catalog.js.
   Sam katalog nie rejestruje żadnej bazy TechnicalDatabase.
   ========================================================= */
const MotorcycleCatalog = {
  manualBrandId: "manual",
  brands: window.MotorcycleCatalogData || [],

  getBrand(brandId) {
    return this.brands.find(brand => brand.id === brandId) || null;
  },

  getModels(brandId) {
    const brand = this.getBrand(brandId);
    return brand ? brand.models : [];
  },

  getModel(brandId, modelId) {
    return this.getModels(brandId)
      .find(model => model.id === modelId) || null;
  },

  getVariants(brandId, modelId) {
    const model = this.getModel(brandId, modelId);
    return model ? model.variants : [];
  },

  getVariant(brandId, modelId, variantId) {
    return this.getVariants(brandId, modelId)
      .find(variant => variant.id === variantId) || null;
  },

  getYears(brandId, modelId, variantId) {
    const variant = this.getVariant(brandId, modelId, variantId);
    if (!variant) return [];

    return Array.from(
      { length: variant.yearTo - variant.yearFrom + 1 },
      (_, index) => variant.yearFrom + index
    );
  },

  resolve(brandId, modelId, variantId, year) {
    const brand = this.getBrand(brandId);
    const model = this.getModel(brandId, modelId);
    const variant = this.getVariant(brandId, modelId, variantId);
    const normalizedYear = Number(year);

    if (
      !brand || !model || !variant ||
      !this.getYears(brandId, modelId, variantId).includes(normalizedYear)
    ) {
      return null;
    }

    return {
      brand: brand.name,
      model: variant.storedModel,
      year: normalizedYear,
      catalogVariantKey: variant.key
    };
  }
};

window.MotorcycleCatalog = MotorcycleCatalog;
