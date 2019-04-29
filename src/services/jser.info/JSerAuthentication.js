import prompt from "../config-dialog/prompt";
import storage from "../../node/storage/accounts";
exports.canAccess = function() {
    return storage.has("jser.info-dir");
};
/*
Electron bug?
Return Promise then hand the previous window
so, handing callback as async way

I think that this limitation is caused by ipc.
 */
exports.requireAccess = function(callback) {
    const options = {
        title: "JSer.info Config",
        message: "JSer.infoリポジトリのあるディレクトリを指定して下さい",
        placeholder: "/path/to/jser.info/"
    };
    prompt(options, function(res) {
        var filePath = res.trim();
        if (filePath.length > 0) {
            storage.set("jser.info-dir", filePath);
            callback(null, res);
        } else {
            callback(new Error("input file path is undefined"));
        }
    });
};
