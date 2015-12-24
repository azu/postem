// LICENSE : MIT
"use strict";
import Storage from "./Storage";
class TagStorage extends Storage {
    updateTags(tags) {
        this.set("tags", tags);
    }

    loadTags() {
        return this.get("tags") || [];
    }
}
var tags = new TagStorage("tags");
export default tags;