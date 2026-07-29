"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardNote } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { PhotoUpload, type PhotoPreview } from "@/components/ui/photo-upload";
import { ComparablesField } from "@/components/comparables-field";

interface CarPhoto extends PhotoPreview {
  file: File;
}

const MAX_PHOTOS = 6;

export function EvaluationForm() {
  const [photos, setPhotos] = useState<CarPhoto[]>([]);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [engine, setEngine] = useState("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [askPrice, setAskPrice] = useState("");
  const [extras, setExtras] = useState("");
  const [comps, setComps] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function addPhotos(files: File[]) {
    setPhotos((prev) => {
      const room = MAX_PHOTOS - prev.length;
      const next = files.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      }));
      return [...prev, ...next];
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  const canSubmit =
    askPrice.trim() !== "" && year.trim() !== "" && comps.trim() !== "";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (canSubmit) setSubmitted(true);
  }

  // Rezumatul datelor colectate — deocamdată doar le afișăm (fără API).
  const details: { label: string; value: string }[] = [
    { label: "Marcă și model", value: model },
    { label: "An", value: year },
    { label: "Km", value: km },
    { label: "Motorizare", value: engine },
    { label: "Combustibil", value: fuel },
    { label: "Cutie", value: gearbox },
    { label: "Dotări", value: extras },
    { label: "Preț cerut", value: askPrice ? `${askPrice} €` : "" },
  ].filter((row) => row.value.trim() !== "");

  const compsCount = comps
    .split("\n")
    .filter((line) => line.trim() !== "").length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card label="Poze mașină" action={<CardNote>opțional</CardNote>}>
        <PhotoUpload
          photos={photos}
          max={MAX_PHOTOS}
          onAdd={addPhotos}
          onRemove={removePhoto}
        />
      </Card>

      <Card label="Detalii">
        <div className="grid grid-cols-2 gap-2.5">
          <Field
            wide
            label="Marcă și model"
            placeholder="ex. VW Passat 2.0 TDI"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Field
            label="An"
            placeholder="2017"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Field
            label="Km"
            placeholder="180000"
            inputMode="numeric"
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
          <Field
            label="Motorizare"
            placeholder="2.0 TDI 150 cp"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
          />
          <Field
            label="Preț cerut (€)"
            placeholder="10500"
            inputMode="numeric"
            value={askPrice}
            onChange={(e) => setAskPrice(e.target.value)}
          />
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <Segmented
            label="Combustibil"
            options={["benzină", "diesel", "hibrid", "electric"]}
            value={fuel}
            onChange={setFuel}
          />
          <Segmented
            label="Cutie"
            options={["manuală", "automată"]}
            value={gearbox}
            onChange={setGearbox}
          />
        </div>

        <div className="mt-3">
          <Field
            label="Dotări principale"
            placeholder="piele, navi, trapă, jante 18"
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
          />
        </div>
      </Card>

      <ComparablesField value={comps} onChange={setComps} />

      <Button type="submit" fullWidth disabled={!canSubmit}>
        {canSubmit ? "Evaluează deal-ul" : "Completează preț, an și comparabile"}
      </Button>

      {submitted && (
        <Card label="Date colectate">
          <p className="mb-3 text-sm leading-relaxed text-soft">
            Deocamdată doar îți arăt ce am strâns. Evaluarea reală se conectează
            la pasul următor.
          </p>

          <dl className="divide-y divide-slate-900/5">
            <SummaryRow label="Poze" value={`${photos.length} din ${MAX_PHOTOS}`} />
            {details.map((row) => (
              <SummaryRow key={row.label} label={row.label} value={row.value} />
            ))}
            <SummaryRow
              label="Comparabile"
              value={`${compsCount} ${compsCount === 1 ? "anunț" : "anunțuri"}`}
            />
          </dl>

          <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/60 bg-white/50 p-3 text-[13px] leading-relaxed text-ink">
            {comps}
          </pre>
        </Card>
      )}
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="text-sm text-soft">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
