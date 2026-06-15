const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js"),
        // X (Twitter) はAPI投稿ではなく、Web Intentでブラウザを開いて投稿する方式
        // ブラウザのログイン状態をそのまま利用するため、認証情報は不要
        options: {}
    },
    {
        enabled: true,
        isDefaultChecked: true,
        name: "hatebu",
        indexPath: path.join(__dirname, "services/hatebu/index.js")
    },
    // Last service is special
    // Assign shortcut as Cmd + 0
    {
        enabled: process.env.NODE_ENV === "development",
        name: "debug",
        indexPath: path.join(__dirname, "services/debug/index.js")
    }
];
