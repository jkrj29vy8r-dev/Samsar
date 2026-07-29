export type ImageMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp";

export const ALLOWED_IMAGE_TYPES: ImageMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export type Confidence = "mare" | "medie" | "mica";

/** Datele mașinii, așa cum le completează utilizatorul. */
export interface CarDetails {
  model: string;
  year: string;
  km: string;
  engine: string;
  fuel: string;
  gearbox: string;
  extras: string;
  askPrice: string;
}

/** O poză trimisă spre analiză (base64, fără prefixul data:). */
export interface EvaluationPhoto {
  mediaType: ImageMediaType;
  data: string;
}

/** Corpul cererii către /api/evaluate. */
export interface EvaluationInput {
  car: CarDetails;
  comps: string;
  photos: EvaluationPhoto[];
}

/** Ce întoarce modelul: prețuri și text, fără calculul de bani (ăla e pe client). */
export interface EvaluationResult {
  pret_achizitie: number;
  pret_vanzare: number;
  zile_pana_la_vanzare: number;
  incredere: Confidence;
  observatii_stare: string;
  descriere_anunt: string;
  rationament: string;
}
