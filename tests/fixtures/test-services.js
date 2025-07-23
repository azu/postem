const path = require("path");

// テスト用のサービス設定
module.exports = [
    {
        enabled: true,
        name: "Debug Model",
        indexPath: path.join(__dirname, "../../src/services/debug/index.js")
    }
];
