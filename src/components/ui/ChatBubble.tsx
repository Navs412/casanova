'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp?: string;
}

interface CoachingData {
  observation?: string;
  reframe?: string;
  art?: string;
  why?: string;
  micro_script?: string;
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

function extractField(text: string, field: string): string | undefined {
  const match = text.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`));
  if (match) {
    try {
      return JSON.parse(`"${match[1]}"`);
    } catch {
      return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }
  return undefined;
}

function parseCoachingData(text: string): CoachingData | null {
  try {
    return JSON.parse(text);
  } catch {
    // Fallback for streaming / incomplete JSON
    if (text.includes('"observation"') || text.includes('"reframe"')) {
      return {
        observation: extractField(text, 'observation'),
        reframe: extractField(text, 'reframe'),
        art: extractField(text, 'art'),
        why: extractField(text, 'why'),
        micro_script: extractField(text, 'micro_script'),
      };
    }
    return null;
  }
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

  const coachingData = !isUser ? parseCoachingData(content) : null;
  const isCoachingCard = coachingData !== null;

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

      <div className="flex flex-col max-w-[85%]">
        {isUser ? (
          <div className="px-4 py-3 text-[15px] leading-relaxed bg-casanova-accent text-white rounded-2xl rounded-br-md">
            {content ? <p className="whitespace-pre-wrap">{renderMarkdown(content)}</p> : null}
          </div>
        ) : isCoachingCard ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 bg-[#1a1c23] border border-casanova-border/50 rounded-2xl p-5 shadow-lg overflow-hidden relative"
          >
            {/* Glowing accent border top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-casanova-accent via-[#E94560] to-casanova-accent opacity-80" />
            
            {coachingData.observation && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-casanova-muted uppercase tracking-wider">What you did</span>
                <p className="text-[15px] text-casanova-text whitespace-pre-wrap leading-relaxed">{renderMarkdown(coachingData.observation)}</p>
              </div>
            )}
            
            {coachingData.reframe && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-casanova-accent uppercase tracking-wider">Try this instead</span>
                <p className="text-[15px] text-white whitespace-pre-wrap leading-relaxed">{renderMarkdown(coachingData.reframe)}</p>
              </div>
            )}
            
            {coachingData.art && (
              <div className="mt-2 text-sm">
                <span className="inline-block px-3 py-1 bg-[#E94560]/10 border border-[#E94560]/30 rounded-full font-medium text-[#E94560] shadow-[0_0_15px_rgba(233,69,96,0.3)]">
                  The art: {coachingData.art}
                </span>
              </div>
            )}
            
            {coachingData.why && (
              <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-xl border border-white/5 mt-1">
                <span className="text-xs font-semibold text-casanova-muted uppercase tracking-wider">Why it works</span>
                <p className="text-sm text-casanova-muted whitespace-pre-wrap leading-relaxed">{renderMarkdown(coachingData.why)}</p>
              </div>
            )}

            {coachingData.micro_script && (
              <div className="mt-2 bg-[#E94560]/10 border border-[#E94560]/30 rounded-xl p-4">
                <span className="text-xs font-semibold text-[#E94560] uppercase tracking-wider block mb-2">Say this:</span>
                <p className="text-[15px] text-white font-medium italic">"{coachingData.micro_script}"</p>
              </div>
            )}
            
            {isStreaming && (
              <div className="mt-2">
                <TypingIndicator />
              </div>
            )}
          </motion.div>
        ) : (
          <div className="px-4 py-3 text-[15px] leading-relaxed bg-casanova-surface text-casanova-text rounded-2xl rounded-bl-md border border-casanova-border">
            {content ? (
              <p className="whitespace-pre-wrap">{renderMarkdown(content)}</p>
            ) : isStreaming ? (
              <TypingIndicator />
            ) : null}
            {isStreaming && content && (
              <span className="inline-block w-0.5 h-4 bg-current opacity-60 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}

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
