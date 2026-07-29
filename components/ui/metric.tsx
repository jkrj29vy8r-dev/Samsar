import { cn } from "@/lib/cn";

type MetricSize = "md" | "lg";
type MetricTone = "ink" | "go" | "warn" | "stop";

interface MetricProps {
  /** Eticheta cifrei (ex. „dai pe ea”, „se vinde în”). */
  label: string;
  /** Valoarea deja formatată (ex. „9.200 €”, „21 zile”). */
  value: string;
  /** „lg” = cifra mare din cardul-verdict. */
  size?: MetricSize;
  tone?: MetricTone;
}

const sizeClass: Record<MetricSize, string> = {
  md: "text-xl font-semibold",
  lg: "text-[40px] font-bold leading-none tracking-tight",
};

const toneClass: Record<MetricTone, string> = {
  ink: "text-ink",
  go: "text-go",
  warn: "text-warn",
  stop: "text-stop",
};

/** Cifră de bani cu aliniere tabulară — clară și lizibilă. */
export function Metric({ label, value, size = "md", tone = "ink" }: MetricProps) {
  return (
    <div>
      <div className="text-xs font-medium text-soft">{label}</div>
      <div
        className={cn(
          "mt-1 tabular-nums",
          sizeClass[size],
          toneClass[tone],
        )}
      >
        {value}
      </div>
    </div>
  );
}
