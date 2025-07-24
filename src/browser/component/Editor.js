// LICENSE : MIT
"use strict";
import { moduleInterop } from "@textlint/module-interop";
import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { lintGutter } from "@codemirror/lint";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";

const createTextlintLinter = () => {
    if (process.env.BROWSER === "1") {
        return null;
    }

    const { createTextlintLinter } = require("codemirror-textlint");

    return createTextlintLinter({
        rules: {
            "max-ten": moduleInterop(require("textlint-rule-max-ten")),
            "no-doubled-conjunctive-particle-ga": moduleInterop(
                require("textlint-rule-no-doubled-conjunctive-particle-ga")
            ),
            "no-doubled-conjunction": moduleInterop(require("textlint-rule-no-doubled-conjunction")),
            "no-double-negative-ja": moduleInterop(require("textlint-rule-no-double-negative-ja")),
            "no-doubled-joshi": moduleInterop(require("textlint-rule-no-doubled-joshi")),
            "sentence-length": moduleInterop(require("textlint-rule-sentence-length")),
            "no-mix-dearu-desumasu": moduleInterop(require("textlint-rule-no-mix-dearu-desumasu")),
            "no-nfd": moduleInterop(require("textlint-rule-no-nfd")),
            proofdict: moduleInterop(require("textlint-rule-proofdict")),
            "no-invalid-control-character": moduleInterop(
                require("@textlint-rule/textlint-rule-no-invalid-control-character")
            ),
            "ja-unnatural-alphabet": moduleInterop(require("textlint-rule-ja-unnatural-alphabet")),
            "no-unmatched-pair": moduleInterop(require("@textlint-rule/textlint-rule-no-unmatched-pair"))
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
            "@textlint/markdown": moduleInterop(require("@textlint/textlint-plugin-markdown"))
        },
        pluginsConfig: {
            "@textlint/markdown": true
        }
    });
};

const textlintLinter = createTextlintLinter();

const Combokeys = require("combokeys");

export default function Editor({ value, onChange, onSubmit, services, toggleServiceAtIndex }) {
    const combokeysRef = useRef(null);

    useEffect(() => {
        // Combokeysインスタンスを作成
        combokeysRef.current = new Combokeys(document.documentElement);

        // global-bindプラグインを後から適用
        require("combokeys/plugins/global-bind")(combokeysRef.current);

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((key, index) => {
            combokeysRef.current.bindGlobal(`command+${key}`, () => {
                toggleServiceAtIndex(index);
            });
        });
        // last
        combokeysRef.current.bindGlobal(`command+0`, () => {
            toggleServiceAtIndex(services.length - 1);
        });

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
