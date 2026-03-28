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
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  sessions_this_month: number;
  sessions_month_reset: string;
  arts_practiced: Art[];
  total_sessions: number;
  created_at: string;
  updated_at: string;
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

export interface DailyScenario {
  id: string;
  scenario_text: string;
  context_type: 'romantic' | 'professional' | 'platonic' | 'familial' | 'stranger' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_aha_moment: boolean;
  active: boolean;
  created_at: string;
}

export interface ChatRequest {
  session_id: string;
  message: string;
  is_ephemeral?: boolean;
}

export interface ChatResponse {
  message_id: string;
  content: string;
  arts_referenced: Art[];
}

export interface CreateSessionRequest {
  mode: SessionMode;
  context?: string;
  relationship_type?: RelationshipType;
}

export interface ArchetypeScores {
  charmer: number;
  magnetic: number;
  enigma: number;
  ideal: number;
  bold: number;
  natural: number;
  aesthete: number;
  luminary: number;
  alchemist: number;
}
