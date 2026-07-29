/** Ce trimite clientul ca să caute comparabile. */
export interface ComparableQuery {
  model: string;
  year: string;
  km: string;
}

/** Un anunț comparabil, normalizat din sursă (deocamdată Autovit). */
export interface Comparable {
  title: string;
  year: number | null;
  km: number | null;
  price: number | null;
  location: string;
  url: string;
}
