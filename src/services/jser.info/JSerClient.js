// LICENSE : MIT
"use strict";
import querystring from "querystring"
export default class HatenaClient {
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
        let {url,comment,tags} = options;
        if (tags.length > 0) {
            // [tag][tag] comment
            const tagPrefix = tags.map(tag => {
                return `[${tag}]`;
            }).join("");
            comment = tagPrefix + comment;
        }
        let query = querystring.stringify({
            url,
            comment
        });
        return this._hatenaRequest().post("http://api.b.hatena.ne.jp/1/my/bookmark?" + query);
    }
}