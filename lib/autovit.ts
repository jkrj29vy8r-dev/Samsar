import type { Comparable, ComparableQuery } from "@/types/comparable";

/**
 * Adaptor Autovit — izolat intenționat.
 *
 * Toată logica de „de unde vin comparabilele” stă aici. Dacă structura
 * Autovit se schimbă, ori dacă trebuie trecut printr-un serviciu de scraping
 * (ScraperAPI, Zyte etc.), se modifică DOAR acest fișier — ruta și UI-ul rămân.
 *
 * Parsarea e deliberat rezistentă: nu se bazează pe selectoare CSS, ci pe
 * datele structurate din pagină (JSON-LD + blocul __NEXT_DATA__ al Next.js),
 * căutate generic după formă, nu după căi fixe.
 */

const BASE = "https://www.autovit.ro";
const MAX_RESULTS = 25;

/** Construiește URL-ul de căutare pe Autovit din datele mașinii. */
export function buildAutovitUrl({ model, year }: ComparableQuery): string {
  const q = model.trim().toLowerCase().replace(/\s+/g, " ");
  const path = q ? `/autoturisme/q-${encodeURIComponent(q)}` : "/autoturisme";

  const params = new URLSearchParams();
  const y = Number.parseInt(year, 10);
  if (Number.isFinite(y)) {
    params.set("search[filter_float_year:from]", String(y - 1));
    params.set("search[filter_float_year:to]", String(y + 1));
  }
  params.set("search[order]", "created_at:desc");

  const qs = params.toString();
  return `${BASE}${path}${qs ? `?${qs}` : ""}`;
}

interface FetchResult {
  ok: boolean;
  status: number;
  html: string;
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ro-RO,ro;q=0.9,en;q=0.8",
};

/**
 * Dacă e configurat un serviciu de scraping (env, doar pe server), trece cererea
 * prin el ca să treacă de anti-bot-ul Autovit (DataDome). Altfel, întoarce
 * URL-ul direct. Suportă ScraperAPI/Zyte-style prin endpoint + param `url`.
 *
 * Env vars (opționale, doar pe server):
 * - SCRAPER_API_KEY — cheia serviciului
 * - SCRAPER_API_ENDPOINT — endpoint-ul (default https://api.scraperapi.com)
 * - SCRAPER_RENDER — "1" ca să ceară randare JS (implicit pornit)
 */
function scrapingRequestUrl(target: string): string {
  const key = process.env.SCRAPER_API_KEY;
  if (!key) return target;

  const endpoint = process.env.SCRAPER_API_ENDPOINT ?? "https://api.scraperapi.com";
  const params = new URLSearchParams({ api_key: key, url: target });
  if (process.env.SCRAPER_RENDER !== "0") params.set("render", "true");
  params.set("country_code", "eu");
  return `${endpoint}/?${params.toString()}`;
}

/** True dacă cererea trece printr-un serviciu de scraping configurat. */
export function usingScrapingService(): boolean {
  return Boolean(process.env.SCRAPER_API_KEY);
}

