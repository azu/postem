// LICENSE : MIT
"use strict";
let idCount = 0;
export default class RelatedItem {
    constructor({ title, URL }) {
        this.title = title;
        this.URL = URL;
        this.id = idCount++;
        this.isEditing = true;
    }

    updateWithValue({ title, URL }) {
        if (title && URL) {
            this.title = title;
            this.URL = URL;
        }
    }

    startEditing() {
        this.isEditing = true;
    }

    finishEditing() {
        this.isEditing = false;
    }

    toJSON() {
        return {
            title: this.title,
            URL: this.URL
        };
    }
}
