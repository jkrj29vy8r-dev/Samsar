import Anthropic from "@anthropic-ai/sdk";
import type { Comparable, ComparableQuery } from "@/types/comparable";
import { formatComparables } from "@/lib/autovit";

/**
 * Sursa de comparabile — căutare web cu Claude.
 *
 * Înlocuiește scraping-ul direct de pe Autovit (blocat de anti-bot pe serverele
 * Vercel). Claude caută pe web anunțuri reale de pe piața din România și le
 * întoarce structurat. Are nevoie doar de ANTHROPIC_API_KEY (deja pe server).
 *
 * Rămâne izolat: dacă vrei altă sursă, atingi doar acest fișier.
 */

export const MARKET_SEARCH_SYSTEM =
  "Ești un asistent care caută anunțuri auto second-hand reale pe piața din " +
  "România (autovit.ro, olx.ro). Cauți pe web anunțuri active și le întorci " +
  "structurat. Nu inventezi anunțuri sau prețuri — folosești doar ce găsești " +
  "în rezultatele căutării.";

export interface MarketQuery extends ComparableQuery {
  /** Buget maxim, opțional — ajută la restrângerea căutării. */
  budget?: string;
}

export interface MarketResult {
  listings: Comparable[];
  text: string;
}

function buildPrompt(q: MarketQuery): string {
  const lines = ["Caută pe Autovit și OLX anunțuri reale, active, pentru:"];
  lines.push(`- Mașină: ${q.model.trim() || "—"}`);
  if (q.year.trim()) lines.push(`- An minim: ${q.year.trim()}`);
  if (q.km.trim()) lines.push(`- Km orientativ: ${q.km.trim()}`);
  if (q.budget?.trim()) lines.push(`- Buget maxim: ${q.budget.trim()} €`);
  lines.push(
    "",
    "Adu 10–20 de anunțuri similare. Pentru fiecare extrage: titlu, an, km, " +
      "preț în EURO (număr), locație (oraș) și URL-ul anunțului.",
    "",
    "Răspunde DOAR cu un array JSON, fără niciun alt text, în forma:",
    '[{"title":"VW Passat 2.0 TDI","year":2017,"km":175000,"price":11400,"location":"Cluj","url":"https://..."}]',
    "Dacă un câmp lipsește, pune null. Prețul e număr în euro, fără simboluri.",
  );
  return lines.join("\n");
}

/**
 * Convertește la număr. Prețuri/km/ani sunt întregi aici, iar textul din
 * România folosește „.” ca separator de mii („160.000”), așa că păstrăm doar
 * cifrele. (Fără regex, ca să nu complice deploy-ul cu escaping.)
 */
function toNum(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    let s = "";
    for (const ch of value) {
      if (ch >= "0" && ch <= "9") s += ch;
    }
    if (s === "") return null;
    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Scoate array-ul JSON din răspuns și îl normalizează la Comparable[]. */
function parseListings(text: string): Comparable[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return [];

  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const out: Comparable[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    if (!title) continue;
    out.push({
      title,
      year: toNum(o.year),
      km: toNum(o.km),
      price: toNum(o.price),
      location: typeof o.location === "string" ? o.location.trim() : "",
      url: typeof o.url === "string" ? o.url.trim() : "",
    });
  }
  return out;
}

/**
 * Caută comparabile pe web cu Claude. Întoarce anunțuri normalizate + textul
 * formatat pentru evaluare, ori un mesaj clar de eroare.
 */
export async function searchMarket(
  query: MarketQuery,
): Promise<MarketResult | { error: string }> {
  if (query.model.trim() === "") {
    return { error: "Scrie ce mașină cauți (marcă și model)." };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: "Căutarea automată nu e configurată momentan." };
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8000,
      system: MARKET_SEARCH_SYSTEM,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
      messages: [{ role: "user", content: buildPrompt(query) }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const listings = parseListings(text);
    return { listings, text: formatComparables(listings) };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Market search API error:", error.status, error.message);
    } else {
      console.error("Market search error:", error);
    }
    return {
      error: "Nu am putut căuta pe net acum. Încearcă din nou sau lipește manual.",
    };
  }
}
