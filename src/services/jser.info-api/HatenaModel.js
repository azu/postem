// LICENSE : MIT
"use strict";
export default class HatenaModel {
    constructor() {
        this.id = "jser.info.asocialbookmark-github-api";
        this.name = "JSer.info API";
        this.description = "JSer.info API Version";
        this.icon = process.env.BROWSER === "1" ? require("./jser.info.png") : __dirname + "/jser.info.png";
        this.tagService = true;
    }
}
