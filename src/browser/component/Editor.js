// LICENSE : MIT
import { moduleInterop } from "@textlint/module-interop";
import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { lintGutter } from "@codemirror/lint";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";

const createTextlintLinter = async () => {
    const { createTextlintLinter } = await import("codemirror-textlint");

    return createTextlintLinter({
        rules: {
            "max-ten": moduleInterop((await import("textlint-rule-max-ten")).default),
            "no-doubled-conjunctive-particle-ga": moduleInterop(
                (await import("textlint-rule-no-doubled-conjunctive-particle-ga")).default
            ),
            "no-doubled-conjunction": moduleInterop((await import("textlint-rule-no-doubled-conjunction")).default),
            "no-double-negative-ja": moduleInterop((await import("textlint-rule-no-double-negative-ja")).default),
            "no-doubled-joshi": moduleInterop((await import("textlint-rule-no-doubled-joshi")).default),
            "sentence-length": moduleInterop((await import("textlint-rule-sentence-length")).default),
            "no-mix-dearu-desumasu": moduleInterop((await import("textlint-rule-no-mix-dearu-desumasu")).default),
            "no-nfd": moduleInterop((await import("textlint-rule-no-nfd")).default),
            proofdict: moduleInterop((await import("textlint-rule-proofdict")).default),
            "no-invalid-control-character": moduleInterop(
                (await import("@textlint-rule/textlint-rule-no-invalid-control-character")).default
            ),
            "ja-unnatural-alphabet": moduleInterop((await import("textlint-rule-ja-unnatural-alphabet")).default),
            "no-unmatched-pair": moduleInterop((await import("@textlint-rule/textlint-rule-no-unmatched-pair")).default)
        },
        rulesConfig: {
            "max-ten": { max: 3 },
            "no-doubled-conjunctive-particle-ga": true,
            "no-doubled-conjunction": true,
            "no-double-negative-ja": true,
            "no-doubled-joshi": { min_interval: 1 },
            "sentence-length": { max: 100 },
            "no-mix-dearu-desumasu": true,
            "no-nfd": true,
            proofdict: { dictURL: "https://azu.github.io/proof-dictionary/" },
            "no-unmatched-pair": true,
            "ja-unnatural-alphabet": true,
            "no-invalid-control-character": true
        },
        plugins: {
            "@textlint/markdown": moduleInterop((await import("@textlint/textlint-plugin-markdown")).default)
        },
        pluginsConfig: {
            "@textlint/markdown": true
        }
    });
};

const textlintLinter = await createTextlintLinter();

const Combokeys = (await import("combokeys")).default;

export default function Editor({ value, onChange, onSubmit, services, toggleServiceAtIndex }) {
    const combokeysRef = useRef(null);

    useEffect(() => {
        const setupCombokeys = async () => {
            // Combokeysインスタンスを作成
            combokeysRef.current = new Combokeys(document.documentElement);

            // global-bindプラグインを後から適用
            const globalBind = await import("combokeys/plugins/global-bind");
            globalBind.default(combokeysRef.current);

            [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((key, index) => {
                combokeysRef.current.bindGlobal(`command+${key}`, () => {
                    toggleServiceAtIndex(index);
                });
            });
            // last
            combokeysRef.current.bindGlobal(`command+0`, () => {
                toggleServiceAtIndex(services.length - 1);
            });
        };

        setupCombokeys();

        return () => {
            if (combokeysRef.current) {
                combokeysRef.current.detach();
            }
        };
    }, [services.length, toggleServiceAtIndex, onSubmit]); // Ensure toggleServiceAtIndex and onSubmit are memoized in the parent component

    const extensions = [
        // 最高優先度でMod+Enterをオーバーライド
        Prec.highest(
            keymap.of([
                {
                    key: "Mod-Enter",
                    run: () => {
                        if (onSubmit) {
                            onSubmit();
                        }
                        return true; // デフォルト動作（改行）をブロック
                    }
                }
            ])
        ),
        markdown({ codeLanguages: languages }),
        EditorView.lineWrapping,
        textlintLinter ? [textlintLinter, lintGutter()] : []
    ]
        .flat()
        .filter(Boolean);

    return (
        <div className="Editor">
            <h2 className="l-header">Body</h2>
            <CodeMirror value={value} onChange={onChange} extensions={extensions} theme="light" height="120px" />
        </div>
    );
}
