'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp?: string;
}

function renderMarkdown(text: string) {
  // Simple bold markdown: **text** → <strong>text</strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      <span className="typing-dot-1 w-2 h-2 rounded-full bg-casanova-muted/60 inline-block" />
      <span className="typing-dot-2 w-2 h-2 rounded-full bg-casanova-muted/60 inline-block" />
      <span className="typing-dot-3 w-2 h-2 rounded-full bg-casanova-muted/60 inline-block" />
    </div>
  );
}

export default function ChatBubble({ role, content, isStreaming, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  const formattedTime = useMemo(() => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return null;
    }
  }, [timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-casanova-accent-soft flex items-center justify-center mr-2.5 mt-1">
          <span className="text-casanova-accent text-sm font-bold">C</span>
        </div>
      )}

      <div className="flex flex-col max-w-[80%]">
        <div
          className={`
            px-4 py-3 text-[15px] leading-relaxed
            ${isUser
              ? 'bg-casanova-accent text-white rounded-2xl rounded-br-md'
              : 'bg-casanova-surface text-casanova-text rounded-2xl rounded-bl-md border border-casanova-border'
            }
          `}
        >
          {content ? (
            <p className="whitespace-pre-wrap">{renderMarkdown(content)}</p>
          ) : isStreaming ? (
            <TypingIndicator />
          ) : null}
          {isStreaming && content && (
            <span className="inline-block w-0.5 h-4 bg-current opacity-60 animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* Timestamp */}
        {formattedTime && (
          <span className={`text-[11px] text-casanova-muted/60 mt-1 ${isUser ? 'text-right' : 'text-left ml-1'}`}>
            {formattedTime}
          </span>
        )}
      </div>
    </motion.div>
  );
}
