const { test: baseTest, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");
const path = require("path");

// Electron起動オプションを生成する関数
function createElectronLaunchOptions(additionalArgs = []) {
    // CI環境でのみヘッドレスモードを使用
    const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

    const baseArgs = [
        path.join(__dirname, "../../index.js"),
        ...additionalArgs,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection"
    ];

    // CI環境でのみヘッドレスフラグを追加
    const args = isCI ? [...baseArgs, "--headless"] : baseArgs;

    // CI環境でのみX server関連の環境変数を設定
    const baseEnv = {
        ...process.env,
        NODE_ENV: "development",
        PLAYWRIGHT_TEST: "1"
    };

    const env = isCI
        ? {
              ...baseEnv,
              DISPLAY: ":99",
              DBUS_SESSION_BUS_ADDRESS: "/dev/null",
              XDG_RUNTIME_DIR: "/tmp"
          }
        : baseEnv;

    return { args, env, timeout: 30000 };
}

// Test contextを使用してElectronアプリケーションとウィンドウを管理
const test = baseTest.extend({
    app: async ({}, use) => {
        // 各テストで独立したElectronアプリケーションを起動
        const launchOptions = createElectronLaunchOptions();
        const app = await electron.launch(launchOptions);

        // テストにappを提供
        await use(app);

        // テスト完了後にクリーンアップ
        await app.close();
    },

    window: async ({ app }, use) => {
        // メインウィンドウを取得
        const window = await app.firstWindow();
        await use(window);
    }
});

test.describe("Postem Application", () => {
    test("アプリケーションが正常に起動する", async ({ window }) => {
        // ウィンドウが存在することを確認
        expect(window).toBeTruthy();

        // ウィンドウが読み込まれるまで待機
        await window.waitForLoadState("domcontentloaded");

        // メインコンテナが存在することを確認
        const mainDiv = window.locator("#js-main");
        await expect(mainDiv).toBeVisible();
    });

    test("基本的なUI要素が表示される", async ({ window }) => {
        // 基本的なUI要素の存在確認
        await window.waitForLoadState("domcontentloaded");

        // サービスリストが表示されることを確認（正しいクラス名）
        const serviceList = window.locator(".ServiceList");
        await expect(serviceList).toBeVisible();

        // 入力フィールドが存在することを確認
        const titleInput = window.locator("input");
        await expect(titleInput.first()).toBeVisible();
    });

    test("DEBUGサービスを使った投稿テスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // ServiceListが表示されるまで待機
        await expect(window.locator(".ServiceList")).toBeVisible();

        // DEBUGサービスをクリック
        const debugService = window.locator(".ServiceList img").first();
        await expect(debugService).toBeVisible();
        await debugService.click();
        await window.waitForTimeout(500); // 状態変化を待つ

        // フォーム入力を行う
        await window.locator("input").first().fill("統合テスト投稿タイトル");
        await window.locator("input").nth(1).fill("https://integration-test.example.com");

        // 投稿ボタンをクリック
        const submitButton = window.locator('button, input[type="submit"], .SubmitButton').first();
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // 投稿完了を待つ
        await window.waitForTimeout(1000);

        // 基本的な動作確認
        expect(await window.locator(".ServiceList img").count()).toBeGreaterThan(0);
    });

    test("サービス選択のUI状態変化テスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // 初期状態：サービスが未選択
        const serviceList = window.locator(".ServiceList");
        await expect(serviceList).toBeVisible();

        // DEBUGサービスをクリック
        const debugService = serviceList.locator("img").first();
        await debugService.click();
        await window.waitForTimeout(300);

        // 選択後の状態を確認
        // サービスが選択されているかの視覚的確認（例：アクティブクラスなど）
        const selectedService = debugService;
        await expect(selectedService).toBeVisible();

        // 入力フィールドが利用可能になっていることを確認
        const titleInput = window.locator("input").first();
        await expect(titleInput).toBeVisible();
        await expect(titleInput).toBeEnabled();
    });

    test("フォーム入力の検証テスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // DEBUGサービスを選択
        await window.locator(".ServiceList img").first().click();
        await window.waitForTimeout(300);

        // 各入力フィールドをテスト
        const titleInput = window.locator("input").first();
        const urlInput = window.locator("input").nth(1);

        // タイトル入力テスト
        await expect(titleInput).toBeVisible();
        await titleInput.fill("テストタイトル");
        await expect(titleInput).toHaveValue("テストタイトル");

        // URL入力テスト
        await expect(urlInput).toBeVisible();
        await urlInput.fill("https://test.example.com");
        await expect(urlInput).toHaveValue("https://test.example.com");

        // 入力フィールドのクリア
        await titleInput.clear();
        await expect(titleInput).toHaveValue("");

        // 再入力
        await titleInput.fill("新しいタイトル");
        await expect(titleInput).toHaveValue("新しいタイトル");
    });

    test("エラーハンドリングテスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // DEBUGサービスを選択
        await window.locator(".ServiceList img").first().click();
        await window.waitForTimeout(300);

        // 空のフォームで投稿を試行（エラーケース）
        const submitButton = window.locator('button, input[type="submit"], .SubmitButton').first();

        // タイトルを空のままで投稿
        await window.locator("input").first().fill("");
        await window.locator("input").nth(1).fill("https://test.example.com");

        // 投稿ボタンがクリック可能かを確認
        await expect(submitButton).toBeVisible();

        // 実際の投稿は行わず、UIの状態を確認
        // (エラー表示などがあればここで確認)
        const titleInput = window.locator("input").first();
        await expect(titleInput).toBeVisible();
        await expect(titleInput).toHaveValue("");
    });

    test("キーボードショートカットテスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // DEBUGサービスを選択
        await window.locator(".ServiceList img").first().click();
        await window.waitForTimeout(300);

        const titleInput = window.locator("input").first();

        // タイトル入力フィールドにフォーカス
        await titleInput.click();

        // キーボード入力のテスト
        await titleInput.press("Control+a"); // 全選択
        await titleInput.type("キーボードテスト");
        await expect(titleInput).toHaveValue("キーボードテスト");

        // Tabキーでフィールド移動
        await titleInput.press("Tab");

        // URL入力フィールドがフォーカスされることを確認
        const urlInput = window.locator("input").nth(1);
        await expect(urlInput).toBeFocused();

        // URL入力
        await urlInput.type("https://keyboard-test.example.com");
        await expect(urlInput).toHaveValue("https://keyboard-test.example.com");
    });

    test("ウィンドウリサイズ対応テスト", async ({ window }) => {
        await window.waitForLoadState("domcontentloaded");

        // 初期サイズでの要素確認
        await expect(window.locator(".ServiceList")).toBeVisible();
        await expect(window.locator("input").first()).toBeVisible();

        // ウィンドウサイズを変更
        await window.setViewportSize({ width: 800, height: 600 });
        await window.waitForTimeout(300);

        // リサイズ後も要素が表示されることを確認
        await expect(window.locator(".ServiceList")).toBeVisible();
        await expect(window.locator("input").first()).toBeVisible();

        // より小さいサイズ
        await window.setViewportSize({ width: 600, height: 400 });
        await window.waitForTimeout(300);

        // 小さいサイズでも基本機能が動作することを確認
        await expect(window.locator(".ServiceList")).toBeVisible();
        const debugService = window.locator(".ServiceList img").first();
        await debugService.click();

        const titleInput = window.locator("input").first();
        await expect(titleInput).toBeVisible();
        await titleInput.fill("リサイズテスト");
        await expect(titleInput).toHaveValue("リサイズテスト");
    });

    // URLパラメーター付きアプリケーション用のtest contextを定義
    const testWithUrlParams = baseTest.extend({
        appWithUrlParams: async ({}, use) => {
            // URLパラメーター付きでElectronアプリケーションを起動
            const launchOptions = createElectronLaunchOptions(["--url=https://example.com", "--title=Test Title"]);
            const app = await electron.launch(launchOptions);

            await use(app);
            await app.close();
        },

        windowWithUrlParams: async ({ appWithUrlParams }, use) => {
            const window = await appWithUrlParams.firstWindow();
            await use(window);
        }
    });

    testWithUrlParams("URLパラメーターからの起動テスト", async ({ windowWithUrlParams }) => {
        await windowWithUrlParams.waitForLoadState("domcontentloaded");

        // パラメーターが正しく反映されているかチェック
        // URLフィールドの値を確認
        const urlInput = windowWithUrlParams.locator('input[value*="example.com"]');
        await expect(urlInput).toBeVisible();
    });
});
