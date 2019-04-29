# Postem [![Build Status](https://travis-ci.org/azu/postem.svg?branch=master)](https://travis-ci.org/azu/postem)

[Tombloo](https://github.com/to/tombloo)とか[Tombfix](https://github.com/tombfix/core)のようなクロスポストクライアントアプリ。

:memo: Note: このアプリは個人的な用途で作成されているため、バイナリが配布されていません。
そのため、手元のElectron環境で動かす前提の作りになっています。(それを修正するPRは歓迎です)

## Feature

- Twitter、はてなブックマークとかへのクロスポスト
- [textlint](https://github.com/textlint/textlint "textlint")でのリアルタイムLint

![screenshot](https://monosnap.com/file/9WtShAGiCilmCOLtuGEWnfphfpKndf.png)

## Installation

アプリに必要な必要を[Yarn](https://yarnpkg.com/)でインストールします。

    yarn install
    
アプリを起動する前に利用するサービスの設定を`service.js`で定義してください。

### 利用するサービスの設定

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

    yarn start
    
Production mode:

    npm run build
    ./bin/cmd.js
    # production

### Command Line引数

次の引数を付けて起動すると初期値が入った状態で起動できます。

- `--title`: set default title
- `--url`:   set default url

### URL scheme

次のURL schemeが自動的に登録されます。

```
postem://
```

今見ているサイトについて投稿する場合は、次のJavaScriptを実行するとアプリが起動できます。

```
location.href = `postem://?url=${encodeURIComponent(window.top.location.href)}&title=${encodeURIComponent(window.top.document.title)}`
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
