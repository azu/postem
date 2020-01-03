// LICENSE : MIT
"use strict";
import {AsocialBookmark} from "asocial-bookmark"
import Consumer from "./HatenaCunsumer";

export default class HatenaClient {
    isLogin() {
        return true;
    }

    loginAsync(callback) {
        return setTimeout(() => callback(), 0);
    }

    getContent(url) {
        const asocialBookmark = new AsocialBookmark(Consumer);
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
                        URL: item.url
                    }
                }) : []
            }
        })
    }

    getTags() {
        const asocialBookmark = new AsocialBookmark(Consumer);
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
        const {title, url, viaURL, comment, tags, relatedItems} = options;
        const asocialBookmark = new AsocialBookmark(Consumer.github.indexPropertyName);
        const date = new Date();
        const isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
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
