import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-mono text-5xl font-bold tracking-tight text-ink sm:text-7xl">
        Samsar
      </h1>
      <p className="font-mono text-sm tracking-wide text-soft sm:text-base">
        cât dai · cât ceri · cât scoți
      </p>
      <Link
        href="/styleguide"
        className="mt-2 rounded-btn border border-line px-4 py-2 text-sm font-medium text-soft hover:border-soft"
      >
        Ghid de stil →
      </Link>
    </main>
  );
}
