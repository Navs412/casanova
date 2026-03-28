-- Casanova PWA Database Schema
-- Run this in Supabase SQL Editor

-- =============================================================================
-- TABLES
-- =============================================================================

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
  arts_practiced TEXT[] DEFAULT '{}',
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('prep', 'pause', 'debrief', 'onboarding', 'simulation')),
  context TEXT,
  relationship_type TEXT CHECK (relationship_type IN (
    'romantic', 'professional', 'platonic', 'familial', 'stranger', 'unspecified'
  )),
  arts_used TEXT[] DEFAULT '{}',
  summary TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_ephemeral BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session_id ON public.messages(session_id, created_at);

CREATE TABLE public.daily_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_text TEXT NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN (
    'romantic', 'professional', 'platonic', 'familial', 'stranger', 'general'
  )),
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_aha_moment BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can create own messages" ON public.messages
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (
    session_id IN (SELECT id FROM public.sessions WHERE user_id = auth.uid())
  );

ALTER TABLE public.daily_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view scenarios" ON public.daily_scenarios
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can view scenarios" ON public.daily_scenarios
  FOR SELECT USING (true);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

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

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
