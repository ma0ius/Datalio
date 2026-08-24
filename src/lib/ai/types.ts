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
  /* Wenn wahr: vor der Anreicherung im Netz nach Herstellerangaben
     zu diesem Artikel recherchieren (Websuche). */
  recherche?: boolean;
};

export type EnrichResult = {
  name: string;
  beschreibung: string;
  attribute: Record<string, string>;
  bulletpoints: string[];
  qa: { frage: string; antwort: string }[];
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

Du erhältst einen Artikeldatensatz (SKU, Name, vorhandene Attribute), die Liste aller Attributschlüssel des Katalogs und gegebenenfalls Recherchenotizen mit belegten Herstellerangaben.

Deine Aufgaben:
1. Fülle fehlende Attributwerte NUR aus zwei Quellen: den vorhandenen Angaben (zum Beispiel Radgröße aus dem Namen "28 Zoll") oder den Recherchenotizen. Erfinde niemals technische Daten, Maße, Normen oder Eigenschaften. Was sich nicht belegen lässt, bleibt ein leerer String.
2. Schreibe eine sachliche deutsche Produktbeschreibung (80 bis 150 Wörter) auf Basis ausschließlich belegter Angaben. Keine Superlative, keine erfundenen Eigenschaften, keine Preisnennungen.
3. Erstelle 3 bis 5 Bulletpoints: je ein kurzer, faktischer Verkaufspunkt (maximal 12 Wörter), nur aus belegten Angaben.
4. Erstelle 2 bis 4 Fragen und Antworten (Q&A), wie Kundinnen sie vor dem Kauf stellen würden, beantwortet nur aus belegten Angaben. Wenn die Datenlage dafür nicht reicht, gib weniger oder keine zurück.
5. Normalisiere den Artikelnamen (Schreibweise, Vollständigkeit), ohne seine Bedeutung zu verändern. Wenn der Name fehlt, leite ihn aus den Attributen ab.
6. Fasse in ein bis zwei Sätzen zusammen, was du ergänzt hast, welche Quellen die Recherche geliefert hat und welche Attribute mangels Information leer bleiben.

Antworte auf Deutsch.`;

export function enrichUserPrompt(input: EnrichInput, rechercheNotizen?: string): string {
  const daten = JSON.stringify(
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
  if (rechercheNotizen && rechercheNotizen.trim()) {
    return `${daten}\n\nRecherchenotizen aus der Websuche (mit Quellen):\n${rechercheNotizen}`;
  }
  return daten;
}

export const RESEARCH_PROMPT = (input: EnrichInput) =>
  `Recherchiere im Netz belegbare Produktinformationen zu diesem Handelsartikel, bevorzugt von der Herstellerseite oder Händlerseiten mit technischen Daten:

Name: ${input.name ?? "unbekannt"}
SKU: ${input.sku}
Bekannte Angaben: ${JSON.stringify(input.attribute)}

Gib eine kompakte Faktenliste zurück: je Zeile ein Fakt mit Quelle (Domain). Nur Fakten, die du wirklich gefunden hast — wenn du den Artikel nicht sicher identifizieren kannst, schreibe genau das. Keine Vermutungen.`;
