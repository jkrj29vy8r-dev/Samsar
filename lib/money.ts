import type { VerdictStatus } from "@/types/verdict";

/** Extrage un număr dintr-un input, tolerant la text (ex. „10 500 €”). */
export function num(value: string | number): number {
  const n =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Formatează o sumă în euro, în stil românesc. */
export function eur(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")} €`;
}

export interface Verdict {
  status: VerdictStatus;
  label: string;
  sub: string;
}

/**
 * Verdictul se calculează pe client (sursă unică de adevăr) din profitul net
 * și marjă — modelul dă doar prețurile, banii îi socotim aici.
 */
export function computeVerdict(
  buy: number,
  sell: number,
  net: number,
  marginPct: number,
): Verdict {
  if (buy <= 0 || sell <= 0) {
    return { status: "neutral", label: "Date incomplete", sub: "" };
  }
  if (net <= 0) {
    return { status: "stop", label: "Nu iese", sub: "profitul net e zero sau negativ" };
  }
  if (marginPct < 8) {
    return {
      status: "warn",
      label: "Marjă subțire",
      sub: "sub 8% — puțin loc de greșeală",
    };
  }
  return { status: "go", label: "Merită", sub: "marjă sănătoasă pentru un flip" };
}
