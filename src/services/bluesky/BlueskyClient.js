// LICENSE : MIT
"use strict";
import { BskyAgent, RichText } from "@atproto/api";

const MAX_GRAPHEMES = 300;
const ELLIPSIS = "…";

const buildStatus = ({ comment, quote, title, url, tagText }) => {
    const titleText = title ? `"${title}"` : "";
    return [comment, quote, titleText, url, tagText].filter((s) => s && s.length > 0).join(" ");
};

const truncateByGrapheme = (str, maxGraphemes) => {
    if (maxGraphemes <= 0) return "";
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    const segments = [];
    for (const seg of segmenter.segment(str)) {
        segments.push(seg.segment);
        if (segments.length >= maxGraphemes) break;
    }
    return segments.join("");
};

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
            new Error(`Please set Bluesky ID and App Password to options
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
        const tagText = (tags ?? []).map((t) => `#${t}`).join(" ");
        const parts = { comment: comment || "", quote: quote || "", title: title || "", url: url || "", tagText };
        let status = buildStatus(parts);
        let graphemeLength = new RichText({ text: status }).graphemeLength;
        if (graphemeLength > MAX_GRAPHEMES) {
            const overheadLength = new RichText({ text: buildStatus({ ...parts, comment: "" }) }).graphemeLength;
            // -1 は空 desc を入れたときに失われる区切りスペース、ELLIPSIS の grapheme は 1
            const available = MAX_GRAPHEMES - overheadLength - 1 - 1;
            const truncatedComment = truncateByGrapheme(parts.comment, available) + ELLIPSIS;
            status = buildStatus({ ...parts, comment: truncatedComment });
        }
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
