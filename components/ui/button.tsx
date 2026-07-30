import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Se întinde pe toată lățimea — util pentru CTA-ul principal pe telefon. */
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-2xl font-sans font-semibold tracking-tight " +
  "transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed " +
  "disabled:active:scale-100 disabled:hover:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "brand-gradient px-5 py-3.5 text-[15px] text-white " +
    "shadow-[0_10px_24px_-8px_rgba(16,185,129,0.75)] hover:-translate-y-0.5 " +
    "hover:brightness-105 hover:shadow-[0_16px_32px_-10px_rgba(16,185,129,0.8)] " +
    "disabled:opacity-50 disabled:shadow-none",
  secondary:
    "border border-white/65 bg-white/55 px-5 py-3 text-sm text-ink backdrop-blur-md " +
    "hover:bg-white/75 disabled:opacity-50",
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
