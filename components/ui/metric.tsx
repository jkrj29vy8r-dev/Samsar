import { cn } from "@/lib/cn";

type MetricSize = "md" | "lg";
type MetricTone = "ink" | "go" | "warn" | "stop";

interface MetricProps {
  /** Eticheta cifrei (ex. „dai pe ea”, „se vinde în”). */
  label: string;
  /** Valoarea deja formatată (ex. „9.200 €”, „21 zile”). */
  value: string;
  /** „lg” = cifra mare de tip odometru din cardul-verdict. */
  size?: MetricSize;
  tone?: MetricTone;
}

const sizeClass: Record<MetricSize, string> = {
  md: "text-[19px] font-semibold",
  lg: "text-[42px] font-bold leading-[1.05] tracking-tight",
};

const toneClass: Record<MetricTone, string> = {
  ink: "text-ink",
  go: "text-go",
  warn: "text-warn",
  stop: "text-stop",
};

/** Cifră de bani în monospace tabular — aliniere de odometru. */
export function Metric({ label, value, size = "md", tone = "ink" }: MetricProps) {
  return (
    <div>
      <div className="text-[11px] tracking-wide text-soft">{label}</div>
      <div
        className={cn(
          "mt-0.5 font-mono tabular-nums",
          sizeClass[size],
          toneClass[tone],
        )}
      >
        {value}
      </div>
    </div>
  );
}
