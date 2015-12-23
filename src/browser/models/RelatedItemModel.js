// LICENSE : MIT
"use strict";
let idCount = 0;
export default class RelatedItem {
    constructor({title,URL}) {
        this.title = title;
        this.URL = URL;
        this.id = idCount++;
        this.isEditing = true;
    }

    updateWithValue(value) {
        try {
            const parsedValue = JSON.parse(value);
            const title = parsedValue.TITLE || parsedValue.title;
            const URL = parsedValue.URL || parsedValue.url;
            if (title && URL) {
                this.title = title;
                this.URL = URL;
            }
        } catch (error) {
        }
    }

    startEditing() {
        this.isEditing = true;
    }

    finishEditing() {
        this.isEditing = false
    }

    toJSON() {
        return {
            title: this.title,
            URL: this.URL
        };
    }
}