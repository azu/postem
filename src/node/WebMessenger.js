// LICENSE : MIT
"use strict";
export default class WebMessenger {
    constructor(webContent) {
        this.webContent = webContent;
    }

    resetField() {
        this.webContent.send("resetField");
    }

    updateTitle(title) {
        if (title) {
            this.webContent.send("updateTitle", title);
        }
    }

    updateURL(URL) {
        if (URL) {
            this.webContent.send("updateURL", URL);
        }
    }
}