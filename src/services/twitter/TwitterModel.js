// LICENSE : MIT
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class TwitterModel {
    constructor() {
        this.id = "com.twitter";
        this.name = "TwitterModel";
        this.description = "Twitter";
        this.icon = __dirname + "/twitter.png";
    }
}
