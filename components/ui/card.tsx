import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "solid" | "quiet";

interface CardProps {
  /** Eticheta scurtă din capul cardului (majuscule, discretă). */
  label?: ReactNode;
  /** Element la dreapta etichetei — ex. „opțional” sau un buton de copiere. */
  action?: ReactNode;
  /** „quiet” = fundal transparent cu contur punctat, pentru context secundar. */
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}

const variants: Record<CardVariant, string> = {
  solid: "border border-line bg-card",
  quiet: "border border-dashed border-line bg-transparent",
};

export function Card({
  label,
  action,
  variant = "solid",
  className,
  children,
}: CardProps) {
  const hasHeader = label != null || action != null;

  return (
    <section className={cn("rounded-card p-4", variants[variant], className)}>
      {hasHeader && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {label != null && (
            <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-soft">
              {label}
            </span>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Notă discretă pentru capul cardului (ex. „opțional”, „se scad din profit”). */
export function CardNote({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-medium normal-case text-soft/75">{children}</span>;
}
