import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  Session,
  SessionMode,
  RelationshipType,
  CreateSessionRequest,
} from '@/types';

const SESSION_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  annual: 50,
};

// Mock sessions for development
const mockSessions: Session[] = [
  {
    id: 'sess_mock_001',
    user_id: 'user_mock_001',
    mode: 'prep',
    context: 'First date at a coffee shop this Saturday',
    relationship_type: 'romantic',
    arts_used: ['question', 'attunement'],
    summary: 'Prepared conversation starters and practiced active listening techniques.',
    rating: 4,
    created_at: '2026-03-25T18:00:00Z',
    ended_at: '2026-03-25T18:32:00Z',
  },
  {
    id: 'sess_mock_002',
    user_id: 'user_mock_001',
    mode: 'debrief',
    context: 'Post-meeting reflection with new client',
    relationship_type: 'professional',
    arts_used: ['rhythm', 'detail'],
    summary: 'Reviewed meeting dynamics and identified missed cues.',
    rating: 3,
    created_at: '2026-03-24T10:15:00Z',
    ended_at: '2026-03-24T10:45:00Z',
  },
  {
    id: 'sess_mock_003',
    user_id: 'user_mock_001',
    mode: 'simulation',
    context: null,
    relationship_type: 'stranger',
    arts_used: ['vulnerability', 'suggestion'],
    summary: null,
    rating: null,
    created_at: '2026-03-26T20:00:00Z',
    ended_at: null,
  },
];

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

  // TODO: Connect to real Supabase instance
  // const { data: sessions, error, count } = await supabase
  //   .from('sessions')
  //   .select('*', { count: 'exact' })
  //   .eq('user_id', user.id)
  //   .order('created_at', { ascending: false })
  //   .range(offset, offset + limit - 1);

  const userSessions = mockSessions.map((s) => ({ ...s, user_id: user.id }));
  const paged = userSessions.slice(offset, offset + limit);

  return NextResponse.json({
    sessions: paged,
    total: userSessions.length,
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

  // TODO: Connect to real Supabase instance
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('sessions_this_month, subscription_tier')
  //   .eq('id', user.id)
  //   .single();

  // Mock session limit check
  const mockSessionsThisMonth = 3;
  const mockTier = 'free';
  const limit = SESSION_LIMITS[mockTier] ?? 5;

  if (mockSessionsThisMonth >= limit) {
    return NextResponse.json(
      {
        error: 'Monthly session limit reached. Upgrade your plan for more sessions.',
        limit,
        used: mockSessionsThisMonth,
      },
      { status: 403 }
    );
  }

  // TODO: Connect to real Supabase instance
  // const { data: session, error } = await supabase
  //   .from('sessions')
  //   .insert({
  //     user_id: user.id,
  //     mode: body.mode,
  //     context: body.context ?? null,
  //     relationship_type: body.relationship_type ?? 'unspecified',
  //     arts_used: [],
  //   })
  //   .select()
  //   .single();

  const newSessionId = `sess_${crypto.randomUUID().slice(0, 8)}`;

  return NextResponse.json({ session_id: newSessionId }, { status: 201 });
}
