// LICENSE : MIT
"use strict";
import React, { useEffect, useRef, useCallback, useState } from "react";

export default function ClaudeCodeButton({
    url,
    title,
    claudeCode,
    runClaudeCode,
    insertResult,
    clearResult,
    aiConfig,
    relatedItems = [],
    availableTags = []
}) {
    const prevUrlRef = useRef(url);
    const debounceTimerRef = useRef(null);
    const latestRunParamsRef = useRef({
        title,
        aiConfig,
        runClaudeCode,
        relatedItems,
        availableTags
    });
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        latestRunParamsRef.current = {
            title,
            aiConfig,
            runClaudeCode,
            relatedItems,
            availableTags
        };
    }, [title, aiConfig, runClaudeCode, relatedItems, availableTags]);

    // URLが変更されたら自動でAI生成を実行（デバウンス付き）
    useEffect(() => {
        // URLが変更され、有効なURLの場合のみ実行
        if (url && url !== prevUrlRef.current && url.startsWith("http")) {
            // 前回のタイマーをクリア
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // 1秒後に実行（入力中の連続変更を避ける）
            debounceTimerRef.current = setTimeout(() => {
                const { title, aiConfig, runClaudeCode, relatedItems, availableTags } = latestRunParamsRef.current;
                if (aiConfig?.enabled) {
                    runClaudeCode(url, title, aiConfig, relatedItems, availableTags);
                }
            }, 1000);
        }

        prevUrlRef.current = url;
    }, [url]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // 経過時間タイマー
    useEffect(() => {
        if (claudeCode.status !== "loading" || !claudeCode.startedAt) {
            setElapsed(0);
            return;
        }
        setElapsed(Math.floor((Date.now() - claudeCode.startedAt) / 1000));
        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - claudeCode.startedAt) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [claudeCode.status, claudeCode.startedAt]);

    const handleClick = useCallback(() => {
        if (claudeCode.status === "loading") {
            // loading中のクリックでやり直し
            clearResult();
            if (url && url.startsWith("http")) {
                runClaudeCode(url, title, aiConfig, relatedItems, availableTags);
            }
        } else if (claudeCode.status === "complete") {
            // 結果がある場合は挿入
            insertResult();
        } else if (claudeCode.status === "idle" || claudeCode.status === "error") {
            // アイドルまたはエラー状態の場合は実行
            if (url && url.startsWith("http")) {
                runClaudeCode(url, title, aiConfig, relatedItems, availableTags);
            }
        }
    }, [
        claudeCode.status,
        url,
        title,
        aiConfig,
        runClaudeCode,
        insertResult,
        clearResult,
        relatedItems,
        availableTags
    ]);

    // 設定が無効の場合は表示しない
    if (!aiConfig?.enabled) {
        return null;
    }

    const getButtonContent = () => {
        switch (claudeCode.status) {
            case "loading":
                return (
                    <span className="ClaudeCodeButton-loading">
                        <span className="ClaudeCodeButton-spinner"></span>
                        AI {elapsed}s
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
            title={
                claudeCode.status === "complete"
                    ? "Cmd+Shift+J で挿入"
                    : claudeCode.status === "loading"
                    ? `実行中... ${elapsed}s（クリックでやり直し）`
                    : "AIで説明文を生成"
            }
        >
            {getButtonContent()}
        </button>
    );
}
