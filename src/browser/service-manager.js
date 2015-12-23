// LICENSE : MIT
"use strict";
export default class ServiceManager {
    constructor() {
        this.services = new Map();
    }

    addService(service, client) {
        this.services.set(service, client);
    }

    removeService(service) {
        this.services.remove(service);
    }

    getService(serviceID) {
        var services = this.selectServices([serviceID]);
        if (services.length > 0) {
            return services[0];
        }
        return undefined;
    }

    getServices() {
        return [...this.services.keys()];
    }

    selectServices(serviceIDs) {
        return this.getServices().filter(service => {
            return serviceIDs.some(serviceID => {
                return serviceID === service.id;
            });
        });
    }

    getClient(service) {
        return this.services.get(service);
    }

}