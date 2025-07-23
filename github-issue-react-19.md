# Issue: React 19へのアップグレード計画

## 背景

現在のPostemはReact 15を使用していますが、最新のReact 19へのアップグレードが必要です。
[PR #21](https://github.com/azu/postem/pull/21)で直接アップグレードを試みた結果、以下の非互換性が判明しました：

- `react-codemirror@0.3.0` (React 16未満対応)
- `react-select@0.9.1` (React 15対応)

これらの古いコンポーネントがReact 18/19と互換性がないため、段階的なアプローチが必要です。

## 目標

1. 古いReactコンポーネントを現代的な代替品に置き換える
2. React 19へ段階的にアップグレードする
3. 既存機能をすべて維持する
4. TypeScriptへの将来的な移行を考慮した実装

## タスク

### フェーズ1: コンポーネント現代化 🔧

#### react-codemirror置き換え
- [ ] 代替ライブラリの選定（[@uiw/react-codemirror](https://www.npmjs.com/package/@uiw/react-codemirror) を検討）
- [ ] Editorコンポーネントの書き換え
- [ ] textlint統合の再実装（重要）
- [ ] コードエディタのテスト作成

#### react-select更新  
- [ ] react-select v5.xへのアップグレード
- [ ] TagSelectコンポーネントのAPI更新
- [ ] multi/allowCreate属性の移行
- [ ] スタイリングの調整

### フェーズ2: React段階的アップグレード ⬆️

#### Step 1: React 16.8
- [ ] React/React-DOM 16.8へアップグレード
- [ ] 非推奨ライフサイクルメソッドの置き換え
- [ ] String refsからcreateRefへの移行

#### Step 2: React 18
- [ ] React/React-DOM 18へアップグレード
- [ ] render → createRootへの移行
- [ ] StrictModeでの動作確認

#### Step 3: React 19
- [ ] React/React-DOM 19へ最終アップグレード
- [ ] 新機能の活用検討
- [ ] パフォーマンステスト

### フェーズ3: テストと品質保証 ✅

- [ ] 全統合テストの通過確認
- [ ] 手動テストシナリオの実施
- [ ] パフォーマンス計測
- [ ] ブラウザ互換性確認

## 技術的詳細

### 主な変更点

1. **レンダリングAPI**
```javascript
// Before (React 15)
render(<App />, document.getElementById('root'));

// After (React 18+)
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

2. **Refs API**
```javascript
// Before
<Select ref="select" />

// After  
this.selectRef = React.createRef();
<Select ref={this.selectRef} />
```

3. **react-select API変更**
```javascript
// Before (v0.9.1)
<Select multi={true} allowCreate={true} />

// After (v5.x)
<Select isMulti={true} isCreatable={true} />
```

## リスクと対策

### リスク
- **機能の後方互換性**: 新しいライブラリで既存機能が再現できない可能性
- **スタイリングの変更**: UIの見た目が変わる可能性  
- **textlint統合**: CodeMirror 6での再実装が必要

### 対策
- 各フェーズでの十分なテスト
- Feature flagによる段階的ロールアウト（必要に応じて）
- 詳細なテストシナリオの作成

## 成功基準

- [ ] すべての既存機能が動作すること
- [ ] 全9個の統合テストが通過すること
- [ ] ビルドサイズが大幅に増加しないこと
- [ ] エディタのtextlint機能が正常に動作すること

## 見積もり

- フェーズ1: 2-3週間
- フェーズ2: 1-2週間  
- フェーズ3: 1週間
- **合計: 4-6週間**

## 参考リンク

- [React 18 Migration Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 19 RC](https://react.dev/blog/2024/04/25/react-19)
- [CodeMirror 6 Migration](https://codemirror.net/docs/migration/)
- [react-select v5 Upgrade Guide](https://react-select.com/upgrade)

---

**Labels**: `enhancement`, `dependencies`, `react`, `high-priority`  
**Milestone**: Modernization Phase 2