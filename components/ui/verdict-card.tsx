import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { VerdictStatus } from "@/types/verdict";

interface VerdictStyle {
  card: string;
  band: string;
  net: string;
}

const styles: Record<VerdictStatus, VerdictStyle> = {
  go: { card: "border-go-line bg-go-soft", band: "bg-go", net: "text-go" },
  warn: { card: "border-warn-line bg-warn-soft", band: "bg-warn", net: "text-warn" },
  stop: { card: "border-stop-line bg-stop-soft", band: "bg-stop", net: "text-stop" },
  neutral: { card: "border-line bg-card", band: "bg-soft", net: "text-ink" },
};

interface VerdictCardProps {
  status: VerdictStatus;
  /** Banda de semafor: „Merită” / „Marjă subțire” / „Nu iese”. */
  label: string;
  /** Cifra mare, deja formatată (ex. „2.300 €”). */
  netValue: string;
  /** Eticheta de deasupra cifrei (ex. „profit net estimat”). */
  netLabel: string;
  /** Detaliu scurt sub cifră. */
  sub?: string;
  /** Notă de încredere afișată monospace în dreapta benzii. */
  confidence?: string;
  /** Conținut sub linia perforată — de obicei un grid de <Metric />. */
  children?: ReactNode;
}

/**
 * Cardul-verdict („deal ticket”): bandă de semafor, cifra mare tip odometru
 * și linia perforată care îi dă senzația de bon/tichet.
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
    <section className={cn("relative overflow-hidden rounded-ticket border p-5", s.card)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white",
            s.band,
          )}
        >
          {label}
        </span>
        {confidence && (
          <span className="font-mono text-[11px] text-soft">{confidence}</span>
        )}
      </div>

      <p className="mt-3.5 text-[11px] font-bold uppercase tracking-wider text-soft">
        {netLabel}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-[42px] font-bold leading-[1.05] tracking-tight tabular-nums",
          s.net,
        )}
      >
        {netValue}
      </p>
      {sub && <p className="mt-1.5 text-[13px] text-soft">{sub}</p>}

      {children && (
        <>
          <Perforation />
          {children}
        </>
      )}
    </section>
  );
}

/** Linie punctată full-bleed cu două scobituri la margini — senzația de tichet. */
function Perforation() {
  return (
    <div aria-hidden className="relative -mx-5 my-4 border-t border-dashed border-line">
      <span className="absolute -top-2 left-0 h-4 w-4 -translate-x-1/2 rounded-full bg-paper" />
      <span className="absolute -top-2 right-0 h-4 w-4 translate-x-1/2 rounded-full bg-paper" />
    </div>
  );
}
