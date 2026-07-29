import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { EvaluationForm } from "@/components/evaluation-form";

export const metadata: Metadata = {
  title: "Evaluează o mașină — Verdikt",
  description:
    "Completează detaliile mașinii și anunțurile comparabile ca să afli cât să dai, cât să ceri și ce profit poți scoate.",
};

export default function EvaluatePage() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="Acasă">
          <Brand hideTagline />
        </Link>
      </header>
      <EvaluationForm />
    </div>
  );
}
