export default class SlackClient {
    constructor(serviceOptions) {
        this.serviceOptions = serviceOptions;
    }

    isLogin() {
        return this.serviceOptions.token !== undefined;
    }

    loginAsync(callback) {
        return callback(null, this.serviceOptions.token !== undefined);
    }

    postLink(options = {}) {
        const { title, url, comment, tags, quote } = options;
        const message = `${url}\n${comment}`;
        return fetch(`https://slack.com/api/chat.postMessage`, {
            method: "post",
            headers: {
                Authorization: "Bearer " + this.serviceOptions.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                channel: this.serviceOptions.channel,
                text: message
            })
        });
    }
}
