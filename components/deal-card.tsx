"use client";

import { useState } from "react";
import type { Deal, DealAnalysis } from "@/types/deal";
import type { VerdictStatus } from "@/types/verdict";
import { Card } from "@/components/ui/card";
import { computeVerdict, eur } from "@/lib/money";

const badgeClass: Record<VerdictStatus, string> = {
  go: "bg-go-soft text-go",
  warn: "bg-warn-soft text-warn",
  stop: "bg-stop-soft text-stop",
  neutral: "bg-slate-500/10 text-soft",
};

const analysisVerdict: Record<
  DealAnalysis["verdict"],
  { status: VerdictStatus; label: string }
> = {
  merita: { status: "go", label: "Merită" },
  marja_subtire: { status: "warn", label: "Marjă subțire" },
  nu_iese: { status: "stop", label: "Nu iese" },
};

type Status = "idle" | "loading" | "error" | "done";

export function DealCard({
  deal,
  median,
  comps,
  delay = 0,
}: {
  deal: Deal;
  median: number;
  comps: string;
  /** Întârzierea animației de intrare, pentru efect de cascadă. */
  delay?: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null);

  const verdict = computeVerdict(deal.price, deal.resale, deal.profit, deal.marginPct);
  const meta = [
    deal.year ? String(deal.year) : null,
    deal.km !== null ? `${deal.km.toLocaleString("ro-RO")} km` : null,
    deal.location || null,
  ]
    .filter(Boolean)
    .join(" · ");

  const loading = status === "loading";

  async function analyze() {
    if (loading) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/deals/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal, median, comps }),
      });
      const data: { analysis?: DealAnalysis; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nu am putut analiza.");
      setAnalysis(data.analysis ?? null);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut analiza.");
      setStatus("error");
    }
  }

  const av = analysis ? analysisVerdict[analysis.verdict] : null;

  return (
    <Card className="hover-lift" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{deal.title}</p>
          {meta && <p className="mt-0.5 text-xs text-soft">{meta}</p>}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${badgeClass[verdict.status]}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
          {eur(deal.profit)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-soft">
          dai <strong className="text-ink">{eur(deal.price)}</strong> → ceri ~
          <strong className="text-ink">{eur(deal.resale)}</strong>
        </span>
        {deal.url && (
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-medium text-go hover:underline"
          >
            vezi anunțul →
          </a>
        )}
      </div>

      {!analysis && (
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/65 bg-white/55 px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-md transition hover:bg-white/75 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              Analizez…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-go" fill="currentColor">
                <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
              </svg>
              Analizează cu AI
            </>
          )}
        </button>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-stop">{error}</p>
      )}

      {av && analysis && (
        <div className="gradient-ring rise mt-3 rounded-2xl border border-white/60 bg-white/45 p-3 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-go" fill="currentColor">
              <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
            </svg>
            verdict AI
          </div>
          <div className="flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass[av.status]}`}
            >
              {av.label}
            </span>
            <span className="text-sm text-soft">
              dai <strong className="text-ink">{eur(analysis.pret_corect)}</strong> →
              ceri ~<strong className="text-ink">{eur(analysis.pret_vanzare)}</strong>{" "}
              <strong className={badgeClass[av.status].split(" ")[1]}>
                (+{eur(analysis.profit_estimat)})
              </strong>
            </span>
          </div>
          {analysis.atentie && (
            <p className="mt-2 text-sm leading-relaxed text-ink">
              <span className="font-semibold">Atenție:</span> {analysis.atentie}
            </p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-soft">
            {analysis.rationament}
          </p>
        </div>
      )}
    </Card>
  );
}
