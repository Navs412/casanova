import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // TODO: Verify session belongs to user (replace with real DB query)
    // const { data: session, error: sessionError } = await supabase
    //   .from('sessions')
    //   .select('id, user_id')
    //   .eq('id', sessionId)
    //   .eq('user_id', user.id)
    //   .single();
    //
    // if (sessionError || !session) {
    //   return NextResponse.json(
    //     { error: 'Session not found or access denied' },
    //     { status: 404 }
    //   );
    // }

    // TODO: Delete all messages for this session (replace with real DB query)
    // const { error: messagesError } = await supabase
    //   .from('messages')
    //   .delete()
    //   .eq('session_id', sessionId);

    // TODO: Delete the session itself (replace with real DB query)
    // const { error: deleteError } = await supabase
    //   .from('sessions')
    //   .delete()
    //   .eq('id', sessionId)
    //   .eq('user_id', user.id);

    // Mock: log the deletion
    console.log(
      `[Data] Deleted session ${sessionId} and all messages for user ${user.id}`
    );

    return NextResponse.json({
      success: true,
      message: `Session ${sessionId} and all associated messages have been deleted.`,
    });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
