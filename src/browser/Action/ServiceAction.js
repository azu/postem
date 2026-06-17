// LICENSE : MIT
"use strict";
import { Action } from "material-flux";
import keys from "./ServiceActionConst";

export { keys };
import notie from "notie";
import { show as LoadingShow, dismiss as LoadingDismiss } from "../view-util/Loading";
import RelatedItemModel from "../models/RelatedItemModel";
import serviceInstance from "../service-instance";
import { spawn } from "child_process";
import fs from "fs";
import {
    buildClaudeArgs,
    buildCodexArgs,
    buildPrompt,
    getAICommand,
    getSpawnEnv,
    prepareCodexConfig,
    formatCodexJsonEventLog,
    parseCodexJsonLine,
    parseCodexJsonLines,
    parseAIOutput
} from "../ai-runner";

export default class ServiceAction extends Action {
    _claudeProcess = null;
    _claudeRunId = 0;

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

    // AI生成関連アクション
    runClaudeCode(url, title, config, relatedItems = [], availableTags = []) {
        if (!config?.enabled) return;
        if (config.configError) {
            this.dispatch(keys.claudeCodeError, { url, error: config.configError });
            return;
        }
        const command = getAICommand(config);
        if (command.includes("/") && !fs.existsSync(command)) {
            this.dispatch(keys.claudeCodeError, { url, error: `CLI not found: ${command}` });
            return;
        }
        if (!fs.existsSync(config.workDir)) {
            this.dispatch(keys.claudeCodeError, { url, error: `WorkDir not found: ${config.workDir}` });
            return;
        }

        // 前のプロセスを停止
        if (this._claudeProcess) {
            this._claudeProcess.kill();
            this._claudeProcess = null;
        }

        const runId = ++this._claudeRunId;
        this.dispatch(keys.claudeCodeStart, { url });

        const prompt = buildPrompt({ config, url, title, relatedItems, availableTags });
        let args;
        let runConfig;
        try {
            runConfig = config.type === "codex" ? prepareCodexConfig(config) : config;
            args = runConfig.type === "codex" ? buildCodexArgs(runConfig) : buildClaudeArgs(runConfig, prompt);
        } catch (error) {
            this.dispatch(keys.claudeCodeError, { url, error: error.message });
            return;
        }

        const aiProcess = spawn(command, args, {
            cwd: config.workDir,
            env: getSpawnEnv(),
            shell: false,
            stdio: config.type === "codex" ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"]
        });
        this._claudeProcess = aiProcess;

        if (config.type === "codex") {
            aiProcess.stdin.write(prompt);
            aiProcess.stdin.end();
        }

        let stdout = "";
        let stderr = "";
        let codexJsonLineBuffer = "";
        let settled = false;
        const timeoutMs = Number.isFinite(runConfig.timeoutMs) ? runConfig.timeoutMs : 120000;
        const timeout =
            timeoutMs > 0
                ? setTimeout(() => {
                      if (settled || runId !== this._claudeRunId) return;
                      settled = true;
                      if (this._claudeProcess === aiProcess) {
                          this._claudeProcess = null;
                      }
                      aiProcess.kill();
                      this.dispatch(keys.claudeCodeError, {
                          url,
                          error: `AI generation timed out after ${Math.round(timeoutMs / 1000)}s`
                      });
                  }, timeoutMs)
                : null;
        const clearRunTimeout = () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
        const completeWithStdout = () => {
            if (settled || runId !== this._claudeRunId) return;
            const parsedResult = parseAIOutput(stdout);
            settled = true;
            clearRunTimeout();
            this.dispatch(keys.claudeCodeComplete, {
                url,
                comment: parsedResult.comment,
                tags: Array.isArray(parsedResult.tags) ? parsedResult.tags : []
            });
        };
        const failWithError = (error) => {
            if (settled || runId !== this._claudeRunId) return;
            settled = true;
            clearRunTimeout();
            this.dispatch(keys.claudeCodeError, { url, error });
        };

        aiProcess.stdout.on("data", (data) => {
            const chunk = data.toString();
            stdout += chunk;
            if (runConfig.type !== "codex" || runConfig.json === false) {
                return;
            }
            codexJsonLineBuffer += chunk;
            const lines = codexJsonLineBuffer.split(/\r?\n/);
            codexJsonLineBuffer = lines.pop() || "";
            if (runConfig.logEvents) {
                lines.forEach((line) => {
                    const event = parseCodexJsonLine(line);
                    const log = formatCodexJsonEventLog(event);
                    if (log) {
                        console.log(`[postem:codex] ${log}`, event);
                    }
                });
            }
            const codexJsonLines = parseCodexJsonLines(stdout);
            if (codexJsonLines.failed) {
                failWithError(codexJsonLines.error || "Codex execution failed");
                return;
            }
            if (codexJsonLines.completed && codexJsonLines.finalMessage) {
                completeWithStdout();
            }
        });
        aiProcess.stderr.on("data", (data) => (stderr += data.toString()));

        aiProcess.on("close", (code) => {
            if (this._claudeProcess === aiProcess) {
                this._claudeProcess = null;
            }
            // 古い実行の結果は無視
            if (runId !== this._claudeRunId) return;
            if (settled) return;

            if (code === 0 && stdout) {
                completeWithStdout();
            } else {
                failWithError(stderr || `Exit code: ${code}`);
            }
        });

        aiProcess.on("error", (error) => {
            if (this._claudeProcess === aiProcess) {
                this._claudeProcess = null;
            }
            // 古い実行の結果は無視
            if (runId !== this._claudeRunId) return;
            failWithError(error.message);
        });
    }

    clearClaudeCodeResult() {
        this.dispatch(keys.claudeCodeClear);
    }

    insertClaudeCodeResult() {
        this.dispatch(keys.claudeCodeInsert);
    }
}
