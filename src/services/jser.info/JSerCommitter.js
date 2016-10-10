"use strict";
/*
    This module work on Node.js
 */
const path = require("path");
const fs = require("fs");
const mkdirp = require('mkdirp');
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
function findDirectoryWithDate(date) {
    var fileDirPath = "data/" + date.getFullYear() + '/' + format0((date.getMonth() + 1), 2);
    // 2016のディレクトリがない
    return path.join(storage.get("jser.info-dir"), fileDirPath);
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
    var dataDir = findDirectoryWithDate(date);
    mkdirp.sync(dataDir);
    var indexDataFilePath = path.join(dataDir, "index.json");
    var posts = getPosts(indexDataFilePath);
    var item = JSON.parse(serializedObject);
    posts.list.push(item);
    fs.writeFileSync(indexDataFilePath, JSON.stringify(posts, null, 4), "utf-8");
    // sync script
    var title = item.title;
    if (item.viaURL) {
        title += "\n\nvia " + item.viaURL;
    }
    var syncScript = path.join(storage.get("jser.info-dir"), "./tools/git-sync.sh");
    exec(`bash ${syncScript} "${title}"`, callback);
}