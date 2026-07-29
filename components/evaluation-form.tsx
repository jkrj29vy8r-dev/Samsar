"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardNote } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { PhotoUpload, type PhotoPreview } from "@/components/ui/photo-upload";
import { ComparablesField } from "@/components/comparables-field";
import { EvaluationResultView } from "@/components/evaluation-result";
import {
  ALLOWED_IMAGE_TYPES,
  type CarDetails,
  type EvaluationResult,
  type ImageMediaType,
} from "@/types/evaluation";

interface CarPhoto extends PhotoPreview {
  file: File;
}

type Status = "idle" | "loading" | "error";

const MAX_PHOTOS = 6;

function isAllowedType(type: string): type is ImageMediaType {
  return (ALLOWED_IMAGE_TYPES as string[]).includes(type);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("nu am putut citi poza"));
    reader.readAsDataURL(file);
  });
}

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

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

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

  const car: CarDetails = {
    model,
    year,
    km,
    engine,
    fuel,
    gearbox,
    extras,
    askPrice,
  };

  const canSubmit =
    askPrice.trim() !== "" && year.trim() !== "" && comps.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "loading") return;

    setStatus("loading");
    setError("");
    try {
      const usable = photos.filter((p) => isAllowedType(p.file.type));
      const photoPayload = await Promise.all(
        usable.map(async (p) => ({
          mediaType: p.file.type as ImageMediaType,
          data: await fileToBase64(p.file),
        })),
      );

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car, comps, photos: photoPayload }),
      });

      const data: { result?: EvaluationResult; error?: string } = await res.json();
      if (!res.ok || !data.result) {
        throw new Error(data.error ?? "Ceva n-a mers.");
      }

      setResult(data.result);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ceva n-a mers.");
      setStatus("error");
    }
  }

  function reset() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setModel("");
    setYear("");
    setKm("");
    setEngine("");
    setFuel("");
    setGearbox("");
    setAskPrice("");
    setExtras("");
    setComps("");
    setResult(null);
    setError("");
    setStatus("idle");
  }

  if (result) {
    return <EvaluationResultView car={car} result={result} onReset={reset} />;
  }

  const loading = status === "loading";

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

      {status === "error" && (
        <Card>
          <p className="text-sm font-semibold text-stop">Evaluarea nu a mers</p>
          <p className="mt-1 text-sm leading-relaxed text-soft">{error}</p>
        </Card>
      )}

      <Button type="submit" fullWidth disabled={!canSubmit || loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Compar cu piața…
          </span>
        ) : canSubmit ? (
          "Evaluează deal-ul"
        ) : (
          "Completează preț, an și comparabile"
        )}
      </Button>
    </form>
  );
}
