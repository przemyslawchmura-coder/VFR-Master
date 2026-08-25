const ServiceModule = {

  getActiveBike() {
    return MotorcycleDatabase.getActive();
  },


  getServices() {

    const bike = this.getActiveBike();

    if (!bike) return [];

    if (!Array.isArray(bike.services)) {
      bike.services = [];
    }

    return bike.services;
  },


  addService(service) {

    const bike = this.getActiveBike();

    if (!bike) {

      alert(
        "Najpierw wybierz motocykl."
      );

      return false;
    }


    if (!Array.isArray(bike.services)) {
      bike.services = [];
    }

    if (!Array.isArray(bike.history)) {
      bike.history = [];
    }


    const entry = {

      id: Date.now(),

      ...service,

      mileage:
        Number(
          service.mileage || 0
        ),

      partsCost:
        Number(
          service.partsCost || 0
        ),

      laborCost:
        Number(
          service.laborCost || 0
        )
    };


    bike.services.push(
      entry
    );


    /*
      Historia dostaje TEN SAM ID.
      Dzięki temu edycja i usuwanie
      zawsze znajdą właściwy wpis.
    */

    bike.history.push({
      ...entry
    });


    MotorcycleDatabase.save();


    return true;
  },


  updateService(
    id,
    service
  ) {

    const bike =
      this.getActiveBike();


    if (!bike) {

      alert(
        "Najpierw wybierz motocykl."
      );

      return false;
    }


    if (!Array.isArray(
      bike.services
    )) {

      bike.services = [];

    }


    if (!Array.isArray(
      bike.history
    )) {

      bike.history = [];

    }


    const index =
      bike.services.findIndex(
        item =>
          item.id === id
      );


    if (index === -1) {

      alert(
        "Nie znaleziono wpisu serwisowego."
      );

      return false;
    }


    const updated = {

      ...bike.services[index],

      ...service,

      id,

      mileage:
        Number(
          service.mileage || 0
        ),

      partsCost:
        Number(
          service.partsCost || 0
        ),

      laborCost:
        Number(
          service.laborCost || 0
        )
    };


    /*
      Aktualizujemy główną historię.
    */

    bike.services[index] =
      updated;


    /*
      Aktualizujemy również
      kopię w bike.history.
    */

    const historyIndex =
      bike.history.findIndex(
        item =>
          item.id === id
      );


    if (
      historyIndex !== -1
    ) {

      bike.history[
        historyIndex
      ] = {
        ...updated
      };

    } else {

      /*
        Dla starszych wpisów,
        które nie mają jeszcze
        odpowiedniego wpisu
        w history.
      */

      bike.history.push({
        ...updated
      });

    }


    MotorcycleDatabase.save();


    return true;
  },


  deleteService(id) {

    const bike =
      this.getActiveBike();


    if (!bike) {

      alert(
        "Najpierw wybierz motocykl."
      );

      return false;
    }


    if (!Array.isArray(
      bike.services
    )) {

      bike.services = [];

    }


    if (!Array.isArray(
      bike.history
    )) {

      bike.history = [];

    }


    const index =
      bike.services.findIndex(
        item =>
          item.id === id
      );


    if (index === -1) {
      return false;
    }


    /*
      Usuwamy z głównej listy.
    */

    bike.services.splice(
      index,
      1
    );


    /*
      Usuwamy ten sam wpis
      z historii.
    */

    bike.history =
      bike.history.filter(
        item =>
          item.id !== id
      );


    MotorcycleDatabase.save();


    return true;
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


  /*
    Najbliższy serwis:

    1. Jeżeli istnieją terminy
       kalendarzowe — wybieramy
       najbliższą datę.

    2. Jeżeli nie ma dat,
       wybieramy najmniejszy
       zaplanowany przebieg.

    Nie porównujemy już
    kilometrów z datami.
  */

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