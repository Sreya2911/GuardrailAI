import { POLICIES } from "../config/policies.js";

export function validateRequest(filePath, content) {
    const violations = [];
    let riskScore = 0;

    // -------------------------
    // Restricted Directory Check
    // -------------------------
    for (const dir of POLICIES.blockedDirectories) {
        if (filePath.startsWith(dir)) {
            violations.push({
                type: "Restricted Directory",
                value: dir
            });

            riskScore += 100;
        }
    }

    // -------------------------
    // PII Detection
    // -------------------------
    for (const rule of POLICIES.piiPatterns) {
        const matches = content.match(rule.regex);

        if (matches) {
            violations.push({
                type: rule.name,
                value: matches
            });

            riskScore += 25;
        }
    }

    // -------------------------
    // Secret Detection
    // -------------------------
    for (const rule of POLICIES.secretPatterns) {
        const matches = content.match(rule.regex);

        if (matches) {
            violations.push({
                type: rule.name,
                value: matches
            });

            riskScore += 50;
        }
    }

    riskScore = Math.min(riskScore, POLICIES.maxRiskScore);

    return {
        approved: riskScore < POLICIES.blockThreshold,
        riskScore,
        violations
    };
}