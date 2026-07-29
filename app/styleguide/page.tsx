import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardNote } from "@/components/ui/card";
import { Field, TextareaField } from "@/components/ui/field";
import { Metric } from "@/components/ui/metric";
import { VerdictCard } from "@/components/ui/verdict-card";

export const metadata: Metadata = {
  title: "Ghid de stil — Samsar",
  description: "Tokenii și componentele de bază ale sistemului de design Samsar.",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
        {title}
      </h2>
      {children}
    </section>
  );
}

const palette: { name: string; swatch: string; hex: string; ring?: boolean }[] = [
  { name: "paper", swatch: "bg-paper", hex: "#EEF0EC", ring: true },
  { name: "card", swatch: "bg-card", hex: "#FBFCFA", ring: true },
  { name: "ink", swatch: "bg-ink", hex: "#16201B" },
  { name: "soft", swatch: "bg-soft", hex: "#5B645E" },
  { name: "line", swatch: "bg-line", hex: "#D5D9D2", ring: true },
  { name: "go", swatch: "bg-go", hex: "#1F6E43" },
  { name: "warn", swatch: "bg-warn", hex: "#B0700F" },
  { name: "stop", swatch: "bg-stop", hex: "#A5382C" },
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-9 px-4 py-8">
      <header className="flex flex-col gap-2">
        <Brand />
        <p className="text-sm leading-relaxed text-soft">
          Sistemul de design: fundal de hârtie, verde de curse, cifre de odometru
          și verdict de semafor.
        </p>
      </header>

      {/* CULORI */}
      <Section title="Culori">
        <Card>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.map((c) => (
              <li key={c.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-14 w-full rounded-[10px] ${c.swatch} ${
                    c.ring ? "ring-1 ring-inset ring-line" : ""
                  }`}
                />
                <span className="font-mono text-xs text-ink">{c.name}</span>
                <span className="font-mono text-[11px] text-soft">{c.hex}</span>
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
              <div className="text-[11px] uppercase tracking-wide text-soft">
                Sans · interfață
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
                Cât dai, cât ceri, cât scoți
              </p>
              <p className="mt-1 text-sm leading-relaxed text-soft">
                Text de corp pentru descrieri și explicații, ușor de citit pe
                telefon.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <div className="text-[11px] uppercase tracking-wide text-soft">
                Mono tabular · bani (odometru)
              </div>
              <div className="mt-2 flex flex-col gap-0.5 font-mono text-2xl font-semibold tabular-nums text-ink">
                <span>9.200 €</span>
                <span>12.500 €</span>
                <span>128.000 km</span>
              </div>
              <p className="mt-2 text-xs text-soft">
                Cifrele se aliniază pe coloană — senzație de odometru.
              </p>
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
        <Card label="Card standard" action={<CardNote>opțional</CardNote>}>
          <p className="text-[14.5px] leading-relaxed text-ink">
            Colțuri rotunjite, linie subțire, fundal aproape alb pe hârtie. Baza
            pentru orice secțiune.
          </p>
        </Card>
        <Card
          variant="quiet"
          label="Card discret"
          action={
            <Button variant="secondary" className="px-2.5 py-1 text-[11px]">
              copiază
            </Button>
          }
        >
          <p className="text-[14.5px] leading-relaxed text-ink">
            Varianta „quiet”, cu contur punctat, pentru context secundar precum
            raționamentul din spatele evaluării.
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
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
            <Metric label="dai pe ea" value="9.200 €" />
            <Metric label="ceri la vânzare" value="12.500 €" />
            <Metric label="marjă brută" value="3.300 €" />
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
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
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
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
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
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
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
