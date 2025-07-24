// LICENSE : MIT
"use strict";
const Storage = require("./Storage");
class TagStorage extends Storage {
    updateTags(tags) {
        this.set("tags", tags);
    }

    loadTags() {
        return this.get("tags") || [];
    }
}
var tags = new TagStorage("tags");
module.exports = tags;
