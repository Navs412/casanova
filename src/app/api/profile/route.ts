import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Archetype } from '@/types';

// Mock profile for development
const mockProfile: Profile = {
  id: 'user_mock_001',
  display_name: 'Naveen',
  archetype: 'charmer',
  archetype_discovered_at: '2026-03-15T10:30:00Z',
  onboarding_completed: true,
  subscription_tier: 'free',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  sessions_this_month: 3,
  sessions_month_reset: '2026-04-01T00:00:00Z',
  arts_practiced: ['question', 'attunement', 'vulnerability'],
  total_sessions: 12,
  created_at: '2026-02-01T08:00:00Z',
  updated_at: '2026-03-25T14:20:00Z',
};

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Connect to real Supabase instance
  // const { data: profile, error } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', user.id)
  //   .single();

  const profile: Profile = { ...mockProfile, id: user.id };

  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Only allow specific fields to be updated
  const allowedFields = ['archetype', 'display_name', 'onboarding_completed'] as const;
  const updates: Partial<Pick<Profile, 'archetype' | 'display_name' | 'onboarding_completed'>> = {};

  for (const field of allowedFields) {
    if (field in body) {
      if (field === 'archetype' && body.archetype !== null) {
        const validArchetypes: Archetype[] = [
          'charmer', 'magnetic', 'enigma', 'ideal', 'bold',
          'natural', 'aesthete', 'luminary', 'alchemist',
        ];
        if (!validArchetypes.includes(body.archetype)) {
          return NextResponse.json(
            { error: `Invalid archetype: ${body.archetype}` },
            { status: 400 }
          );
        }
      }
      (updates as Record<string, unknown>)[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  // TODO: Connect to real Supabase instance
  // const { data: profile, error } = await supabase
  //   .from('profiles')
  //   .update({ ...updates, updated_at: new Date().toISOString() })
  //   .eq('id', user.id)
  //   .select()
  //   .single();

  const updatedProfile: Profile = {
    ...mockProfile,
    id: user.id,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json(updatedProfile);
}
