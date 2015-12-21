// LICENSE : MIT
"use strict";
import AuthenticationHatena from "electron-authentication-hatena";
import querystring from "querystring";
import OAuthRequest from "../../OAuthRequest";
const Consumer = {
    key: 'elj9OpeplSmpfA==',
    secret: '1hqDhJ2BfB6kozd/nHeLIW7WC/Y='
};
export default class HatenaService {
    constructor(storage) {
        this.storage = storage;
    }

    canAccess() {
        return this.storage.has("hatena");
    }

    requireAccess() {
        // http://developer.hatena.com/ja/documents/auth/apis/oauth/consumer
        var hatena = new AuthenticationHatena({
            key: Consumer.key,
            secret: Consumer.secret,
            scopes: ["read_public", "write_public", "read_private", "write_private"]
        });
        return hatena.startRequest().then((result) => {
            var accessToken = result.accessToken;
            var accessTokenSecret = result.accessTokenSecret;
            var token = {
                accessKey: accessToken,
                accessSecret: accessTokenSecret
            };
            this.storage.set("hatena", token);
            return token;
        });
    }

    _hatenaRequest() {
        var credential = this.storage.get("hatena");
        return new OAuthRequest({
            consumerKey: Consumer.key,
            consumerSecret: Consumer.secret,
            accessKey: credential.accessKey,
            accessSecret: credential.accessSecret
        });
    }

    getTags() {
        return this._hatenaRequest().get("http://api.b.hatena.ne.jp/1/my/tags").then(function (res) {
            return JSON.parse(res);
        }).then(response=> {
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
        console.log(query);
        return this._hatenaRequest().post("http://api.b.hatena.ne.jp/1/my/bookmark?" + query);
    }
}