import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', id)
    .eq('is_ephemeral', false)
    .order('created_at', { ascending: true });

  return NextResponse.json({ session, messages: messages ?? [] });
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

  // Verify session belongs to user and is not already ended
  const { data: existingSession, error: fetchError } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('ended_at', null)
    .single();

  if (fetchError || !existingSession) {
    return NextResponse.json(
      { error: 'Session not found or already ended' },
      { status: 404 }
    );
  }

  // End the session
  const now = new Date().toISOString();
  const { data: updated, error: updateError } = await supabase
    .from('sessions')
    .update({
      ended_at: now,
      ...(body.rating !== undefined && { rating: body.rating }),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Purge ephemeral messages
  const { count } = await supabase
    .from('messages')
    .delete({ count: 'exact' })
    .eq('session_id', id)
    .eq('is_ephemeral', true);

  // Increment user's session counts
  await supabase.rpc('increment_session_count', { user_id: user.id });

  return NextResponse.json({
    session: updated,
    ephemeral_messages_purged: count ?? 0,
  });
}

export async function DELETE(
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

  // Verify session belongs to user
  const { data: session, error: fetchError } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Delete messages first, then the session
  await supabase.from('messages').delete().eq('session_id', id);
  const { error: deleteError } = await supabase.from('sessions').delete().eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
