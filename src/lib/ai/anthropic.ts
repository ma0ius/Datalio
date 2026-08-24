import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import {
  type AiProvider,
  type EnrichInput,
  type EnrichResult,
  ENRICH_SYSTEM_PROMPT,
  enrichUserPrompt,
} from "./types";

const EnrichSchema = z.object({
  name: z.string(),
  beschreibung: z.string(),
  attribute: z.array(
    z.object({ schluessel: z.string(), wert: z.string() })
  ),
  hinweis: z.string(),
});

export function anthropicProvider(): AiProvider {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.AI_MODEL || "claude-opus-5";
  return {
    id: `anthropic:${model}`,
    async enrich(input: EnrichInput): Promise<EnrichResult> {
      const response = await client.messages.parse({
        model,
        max_tokens: 8000,
        system: ENRICH_SYSTEM_PROMPT,
        messages: [{ role: "user", content: enrichUserPrompt(input) }],
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
        hinweis: parsed.hinweis,
      };
    },
  };
}
