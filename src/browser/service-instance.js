// LICENSE : MIT
"use strict";
// service
import {Client as HatenaClient, Model as HatenaModel} from "../services/hatebu/index";
import {Client as JSerClient, Model as JSerModel} from "../services/jser.info";
import {Client as DebugClient, Model as DebugModel} from "../services/debug";
import {Client as TwitterClient, Model as TwitterModel} from "../services/twitter";
import {Client as ESDailyClient, Model as ESDailyModel} from "../services/ecmascript-daily";
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
const services = [
    [TwitterModel, TwitterClient],
    [HatenaModel, HatenaClient],
    [JSerModel, JSerClient],
    [ESDailyModel, ESDailyClient],
    [DebugModel, DebugClient]
];
services.forEach(([Model, Client]) => {
    manager.addService(new Model(), new Client());
});
export default manager;