"use client";

import { cn } from "@/lib/cn";

interface SegmentedProps {
  label: string;
  options: string[];
  value: string;
  /** Un al doilea click pe opțiunea activă o deselectează. */
  onChange: (value: string) => void;
}

/** Selector segmentat pe sticlă — mai rapid pe telefon decât un câmp liber. */
export function Segmented({ label, options, value, onChange }: SegmentedProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-soft">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-2xl border border-white/70 bg-white/45 p-1 backdrop-blur-md"
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(active ? "" : option)}
              className={cn(
                "flex-1 rounded-xl px-2 py-2 text-sm font-medium transition",
                active
                  ? "brand-gradient text-white shadow-[0_6px_16px_-6px_rgba(16,185,129,0.7)]"
                  : "text-soft hover:text-ink",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
