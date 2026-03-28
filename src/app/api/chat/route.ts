import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt } from '@/lib/system-prompt';
import { detectArts } from '@/lib/arts-detector';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { session_id, message, is_ephemeral } = body as {
      session_id: string;
      message: string;
      is_ephemeral?: boolean;
    };

    if (!session_id || !message) {
      return NextResponse.json(
        { error: 'session_id and message are required' },
        { status: 400 }
      );
    }

    // TODO: Validate session belongs to user (replace with real DB query)
    const session = {
      id: session_id,
      user_id: user.id,
      mode: 'prep' as string,
      scenario_id: 'mock-scenario-1',
    };

    if (session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // TODO: Store user message in database
    const _userMessage = {
      id: crypto.randomUUID(),
      session_id,
      role: 'user' as const,
      content: message,
      is_ephemeral: is_ephemeral ?? false,
      created_at: new Date().toISOString(),
    };

    // TODO: Retrieve previous messages for context (replace with real DB query)
    const _previousMessages = [
      { role: 'user' as const, content: message },
    ];

    // TODO: Retrieve user profile for personalization (replace with real DB query)
    const userProfile = {
      archetype: 'enigma' as const,
      arts_practiced: ['question'] as string[],
      session_count: 5,
    };

    // Build system prompt with personalization
    const systemPrompt = buildSystemPrompt({
      archetype: userProfile.archetype,
      artsPracticed: userProfile.arts_practiced,
      sessionCount: userProfile.session_count,
      mode: session.mode,
    });

    // If mode is "pause", append pause instruction
    const finalSystemPrompt =
      session.mode === 'pause'
        ? `${systemPrompt}\n\n[PAUSE MODE]: The user has requested a moment to reflect. Gently encourage introspection without pushing forward. Let the silence breathe.`
        : systemPrompt;

    // Track the full response for post-stream processing
    let fullResponse = '';

    // TODO: Replace with real AI API call (KRONA)
    const mockCoachingResponse =
      `I notice something interesting in what you just shared. ` +
      `There's a pattern here — you're approaching this interaction ` +
      `with a desire to be understood, which is natural, but what if ` +
      `we flipped the script? Instead of seeking validation, what if ` +
      `you led with genuine curiosity about the other person's world? ` +
      `Try this: next time you're in that situation, pause for a beat ` +
      `before responding. Let the silence do some of the heavy lifting. ` +
      `Then ask a question that shows you were truly listening — not ` +
      `just waiting for your turn to speak. That's where real connection begins.`;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Simulate token-by-token streaming
          const words = mockCoachingResponse.split(' ');

          for (let i = 0; i < words.length; i++) {
            const token = i === 0 ? words[i] : ` ${words[i]}`;
            fullResponse += token;
            controller.enqueue(encoder.encode(token));

            // Simulate natural typing delay
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Post-stream processing: detect arts used in the response
          const detectedArts = detectArts(fullResponse);

          // Send a final metadata chunk separated by a delimiter
          const metadata = JSON.stringify({
            done: true,
            detected_arts: detectedArts,
            session_id,
          });
          controller.enqueue(encoder.encode(`\n__META__${metadata}`));

          // TODO: Store assistant message in database
          const _assistantMessage = {
            id: crypto.randomUUID(),
            session_id,
            role: 'assistant' as const,
            content: fullResponse,
            detected_arts: detectedArts,
            created_at: new Date().toISOString(),
          };

          controller.close();
        } catch (err) {
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
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
