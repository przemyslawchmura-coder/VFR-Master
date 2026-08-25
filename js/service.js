const ServiceModule = {

  getActiveBike() {

    if (!window.MotorcycleDatabase) {
      return null;
    }

    return MotorcycleDatabase.getActive();
  },


  ensureServices(bike) {

    if (!bike.services) {
      bike.services = [];
    }

    return bike.services;
  },


  addService(service) {

    const bike = this.getActiveBike();

    if (!bike) {
      alert("Najpierw wybierz motocykl.");
      return false;
    }

    this.ensureServices(bike);

    const newService = {

      id: Date.now(),

      type: service.type || "Inne",

      description:
        service.description || "",

      date:
        service.date || "",

      mileage:
        Number(service.mileage || 0),

      partsCost:
        Number(service.partsCost || 0),

      laborCost:
        Number(service.laborCost || 0),

      workshop:
        service.workshop || "",

      note:
        service.note || "",

      nextDate:
        service.nextDate || "",

      nextMileage:
        Number(service.nextMileage || 0)
    };


    bike.services.unshift(newService);


    if (!bike.history) {
      bike.history = [];
    }


    bike.history.unshift({

      id: Date.now() + 1,

      type: "SERWIS",

      description:
        newService.description,

      date:
        newService.date,

      mileage:
        newService.mileage
    });


    MotorcycleDatabase.save();

    return true;
  },


  updateService(serviceId, updatedData) {

    const bike = this.getActiveBike();

    if (!bike || !bike.services) {
      return false;
    }


    const service =
      bike.services.find(
        item =>
          item.id === serviceId
      );


    if (!service) {
      return false;
    }


    service.type =
      updatedData.type || "Inne";

    service.description =
      updatedData.description || "";

    service.date =
      updatedData.date || "";

    service.mileage =
      Number(updatedData.mileage || 0);

    service.partsCost =
      Number(updatedData.partsCost || 0);

    service.laborCost =
      Number(updatedData.laborCost || 0);

    service.workshop =
      updatedData.workshop || "";

    service.note =
      updatedData.note || "";

    service.nextDate =
      updatedData.nextDate || "";

    service.nextMileage =
      Number(updatedData.nextMileage || 0);


    MotorcycleDatabase.save();

    return true;
  },


  deleteService(serviceId) {

    const bike = this.getActiveBike();

    if (!bike || !bike.services) {
      return false;
    }


    const service =
      bike.services.find(
        item =>
          item.id === serviceId
      );


    if (!service) {
      return false;
    }


    const confirmed =
      confirm(
        "Usunąć ten wpis serwisowy?"
      );


    if (!confirmed) {
      return false;
    }


    bike.services =
      bike.services.filter(
        item =>
          item.id !== serviceId
      );


    if (bike.history) {

      bike.history =
        bike.history.filter(
          item =>
            !(
              item.type === "SERWIS" &&
              item.description ===
                service.description &&
              item.date ===
                service.date &&
              item.mileage ===
                service.mileage
            )
        );

    }


    MotorcycleDatabase.save();

    return true;
  },


  getServices() {

    const bike =
      this.getActiveBike();

    if (!bike) {
      return [];
    }


    return this.ensureServices(bike);
  },


  getSortedServices() {

    return [
      ...this.getServices()
    ].sort(
      (a, b) => {

        const dateA =
          new Date(a.date || 0);

        const dateB =
          new Date(b.date || 0);


        if (
          dateA.getTime() !==
          dateB.getTime()
        ) {

          return (
            dateB.getTime() -
            dateA.getTime()
          );

        }


        return (
          Number(b.mileage || 0) -
          Number(a.mileage || 0)
        );

      }
    );
  },


  getTotalCost() {

    return this.getServices()
      .reduce(
        (total, service) => {

          return total +

            Number(
              service.partsCost || 0
            ) +

            Number(
              service.laborCost || 0
            );

        },
        0
      );
  },


  getPartsCost() {

    return this.getServices()
      .reduce(
        (total, service) => {

          return total +
            Number(
              service.partsCost || 0
            );

        },
        0
      );
  },


  getLaborCost() {

    return this.getServices()
      .reduce(
        (total, service) => {

          return total +
            Number(
              service.laborCost || 0
            );

        },
        0
      );
  },


  getLastService() {

    const services =
      this.getSortedServices();


    if (!services.length) {
      return null;
    }


    return services[0];
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


    const today =
      new Date();


    const currentMileage =
      Number(
        this.getActiveBike()
          ?.mileage || 0
      );


    const upcoming =
      services
        .map(service => {

          let distance =
            Infinity;

          let days =
            Infinity;


          if (
            service.nextMileage
          ) {

            distance =
              service.nextMileage -
              currentMileage;

          }


          if (
            service.nextDate
          ) {

            const date =
              new Date(
                service.nextDate
              );

            days =
              Math.ceil(
                (
                  date -
                  today
                ) /
                86400000
              );

          }


          return {

            service,
            distance,
            days

          };

        })
        .sort(
          (a, b) => {

            return Math.min(
              a.distance,
              a.days
            ) -
            Math.min(
              b.distance,
              b.days
            );

          }
        );


    return upcoming.length
      ? upcoming[0].service
      : null;
  },


  formatMoney(value) {

    return Number(
      value || 0
    ).toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    ) + " zł";

  },


  formatMileage(value) {

    return Number(
      value || 0
    ).toLocaleString(
      "pl-PL"
    ) + " km";

  },


  formatDate(value) {

    if (!value) {
      return "—";
    }


    const date =
      new Date(
        value + "T00:00:00"
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "pl-PL"
    );

  }

};


window.ServiceModule =
  ServiceModule;