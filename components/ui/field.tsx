import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-field border border-line bg-white px-3 py-2.5 text-[15px] text-ink " +
  "placeholder:text-soft/70 focus-visible:border-go focus-visible:outline-2 " +
  "focus-visible:outline-offset-1 focus-visible:outline-go";

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
      <span className="text-xs font-medium text-soft">{label}</span>
      <input className={controlClass} {...props} />
      {hint && <span className="text-xs leading-snug text-soft">{hint}</span>}
    </label>
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
  rows = 5,
  ...props
}: TextareaFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", wide && "sm:col-span-2", className)}>
      <span className="text-xs font-medium text-soft">{label}</span>
      <textarea rows={rows} className={cn(controlClass, "resize-y leading-relaxed")} {...props} />
      {hint && <span className="text-xs leading-snug text-soft">{hint}</span>}
    </label>
  );
}
