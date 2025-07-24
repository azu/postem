// LICENSE : MIT
import { remote } from "@electron/remote";
const Authentication = remote.require(__dirname + "/ESDailyAuthentication.js");
const Committer = remote.require(__dirname + "/ESDailyCommitter.js");
export default class HatenaClient {
    isLogin() {
        return Authentication.canAccess();
    }

    loginAsync(callback) {
        Authentication.requireAccess(callback);
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
        const { title, url, comment, tags, relatedItems } = options;
        const serializedObject = JSON.stringify({
            date: new Date(),
            title,
            url,
            content: comment,
            tags: tags,
            relatedLinks: relatedItems
        });
        return Committer.savePost(serializedObject);
    }
}
