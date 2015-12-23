// LICENSE : MIT
"use strict";
/*
    this module work on Main(Node.js) Context.
 */
import Consumer from "./TwitterConsumer";
import NodeTwitterApi from 'node-twitter-api';
import {BrowserWindow} from "electron";
import storage from "../../node/storage/accounts";
const twitter = new NodeTwitterApi({
    callback: 'http://example.com',
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
        const loginWindow = new BrowserWindow({width: 800, height: 600, 'node-integration': false});
        loginWindow.webContents.on('will-navigate', (e, url) => {
            const closeWindow = () => setTimeout(() => loginWindow.close(), 0);
            let matched;
            if (matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/)) {
                twitter.getAccessToken(reqToken, reqTokenSecret, matched[2], (__error, accessToken, accessTokenSecret) => {
                    var credential = {
                        accessKey: accessToken,
                        accessSecret: accessTokenSecret
                    };
                    storage.set("twitter", credential);
                    if (callback) {
                        callback(null, credential);
                    }
                });
            }
            e.preventDefault();
            closeWindow();
        });
        loginWindow.loadURL(authUrl);
    });
};
