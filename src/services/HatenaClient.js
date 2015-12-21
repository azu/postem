// LICENSE : MIT
"use strict";
import Consumer from "./HatenaCunsumer";
import querystring from "querystring"
import OAuthRequest from "./API/OAuthRequest";
const HatenaService = require("remote").require("./src/services/HatenaService");
export default class HatenaClient {
    _hatenaRequest() {
        var credential = HatenaService.getCredential();
        return new OAuthRequest(Consumer, credential);
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
        var {url,comment,tags} = options;
        let query = querystring.stringify({
            url,
            comment
        });
        if (tags.length > 0) {
            // tags[]=tag0&tags[]=tag1
            const tagQuery = tags.map(tag => {
                return `tags=${tag}`;
            }).join("&");
            query += "&" + tagQuery;
        }
        return this._hatenaRequest().post("http://api.b.hatena.ne.jp/1/my/bookmark.json", options);

    }
}