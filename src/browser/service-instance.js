// LICENSE : MIT
"use strict";
// service
import {Client as HatenaClient, Model as HatenaModel} from "../services/hatebu/index";
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
manager.addService(new HatenaModel(), new HatenaClient());
export default manager;