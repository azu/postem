// LICENSE : MIT
"use strict";
import React, { useEffect, useRef, useCallback } from "react";

export default function ClaudeCodeButton({
    url,
    claudeCode,
    runClaudeCode,
    insertResult,
    clearResult,
    claudeCodeConfig
}) {
    const prevUrlRef = useRef(url);
    const debounceTimerRef = useRef(null);

    // URLが変更されたら自動でClaude Codeを実行（デバウンス付き）
    useEffect(() => {
        if (!claudeCodeConfig?.enabled) {
            return;
        }

        // URLが変更され、有効なURLの場合のみ実行
        if (url && url !== prevUrlRef.current && url.startsWith("http")) {
            // 前回のタイマーをクリア
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // 1秒後に実行（入力中の連続変更を避ける）
            debounceTimerRef.current = setTimeout(() => {
                runClaudeCode(url, claudeCodeConfig);
            }, 1000);
        }

        prevUrlRef.current = url;

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [url, claudeCodeConfig, runClaudeCode]);

    const handleClick = useCallback(() => {
        if (claudeCode.status === "complete") {
            // 結果がある場合は挿入
            insertResult();
        } else if (claudeCode.status === "idle" || claudeCode.status === "error") {
            // アイドルまたはエラー状態の場合は実行
            if (url && url.startsWith("http")) {
                runClaudeCode(url, claudeCodeConfig);
            }
        }
    }, [claudeCode.status, url, claudeCodeConfig, runClaudeCode, insertResult]);

    // 設定が無効またはCLIが設定されていない場合は表示しない
    if (!claudeCodeConfig?.enabled) {
        return null;
    }

    // 生成中はPreviewで表示されるのでボタンは非表示
    if (claudeCode.status === "loading") {
        return null;
    }

    // Claudeアイコン（シンプル版）
    const ClaudeIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.709 15.955l4.72-2.647.08-.08-.08-.2-2.08-3.2a.89.89 0 00-.72-.4h-.08a.94.94 0 00-.64.32l-2.96 4.16a1 1 0 00-.08.96.78.78 0 00.72.48h.56a.87.87 0 00.56-.24zm6.88-8.08l-1.68 6.96-.08.24.24.08 7.12 1.76h.16a.71.71 0 00.56-.32l1.52-2.72a.94.94 0 00-.24-1.12l-6.64-5.04a.7.7 0 00-.48-.16.62.62 0 00-.48.32z" />
        </svg>
    );

    const getButtonContent = () => {
        switch (claudeCode.status) {
            case "complete":
                return (
                    <span className="ClaudeCodeButton-complete" title={claudeCode.result}>
                        <ClaudeIcon /> ✓
                    </span>
                );
            case "error":
                return (
                    <span className="ClaudeCodeButton-error" title={claudeCode.error}>
                        <ClaudeIcon /> !
                    </span>
                );
            default:
                return <ClaudeIcon />;
        }
    };

    return (
        <button
            type="button"
            className={`ClaudeCodeButton ClaudeCodeButton--${claudeCode.status}`}
            onClick={handleClick}
            disabled={claudeCode.status === "loading"}
            title={
                claudeCode.status === "complete"
                    ? "Cmd+Shift+J で挿入"
                    : claudeCode.status === "loading"
                    ? "実行中..."
                    : "Claude Codeで説明文を生成"
            }
        >
            {getButtonContent()}
        </button>
    );
}
