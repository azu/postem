// LICENSE : MIT
"use strict";
import assert from "assert";
import ipc from "ipc";
import tagsStorage from "../storage/tags";
export let tagMethods = {
    "getTags": "getTags"
};
export let serviceMethods = {
    "canAccess": "canAccess",
    "requireAccess": "requireAccess",
    "postLink" : ""
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
        ipc.on(`${name}-storage-get`, ({sender}) => {
            let tags = tagsStorage.get(`${name}`) || [];
            sender.send(`${name}-storage-get`, tags);
        });
        ipc.on(`${name}-storage-set`, ({sender}, tags = []) => {
            tagsStorage.set(`${name}`, tags);
        });
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