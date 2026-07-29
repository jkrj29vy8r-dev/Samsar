import type { EvaluationInput } from "@/types/evaluation";

export const EVALUATION_SYSTEM =
  "Ești un samsar experimentat pe piața auto second-hand din România. " +
  "Evaluezi o mașină pentru cumpărare și revânzare. " +
  "Te bazezi doar pe anunțurile comparabile primite, nu inventezi prețuri din cunoștințe generale.";

/** Schema de ieșire pentru structured outputs — garantează JSON valid. */
export const evaluationSchema: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    pret_achizitie: { type: "number" },
    pret_vanzare: { type: "number" },
    zile_pana_la_vanzare: { type: "number" },
    incredere: { type: "string", enum: ["mare", "medie", "mica"] },
    observatii_stare: { type: "string" },
    descriere_anunt: { type: "string" },
    rationament: { type: "string" },
  },
  required: [
    "pret_achizitie",
    "pret_vanzare",
    "zile_pana_la_vanzare",
    "incredere",
    "observatii_stare",
    "descriere_anunt",
    "rationament",
  ],
};

/** Construiește textul cererii din datele mașinii + comparabile. */
export function buildUserText({ car, comps, photos }: EvaluationInput): string {
  const hasPhotos = photos.length > 0;
  const line = (label: string, value: string) => `- ${label}: ${value.trim() || "—"}`;

  return `DATE MAȘINĂ
${line("Marcă/model", car.model)}
${line("An", car.year)}
${line("Km", car.km)}
${line("Motorizare", car.engine)}
${line("Combustibil", car.fuel)}
${line("Cutie", car.gearbox)}
${line("Dotări", car.extras)}
${line("Preț cerut de vânzător", car.askPrice ? `${car.askPrice} €` : "")}

STARE
${
  hasPhotos
    ? "Pozele mașinii sunt atașate. Deduci starea din ele: lovituri, rugină, uzură, urme de vopsit, jante, interior."
    : "Fără poze. Marchează starea drept necunoscută și scade încrederea."
}

ANUNȚURI COMPARABILE REALE (active acum, lipite de utilizator)
${comps.trim() || "— niciunul —"}

REGULI
- Bazează prețurile DOAR pe comparabilele de mai sus. Nu inventa prețuri din cunoștințe generale.
- Ajustează față de comparabile după km, an, dotări și stare.
- pret_achizitie = cât să dea ca să aibă marjă (sub zona inferioară a comparabilelor, minus recondiționarea estimată din stare).
- pret_vanzare = preț realist de listare care se vinde rezonabil de repede (zona mediană a comparabilelor, ajustat).
- zile_pana_la_vanzare = estimat după cât de agresiv e prețul față de piață.
- Dacă nu sunt destule comparabile bune, spune clar și pune incredere "mica".
- observatii_stare: 1-3 propoziții despre starea dedusă din poze (sau că e necunoscută).
- descriere_anunt: 3-4 propoziții, ton de anunț real, în română.
- rationament: 2-3 propoziții, spune cu câte anunțuri ai comparat și cum ai ajustat.`;
}
