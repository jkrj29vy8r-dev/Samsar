import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  ALLOWED_IMAGE_TYPES,
  type EvaluationInput,
  type EvaluationPhoto,
  type EvaluationResult,
  type ImageMediaType,
} from "@/types/evaluation";
import {
  EVALUATION_SYSTEM,
  buildUserText,
  evaluationSchema,
} from "@/lib/evaluation-prompt";

// Cheia stă pe server; apelul către Anthropic se face de aici, nu din client.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PHOTOS = 6;

function isImageMediaType(value: unknown): value is ImageMediaType {
  return (
    typeof value === "string" &&
    (ALLOWED_IMAGE_TYPES as string[]).includes(value)
  );
}

function isPhoto(value: unknown): value is EvaluationPhoto {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return isImageMediaType(p.mediaType) && typeof p.data === "string";
}

/** Validează forma cererii; întoarce un mesaj de eroare (în română) sau null. */
function validate(body: unknown): { input: EvaluationInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Cerere invalidă." };
  const b = body as Record<string, unknown>;

  const car = b.car;
  if (typeof car !== "object" || car === null) return { error: "Lipsesc datele mașinii." };
  const c = car as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const carDetails = {
    model: str(c.model),
    year: str(c.year),
    km: str(c.km),
    engine: str(c.engine),
    fuel: str(c.fuel),
    gearbox: str(c.gearbox),
    extras: str(c.extras),
    askPrice: str(c.askPrice),
  };

  const comps = typeof b.comps === "string" ? b.comps : "";

  if (carDetails.year.trim() === "" || carDetails.askPrice.trim() === "") {
    return { error: "Completează anul și prețul cerut." };
  }
  if (comps.trim() === "") {
    return { error: "Adaugă anunțuri comparabile." };
  }

  const rawPhotos = b.photos;
  if (rawPhotos !== undefined && !Array.isArray(rawPhotos)) {
    return { error: "Format poze invalid." };
  }
  const photos = Array.isArray(rawPhotos) ? rawPhotos : [];
  if (photos.length > MAX_PHOTOS) return { error: `Maxim ${MAX_PHOTOS} poze.` };
  if (!photos.every(isPhoto)) return { error: "Una dintre poze e invalidă." };

  return { input: { car: carDetails, comps, photos } };
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const checked = validate(body);
  if ("error" in checked) {
    return NextResponse.json({ error: checked.error }, { status: 400 });
  }
  const { input } = checked;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serviciul de evaluare nu e configurat momentan." },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  const content: Anthropic.ContentBlockParam[] = [];
  for (const photo of input.photos) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: photo.mediaType, data: photo.data },
    });
  }
  content.push({ type: "text", text: buildUserText(input) });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      system: EVALUATION_SYSTEM,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: evaluationSchema },
      },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "Evaluarea nu a putut fi făcută pentru datele astea." },
        { status: 422 },
      );
    }

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const result = JSON.parse(text) as EvaluationResult;
    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
    } else {
      console.error("Evaluate route error:", error);
    }
    return NextResponse.json(
      { error: "Nu am putut face evaluarea acum. Încearcă din nou." },
      { status: 502 },
    );
  }
}
