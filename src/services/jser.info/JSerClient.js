// LICENSE : MIT
"use strict";
import querystring from "querystring"
const Authentication = require('electron').remote.require(__dirname + "/JSerAuthentication");
const Committer = require('electron').remote.require(__dirname + "/JSerCommitter");
export default class HatenaClient {
    isLogin() {
        return Authentication.canAccess();
    }

    loginAsync(callback) {
        Authentication.requireAccess(callback);
    }

    /**
     *
     * @param options
     * @returns {*}
     * {
            url,
            comment,
            tags = []
        }
     */
    postLink(options = {}) {
        let {title, url, viaURL, comment, tags, relatedItems} = options;
        let serializedObject = JSON.stringify({
            date: new Date(),
            title,
            url,
            viaURL,
            content: comment,
            tags: tags,
            relatedLinks: relatedItems.map(item => {
                return {
                    title: item.title,
                    url: item.URL
                };
            })
        });
        let resolve, reject;
        const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
        Committer.savePost(serializedObject, function(error) {
            if (error) {
                return reject(error);
            }
            resolve();
        });
        return promise;
    }
}