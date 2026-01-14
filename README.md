# Postem

[Tombloo](https://github.com/to/tombloo)とか[Tombfix](https://github.com/tombfix/core)のようなクロスポストクライアントアプリ。

:memo: Note: このアプリは`service.js`でプラグインとして拡張可能な設計になっており、各サービスのAPIキーやカスタムロジックの実装が必要なため、バイナリ配布は行っていません。
利用する場合は、手元でソースコードをクローンし、必要なサービスプラグインを実装してから実行してください。

## Features

- Twitter、はてなブックマークなどへのクロスポスト
- はてなブックマークを使ったタグ補完
- 独自に対応サービスを追加可能
- 入力欄は[textlint](https://github.com/textlint/textlint "textlint")でのリアルタイムLint
- URLスキームを使ってブラウザから起動できる
- Claude Code連携によるAI説明文生成

<img width="448" alt="image" src="https://github.com/azu/postem/assets/19714/deb060a9-57ad-4bdc-a012-40ab2bb27581">

## Installation

アプリに必要な依存をnpmでインストールします。

    npm install
    
アプリを起動する前に利用するサービスの設定を`service.js`で定義してください。

## サポートしているサービス

利用するサービスは後述する`service.js`に定義します。
postemリポジトリに実装があるビルトインサポートしているサービスは次の通りです。

- [はてなブックマーク](./src/services/hatebu)
- [Twitter](./src/services/twitter)
- [Slack](./src/services/slack)
- [asocial-bookmark](./src/services/asocial-bookmark)
- [Bluesky](./src/services/bluesky)
- [debug](./src/services/debug)

## 利用するサービスの設定

クロスポストできるサービスの一覧を`service.js`で定義します。

- [src/service.example.js](./src/service.example.js)を`service.js`にリネームして設定

```shell
cp src/service.example.js src/service.js
```

デフォルトでは次のサービスが有効になっています。

- Twitter
- はてなブックマーク
- デバッグ(Development modeのみ有効)

また、[src/services](./src/services)を参考にして独自のサービスを追加できます。

## Usage: 起動方法

Development mode:

    npm start
    
Production mode:　`dist/`ディレクトリにバイナリが出力されます。

    npm run dist
    # dist/ にアプリができる

Browser mode: [asocial-bookmark](https://github.com/azu/asocial-bookmark)形式のリポジトリに対応しています。

- `https://postem.netlify.com/?title={TITLE}&url={URL}&github.owner={Owner名}&github.repo={リポジトリ名}&github.ref={refsheads%2Fブランチ名}&github.indexPropertyName={プロパティ名}&github.token={GitHub_Token}`

### 使い方: 投稿

1. 投稿するサービスの選択(アイコンをクリック or ショートカット)
2. タグや説明欄を入力
3. "Submit"で送信(<kbd>Cmd+Enter</kbd>)

### 使い方: ショートカット

表示されているアイコンの左から順番に<kbd>Cmd+数字</kbd>のショートカットが振られています。

- <kbd>Cmd+1</kbd>: Twitter
- <kbd>Cmd+2</kbd>: はてなブックマーク

最後のアイコンだけは<kbd>Cmd+0</kbd>が振られています。


### 使い方: コマンドライン引数

次の引数を付けて起動すると初期値が入った状態で起動できます。

- `--title`: set default title
- `--url`:   set default url

```
./bin/cmd.js --title "タイトル" --url "https://example.com"
```

### 使い方: URL scheme(production)

URL schemeはproduction modeで作成したバイナリを一度起動しておく必要があります。
起動すると、次のURL schemeが自動的に登録されます。

```
postem://
```

今見ているサイトについて投稿する場合は、次のJavaScriptを実行するとアプリが起動できます。

```
location.href = `postem://?url=${encodeURIComponent(window.top.location.href)}&title=${encodeURIComponent(window.top.document.title)}`
```

## Claude Code連携

[Claude Code](https://docs.anthropic.com/en/docs/claude-code)を使ってURLから説明文を自動生成できます。

### 設定

`service.js`に`claudeCodeConfig`をexportします。

```javascript
export const claudeCodeConfig = {
    enabled: true,
    cliPath: process.env.CLAUDE_CODE_CLI_PATH || `${process.env.HOME}/.local/bin/claude`,
    workDir: "/path/to/work/dir",
    mcpConfig: {
        mcpServers: {
            // HTTP MCP Server
            "example-http": {
                url: "https://example.com/mcp",
                type: "http"
            },
            // stdio MCP Server
            "example-stdio": {
                type: "stdio",
                command: "npx",
                args: ["some-mcp-server"],
                cwd: "/path/to/cwd",
                env: {}
            }
        }
    },
    // 文字列または関数
    prompt: ({ url, title }) => `以下のURLの内容を要約してください\n\nURL: ${url}\nTitle: ${title}`
};
```

### 設定項目

| 項目 | 説明 |
|------|------|
| `enabled` | 機能の有効/無効 |
| `cliPath` | Claude Code CLIのパス |
| `workDir` | 作業ディレクトリ（MCPサーバーの実行に影響） |
| `mcpConfig` | MCPサーバー設定（オプション） |
| `prompt` | Claude Codeに渡すプロンプト（文字列または`({ url, title }) => string`形式の関数） |

### 使い方

1. URLを入力すると自動でClaude Codeが実行されます（1秒のデバウンス付き）
2. 結果はプレビューエリアに表示されます
3. <kbd>Cmd+Shift+J</kbd>またはクリックで結果をコメント欄に挿入します

### 注意事項

- Claude Code CLIが事前にインストール・認証されている必要があります
- `--dangerously-skip-permissions`フラグを使用するため、MCPツールは自動承認されます

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
