// LICENSE : MIT
"use strict";
import { TwitterApi } from "twitter-api-v2";
import { truncate } from "tweet-truncator";
import { TwitterApiV2Settings } from "twitter-api-v2";

TwitterApiV2Settings.debug = true;
export default class TwitterClient {
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions;
    }

    get _hasServiceOptions() {
        return Boolean(
            this.serviceOptions &&
                this.serviceOptions.appKey &&
                this.serviceOptions.appSecret &&
                this.serviceOptions.accessToken &&
                this.serviceOptions.accessSecret
        );
    }

    isLogin() {
        return this._hasServiceOptions;
    }

    loginAsync(callback) {
        callback(
            new Error(`Please set Twitter App Key and Secret to options
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js"),
        options: {
            appKey: "app key",
            appSecret: "app secret",
            accessToken: "access token ",
            accessSecret: "access token secret"
        }
    }
`)
        );
    }

    /**
     * @returns {TwitterApi}
     * @private
     */
    _getClient() {
        return new TwitterApi({
            appKey: this.serviceOptions.appKey,
            appSecret: this.serviceOptions.appSecret,
            accessToken: this.serviceOptions.accessToken,
            accessSecret: this.serviceOptions.accessSecret
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
        const { title, url, comment, tags, quote } = options;
        // make contents object
        const contents = { title, url, desc: comment, tags, quote: quote || "" };
        const status = truncate(contents, {
            template: `%desc% %quote% "%title%" %url% %tags%`
        });

        return this._getClient().readWrite.v2.tweet(status, {
            requestEventDebugHandler: (eventType, data) => console.log("Event", eventType, "with data", data)
        });
    }
}
