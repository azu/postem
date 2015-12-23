// LICENSE : MIT
"use strict";
import querystring from "querystring"
const Authentication = require("remote").require(__dirname + "/JSerAuthentication");
const Committer = require("remote").require(__dirname + "/JSerCommitter");
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
        let {title, url,comment,tags,relatedItems} = options;
        let serializedObject = JSON.stringify({
            title,
            url,
            content: comment,
            tags: tags,
            relatedLinks: relatedItems
        });
        Committer.savePost(serializedObject);
    }
}