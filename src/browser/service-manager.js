// LICENSE : MIT
"use strict";
export default class ServiceManager {
    constructor() {
        this.services = new Map();
        this.defaultServices = new Set();
    }

    /**
     * Add service
     * @param model
     * @param client
     * @param [isDefaultChecked] is default checked
     */
    addService({model, client, isDefaultChecked}) {
        this.services.set(model, client);
        if (isDefaultChecked) {
            this.defaultServices.add(model);
        }
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

    /**
     * @returns {*|undefined}
     */
    getTagService() {
        const services = Array.from(this.services.keys());
        return services.find(service => {
            return service.tagService === true;
        })
    }

    /**
     * @returns {*|undefined}
     */
    getDefaultCheckedService() {
        console.log("defaultServices", Array.from(this.defaultServices.keys()));
        return Array.from(this.defaultServices.keys());
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
