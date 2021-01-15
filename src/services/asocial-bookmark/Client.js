// LICENSE : MIT
"use strict";
import { AsocialBookmark, AsocialBookmarkOptions } from "asocial-bookmark"

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
        return asocialBookmark.getBookmark({
            url,
            date: new Date()
        }).then(result => {
            return {
                title: result.title,
                url: result.url,
                comment: result.content,
                tags: result.tags,
                relatedItems: result.relatedItems ? result.relatedItems.map(item => {
                    return {
                        title: item.title,
                        URL: item.URL
                    }
                }) : []
            }
        })
    }

    getTags() {
        const asocialBookmark = new AsocialBookmark(this.serviceOptions);
        return asocialBookmark.getTags();
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
        const { title, url, viaURL, comment, tags, relatedItems } = options;
        const asocialBookmark = new AsocialBookmark(this.serviceOptions);
        const date = new Date();
        const isoDate = moment().utc().toDate();
        return asocialBookmark.updateBookmark({
            title,
            url,
            tags,
            viaURL,
            relatedItems,
            content: comment,
            date: isoDate
        });
    }
}
