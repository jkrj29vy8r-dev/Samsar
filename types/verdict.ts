/**
 * Verdictul unui deal, ca bandă de semafor:
 * - go: merită
 * - warn: marjă subțire
 * - stop: nu iese
 * - neutral: date incomplete
 */
export type VerdictStatus = "go" | "warn" | "stop" | "neutral";
