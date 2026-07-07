import { validateRequest } from "../utils/validator.js";

export function evaluatePolicies(filePath, content) {

    const validation = validateRequest(filePath, content);

    return {
        source: "Policy Engine",
        approved: validation.approved,
        riskScore: validation.riskScore,
        violations: validation.violations
    };

}