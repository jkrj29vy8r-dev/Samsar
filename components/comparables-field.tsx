"use client";

import { Card } from "@/components/ui/card";
import { TextareaField } from "@/components/ui/field";

interface ComparablesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Câmp izolat pentru anunțurile comparabile.
 *
 * Deocamdată utilizatorul le lipește manual. La pasul următor, sursa
 * (scraper de Autovit) se schimbă DOAR aici — restul formularului rămâne
 * neatins, atâta timp cât păstrăm aceeași interfață `value` / `onChange`.
 */
export function ComparablesField({ value, onChange }: ComparablesFieldProps) {
  return (
    <Card>
      <TextareaField
        label="Anunțuri comparabile"
        rows={6}
        placeholder={"Lipește 10–20 anunțuri similare (același model, an și km apropiate).\n\nex.\nPassat 2017 175.000 km – 11.400 € – Cluj\nPassat 2018 160.000 km – 12.900 € – București"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint="Deocamdată le lipești manual."
      />
    </Card>
  );
}
