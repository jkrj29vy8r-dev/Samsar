import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { VerdictStatus } from "@/types/verdict";

interface VerdictStyle {
  chip: string;
  dot: string;
  num: string;
  glow: string;
}

const styles: Record<VerdictStatus, VerdictStyle> = {
  go: { chip: "bg-go-soft text-go", dot: "bg-go", num: "text-go", glow: "bg-go/30" },
  warn: {
    chip: "bg-warn-soft text-warn",
    dot: "bg-warn",
    num: "text-warn",
    glow: "bg-warn/30",
  },
  stop: {
    chip: "bg-stop-soft text-stop",
    dot: "bg-stop",
    num: "text-stop",
    glow: "bg-stop/30",
  },
  neutral: {
    chip: "bg-slate-500/10 text-soft",
    dot: "bg-soft",
    num: "text-ink",
    glow: "bg-slate-400/25",
  },
};

interface VerdictCardProps {
  status: VerdictStatus;
  /** Verdictul: „Merită” / „Marjă subțire” / „Nu iese”. */
  label: string;
  /** Cifra mare, deja formatată (ex. „2.300 €”). */
  netValue: string;
  /** Eticheta de deasupra cifrei (ex. „profit net estimat”). */
  netLabel: string;
  /** Detaliu scurt sub cifră. */
  sub?: string;
  /** Notă de încredere afișată în dreapta chip-ului. */
  confidence?: string;
  /** Conținut sub separator — de obicei un grid de <Metric />. */
  children?: ReactNode;
}

/**
 * Cardul-verdict: sticlă mată cu un glow colorat după verdict,
 * chip cu bulină de semafor și cifra mare de profit.
 */
export function VerdictCard({
  status,
  label,
  netValue,
  netLabel,
  sub,
  confidence,
  children,
}: VerdictCardProps) {
  const s = styles[status];

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-5">
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-12 right-4 h-28 w-44 rounded-full blur-3xl",
          s.glow,
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              s.chip,
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", s.dot)} />
            {label}
          </span>
          {confidence && <span className="text-xs text-soft">{confidence}</span>}
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-mute">
          {netLabel}
        </p>
        <p
          className={cn(
            "mt-1 text-[40px] font-bold leading-none tracking-tight tabular-nums",
            s.num,
          )}
        >
          {netValue}
        </p>
        {sub && <p className="mt-2 text-sm text-soft">{sub}</p>}

        {children && (
          <>
            <div className="my-4 h-px bg-slate-900/5" />
            {children}
          </>
        )}
      </div>
    </section>
  );
}
