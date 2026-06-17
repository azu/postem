import { describe, it, expect } from "vitest";
import fs from "fs";
import {
    DEFAULT_OUTPUT_SCHEMA,
    buildCodexArgs,
    formatCodexJsonEventLog,
    normalizeAIConfig,
    parseCodexJsonLines,
    parseAIOutput,
    prepareCodexConfig
} from "../../src/browser/ai-runner.js";

describe("ai-runner", () => {
    it("rejects legacy claudeCodeConfig", () => {
        expect(() =>
            normalizeAIConfig({
                claudeCodeConfig: {
                    enabled: true
                }
            })
        ).toThrow("claudeCodeConfig is no longer supported");
    });

    it("rejects mcpConfig with codex type", () => {
        expect(() =>
            normalizeAIConfig({
                aiConfig: {
                    enabled: true,
                    type: "codex",
                    mcpConfig: {
                        mcpServers: {}
                    }
                }
            })
        ).toThrow("Use aiConfig.mcpServers");
    });

    it("builds codex exec args with MCP config overrides", () => {
        const args = buildCodexArgs({
            type: "codex",
            workDir: "/tmp/work",
            profile: "postem",
            model: "gpt-5.4",
            mcpServers: {
                "jser-info": {
                    url: "https://mcp.jser.info/mcp",
                    required: true,
                    default_tools_approval_mode: "approve",
                    enabled_tools: ["jser_product_name", "jser_search_items"]
                },
                textlint: {
                    command: "npx",
                    args: ["textlint", "--mcp"],
                    cwd: "/tmp/work",
                    enabled_tools: ["lint"]
                }
            },
            config: {
                default_permissions: "postem-no-files",
                "permissions.postem-no-files": {
                    filesystem: {
                        "/": "deny",
                        ":workspace_roots": {
                            ".": "deny"
                        }
                    }
                },
                "features.shell_tool": false,
                "mcp_servers.textlint.tool_timeout_sec": 120
            }
        });

        expect(args).toEqual([
            "exec",
            "--json",
            "--profile",
            "postem",
            "--cd",
            "/tmp/work",
            "--model",
            "gpt-5.4",
            "-c",
            'mcp_servers.jser-info.url="https://mcp.jser.info/mcp"',
            "-c",
            "mcp_servers.jser-info.required=true",
            "-c",
            'mcp_servers.jser-info.enabled_tools=["jser_product_name","jser_search_items"]',
            "-c",
            'mcp_servers.jser-info.default_tools_approval_mode="approve"',
            "-c",
            'mcp_servers.textlint.command="npx"',
            "-c",
            'mcp_servers.textlint.args=["textlint","--mcp"]',
            "-c",
            'mcp_servers.textlint.cwd="/tmp/work"',
            "-c",
            'mcp_servers.textlint.enabled_tools=["lint"]',
            "-c",
            'default_permissions="postem-no-files"',
            "-c",
            'permissions.postem-no-files={ "filesystem" = { "/" = "deny", ":workspace_roots" = { "." = "deny" } } }',
            "-c",
            "features.shell_tool=false",
            "-c",
            "mcp_servers.textlint.tool_timeout_sec=120",
            "-"
        ]);
    });

    it("generates default output schema file for codex", () => {
        const config = prepareCodexConfig({
            type: "codex",
            outputSchema: true
        });

        expect(typeof config.outputSchema).toBe("string");
        expect(JSON.parse(fs.readFileSync(config.outputSchema, "utf8"))).toEqual(DEFAULT_OUTPUT_SCHEMA);
    });

    it("generates custom output schema file for codex", () => {
        const outputSchema = {
            type: "object",
            properties: {
                title: {
                    type: "string"
                }
            },
            required: ["title"],
            additionalProperties: false
        };
        const config = prepareCodexConfig({
            type: "codex",
            outputSchema
        });

        expect(JSON.parse(fs.readFileSync(config.outputSchema, "utf8"))).toEqual(outputSchema);
        expect(buildCodexArgs(config)).toEqual(["exec", "--json", "--output-schema", config.outputSchema, "-"]);
    });

    it("parses plain JSON output", () => {
        expect(parseAIOutput('{"comment":"説明文","tags":["JavaScript"]}')).toEqual({
            comment: "説明文",
            tags: ["JavaScript"]
        });
    });

    it("parses codex JSONL output", () => {
        const stdout = [
            '{"type":"thread.started","thread_id":"thread-1"}',
            '{"type":"item.completed","item":{"type":"agent_message","text":"{\\"comment\\":\\"説明文\\",\\"tags\\":[\\"JavaScript\\"]}"}}',
            '{"type":"turn.completed"}'
        ].join("\n");

        expect(parseCodexJsonLines(stdout)).toEqual({
            completed: true,
            failed: false,
            error: "",
            finalMessage: '{"comment":"説明文","tags":["JavaScript"]}'
        });
        expect(parseAIOutput(stdout)).toEqual({
            comment: "説明文",
            tags: ["JavaScript"]
        });
    });

    it("formats codex JSONL events for debug logs", () => {
        expect(
            formatCodexJsonEventLog({
                type: "item.completed",
                item: {
                    type: "mcp_tool_call",
                    server: "textlint",
                    tool: "lint"
                }
            })
        ).toBe("item.completed mcp_tool_call textlint.lint");
    });
});
