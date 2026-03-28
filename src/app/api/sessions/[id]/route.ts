import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Session, Message } from '@/types';

// Mock data for development
const mockSession: Session = {
  id: 'sess_mock_001',
  user_id: 'user_mock_001',
  mode: 'prep',
  context: 'First date at a coffee shop this Saturday',
  relationship_type: 'romantic',
  arts_used: ['question', 'attunement'],
  summary: null,
  rating: null,
  created_at: '2026-03-25T18:00:00Z',
  ended_at: null,
};

const mockMessages: Message[] = [
  {
    id: 'msg_001',
    session_id: 'sess_mock_001',
    role: 'assistant',
    content:
      "Welcome to your prep session. You mentioned a first date at a coffee shop — let's make sure you walk in feeling grounded and magnetic. What's on your mind about it?",
    is_ephemeral: false,
    created_at: '2026-03-25T18:00:05Z',
  },
  {
    id: 'msg_002',
    session_id: 'sess_mock_001',
    role: 'user',
    content:
      "I always run out of things to say after the first 20 minutes. The conversation just dies.",
    is_ephemeral: false,
    created_at: '2026-03-25T18:00:45Z',
  },
  {
    id: 'msg_003',
    session_id: 'sess_mock_001',
    role: 'assistant',
    content:
      "That's more common than you think, and it's actually a sign you're relying on topics instead of curiosity. Let's practice the Art of the Question — instead of asking 'what do you do?', try following the energy of what they just said. Want to try a quick simulation?",
    is_ephemeral: false,
    created_at: '2026-03-25T18:01:10Z',
  },
  {
    id: 'msg_004',
    session_id: 'sess_mock_001',
    role: 'user',
    content: "Yeah, let's do it.",
    is_ephemeral: false,
    created_at: '2026-03-25T18:01:30Z',
  },
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // TODO: Connect to real Supabase instance
  // const { data: session, error } = await supabase
  //   .from('sessions')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('user_id', user.id)
  //   .single();
  //
  // if (error || !session) {
  //   return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  // }
  //
  // const { data: messages } = await supabase
  //   .from('messages')
  //   .select('*')
  //   .eq('session_id', id)
  //   .eq('is_ephemeral', false)
  //   .order('created_at', { ascending: true });

  // Mock: pretend we found the session
  const session: Session = { ...mockSession, id, user_id: user.id };
  const messages: Message[] = mockMessages.map((m) => ({
    ...m,
    session_id: id,
  }));

  return NextResponse.json({ session, messages });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.action !== 'end') {
    return NextResponse.json(
      { error: 'Invalid action. Only "end" is supported.' },
      { status: 400 }
    );
  }

  // Validate rating if provided
  if (body.rating !== undefined) {
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }
  }

  // TODO: Connect to real Supabase instance
  // 1. Verify session belongs to user and is not already ended
  // const { data: session, error } = await supabase
  //   .from('sessions')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('user_id', user.id)
  //   .is('ended_at', null)
  //   .single();
  //
  // if (error || !session) {
  //   return NextResponse.json(
  //     { error: 'Session not found or already ended' },
  //     { status: 404 }
  //   );
  // }
  //
  // 2. Set ended_at and optional rating
  // const now = new Date().toISOString();
  // const { data: updated } = await supabase
  //   .from('sessions')
  //   .update({
  //     ended_at: now,
  //     ...(body.rating !== undefined && { rating: body.rating }),
  //   })
  //   .eq('id', id)
  //   .select()
  //   .single();
  //
  // 3. Purge ephemeral messages for this session
  // await supabase
  //   .from('messages')
  //   .delete()
  //   .eq('session_id', id)
  //   .eq('is_ephemeral', true);
  //
  // 4. Increment user's session counts
  // await supabase.rpc('increment_session_count', { user_id: user.id });

  const now = new Date().toISOString();
  const endedSession: Session = {
    ...mockSession,
    id,
    user_id: user.id,
    ended_at: now,
    rating: body.rating ?? null,
  };

  return NextResponse.json({
    session: endedSession,
    ephemeral_messages_purged: 2,
  });
}
