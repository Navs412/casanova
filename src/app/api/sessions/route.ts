import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  SessionMode,
  RelationshipType,
  CreateSessionRequest,
} from '@/types';

const SESSION_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  annual: 50,
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const { data: sessions, error, count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    sessions: sessions ?? [],
    total: count ?? 0,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: CreateSessionRequest = await request.json();

  // Validate mode
  const validModes: SessionMode[] = ['prep', 'pause', 'debrief', 'onboarding', 'simulation'];
  if (!body.mode || !validModes.includes(body.mode)) {
    return NextResponse.json(
      { error: `Invalid session mode. Must be one of: ${validModes.join(', ')}` },
      { status: 400 }
    );
  }

  // Validate relationship_type if provided
  if (body.relationship_type) {
    const validTypes: RelationshipType[] = [
      'romantic', 'professional', 'platonic', 'familial', 'stranger', 'unspecified',
    ];
    if (!validTypes.includes(body.relationship_type)) {
      return NextResponse.json(
        { error: `Invalid relationship type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
  }

  // Check session limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('sessions_this_month, subscription_tier')
    .eq('id', user.id)
    .single();

  const sessionsThisMonth = profile?.sessions_this_month ?? 0;
  const tier = profile?.subscription_tier ?? 'free';
  const sessionLimit = SESSION_LIMITS[tier] ?? 5;

  if (sessionsThisMonth >= sessionLimit) {
    return NextResponse.json(
      {
        error: 'Monthly session limit reached. Upgrade your plan for more sessions.',
        limit: sessionLimit,
        used: sessionsThisMonth,
      },
      { status: 403 }
    );
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      mode: body.mode,
      context: body.context ?? null,
      relationship_type: body.relationship_type ?? 'unspecified',
      arts_used: [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session_id: session.id }, { status: 201 });
}
