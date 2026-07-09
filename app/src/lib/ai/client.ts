// Optional AI layer — OFF by default. Nothing else in the app depends on this.
// Enable it in Settings with your own Anthropic API key (stored locally in IndexedDB).
// Note: calling the API from the browser is intended for personal/local use.

import { getSetting } from "@/lib/db";
import type { Resource } from "@/data/schema";

export interface AISettings {
  enabled: boolean;
  apiKey: string;
  model: string;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  apiKey: "",
  model: "claude-sonnet-5",
};

export async function getAISettings(): Promise<AISettings> {
  return getSetting<AISettings>("ai", DEFAULT_AI_SETTINGS);
}

export class AIDisabledError extends Error {
  constructor() {
    super("AI features are disabled. Enable them in Settings and add an API key.");
  }
}

async function complete(system: string, user: string): Promise<string> {
  const cfg = await getAISettings();
  if (!cfg.enabled || !cfg.apiKey) throw new AIDisabledError();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": cfg.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  const json = await res.json();
  return json.content?.[0]?.text ?? "";
}

/** Generate a starter note skeleton for a resource. */
export function draftNote(resource: Resource): Promise<string> {
  return complete(
    "You help a machine-learning researcher take structured study notes. Be concise and technical. Output Markdown with sections: Summary, Key ideas, Questions to explore.",
    `Resource: ${resource.title}\nType: ${resource.type}\nSource: ${resource.source}\nSummary: ${resource.summary}\nKey concepts: ${resource.keyConcepts.join(", ")}`,
  );
}
