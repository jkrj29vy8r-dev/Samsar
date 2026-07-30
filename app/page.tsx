import Link from "next/link";
import { cn } from "@/lib/cn";

const chips: { label: string; cls: string; dot: string }[] = [
  { label: "merită", cls: "bg-go-soft text-go", dot: "bg-go" },
  { label: "marjă subțire", cls: "bg-warn-soft text-warn", dot: "bg-warn" },
  { label: "nu iese", cls: "bg-stop-soft text-stop", dot: "bg-stop" },
];

const steps: { n: string; title: string; desc: string }[] = [
  { n: "1", title: "Pui datele", desc: "marca, anul, km-ii — și poze dacă ai" },
  { n: "2", title: "Compar cu piața", desc: "caut anunțuri reale și fac media" },
  { n: "3", title: "Afli verdictul", desc: "cât dai, cât ceri, ce profit scoți" },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 py-14">
      <section className="glass gradient-ring rise flex w-full max-w-md flex-col items-center gap-7 rounded-[2rem] px-8 py-12 text-center">
        <span
          aria-hidden
          className="brand-gradient floaty flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-[0_18px_36px_-12px_rgba(16,185,129,0.85)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-3 py-1 text-xs font-semibold text-soft backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-go" />
            evaluare mașini pentru revânzare
          </span>
          <h1 className="text-gradient mt-4 text-6xl font-extrabold tracking-tight sm:text-7xl">
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
            className="brand-gradient hover-lift rounded-2xl px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.75)] transition hover:brightness-105 active:scale-[0.98]"
          >
            Găsește-mi un deal →
          </Link>
          <Link
            href="/evalueaza"
            className="hover-lift rounded-2xl border border-white/65 bg-white/55 px-6 py-3.5 text-[15px] font-semibold text-ink backdrop-blur-md transition hover:bg-white/75 active:scale-[0.98]"
          >
            Evaluează o mașină anume
          </Link>
        </div>
      </section>

      <section
        className="glass rise w-full max-w-md rounded-[1.75rem] px-6 py-6"
        style={{ animationDelay: "0.12s" }}
      >
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
          cum funcționează
        </p>
        <ol className="flex flex-col gap-4">
          {steps.map((s) => (
            <li key={s.n} className="flex items-start gap-3.5">
              <span className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(16,185,129,0.7)]">
                {s.n}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                <p className="text-sm leading-snug text-soft">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
