// LICENSE : MIT
"use strict";
const Committer = require("@electron/remote").require(__dirname + "/ESDailyCommitter");
export default class HatenaClient {
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions;
    }
    isLogin() {
        // Always return true since config is now in service options
        return true;
    }

    loginAsync(callback) {
        // No authentication needed, config is in service options
        return setTimeout(() => callback(), 0);
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
        return Committer.savePost(serializedObject, this.serviceOptions);
    }
}
