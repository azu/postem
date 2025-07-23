const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");
const path = require("path");

test.describe("Postem Application", () => {
    let app;
    let window;

    test.beforeEach(async () => {
        // Electronアプリを起動
        app = await electron.launch({
            args: [path.join(__dirname, "../../index.js")],
            // テスト用サービス設定を使用（development環境でsrcディレクトリを使用）
            env: { ...process.env, NODE_ENV: "development", PLAYWRIGHT_TEST: "1" }
        });

        // メインウィンドウを取得
        window = await app.firstWindow();
    });

    test.afterEach(async () => {
        if (app) {
            await app.close();
        }
    });

    test("アプリケーションが正常に起動する", async () => {
        // ウィンドウが存在することを確認
        expect(window).toBeTruthy();

        // ウィンドウが読み込まれるまで待機
        await window.waitForLoadState("domcontentloaded");

        // メインコンテナが存在することを確認
        const mainDiv = window.locator("#js-main");
        await expect(mainDiv).toBeVisible();
    });

    test("基本的なUI要素が表示される", async () => {
        // 基本的なUI要素の存在確認
        await window.waitForLoadState("domcontentloaded");

        // サービスリストが表示されることを確認（正しいクラス名）
        const serviceList = window.locator(".ServiceList");
        await expect(serviceList).toBeVisible();

        // 入力フィールドが存在することを確認
        const titleInput = window.locator("input");
        await expect(titleInput.first()).toBeVisible();
    });

    test("DEBUGサービスを使った投稿テスト", async () => {
        await window.waitForLoadState("domcontentloaded");

        // ServiceListが表示されるまで待機
        await expect(window.locator(".ServiceList")).toBeVisible();

        // 利用可能なサービス（最初のサービス）をクリック
        const firstService = window.locator(".ServiceList img").first();
        await expect(firstService).toBeVisible();
        await firstService.click();

        // タイトル入力（最初の入力フィールド）
        const titleInput = window.locator("input").first();
        await titleInput.fill("テスト投稿");

        // URL入力（2番目の入力フィールド）
        const inputs = window.locator("input");
        const urlInput = inputs.nth(1);
        await urlInput.fill("https://example.com");

        // 投稿ボタンをクリック（任意のボタン要素）
        const submitButton = window.locator('button, input[type="submit"], .SubmitButton');
        await expect(submitButton.first()).toBeVisible();
        await submitButton.first().click();
    });

    test("URLパラメーターからの起動テスト", async () => {
        // アプリを一度閉じる
        await app.close();

        // URLパラメーター付きで再起動
        app = await electron.launch({
            args: [path.join(__dirname, "../../index.js"), "--url=https://example.com", "--title=Test Title"],
            env: { ...process.env, NODE_ENV: "development", PLAYWRIGHT_TEST: "1" }
        });

        window = await app.firstWindow();
        await window.waitForLoadState("domcontentloaded");

        // パラメーターが正しく反映されているかチェック
        // URLフィールドの値を確認
        const urlInput = window.locator('input[value*="example.com"]');
        await expect(urlInput).toBeVisible();
    });
});
