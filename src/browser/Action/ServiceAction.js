// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import ipc from "ipc";
export var keys = {
    fetchTags: Symbol("fetchTags"),
    postLink: Symbol("postLink"),
    selectTags: Symbol("selectTags"),
    updateTitle: Symbol("updateTitle"),
    updateURL: Symbol("updateURL"),
    updateComment: Symbol("updateComment")
};
import HatenaClient from "../../services/HatenaClient";
export default class ServiceAction extends Action {
    fetchTags(serviceName) {
        const client = new HatenaClient();
        client.getTags().then(tags => {
            this.dispatch(keys.fetchTags, tags);
        });
        //const ipcFetchKey = `${serviceName}Service-getTags`;
        //const ipcStorageKey = `${serviceName}Service-storage`;
        //ipc.once(`${ipcStorageKey}-get`, (tags) => {
        //    if (Array.isArray(tags)) {
        //        this.dispatch(keys.fetchTags, tags);
        //    }
        //});
        //ipc.send(`${ipcStorageKey}-get`);
        //ipc.once(ipcFetchKey, (tags) => {
        //    if (Array.isArray(tags)) {
        //        this.dispatch(keys.fetchTags, tags);
        //        ipc.send(`${ipcStorageKey}-set`, tags);
        //    }
        //});
        //ipc.send(ipcFetchKey);
    }

    postLink(options) {
        const client = new HatenaClient();
        client.postLink(options).catch(error => {
            console.log(error)
        });
    }

    selectTags(tags) {
        this.dispatch(keys.selectTags, tags);
    }

    updateTitle(title) {
        this.dispatch(keys.updateTitle, title);
    }

    updateURL(URL) {
        this.dispatch(keys.updateURL, URL);
    }

    updateComment(comment) {
        this.dispatch(keys.updateComment, comment);
    }

}