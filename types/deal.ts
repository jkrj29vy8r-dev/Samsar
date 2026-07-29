import type { Comparable } from "@/types/comparable";

/** Ce trimite clientul ca să caute deal-uri. */
export interface DealQuery {
  model: string;
  budget: string;
  year: string;
}

/** Un anunț considerat „deal”: sub prețul median, cu profit estimat. */
export interface Deal extends Omit<Comparable, "price"> {
  price: number;
  resale: number;
  profit: number;
  marginPct: number;
}
