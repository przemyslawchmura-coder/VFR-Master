const MotorcycleDatabase = {

  motorcycleColumns:
    "id, user_id, brand, model, year, mileage, vin, nickname, " +
    "catalog_variant_key, created_at",

  legacyMotorcycleColumns:
    "id, user_id, brand, model, year, mileage, vin, nickname, created_at",

  motorcycles: [],

  activeMotorcycleId: null,

  lastError: null,

  legacyServiceData: {},

  legacyServiceStorageKey:
    "vfrMasterLegacyServiceData",

  setError(error, fallbackMessage) {
    this.lastError =
      error && error.message
        ? error.message
        : fallbackMessage;

    if (error) {
      console.error(error);
    }
  },

  isMissingCatalogVariantKeyColumnError(error) {
    if (!error || !["PGRST204", "42703"].includes(error.code)) {
      return false;
    }

    const errorText = [
      error.message,
      error.details,
      error.hint
    ].filter(Boolean).join(" ").toLowerCase();

    return errorText.includes("catalog_variant_key");
  },

  serializeMotorcycle(motorcycle, userId, includeCatalogVariantKey = true) {
    const payload = {
      user_id: userId,
      brand: motorcycle.brand,
      model: motorcycle.model,
      year:
        motorcycle.year === "" ||
        motorcycle.year === undefined
          ? null
          : Number(motorcycle.year),
      mileage: Number(motorcycle.mileage || 0),
      vin: motorcycle.vin || null,
      nickname: motorcycle.nickname || null
    };

    if (includeCatalogVariantKey) {
      payload.catalog_variant_key =
        motorcycle.catalogVariantKey || null;
    }

    return payload;
  },

  deserializeMotorcycle(motorcycle) {
    const {
      catalog_variant_key: catalogVariantKey,
      ...applicationMotorcycle
    } = motorcycle;

    return {
      ...applicationMotorcycle,
      catalogVariantKey: catalogVariantKey ?? null
    };
  },

  analyzeLegacyMotorcycles(motorcycles) {
    const source = Array.isArray(motorcycles) ? motorcycles : [];
    const report = {
      total: source.length,
      alreadyMigrated: 0,
      unique: 0,
      ambiguous: 0,
      notFound: 0,
      results: []
    };

    report.results = source.map(motorcycle => {
      const analysis =
        window.MotorcycleCatalog.analyzeLegacyMotorcycle(motorcycle);
      const currentCatalogVariantKey =
        String(motorcycle.catalogVariantKey ?? "").trim()
          ? motorcycle.catalogVariantKey
          : null;
      const proposedCatalogVariantKey =
        analysis.status === "unique"
          ? analysis.catalogVariantKey
          : null;

      if (analysis.status === "already_migrated") {
        report.alreadyMigrated += 1;
      } else if (analysis.status === "unique") {
        report.unique += 1;
      } else if (analysis.status === "ambiguous") {
        report.ambiguous += 1;
      } else {
        report.notFound += 1;
      }

      return {
        id: motorcycle.id ?? null,
        brand: motorcycle.brand ?? null,
        model: motorcycle.model ?? null,
        year: motorcycle.year ?? null,
        currentCatalogVariantKey,
        status: analysis.status,
        proposedCatalogVariantKey,
        candidateCount: analysis.candidateCount,
        candidates: analysis.candidates
      };
    });

    return report;
  },

  prepareLegacyMigration(motorcycles) {
    const analysis = this.analyzeLegacyMotorcycles(motorcycles);
    const plan = {
      total: analysis.total,
      safeToMigrate: 0,
      skippedAlreadyMigrated: 0,
      skippedAmbiguous: 0,
      skippedNotFound: 0,
      skippedMissingId: 0,
      operations: [],
      skipped: []
    };

    analysis.results.forEach(result => {
      const hasId =
        result.id !== null &&
        result.id !== undefined &&
        String(result.id).trim() !== "";
      const hasTargetKey =
        typeof result.proposedCatalogVariantKey === "string" &&
        result.proposedCatalogVariantKey.trim() !== "";
      const hasCurrentKey =
        typeof result.currentCatalogVariantKey === "string" &&
        result.currentCatalogVariantKey.trim() !== "";

      if (
        result.status === "unique" &&
        hasId &&
        hasTargetKey &&
        !hasCurrentKey
      ) {
        plan.operations.push({
          id: result.id,
          fromCatalogVariantKey: result.currentCatalogVariantKey,
          toCatalogVariantKey: result.proposedCatalogVariantKey
        });
        plan.safeToMigrate += 1;
        return;
      }

      let reason = result.status;

      if (result.status === "unique" && hasCurrentKey) {
        reason = "current_key_present";
        plan.skippedAlreadyMigrated += 1;
      } else if (result.status === "unique" && !hasId) {
        reason = "missing_id";
        plan.skippedMissingId += 1;
      } else if (result.status === "unique" && !hasTargetKey) {
        reason = "missing_target_key";
        plan.skippedNotFound += 1;
      } else if (result.status === "already_migrated") {
        plan.skippedAlreadyMigrated += 1;
      } else if (result.status === "ambiguous") {
        plan.skippedAmbiguous += 1;
      } else {
        plan.skippedNotFound += 1;
      }

      plan.skipped.push({
        id: result.id,
        brand: result.brand,
        model: result.model,
        year: result.year,
        status: result.status,
        reason
      });
    });

    return plan;
  },

  async executeLegacyMigrationPlan(plan, client) {
    if (!plan || !Array.isArray(plan.operations)) {
      throw new Error("Plan migracji musi zawierać tablicę operations.");
    }

    if (!client || typeof client.from !== "function") {
      throw new Error("Executor migracji wymaga jawnie przekazanego klienta.");
    }

    const catalogVariantKeyPattern =
      /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
    const operationIds = new Set();

    plan.operations.forEach(operation => {
      const hasId =
        operation &&
        operation.id !== null &&
        operation.id !== undefined &&
        String(operation.id).trim() !== "";
      const hasTargetKey =
        operation &&
        typeof operation.toCatalogVariantKey === "string" &&
        catalogVariantKeyPattern.test(
          operation.toCatalogVariantKey
        );
      const hasEmptySourceKey =
        operation &&
        (
          operation.fromCatalogVariantKey === null ||
          operation.fromCatalogVariantKey === undefined ||
          (
            typeof operation.fromCatalogVariantKey === "string" &&
            operation.fromCatalogVariantKey.trim() === ""
          )
        );

      if (!hasId || !hasTargetKey || !hasEmptySourceKey) {
        throw new Error("Plan migracji zawiera niepoprawną operację.");
      }

      const normalizedId = String(operation.id).trim();

      if (operationIds.has(normalizedId)) {
        throw new Error("Plan migracji zawiera zduplikowane id.");
      }

      operationIds.add(normalizedId);
    });

    const report = {
      total: plan.operations.length,
      migrated: 0,
      skipped: 0,
      failed: 0,
      results: []
    };

    for (const operation of plan.operations) {
      try {
        const { data, error } = await client
          .from("motorcycles")
          .update({
            catalog_variant_key: operation.toCatalogVariantKey
          })
          .eq("id", operation.id)
          .is("catalog_variant_key", null)
          .select("id, catalog_variant_key");

        if (error) {
          report.failed += 1;
          report.results.push({
            id: operation.id,
            toCatalogVariantKey: operation.toCatalogVariantKey,
            status: "failed",
            reason: error.message || "update_failed"
          });
        } else if (!Array.isArray(data) || data.length !== 1) {
          report.skipped += 1;
          report.results.push({
            id: operation.id,
            toCatalogVariantKey: operation.toCatalogVariantKey,
            status: "skipped",
            reason: "no_match"
          });
        } else {
          report.migrated += 1;
          report.results.push({
            id: operation.id,
            toCatalogVariantKey: operation.toCatalogVariantKey,
            status: "migrated",
            reason: null
          });
        }
      } catch (error) {
        report.failed += 1;
        report.results.push({
          id: operation.id,
          toCatalogVariantKey: operation.toCatalogVariantKey,
          status: "failed",
          reason: error.message || "update_failed"
        });
      }
    }

    return report;
  },

  async fetchMotorcycles(includeCatalogVariantKey = true) {
    return window.supabaseClient
      .from("motorcycles")
      .select(
        includeCatalogVariantKey
          ? this.motorcycleColumns
          : this.legacyMotorcycleColumns
      )
      .order("created_at", {
        ascending: true
      });
  },

  async insertMotorcycle(payload, includeCatalogVariantKey = true) {
    return window.supabaseClient
      .from("motorcycles")
      .insert(payload)
      .select(
        includeCatalogVariantKey
          ? this.motorcycleColumns
          : this.legacyMotorcycleColumns
      )
      .single();
  },

  getAll() {
    return this.motorcycles;
  },

  getActive() {
    return this.motorcycles.find(
      bike =>
        bike.id === this.activeMotorcycleId
    ) || null;
  },

  loadLegacyServiceData() {
    try {
      const saved = localStorage.getItem(
        this.legacyServiceStorageKey
      );

      this.legacyServiceData = saved
        ? JSON.parse(saved)
        : {};
    } catch (error) {
      this.legacyServiceData = {};
      this.setError(
        error,
        "Nie udało się wczytać lokalnych danych serwisowych."
      );
    }
  },

  attachLegacyServiceData(motorcycle) {
    const serviceData =
      this.legacyServiceData[motorcycle.id] || {};

    return {
      ...motorcycle,
      services:
        Array.isArray(serviceData.services)
          ? serviceData.services
          : [],
      costs:
        Array.isArray(serviceData.costs)
          ? serviceData.costs
          : [],
      history:
        Array.isArray(serviceData.history)
          ? serviceData.history
          : []
    };
  },

  save() {
    const bike = this.getActive();

    if (!bike) {
      return;
    }

    this.legacyServiceData[bike.id] = {
      services: bike.services || [],
      costs: bike.costs || [],
      history: bike.history || []
    };

    try {
      localStorage.setItem(
        this.legacyServiceStorageKey,
        JSON.stringify(this.legacyServiceData)
      );
    } catch (error) {
      this.setError(
        error,
        "Nie udało się zapisać lokalnych danych serwisowych."
      );
    }
  },

  async getSession() {
    if (!window.supabaseClient) {
      this.setError(
        null,
        "Klient Supabase nie jest dostępny."
      );

      return null;
    }

    try {
      const {
        data,
        error
      } = await window.supabaseClient.auth.getSession();

      if (error) {
        this.setError(
          error,
          "Nie udało się sprawdzić sesji Supabase."
        );

        return null;
      }

      if (!data.session) {
        this.setError(
          null,
          "Brak zalogowanej sesji Supabase."
        );

        return null;
      }

      return data.session;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return null;
    }
  },

  async load() {
    this.lastError = null;
    this.loadLegacyServiceData();

    const session = await this.getSession();

    if (!session) {
      this.motorcycles = [];
      this.activeMotorcycleId = null;

      return false;
    }

    try {
      let {
        data,
        error
      } = await this.fetchMotorcycles();

      if (this.isMissingCatalogVariantKeyColumnError(error)) {
        ({ data, error } = await this.fetchMotorcycles(false));
      }

      if (error) {
        this.setError(
          error,
          "Nie udało się wczytać motocykli z Supabase."
        );

        return false;
      }

      this.motorcycles = (data || []).map(
        motorcycle =>
          this.attachLegacyServiceData(
            this.deserializeMotorcycle(motorcycle)
          )
      );

      this.activeMotorcycleId =
        this.motorcycles.length
          ? this.motorcycles[0].id
          : null;

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  async add(motorcycle) {
    this.lastError = null;

    if (
      !window.MotorcycleCatalog ||
      !window.MotorcycleCatalog.validateMotorcycleSelection(motorcycle)
    ) {
      this.lastError = "Motocykl nie jest zgodny z katalogiem.";
      return null;
    }

    const mileage = Number(motorcycle.mileage || 0);
    if (!Number.isFinite(mileage) || mileage < 0) {
      this.lastError = "Przebieg musi być liczbą większą lub równą 0.";
      return null;
    }

    const session = await this.getSession();

    if (!session) {
      return null;
    }

    const payload = this.serializeMotorcycle(
      motorcycle,
      session.user.id
    );

    try {
      let {
        data,
        error
      } = await this.insertMotorcycle(payload);

      if (error) {
        this.setError(
          error,
          "Nie udało się dodać motocykla do Supabase."
        );

        return null;
      }

      const savedMotorcycle =
        this.attachLegacyServiceData(
          this.deserializeMotorcycle(data)
        );

      this.motorcycles.push(savedMotorcycle);

      if (this.activeMotorcycleId === null) {
        this.activeMotorcycleId =
          savedMotorcycle.id;
      }

      return savedMotorcycle;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return null;
    }
  },

  async remove(id) {
    this.lastError = null;

    const session = await this.getSession();

    if (!session) {
      return false;
    }

    try {
      const { error } = await window.supabaseClient
        .from("motorcycles")
        .delete()
        .eq("id", id);

      if (error) {
        this.setError(
          error,
          "Nie udało się usunąć motocykla z Supabase."
        );

        return false;
      }

      this.motorcycles = this.motorcycles.filter(
        bike =>
          bike.id !== id
      );

      delete this.legacyServiceData[id];

      try {
        localStorage.setItem(
          this.legacyServiceStorageKey,
          JSON.stringify(this.legacyServiceData)
        );
      } catch (error) {
        this.setError(
          error,
          "Motocykl usunięto, ale nie udało się usunąć lokalnych danych serwisowych."
        );
      }

      if (this.activeMotorcycleId === id) {
        this.activeMotorcycleId =
          this.motorcycles.length
            ? this.motorcycles[0].id
            : null;
      }

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  async setActive(id) {
    const bike = this.motorcycles.find(
      item =>
        item.id === id
    );

    if (!bike) {
      this.setError(
        null,
        "Nie znaleziono motocykla."
      );

      return null;
    }

    this.lastError = null;
    this.activeMotorcycleId = id;

    return bike;
  }
};

window.MotorcycleDatabase =
  MotorcycleDatabase;