async function fetchAutovitHtml(url: string): Promise<FetchResult> {
  const requestUrl = scrapingRequestUrl(url);
  const res = await fetch(requestUrl, {
    headers: BROWSER_HEADERS,
    // Fără cache: prețurile de pe piață se schimbă.
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, html: await res.text() };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number.parseFloat(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Caută o valoare într-un array de parametri de tip [{ key, value }]. */
function fromParams(params: unknown, names: string[]): unknown {
  if (!Array.isArray(params)) return undefined;
  for (const p of params) {
    if (p && typeof p === "object") {
      const o = p as Record<string, unknown>;
      const key = readString(o.key ?? o.name ?? o.code).toLowerCase();
      if (names.includes(key)) return o.value ?? o.displayValue ?? o.values;
    }
  }
  return undefined;
}

function readPrice(o: Record<string, unknown>): number | null {
  for (const key of ["price", "gross_price", "grossPrice", "amount"]) {
    const direct = toNumber(o[key]);
    if (direct !== null && direct > 300) return direct;
  }
  const price = o.price;
  if (price && typeof price === "object") {
    const p = price as Record<string, unknown>;
    for (const key of ["value", "amount", "gross", "grossPrice"]) {
      const nested = p[key];
      const n = toNumber(nested);
      if (n !== null && n > 300) return n;
      if (nested && typeof nested === "object") {
        const nn = toNumber((nested as Record<string, unknown>).value);
        if (nn !== null && nn > 300) return nn;
      }
    }
  }
  const fromP = toNumber(fromParams(o.params ?? o.parameters, ["price"]));
  return fromP !== null && fromP > 300 ? fromP : null;
}

function readKm(o: Record<string, unknown>): number | null {
  for (const key of ["mileage", "km", "mileageFromOdometer"]) {
    const n = toNumber(o[key]);
    if (n !== null) return n;
  }
  return toNumber(fromParams(o.params ?? o.parameters, ["mileage", "km"]));
}

function readYear(o: Record<string, unknown>): number | null {
  for (const key of ["year", "productionYear", "vehicleModelDate"]) {
    const n = toNumber(o[key]);
    if (n !== null && n > 1950 && n < 2100) return n;
  }
  const fromP = toNumber(fromParams(o.params ?? o.parameters, ["year"]));
  return fromP !== null && fromP > 1950 && fromP < 2100 ? fromP : null;
}

function readLocation(o: Record<string, unknown>): string {
  const loc = o.location ?? o.city ?? o.region;
  if (typeof loc === "string") return loc.trim();
  if (loc && typeof loc === "object") {
    const l = loc as Record<string, unknown>;
    return readString(l.city ?? l.name ?? l.region);
  }
  return "";
}

function readUrl(o: Record<string, unknown>): string {
  const url = readString(o.url ?? o.link);
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE}${url}`;
}

/** Caută recursiv obiecte care „arată” a anunț (au preț + an sau km). */
function collectFromObject(root: unknown): Comparable[] {
  const out: Comparable[] = [];
  const seen = new Set<unknown>();

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);

    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }

    const o = node as Record<string, unknown>;
    const title = readString(o.title) || readString(o.name);
    const price = readPrice(o);
    const km = readKm(o);
    const year = readYear(o);

    if (title && price !== null && (km !== null || year !== null)) {
      out.push({ title, price, km, year, location: readLocation(o), url: readUrl(o) });
    }

    for (const key of Object.keys(o)) walk(o[key]);
  };

  walk(root);
  return out;
}

function parseNextData(html: string): Comparable[] {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) return [];
  try {
    return collectFromObject(JSON.parse(match[1]));
  } catch {
    return [];
  }
}

function parseJsonLd(html: string): Comparable[] {
  const out: Comparable[] = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      out.push(...collectFromObject(JSON.parse(match[1])));
    } catch {
      // ignorăm blocurile ld+json invalide
    }
  }
  return out;
}

function dedupe(listings: Comparable[]): Comparable[] {
  const seen = new Set<string>();
  const result: Comparable[] = [];
  for (const item of listings) {
    const key = item.url || `${item.title}|${item.price}|${item.km}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= MAX_RESULTS) break;
  }
  return result;
}

/** Transformă anunțurile în textul pe care îl consumă modelul de evaluare. */
export function formatComparables(listings: Comparable[]): string {
  return listings
    .map((l) => {
      const parts = [l.title];
      if (l.year) parts.push(String(l.year));
      if (l.km !== null) parts.push(`${l.km.toLocaleString("ro-RO")} km`);
      if (l.price !== null) parts.push(`${l.price.toLocaleString("ro-RO")} €`);
      if (l.location) parts.push(l.location);
      return parts.join(" – ");
    })
    .join("\n");
}

export interface ComparablesResult {
  listings: Comparable[];
  text: string;
  source: string;
}

/**
 * Aduce comparabile de pe Autovit. Aruncă la erori de rețea; întoarce
 * un mesaj clar dacă Autovit răspunde cu eroare (ex. blocaj anti-bot).
 */
export async function fetchComparables(
  query: ComparableQuery,
): Promise<ComparablesResult | { error: string }> {
  const source = buildAutovitUrl(query);
  const { ok, status, html } = await fetchAutovitHtml(source);

  if (!ok) {
    const blocked = status === 403 || status === 429;
    return {
      error: blocked
        ? usingScrapingService()
          ? "Serviciul de scraping n-a putut aduce anunțurile acum. Încearcă din nou."
          : "Autovit a blocat cererea automată. Lipește anunțurile manual deocamdată."
        : `Autovit a răspuns cu ${status}. Încearcă din nou sau lipește manual.`,
    };
  }

  const listings = dedupe([...parseJsonLd(html), ...parseNextData(html)]);
  return { listings, text: formatComparables(listings), source };
}
