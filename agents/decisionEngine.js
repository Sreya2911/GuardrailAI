export function makeDecision(policyResult, auditorResult) {

    const finalRiskScore = Math.max(
        policyResult.riskScore,
        auditorResult.riskScore
    );

    const violations = [
        ...policyResult.violations.map(v => v.type),
        ...auditorResult.violations
    ];

    const approved =
        policyResult.approved &&
        auditorResult.approved &&
        finalRiskScore < 70;

    return {
        approved,
        decision: approved ? "APPROVED" : "BLOCKED",
        riskScore: finalRiskScore,
        violations: [...new Set(violations)],
        reason: approved
            ? "Request passed all compliance checks."
            : auditorResult.reason || "Policy violation detected."
    };

}