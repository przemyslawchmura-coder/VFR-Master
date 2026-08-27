/* =========================================================
   VFR MASTER
   CENTRALNY REJESTR BAZ TECHNICZNYCH
   ========================================================= */
const TechnicalDatabase = {
  registrations: [],
  ambiguities: [],

  normalize(value) {
    return String(value ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("pl-PL");
  },

  normalizeYear(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const year = Number(value);

    return Number.isInteger(year) ? year : null;
  },

  register({
    brand,
    model,
    year,
    yearFrom,
    yearTo,
    aliases = [],
    database
  }) {
    const normalizedBrand = this.normalize(brand);
    const normalizedModel = this.normalize(model);
    const exactYear = this.normalizeYear(year);
    const normalizedYearFrom = exactYear ??
      this.normalizeYear(yearFrom);
    const normalizedYearTo = exactYear ??
      this.normalizeYear(yearTo);

    if (!normalizedBrand || !normalizedModel) {
      throw new Error(
        "Baza techniczna wymaga marki i modelu."
      );
    }

    if (
      normalizedYearFrom === null ||
      normalizedYearTo === null ||
      normalizedYearFrom > normalizedYearTo
    ) {
      throw new Error(
        "Baza techniczna wymaga poprawnego roku lub zakresu roczników."
      );
    }

    if (
      !database ||
      !database.model ||
      typeof database.getCategory !== "function" ||
      typeof database.getCategoryList !== "function"
    ) {
      throw new Error(
        "Nieprawidłowa baza danych technicznych."
      );
    }

    const key = [
      normalizedBrand,
      normalizedModel,
      normalizedYearFrom,
      normalizedYearTo
    ].join("|");

    const registration = {
      key,
      brand,
      model,
      models: [model, ...aliases].map(
        value => this.normalize(value)
      ),
      yearFrom: normalizedYearFrom,
      yearTo: normalizedYearTo,
      database
    };

    const existingIndex = this.registrations.findIndex(
      item => item.key === key
    );

    if (existingIndex >= 0) {
      this.registrations[existingIndex] = registration;
    } else {
      this.registrations.push(registration);
    }

    return registration;
  },

  getRegistrationForMotorcycle(bike) {
    if (!bike) return null;

    const brand = this.normalize(bike.brand);
    const model = this.normalize(bike.model);
    const year = this.normalizeYear(bike.year);

    if (!brand || !model || year === null) {
      return null;
    }

    return this.registrations
      .filter(registration =>
        this.normalize(registration.brand) === brand &&
        registration.models.includes(model) &&
        year >= registration.yearFrom &&
        year <= registration.yearTo
      )
      .sort((a, b) =>
        (a.yearTo - a.yearFrom) -
        (b.yearTo - b.yearFrom)
      )[0] || null;
  },

  getForMotorcycle(bike) {
    const registration =
      this.getRegistrationForMotorcycle(bike);

    return registration ? registration.database : null;
  },

  registerAmbiguity({
    brand,
    model,
    aliases = [],
    yearFrom,
    yearTo,
    message
  }) {
    const ambiguity = {
      brand: this.normalize(brand),
      models: [model, ...aliases].map(
        value => this.normalize(value)
      ),
      yearFrom: this.normalizeYear(yearFrom),
      yearTo: this.normalizeYear(yearTo),
      message
    };

    if (
      !ambiguity.brand ||
      !ambiguity.models[0] ||
      ambiguity.yearFrom === null ||
      ambiguity.yearTo === null ||
      ambiguity.yearFrom > ambiguity.yearTo ||
      !message
    ) {
      throw new Error(
        "Nieprawidłowa definicja niejednoznacznego modelu."
      );
    }

    this.ambiguities.push(ambiguity);
    return ambiguity;
  },

  getAmbiguityForMotorcycle(bike) {
    if (!bike) return null;

    const brand = this.normalize(bike.brand);
    const model = this.normalize(bike.model);
    const year = this.normalizeYear(bike.year);

    if (!brand || !model || year === null) {
      return null;
    }

    return this.ambiguities.find(ambiguity =>
      ambiguity.brand === brand &&
      ambiguity.models.includes(model) &&
      year >= ambiguity.yearFrom &&
      year <= ambiguity.yearTo
    ) || null;
  }
};

window.TechnicalDatabase = TechnicalDatabase;

/*
  Następne modele rejestrujemy w ich własnych plikach, np.:

  TechnicalDatabase.register({
    brand: "Yamaha",
    model: "FZ1",
    yearFrom: 2006,
    yearTo: 2015,
    database: FZ1Technical
  });
*/
