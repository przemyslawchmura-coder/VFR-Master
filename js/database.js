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

      if (this.isMissingCatalogVariantKeyColumnError(error)) {
        const legacyPayload = this.serializeMotorcycle(
          motorcycle,
          session.user.id,
          false
        );

        ({ data, error } = await this.insertMotorcycle(
          legacyPayload,
          false
        ));
      }

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
