// LICENSE : MIT
"use strict";
import { Context } from "material-flux";
import ServiceAction from "./Action/ServiceAction";
import ServiceStore from "./Store/ServiceStore";
export default class AppContext extends Context {
    constructor() {
        super();
        this.ServiceAction = new ServiceAction(this);
        this.ServiceStore = new ServiceStore(this);
    }
}