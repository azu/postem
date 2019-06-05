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
        const {Model, Client} = require(service.indexPath);
        return {
            model: new Model(),
            client: new Client(),
            isDefaultChecked: service.isDefaultChecked
        };
    });
services.forEach(({model, client, isDefaultChecked}) => {
    manager.addService({
        model,
        client,
        isDefaultChecked
    });
});
export default manager;
