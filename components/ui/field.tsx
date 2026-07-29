import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-[15px] text-ink " +
  "backdrop-blur-md transition placeholder:text-mute focus-visible:border-go " +
  "focus-visible:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-0 " +
  "focus-visible:outline-go";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Text ajutător sub câmp. */
  hint?: string;
  /** Ocupă toată lățimea într-un grid pe două coloane. */
  wide?: boolean;
}

/**
 * Câmp de formular: eticheta înfășoară input-ul (asociere implicită, accesibilă),
 * deci componenta rămâne un server component.
 */
export function Field({ label, hint, wide, className, ...props }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", wide && "sm:col-span-2", className)}>
      <span className="text-[13px] font-medium text-soft">{label}</span>
      <input className={controlClass} {...props} />
      {hint && <span className="text-xs leading-snug text-soft">{hint}</span>}
    </label>
  );
}

/** Doar textarea-ul stilizat, fără etichetă — pentru cazuri cu antet propriu. */
export function Textarea({
  className,
  rows = 5,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClass, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  wide?: boolean;
}

export function TextareaField({
  label,
  hint,
  wide,
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", wide && "sm:col-span-2", className)}>
      <span className="text-[13px] font-medium text-soft">{label}</span>
      <Textarea {...props} />
      {hint && <span className="text-xs leading-snug text-soft">{hint}</span>}
    </label>
  );
}
