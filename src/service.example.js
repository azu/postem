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

// AI説明文生成を有効化する場合は、service.jsで aiConfig を追加します。
// module.exports.aiConfig = {
//     enabled: true,
//     type: "codex",
//     cliPath: process.env.CODEX_CLI_PATH || `${process.env.HOME}/.local/bin/codex`,
//     workDir: process.env.CODEX_WORK_DIR || process.cwd(),
//     profile: "postem",
//     model: "gpt-5.4",
//     outputSchema: true,
//     timeoutMs: 120000,
//     logEvents: true,
//     mcpServers: {
//         "example-http": {
//             url: "https://example.com/mcp",
//             required: true,
//             default_tools_approval_mode: "approve",
//             enabled_tools: ["example_tool"]
//         }
//     },
//     config: {
//         model_reasoning_effort: "medium",
//         model_verbosity: "low",
//         default_permissions: "postem-no-files",
//         "permissions.postem-no-files": {
//             filesystem: {
//                 "/": "deny",
//                 ":workspace_roots": {
//                     ".": "deny"
//                 }
//             }
//         },
//         "features.shell_tool": false
//     },
//     prompt: ({ url, title }) => `以下のURLの内容を要約してください。\n\nURL: ${url}\nTitle: ${title}`
// };
