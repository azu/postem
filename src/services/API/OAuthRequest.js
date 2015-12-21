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
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': Authorization
            }
        }).then(function (response) {
            return response.json()
        })
    }

    post(URL, options = {}) {
        const Authorization = this.oauthSignature.create("POST", URL, options);
        return fetch(URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Authorization
            },
            body: JSON.stringify(options)
        }).then(function (response) {
            return response.json()
        })
    }
}