# React 19アップグレードのための課題と戦略

## 概要

React 15から React 19への直接アップグレードを試みた結果、以下の技術的課題が判明しました。これらの課題を解決するための段階的なアプローチが必要です。

## 主な課題

### 1. 非互換コンポーネント

#### react-codemirror (現在: v0.3.0)
- **問題**: React 16未満のみサポート
- **影響**: エディターコンポーネント全体
- **代替案**:
  - [@uiw/react-codemirror](https://www.npmjs.com/package/@uiw/react-codemirror) (React 18/19対応)
  - [@codemirror/view](https://www.npmjs.com/package/@codemirror/view) を直接使用

#### react-select (現在: v0.9.1)
- **問題**: React 15のみサポート
- **影響**: タグ選択UI
- **代替案**:
  - react-select v5.x (最新版にアップグレード)
  - [react-select-search](https://www.npmjs.com/package/react-select-search)
  - [downshift](https://www.npmjs.com/package/downshift)

### 2. API変更への対応

#### レンダリングAPI
```javascript
// React 15/16
import { render } from 'react-dom';
render(<App />, document.getElementById('root'));

// React 18/19
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### Refs API
```javascript
// 旧: String refs
<Select ref="select" />

// 新: createRef / useRef
this.selectRef = React.createRef();
<Select ref={this.selectRef} />
```

#### ライフサイクルメソッド
- `componentWillMount` → `componentDidMount` または `constructor`
- `componentWillReceiveProps` → `componentDidUpdate`
- `componentWillUpdate` → `componentDidUpdate`

### 3. 依存関係の連鎖

現在のパッケージツリーで、React 15に依存している可能性のあるパッケージ:
- react-input-autosize (react-selectの依存)
- その他の内部依存関係

## 推奨アップグレード戦略

### フェーズ1: コンポーネントの現代化 (2-3週間)

1. **react-codemirrorの置き換え**
   - 新しいCodeMirrorライブラリの評価
   - 既存機能（textlint統合）の移植
   - テストの作成

2. **react-selectのアップグレード**
   - v5.xへの移行
   - APIの変更に対応
   - マルチセレクト機能の確認

### フェーズ2: React 16への移行 (1週間)

- React 16.8への段階的アップグレード
- 非推奨APIの置き換え
- 動作確認

### フェーズ3: React 18への移行 (1週間)

- React 18への アップグレード
- createRootへの移行
- Concurrent機能の確認（必要に応じて）

### フェーズ4: React 19への最終移行 (1週間)

- React 19へのアップグレード
- 新機能の活用検討
- パフォーマンステスト

## タスク一覧

### 準備作業
- [ ] 現在のコンポーネント使用箇所の詳細調査
- [ ] 代替ライブラリの技術評価
- [ ] 移行計画の詳細化

### react-codemirror置き換え
- [ ] 新しいCodeMirrorライブラリの選定
- [ ] Editorコンポーネントの書き換え
- [ ] textlint統合の再実装
- [ ] ユニットテストの作成
- [ ] 統合テストの更新

### react-select更新
- [ ] react-select v5への移行ガイド確認
- [ ] TagSelectコンポーネントの更新
- [ ] API変更への対応
- [ ] スタイリングの調整
- [ ] テストの更新

### React段階的アップグレード
- [ ] React 16.8へのアップグレード
- [ ] 非推奨API警告の解消
- [ ] React 18へのアップグレード
- [ ] createRoot APIへの移行
- [ ] React 19へのアップグレード
- [ ] 最終動作確認

## リスクと対策

### リスク
1. **機能の後方互換性**: 新しいライブラリで既存機能が再現できない可能性
2. **スタイリングの変更**: UIの見た目が変わる可能性
3. **パフォーマンスへの影響**: 新しいライブラリのパフォーマンス特性が異なる

### 対策
1. **段階的移行**: 一度にすべてを変更せず、コンポーネントごとに移行
2. **十分なテスト**: 各段階でのテスト実施
3. **ロールバック計画**: 問題発生時の切り戻し手順の準備

## 参考リソース

- [React 18 Migration Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 19 RC Announcement](https://react.dev/blog/2024/04/25/react-19)
- [CodeMirror 6 Migration Guide](https://codemirror.net/docs/migration/)
- [react-select v5 Upgrade Guide](https://react-select.com/upgrade)

## Issue作成用テンプレート

```markdown
## React 19アップグレード計画

### 背景

現在のPostemはReact 15を使用していますが、最新のReact 19へのアップグレードが必要です。
直接アップグレードを試みた結果、以下の非互換性が判明しました：

- `react-codemirror@0.3.0` (React 16未満対応)
- `react-select@0.9.1` (React 15対応)

### 目標

1. 古いReactコンポーネントを現代的な代替品に置き換える
2. React 19へ段階的にアップグレードする
3. 既存機能をすべて維持する

### タスク

#### フェーズ1: コンポーネント現代化
- [ ] react-codemirrorを@uiw/react-codemirrorに置き換え
- [ ] react-select v5へアップグレード
- [ ] 関連テストの更新

#### フェーズ2: React段階的アップグレード  
- [ ] React 16.8へアップグレード
- [ ] React 18へアップグレード（createRoot対応）
- [ ] React 19へ最終アップグレード

### 期待される成果

- 最新のReact 19で動作するアプリケーション
- セキュリティ脆弱性の解消
- モダンなReact機能の活用基盤

### 見積もり工数

約4-6週間（段階的実施）
```