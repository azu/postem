// LICENSE : MIT
"use strict";
// service
import ServiceManger from "./service-manager";

// FIXME: use IPC
const notBundledRequire = require;

// 初期化が完了したかどうかのフラグとPromise
let initialized = false;
let initializationPromise = null;
const manager = new ServiceManger();

// 非同期初期化関数
async function initializeManager() {
    if (initialized) return manager;
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        try {
            let serviceList;
            if (process.env.PLAYWRIGHT_TEST === "1" || process.title?.includes("playwright")) {
                serviceList = notBundledRequire("../../tests/fixtures/test-services.js");
            } else {
                const serviceModule = notBundledRequire("../service.js");
                const serviceConfig = serviceModule.default || serviceModule;

                // service.jsがPromiseを返す場合は解決する
                if (serviceConfig && typeof serviceConfig.then === "function") {
                    serviceList = await serviceConfig;
                } else {
                    serviceList = serviceConfig;
                }
            }

            if (!Array.isArray(serviceList)) {
                throw new Error("Service list is not an array");
            }

            const services = serviceList
                .filter((service) => {
                    return service.enabled;
                })
                .map((service) => {
                    const { Model, Client } = service.index ? service.index : require(service.indexPath);
                    const client = new Client(service.options);
                    return {
                        model: new Model(),
                        client: client,
                        isDefaultChecked: service.isDefaultChecked && client.isLogin()
                    };
                });

            services.forEach(({ model, client, isDefaultChecked }) => {
                manager.addService({
                    model,
                    client,
                    isDefaultChecked
                });
            });

            initialized = true;
            return manager;
        } catch (error) {
            console.error("Failed to initialize services:", error);
            throw error;
        }
    })();

    return initializationPromise;
}

// 初期化を待つためのヘルパー関数をエクスポート
export async function waitForInitialization() {
    return initializeManager();
}

// Claude Code設定を取得
export function getClaudeCodeConfig() {
    try {
        if (process.env.PLAYWRIGHT_TEST === "1" || process.title?.includes("playwright")) {
            return { enabled: false };
        }
        const serviceModule = notBundledRequire("../service.js");
        return serviceModule.claudeCodeConfig || { enabled: false };
    } catch (error) {
        console.error("Failed to load Claude Code config:", error);
        return { enabled: false };
    }
}

// デフォルトエクスポートはmanagerのままだが、使用前に初期化が必要
export default manager;
