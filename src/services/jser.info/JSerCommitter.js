"use strict";
/*
 This module work on Node.js
 */
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
import storage from "../../node/storage/accounts";
import { exec, execSync } from "child_process";

function format0(str, len) {
    return ("_" + Math.pow(10, len) + str).slice(-len);
}

/**
 * Return index.json path which find from `Date` object
 * @param {Date} date
 * @returns {string}
 */
function findDirectoryWithDate(date) {
    var fileDirPath = "data/" + date.getFullYear() + "/" + format0(date.getMonth() + 1, 2);
    // 2016のディレクトリがない
    return path.join(storage.get("jser.info-dir"), fileDirPath);
}

function getPosts(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (e) {
        // default list
        return { list: [] };
    }
}

export function savePost(serializedObject, callback) {
    if (!serializedObject) {
        return callback(new Error("no data for saving"));
    }
    // pre-sync
    var preSyncScript = path.join(storage.get("jser.info-dir"), "./tools/pre-git-sync.sh");
    exec(`bash ${preSyncScript}`, error => {
        if (error) {
            return callback(error);
        }
        // add data
        var date = new Date();
        var dataDir = findDirectoryWithDate(date);
        mkdirp.sync(dataDir);
        var indexDataFilePath = path.join(dataDir, "index.json");
        var posts = getPosts(indexDataFilePath);
        var item = JSON.parse(serializedObject);
        // sync script
        var title = item.title;
        if (item.viaURL) {
            if (/^https:\/\/github.com\/jser\/ping/.test(item.viaURL)) {
                title += "\n\nclose " + item.viaURL;
            } else {
                title += "\n\nvia " + item.viaURL;
            }
        } else {
            // delete null
            delete item.viaURL;
        }
        // if duplicated item, overwrite
        const foundSameItem = posts.list.some(listedItem => {
            return item.url === listedItem.url;
        });
        if (foundSameItem) {
            const itemIndex = posts.list.findIndex(listedItem => {
                return item.url === listedItem.url;
            });
            posts.list[itemIndex] = item;
        } else {
            posts.list.push(item);
        }
        fs.writeFileSync(indexDataFilePath, JSON.stringify(posts, null, 4), "utf-8");
        var syncScript = path.join(storage.get("jser.info-dir"), "./tools/git-sync.sh");
        exec(`bash ${syncScript} "${title}"`, callback);
    });
}
