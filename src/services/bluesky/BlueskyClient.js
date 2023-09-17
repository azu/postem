// LICENSE : MIT
"use strict";
import { BskyAgent, RichText } from "@atproto/api";
import { truncate } from "tweet-truncator";

const agent = new BskyAgent({
    service: "https://bsky.social"
});
const useBskyAgent = async ({ identifier, appPassword }) => {
    if (agent.hasSession) {
        // try resume session
        try {
            await agent.resumeSession(agent.session);
        } catch (error) {
            // if error, login again
            await agent.login({
                identifier,
                password: appPassword
            });
        }
    } else {
        await agent.login({
            identifier: identifier,
            password: appPassword
        });
    }
    return agent;
};
export default class BlueskyClient {
    /**
     * @param {{ identifier:string; appPassword:string; }} serviceOptions
     */
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions;
    }

    get _hasServiceOptions() {
        return Boolean(this.serviceOptions && this.serviceOptions.identifier && this.serviceOptions.appPassword);
    }

    isLogin() {
        return this._hasServiceOptions;
    }

    loginAsync(callback) {
        callback(
            new Error(`Please set Twitter App Key and Secret to options
    {
        enabled: true,
        name: "bluesky",
        indexPath: path.join(__dirname, "services/bluesky/index.js"),
        options: {
            identifier: "you.bsky.social",
            appPassword: "app password for bsky"
        }
    }
`)
        );
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
    async postLink(options = {}) {
        const { title, url, comment, tags, quote } = options;
        // make contents object
        const contents = { title, url, desc: comment, tags, quote: quote || "" };
        const status = truncate(contents, {
            template: `%desc% %quote% "%title%" %url% %tags%`,
            maxLength: 280
        });
        const agent = await useBskyAgent({
            identifier: this.serviceOptions.identifier,
            appPassword: this.serviceOptions.appPassword
        });
        const rt = new RichText({ text: status });
        await rt.detectFacets(agent); // automatically detects mentions and links
        const postRecord = {
            $type: "app.bsky.feed.post",
            text: rt.text,
            facets: rt.facets,
            createdAt: new Date().toISOString()
        };
        return agent.post(postRecord);
    }
}
