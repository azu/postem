// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import ipc from "ipc";
export var keys = {
    fetchTags: Symbol("fetchTags"),
    selectTags: Symbol("selectTags")
};
export default class ServiceAction extends Action {
    fetchTags(serviceName) {
        const ipcKey = `${serviceName}Service-getTags`;
        ipc.on(ipcKey, (tags) => {
            console.log(tags);
            this.dispatch(keys.fetchTags, tags);
        });
        ipc.send(ipcKey);
    }

    selectTags(tags) {
        this.dispatch(keys.selectTags, tags);
    }
}