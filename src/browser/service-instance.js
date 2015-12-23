// LICENSE : MIT
"use strict";
// service
import {Client as HatenaClient, Model as HatenaModel} from "../services/hatebu/index";
import {Client as JSerClient, Model as JSerModel} from "../services/jser.info";
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
manager.addService(new HatenaModel(), new HatenaClient());
manager.addService(new JSerModel(), new JSerClient());
export default manager;