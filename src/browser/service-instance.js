// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";

// FIXME: use IPC
const notBundledRequire = require;
const manager = new ServiceManger();
const getServiceNameList = () => {
    if (process.env.PLAYWRIGHT_TEST === "1" || process.title?.includes("playwright")) {
        return notBundledRequire("../../tests/fixtures/test-services.js");
    } else {
        const serviceModule = notBundledRequire("../service.js");
        return serviceModule.default || serviceModule;
    }
};
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
