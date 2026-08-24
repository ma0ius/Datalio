/* Anbieterunabhängige Schnittstelle der KI Anreicherung.
   Die App kennt nur diese Typen; welcher Anbieter dahinter liegt,
   entscheidet die Umgebungsvariable AI_PROVIDER. */

export type EnrichInput = {
  sku: string;
  name: string | null;
  beschreibung: string | null;
  attribute: Record<string, string>;
  /* Alle Attributschlüssel, die im Katalog vorkommen — die KI soll
     fehlende davon füllen, sofern sicher ableitbar. */
  katalogKeys: string[];
};

export type EnrichResult = {
  name: string;
  beschreibung: string;
  attribute: Record<string, string>;
  /* Kurzer Hinweis der KI, was sie getan oder bewusst leer gelassen hat. */
  hinweis: string;
};

export interface AiProvider {
  readonly id: string;
  enrich(input: EnrichInput): Promise<EnrichResult>;
}

/* Gemeinsamer Auftragstext für alle Anbieter, damit ein Anbieterwechsel
   das Verhalten nicht verändert. */
export const ENRICH_SYSTEM_PROMPT = `Du bist die Datenanreicherung von Datalio, einem Product Information Management System für den Handel.

Du erhältst einen Artikeldatensatz (SKU, Name, vorhandene Attribute) und die Liste aller Attributschlüssel des Katalogs.

Deine Aufgaben:
1. Fülle fehlende Attributwerte NUR, wenn sie sich sicher aus den vorhandenen Angaben ableiten lassen (zum Beispiel Radgröße aus dem Namen "28 Zoll"). Erfinde niemals technische Daten, Maße, Normen oder Eigenschaften. Was sich nicht sicher ableiten lässt, bleibt ein leerer String.
2. Schreibe eine sachliche deutsche Produktbeschreibung (80 bis 150 Wörter) auf Basis ausschließlich der vorhandenen Angaben. Keine Superlative, keine erfundenen Eigenschaften, keine Preisnennungen.
3. Normalisiere den Artikelnamen (Schreibweise, Vollständigkeit), ohne seine Bedeutung zu verändern. Wenn der Name fehlt, leite ihn aus den Attributen ab.
4. Fasse in einem Satz zusammen, was du ergänzt hast und welche Attribute mangels Information leer bleiben.

Antworte auf Deutsch.`;

export function enrichUserPrompt(input: EnrichInput): string {
  return JSON.stringify(
    {
      sku: input.sku,
      name: input.name ?? "",
      beschreibung: input.beschreibung ?? "",
      vorhandene_attribute: input.attribute,
      alle_katalog_attributschluessel: input.katalogKeys,
    },
    null,
    2
  );
}
