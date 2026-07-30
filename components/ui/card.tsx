import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  /** Eticheta scurtă din capul cardului (majuscule, discretă). */
  label?: ReactNode;
  /** Element la dreapta etichetei — ex. „opțional” sau un buton. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ label, action, className, children }: CardProps) {
  const hasHeader = label != null || action != null;

  return (
    <section className={cn("glass rise rounded-3xl p-5", className)}>
      {hasHeader && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {label != null && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mute">
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

/** Notă discretă pentru capul cardului (ex. „opțional”). */
export function CardNote({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-medium normal-case text-soft">
      {children}
    </span>
  );
}
