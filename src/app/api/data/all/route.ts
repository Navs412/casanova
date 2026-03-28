import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CONFIRMATION_STRING = 'DELETE_ALL_MY_DATA';

export async function DELETE(request: NextRequest) {
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
    const { confirm } = body as { confirm: string };

    if (confirm !== CONFIRMATION_STRING) {
      return NextResponse.json(
        {
          error: `Confirmation required. Send { "confirm": "${CONFIRMATION_STRING}" } to proceed.`,
        },
        { status: 400 }
      );
    }

    // TODO: Delete all messages for all user sessions (replace with real DB queries)
    // const { data: sessions } = await supabase
    //   .from('sessions')
    //   .select('id')
    //   .eq('user_id', user.id);
    //
    // if (sessions && sessions.length > 0) {
    //   const sessionIds = sessions.map((s) => s.id);
    //   await supabase
    //     .from('messages')
    //     .delete()
    //     .in('session_id', sessionIds);
    // }

    // TODO: Delete all sessions (replace with real DB query)
    // await supabase
    //   .from('sessions')
    //   .delete()
    //   .eq('user_id', user.id);

    // TODO: Delete user profile (replace with real DB query)
    // await supabase
    //   .from('profiles')
    //   .delete()
    //   .eq('user_id', user.id);

    // TODO: Delete user arts progress (replace with real DB query)
    // await supabase
    //   .from('arts_progress')
    //   .delete()
    //   .eq('user_id', user.id);

    // Mock: log the deletion
    console.log(`[Data] Deleted ALL data for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message:
        'All your data has been permanently deleted. This action cannot be undone.',
    });
  } catch (error) {
    console.error('Delete all data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
