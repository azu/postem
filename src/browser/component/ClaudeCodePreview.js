// LICENSE : MIT
"use strict";
import React from "react";

export default function ClaudeCodePreview({ claudeCode, insertResult, clearResult }) {
    if (claudeCode.status === "idle" || claudeCode.status === "loading") {
        return null;
    }

    if (claudeCode.status === "error") {
        return (
            <div className="ClaudeCodePreview ClaudeCodePreview--error">
                <div className="ClaudeCodePreview-header">
                    <span>エラー</span>
                    <button type="button" className="ClaudeCodePreview-close" onClick={clearResult} title="閉じる">
                        ×
                    </button>
                </div>
                <div className="ClaudeCodePreview-content">{claudeCode.error}</div>
            </div>
        );
    }

    if (claudeCode.status === "complete" && claudeCode.comment) {
        return (
            <div className="ClaudeCodePreview ClaudeCodePreview--complete">
                <div className="ClaudeCodePreview-header">
                    <span>AI生成結果</span>
                    <span className="ClaudeCodePreview-hint">Cmd+Shift+J で挿入</span>
                    <button type="button" className="ClaudeCodePreview-close" onClick={clearResult} title="閉じる">
                        ×
                    </button>
                </div>
                <div className="ClaudeCodePreview-content" onClick={insertResult} title="クリックで挿入">
                    {claudeCode.comment}
                </div>
                {claudeCode.tags && claudeCode.tags.length > 0 && (
                    <div className="ClaudeCodePreview-tags">Tags: {claudeCode.tags.join(", ")}</div>
                )}
            </div>
        );
    }

    return null;
}
