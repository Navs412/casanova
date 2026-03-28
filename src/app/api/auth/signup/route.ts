import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // TODO: Connect to real Supabase instance
    // const { data, error } = await supabase.auth.signUp({ email, password });
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 400 });
    // }

    const mockUser = {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      aud: 'authenticated',
      role: 'authenticated',
      email,
      email_confirmed_at: null,
      phone: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {},
      identities: [],
    };

    const mockSession = {
      access_token: 'mock-access-token-xxxxxxxxxxxxxxxxxxxx',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'mock-refresh-token-xxxxxxxxxxxxxxxxxxxx',
      user: mockUser,
    };

    return NextResponse.json(
      {
        user: mockUser,
        session: mockSession,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
