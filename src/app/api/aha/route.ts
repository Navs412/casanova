import Anthropic from '@anthropic-ai/sdk';

const CASANOVA_SYSTEM_PROMPT = `You are Casanova, a personal communication skills coach. You teach the one skill no school teaches: how to genuinely connect with another human being.

You coach across ALL relationship types: professional, platonic, romantic, familial. The principles are universal.

When coaching, ALWAYS structure your response in this exact JSON format:
{
  "observation": "What the user did — specific, not generic. Max 2 sentences.",
  "reframe": "A better approach. Concrete and actionable. Max 2 sentences.",
  "art": "The name of the Seven Art being used: Question, Suggestion, Rhythm, Attunement, Vulnerability, Detail, or Absence",
  "why": "The psychological principle behind why this works. Max 2 sentences.",
  "micro_script": "Optional: 1-2 exact sentences they can say. Only include if helpful."
}

Never be preachy. Never be generic. Sound like a brilliant friend who understands human connection deeply.`;

const FALLBACK_RESPONSES = [
  `{"observation":"You're reaching for connection, which is the right impulse. But you're leading with logic when the moment calls for emotion.","reframe":"Instead of explaining yourself, share something slightly unexpected — a real feeling, not a justification.","art":"Vulnerability","why":"Controlled vulnerability signals that you're not performing. People mirror authenticity — when you go first, they stop performing too.","micro_script":"I've been thinking about this a lot lately, and honestly I don't have a good answer either."}`,
  `{"observation":"You're paying attention to the other person's experience — that shows real awareness. But you're managing the situation instead of entering it.","reframe":"Ask one question that makes them pause and think, not just respond.","art":"Question","why":"Catalyst questions bypass the social script. One unexpected question can snap both of you into actual presence.","micro_script":"What's the version of this you don't tell most people?"}`,
  `{"observation":"You're going broad — keeping things comfortable and safe. Safe is forgettable.","reframe":"Pick one tiny, specific thing they said and go deep on it. Name what you noticed.","art":"Detail","why":"Specificity creates intimacy. When you notice a small thing about someone and name it, they feel genuinely seen — not in a generic way, but in a way that proves you were paying attention.","micro_script":"You just lit up when you mentioned that — what was the moment that made it?"}`,
  `{"observation":"You're holding space, which is generous. But you might be holding too much — filling silence before it has a chance to work.","reframe":"Say less. Make one observation, then stop. Let the silence create depth.","art":"Absence","why":"Most people rush to fill silence because it feels awkward. Comfortable silence signals confidence and trust — it tells the other person you're not afraid of what happens when you both stop performing.","micro_script":"That sounds like it mattered to you."}`,
  `{"observation":"There's honesty in your approach. But you're explaining when you should be planting a seed.","reframe":"Instead of laying out your reasoning, float the idea as a possibility they can discover on their own.","art":"Suggestion","why":"People resist being told but love discovering. When you suggest rather than instruct, you invite collaboration instead of compliance.","micro_script":"I wonder what would happen if you tried it the other way."}`,
  `{"observation":"You're leading with warmth, which is appealing. But warmth without variation becomes background noise.","reframe":"Break the pattern. Slow down, lower your energy slightly, and signal that something real is about to happen.","art":"Rhythm","why":"Our brains are wired to notice pattern breaks. A sudden shift in conversational pace makes the other person lean in — literally and emotionally.","micro_script":"You know what I actually think?"}`,
];

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback: rotate through structured JSON responses
      const index =
        Math.abs(
          message.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
        ) % FALLBACK_RESPONSES.length;
      const fallback = FALLBACK_RESPONSES[index];

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallback.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise((r) => setTimeout(r, 20));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Build messages for Claude
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: 'user', content: message });

    const client = new Anthropic({ apiKey });

    const anthropicStream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      system: CASANOVA_SYSTEM_PROMPT,
      messages,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Streaming error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Aha API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
