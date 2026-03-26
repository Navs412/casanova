# Database Schema — Supabase (PostgreSQL)
## For Claude Code Backend Agent

---

## Tables

### users
Managed by Supabase Auth. Extended with a profile table.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  archetype TEXT CHECK (archetype IN (
    'charmer', 'magnetic', 'enigma', 'ideal', 'bold',
    'natural', 'aesthete', 'luminary', 'alchemist', NULL
  )),
  archetype_discovered_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'annual')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  sessions_this_month INTEGER DEFAULT 0,
  sessions_month_reset DATE DEFAULT CURRENT_DATE,
  arts_practiced TEXT[] DEFAULT '{}',  -- e.g. ['question', 'suggestion', 'rhythm']
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### sessions
A coaching session = one continuous interaction (Prep, Pause, or Debrief).

```sql
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('prep', 'pause', 'debrief', 'onboarding', 'simulation')),
  context TEXT,  -- user's description of the situation
  relationship_type TEXT CHECK (relationship_type IN (
    'romantic', 'professional', 'platonic', 'familial', 'stranger', 'unspecified'
  )),
  arts_used TEXT[] DEFAULT '{}',  -- which arts were coached in this session
  summary TEXT,  -- AI-generated session summary for progress tracking
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),  -- user satisfaction rating
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
```

### messages
Individual messages within a session.

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_ephemeral BOOLEAN DEFAULT FALSE,  -- TRUE for other-person messages pasted by user
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast session message retrieval
CREATE INDEX idx_messages_session_id ON public.messages(session_id, created_at);
```

### daily_scenarios
Pre-built scenarios for the daily engagement feature and aha moment.

```sql
CREATE TABLE public.daily_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_text TEXT NOT NULL,  -- the situation prompt
  context_type TEXT NOT NULL CHECK (context_type IN (
    'romantic', 'professional', 'platonic', 'familial', 'stranger', 'general'
  )),
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_aha_moment BOOLEAN DEFAULT FALSE,  -- used for first-time user hook
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

```sql
-- Profiles: users can only read/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Sessions: users can only access their own sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages: users can only access messages in their own sessions
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can create own messages" ON public.messages
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid())
  );

-- Daily scenarios: readable by all authenticated users
ALTER TABLE public.daily_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view scenarios" ON public.daily_scenarios
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Ephemeral Message Cleanup

Run as a Supabase Edge Function or cron job. When a session ends, purge ephemeral messages:

```sql
-- Call this when session.ended_at is set
DELETE FROM public.messages
WHERE session_id = $1 AND is_ephemeral = TRUE;
```

## Session Limit Enforcement

```sql
-- Function to check if user can start a new session
CREATE OR REPLACE FUNCTION can_start_session(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  tier TEXT;
  count INTEGER;
  reset_date DATE;
BEGIN
  SELECT subscription_tier, sessions_this_month, sessions_month_reset
  INTO tier, count, reset_date
  FROM public.profiles WHERE id = user_uuid;

  -- Reset monthly counter if new month
  IF reset_date < DATE_TRUNC('month', CURRENT_DATE) THEN
    UPDATE public.profiles
    SET sessions_this_month = 0, sessions_month_reset = CURRENT_DATE
    WHERE id = user_uuid;
    count := 0;
  END IF;

  -- Check limits
  IF tier = 'free' AND count >= 3 THEN RETURN FALSE; END IF;
  IF tier IN ('pro', 'annual') AND count >= 100 THEN RETURN FALSE; END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## TypeScript Types (for frontend/backend shared types)

```typescript
export type Archetype =
  | 'charmer' | 'magnetic' | 'enigma' | 'ideal' | 'bold'
  | 'natural' | 'aesthete' | 'luminary' | 'alchemist';

export type SessionMode = 'prep' | 'pause' | 'debrief' | 'onboarding' | 'simulation';

export type RelationshipType =
  | 'romantic' | 'professional' | 'platonic' | 'familial' | 'stranger' | 'unspecified';

export type Art =
  | 'question' | 'suggestion' | 'rhythm' | 'attunement'
  | 'vulnerability' | 'detail' | 'absence';

export type SubscriptionTier = 'free' | 'pro' | 'annual';

export interface Profile {
  id: string;
  display_name: string | null;
  archetype: Archetype | null;
  archetype_discovered_at: string | null;
  onboarding_completed: boolean;
  subscription_tier: SubscriptionTier;
  sessions_this_month: number;
  arts_practiced: Art[];
  total_sessions: number;
}

export interface Session {
  id: string;
  user_id: string;
  mode: SessionMode;
  context: string | null;
  relationship_type: RelationshipType | null;
  arts_used: Art[];
  summary: string | null;
  rating: number | null;
  created_at: string;
  ended_at: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  is_ephemeral: boolean;
  created_at: string;
}
```
