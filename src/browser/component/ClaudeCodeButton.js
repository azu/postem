// LICENSE : MIT
"use strict";
import React, { useEffect, useRef, useCallback } from "react";

export default function ClaudeCodeButton({
    url,
    title,
    claudeCode,
    runClaudeCode,
    insertResult,
    clearResult,
    claudeCodeConfig,
    relatedItems = [],
    availableTags = []
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
                runClaudeCode(url, title, claudeCodeConfig, relatedItems, availableTags);
            }, 1000);
        }

        prevUrlRef.current = url;

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [url, title, claudeCodeConfig, runClaudeCode, relatedItems, availableTags]);

    const handleClick = useCallback(() => {
        if (claudeCode.status === "complete") {
            // 結果がある場合は挿入
            insertResult();
        } else if (claudeCode.status === "idle" || claudeCode.status === "error") {
            // アイドルまたはエラー状態の場合は実行
            if (url && url.startsWith("http")) {
                runClaudeCode(url, title, claudeCodeConfig, relatedItems, availableTags);
            }
        }
    }, [claudeCode.status, url, title, claudeCodeConfig, runClaudeCode, insertResult, relatedItems, availableTags]);

    // 設定が無効またはCLIが設定されていない場合は表示しない
    if (!claudeCodeConfig?.enabled) {
        return null;
    }

    const getButtonContent = () => {
        switch (claudeCode.status) {
            case "loading":
                return (
                    <span className="ClaudeCodeButton-loading">
                        <span className="ClaudeCodeButton-spinner"></span>
                        AI
                    </span>
                );
            case "complete":
                return (
                    <span className="ClaudeCodeButton-complete" title={claudeCode.comment}>
                        AI ✓
                    </span>
                );
            case "error":
                return (
                    <span className="ClaudeCodeButton-error" title={claudeCode.error}>
                        AI !
                    </span>
                );
            default:
                return <span>AI</span>;
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
