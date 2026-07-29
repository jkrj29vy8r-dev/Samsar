import { NextResponse } from "next/server";
import type { DealQuery } from "@/types/deal";
import { fetchComparables } from "@/lib/autovit";
import { rankDeals } from "@/lib/deals";

// Căutarea pe marketplace se face din rută, nu din client.
export const runtime = "nodejs";
export const maxDuration = 30;

function validate(body: unknown): { query: DealQuery } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Cerere invalidă." };
  }
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const query: DealQuery = {
    model: str(b.model),
    budget: str(b.budget),
    year: str(b.year),
  };
  if (query.model.trim() === "") {
    return { error: "Scrie ce mașină cauți (marcă și model)." };
  }
  return { query };
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
  const { query } = checked;

  try {
    const result = await fetchComparables({
      model: query.model,
      year: query.year,
      km: "",
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    const budget =
      Number.parseFloat(query.budget.replace(/[^\d.]/g, "")) || 0;
    const { median, deals } = rankDeals(result.listings, budget);

    return NextResponse.json({
      median,
      count: deals.length,
      total: result.listings.length,
      deals,
      comps: result.text,
    });
  } catch (error) {
    console.error("Deals route error:", error);
    return NextResponse.json(
      { error: "Nu am putut căuta acum. Încearcă din nou sau lipește manual." },
      { status: 502 },
    );
  }
}
