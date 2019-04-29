// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
// Load service definitions
const serviceNameList = require("../service.js");
const services = serviceNameList
    .filter(service => {
        return service.enabled;
    })
    .map(service => {
        const { Model, Client } = require(service.indexPath);
        return [Model, Client];
    });
services.forEach(([Model, Client]) => {
    manager.addService(new Model(), new Client());
});
export default manager;
