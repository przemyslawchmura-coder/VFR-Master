const ServiceModule = {

  getActiveBike() {
    return MotorcycleDatabase.getActive();
  },

  addService(service) {

    const bike = this.getActiveBike();

    if (!bike) {
      alert("Najpierw wybierz aktywny motocykl.");
      return false;
    }

    if (!bike.services) {
      bike.services = [];
    }

    const newService = {

      id: Date.now(),

      type: service.type,
      description: service.description,

      date: service.date,
      mileage: Number(service.mileage || 0),

      partsCost: Number(service.partsCost || 0),
      laborCost: Number(service.laborCost || 0),

      workshop: service.workshop || "",
      note: service.note || "",

      nextDate: service.nextDate || "",
      nextMileage: Number(service.nextMileage || 0)
    };

    bike.services.unshift(newService);

    if (!bike.history) {
      bike.history = [];
    }

    bike.history.unshift({

      id: Date.now() + 1,

      type: "SERWIS",

      description: service.description,

      date: service.date,

      mileage: Number(service.mileage || 0)
    });

    MotorcycleDatabase.save();

    return true;
  },


  deleteService(serviceId) {

    const bike = this.getActiveBike();

    if (!bike || !bike.services) {
      return;
    }

    bike.services =
      bike.services.filter(
        service => service.id !== serviceId
      );

    MotorcycleDatabase.save();
  },


  getServices() {

    const bike = this.getActiveBike();

    if (!bike || !bike.services) {
      return [];
    }

    return bike.services;
  },


  getTotalCost() {

    return this.getServices().reduce(
      (total, service) => {

        return total +
          Number(service.partsCost || 0) +
          Number(service.laborCost || 0);

      },
      0
    );
  },


  getLastService() {

    const services =
      this.getServices();

    if (!services.length) {
      return null;
    }

    return services[0];
  }
};


window.ServiceModule =
  ServiceModule;
