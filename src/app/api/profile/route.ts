import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Archetype } from '@/types';

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

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

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}
