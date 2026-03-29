import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { parseCoachingResponse } from '@/lib/coaching-parser';

const CASANOVA_SYSTEM_PROMPT = `You are Casanova, a personal communication skills coach. You teach the one skill no school teaches: how to genuinely connect with another human being.

You coach across ALL relationship types: professional, platonic, romantic, familial. The principles are universal.

When coaching, ALWAYS respond in this exact JSON format. Do NOT include field names or labels inside the values themselves:
{
  "observation": "[Your specific observation. Max 2 sentences. Do NOT start with 'What you did:' or similar.]",
  "reframe": "[A better approach. Max 2 sentences. Do NOT start with 'Try this instead:' or similar.]",
  "art": "[Just the art name: Question, Suggestion, Rhythm, Attunement, Vulnerability, Detail, or Absence]",
  "why": "[The psychological principle. Max 2 sentences. Do NOT start with 'Why it works:' or similar.]",
  "micro_script": "[Optional: 1-2 exact sentences they can say. Omit entirely if not helpful.]"
}

Mode-specific behavior:
- PREP: Help them prepare. Give specific openers, questions, strategies for their situation.
- PAUSE: Under 100 words total. Fast, direct, 1-2 sentences max per field. They are mid-conversation.
- DEBRIEF: Analyze what happened. Identify patterns. Build a coaching insight for next time.

Never be preachy. Never be generic. Sound like a brilliant friend who understands human connection deeply.`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
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

    const isAhaSession = session_id === 'aha-moment';

    // Auth check — allow unauthenticated for aha-moment sessions
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isAhaSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build personalization context
    let personalization = '';

    if (user && !isAhaSession) {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('archetype, arts_practiced, total_sessions')
        .eq('id', user.id)
        .single();

      if (profile) {
        const parts: string[] = [];
        if (profile.archetype) parts.push(`User archetype: ${profile.archetype}.`);
        if (profile.arts_practiced?.length) parts.push(`Arts practiced: ${profile.arts_practiced.join(', ')}.`);
        if (profile.total_sessions != null) parts.push(`Total sessions: ${profile.total_sessions}.`);
        if (parts.length) personalization = '\n\n## USER CONTEXT\n' + parts.join(' ');
      }

      // Store user message
      await supabase.from('messages').insert({
        session_id,
        role: 'user',
        content: message,
        is_ephemeral: is_ephemeral ?? false,
      });
    }

    // Fetch session mode
    let mode = 'prep';
    if (!isAhaSession) {
      const { data: session } = await supabase
        .from('sessions')
        .select('mode')
        .eq('id', session_id)
        .single();
      if (session?.mode) mode = session.mode;
    }

    const systemPrompt = CASANOVA_SYSTEM_PROMPT + personalization +
      (mode === 'pause' ? '\n\n[PAUSE MODE ACTIVE] Keep it under 100 words. They are mid-conversation.' : '') +
      (mode === 'debrief' ? '\n\n[DEBRIEF MODE ACTIVE] Analyze what happened and build coaching insights.' : '');

    // Fetch last 10 messages for context
    const conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (!isAhaSession) {
      const { data: history } = await supabase
        .from('messages')
        .select('role, content')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true })
        .limit(10);

      if (history) {
        for (const msg of history) {
          if (msg.role === 'user' || msg.role === 'assistant') {
            conversationMessages.push({ role: msg.role, content: msg.content });
          }
        }
      }
    }

    // If we didn't get messages from DB (or aha session), add current message
    if (conversationMessages.length === 0 || conversationMessages[conversationMessages.length - 1]?.content !== message) {
      conversationMessages.push({ role: 'user', content: message });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const client = new Anthropic({ apiKey });
    const anthropicStream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      system: systemPrompt,
      messages: conversationMessages,
    });

    let fullResponse = '';
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              fullResponse += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          // Parse coaching response for detected art
          const parsed = parseCoachingResponse(fullResponse);
          const detectedArt = parsed.art ? [parsed.art.toLowerCase()] : [];

          // Send metadata
          const metadata = JSON.stringify({
            done: true,
            detected_arts: detectedArt,
            session_id,
          });
          controller.enqueue(encoder.encode(`\n__META__${metadata}`));

          // Store assistant message
          if (user && !isAhaSession) {
            await supabase.from('messages').insert({
              session_id,
              role: 'assistant',
              content: fullResponse,
              is_ephemeral: false,
            });

            // Update session arts_used
            if (detectedArt.length > 0) {
              const { data: currentSession } = await supabase
                .from('sessions')
                .select('arts_used')
                .eq('id', session_id)
                .single();

              if (currentSession) {
                const existing = currentSession.arts_used || [];
                const merged = [...new Set([...existing, ...detectedArt])];
                await supabase
                  .from('sessions')
                  .update({ arts_used: merged })
                  .eq('id', session_id);
              }
            }
          }

          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
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
