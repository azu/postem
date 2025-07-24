// LICENSE : MIT
import { AsocialBookmark } from "asocial-bookmark";
import Consumer from "./JSerInfoConsumer.js";

import moment from "moment";
export default class JSerInfoClient {
    isLogin() {
        return true;
    }

    loginAsync(callback) {
        return setTimeout(() => callback(), 0);
    }

    getContent(url) {
        const asocialBookmark = new AsocialBookmark({
            indexPropertyName: Consumer.indexPropertyName,
            github: Consumer.github
        });
        return asocialBookmark
            .getBookmark({
                url,
                date: new Date()
            })
            .then((result) => {
                return {
                    title: result.title,
                    url: result.url,
                    comment: result.content,
                    tags: result.tags,
                    relatedItems: result.relatedLinks
                        ? result.relatedLinks.map((item) => {
                              return {
                                  title: item.title,
                                  URL: item.url
                              };
                          })
                        : []
                };
            });
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
        const { title, url, viaURL, comment, additionalNote, tags, relatedItems } = options;
        const asocialBookmark = new AsocialBookmark({
            indexPropertyName: Consumer.indexPropertyName,
            github: Consumer.github
        });
        const date = new Date();
        const isoDate = moment().utc().toDate();
        return asocialBookmark.updateBookmark({
            date: isoDate,
            title,
            url,
            content: comment,
            additionalNote,
            tags,
            viaURL,
            relatedLinks: relatedItems.map((item) => {
                return {
                    title: item.title,
                    url: item.URL
                };
            })
        });
    }
}
