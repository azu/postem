// LICENSE : MIT
"use strict";
export default class WebMessenger {
    constructor(webContent) {
        this.webContent = webContent;
    }

    resetField() {
        this.webContent.send("resetField");
    }

    beforeUpdate(argv) {
        this.webContent.send("beforeUpdate", argv);
    }

    afterUpdate(argv) {
        this.webContent.send("afterUpdate", argv);
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

    updateQuote(text) {
        if (text) {
            this.webContent.send("updateQuote", text);
        }
    }
}