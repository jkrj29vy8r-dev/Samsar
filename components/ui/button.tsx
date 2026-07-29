import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Se întinde pe toată lățimea — util pentru CTA-ul principal pe telefon. */
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-btn font-sans font-semibold tracking-tight " +
  "transition-transform active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-go px-4 py-3.5 text-[15px] text-white disabled:bg-disabled disabled:text-disabled-ink",
  secondary:
    "border border-line bg-transparent px-4 py-3 text-sm text-soft hover:border-soft " +
    "disabled:text-disabled-ink disabled:hover:border-line",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
