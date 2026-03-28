import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // TODO: Connect to real Supabase instance
    // const { error } = await supabase.auth.signOut();
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    return NextResponse.json(
      { message: 'Successfully logged out' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
