"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import type { CarDetails, EvaluationResult as Result } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Metric } from "@/components/ui/metric";
import { VerdictCard } from "@/components/ui/verdict-card";
import { CountUp } from "@/components/ui/count-up";
import { computeVerdict, eur, num } from "@/lib/money";

interface EvaluationResultProps {
  car: CarDetails;
  result: Result;
  onReset: () => void;
}

interface Costs {
  recon: string;
  transport: string;
  taxe: string;
  alte: string;
}

export function EvaluationResultView({ car, result, onReset }: EvaluationResultProps) {
  const [costs, setCosts] = useState<Costs>({
    recon: "",
    transport: "",
    taxe: "",
    alte: "",
  });
  const [copied, setCopied] = useState(false);

  const setCost =
    (key: keyof Costs) => (e: ChangeEvent<HTMLInputElement>) =>
      setCosts((prev) => ({ ...prev, [key]: e.target.value }));

  const buy = num(result.pret_achizitie);
  const sell = num(result.pret_vanzare);
  const costsSum =
    num(costs.recon) + num(costs.transport) + num(costs.taxe) + num(costs.alte);
  const gross = sell - buy;
  const net = gross - costsSum;
  const marginPct = buy > 0 ? (net / buy) * 100 : 0;
  const askDelta = num(car.askPrice) - buy;
  const verdict = computeVerdict(buy, sell, net, marginPct);

  function copyDescription() {
    if (!result.descriere_anunt) return;
    navigator.clipboard?.writeText(result.descriere_anunt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <VerdictCard
        status={verdict.status}
        label={verdict.label}
        confidence={`încredere ${result.incredere}`}
        netLabel="profit net estimat"
        netValue={<CountUp value={net} format={eur} />}
        sub={verdict.sub}
      >
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
          <Metric label="dai pe ea" value={eur(buy)} />
          <Metric label="ceri la vânzare" value={eur(sell)} />
          <Metric label="marjă brută" value={eur(gross)} />
          <Metric
            label="se vinde în"
            value={`${num(result.zile_pana_la_vanzare)} zile`}
          />
        </div>
      </VerdictCard>

      {car.askPrice.trim() !== "" && askDelta !== 0 && (
        <Card>
          <p className="text-[14.5px] leading-relaxed text-ink">
            Vânzătorul cere <strong>{eur(num(car.askPrice))}</strong> —{" "}
            {askDelta > 0 ? (
              <>
                cu <strong>{eur(askDelta)}</strong> peste cât ar trebui să dai.
                Negociază.
              </>
            ) : (
              <>
                sub recomandarea ta cu <strong>{eur(Math.abs(askDelta))}</strong>.
                Posibil chilipir.
              </>
            )}
          </p>
        </Card>
      )}

      <Card label="Costurile tale">
        <div className="grid grid-cols-2 gap-2.5">
          <Field
            label="Recondiționare (€)"
            inputMode="numeric"
            placeholder="0"
            value={costs.recon}
            onChange={setCost("recon")}
          />
          <Field
            label="Transport (€)"
            inputMode="numeric"
            placeholder="0"
            value={costs.transport}
            onChange={setCost("transport")}
          />
          <Field
            label="ITP / taxe (€)"
            inputMode="numeric"
            placeholder="0"
            value={costs.taxe}
            onChange={setCost("taxe")}
          />
          <Field
            label="Comision / alte (€)"
            inputMode="numeric"
            placeholder="0"
            value={costs.alte}
            onChange={setCost("alte")}
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-900/5 pt-3 text-sm text-soft">
          <span>total costuri</span>
          <strong className="text-ink">{eur(costsSum)}</strong>
        </div>
      </Card>

      {result.observatii_stare.trim() !== "" && (
        <Card label="Stare din poze">
          <p className="text-[14.5px] leading-relaxed text-ink">
            {result.observatii_stare}
          </p>
        </Card>
      )}

      {result.descriere_anunt.trim() !== "" && (
        <Card
          label="Descriere pentru anunț"
          action={
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-[12px]"
              onClick={copyDescription}
            >
              {copied ? "copiat ✓" : "copiază"}
            </Button>
          }
        >
          <p className="text-[14.5px] leading-relaxed text-ink">
            {result.descriere_anunt}
          </p>
        </Card>
      )}

      {result.rationament.trim() !== "" && (
        <Card label="Pe ce se bazează">
          <p className="text-[14.5px] leading-relaxed text-ink">
            {result.rationament}
          </p>
        </Card>
      )}

      <Button variant="secondary" fullWidth onClick={onReset}>
        ← Evaluează altă mașină
      </Button>
    </div>
  );
}
