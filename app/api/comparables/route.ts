import { NextResponse } from "next/server";
import type { ComparableQuery } from "@/types/comparable";
import { fetchComparables } from "@/lib/autovit";

// Apelul extern (Autovit) se face din rută, nu din client.
export const runtime = "nodejs";
export const maxDuration = 30;

function validate(body: unknown): { query: ComparableQuery } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Cerere invalidă." };
  }
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const query: ComparableQuery = {
    model: str(b.model),
    year: str(b.year),
    km: str(b.km),
  };
  if (query.model.trim() === "") {
    return { error: "Completează marca și modelul ca să caut anunțuri." };
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

  try {
    const result = await fetchComparables(checked.query);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }
    return NextResponse.json({
      count: result.listings.length,
      text: result.text,
      listings: result.listings,
    });
  } catch (error) {
    console.error("Comparables route error:", error);
    return NextResponse.json(
      { error: "Nu am putut contacta Autovit. Încearcă din nou sau lipește manual." },
      { status: 502 },
    );
  }
}
