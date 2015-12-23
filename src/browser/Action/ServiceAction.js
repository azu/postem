// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
export var keys = {
    fetchTags: Symbol("fetchTags"),
    postLink: Symbol("postLink"),
    selectTags: Symbol("selectTags"),
    updateTitle: Symbol("updateTitle"),
    updateURL: Symbol("updateURL"),
    updateComment: Symbol("updateComment"),
    enableService: Symbol("enableService"),
    disableService: Symbol("disableService")
};
import serviceInstance from "../service-instance";
export default class ServiceAction extends Action {
    fetchTags(service) {
        const client = serviceInstance.getClient(service);
        if (!client.isLogin()) {
            console.log(service.id + " is not login");
            return;
        }
        console.log("fetchTags: " + service.id);
        client.getTags().then(tags => {
            this.dispatch(keys.fetchTags, tags);
        }).catch(error => {
            console.log(error);
        });
    }

    postLink(services, postData) {
        var mapCS = services.map(service => {
            const client = serviceInstance.getClient(service);
            return {
                service,
                client
            }
        });
        var enabledCS = mapCS.filter(({client}) => client.isLogin());
        var servicePromises = enabledCS.map(({service, client}) => {
            console.log("postLink: " + service.id);
            return client.postLink(postData);
        });
        Promise.all(servicePromises).catch(error => {
            console.log(error);
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

    login(service) {
        const client = serviceInstance.getClient(service);
        client.loginAsync().then(result => {
            console.log("login: " + service.id);
        });
    }

    enableService(service) {
        const client = serviceInstance.getClient(service);
        if (client.isLogin()) {
            this.dispatch(keys.enableService, service);
        } else {
            client.loginAsync().then(result => {
                this.dispatch(keys.enableService, service);
            });
        }
    }

    disableService(service) {
        this.dispatch(keys.disableService, service);
    }
}