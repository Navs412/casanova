import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Casanova — a personal emotional intelligence coach. You teach people how to connect more deeply with other humans across all relationship types: professional, romantic, platonic, and familial.

The user has just responded to a social scenario. Your job:
1. Acknowledge what is genuinely good about their instinct (be specific, not generic)
2. Reframe with a better approach using one of the Seven Arts: Question, Suggestion, Rhythm, Attunement, Vulnerability, Detail, or Absence
3. Explain WHY the better approach works — the psychological principle behind it
4. Keep it under 120 words. Be warm, specific, and leave them wanting more.

Never be preachy. Never be generic. Sound like a brilliant friend who happens to understand human connection at a deep level.`;

const FALLBACK_RESPONSES = [
  `That's a solid instinct — you're reaching for connection, which is the right impulse. But here's what I'd refine: instead of asking a follow-up question, try **the Art of Vulnerability**. Share something slightly unexpected about yourself first. "I've been thinking about this a lot lately, and honestly I don't have a good answer either." That small admission does something powerful — it signals that you're not performing. People mirror vulnerability. When you go first, you give them permission to stop performing too. That's when real conversations start.`,

  `I like that you're thinking about the other person's experience — that shows real **Attunement**. But notice what you're doing: you're managing the situation. Try this instead — use **the Art of the Question**. Ask something that makes them pause: "What's the version of this you don't tell most people?" It works because catalyst questions bypass the social script. Most conversations run on autopilot. One unexpected question can snap both of you into actual presence. That's the difference between a pleasant chat and a conversation they remember.`,

  `You're instinctively going broad — trying to keep things comfortable. That's safe, but safe is forgettable. Try **the Art of Detail** instead. Pick one tiny, specific thing and go deep on it. "You just lit up when you mentioned that trip — what was the moment that made it?" Specificity creates intimacy. When you notice a small thing about someone and name it, they feel genuinely seen. Not in a generic "I'm a good listener" way, but in a way that proves you were actually paying attention. That's rare. That's magnetic.`,

  `Good impulse — you're trying to hold space. But you might be holding too much. Sometimes the most powerful move is **the Art of Absence** — knowing when to pull back. Try saying less. "That sounds like it mattered to you" and then stop. Full stop. No follow-up question. The silence after creates a pocket of depth. Most people rush to fill silence because it feels awkward. But comfortable silence signals confidence and trust. It tells the other person: I'm not afraid of what happens when we stop performing.`,

  `There's something honest in your approach, and I respect that. But here's the shift: you're explaining when you should be **suggesting**. That's the Art of Suggestion — planting an idea without pushing it. Instead of laying out your reasoning, try: "I wonder what would happen if you tried it the other way." It works because people resist being told but love discovering. When you suggest rather than instruct, you invite them into a shared exploration. They feel like a collaborator, not a student. That subtle reframe changes the entire dynamic.`,

  `You're leading with warmth, which is genuinely appealing. But warmth without edge becomes background noise. Try adding **the Art of Rhythm** — vary your conversational tempo. You've been matching their energy. What if you slowed down right here? Lower your voice slightly. Take a beat. "You know what I actually think?" Then pause. Rhythm changes signal that something real is about to happen. Our brains are wired to notice pattern breaks. A sudden shift in pace makes the other person lean in — literally and emotionally. That's how you turn a nice conversation into a memorable one.`,
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
      // Fallback: rotate through high-quality hardcoded responses
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

    // Add the current message
    messages.push({ role: 'user', content: message });

    const client = new Anthropic({ apiKey });

    const anthropicStream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
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
