// LICENSE : MIT
"use strict";
import Consumer from "./TwitterConsumer";
import Twitter from "twitter"
const Authentication = require("remote").require(__dirname + "/TwitterAuthentication");
export default class TwitterClient {
    isLogin() {
        return Authentication.canAccess();
    }

    loginAsync(callback) {
        return Authentication.requireAccess(callback);
    }

    _getClient() {
        var credential = Authentication.getCredential();
        return new Twitter({
            consumer_key: Consumer.key,
            consumer_secret: Consumer.secret,
            access_token_key: credential.accessKey,
            access_token_secret: credential.accessSecret
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
        let {title, url,comment,tags} = options;
        const status = `${comment} "${title}" ${url}`;
        this._getClient().post('statuses/update', {status: status}, function (error, tweet, response) {
            if (error) {
                return console.error(error, response);
            }
        });
    }
}