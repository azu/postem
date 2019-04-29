import prompt from "../config-dialog/prompt";
import storage from "../../node/storage/accounts";
exports.canAccess = function() {
    return storage.has("ecmascript-daily-dir");
};
/*
Electron bug?
Return Promise then hand the previous window
so, handing callback as async way

I think that this limitation is caused by ipc.
 */
exports.requireAccess = function(callback) {
    const options = {
        title: "ecmascript-daily Config",
        message: "ecmascript-dailyリポジトリのあるディレクトリを指定して下さい",
        placeholder: "/path/to/ecmascript-daily.github.com/"
    };
    prompt(options, function(res) {
        var filePath = res.trim();
        if (filePath.length > 0) {
            storage.set("ecmascript-daily-dir", filePath);
            callback(null, res);
        } else {
            callback(new Error("input file path is undefined"));
        }
    });
};
