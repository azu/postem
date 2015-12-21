// LICENSE : MIT
"use strict";

import oauthSignature from "oauth-signature";
export default class OAuthSignature {
    constructor(consumer, creadencial) {
        this.consumer = consumer;
        this.credencial = creadencial;
    }

    createHeader(parameters) {
        const {
            oauth_consumer_key,
            oauth_token,
            oauth_nonce,
            oauth_timestamp,
            oauth_signature,// <= created signature
            oauth_signature_method,
            oauth_version,
            } = parameters;
        return `OAuth oauth_consumer_key="${oauth_consumer_key}", oauth_nonce="${oauth_nonce}", oauth_signature="${oauth_signature}", oauth_signature_method="${oauth_signature_method}", oauth_timestamp="${oauth_timestamp}", oauth_token="${oauth_token}", oauth_version="${oauth_version}"`;
    }

    create(httpMethod, URL, userParameters = {}) {
        var oathParameters = {
            oauth_consumer_key: this.consumer.key,
            oauth_token: this.credencial.accessKey,
            oauth_nonce: this._generateNonce(),
            oauth_timestamp: this._getTimestamp(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0'
        };
        const parameters = Object.assign(oathParameters, userParameters);
        const consumerSecret = this.consumer.secret;
        const accessSecret = this.credencial.accessSecret;
        console.log(this.consumer, this.credencial);
        const encodedSignature = oauthSignature.generate(httpMethod, URL, parameters, consumerSecret, accessSecret);
        const headerParameters = Object.assign({}, oathParameters, {
            oauth_signature: encodedSignature
        });
        console.log(headerParameters);
        return this.createHeader(headerParameters);
    }

    _generateNonce(nonceSize = 32) {
        const NONCE_CHARS = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
            'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9'
        ];
        var result = [];
        var chars = NONCE_CHARS;
        var char_pos;
        var nonce_chars_length = chars.length;

        for (var i = 0; i < nonceSize; i++) {
            char_pos = Math.floor(Math.random() * nonce_chars_length);
            result[i] = chars[char_pos];
        }
        return result.join('');
    }

    _getTimestamp() {
        return Math.floor((new Date()).getTime() / 1000);
    }
}