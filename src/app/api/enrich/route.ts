import { NextResponse } from "next/server";
import { getAiProvider, aiConfigured } from "../../../lib/ai";
import type { EnrichInput } from "../../../lib/ai/types";

/* Anreicherung eines Artikels. Läuft serverseitig, damit der KI Schlüssel
   nie im Browser landet. Zugriff nur mit gültiger Supabase Sitzung. */

async function verifyUser(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.ok;
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !(await verifyUser(token))) {
    return NextResponse.json(
      { fehler: "Nicht angemeldet." },
      { status: 401 }
    );
  }

  if (!aiConfigured()) {
    return NextResponse.json(
      {
        fehler:
          "Die KI Anreicherung ist noch nicht konfiguriert. Bitte ANTHROPIC_API_KEY als Umgebungsvariable hinterlegen (lokal in .env.local, auf Vercel unter Environment Variables).",
      },
      { status: 503 }
    );
  }

  let input: EnrichInput;
  try {
    const body = await request.json();
    if (!body?.sku || typeof body.sku !== "string") {
      throw new Error("SKU fehlt.");
    }
    input = {
      sku: body.sku,
      name: typeof body.name === "string" ? body.name : null,
      beschreibung:
        typeof body.beschreibung === "string" ? body.beschreibung : null,
      attribute:
        body.attribute && typeof body.attribute === "object"
          ? body.attribute
          : {},
      katalogKeys: Array.isArray(body.katalogKeys)
        ? body.katalogKeys.filter((k: unknown) => typeof k === "string")
        : [],
    };
  } catch {
    return NextResponse.json(
      { fehler: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  try {
    const provider = getAiProvider();
    const result = await provider.enrich(input);
    return NextResponse.json({ ...result, anbieter: provider.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unbekannter Fehler.";
    return NextResponse.json(
      { fehler: `Anreicherung fehlgeschlagen: ${message}` },
      { status: 500 }
    );
  }
}
