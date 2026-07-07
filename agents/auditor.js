import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export async function auditRequest(filePath, content) {

    const prompt = `
You are GuardrailAI's AI Compliance Auditor.

Review this file write request.

FILE PATH:
${filePath}

CONTENT:
${content}

Analyze for:

- Personally Identifiable Information
- API Keys
- Passwords
- Secrets
- Tokens
- Credentials
- Sensitive Financial Data
- Unsafe File Destination

Respond ONLY with valid JSON.

{
  "approved": true,
  "riskScore": 0,
  "violations": [],
  "reason": ""
}

Rules:

approved must be true or false.

riskScore must be between 0 and 100.

violations must always be an array.

No markdown.

No explanation outside JSON.
`;

    try {

        const result = await model.generateContent(prompt);

        const response = result.response
            .text()
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(response);

    } catch (err) {

        return {
            approved: false,
            riskScore: 100,
            violations: ["Auditor Failure"],
            reason: err.message
        };

    }

}