'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import ArchetypeBadge from '@/components/ui/ArchetypeBadge';
import Button from '@/components/ui/Button';
import { Profile, Art } from '@/types';

const ALL_ARTS: Art[] = ['question', 'suggestion', 'rhythm', 'attunement', 'vulnerability', 'detail', 'absence'];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data);
    } catch {
      setProfile({
        id: 'mock-user',
        display_name: 'Demo User',
        archetype: 'enigma',
        archetype_discovered_at: new Date().toISOString(),
        onboarding_completed: true,
        subscription_tier: 'free',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        sessions_this_month: 2,
        sessions_month_reset: new Date().toISOString(),
        arts_practiced: ['question', 'suggestion', 'rhythm'],
        total_sessions: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handleManageSubscription = async () => {
    if (profile?.subscription_tier === 'free') {
      router.push('/app/upgrade');
      return;
    }
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.portal_url;
    } catch {
      alert('Unable to open subscription management. Please try again.');
    }
  };

  const handleDeleteAllData = async () => {
    if (!confirm('This will permanently delete ALL your data — sessions, messages, and your profile. This cannot be undone. Are you sure?')) return;

    setDeleting(true);
    try {
      await fetch('/api/data/all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE_ALL_MY_DATA' }),
      });
      router.push('/');
    } catch {
      alert('Failed to delete data. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    router.push('/');
  };

  if (!profile) {
    return (
      <AppShell>
        <div className="pt-12 text-center text-casanova-muted animate-pulse">Loading profile...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="pt-8 pb-4 space-y-8">
        <h1 className="text-2xl font-bold text-casanova-text">Profile</h1>

        {/* Archetype */}
        {profile.archetype && (
          <div className="flex flex-col items-center py-6">
            <ArchetypeBadge archetype={profile.archetype} size="lg" showDescription />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-casanova-surface border border-casanova-border text-center">
            <p className="text-2xl font-bold text-casanova-text">{profile.total_sessions}</p>
            <p className="text-xs text-casanova-muted">Total Sessions</p>
          </div>
          <div className="p-4 rounded-xl bg-casanova-surface border border-casanova-border text-center">
            <p className="text-2xl font-bold text-casanova-text">{profile.arts_practiced.length}/{ALL_ARTS.length}</p>
            <p className="text-xs text-casanova-muted">Arts Practiced</p>
          </div>
        </div>

        {/* Arts Progress */}
        <div>
          <h3 className="text-sm font-semibold text-casanova-text mb-3">Arts Progress</h3>
          <div className="grid grid-cols-2 gap-2">
            {ALL_ARTS.map(art => (
              <div
                key={art}
                className={`px-3 py-2 rounded-xl text-sm capitalize flex items-center gap-2 ${
                  profile.arts_practiced.includes(art)
                    ? 'bg-casanova-accent-soft text-casanova-accent font-medium'
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  profile.arts_practiced.includes(art) ? 'bg-casanova-accent' : 'bg-gray-300'
                }`} />
                {art}
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="p-4 rounded-2xl bg-casanova-surface border border-casanova-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-casanova-text">Subscription</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
              profile.subscription_tier === 'free'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-casanova-gold/20 text-casanova-gold'
            }`}>
              {profile.subscription_tier}
            </span>
          </div>
          <p className="text-sm text-casanova-muted mb-3">
            {profile.subscription_tier === 'free'
              ? `${profile.sessions_this_month}/3 sessions used this month`
              : `${profile.sessions_this_month}/100 sessions used this month`
            }
          </p>
          <Button
            variant={profile.subscription_tier === 'free' ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleManageSubscription}
          >
            {profile.subscription_tier === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'}
          </Button>
        </div>

        {/* Privacy & Data */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-casanova-text">Privacy & Data</h3>
          <Button variant="danger" size="sm" onClick={handleDeleteAllData} loading={deleting}>
            Delete All My Data
          </Button>
          <p className="text-xs text-casanova-muted">
            This permanently deletes all sessions, messages, and your profile. Cannot be undone.
          </p>
        </div>

        {/* Sign Out */}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
          Sign Out
        </Button>
      </div>
    </AppShell>
  );
}
