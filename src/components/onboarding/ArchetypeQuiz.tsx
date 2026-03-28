'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archetype, ArchetypeScores } from '@/types';
import ArchetypeBadge from '@/components/ui/ArchetypeBadge';

interface QuizQuestion {
  id: number;
  prompt: string;
  options: { label: string; scores?: Partial<ArchetypeScores>; context?: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Let's figure out your natural style. Quick question — when you're at your social best, what's usually happening?",
    options: [
      { label: "I'm one-on-one, talking about something I genuinely care about", scores: { natural: 2, ideal: 2 } },
      { label: "I'm in a group and I've somehow become the center of attention", scores: { magnetic: 2, bold: 2 } },
      { label: "I'm listening closely and making the other person feel amazing", scores: { charmer: 2, ideal: 2 } },
      { label: "I've created some kind of experience or moment that surprised people", scores: { alchemist: 2, aesthete: 2 } },
    ],
  },
  {
    id: 2,
    prompt: "If people were to describe your secret social superpower, what would it be?",
    options: [
      { label: "I notice things about people that others miss", scores: { ideal: 2, aesthete: 2 } },
      { label: "I'm funny or surprising — I say things people don't expect", scores: { bold: 2, natural: 2 } },
      { label: "People feel comfortable and safe around me", scores: { charmer: 2, natural: 2 } },
      { label: "I'm hard to read — people find me intriguing", scores: { enigma: 2, magnetic: 1, luminary: 1 } },
    ],
  },
  {
    id: 3,
    prompt: "And what's the thing that trips you up the most in conversations?",
    options: [
      { label: "I overthink everything and freeze up", scores: { natural: 1 } },
      { label: "I'm fine talking but I struggle to make lasting impressions", scores: { enigma: 2, luminary: 1 } },
      { label: "I can connect one-on-one but groups drain me", scores: { ideal: 1, charmer: 1 } },
      { label: "I tend to play it too safe and conversations stay surface-level", scores: { bold: 2 } },
    ],
  },
  {
    id: 4,
    prompt: "Where do you feel this the most?",
    options: [
      { label: "Dating and romantic situations", context: "romantic" },
      { label: "Work — meetings, networking, presentations", context: "professional" },
      { label: "Friendships and social gatherings", context: "platonic" },
      { label: "Honestly, everywhere", context: "unspecified" },
    ],
  },
];

const archetypeDescriptions: Record<Archetype, string> = {
  charmer: "You have a natural warmth that makes others feel like the most important person in the room. Your quietness isn't weakness — it's focused attention that few people are capable of. I'm going to teach you how to deploy that warmth strategically.",
  magnetic: "You have a presence that fills a room without effort. People sense your conviction even when you're not speaking. I'm going to teach you how to channel that energy so it lands with precision.",
  enigma: "You have a natural depth that most people only scratch the surface of. Your quietness isn't a weakness — it's mystique. The people who get to know you are fascinated precisely because you don't give everything away at once. I'm going to teach you how to turn that into your greatest asset.",
  ideal: "You intuitively sense what others need and reflect it back. Not by faking — by finding genuine overlap between who you are and what they yearn for. I'm going to teach you how to use that gift to create connections people never forget.",
  bold: "You have a sharp mind and the courage to say what others won't. That's rare. I'm going to teach you how to channel that energy so it electrifies conversations without ever crossing the line.",
  natural: "You have a spontaneity that puts people at ease instantly. Your lack of pretense is your superpower. I'm going to teach you how to trust those instincts more and get out of your own head.",
  aesthete: "You notice the details that make life beautiful — the right song, the perfect restaurant, the thoughtful gesture. I'm going to teach you how to turn that taste into a social superpower.",
  luminary: "You stand out — and that's your greatest asset. Your distinctive way of seeing the world makes people want to orbit around you. I'm going to teach you how to own that fully.",
  alchemist: "You have a gift for transforming ordinary moments into meaningful ones. A conversation with you becomes a revelation. I'm going to teach you how to deploy that creative energy in every interaction.",
};

interface ArchetypeQuizProps {
  onComplete: (archetype: Archetype, context: string) => void;
}

export default function ArchetypeQuiz({ onComplete }: ArchetypeQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<ArchetypeScores>({
    charmer: 0, magnetic: 0, enigma: 0, ideal: 0, bold: 0,
    natural: 0, aesthete: 0, luminary: 0, alchemist: 0,
  });
  const [selectedContext, setSelectedContext] = useState('unspecified');
  const [result, setResult] = useState<Archetype | null>(null);

  const handleAnswer = (optionIdx: number) => {
    const question = questions[currentQ];
    const option = question.options[optionIdx];

    const newScores = { ...scores };
    if (option.scores) {
      for (const [key, val] of Object.entries(option.scores)) {
        newScores[key as Archetype] += val as number;
      }
    }
    setScores(newScores);

    if (option.context) {
      setSelectedContext(option.context);
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const archetype = calculateArchetype(newScores);
      setResult(archetype);
    }
  };

  const calculateArchetype = (s: ArchetypeScores): Archetype => {
    let maxScore = 0;
    let topArchetype: Archetype = 'natural';

    for (const [key, val] of Object.entries(s)) {
      if (val > maxScore) {
        maxScore = val;
        topArchetype = key as Archetype;
      }
    }

    if (maxScore < 3) return 'natural';
    return topArchetype;
  };

  // Result screen
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
      >
        {/* Celebratory background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-casanova-accent-soft/50 to-casanova-gold/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <p className="text-casanova-muted text-sm mb-6 tracking-wide uppercase">Your archetype is</p>
          <ArchetypeBadge archetype={result} size="lg" showDescription />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 text-casanova-text text-base leading-relaxed max-w-sm"
        >
          {archetypeDescriptions[result]}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete(result, selectedContext)}
          className="mt-10 px-8 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 active:scale-[0.98]"
        >
          Begin your first session &rarr;
        </motion.button>
      </motion.div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="flex flex-col min-h-[80vh] px-5 py-8">
      {/* Header */}
      <div className="text-center mb-2">
        <span className="text-sm font-semibold text-casanova-accent tracking-tight">Casanova</span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2.5 mb-10">
        {questions.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === currentQ ? 1.2 : 1,
              backgroundColor: i <= currentQ ? '#E94560' : '#E5E0D8',
            }}
            transition={{ duration: 0.2 }}
            className="w-2.5 h-2.5 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1"
        >
          {/* Casanova's question as chat bubble */}
          <div className="mb-8 flex items-start gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-casanova-accent-soft flex items-center justify-center mt-1">
              <span className="text-casanova-accent text-sm font-bold">C</span>
            </div>
            <div className="bg-casanova-surface border border-casanova-border rounded-2xl rounded-bl-md px-4 py-3.5 max-w-[88%]">
              <p className="text-casanova-text text-[15px] leading-relaxed">{question.prompt}</p>
            </div>
          </div>

          {/* Options as tappable cards */}
          <div className="space-y-3 pl-10">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07, duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-5 py-4 rounded-2xl border border-casanova-border bg-white hover:border-casanova-accent/40 hover:bg-casanova-accent-soft/20 transition-all duration-200 text-[15px] text-casanova-text leading-relaxed shadow-sm hover:shadow-md"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
