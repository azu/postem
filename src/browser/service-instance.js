// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";
import path from "path";
import interopRequire from "interop-require";
const manager = new ServiceManger();
const serviceNameList = [
    "twitter",
    "hatebu",
    "jser.info",
    "ecmascript-daily",
    "jser.info-ping"
];
if (process.env.NODE_ENV === 'development') {
    serviceNameList.push("debug");
}

const services = serviceNameList.map(name => {
    const service = interopRequire(path.join(__dirname, "../services/", name, "index.js"));
    return [service.Model, service.Client];
});
services.forEach(([Model, Client]) => {
    manager.addService(new Model(), new Client());
});
export default manager;