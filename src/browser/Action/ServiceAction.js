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
        const ipcFetchKey = `${serviceName}Service-getTags`;
        const ipcStorageKey = `${serviceName}Service-storage`;
        ipc.on(`${ipcStorageKey}-get`, (tags) => {
            console.log("strogag", tags);
            this.dispatch(keys.fetchTags, tags);
        });
        ipc.send(`${ipcStorageKey}-get`);
        ipc.on(ipcFetchKey, (tags) => {
            this.dispatch(keys.fetchTags, tags);
            ipc.send(`${ipcStorageKey}-set`, tags);
        });
        ipc.send(ipcFetchKey);
    }

    selectTags(tags) {
        this.dispatch(keys.selectTags, tags);
    }
}