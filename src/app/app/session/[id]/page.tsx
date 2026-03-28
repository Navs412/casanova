'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { SessionMode, Message } from '@/types';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [mode, setMode] = useState<SessionMode>('prep');
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      setMode(data.session?.mode || 'prep');
      setInitialMessages(data.messages || []);
    } catch {
      // Detect mode from URL for demo
      if (sessionId.startsWith('demo-')) {
        const demoMode = sessionId.replace('demo-', '') as SessionMode;
        setMode(demoMode);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionEnd = () => {
    router.push('/app');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casanova-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="typing-dot-1 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
            <span className="typing-dot-2 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
            <span className="typing-dot-3 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
          </div>
          <span className="text-sm text-casanova-muted">Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      sessionId={sessionId}
      mode={mode}
      initialMessages={initialMessages}
      onSessionEnd={handleSessionEnd}
    />
  );
}
