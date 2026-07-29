"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardNote } from "@/components/ui/card";
import { Field, TextareaField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { PhotoUpload, type PhotoPreview } from "@/components/ui/photo-upload";

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
  const [ready, setReady] = useState(false);

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
    if (canSubmit) setReady(true);
  }

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

      <Card>
        <TextareaField
          label="Anunțuri comparabile"
          rows={6}
          placeholder={"Lipește 10–20 anunțuri similare (același model, an și km apropiate).\n\nex.\nPassat 2017 175.000 km – 11.400 € – Cluj\nPassat 2018 160.000 km – 12.900 € – București"}
          value={comps}
          onChange={(e) => setComps(e.target.value)}
          hint="Deocamdată le lipești manual."
        />
      </Card>

      <Button type="submit" fullWidth disabled={!canSubmit}>
        {canSubmit ? "Evaluează deal-ul" : "Completează preț, an și comparabile"}
      </Button>

      {ready && (
        <div className="glass flex items-start gap-3 rounded-3xl p-4">
          <span
            aria-hidden
            className="brand-gradient mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
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
            <p className="font-semibold text-ink">Datele sunt gata de evaluare</p>
            <p className="text-sm leading-relaxed text-soft">
              Motorul care compară cu piața și calculează marja se conectează în
              pasul următor.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
