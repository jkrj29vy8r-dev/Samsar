import type { Deal } from "@/types/deal";
import type { VerdictStatus } from "@/types/verdict";
import { Card } from "@/components/ui/card";
import { computeVerdict, eur } from "@/lib/money";

const badgeClass: Record<VerdictStatus, string> = {
  go: "bg-go-soft text-go",
  warn: "bg-warn-soft text-warn",
  stop: "bg-stop-soft text-stop",
  neutral: "bg-slate-500/10 text-soft",
};

export function DealCard({ deal }: { deal: Deal }) {
  const verdict = computeVerdict(deal.price, deal.resale, deal.profit, deal.marginPct);
  const meta = [
    deal.year ? String(deal.year) : null,
    deal.km !== null ? `${deal.km.toLocaleString("ro-RO")} km` : null,
    deal.location || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{deal.title}</p>
          {meta && <p className="mt-0.5 text-xs text-soft">{meta}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${badgeClass[verdict.status]}`}
        >
          +{eur(deal.profit)}
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
    </Card>
  );
}
