// LICENSE : MIT
"use strict";
const Authentication = require("@electron/remote").require(__dirname + "/ESDailyAuthentication");
const Committer = require("@electron/remote").require(__dirname + "/ESDailyCommitter");
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
        const { title, url, comment, tags, relatedItems } = options;
        const serializedObject = JSON.stringify({
            date: new Date(),
            title,
            url,
            content: comment,
            tags: tags,
            relatedLinks: relatedItems
        });
        return Committer.savePost(serializedObject);
    }
}
