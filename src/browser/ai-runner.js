// LICENSE : MIT
"use strict";
import fs from "fs";
import os from "os";
import path from "path";

const DEFAULT_PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin";
export const DEFAULT_OUTPUT_SCHEMA = {
    type: "object",
    properties: {
        comment: {
            type: "string"
        },
        tags: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    required: ["comment", "tags"],
    additionalProperties: false
};

const isPlainObject = (value) => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};

const toTomlValue = (value) => {
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map(toTomlValue).join(",")}]`;
    }
    if (isPlainObject(value)) {
        const entries = Object.entries(value).map(([key, entryValue]) => {
            return `${JSON.stringify(key)} = ${toTomlValue(entryValue)}`;
        });
        return `{ ${entries.join(", ")} }`;
    }
    throw new Error(`Unsupported Codex config value: ${String(value)}`);
};

const pushCodexConfig = (args, key, value) => {
    if (value === undefined || value === null) return;
    args.push("-c", `${key}=${toTomlValue(value)}`);
};

const normalizeCodexMcpServer = (name, server) => {
    if (!isPlainObject(server)) {
        throw new Error(`aiConfig.mcpServers.${name} must be an object`);
    }
    if (server.type && server.type !== "http" && server.type !== "stdio") {
        throw new Error(`aiConfig.mcpServers.${name}.type must be "http" or "stdio"`);
    }
    if (server.type === "http" && !server.url) {
        throw new Error(`aiConfig.mcpServers.${name}.url is required for HTTP MCP`);
    }
    if (server.type === "stdio" && !server.command) {
        throw new Error(`aiConfig.mcpServers.${name}.command is required for stdio MCP`);
    }
    if (!server.url && !server.command) {
        throw new Error(`aiConfig.mcpServers.${name} requires url or command`);
    }
    return server;
};

const addCodexMcpServerArgs = (args, name, server) => {
    const normalizedServer = normalizeCodexMcpServer(name, server);
    const prefix = `mcp_servers.${name}`;
    const supportedFields = [
        "url",
        "command",
        "args",
        "env",
        "env_vars",
        "cwd",
        "enabled",
        "required",
        "startup_timeout_sec",
        "tool_timeout_sec",
        "enabled_tools",
        "disabled_tools",
        "default_tools_approval_mode",
        "bearer_token_env_var",
        "http_headers",
        "env_http_headers",
        "scopes",
        "oauth_resource"
    ];
    supportedFields.forEach((field) => {
        pushCodexConfig(args, `${prefix}.${field}`, normalizedServer[field]);
    });
    if (isPlainObject(normalizedServer.tools)) {
        Object.entries(normalizedServer.tools).forEach(([toolName, toolConfig]) => {
            Object.entries(toolConfig).forEach(([field, value]) => {
                pushCodexConfig(args, `${prefix}.tools.${toolName}.${field}`, value);
            });
        });
    }
};

const createOutputSchemaFile = (schema) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "postem-codex-schema-"));
    const schemaPath = path.join(dir, "schema.json");
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    return schemaPath;
};

export const normalizeAIConfig = (serviceModule) => {
    if (serviceModule?.claudeCodeConfig) {
        throw new Error("claudeCodeConfig is no longer supported. Use aiConfig instead.");
    }
    const aiConfig = serviceModule?.aiConfig;
    if (!aiConfig) {
        return { enabled: false };
    }
    if (!aiConfig.enabled) {
        return { ...aiConfig, enabled: false };
    }
    if (!aiConfig.type) {
        throw new Error('aiConfig.type is required. Use "codex" or "claude".');
    }
    if (aiConfig.type !== "codex" && aiConfig.type !== "claude") {
        throw new Error(`Unsupported aiConfig.type: ${aiConfig.type}`);
    }
    if (aiConfig.type === "codex" && aiConfig.mcpConfig) {
        throw new Error("aiConfig.mcpConfig cannot be used with type: codex. Use aiConfig.mcpServers.");
    }
    if (
        aiConfig.type === "claude" &&
        (aiConfig.mcpServers || aiConfig.config || aiConfig.profile || aiConfig.sandbox || aiConfig.outputSchema)
    ) {
        throw new Error("Codex-only aiConfig fields cannot be used with type: claude.");
    }
    return aiConfig;
};

export const buildPrompt = ({ config, url, title, relatedItems = [], availableTags = [] }) => {
    if (typeof config.prompt === "function") {
        return config.prompt({ url, title, relatedItems, availableTags });
    }
    return `${config.prompt || ""}\n\nURL: ${url}\nTitle: ${title}`;
};

export const prepareCodexConfig = (config) => {
    if (!config.outputSchema) {
        return config;
    }
    if (typeof config.outputSchema === "string") {
        return config;
    }
    if (config.outputSchema === true) {
        return {
            ...config,
            outputSchema: createOutputSchemaFile(DEFAULT_OUTPUT_SCHEMA)
        };
    }
    if (isPlainObject(config.outputSchema)) {
        return {
            ...config,
            outputSchema: createOutputSchemaFile(config.outputSchema)
        };
    }
    throw new Error("aiConfig.outputSchema must be a file path, true, or a JSON Schema object.");
};

export const buildCodexArgs = (config) => {
    const args = ["exec"];
    if (config.json !== false) {
        args.push("--json");
    }
    if (config.profile) {
        args.push("--profile", config.profile);
    }
    if (config.workDir) {
        args.push("--cd", config.workDir);
    }
    if (config.model) {
        args.push("--model", config.model);
    }
    if (config.sandbox) {
        args.push("--sandbox", config.sandbox);
    }
    if (config.outputSchema) {
        args.push("--output-schema", config.outputSchema);
    }
    if (config.ephemeral) {
        args.push("--ephemeral");
    }
    if (isPlainObject(config.mcpServers)) {
        Object.entries(config.mcpServers).forEach(([name, server]) => {
            addCodexMcpServerArgs(args, name, server);
        });
    }
    if (isPlainObject(config.config)) {
        Object.entries(config.config).forEach(([key, value]) => {
            pushCodexConfig(args, key, value);
        });
    }
    args.push("-");
    return args;
};

export const buildClaudeArgs = (config, prompt) => {
    const args = [];
    if (config.model) {
        args.push("--model", config.model);
    }
    if (config.mcpConfig) {
        args.push("--mcp-config", JSON.stringify(config.mcpConfig));
    }
    args.push("--print", "--dangerously-skip-permissions", prompt);
    return args;
};

export const getAICommand = (config) => {
    if (config.cliPath) {
        return config.cliPath;
    }
    return config.type === "codex" ? "codex" : "claude";
};

export const getSpawnEnv = () => {
    return {
        ...process.env,
        PATH: `${DEFAULT_PATH}:${process.env.PATH || ""}`
    };
};

const parsePlainAIOutput = (stdout) => {
    const trimmedStdout = stdout.trim();
    if (!trimmedStdout) {
        return { comment: "", tags: [] };
    }
    try {
        const parsedResult = JSON.parse(trimmedStdout);
        return {
            comment: parsedResult.comment || "",
            tags: Array.isArray(parsedResult.tags) ? parsedResult.tags : []
        };
    } catch {
        // Fall through to fenced block parsing.
    }

    const jsonMatch = stdout.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        try {
            const parsedResult = JSON.parse(jsonMatch[1].trim());
            return {
                comment: parsedResult.comment || "",
                tags: Array.isArray(parsedResult.tags) ? parsedResult.tags : []
            };
        } catch {
            const markdownMatch = stdout.match(/```(?:markdown)?\s*([\s\S]*?)```/);
            return {
                comment: markdownMatch ? markdownMatch[1].trim() : trimmedStdout,
                tags: []
            };
        }
    }
    return {
        comment: trimmedStdout,
        tags: []
    };
};

export const parseCodexJsonLines = (stdout) => {
    const result = {
        completed: false,
        failed: false,
        error: "",
        finalMessage: ""
    };
    stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => {
            const event = parseCodexJsonLine(line);
            if (!event) {
                return;
            }
            if (event.type === "turn.completed") {
                result.completed = true;
            }
            if (event.type === "turn.failed" || event.type === "error") {
                result.failed = true;
                result.error = event.error?.message || event.message || result.error;
            }
            if (event.type === "item.completed" && event.item?.type === "agent_message") {
                result.finalMessage = event.item.text || result.finalMessage;
            }
        });
    return result;
};

export const parseCodexJsonLine = (line) => {
    try {
        return JSON.parse(line);
    } catch {
        return null;
    }
};

export const formatCodexJsonEventLog = (event) => {
    if (!event?.type) {
        return null;
    }
    if (event.type === "thread.started") {
        return `thread.started ${event.thread_id || ""}`.trim();
    }
    if (event.type === "turn.started" || event.type === "turn.completed" || event.type === "turn.failed") {
        return event.type;
    }
    if (event.type === "error") {
        return `error ${event.error?.message || event.message || ""}`.trim();
    }
    if (event.type === "item.started" || event.type === "item.completed") {
        const item = event.item || {};
        if (item.type === "mcp_tool_call") {
            const errorText = item.error ? ` error=${item.error}` : "";
            return `${event.type} mcp_tool_call ${item.server || ""}.${
                item.tool || item.name || ""
            }${errorText}`.trim();
        }
        if (item.type === "command_execution") {
            return `${event.type} command_execution ${item.command || ""}`.trim();
        }
        if (item.type === "agent_message") {
            return `${event.type} agent_message`;
        }
        if (item.type === "reasoning") {
            return `${event.type} reasoning`;
        }
        return `${event.type} ${item.type || "item"}`;
    }
    return event.type;
};

export const parseAIOutput = (stdout) => {
    const codexJsonLines = parseCodexJsonLines(stdout);
    if (codexJsonLines.finalMessage) {
        return parsePlainAIOutput(codexJsonLines.finalMessage);
    }
    return parsePlainAIOutput(stdout);
};
