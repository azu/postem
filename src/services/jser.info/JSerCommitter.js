"use strict";
/*
    This module work on Node.js
 */
const path = require("path");
const fs = require("fs");
import storage from "../../node/storage/accounts";
import {exec} from "child_process"
function format0(str, len) {
    return ('_' + Math.pow(10, len) + str).slice(-len);
}
/**
 * Return index.json path which find from `Date` object
 * @param {Date} date
 * @returns {string}
 */
function findIndexWithDate(date) {
    var fileDirPath = "data/" + date.getFullYear() + '/' + format0((date.getMonth() + 1), 2);
    return path.join(storage.get("jser.info-dir"), fileDirPath, "index.json");
}
function getPosts(filePath) {
    try {
        return require(filePath);
    } catch (e) {
        // default list
        return {list: []};
    }
}
export function savePost(serializedObject, callback) {
    if (!serializedObject) {
        return callback(new Error("no data for saving"));
    }
    var date = new Date();
    var filePath = findIndexWithDate(date);
    var posts = getPosts(filePath);
    var item = JSON.parse(serializedObject);
    posts.list.push(item);
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 4), "utf-8");
    // sync script
    var title = item.title;
    var syncScript = path.join(storage.get("jser.info-dir"), "./tools/git-sync.sh");
    exec(`bash ${syncScript} "${title}"`, callback);
}