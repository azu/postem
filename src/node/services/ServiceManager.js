// LICENSE : MIT
"use strict";
import assert from "assert";
import ipc from "ipc";
export let tagMethods = {
    "getTags": "getTags"
};
export let serviceMethods = {
    "canAccess": "canAccess",
    "requireAccess": "requireAccess"
};
export class ServiceManager {
    constructor() {
        this.tagService = null;
        this.services = [];
    }

    setTagService(service) {
        var name = service.constructor.name;
        assert(name, "service should have .name " + service);
        this.tagService = service;
        Object.keys(tagMethods).forEach(key => {
            var ipcName = `${name}-${key}`;
            ipc.on(ipcName, ({sender}, ...args)=> {
                service[key](...args).then(result => {
                    sender.send(ipcName, result);
                }).catch(error => {
                    sender.send(ipcName, error);
                });
            });
        });
    }

    addService(service) {
        var name = service.constructor.name;
        assert(name, "service should have .name " + service);
        this.services.push(service);
        Object.keys(serviceMethods).forEach(key => {
            var ipcName = `${name}-${key}`;
            ipc.on(ipcName, ({sender}, ...args)=> {
                service[key](...args).then(result => {
                    sender.send(ipcName, result);
                }).catch(error => {
                    sender.send(ipcName, error);
                });
            });
        });

    }

}
export default new ServiceManager;