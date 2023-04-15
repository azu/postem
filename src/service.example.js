const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js"),
        options: {
            // Consumer Keys
            appKey: "app key",
            appSecret: "app secret",
            // Authentication Tokens(Access Token and Secret).
            // Warning: Not Bearer Token
            // Post Tweets that requires access token and secret
            accessToken: "access token",
            accessSecret: "access token secret"
        }
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
