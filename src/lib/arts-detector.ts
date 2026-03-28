import { Art } from '@/types';

const ART_PATTERNS: Record<Art, RegExp[]> = {
  question: [/\bquestion/i, /\bask\b/i, /\bcuriosity/i, /\bcurious\b/i, /\binquir/i, /art of the question/i],
  suggestion: [/\bsuggest/i, /\bimpl(y|ied|ication)/i, /\bindirect/i, /\bhint/i, /art of suggestion/i],
  rhythm: [/\brhythm/i, /\btiming/i, /\btempo/i, /\bpace\b/i, /\bpaus(e|ing)\b/i, /art of rhythm/i],
  attunement: [/\battune/i, /\bread the room/i, /\bcalibrat/i, /\benergy shift/i, /art of attunement/i],
  vulnerability: [/\bvulnerab/i, /\bopen up/i, /\bshare something real/i, /art of vulnerability/i],
  detail: [/\bdetail/i, /\bremember(ed|ing)?\b.*\bmentioned/i, /\bspecific\b/i, /art of detail/i],
  absence: [/\babsence/i, /\bspace\b/i, /\bmystery/i, /\bwanting more/i, /art of absence/i],
};

export function detectArts(text: string): Art[] {
  const detected: Art[] = [];
  for (const [art, patterns] of Object.entries(ART_PATTERNS) as [Art, RegExp[]][]) {
    if (patterns.some(pattern => pattern.test(text))) {
      detected.push(art);
    }
  }
  return detected;
}
