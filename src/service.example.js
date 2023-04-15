const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js"),
        options: {
            // 0. Visit https://developer.twitter.com/en/portal/dashboard
            // 1. Create App with read and write permission
            // 2. Generate Consumer Key and Secret
            // 3. Generate Access Token and Secret
            // 4. Fill the following fields
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
