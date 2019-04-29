// LICENSE : MIT
"use strict";
import path from "path";
import assert from "assert";
export default class Storage {
    constructor(storeName, defaults = {}) {
        assert(typeof storeName === "string");
        this.storeName = storeName;
        const storedValue = localStorage.getItem(this.storeName);
        this.all = storedValue ? JSON.parse(storedValue) : defaults;
    }

    get(name) {
        return this.all[name];
    }

    has(name) {
        return this.get(name) != null;
    }

    set(name, value) {
        this.all[name] = value;
        localStorage.setItem(this.storeName, JSON.stringify(this.all));
    }

    delete(name) {
        delete this.all[name];
        localStorage.setItem(this.storeName, JSON.stringify(this.all));
    }

    clear() {
        this.all = {};
        localStorage.setItem(this.storeName, JSON.stringify(this.all));
    }
}
