// LICENSE : MIT
"use strict";
export default class JSerInfoPintClient {
    isLogin() {
        return true;
    }

    loginAsync(callback) {
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

        function createIssue(issueData, callback) {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (200 <= xhr.status && xhr.status < 300) {
                    callback(null, xhr.responseText);
                } else {
                    callback(new Error(xhr.responseText));
                }
            };
            xhr.onerror = function() {
                callback(new Error(xhr.responseText));
            };
            xhr.withCredentials = true;
            xhr.open("POST", "https://d6qujk40a3.execute-api.ap-northeast-1.amazonaws.com/prod/ping/create");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(issueData));
        }

        return new Promise((resolve, reject) => {
            createIssue({
                url: url,
                description: comment
            }, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}