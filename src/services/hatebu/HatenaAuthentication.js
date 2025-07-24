// LICENSE : MIT
/*
    this module work on Main(Node.js) Context.
 */
import { AuthenticationHatena } from "electron-authentication-hatena";
import Consumer from "./HatenaCunsumer.js";
import storage from "../../node/storage/accounts.js";

export function canAccess() {
    return storage.has("hatena");
}

export function getCredential() {
    return storage.get("hatena");
}

export function requireAccess(callback) {
    // http://developer.hatena.com/ja/documents/auth/apis/oauth/consumer
    const hatena = new AuthenticationHatena({
        key: Consumer.key,
        secret: Consumer.secret,
        scopes: ["read_public", "write_public", "read_private", "write_private"]
    });
    console.log("requireAccess: request start");
    hatena
        .startRequest()
        .then((result) => {
            console.log("requireAccess: response result", result);
            var accessToken = result.accessToken;
            var accessTokenSecret = result.accessTokenSecret;
            var credential = {
                accessKey: accessToken,
                accessSecret: accessTokenSecret
            };
            storage.set("hatena", credential);
            callback(null, credential);
        })
        .catch((error) => {
            callback(error);
        });
}
