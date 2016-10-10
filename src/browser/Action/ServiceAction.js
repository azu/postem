// LICENSE : MIT
"use strict";
import {Action} from "material-flux";
import keys from "./ServiceActionConst";
export {keys};
import notie from "notie"
import {show as LoadingShow, dismiss as LoadingDismiss} from "../view-util/Loading"
import RelatedItemModel from "../models/RelatedItemModel";
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
        if (servicePromises.length) {
            LoadingShow();
        }
        Promise.all(servicePromises).then(() => {
            notie.alert(1, 'Post Success!', 1.5);
            this.dispatch(keys.postLink);
        }).catch(error => {
            notie.alert(3, 'Post Error.', 2.5);
            console.log(error);
        }).then(function finish() {
            LoadingDismiss(100);
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

    updateViaURL(URL) {
        this.dispatch(keys.updateViaURL, URL);
    }
    updateComment(comment) {
        this.dispatch(keys.updateComment, comment);
    }

    login(service) {
        const client = serviceInstance.getClient(service);
        client.loginAsync(error => {
            if (error) {
                return console.error(error);
            }
            console.log("login: " + service.id);
        });
    }

    enableService(service) {
        const client = serviceInstance.getClient(service);
        if (client.isLogin()) {
            this.dispatch(keys.enableService, service);
        } else {
            client.loginAsync(error => {
                if (error) {
                    return console.error(error);
                }
                this.dispatch(keys.enableService, service);
            });
        }
    }

    disableService(service) {
        this.dispatch(keys.disableService, service);
    }

    editRelatedItem(item) {
        if (!item.isEditing) {
            item.startEditing();
            this.dispatch(keys.editRelatedItem, item);
        }
    }

    addRelatedItem() {
        this.dispatch(keys.addRelatedItem, new RelatedItemModel({
            title: "Dummy",
            URL: "http://example.com/"
        }));
    }

    finishEditingRelatedItem(item, value) {
        if (!value) {
            return this.dispatch(keys.removeRelatedItem, item)
        }
        item.updateWithValue(value);
        item.finishEditing();
        this.dispatch(keys.finishEditingRelatedItem, item);
    }

    resetField() {
        this.dispatch(keys.resetField);
    }
}