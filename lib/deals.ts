import type { Comparable } from "@/types/comparable";
import type { Deal } from "@/types/deal";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export interface RankedDeals {
  median: number;
  deals: Deal[];
}

/**
 * Din anunțurile aduse, calculează prețul median al pieței și scoate în față
 * cele de sub median (și sub buget) — deal-urile, sortate după profit.
 *
 * Statistic și ieftin, fără AI: profit ≈ preț median (cât ceri la revânzare)
 * minus prețul cerut (cât dai). AI-ul poate rafina verdictul mai târziu.
 */
export function rankDeals(
  listings: Comparable[],
  budget: number,
  max = 10,
): RankedDeals {
  const priced = listings.filter(
    (l): l is Comparable & { price: number } => l.price !== null,
  );
  const marketMedian = median(priced.map((l) => l.price));
  if (marketMedian <= 0) return { median: 0, deals: [] };

  const resale = Math.round(marketMedian);
  const deals: Deal[] = priced
    .filter((l) => l.price < marketMedian && (budget <= 0 || l.price <= budget))
    .map((l) => {
      const profit = resale - l.price;
      const marginPct = l.price > 0 ? (profit / l.price) * 100 : 0;
      return {
        title: l.title,
        year: l.year,
        km: l.km,
        location: l.location,
        url: l.url,
        price: l.price,
        resale,
        profit,
        marginPct,
      };
    })
    .sort((a, b) => b.profit - a.profit)
    .slice(0, max);

  return { median: resale, deals };
}
