"use client";

import type { ChangeEvent } from "react";
import { cn } from "@/lib/cn";

export interface PhotoPreview {
  id: string;
  url: string;
}

interface PhotoUploadProps {
  photos: PhotoPreview[];
  max?: number;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}

/** Grid de poze cu miniaturi, buton de ștergere și o dală de adăugare. */
export function PhotoUpload({ photos, max = 6, onAdd, onRemove }: PhotoUploadProps) {
  const canAddMore = photos.length < max;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd(files);
    e.target.value = "";
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/70 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`Poză mașină ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label={`Șterge poza ${index + 1}`}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-ink shadow backdrop-blur-sm transition hover:bg-white"
            >
              ×
            </button>
          </div>
        ))}

        {canAddMore && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-400/50 bg-white/40 text-soft transition hover:border-go hover:text-go">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleChange}
            />
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L8 6H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4l-1.5-2Z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span className="text-[11px] font-medium">adaugă</span>
          </label>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-soft">
        {photos.length === 0
          ? "Din poze estimez starea: rugină, lovituri, vopsit, uzură."
          : `${photos.length} din ${max} poze. Le poți șterge cu ×.`}
      </p>
    </div>
  );
}
