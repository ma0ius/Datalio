import {
  type AiProvider,
  type EnrichInput,
  type EnrichResult,
  ENRICH_SYSTEM_PROMPT,
  enrichUserPrompt,
} from "./types";

/* Zweiter Anbieter als Beleg der Austauschbarkeit. Aktiv über
   AI_PROVIDER=openai plus OPENAI_API_KEY und OPENAI_MODEL. */
export function openaiProvider(): AiProvider {
  const model = process.env.OPENAI_MODEL;
  return {
    id: `openai:${model ?? "unkonfiguriert"}`,
    async enrich(input: EnrichInput): Promise<EnrichResult> {
      if (!process.env.OPENAI_API_KEY || !model) {
        throw new Error(
          "OpenAI ist nicht konfiguriert. OPENAI_API_KEY und OPENAI_MODEL setzen oder AI_PROVIDER=anthropic verwenden."
        );
      }
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                ENRICH_SYSTEM_PROMPT +
                '\nAntworte als JSON Objekt mit den Feldern name (String), beschreibung (String), attribute (Objekt Schlüssel zu Wert, beide String), bulletpoints (Array aus Strings), qa (Array aus Objekten mit frage und antwort) und hinweis (String).',
            },
            { role: "user", content: enrichUserPrompt(input) },
          ],
        }),
      });
      if (!res.ok) {
        throw new Error(`OpenAI Fehler ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
      return {
        name: String(parsed.name ?? input.name ?? ""),
        beschreibung: String(parsed.beschreibung ?? ""),
        attribute:
          parsed.attribute && typeof parsed.attribute === "object"
            ? Object.fromEntries(
                Object.entries(parsed.attribute).map(([k, v]) => [k, String(v)])
              )
            : {},
        bulletpoints: Array.isArray(parsed.bulletpoints)
          ? parsed.bulletpoints.map(String)
          : [],
        qa: Array.isArray(parsed.qa)
          ? parsed.qa.map((p: { frage?: unknown; antwort?: unknown }) => ({
              frage: String(p?.frage ?? ""),
              antwort: String(p?.antwort ?? ""),
            }))
          : [],
        hinweis:
          (input.recherche ? "Webrecherche ist derzeit nur mit dem Anbieter Claude verfügbar. " : "") +
          String(parsed.hinweis ?? ""),
      };
    },
  };
}
