// LICENSE : MIT
"use strict";
import { AsocialBookmark, AsocialBookmarkOptions } from "asocial-bookmark";

const moment = require("moment");
export default class Client {
    /**
     * @param {import("asocial-bookmark").AsocialBookmarkOptions}serviceOptions
     */
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions;
    }

    isLogin() {
        return true;
    }

    loginAsync(callback) {
        return setTimeout(() => callback(), 0);
    }

    getContent(url) {
        const asocialBookmark = new AsocialBookmark(this.serviceOptions);
        const fetchBookmarkSincePrevMonth = async () => {
            // current/prev 1 month/prev 2 month
            const trialMonths = [0, 1, 2];
            const current = new Date();
            const promises = trialMonths.map((month) => {
                const prevMonth = new Date(current.getFullYear(), current.getMonth() - month, 1);
                return asocialBookmark.getBookmark({
                    url,
                    date: prevMonth
                });
            });
            // success one
            const result = (await Promise.allSettled(promises)).find((result) => result.status === "fulfilled");
            if (result) {
                return result.value;
            }
            return Promise.reject(new Error("Not found"));
        };
        return fetchBookmarkSincePrevMonth()
            .then((result) => {
                return {
                    title: result.title,
                    url: result.url,
                    comment: result.content,
                    tags: result.tags,
                    relatedItems: result.relatedItems
                        ? result.relatedItems.map((item) => {
                              return {
                                  title: item.title,
                                  URL: item.URL
                              };
                          })
                        : []
                };
            })
            .catch((error) => {
                return fetch(`https://jser-product-name.deno.dev/?url=${url}`)
                    .then((res) => res.json())
                    .then((json) => {
                        // { name, url }
                        if (json && json.releaseNoteProbability > 0.5) {
                            const comment =
                                json.releaseNoteVersion !== undefined
                                    ? `${json.name} ${json.releaseNoteVersion}リリース。`
                                    : `${json.name}`;
                            return {
                                comment
                            };
                        }
                    });
            });
    }

    getTags() {
        const asocialBookmark = new AsocialBookmark(this.serviceOptions);
        return asocialBookmark.getTags().catch((error) => {
            console.error("AsocialBookmark getTags error:", error);
            return [];
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
        const { title, url, viaURL, comment, additionalNote, tags, relatedItems } = options;
        const asocialBookmark = new AsocialBookmark(this.serviceOptions);
        const date = new Date();
        const isoDate = moment().utc().toDate();
        const content = additionalNote ? `${comment}\n\n---\n\n${additionalNote}` : comment;
        return asocialBookmark.updateBookmark({
            title,
            url,
            tags,
            viaURL,
            relatedItems,
            content,
            date: isoDate
        });
    }
}
