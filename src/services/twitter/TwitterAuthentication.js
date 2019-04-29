// LICENSE : MIT
"use strict";
/*
    this module work on Main(Node.js) Context.
 */
import Consumer from "./TwitterConsumer";
import NodeTwitterApi from "node-twitter-api";
import { BrowserWindow, session } from "electron";
import storage from "../../node/storage/accounts";

const twitter = new NodeTwitterApi({
    callback: Consumer.callbackURL,
    consumerKey: Consumer.key,
    consumerSecret: Consumer.secret
});
exports.canAccess = function canAccess() {
    return storage.has("twitter");
};
exports.getCredential = function getCredential() {
    return storage.get("twitter");
};
exports.requireAccess = function requireAccess(callback) {
    twitter.getRequestToken((_error, reqToken, reqTokenSecret) => {
        const authUrl = twitter.getAuthUrl(reqToken);
        const loginWindow = new BrowserWindow({ width: 800, height: 600, "node-integration": false });

        const filter = {
            urls: ["*"]
        };
        session.defaultSession.webRequest.onCompleted(filter, details => {
            const url = details.url;
            handleURL(url);
        });
        const handleURL = (url, preventDefault) => {
            const closeWindow = () => setTimeout(() => loginWindow.close(), 0);
            let matched;
            if ((matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/))) {
                twitter.getAccessToken(
                    reqToken,
                    reqTokenSecret,
                    matched[2],
                    (__error, accessToken, accessTokenSecret) => {
                        var credential = {
                            accessKey: accessToken,
                            accessSecret: accessTokenSecret
                        };
                        storage.set("twitter", credential);
                        closeWindow();
                        if (callback) {
                            callback(null, credential);
                        }
                    }
                );
            }
            if (preventDefault) {
                preventDefault();
            }
        };
        loginWindow.webContents.on("will-navigate", (event, url) => {
            handleURL(url, () => event.preventDefault());
        });
        loginWindow.loadURL(authUrl);
    });
};
