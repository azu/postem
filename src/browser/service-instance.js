// LICENSE : MIT
"use strict";
// service
import HatenaModel from "../services/hatebu/HatenaModel";
//
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
manager.addService(new HatenaModel);
export default manager;