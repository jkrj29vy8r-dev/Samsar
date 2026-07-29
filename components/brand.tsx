import { cn } from "@/lib/cn";

interface BrandProps {
  /** Ascunde tagline-ul de sub logotip. */
  hideTagline?: boolean;
  className?: string;
}

/** Semnătura Verdikt: badge cu bifă în gradient + logotip cu text-gradient. */
export function Brand({ hideTagline = false, className }: BrandProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className="brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.75)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div className="flex flex-col">
        <span className="text-gradient text-2xl font-extrabold tracking-tight">
          Verdikt
        </span>
        {!hideTagline && (
          <span className="text-xs font-medium text-soft">
            merită sau nu — afli din prima
          </span>
        )}
      </div>
    </div>
  );
}
