/*
    This module work on Node.js
 */
import { createKoreFile } from "korefile";

import { createGitHubAdaptor } from "korefile";
import path from "node:path";
import yaml from "js-yaml";
import moment from "moment";
import slugg from "slugg";

// call from client
export async function savePost(serializedObject, callback) {
    if (!serializedObject) {
        throw new Error("no data for saving");
    }
    const item = JSON.parse(serializedObject);
    return createPostFrom(item, callback);
}

function pickFromMatter(item) {
    const object = {
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
        object.related = item.relatedLinks.map((link) => {
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
    return ("---\n" + yaml.safeDump(frontMatter) + "---\n" + String(item.content) + "\n").replace(/[\n\r]/g, "\n");
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

async function createPostFrom(item) {
    const date = moment.utc(item.date);
    const fileName = date.format("YYYY-MM-DD") + "-" + creteSafeSlug(item) + ".md";
    const fileContent = createPost(item);
    // sync
    const consumerModule = await import("./consumer.json", { assert: { type: "json" } });
    const consumer = consumerModule.default;
    const korefile = createKoreFile({
        adaptor: createGitHubAdaptor({
            ref: consumer.github.ref,
            owner: consumer.github.owner,
            repo: consumer.github.repo,
            token: consumer.github.token
        })
    });
    const postPath = path.join("_posts", date.format("YYYY"), fileName);
    await korefile.writeFile(postPath, fileContent);
}
