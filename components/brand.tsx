import { cn } from "@/lib/cn";

interface BrandProps {
  /** Ascunde subtitlul „cât dai · cât ceri · cât scoți”. */
  hideTagline?: boolean;
  className?: string;
}

/** Semnătura vizuală: tab verde de curse + logotipul monospace. */
export function Brand({ hideTagline = false, className }: BrandProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="h-[22px] w-2.5 rounded-[2px] bg-go shadow-[2px_0_0_var(--color-ink)]"
        />
        <span className="font-mono text-[22px] font-bold tracking-tight text-ink">
          samsar
        </span>
      </div>
      {!hideTagline && (
        <p className={cn("mt-1.5 font-mono text-[11.5px] tracking-wide text-soft")}>
          cât dai · cât ceri · cât scoți
        </p>
      )}
    </div>
  );
}
