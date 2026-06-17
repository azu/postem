import { describe, it, expect, vi, beforeEach } from "vitest";
import { shell } from "electron";
import TwitterClient, { buildTwitterStatus } from "../../src/services/twitter/TwitterClient.js";

vi.mock("electron", () => ({
    shell: {
        openExternal: vi.fn()
    }
}));

const graphemeLength = (str) => {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return Array.from(segmenter.segment(str)).length;
};

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

    it("truncates X post text to 140 graphemes", () => {
        const status = buildTwitterStatus({
            comment: "あ".repeat(200),
            title: "Title",
            url: "https://example.com"
        });

        expect(graphemeLength(status)).toBe(140);
        expect(status).toContain('"Title" https://example.com');
    });

    it("truncates the whole X post text when non-comment parts exceed 140 graphemes", () => {
        const status = buildTwitterStatus({
            comment: "",
            title: "T".repeat(200),
            url: "https://example.com"
        });

        expect(graphemeLength(status)).toBe(140);
    });
});
