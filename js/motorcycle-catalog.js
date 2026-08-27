/* =========================================================
   VFR MASTER — CENTRALNY KATALOG MOTOCYKLI
   Dane katalogowe są ładowane z data/motorcycle-catalog.js.
   Sam katalog nie rejestruje żadnej bazy TechnicalDatabase.
   ========================================================= */
const MotorcycleCatalog = {
  manualBrandId: "manual",
  brands: window.MotorcycleCatalogData || [],

  normalizeLegacyText(value) {
    return String(value ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("pl-PL");
  },

  normalizeLegacyYear(value) {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const year = Number(value);
    return Number.isInteger(year) ? year : null;
  },

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

  findLegacyVariantCandidates({ brand, model, year } = {}) {
    const normalizedBrand = this.normalizeLegacyText(brand);
    const normalizedModel = this.normalizeLegacyText(model);
    const normalizedYear = this.normalizeLegacyYear(year);

    if (!normalizedBrand || !normalizedModel || normalizedYear === null) {
      return [];
    }

    return this.brands.flatMap(catalogBrand => {
      if (this.normalizeLegacyText(catalogBrand.name) !== normalizedBrand) {
        return [];
      }

      return catalogBrand.models.flatMap(catalogModel =>
        catalogModel.variants
          .filter(variant =>
            this.normalizeLegacyText(variant.storedModel) ===
              normalizedModel &&
            normalizedYear >= variant.yearFrom &&
            normalizedYear <= variant.yearTo
          )
          .map(variant => ({
            brandId: catalogBrand.id,
            modelId: catalogModel.id,
            variantId: variant.id,
            catalogVariantKey: variant.key,
            storedModel: variant.storedModel,
            yearFrom: variant.yearFrom,
            yearTo: variant.yearTo
          }))
      );
    });
  },

  analyzeLegacyMotorcycle(motorcycle = {}) {
    const existingCatalogVariantKey =
      String(motorcycle.catalogVariantKey ?? "").trim();

    if (existingCatalogVariantKey) {
      return {
        status: "already_migrated",
        catalogVariantKey: motorcycle.catalogVariantKey,
        candidates: [],
        candidateCount: 0
      };
    }

    const candidates = this.findLegacyVariantCandidates(motorcycle);
    const candidateCount = candidates.length;

    if (candidateCount === 1) {
      return {
        status: "unique",
        catalogVariantKey: candidates[0].catalogVariantKey,
        candidates,
        candidateCount
      };
    }

    return {
      status: candidateCount > 1 ? "ambiguous" : "not_found",
      candidates,
      candidateCount
    };
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
