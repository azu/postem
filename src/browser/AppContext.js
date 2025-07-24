// LICENSE : MIT
import { Context } from "material-flux";
import ServiceAction from "./Action/ServiceAction.js";
import ServiceStore from "./Store/ServiceStore.js";
export default class AppContext extends Context {
    constructor() {
        super();
        this.ServiceAction = new ServiceAction(this);
        this.ServiceStore = new ServiceStore(this);
    }
}
