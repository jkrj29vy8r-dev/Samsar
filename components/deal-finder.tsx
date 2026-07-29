"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { DealCard } from "@/components/deal-card";
import { eur } from "@/lib/money";
import type { Deal } from "@/types/deal";

type Status = "idle" | "loading" | "error" | "done";

export function DealFinder() {
  const [model, setModel] = useState("");
  const [budget, setBudget] = useState("");
  const [year, setYear] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [median, setMedian] = useState(0);
  const [total, setTotal] = useState(0);
  const [comps, setComps] = useState("");

  const canSearch = model.trim() !== "";
  const loading = status === "loading";

  async function search(e: FormEvent) {
    e.preventDefault();
    if (!canSearch || loading) return;

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, budget, year }),
      });
      const data: {
        median?: number;
        total?: number;
        deals?: Deal[];
        comps?: string;
        error?: string;
      } = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Nu am putut căuta.");

      setDeals(data.deals ?? []);
      setMedian(data.median ?? 0);
      setTotal(data.total ?? 0);
      setComps(data.comps ?? "");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut căuta.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={search} className="flex flex-col gap-4">
        <Card label="Ce cauți">
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              wide
              label="Marcă și model"
              placeholder="ex. VW Passat 2.0 TDI"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <Field
              label="Buget max (€)"
              inputMode="numeric"
              placeholder="10000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <Field
              label="An minim"
              inputMode="numeric"
              placeholder="2016"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-soft">
            Caut pe net anunțuri reale, calculez prețul pieței și scot mașinile
            de sub el.
          </p>
        </Card>

        <Button type="submit" fullWidth disabled={!canSearch || loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Caut deal-uri…
            </span>
          ) : (
            "Caută deal-uri"
          )}
        </Button>
      </form>

      {status === "error" && (
        <Card>
          <p className="text-sm font-semibold text-stop">Căutarea nu a mers</p>
          <p className="mt-1 text-sm leading-relaxed text-soft">{error}</p>
        </Card>
      )}

      {status === "done" &&
        (deals.length === 0 ? (
          <Card>
            <p className="text-sm leading-relaxed text-soft">
              N-am găsit mașini sub prețul pieței
              {median > 0 ? ` (median ${eur(median)})` : ""}. Încearcă alt model
              sau mărește bugetul.
            </p>
          </Card>
        ) : (
          <>
            <p className="px-1 text-xs text-soft">
              Preț median pe piață:{" "}
              <strong className="text-ink">{eur(median)}</strong> · {deals.length}{" "}
              {deals.length === 1 ? "deal" : "deal-uri"} din {total} anunțuri
            </p>
            {deals.map((deal, index) => (
              <DealCard
                key={deal.url || index}
                deal={deal}
                median={median}
                comps={comps}
              />
            ))}
          </>
        ))}
    </div>
  );
}
