// LICENSE : MIT
export default class HatenaClient {
    isLogin() {
        return true;
    }

    loginAsync() {
        return new Promise((resolve, reject) => {
            resolve();
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
        console.log("debug", options);
        return Promise.resolve();
    }

    /**
     * テスト用のタグ取得機能
     * @returns {Promise<string[]>}
     */
    getTags() {
        // テスト用の固定タグを返す
        return Promise.resolve(["JavaScript", "React", "CodeMirror", "Testing", "Migration"]);
    }

    /**
     * テスト用のコンテンツ取得機能
     * @param url
     * @returns {Promise<{comment: string, tags: string[], relatedItems: []}>}
     */
    getContent(url) {
        return Promise.resolve({
            comment: "テスト用の自動取得コメント",
            tags: ["JavaScript", "Testing"],
            relatedItems: []
        });
    }
}
