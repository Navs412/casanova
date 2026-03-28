'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ModeCard from '@/components/ui/ModeCard';
import ArchetypeBadge from '@/components/ui/ArchetypeBadge';
import AppShell from '@/components/layout/AppShell';
import { Profile, Art } from '@/types';

const ALL_ARTS: Art[] = ['question', 'suggestion', 'rhythm', 'attunement', 'vulnerability', 'detail', 'absence'];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyScenario, setDailyScenario] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchDailyScenario();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data);
    } catch {
      setProfile({
        id: 'mock-user',
        display_name: 'Friend',
        archetype: 'enigma',
        archetype_discovered_at: new Date().toISOString(),
        onboarding_completed: true,
        subscription_tier: 'free',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        sessions_this_month: 1,
        sessions_month_reset: new Date().toISOString(),
        arts_practiced: ['question', 'suggestion'],
        total_sessions: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const fetchDailyScenario = async () => {
    try {
      const res = await fetch('/api/scenario/random?type=daily');
      const data = await res.json();
      setDailyScenario(data.scenario_text);
    } catch {
      setDailyScenario("You're at a coffee shop and notice someone reading a book you love. How do you start a conversation?");
    }
  };

  const startSession = async (mode: 'prep' | 'pause' | 'debrief') => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (res.status === 403) {
        router.push('/app/upgrade');
        return;
      }

      const data = await res.json();
      router.push(`/app/session/${data.session_id}`);
    } catch {
      router.push(`/app/session/demo-${mode}`);
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <AppShell>
      <div className="pt-10 pb-4">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-casanova-text mb-1 leading-tight">
            {greeting}{profile?.display_name ? `, ${profile.display_name}` : ''}. <br />
            <span className="text-casanova-muted font-normal text-xl">What&apos;s happening today?</span>
          </h1>
        </motion.div>

        {/* Mode Cards */}
        <div className="space-y-3 mt-8 mb-8">
          <ModeCard
            icon="🎯"
            title="Prep"
            description="Help me get ready for something"
            onClick={() => startSession('prep')}
          />
          <ModeCard
            icon="⚡"
            title="Pause"
            description="Help me right now"
            onClick={() => startSession('pause')}
            prominent
          />
          <ModeCard
            icon="📝"
            title="Debrief"
            description="How did it go?"
            onClick={() => startSession('debrief')}
          />
        </div>

        {/* Daily Scenario */}
        {dailyScenario && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-casanova-surface to-casanova-accent-soft/20 border border-casanova-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-casanova-gold text-lg">💡</span>
              <h3 className="text-sm font-bold text-casanova-accent">Today&apos;s Challenge</h3>
            </div>
            <p className="text-sm text-casanova-text leading-relaxed line-clamp-3 mb-3">{dailyScenario}</p>
            <button
              onClick={() => startSession('prep')}
              className="text-sm text-casanova-accent font-semibold hover:text-casanova-accent/80 transition-colors inline-flex items-center gap-1"
            >
              Practice this <span>&rarr;</span>
            </button>
          </motion.div>
        )}

        {/* Progress */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="p-5 rounded-2xl bg-casanova-surface border border-casanova-border"
          >
            <h3 className="text-sm font-bold text-casanova-text mb-4">Your Journey</h3>

            <div className="flex items-center gap-4 mb-5">
              {profile.archetype && (
                <ArchetypeBadge archetype={profile.archetype} />
              )}
              <div className="flex items-center gap-1.5 text-sm text-casanova-muted">
                <span className="font-semibold text-casanova-text">{profile.total_sessions}</span>
                sessions completed
              </div>
            </div>

            {/* Arts practiced */}
            <div>
              <p className="text-xs font-medium text-casanova-muted mb-2.5">The Seven Arts</p>
              <div className="flex flex-wrap gap-2">
                {ALL_ARTS.map(art => {
                  const practiced = profile.arts_practiced.includes(art);
                  return (
                    <span
                      key={art}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                        practiced
                          ? 'bg-casanova-accent-soft text-casanova-accent border border-casanova-accent/20'
                          : 'bg-casanova-bg text-casanova-muted/50 border border-casanova-border'
                      }`}
                    >
                      {practiced && <span className="mr-1">✓</span>}
                      {art}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
