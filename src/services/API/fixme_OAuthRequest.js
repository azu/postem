// LICENSE : MIT
"use strict";
import assert from "assert";
import OAuthSignature from "./OAuthSignature";
export default class OAuthRequest {
    constructor(consumer, credencial) {
        assert(consumer && credencial);
        this.oauthSignature = new OAuthSignature(consumer, credencial);
    }

    get(URL) {
        const Authorization = this.oauthSignature.create("GET", URL);
        return fetch(URL, {
            method: "get",
            headers: {
                Accept: "application/json",
                Authorization: Authorization
            }
        }).then(function(response) {
            return response.json();
        });
    }

    post(URL, body) {
        const Authorization = this.oauthSignature.create("POST", URL);
        return fetch(URL, {
            method: "post",
            headers: {
                Authorization: Authorization,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });
    }
}
