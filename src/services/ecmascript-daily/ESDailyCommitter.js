"use strict";
/*
    This module work on Node.js
 */
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const moment = require("moment");
const slugg = require("slugg");
const mkdirp = require('mkdirp');
import storage from "../../node/storage/accounts";
import {exec} from "child_process"
/**
 * Return index.json path which find from `Date` object
 * @param {Date} date
 * @returns {string}
 */
function getPostFileDir(date) {
    var fileDirPath = "posts/" + date.getFullYear();
    return path.join(storage.get("ecmascript-daily-dir"), fileDirPath);
}
export function savePost(serializedObject, callback) {
    if (!serializedObject) {
        throw new Error("no data for saving");
    }
    var item = JSON.parse(serializedObject);
    createPostFrom(item, callback);
}

function pickFromMatter(item) {
    var object = {
        layout: "news",
        // site title
        title: item.title,
        // site url
        "item-url": item.url,
        date: moment.utc(item.date).format()
    };
    if (item.tags && item.tags.length > 0) {
        object.tags = item.tags;
    }

    if (item.relatedLinks && item.relatedLinks.length > 0) {
        object.related = item.relatedLinks.map(link => {
            return {
                title: link.title,
                url: link.URL
            };
        });
    }
    return object;
}
function createPost(item) {
    var frontMatter = pickFromMatter(item);
    return ("---\n" +
    yaml.safeDump(frontMatter) +
    "---\n" +
    String(item.content) + "\n").replace(/[\n\r]/g, '\n');
}
function creteSafeSlug(item) {
    var slugForItem = slugg(item.title);
    if (slugForItem.length <= 1) {
        slugForItem = slugg(item.url);
    }
    // avoid ENAMETOOLONG
    if (slugForItem.length > 200) {
        return slugForItem.slice(0, 200);
    }
    return slugForItem;
}
function createPostFrom(item, callback) {
    const date = moment.utc(item.date);
    const repositoryDirectory = storage.get("ecmascript-daily-dir");
    const postDir = path.join(repositoryDirectory, "_posts", date.format("YYYY"));
    // if no dir, create dir
    mkdirp.sync(postDir);
    const fileName = date.format("YYYY-MM-DD") + "-" + creteSafeSlug(item) + ".md";
    const filePath = path.join(postDir, fileName);
    fs.writeFileSync(filePath, createPost(item), "utf8");
    // sync
    const title = item.title;
    var syncScript = path.join(__dirname, "git-sync.sh");
    exec(`bash ${syncScript} "${title}"`, {
        cwd: repositoryDirectory
    }, callback);
}