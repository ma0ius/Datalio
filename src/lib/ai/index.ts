import type { AiProvider } from "./types";
import { anthropicProvider } from "./anthropic";
import { openaiProvider } from "./openai";

/* Anbieterauswahl über Umgebungsvariable. Standard ist Anthropic (Claude).
   Ein Wechsel ist eine Konfigurationszeile, kein Codeumbau. */
export function getAiProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (provider === "openai") return openaiProvider();
  return anthropicProvider();
}

export function aiConfigured(): boolean {
  const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL);
  }
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
