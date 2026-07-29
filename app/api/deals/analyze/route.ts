import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Deal, DealAnalysis } from "@/types/deal";
import {
  DEAL_ANALYSIS_SYSTEM,
  buildDealAnalysisText,
  dealAnalysisSchema,
} from "@/lib/deal-analysis";

// Cheia stă pe server; apelul către Anthropic se face de aici, nu din client.
export const runtime = "nodejs";
export const maxDuration = 60;

function validate(
  body: unknown,
): { deal: Deal; median: number; comps: string } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Cerere invalidă." };
  }
  const b = body as Record<string, unknown>;

  const rawDeal = b.deal;
  if (typeof rawDeal !== "object" || rawDeal === null) {
    return { error: "Lipsește anunțul de analizat." };
  }
  const d = rawDeal as Record<string, unknown>;

  const num = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  const price = num(d.price);
  if (price === null) return { error: "Anunț fără preț valid." };

  const deal: Deal = {
    title: typeof d.title === "string" ? d.title : "",
    year: num(d.year),
    km: num(d.km),
    location: typeof d.location === "string" ? d.location : "",
    url: typeof d.url === "string" ? d.url : "",
    price,
    resale: num(d.resale) ?? 0,
    profit: num(d.profit) ?? 0,
    marginPct: num(d.marginPct) ?? 0,
  };

  const median = num(b.median) ?? deal.resale;
  const comps = typeof b.comps === "string" ? b.comps : "";

  return { deal, median, comps };
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serviciul de analiză nu e configurat momentan." },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: DEAL_ANALYSIS_SYSTEM,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: dealAnalysisSchema },
      },
      messages: [{ role: "user", content: buildDealAnalysisText(checked) }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "Analiza nu a putut fi făcută pentru anunțul ăsta." },
        { status: 422 },
      );
    }

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const analysis = JSON.parse(text) as DealAnalysis;
    return NextResponse.json({ analysis });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
    } else {
      console.error("Deal analyze route error:", error);
    }
    return NextResponse.json(
      { error: "Nu am putut analiza acum. Încearcă din nou." },
      { status: 502 },
    );
  }
}
