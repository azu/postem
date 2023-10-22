// LICENSE : MIT
"use strict";
import querystring from "querystring";
import OAuthRequest from "../API/OAuthRequest";
import Consumer from "./HatenaCunsumer";

const Authentication = require("@electron/remote").require(__dirname + "/HatenaAuthentication");
export default class HatenaClient {
    isLogin() {
        return Authentication.canAccess();
    }

    loginAsync(callback) {
        return Authentication.requireAccess(callback);
    }

    _hatenaRequest() {
        const credential = Authentication.getCredential();
        return new OAuthRequest({
            consumerKey: Consumer.key,
            consumerSecret: Consumer.secret,
            accessKey: credential.accessKey,
            accessSecret: credential.accessSecret
        });
    }

    getContent(url) {
        let query = querystring.stringify({
            url
        });
        return this._hatenaRequest()
            .get("https://bookmark.hatenaapis.com/rest/1/my/bookmark?" + query)
            .then((response) => {
                if (response.statusCode === 403) {
                    const data = JSON.parse(response["data"]);
                    return Promise.reject(new Error(data["message"]));
                }
                return response;
            });
    }

    getTags() {
        return this._hatenaRequest()
            .get("https://bookmark.hatenaapis.com/rest/1/my/tags")
            .then((response) => {
                return response.tags.map((tag) => tag.tag);
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
        let { url, comment, tags } = options;
        if (tags.length > 0) {
            // [tag][tag] comment
            const tagPrefix = tags
                .map((tag) => {
                    return `[${tag}]`;
                })
                .join("");
            comment = tagPrefix + comment;
        }
        const query = querystring.stringify({
            url,
            comment
        });
        return this._hatenaRequest().post("https://bookmark.hatenaapis.com/rest/1/my/bookmark?" + query);
    }
}
