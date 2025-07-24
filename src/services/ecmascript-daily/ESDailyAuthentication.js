import * as fs from "node:fs";
import path from "node:path";

exports.canAccess = function () {
    return fs.existsSync(path.join(__dirname, "consumer.json"));
};
/*
Electron bug?
Return Promise then hand the previous window
so, handing callback as async way

I think that this limitation is caused by ipc.
 */
exports.requireAccess = function (callback) {
    console.error("consumer.jsonを設定してください");
    callback(new Error("consumer.json is required"));
};
