// LICENSE : MIT
"use strict";
import assert from "assert";
import { OAuth } from "oauth";
export default class OAuthRequest {
    constructor({consumerKey ,consumerSecret, accessKey, accessSecret}) {
        assert(consumerKey && consumerSecret);
        assert(accessKey && accessSecret);
        this.accessKey = accessKey;
        this.accessSecret = accessSecret;

        this.oauth = new OAuth(
            null,
            null,
            consumerKey,
            consumerSecret,
            '1.0',
            null,
            'HMAC-SHA1'
        );
    }

    get(URL, options) {
        return new Promise((resolve, reject) => {
            this.oauth.get(
                URL,
                this.accessKey,
                this.accessSecret,
                function (error, data, res) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(data);
                });

        });
    }

    post(URL, {body}) {
        return new Promise((resolve, reject) => {
            this.oauth.post(
                URL,
                this.accessKey,
                this.accessSecret,
                body,
                function (error, data, res) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(data);
                });

        });
    }
}