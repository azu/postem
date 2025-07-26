# Postem 近代化計画

## 現状分析

### 技術スタック
- **Electron**: 24.1.2（比較的新しい）
- **React**: 15.6.1（2017年頃、非常に古い）
- **Babel**: 7.22.5（比較的新しい）
- **ビルドツール**: Gulp（Parcelは削除）
- **CSS**: Plain CSS（Sassは削除済み）
- **パッケージマネージャー**: npm

### 主な問題点
1. **テストが存在しない**
   - テストフレームワークが導入されていない
   - テストファイルが一切ない

2. **依存関係が古い**
   - React 15.6.1（現在は18.x）
   - node-fetch 1.7.1（非常に古い）
   - request 2.81.0（非推奨）
   - react-codemirror 0.3.0
   - react-select 0.9.1
   - moment 2.18.1（メンテナンスモード）

3. **セキュリティリスク**
   - 古い依存関係による潜在的な脆弱性
   - 非推奨ライブラリの使用

4. **開発体験の問題**
   - TypeScriptが使われていない
   - 型安全性がない

## 近代化計画

### フェーズ1: テスト基盤の構築（優先度: 高）

#### 1.1 テストフレームワークの導入 ✅
- ✅ **Vitest**の導入（単体テスト用）
- ✅ **Playwright for Electron**の導入（統合テスト用）
- ✅ テスト用サービス設定の追加
- ✅ GitHub ActionsでのCI環境設定

#### 1.2 Electronアプリのテスト戦略 ✅
- ✅ **Playwright for Electron**による統合テスト
  - ✅ アプリの起動・終了
  - ✅ ウィンドウの表示確認
  - ✅ 基本的な投稿フローのE2Eテスト（DEBUGサービス使用）
  - ✅ URLスキームからの起動テスト
- ✅ **単体テスト**
  - ✅ サンプルテストの実装
  - ⏳ 各サービスのClientクラステスト（今後追加）
  - ⏳ ストア・アクションのテスト（今後追加）
  - ⏳ ユーティリティ関数のテスト（今後追加）

#### 1.3 CI/CDの設定 ✅
- ✅ GitHub Actionsでテスト自動実行
  - ✅ Linux環境でのヘッドレステスト
  - ✅ Xvfb（仮想フレームバッファ）を使用
- ✅ プルリクエストでの自動テスト実行
- ✅ Node.js 22とnpmキャッシュの活用

### フェーズ2: 段階的な依存関係の更新（優先度: 高）

#### 2.1 非推奨・セキュリティリスクのあるパッケージの更新
- `request` + `node-fetch` v1 → ネイティブ`fetch`（Node.js 22で利用可能）
- `moment` → `date-fns` または `dayjs`

#### 2.2 React関連の更新（大規模変更）
- React 15 → 19への段階的アップグレード  
  - まずReact 16へ（互換性の確認）
  - その後React 18へ
  - 最終的にReact 19へ
- react-codemirror → @uiw/react-codemirror
- react-select → react-select v5

#### 2.3 その他の依存関係の更新
- textlint関連パッケージの最新版へ
- OAuth関連ライブラリの更新

### フェーズ3: 機能改善とリファクタリング（優先度: 中）

#### 3.1 TypeScriptの導入
- 段階的な型定義の追加
- JSDocコメントから始める
- 徐々に.tsファイルへ移行

#### 3.2 コンポーネントの近代化
- クラスコンポーネント → 関数コンポーネント + Hooks
- material-flux → Redux ToolkitまたはZustand

#### 3.3 ビルドプロセスの改善
- Gulpタスクの見直し
- ビルドパフォーマンスの最適化

### フェーズ4: 新機能とUX改善（優先度: 低）

#### 4.1 UIの改善
- デザインシステムの導入検討
- アクセシビリティの向上
- ダークモード対応

#### 4.2 新サービスの追加
- Mastodon対応
- その他のSNSサービス

## 実装順序の推奨

1. **テストフレームワークの導入**（1週間）
   - 最重要。これがないと安全に更新できない

2. **危険な依存関係の更新**（1週間）
   - request、古いnode-fetchなど

3. **基本的なテストの作成**（2週間）
   - 主要機能のテストカバレッジ確保

4. **React段階的アップグレード**（3-4週間）
   - 最も時間がかかる作業

5. **TypeScript導入**（継続的）
   - 新規ファイルから段階的に

## リスク管理

- **破壊的変更のリスク**: テストを先に整備することで軽減
- **Electron互換性**: Electronのバージョンも考慮しながら更新
- **サービスAPI変更**: 各サービスのAPI仕様変更に注意

## 成功指標

- テストカバレッジ: 30-40%（主要機能の統合テストを重視）
- 依存関係: すべて最新の安定版
- TypeScript: 主要ファイルの50%以上
- ビルド時間: 現在の50%以下
- セキュリティ脆弱性: 0件

## Electronテストの具体例

### Playwright統合テストのサンプル
```javascript
// tests/integration/app.spec.js
const { _electron: electron } = require('playwright');

test('アプリケーションが正常に起動する', async () => {
  const app = await electron.launch({ args: ['index.js'] });
  const window = await app.firstWindow();
  
  // タイトルの確認
  const title = await window.title();
  expect(title).toBe('Postem');
  
  // 基本的なUI要素の存在確認
  await window.waitForSelector('.service-list');
  await window.waitForSelector('.title-input');
  await window.waitForSelector('.url-input');
  
  await app.close();
});

test('URLスキームから起動できる', async () => {
  const app = await electron.launch({
    args: ['index.js', '--url=https://example.com', '--title=Test']
  });
  const window = await app.firstWindow();
  
  // 入力値が反映されているか確認
  const urlInput = await window.$('.url-input input');
  const urlValue = await urlInput.inputValue();
  expect(urlValue).toBe('https://example.com');
  
  await app.close();
});
```

### GitHub Actions設定例
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
      with:
        version: 10.14.0
    
    - uses: actions/setup-node@v3
      with:
        node-version: '22'
        cache: 'npm'
    
    # Xvfbのセットアップ（Electron用）
    - name: Setup Xvfb
      run: |
        sudo apt-get update
        sudo apt-get install -y xvfb
    
    - name: Install dependencies
      run: npm install
    
    - name: Run unit tests
      run: npm run test:unit  # Vitest実行
    
    - name: Run integration tests
      run: xvfb-run -a npm run test:integration
```