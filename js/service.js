const ServiceModule = {

  servicesByMotorcycleId: {},

  lastError: null,

  getActiveBike() {
    return MotorcycleDatabase.getActive();
  },

  setError(error, fallbackMessage) {
    this.lastError =
      error && error.message
        ? error.message
        : fallbackMessage;

    if (error) {
      console.error(error);
    }
  },

  toUiService(record) {
    return {
      id: record.id,
      type: record.type || "",
      description: record.description || "",
      date: record.service_date || "",
      mileage: Number(record.mileage || 0),
      partsCost: Number(record.parts_cost || 0),
      laborCost: Number(record.labor_cost || 0),
      workshop: record.workshop || "",
      note: record.note || "",
      nextDate: record.next_service_date || "",
      nextMileage: Number(
        record.next_service_mileage || 0
      )
    };
  },

  toDatabaseService(service) {
    return {
      type: service.type,
      description: service.description,
      service_date: service.date,
      mileage: Number(service.mileage || 0),
      parts_cost: Number(service.partsCost || 0),
      labor_cost: Number(service.laborCost || 0),
      workshop: service.workshop || null,
      note: service.note || null,
      next_service_date: service.nextDate || null,
      next_service_mileage:
        service.nextMileage === "" ||
        service.nextMileage === undefined
          ? null
          : Number(service.nextMileage)
    };
  },

  setServices(motorcycleId, services) {
    this.servicesByMotorcycleId[motorcycleId] =
      services;

    const bike = MotorcycleDatabase
      .getAll()
      .find(
        item =>
          item.id === motorcycleId
      );

    if (bike) {
      bike.services = services;
    }
  },

  getServices() {
    const bike = this.getActiveBike();

    if (!bike) return [];

    const services =
      this.servicesByMotorcycleId[bike.id];

    if (Array.isArray(services)) {
      return services;
    }

    if (!Array.isArray(bike.services)) {
      bike.services = [];
    }

    return bike.services;
  },

  async getSession() {
    const session =
      await MotorcycleDatabase.getSession();

    if (!session) {
      this.setError(
        null,
        MotorcycleDatabase.lastError ||
          "Brak zalogowanej sesji Supabase."
      );
    }

    return session;
  },

  async loadServices(motorcycleId) {
    this.lastError = null;

    if (!motorcycleId) {
      this.setError(
        null,
        "Najpierw wybierz motocykl."
      );

      return false;
    }

    const session = await this.getSession();

    if (!session) {
      this.setServices(motorcycleId, []);

      return false;
    }

    try {
      const {
        data,
        error
      } = await window.supabaseClient
        .from("service_records")
        .select(
          "id, motorcycle_id, user_id, type, description, service_date, mileage, parts_cost, labor_cost, workshop, note, next_service_date, next_service_mileage, created_at, updated_at"
        )
        .eq("motorcycle_id", motorcycleId)
        .order("service_date", {
          ascending: false
        });

      if (error) {
        this.setError(
          error,
          "Nie udało się wczytać historii serwisowej z Supabase."
        );

        return false;
      }

      this.setServices(
        motorcycleId,
        (data || []).map(
          record =>
            this.toUiService(record)
        )
      );

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  async addService(service) {
    const bike = this.getActiveBike();

    if (!bike) {
      this.setError(
        null,
        "Najpierw wybierz motocykl."
      );

      return false;
    }

    this.lastError = null;

    const session = await this.getSession();

    if (!session) {
      return false;
    }

    const payload = {
      motorcycle_id: bike.id,
      user_id: session.user.id,
      ...this.toDatabaseService(service)
    };

    try {
      const {
        data,
        error
      } = await window.supabaseClient
        .from("service_records")
        .insert(payload)
        .select(
          "id, motorcycle_id, user_id, type, description, service_date, mileage, parts_cost, labor_cost, workshop, note, next_service_date, next_service_mileage, created_at, updated_at"
        )
        .single();

      if (error) {
        this.setError(
          error,
          "Nie udało się zapisać serwisu w Supabase."
        );

        return false;
      }

      const services = [
        ...this.getServices(),
        this.toUiService(data)
      ];

      this.setServices(bike.id, services);

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  async updateService(id, service) {
    const bike = this.getActiveBike();

    if (!bike) {
      this.setError(
        null,
        "Najpierw wybierz motocykl."
      );

      return false;
    }

    this.lastError = null;

    const session = await this.getSession();

    if (!session) {
      return false;
    }

    try {
      const {
        data,
        error
      } = await window.supabaseClient
        .from("service_records")
        .update(this.toDatabaseService(service))
        .eq("id", id)
        .eq("motorcycle_id", bike.id)
        .select(
          "id, motorcycle_id, user_id, type, description, service_date, mileage, parts_cost, labor_cost, workshop, note, next_service_date, next_service_mileage, created_at, updated_at"
        )
        .single();

      if (error) {
        this.setError(
          error,
          "Nie udało się zaktualizować serwisu w Supabase."
        );

        return false;
      }

      const services = this.getServices().map(
        item =>
          item.id === id
            ? this.toUiService(data)
            : item
      );

      this.setServices(bike.id, services);

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  async deleteService(id) {
    const bike = this.getActiveBike();

    if (!bike) {
      this.setError(
        null,
        "Najpierw wybierz motocykl."
      );

      return false;
    }

    this.lastError = null;

    const session = await this.getSession();

    if (!session) {
      return false;
    }

    try {
      const {
        data,
        error
      } = await window.supabaseClient
        .from("service_records")
        .delete()
        .eq("id", id)
        .eq("motorcycle_id", bike.id)
        .select("id");

      if (error) {
        this.setError(
          error,
          "Nie udało się usunąć serwisu z Supabase."
        );

        return false;
      }

      if (!data || !data.length) {
        this.setError(
          null,
          "Nie znaleziono serwisu do usunięcia."
        );

        return false;
      }

      this.setServices(
        bike.id,
        this.getServices().filter(
          item =>
            item.id !== id
        )
      );

      return true;
    } catch (error) {
      this.setError(
        error,
        "Nie udało się połączyć z Supabase."
      );

      return false;
    }
  },

  getSortedServices() {

    return [
      ...this.getServices()
    ].sort(
      (a, b) => {

        const dateA =
          a.date
            ? new Date(
                a.date
              ).getTime()
            : 0;


        const dateB =
          b.date
            ? new Date(
                b.date
              ).getTime()
            : 0;


        return dateB - dateA;

      }
    );
  },

  getTotalCost() {

    return this.getServices()
      .reduce(
        (
          sum,
          service
        ) => {

          return (

            sum +

            Number(
              service.partsCost ||
              0
            ) +

            Number(
              service.laborCost ||
              0
            )

          );

        },
        0
      );
  },

  getPartsCost() {

    return this.getServices()
      .reduce(
        (
          sum,
          service
        ) => {

          return (
            sum +
            Number(
              service.partsCost ||
              0
            )
          );

        },
        0
      );
  },

  getLaborCost() {

    return this.getServices()
      .reduce(
        (
          sum,
          service
        ) => {

          return (
            sum +
            Number(
              service.laborCost ||
              0
            )
          );

        },
        0
      );
  },

  getLastService() {

    const services =
      this.getSortedServices();


    return services.length
      ? services[0]
      : null;
  },

  getNextService() {

    const services =
      this.getServices()
        .filter(
          service =>
            service.nextDate ||
            service.nextMileage
        );


    if (!services.length) {
      return null;
    }


    const withDate =
      services

        .filter(
          service =>
            service.nextDate
        )

        .map(
          service => ({

            service,

            time:
              new Date(
                service.nextDate
              ).getTime()

          })
        )

        .filter(
          item =>
            !Number.isNaN(
              item.time
            )
        )

        .sort(
          (a, b) =>
            a.time - b.time
        );


    if (
      withDate.length
    ) {

      return (
        withDate[0]
          .service
      );

    }


    return services
      .slice()
      .sort(
        (a, b) =>

          Number(
            a.nextMileage ||
            Infinity
          )

          -

          Number(
            b.nextMileage ||
            Infinity
          )
      )[0] || null;
  }

};


window.ServiceModule =
  ServiceModule;
