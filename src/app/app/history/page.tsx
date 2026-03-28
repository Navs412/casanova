'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { Session } from '@/types';

const modeIcons: Record<string, string> = {
  prep: '🎯',
  pause: '⚡',
  debrief: '📝',
  onboarding: '🎓',
  simulation: '🎮',
};

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions?limit=50');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      // Mock data for demo
      setSessions([
        {
          id: '1', user_id: 'mock', mode: 'prep',
          context: 'Preparing for a networking event tomorrow',
          relationship_type: 'professional', arts_used: ['question', 'suggestion'],
          summary: 'Practiced opening lines and follow-up questions', rating: 4,
          created_at: new Date(Date.now() - 86400000).toISOString(), ended_at: new Date(Date.now() - 84600000).toISOString(),
        },
        {
          id: '2', user_id: 'mock', mode: 'pause',
          context: 'At a dinner party, conversation stalling',
          relationship_type: 'platonic', arts_used: ['rhythm', 'attunement'],
          summary: 'Quick coaching on re-engaging', rating: 5,
          created_at: new Date(Date.now() - 172800000).toISOString(), ended_at: new Date(Date.now() - 172200000).toISOString(),
        },
        {
          id: '3', user_id: 'mock', mode: 'debrief',
          context: 'Debriefing after a job interview',
          relationship_type: 'professional', arts_used: ['vulnerability', 'detail'],
          summary: 'Reviewed what went well and areas to improve', rating: null,
          created_at: new Date(Date.now() - 259200000).toISOString(), ended_at: new Date(Date.now() - 258600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    try {
      await fetch(`/api/data/sessions/${id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch {
      // Optimistic delete for demo
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  };

  return (
    <AppShell>
      <div className="pt-8 pb-4">
        <h1 className="text-2xl font-bold text-casanova-text mb-6">Session History</h1>

        {loading ? (
          <div className="animate-pulse text-casanova-muted text-center py-12">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-casanova-muted mb-4">No sessions yet. Start your first coaching session!</p>
            <button
              onClick={() => router.push('/app')}
              className="px-6 py-2.5 bg-casanova-accent text-white rounded-xl font-medium hover:bg-casanova-accent/90"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-casanova-surface border border-casanova-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => router.push(`/app/session/${session.id}`)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span className="text-lg">{modeIcons[session.mode] || '💬'}</span>
                    <div>
                      <span className="text-sm font-medium text-casanova-text capitalize">{session.mode}</span>
                      <span className="text-xs text-casanova-muted ml-2">{formatDate(session.created_at)}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-xs text-casanova-muted hover:text-red-500 transition-colors p-1"
                    title="Delete session"
                  >
                    &#10005;
                  </button>
                </div>
                {session.context && (
                  <p className="text-sm text-casanova-text mb-2 line-clamp-2">{session.context}</p>
                )}
                {session.arts_used.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {session.arts_used.map(art => (
                      <span key={art} className="px-2 py-0.5 rounded-full text-xs bg-casanova-accent-soft text-casanova-accent capitalize">
                        {art}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
