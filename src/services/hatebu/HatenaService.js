// LICENSE : MIT
"use strict";
import AuthenticationHatena from "electron-authentication-hatena";
import Consumer from "./HatenaCunsumer";
import storage from "../../node/storage/accounts";
exports.canAccess = function canAccess() {
    return storage.has("hatena");
};
exports.getCredential = function getCredential() {
    return storage.get("hatena");
};
exports.requireAccess = function requireAccess() {
    // http://developer.hatena.com/ja/documents/auth/apis/oauth/consumer
    var hatena = new AuthenticationHatena({
        key: Consumer.key,
        secret: Consumer.secret,
        scopes: ["read_public", "write_public", "read_private", "write_private"]
    });
    hatena.startRequest().then((result) => {
        var accessToken = result.accessToken;
        var accessTokenSecret = result.accessTokenSecret;
        var credential = {
            accessKey: accessToken,
            accessSecret: accessTokenSecret
        };
        storage.set("hatena", credential);
    });
};