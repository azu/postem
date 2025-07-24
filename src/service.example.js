import path from "node:path";
export default [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js"),
        options: {
            // 0. Visit https://developer.twitter.com/en/portal/dashboard
            // 1. Create App(development App) with read and write permission
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
            // Optional: Control who can reply to your tweets
            // - "following": Only accounts the author follows can reply
            // - "mentionedUsers": Only accounts mentioned in the Tweet can reply
            // - Default (omitted): Everyone can reply
            // reply_settings: "following"
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
