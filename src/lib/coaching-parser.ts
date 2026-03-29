export interface CoachingResponse {
  observation: string;
  reframe: string;
  art: string;
  why: string;
  micro_script?: string;
  raw?: string;
}

export function parseCoachingResponse(text: string): CoachingResponse {
  // Try to extract JSON from the text (may be wrapped in markdown code fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.observation && parsed.reframe && parsed.art && parsed.why) {
        return {
          observation: parsed.observation,
          reframe: parsed.reframe,
          art: parsed.art,
          why: parsed.why,
          micro_script: parsed.micro_script,
        };
      }
    } catch {
      // fall through to raw fallback
    }
  }

  return {
    observation: text,
    reframe: '',
    art: '',
    why: '',
    raw: text,
  };
}
