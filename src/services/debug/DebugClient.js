// LICENSE : MIT
"use strict";
export default class HatenaClient {
    isLogin() {
        return true;
    }

    loginAsync() {
        return new Promise((resolve, reject) => {
            resolve();
        });
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
        console.log("debug", options);
        return Promise.resolve();
    }
}