import { createServer } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractPageTitle, fetchPageTitle } from "../../src/node/fetch-page-title.js";

describe("fetchPageTitle", () => {
    let server;
    let baseURL;

    beforeAll(async () => {
        server = createServer((request, response) => {
            if (request.url === "/redirect") {
                response.writeHead(302, { Location: "/article" }).end();
            } else if (request.url === "/missing") {
                response.writeHead(404).end();
            } else if (request.url === "/plain") {
                response.writeHead(200, { "Content-Type": "text/plain" }).end("no HTML");
            } else if (request.url === "/latin1") {
                response.writeHead(200, { "Content-Type": "text/html; charset=iso-8859-1" });
                response.end(Buffer.from("<title>Caf\xe9</title>", "latin1"));
            } else {
                response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                response.end("<html><head><title>関連記事 &amp; ニュース</title></head><body>本文</body></html>");
            }
        });
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
        baseURL = `http://127.0.0.1:${server.address().port}`;
    });

    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
    });

    it("reads a redirected HTML title and decodes entities", async () => {
        expect(await fetchPageTitle(`${baseURL}/redirect`)).toBe("関連記事 & ニュース");
        expect(await fetchPageTitle(`${baseURL}/latin1`)).toBe("Café");
    });

    it("rejects missing pages, non-HTML responses, and unsupported URL schemes", async () => {
        await expect(fetchPageTitle(`${baseURL}/missing`)).rejects.toThrow("HTTP 404");
        await expect(fetchPageTitle(`${baseURL}/plain`)).rejects.toThrow("does not return HTML");
        await expect(fetchPageTitle("file:///tmp/example.html")).rejects.toThrow("http or https");
    });

    it("returns no title when HTML has none", () => {
        expect(extractPageTitle("<html><head></head></html>")).toBe("");
    });
});
