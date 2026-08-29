/* =========================================================
   VFR MASTER — CENTRALNY KATALOG MOTOCYKLI
   Dane katalogowe są ładowane z data/motorcycle-catalog.js.
   Sam katalog nie rejestruje żadnej bazy TechnicalDatabase.
   ========================================================= */
const MotorcycleCatalog = {
  brands: window.MotorcycleCatalogData || [],

  getBrands() {
    return [...this.brands].sort((a, b) =>
      a.name.localeCompare(b.name, "pl-PL")
    );
  },

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

  normalizeSelectableYears(values) {
    if (!Array.isArray(values)) return [];

    return [...new Set(values
      .map(value => {
        if (Number.isInteger(value)) return value;
        if (typeof value !== "string" || !/^\d{4}$/.test(value.trim())) {
          return null;
        }
        return Number(value);
      })
      .filter(year => year !== null))]
      .sort((left, right) => right - left);
  },

  getBrand(brandId) {
    return this.brands.find(brand => brand.id === brandId) || null;
  },

  getModels(brandId) {
    const brand = this.getBrand(brandId);
    return brand ? brand.models : [];
  },

  getModelsByBrand(brandId) {
    return [...this.getModels(brandId)].sort((a, b) =>
      a.name.localeCompare(b.name, "pl-PL")
    );
  },

  getModel(brandId, modelId) {
    return this.getModels(brandId)
      .find(model => model.id === modelId) || null;
  },

  getVariants(brandId, modelId) {
    const model = this.getModel(brandId, modelId);
    return model ? model.variants : [];
  },

  getVariantsByBrandModel(brandId, modelId) {
    return [...this.getVariants(brandId, modelId)].sort((a, b) =>
      a.name.localeCompare(b.name, "pl-PL")
    );
  },

  getVariantByKey(key) {
    const normalizedKey = String(key ?? "").trim();
    if (!normalizedKey) return null;

    for (const brand of this.brands) {
      for (const model of brand.models) {
        const variant = model.variants.find(item => item.key === normalizedKey);
        if (variant) return { brand, model, variant };
      }
    }

    return null;
  },

  getVariant(brandId, modelId, variantId) {
    return this.getVariants(brandId, modelId)
      .find(variant => variant.id === variantId) || null;
  },

  getYears(brandId, modelId, variantId) {
    const variant = this.getVariant(brandId, modelId, variantId);
    if (
      !variant ||
      !Number.isInteger(variant.yearFrom) ||
      !Number.isInteger(variant.yearTo) ||
      variant.yearFrom > variant.yearTo
    ) return [];

    return this.normalizeSelectableYears(Array.from(
      { length: variant.yearTo - variant.yearFrom + 1 },
      (_, index) => variant.yearFrom + index
    ));
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
  },

  resolveByKey(brandId, modelId, catalogVariantKey, year) {
    const match = this.getVariantByKey(catalogVariantKey);
    if (!match || match.brand.id !== brandId || match.model.id !== modelId) {
      return null;
    }

    return this.resolve(brandId, modelId, match.variant.id, year);
  },

  validateMotorcycleSelection({ brand, model, year, catalogVariantKey } = {}) {
    const match = this.getVariantByKey(catalogVariantKey);
    const normalizedYear = this.normalizeLegacyYear(year);

    return Boolean(
      match &&
      match.brand.name === brand &&
      match.variant.storedModel === model &&
      normalizedYear !== null &&
      normalizedYear >= match.variant.yearFrom &&
      normalizedYear <= match.variant.yearTo
    );
  }
};

window.MotorcycleCatalog = MotorcycleCatalog;
