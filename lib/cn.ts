export type ClassValue = string | number | false | null | undefined;

/** Lipește clase condiționat, ignorând valorile false / null / undefined. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
