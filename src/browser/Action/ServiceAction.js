// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import keys from "./ServiceActionConst";

export { keys };
import notie from "notie";
import { show as LoadingShow, dismiss as LoadingDismiss } from "../view-util/Loading";
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
        return client
            .getTags()
            .then((tags) => {
                console.log("fetchTags:", tags);
                this.dispatch(keys.fetchTags, tags);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchContent(service, url) {
        const client = serviceInstance.getClient(service);
        if (!client.isLogin()) {
            return Promise.reject(new Error(service.id + " is not login"));
        }
        console.log("fetchContent: " + service.id);
        return client.getContent(url);
    }

    postLink(services, postData) {
        var mapCS = services.map((service) => {
            const client = serviceInstance.getClient(service);
            return {
                service,
                client
            };
        });
        const retry = async (cb, retryCount = 0) => {
            try {
                return await cb();
            } catch (error) {
                if (retryCount < 3) {
                    return await retry(cb, retryCount + 1);
                } else {
                    throw error;
                }
            }
        };
        var enabledCS = mapCS.filter(({ client }) => client.isLogin());
        var servicePromises = enabledCS.map(({ service, client }) => {
            console.log("postLink: " + service.id);
            return retry(() => {
                return client.postLink(postData);
            });
        });
        if (servicePromises.length) {
            LoadingShow();
        }
        return Promise.all(servicePromises)
            .then(() => {
                notie.alert(1, "Post Success!", 1.5);
                this.dispatch(keys.postLink);
            })
            .catch((error) => {
                notie.alert(3, "Post Error.", 2.5);
                console.log(error);
            })
            .then(function finish() {
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

    updateQuote(text) {
        this.dispatch(keys.updateQuote, text);
    }

    updateComment(comment) {
        this.dispatch(keys.updateComment, comment);
    }

    login(service) {
        const client = serviceInstance.getClient(service);
        client.loginAsync((error) => {
            if (error) {
                return console.error(error);
            }
            console.log("login: " + service.id);
        });
    }

    enableService(service) {
        console.log("enableService", service);
        if (typeof service === "string") {
            throw new Error("Not ServiceId, It should be service instance");
        }
        const client = serviceInstance.getClient(service);
        console.log("enableService", client);
        if (client.isLogin()) {
            this.dispatch(keys.enableService, service);
        } else {
            client.loginAsync((error) => {
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

    addRelatedItem({ title, URL } = {}) {
        const relatedItem = new RelatedItemModel({
            title: title || "Dummy",
            URL: URL || "http://example.com/"
        });
        if (title && URL) {
            relatedItem.finishEditing();
        }
        this.dispatch(keys.addRelatedItem, relatedItem);
    }

    finishEditingRelatedItem(item, value) {
        if (!value) {
            return this.dispatch(keys.removeRelatedItem, item);
        }
        item.updateWithValue(value);
        item.finishEditing();
        this.dispatch(keys.finishEditingRelatedItem, item);
    }

    resetField() {
        this.dispatch(keys.resetField);
    }
}
