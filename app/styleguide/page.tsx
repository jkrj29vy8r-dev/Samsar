import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardNote } from "@/components/ui/card";
import { Field, TextareaField } from "@/components/ui/field";
import { Metric } from "@/components/ui/metric";
import { VerdictCard } from "@/components/ui/verdict-card";

export const metadata: Metadata = {
  title: "Ghid de stil — Verdikt",
  description: "Tokenii și componentele de bază ale sistemului de design Verdikt.",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
        {title}
      </h2>
      {children}
    </section>
  );
}

const palette: { name: string; swatch: string; ring?: boolean }[] = [
  { name: "ink", swatch: "bg-ink" },
  { name: "soft", swatch: "bg-soft" },
  { name: "mute", swatch: "bg-mute" },
  { name: "go", swatch: "bg-go" },
  { name: "go-soft", swatch: "bg-go-soft", ring: true },
  { name: "warn", swatch: "bg-warn" },
  { name: "warn-soft", swatch: "bg-warn-soft", ring: true },
  { name: "stop", swatch: "bg-stop" },
  { name: "stop-soft", swatch: "bg-stop-soft", ring: true },
  { name: "brand", swatch: "brand-gradient" },
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-9 px-4 py-8">
      <header className="flex flex-col gap-3">
        <Brand />
        <p className="text-sm leading-relaxed text-soft">
          Sistemul de design: auroră colorată, suprafețe de sticlă, accent de
          brand și verdict de semafor.
        </p>
      </header>

      {/* CULORI */}
      <Section title="Culori">
        <Card>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.map((c) => (
              <li key={c.name} className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-14 w-full rounded-2xl",
                    c.swatch,
                    c.ring && "ring-1 ring-inset ring-slate-900/10",
                  )}
                />
                <span className="text-xs font-medium text-ink">{c.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* TIPOGRAFIE */}
      <Section title="Tipografie">
        <Card>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-mute">
                Titlu cu gradient
              </div>
              <p className="text-gradient mt-1 text-3xl font-extrabold tracking-tight">
                Merită sau nu
              </p>
            </div>
            <div className="border-t border-slate-900/5 pt-4">
              <div className="text-[11px] uppercase tracking-wide text-mute">
                Corp și cifre tabulare
              </div>
              <p className="mt-1 text-sm leading-relaxed text-soft">
                Text de corp pentru descrieri și explicații, ușor de citit pe
                telefon.
              </p>
              <div className="mt-2 flex flex-col gap-0.5 text-2xl font-semibold tabular-nums text-ink">
                <span>9.200 €</span>
                <span>12.500 €</span>
                <span>128.000 km</span>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* BUTOANE */}
      <Section title="Butoane">
        <Card>
          <div className="flex flex-col gap-3">
            <Button fullWidth>Evaluează deal-ul</Button>
            <Button variant="secondary" fullWidth>
              ← Evaluează altă mașină
            </Button>
            <Button fullWidth disabled>
              Completează preț, an și comparabile
            </Button>
          </div>
        </Card>
      </Section>

      {/* CARDURI */}
      <Section title="Carduri">
        <Card label="Card de sticlă" action={<CardNote>opțional</CardNote>}>
          <p className="text-[14.5px] leading-relaxed text-ink">
            Suprafață translucidă cu blur, colțuri generoase și umbră fină. Baza
            pentru orice secțiune.
          </p>
        </Card>
        <Card
          label="Card cu acțiune"
          action={
            <Button variant="secondary" className="px-3 py-1.5 text-[12px]">
              copiază
            </Button>
          }
        >
          <p className="text-[14.5px] leading-relaxed text-ink">
            Același card, cu un buton discret în capul lui pentru acțiuni rapide.
          </p>
        </Card>
      </Section>

      {/* FORMULAR */}
      <Section title="Câmpuri de formular">
        <Card label="Detalii">
          <div className="grid grid-cols-2 gap-2.5">
            <Field wide label="Marcă și model" placeholder="ex. VW Passat 2.0 TDI" />
            <Field label="An" placeholder="2017" inputMode="numeric" />
            <Field label="Km" placeholder="180000" inputMode="numeric" />
            <Field
              label="Preț cerut (€)"
              placeholder="10500"
              inputMode="numeric"
              hint="Prețul din anunț."
            />
            <Field label="Combustibil" placeholder="diesel" />
          </div>
          <div className="mt-3">
            <TextareaField
              label="Anunțuri comparabile"
              placeholder={"Passat 2017 175.000 km – 11.400 € – Cluj\nPassat 2018 160.000 km – 12.900 € – București"}
              hint="Lipești manual 10–20 anunțuri similare."
            />
          </div>
        </Card>
      </Section>

      {/* METRICI */}
      <Section title="Metrici">
        <Card label="Cifre pe rând">
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
            <Metric label="dai pe ea" value="9.200 €" />
            <Metric label="ceri la vânzare" value="12.500 €" />
            <Metric label="marjă brută" value="3.300 €" tone="go" />
            <Metric label="se vinde în" value="21 zile" />
          </div>
        </Card>
      </Section>

      {/* VERDICT */}
      <Section title="Card-verdict (semafor)">
        <VerdictCard
          status="go"
          label="Merită"
          confidence="încredere mare"
          netLabel="profit net estimat"
          netValue="2.300 €"
          sub="marjă sănătoasă pentru un flip"
        >
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
            <Metric label="dai pe ea" value="9.200 €" />
            <Metric label="ceri la vânzare" value="12.500 €" />
            <Metric label="marjă brută" value="3.300 €" />
            <Metric label="se vinde în" value="21 zile" />
          </div>
        </VerdictCard>

        <VerdictCard
          status="warn"
          label="Marjă subțire"
          confidence="încredere medie"
          netLabel="profit net estimat"
          netValue="640 €"
          sub="sub 8% — puțin loc de greșeală"
        >
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
            <Metric label="dai pe ea" value="8.900 €" />
            <Metric label="ceri la vânzare" value="10.100 €" />
            <Metric label="marjă brută" value="1.200 €" />
            <Metric label="se vinde în" value="34 zile" />
          </div>
        </VerdictCard>

        <VerdictCard
          status="stop"
          label="Nu iese"
          confidence="încredere mare"
          netLabel="profit net estimat"
          netValue="−450 €"
          sub="profitul net e zero sau negativ"
        >
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
            <Metric label="dai pe ea" value="11.000 €" />
            <Metric label="ceri la vânzare" value="11.400 €" />
            <Metric label="marjă brută" value="400 €" />
            <Metric label="se vinde în" value="52 zile" />
          </div>
        </VerdictCard>
      </Section>
    </div>
  );
}
