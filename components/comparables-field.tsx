"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/field";
import type { ComparableQuery } from "@/types/comparable";

interface ComparablesFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Datele după care se caută pe Autovit (marcă/model, an, km). */
  query: ComparableQuery;
}

type Status = "idle" | "loading" | "error";

const PLACEHOLDER =
  "Adu automat de pe Autovit sau lipește manual 10–20 anunțuri similare.\n\n" +
  "ex.\nPassat 2017 175.000 km – 11.400 € – Cluj\n" +
  "Passat 2018 160.000 km – 12.900 € – București";

/**
 * Câmp izolat pentru anunțurile comparabile.
 *
 * Sursa e adaptorul Autovit (server, prin /api/comparables). Dacă se schimbă
 * sursa, se atinge doar adaptorul — acest câmp folosește aceeași interfață
 * `value` / `onChange`, iar utilizatorul poate oricând edita manual textul.
 */
export function ComparablesField({ value, onChange, query }: ComparablesFieldProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");

  const canFetch = query.model.trim() !== "";
  const loading = status === "loading";

  async function fetchFromAutovit() {
    if (!canFetch || loading) return;
    setStatus("loading");
    setNote("");
    try {
      const res = await fetch("/api/comparables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const data: { count?: number; text?: string; error?: string } =
        await res.json();

      if (!res.ok) throw new Error(data.error ?? "N-am putut aduce anunțuri.");

      if (!data.text || data.count === 0) {
        setNote("N-am găsit anunțuri potrivite. Lipește manual.");
        setStatus("idle");
        return;
      }

      onChange(value.trim() ? `${value.trim()}\n${data.text}` : data.text);
      setNote(`Am adus ${data.count} anunțuri de pe Autovit. Verifică-le înainte de evaluare.`);
      setStatus("idle");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "N-am putut aduce anunțuri.");
      setStatus("error");
    }
  }

  return (
    <Card
      label="Anunțuri comparabile"
      action={
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-[12px]"
          onClick={fetchFromAutovit}
          disabled={!canFetch || loading}
        >
          {loading ? "Caut…" : "Adu de pe Autovit"}
        </Button>
      }
    >
      <Textarea
        rows={6}
        placeholder={PLACEHOLDER}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p
        className={`mt-2 text-xs leading-snug ${
          status === "error" ? "text-stop" : "text-soft"
        }`}
      >
        {note ||
          (canFetch
            ? "Apasă „Adu de pe Autovit” sau lipește manual."
            : "Completează marca și modelul ca să pot căuta automat.")}
      </p>
    </Card>
  );
}
