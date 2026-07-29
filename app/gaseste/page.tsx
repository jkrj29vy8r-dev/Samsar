import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { DealFinder } from "@/components/deal-finder";

export const metadata: Metadata = {
  title: "Găsește-mi un deal — Verdikt",
  description:
    "Spune ce mașină cauți și ce buget ai, iar Verdikt scoate anunțurile de sub prețul pieței cu profitul estimat la revânzare.",
};

export default function DealsPage() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="Acasă">
          <Brand hideTagline />
        </Link>
      </header>
      <DealFinder />
    </div>
  );
}
