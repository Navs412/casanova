'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from '@/components/ui/ChatBubble';
import VoiceInput from './VoiceInput';
import { Message, SessionMode } from '@/types';

interface ChatInterfaceProps {
  sessionId: string;
  mode: SessionMode;
  initialMessages?: Message[];
  onSessionEnd?: () => void;
}

const modeConfig: Record<string, { label: string; icon: string; color: string }> = {
  prep: { label: 'Prep', icon: '🎯', color: 'bg-casanova-accent-soft text-casanova-accent' },
  pause: { label: 'Pause', icon: '⚡', color: 'bg-casanova-accent text-white' },
  debrief: { label: 'Debrief', icon: '📝', color: 'bg-casanova-accent-soft text-casanova-accent' },
  onboarding: { label: 'Onboarding', icon: '👋', color: 'bg-casanova-accent-soft text-casanova-accent' },
  simulation: { label: 'Simulation', icon: '🎭', color: 'bg-casanova-accent-soft text-casanova-accent' },
};

export default function ChatInterface({ sessionId, mode, initialMessages = [], onSessionEnd }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: 'user',
      content: input.trim(),
      is_ephemeral: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage.content,
          is_ephemeral: false,
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        role: 'assistant',
        content: fullContent,
        is_ephemeral: false,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleEndSession = async () => {
    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end' }),
      });
      onSessionEnd?.();
    } catch (error) {
      console.error('End session error:', error);
    }
  };

  const config = modeConfig[mode] || modeConfig.prep;

  return (
    <div className="flex flex-col h-screen bg-casanova-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-casanova-border/60 bg-white/95 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            <span>{config.icon}</span>
            {config.label}
          </span>
        </div>
        <button
          onClick={() => setShowEndConfirm(true)}
          className="text-sm text-casanova-muted hover:text-casanova-accent transition-colors font-medium"
        >
          End Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.created_at}
            />
          ))}
          {isStreaming && (
            <ChatBubble role="assistant" content={streamingContent} isStreaming />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={sendMessage} className="px-4 py-3 border-t border-casanova-border/60 bg-white/95 backdrop-blur-lg">
        <div className="max-w-2xl mx-auto">
          {mode === 'pause' && (
            <p className="text-xs text-casanova-muted mb-2 pl-1">Quick response mode — tell me what&apos;s happening</p>
          )}
          <div className="flex items-end gap-2">
            <VoiceInput onTranscript={setInput} disabled={isStreaming} />
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder={mode === 'pause' ? "What's happening right now?" : "Type your message..."}
              className="flex-1 px-4 py-3 rounded-2xl border border-casanova-border bg-casanova-bg text-casanova-text placeholder:text-casanova-muted/60 focus:outline-none focus:ring-2 focus:ring-casanova-accent/20 focus:border-casanova-accent/40 transition-all text-[15px] resize-none min-h-[46px] max-h-[120px] leading-relaxed"
              rows={1}
              disabled={isStreaming}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="p-3 rounded-full bg-casanova-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-casanova-accent/90 transition-all shadow-md shadow-casanova-accent/20 flex-shrink-0 mb-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </div>
        </div>
      </form>

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowEndConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-4 right-4 bottom-8 mx-auto max-w-sm bg-white rounded-2xl p-6 shadow-2xl z-50"
            >
              <h3 className="text-lg font-bold text-casanova-text mb-2">End this session?</h3>
              <p className="text-sm text-casanova-muted mb-6 leading-relaxed">
                Your insights will be saved. You can always start a new session later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-casanova-text bg-casanova-bg border border-casanova-border hover:bg-casanova-border/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndSession}
                  className="flex-1 py-3 rounded-xl font-medium text-white bg-casanova-accent hover:bg-casanova-accent/90 transition-colors shadow-lg shadow-casanova-accent/20"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
