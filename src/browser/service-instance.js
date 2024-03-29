// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";

// FIXME: use IPC
const notBundledRequire = require;
const manager = new ServiceManger();
const getServiceNameList =
    process.env.BROWSER === "1" ? () => require("../service.browser.js") : () => notBundledRequire("../service.js");
const services = getServiceNameList()
    .filter((service) => {
        return service.enabled;
    })
    .map((service) => {
        const { Model, Client } = service.index ? service.index : require(service.indexPath);
        const client = new Client(service.options);
        return {
            model: new Model(),
            client: client,
            isDefaultChecked: service.isDefaultChecked && client.isLogin()
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
