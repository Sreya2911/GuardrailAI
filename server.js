import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { evaluatePolicies } from "./agents/policyEngine.js";
import { auditRequest } from "./agents/auditor.js";
import { makeDecision } from "./agents/decisionEngine.js";

import { writeFile } from "./tools/writeFile.js";
import { logAudit } from "./utils/logger.js";

const server = new McpServer({
    name: "Guardrail AI",
    version: "1.0.0"
});

server.registerTool(
    "secure_write_file",
    {
        title: "Secure File Writer",
        description: "Enterprise AI-governed file writing tool.",
        inputSchema: {
            filePath: z.string(),
            content: z.string()
        }
    },
    async ({ filePath, content }) => {

        const requestId = `REQ-${Date.now()}`;

        const policyResult = evaluatePolicies(filePath, content);

        const auditorResult = await auditRequest(
            filePath,
            content
        );

        const decision = makeDecision(
            policyResult,
            auditorResult
        );

        let toolResult = null;

        if (decision.approved) {
            toolResult = writeFile(filePath, content);
        }

        const auditRecord = {
            requestId,
            filePath,
            decision: decision.decision,
            riskScore: decision.riskScore,
            violations: decision.violations,
            reason: decision.reason,
            toolResult
        };

        logAudit(auditRecord);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(auditRecord, null, 2)
                }
            ]
        };

    }
);

const transport = new StdioServerTransport();

await server.connect(transport);

console.error("✅ Guardrail AI MCP Server Running");