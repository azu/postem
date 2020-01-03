// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";

const manager = new ServiceManger();
const getServiceNameList =
    process.env.BROWSER !== "1" ? () => require("../service.js") : () => require("../service.browser.js");
const services = getServiceNameList()
    .filter(service => {
        return service.enabled;
    })
    .map(service => {
        const { Model, Client } = service.index ? service.index : require(service.indexPath);
        return {
            model: new Model(),
            client: new Client(),
            isDefaultChecked: service.isDefaultChecked
        };
    });
services.forEach(({ model, client, isDefaultChecked }) => {
    manager.addService({
        model,
        client,
        isDefaultChecked
    });
});
export default manager;
