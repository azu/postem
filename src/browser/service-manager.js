// LICENSE : MIT
"use strict";
export default class ServiceManager {
    constructor() {
        this.services = [];
    }

    addService(service) {
        this.services.push(service);
    }

    removeService(service) {
        const index = this.services.indexOf(service);
        this.services.splice(index, 1);
    }

    getServices() {
        return this.services;
    }
}