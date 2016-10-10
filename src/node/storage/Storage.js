// LICENSE : MIT
"use strict";
import {app} from "electron";
import path from "path";
import assert from "assert";
import jetpack from "fs-jetpack";
export default class Storage {
    constructor(storeName, defaults = {}) {
        assert(typeof storeName === "string");
        this.path = path.join(app.getPath("userData"), storeName + ".json");
        this.all = jetpack.read(this.path, 'json') || defaults;
    }

    get(name) {
        return this.all[name];
    }

    has(name) {
        return this.get(name) != null;
    }

    set(name, value) {
        this.all[name] = value;
        jetpack.write(this.path, this.all);
    }

    delete(name) {
        delete this.all[name];
        jetpack.write(this.path, this.all);
    }

    clear() {
        this.all = {};
        jetpack.write(this.path, this.all);
    }
}