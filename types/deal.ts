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

/** Verdictul AI pe un anunț anume, în contextul pieței. */
export interface DealAnalysis {
  verdict: "merita" | "marja_subtire" | "nu_iese";
  pret_corect: number;
  pret_vanzare: number;
  profit_estimat: number;
  atentie: string;
  rationament: string;
}
