import { describe, it, expect, vi, beforeEach } from "vitest";
import { shell } from "electron";
import twitterText from "twitter-text";
import TwitterClient, { buildTwitterStatus } from "../../src/services/twitter/TwitterClient.js";

vi.mock("electron", () => ({
    shell: {
        openExternal: vi.fn()
    }
}));

const MAX_TWEET_WEIGHT = 140;
const twitterTextOptions = {
    ...twitterText.configs.defaults,
    maxWeightedTweetLength: MAX_TWEET_WEIGHT
};
const tweetWeight = (str) => twitterText.parseTweet(str, twitterTextOptions).weightedLength;

const getIntentText = (intentUrl) => {
    const url = new URL(intentUrl);
    return url.searchParams.get("text");
};

describe("TwitterClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not append tags to X post text", () => {
        const client = new TwitterClient();
        client.postLink({
            title: "Title",
            url: "https://example.com",
            comment: "Comment",
            tags: ["JavaScript", "Testing"]
        });

        const intentText = getIntentText(shell.openExternal.mock.calls[0][0]);
        expect(intentText).toBe('Comment "Title" https://example.com');
    });

    it("truncates X post text to 140 weighted characters", () => {
        const status = buildTwitterStatus({
            comment: "あ".repeat(200),
            title: "Title",
            url: "https://example.com"
        });

        expect(tweetWeight(status)).toBe(140);
        expect(status).not.toContain('"Title"');
        expect(status).toContain("https://example.com");
    });

    it("prioritizes long comments and URLs over title when truncating", () => {
        const status = buildTwitterStatus({
            comment:
                "FlowをOCamlからRustへ移植した話。\n" +
                "AIを使った行ごとの移植、OCamlとRustの違い、移植後のビルドやテストの扱いについて書かれている。コードフリーズなしでの移植を行なっている。",
            title: "Flow has been ported to Rust | Flow",
            url: "https://medium.com/flow-type/flows-ocaml-to-rust-port-78b95bcf49e9"
        });

        expect(tweetWeight(status)).toBeLessThanOrEqual(MAX_TWEET_WEIGHT);
        expect(status).toContain("AIを使った行ごとの移植、OCamlとRustの違い、");
        expect(status).not.toContain('"Flow has been ported to Rust | Flow"');
        expect(status).toContain("https://medium.com/flow-type/flows-ocaml-to-rust-port-78b95bcf49e9");
    });

    it("does not leave dangling inline code when truncating X post text", () => {
        const status = buildTwitterStatus({
            comment:
                "Next.js 16.3 Previewリリース。\n" +
                "Next.js 16.3で試験的な機能として追加されるInstant Navigationsについて。\n" +
                "`cacheComponents`と`partialPrefetching`オプションによって、Instant routeごとに一度キャッシュが作られ、ページナビゲーションが即時的に表示できる仕組みについて",
            title: "Next.js 16.3: Instant Navigations | Next.js",
            url: "https://nextjs.org/blog/next-16-3-instant-navigations"
        });

        expect(tweetWeight(status)).toBeLessThanOrEqual(MAX_TWEET_WEIGHT);
        expect(status).toBe(
            "Next.js 16.3 Previewリリース。\n" +
                "Next.js 16.3で試験的な機能として追加されるInstant Navigationsについて。 https://nextjs.org/blog/next-16-3-instant-navigations"
        );
    });

    it("truncates the whole X post text when non-comment parts exceed 140 weighted characters", () => {
        const status = buildTwitterStatus({
            comment: "",
            title: "T".repeat(200),
            url: "https://example.com"
        });

        expect(tweetWeight(status)).toBe(140);
    });
});
