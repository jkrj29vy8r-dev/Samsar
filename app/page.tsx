import Link from "next/link";
import { cn } from "@/lib/cn";

const chips: { label: string; cls: string; dot: string }[] = [
  { label: "merită", cls: "bg-go-soft text-go", dot: "bg-go" },
  { label: "marjă subțire", cls: "bg-warn-soft text-warn", dot: "bg-warn" },
  { label: "nu iese", cls: "bg-stop-soft text-stop", dot: "bg-stop" },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass flex w-full max-w-md flex-col items-center gap-7 rounded-[2rem] px-8 py-12 text-center">
        <span
          aria-hidden
          className="brand-gradient flex h-14 w-14 items-center justify-center rounded-3xl text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.8)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>

        <div>
          <h1 className="text-gradient text-6xl font-extrabold tracking-tight sm:text-7xl">
            Verdikt
          </h1>
          <p className="mt-3 text-base text-soft">
            Afli pe loc dacă mașina merită.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {chips.map((c) => (
            <span
              key={c.label}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
                c.cls,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", c.dot)} />
              {c.label}
            </span>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <Link
            href="/gaseste"
            className="brand-gradient rounded-2xl px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.75)] transition hover:brightness-105 active:scale-[0.98]"
          >
            Găsește-mi un deal →
          </Link>
          <Link
            href="/evalueaza"
            className="rounded-2xl border border-white/65 bg-white/55 px-6 py-3.5 text-[15px] font-semibold text-ink backdrop-blur-md transition hover:bg-white/75 active:scale-[0.98]"
          >
            Evaluează o mașină anume
          </Link>
        </div>
      </div>
    </main>
  );
}
