'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from '@/components/ui/ChatBubble';
import Link from 'next/link';

interface AhaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function TryPage() {
  const [messages, setMessages] = useState<AhaMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [scenarioLoaded, setScenarioLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadScenario();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const loadScenario = async () => {
    try {
      const res = await fetch('/api/scenario/random?type=aha_moment');
      const data = await res.json();
      setMessages([{
        id: '1',
        role: 'assistant',
        content: data.scenario_text,
      }]);
    } catch {
      // Fallback scenario
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "You're at a friend's gathering. You've been talking to someone interesting for a few minutes, and the conversation is going well — but you can feel it starting to drift toward surface-level territory. You want to take it deeper without it feeling forced. What do you say next?",
      }]);
    }
    setScenarioLoaded(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: AhaMessage = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/aha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value);
          setStreamingContent(fullContent);
        }
      }

      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: fullContent }]);
      setStreamingContent('');
      setExchangeCount(prev => prev + 1);

      if (exchangeCount >= 2) {
        setTimeout(() => setShowSignup(true), 1500);
      }
    } catch {
      const fallbackResponse = JSON.stringify({
        observation: "That's an interesting approach. Here's what I notice — you're leading with a safe question.",
        reframe: "Share something slightly unexpected about yourself first. It signals vulnerability, which invites the other person to match your depth.",
        art: "Art of Vulnerability",
        why: "It bypasses the surface level entirely by signalling openness.",
        micro_script: "I have this theory that the best conversations happen when both people stop trying to be interesting. [Pause. Let them respond.]"
      });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fallbackResponse,
      }]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  if (!scenarioLoaded) {
    return (
      <div className="min-h-screen bg-casanova-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="typing-dot-1 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
            <span className="typing-dot-2 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
            <span className="typing-dot-3 w-2.5 h-2.5 rounded-full bg-casanova-accent inline-block" />
          </div>
          <span className="text-sm text-casanova-muted">Setting up your session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-casanova-bg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-casanova-border/60 bg-white/95 backdrop-blur-lg flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-casanova-muted hover:text-casanova-text transition-colors p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-sm font-semibold text-casanova-text tracking-tight">Casanova</span>
        <div className="w-7" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map(msg => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && (
            <ChatBubble role="assistant" content={streamingContent} isStreaming />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Signup prompt - slides up from bottom */}
      <AnimatePresence>
        {showSignup && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-casanova-surface border-t border-casanova-border px-5 py-6 rounded-t-3xl shadow-2xl shadow-black/10"
          >
            <div className="w-10 h-1 bg-casanova-border rounded-full mx-auto mb-4" />
            <p className="text-casanova-text text-[15px] leading-relaxed mb-5 text-center max-w-sm mx-auto">
              I already have a sense of how you connect with people. Want to discover your natural style? It takes 2 minutes.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Link
                href="/onboarding"
                className="block text-center py-3.5 bg-casanova-accent text-white rounded-2xl font-semibold hover:bg-casanova-accent/90 transition-all shadow-lg shadow-casanova-accent/20 active:scale-[0.98]"
              >
                Create free account
              </Link>
              <button
                onClick={() => setShowSignup(false)}
                className="text-sm text-casanova-muted text-center py-2 hover:text-casanova-text transition-colors"
              >
                Continue without account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {!showSignup && (
        <div className="px-4 py-3 border-t border-casanova-border/60 bg-white/95 backdrop-blur-lg">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            {/* Mic icon (disabled) */}
            <button
              disabled
              className="p-2 text-casanova-muted/40 relative group"
              title="Voice coming soon"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-casanova-text rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Voice coming soon
              </span>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 rounded-full border border-casanova-border bg-casanova-bg text-casanova-text placeholder:text-casanova-muted/60 focus:outline-none focus:ring-2 focus:ring-casanova-accent/20 focus:border-casanova-accent/40 transition-all text-[15px]"
              disabled={isStreaming}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="p-3 rounded-full bg-casanova-accent text-white disabled:opacity-40 hover:bg-casanova-accent/90 transition-all shadow-md shadow-casanova-accent/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
