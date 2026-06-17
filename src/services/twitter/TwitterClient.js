// LICENSE : MIT
"use strict";
import { shell } from "electron";

const MAX_GRAPHEMES = 140;

const buildStatus = ({ comment, quote, title, url }) => {
    const titleText = title ? `"${title}"` : "";
    return [comment, quote, titleText, url].filter((s) => s && s.length > 0).join(" ");
};

const graphemeSegments = (str) => {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (segment) => segment.segment);
};

const graphemeLength = (str) => graphemeSegments(str).length;

const truncateByGrapheme = (str, maxGraphemes) => {
    if (maxGraphemes <= 0) return "";
    return graphemeSegments(str).slice(0, maxGraphemes).join("");
};

export const buildTwitterStatus = ({ title, url, comment, quote }) => {
    const parts = { comment: comment || "", quote: quote || "", title: title || "", url: url || "" };
    const status = buildStatus(parts);
    if (graphemeLength(status) <= MAX_GRAPHEMES) {
        return status;
    }

    const statusWithoutComment = buildStatus({ ...parts, comment: "" });
    const separatorLength = statusWithoutComment.length > 0 ? 1 : 0;
    const availableCommentLength = MAX_GRAPHEMES - graphemeLength(statusWithoutComment) - separatorLength;
    if (parts.comment && availableCommentLength > 0) {
        return buildStatus({
            ...parts,
            comment: truncateByGrapheme(parts.comment, availableCommentLength)
        });
    }

    return truncateByGrapheme(status, MAX_GRAPHEMES);
};

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
        const { title, url, comment, quote } = options;
        const status = buildTwitterStatus({ title, url, comment, quote });
        const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(status)}`;
        return shell.openExternal(intentUrl);
    }
}
