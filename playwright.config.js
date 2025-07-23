import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/integration",
    timeout: 30000,
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Electronアプリは1つずつ実行
    reporter: "list",
    use: {
        trace: "on-first-retry",
        // デフォルトのタイムアウト設定
        actionTimeout: 10000,
        navigationTimeout: 30000
    },
    expect: {
        // expectのデフォルトタイムアウト
        timeout: 10000
    },
    projects: [
        {
            name: "electron",
            testMatch: "**/*.play.js"
        }
    ]
});
