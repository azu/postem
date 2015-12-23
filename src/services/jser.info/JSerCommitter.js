"use strict";
const path = require("path");
import storage from "../../node/storage/accounts";
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
export function getPosts(date) {
    try {
        return require(findIndexWithDate(date));
    } catch (e) {
        // default list
        return {list: []};
    }
}
export function savePost(serializedObject) {
    var date = new Date();
    var posts = getPosts(date);
    posts.list.push(JSON.parse(serializedObject));
    console.log(posts);
}