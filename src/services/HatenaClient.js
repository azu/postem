// LICENSE : MIT
"use strict";
import Consumer from "./HatenaCunsumer";
import querystring from "querystring"
import OAuthRequest from "./API/OAuthRequest";
import { OAuth } from "oauth";
const HatenaService = require("remote").require("./src/services/HatenaService");
export default class HatenaClient {
    _hatenaRequest() {
        var credential = HatenaService.getCredential();
        const oauth = new OAuthRequest({
            consumerKey: Consumer.key,
            consumerSecret: Consumer.secret,
            accessKey: credential.accessKey,
            accessSecret: credential.accessSecret
        });
        return oauth;
    }

    getTags() {
        return this._hatenaRequest().get("http://api.b.hatena.ne.jp/1/my/tags").then(response=> {
            return response.tags.map(tag => tag.tag);
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
        let {url,comment,tags} = options;
        if (tags.length > 0) {
            const tagPrefix = tags.map(tag => {
                return `[${tag}]`;
            }).join("");
            comment = tagPrefix + comment;
        }
        let query = querystring.stringify({
            url,
            comment
        });
        return this._hatenaRequest().post("http://api.b.hatena.ne.jp/1/my/bookmark?" + query);
    }
}