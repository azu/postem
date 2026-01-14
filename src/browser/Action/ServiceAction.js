// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import keys from "./ServiceActionConst";

export { keys };
import notie from "notie";
import { show as LoadingShow, dismiss as LoadingDismiss } from "../view-util/Loading";
import RelatedItemModel from "../models/RelatedItemModel";
import serviceInstance from "../service-instance";

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

export default class ServiceAction extends Action {
    fetchTags(service) {
        const client = serviceInstance.getClient(service);
        if (!client.isLogin()) {
            console.log(service.id + " is not login");
            return;
        }
        console.log("fetchTags: " + service.id);
        return client
            .getTags()
            .then((tags) => {
                console.log("fetchTags:", tags);
                this.dispatch(keys.fetchTags, tags);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchContent(service, url) {
        const client = serviceInstance.getClient(service);
        if (!client.isLogin()) {
            return Promise.reject(new Error(service.id + " is not login"));
        }
        console.log("fetchContent: " + service.id);
        return client.getContent(url);
    }

    postLink(services, postData) {
        var mapCS = services.map((service) => {
            const client = serviceInstance.getClient(service);
            return {
                service,
                client
            };
        });
        const retry = async (cb, retryCount = 0) => {
            try {
                return await cb();
            } catch (error) {
                if (retryCount < 3) {
                    return await retry(cb, retryCount + 1);
                } else {
                    throw error;
                }
            }
        };
        // comment に -{3,5} が含まれている時は、 { content, note } に分ける
        // content は URL の内容
        // note は　コメント的なもの
        // という風に分ける
        const splitContent = (content) => {
            const match = content.match(/-{3,5}/);
            if (match) {
                const index = match.index;
                return {
                    content: content.slice(0, index).trim(),
                    note: content.slice(index + match[0].length).trim()
                };
            } else {
                return {
                    content
                };
            }
        };
        const { content, note } = splitContent(postData.comment);
        const normalizedPostData = {
            ...postData,
            comment: content,
            additionalNote: note
        };
        var enabledCS = mapCS.filter(({ client }) => client.isLogin());
        var servicePromises = enabledCS.map(({ service, client }) => {
            console.log("postLink: " + service.id);
            return retry(() => {
                return client.postLink(normalizedPostData);
            });
        });
        if (servicePromises.length) {
            LoadingShow();
        }
        return Promise.all(servicePromises)
            .then(() => {
                notie.alert(1, "Post Success!", 1.5);
                this.dispatch(keys.postLink);
            })
            .catch((error) => {
                notie.alert(3, "Post Error.", 2.5);
                console.log(error);
            })
            .then(function finish() {
                LoadingDismiss(100);
            });
    }

    selectTags(tags) {
        this.dispatch(keys.selectTags, tags);
    }

    updateTitle(title) {
        this.dispatch(keys.updateTitle, title);
    }

    updateURL(URL) {
        this.dispatch(keys.updateURL, URL);
    }

    updateViaURL(URL) {
        this.dispatch(keys.updateViaURL, URL);
    }

    updateQuote(text) {
        this.dispatch(keys.updateQuote, text);
    }

    updateComment(comment) {
        this.dispatch(keys.updateComment, comment);
    }

    login(service) {
        const client = serviceInstance.getClient(service);
        client.loginAsync((error) => {
            if (error) {
                return console.error(error);
            }
            console.log("login: " + service.id);
        });
    }

    enableService(service) {
        console.log("enableService", service);
        if (typeof service === "string") {
            throw new Error("Not ServiceId, It should be service instance");
        }
        const client = serviceInstance.getClient(service);
        console.log("enableService", client);
        if (client.isLogin()) {
            this.dispatch(keys.enableService, service);
        } else {
            client.loginAsync((error) => {
                if (error) {
                    return console.error(error);
                }
                this.dispatch(keys.enableService, service);
            });
        }
    }

    disableService(service) {
        this.dispatch(keys.disableService, service);
    }

    editRelatedItem(item) {
        if (!item.isEditing) {
            item.startEditing();
            this.dispatch(keys.editRelatedItem, item);
        }
    }

    addRelatedItem({ title, URL } = {}) {
        const relatedItem = new RelatedItemModel({
            title: title || "Dummy",
            URL: URL || "http://example.com/"
        });
        if (title && URL) {
            relatedItem.finishEditing();
        }
        this.dispatch(keys.addRelatedItem, relatedItem);
    }

    finishEditingRelatedItem(item, value) {
        if (!value) {
            return this.dispatch(keys.removeRelatedItem, item);
        }
        item.updateWithValue(value);
        item.finishEditing();
        this.dispatch(keys.finishEditingRelatedItem, item);
    }

    resetField() {
        this.dispatch(keys.resetField);
    }

    // Claude Code関連アクション
    runClaudeCode(url, config) {
        if (!config || !config.enabled) {
            console.log("[ClaudeCode] Disabled or no config");
            return;
        }

        // CLIが存在するかチェック
        const cliPath = config.cliPath;
        if (!fs.existsSync(cliPath)) {
            console.warn(`[ClaudeCode] CLI not found at ${cliPath}`);
            return;
        }

        console.log(`[ClaudeCode] Starting for URL: ${url}`);
        console.log(`[ClaudeCode] CLI: ${cliPath}`);
        console.log(`[ClaudeCode] WorkDir: ${config.workDir}`);

        const workDir = config.workDir;

        // 作業ディレクトリの存在確認
        if (!fs.existsSync(workDir)) {
            console.error(`[ClaudeCode] WorkDir does not exist: ${workDir}`);
            this.dispatch(keys.claudeCodeError, { url, error: `WorkDir does not exist: ${workDir}` });
            return;
        }
        console.log(`[ClaudeCode] WorkDir exists: OK`);

        this.dispatch(keys.claudeCodeStart, { url });

        // 設定からプロンプトを使用
        const prompt = `${config.prompt}\n\nURL: ${url}`;

        // Claude Code CLIを--print付きで実行（ワンショットモード）
        // ツール許可オプションを追加
        const args = [];

        // MCP設定がある場合は追加
        if (config.mcpConfig) {
            const mcpJson = JSON.stringify(config.mcpConfig);
            args.push("--mcp-config", mcpJson);
            console.log(`[ClaudeCode] MCP config: ${mcpJson.slice(0, 100)}...`);
        }

        args.push("--print", "--dangerously-skip-permissions", prompt);
        console.log(
            `[ClaudeCode] Spawning: ${cliPath} ${
                config.mcpConfig ? "--mcp-config <json> " : ""
            }--print --dangerously-skip-permissions <prompt>`
        );
        console.log(`[ClaudeCode] Prompt length: ${prompt.length} chars`);
        console.log(`[ClaudeCode] Prompt (last 200 chars): ...${prompt.slice(-200)}`);

        const spawnEnv = {
            ...process.env,
            HOME: process.env.HOME,
            PATH: "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:" + process.env.PATH,
            TERM: "xterm-256color"
        };
        console.log(`[ClaudeCode] HOME: ${spawnEnv.HOME}`);

        const claudeProcess = spawn(cliPath, args, {
            cwd: workDir,
            env: spawnEnv,
            shell: false,
            stdio: ["ignore", "pipe", "pipe"]
        });

        console.log(`[ClaudeCode] Process started (PID: ${claudeProcess.pid})`);

        // stdinを閉じる（claudeがstdinを待たないように）
        if (claudeProcess.stdin) {
            claudeProcess.stdin.end();
        }

        let stdout = "";
        let stderr = "";

        claudeProcess.stdout.on("data", (data) => {
            const chunk = data.toString();
            stdout += chunk;
            // 進捗表示（最初の100文字だけ表示）
            const preview = chunk.length > 100 ? chunk.slice(0, 100) + "..." : chunk;
            console.log(`[ClaudeCode] stdout: ${preview.replace(/\n/g, "\\n")}`);
        });

        claudeProcess.stderr.on("data", (data) => {
            const chunk = data.toString();
            stderr += chunk;
            console.log(`[ClaudeCode] stderr: ${chunk.replace(/\n/g, "\\n")}`);
        });

        claudeProcess.on("close", (code) => {
            console.log(`[ClaudeCode] Process exited with code: ${code}`);
            if (code === 0 && stdout) {
                // 出力から説明文を抽出
                const result = this._extractDescription(stdout);
                console.log(`[ClaudeCode] Success! Result length: ${result.length}`);
                console.log(`[ClaudeCode] Result preview: ${result.slice(0, 200)}...`);
                this.dispatch(keys.claudeCodeComplete, { url, result });
            } else {
                console.error("[ClaudeCode] Error:", stderr || `Exit code: ${code}`);
                this.dispatch(keys.claudeCodeError, { url, error: stderr || `Exit code: ${code}` });
            }
        });

        claudeProcess.on("error", (error) => {
            console.error("[ClaudeCode] Spawn error:", error);
            this.dispatch(keys.claudeCodeError, { url, error: error.message });
        });
    }

    _extractDescription(output) {
        // 出力からマークダウンコードブロック内の説明文を抽出
        const codeBlockMatch = output.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
            return codeBlockMatch[1].trim();
        }
        // コードブロックがない場合はそのまま返す
        return output.trim();
    }

    clearClaudeCodeResult() {
        this.dispatch(keys.claudeCodeClear);
    }

    insertClaudeCodeResult() {
        this.dispatch(keys.claudeCodeInsert);
    }
}
