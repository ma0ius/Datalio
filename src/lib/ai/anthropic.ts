import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import {
  type AiProvider,
  type EnrichInput,
  type EnrichResult,
  ENRICH_SYSTEM_PROMPT,
  enrichUserPrompt,
  RESEARCH_PROMPT,
} from "./types";

const EnrichSchema = z.object({
  name: z.string(),
  beschreibung: z.string(),
  attribute: z.array(
    z.object({ schluessel: z.string(), wert: z.string() })
  ),
  bulletpoints: z.array(z.string()),
  qa: z.array(z.object({ frage: z.string(), antwort: z.string() })),
  hinweis: z.string(),
});

export function anthropicProvider(): AiProvider {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.AI_MODEL || "claude-haiku-4-5";
  return {
    id: `anthropic:${model}`,
    async enrich(input: EnrichInput): Promise<EnrichResult> {
      let rechercheNotizen: string | undefined;
      let rechercheFehler = false;

      if (input.recherche) {
        try {
          const research = await client.messages.create({
            model,
            max_tokens: 4000,
            tools: [
              { type: "web_search_20250305", name: "web_search", max_uses: 3 },
            ],
            messages: [{ role: "user", content: RESEARCH_PROMPT(input) }],
          });
          rechercheNotizen = research.content
            .filter((b): b is Anthropic.TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("\n");
        } catch {
          rechercheFehler = true;
        }
      }

      const response = await client.messages.parse({
        model,
        max_tokens: 8000,
        system: ENRICH_SYSTEM_PROMPT,
        messages: [
          { role: "user", content: enrichUserPrompt(input, rechercheNotizen) },
        ],
        output_config: { format: zodOutputFormat(EnrichSchema) },
      });
      const parsed = response.parsed_output;
      if (!parsed) {
        throw new Error("Die KI Antwort konnte nicht gelesen werden.");
      }
      const attribute: Record<string, string> = {};
      for (const a of parsed.attribute) attribute[a.schluessel] = a.wert;
      return {
        name: parsed.name,
        beschreibung: parsed.beschreibung,
        attribute,
        bulletpoints: parsed.bulletpoints ?? [],
        qa: parsed.qa ?? [],
        hinweis: rechercheFehler
          ? `Websuche war nicht verfügbar, Anreicherung nur aus vorhandenen Daten. ${parsed.hinweis}`
          : parsed.hinweis,
      };
    },
  };
}
