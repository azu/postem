// LICENSE : MIT
"use strict";
import { shell } from "electron";

export default class TwitterClient {
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions || {};
    }

    isLogin() {
        return true;
    }

    loginAsync(callback) {
        callback();
    }

    postLink(options = {}) {
        const { title, url, comment, tags, quote } = options;
        const tagText = (tags ?? []).map((t) => `#${t}`).join(" ");
        const titleText = title ? `"${title}"` : "";
        const status = [comment, quote, titleText, url, tagText].filter((s) => s && s.length > 0).join(" ");
        const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(status)}`;
        return shell.openExternal(intentUrl);
    }
}
