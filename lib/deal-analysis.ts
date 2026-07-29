import type { Deal } from "@/types/deal";

export const DEAL_ANALYSIS_SYSTEM =
  "Ești un samsar experimentat pe piața auto second-hand din România. " +
  "Primești un anunț concret și prețul median al pieței pentru mașina căutată. " +
  "Spui dacă anunțul e un flip bun și la ce să fie atent cumpărătorul. " +
  "Te bazezi pe datele primite, nu inventezi prețuri din cunoștințe generale.";

/** Schema de ieșire pentru analiza unui deal — garantează JSON valid. */
export const dealAnalysisSchema: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["merita", "marja_subtire", "nu_iese"] },
    pret_corect: { type: "number" },
    pret_vanzare: { type: "number" },
    profit_estimat: { type: "number" },
    atentie: { type: "string" },
    rationament: { type: "string" },
  },
  required: [
    "verdict",
    "pret_corect",
    "pret_vanzare",
    "profit_estimat",
    "atentie",
    "rationament",
  ],
};

export interface DealAnalysisRequest {
  deal: Deal;
  median: number;
  comps: string;
}

/** Construiește textul cererii pentru analiza unui deal. */
export function buildDealAnalysisText({
  deal,
  median,
  comps,
}: DealAnalysisRequest): string {
  const line = (label: string, value: string) => `- ${label}: ${value}`;
  const eur = (n: number) => `${n.toLocaleString("ro-RO")} €`;

  return `ANUNȚUL DE ANALIZAT
${line("Titlu", deal.title)}
${line("An", deal.year ? String(deal.year) : "—")}
${line("Km", deal.km !== null ? deal.km.toLocaleString("ro-RO") : "—")}
${line("Locație", deal.location || "—")}
${line("Preț cerut", eur(deal.price))}

PIAȚA (anunțuri comparabile active acum)
${line("Preț median piață", eur(median))}

Comparabile:
${comps.trim() || "— niciunul —"}

REGULI
- Bazează-te DOAR pe anunțul de mai sus și pe comparabile. Nu inventa prețuri din cunoștințe generale.
- pret_corect = cât ar fi corect să dai pe acest anunț ca să ai marjă (poți negocia sub prețul cerut).
- pret_vanzare = preț realist de listare la revânzare (zona mediană a pieței, ajustat după km/an/stare).
- profit_estimat = pret_vanzare − pret_corect.
- verdict: "merita" dacă marja e clară și sănătoasă; "marja_subtire" dacă e mic profit sau risc mediu; "nu_iese" dacă nu rămâne profit sau prețul cerut e deja peste piață.
- atentie: 1-2 propoziții cu ce să verifice concret (km mare pentru an, preț suspect de mic, lipsă poze, zonă, motor cunoscut cu probleme).
- rationament: 2-3 propoziții, cum se compară cu piața și de ce verdictul ăsta.`;
}
