// LICENSE : MIT
"use strict";
import { shell } from "electron";
import twitterText from "twitter-text";

const MAX_TWEET_WEIGHT = 140;
const TWITTER_TEXT_OPTIONS = {
    ...twitterText.configs.defaults,
    maxWeightedTweetLength: MAX_TWEET_WEIGHT
};

const buildStatus = ({ comment, quote, title, url }) => {
    const titleText = title ? `"${title}"` : "";
    return [comment, quote, titleText, url].filter((s) => s && s.length > 0).join(" ");
};

const graphemeSegments = (str) => {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (segment) => segment.segment);
};

const tweetWeight = (str) => twitterText.parseTweet(str, TWITTER_TEXT_OPTIONS).weightedLength;

const truncateByTweetWeight = (str, maxWeight) => {
    if (maxWeight <= 0) return "";
    let result = "";
    for (const segment of graphemeSegments(str)) {
        const next = result + segment;
        if (tweetWeight(next) > maxWeight) {
            break;
        }
        result = next;
    }
    return result;
};

const trimDanglingInlineCode = (str) => {
    const backtickCount = (str.match(/`/g) || []).length;
    if (backtickCount % 2 === 0) {
        return str;
    }
    return str.slice(0, str.lastIndexOf("`")).trimEnd();
};

const truncateCommentByTweetWeight = (str, maxWeight) => {
    return trimDanglingInlineCode(truncateByTweetWeight(str, maxWeight)).trimEnd();
};

export const buildTwitterStatus = ({ title, url, comment, quote }) => {
    const parts = { comment: comment || "", quote: quote || "", title: title || "", url: url || "" };
    const status = buildStatus(parts);
    if (tweetWeight(status) <= MAX_TWEET_WEIGHT) {
        return status;
    }

    const preferredParts = parts.comment ? { ...parts, title: "" } : parts;
    const preferredStatus = buildStatus(preferredParts);
    if (tweetWeight(preferredStatus) <= MAX_TWEET_WEIGHT) {
        return preferredStatus;
    }

    const statusWithoutComment = buildStatus({ ...preferredParts, comment: "" });
    const separatorWeight = statusWithoutComment.length > 0 ? tweetWeight(" ") : 0;
    const availableCommentWeight = MAX_TWEET_WEIGHT - tweetWeight(statusWithoutComment) - separatorWeight;
    if (preferredParts.comment && availableCommentWeight > 0) {
        return buildStatus({
            ...preferredParts,
            comment: truncateCommentByTweetWeight(preferredParts.comment, availableCommentWeight)
        });
    }

    return truncateByTweetWeight(preferredStatus, MAX_TWEET_WEIGHT);
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
