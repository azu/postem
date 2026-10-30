// LICENSE : MIT
"use strict";

const MAX_HTML_BYTES = 256 * 1024;
const TITLE_TIMEOUT_MS = 8000;

const decodeEntities = (text) =>
    text.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|amp|lt|gt|quot|apos|nbsp);?/gi, (match, entity) => {
        const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
        if (entity[0] !== "#") return named[entity.toLowerCase()] || match;
        const hex = entity[1].toLowerCase() === "x";
        const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
        return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    });

export const extractPageTitle = (html) => {
    const match = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i);
    return match ? decodeEntities(match[1]).replace(/\s+/g, " ").trim() : "";
};

const decodeHTML = (bytes, contentType) => {
    const headerCharset = contentType.match(/charset\s*=\s*["']?([^\s;"']+)/i)?.[1];
    const metaCharset = bytes.toString("latin1").match(/<meta\s+[^>]*charset\s*=\s*["']?([^\s;"'/>]+)/i)?.[1];
    try {
        return new TextDecoder(headerCharset || metaCharset || "utf-8").decode(bytes);
    } catch (error) {
        return new TextDecoder().decode(bytes);
    }
};

export const fetchPageTitle = async (url, fetchImpl = fetch) => {
    const parsedURL = new URL(url);
    if (!["http:", "https:"].includes(parsedURL.protocol)) {
        throw new Error("Related URL must use http or https");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TITLE_TIMEOUT_MS);
    try {
        const response = await fetchImpl(parsedURL.href, {
            signal: controller.signal,
            headers: { Accept: "text/html,application/xhtml+xml" }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type") || "";
        if (!/^(text\/html|application\/xhtml\+xml)(?:\s*;|\s*$)/i.test(contentType)) {
            throw new Error("Related URL does not return HTML");
        }

        const reader = response.body.getReader();
        const chunks = [];
        let byteCount = 0;
        try {
            while (byteCount < MAX_HTML_BYTES) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = value.subarray(0, MAX_HTML_BYTES - byteCount);
                chunks.push(chunk);
                byteCount += chunk.byteLength;
                const html = decodeHTML(Buffer.concat(chunks, byteCount), contentType);
                const title = extractPageTitle(html);
                if (title) return title;
            }
        } finally {
            await reader.cancel().catch(() => {});
        }
        throw new Error("Page title was not found");
    } finally {
        clearTimeout(timeout);
    }
};
