'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Quiz Logic ─── */
type Archetype = 'Ideal' | 'Magnetic' | 'Enigma' | 'Natural';

const archetypeDescriptions: Record<Archetype, string> = {
  Ideal:
    'You connect deeply but selectively. Your gift is making people feel truly seen — but only when you trust the space.',
  Magnetic:
    'You create energy in any room. Your challenge is turning that energy into something that lasts.',
  Enigma:
    'You have depth that most people only scratch the surface of. Your quietness is your power — if you learn to use it.',
  Natural:
    'You are authentic and warm. People trust you quickly. Your growth edge is depth — going beyond likable to truly memorable.',
};

function scoreArchetype(answers: [string, string, string]): Archetype {
  const [q1, q2, q3] = answers;
  if (q1 === 'A' && q3 === 'C') return 'Ideal';
  if (q1 === 'B' || q1 === 'D') return 'Magnetic';
  if (q2 === 'D' && q3 === 'B') return 'Enigma';
  return 'Natural';
}

/* ─── Animations ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ─── Page ─── */
export default function LandingPage() {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  const handleQuizAnswer = (answer: string) => {
    const next = [...quizAnswers, answer];
    setQuizAnswers(next);
    setQuizStep(quizStep + 1);
  };

  const archetype =
    quizStep >= 3
      ? scoreArchetype(quizAnswers as [string, string, string])
      : null;

  return (
    <div className="min-h-screen bg-casanova-bg text-casanova-text overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 nav-glass border-b border-casanova-border">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-casanova-accent tracking-tight">
            Casanova
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-casanova-muted hover:text-casanova-text transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/try"
              className="text-sm font-semibold px-5 py-2 bg-casanova-accent text-white rounded-xl hover:bg-casanova-accent/90 transition-all"
            >
              Get your archetype &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-casanova-accent/10 blur-[120px]" />
          <div className="orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-casanova-navy/30 blur-[100px]" />
          <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-casanova-accent/5 blur-[140px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-casanova-muted mb-6"
          >
            AI Conversation Coach
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          >
            Stop leaving your best conversations to chance.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl text-casanova-muted mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Casanova is the AI coach that learns your communication style and
            gets more valuable every session. Used by professionals across
            Singapore and beyond.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/try"
              className="inline-block px-10 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 hover:shadow-2xl hover:shadow-casanova-accent/30 active:scale-[0.98]"
            >
              Get your Social Archetype &rarr;
            </Link>
            <p className="mt-4 text-sm text-casanova-muted">
              Free to try. No signup required. 60 seconds.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 text-sm text-casanova-muted"
          >
            Join{' '}
            <span className="text-casanova-text font-semibold">2,400+</span>{' '}
            professionals already coaching with Casanova
          </motion.p>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="px-6 py-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: '1 in 6',
                text: 'people worldwide experience chronic loneliness',
                source: 'WHO, 2025',
              },
              {
                stat: '58%',
                text: 'of professionals say poor communication holds back their career',
                source: 'McKinsey',
              },
              {
                stat: '7',
                text: 'high-stakes conversations per month the average person wishes they had handled differently',
                source: 'Casanova research',
              },
            ].map((item, i) => (
              <motion.div
                key={item.stat}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-casanova-card border border-casanova-border text-center"
              >
                <p className="font-serif text-4xl md:text-5xl font-bold text-casanova-accent mb-3">
                  {item.stat}
                </p>
                <p className="text-[15px] text-casanova-text leading-relaxed mb-3">
                  {item.text}
                </p>
                <p className="text-xs text-casanova-muted">
                  — {item.source}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE MODES ── */}
      <section className="px-6 py-24 bg-casanova-surface">
        <div className="max-w-[800px] mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
          >
            Three modes. One coach.
          </motion.h2>
          <p className="text-casanova-muted text-center mb-14 max-w-md mx-auto">
            Before, during, and after — Casanova has you covered.
          </p>

          <div className="space-y-6">
            {/* PREP */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="p-8 rounded-2xl bg-casanova-card border border-casanova-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{'\u{1F3AF}'}</span>
                <h3 className="text-xl font-bold">Prep</h3>
              </div>
              <p className="text-sm text-casanova-muted mb-1 font-medium">
                Before the conversation
              </p>
              <p className="text-casanova-text leading-relaxed mb-3">
                Tell Casanova what you are walking into. Get specific openers,
                questions, and strategies built around your situation — not
                generic advice.
              </p>
              <p className="text-xs text-casanova-muted">
                High-stakes meetings &bull; First dates &bull; Networking events
              </p>
            </motion.div>

            {/* PAUSE — honest reframe */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="relative p-8 md:p-10 rounded-2xl bg-casanova-card border-2 border-casanova-accent/40 shadow-[0_0_40px_rgba(233,69,96,0.12)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{'\u26A1'}</span>
                <h3 className="text-xl font-bold">Pause</h3>
              </div>
              <p className="text-sm text-casanova-muted mb-1 font-medium">
                When you have 60 seconds between conversations
              </p>
              <p className="text-casanova-text leading-relaxed mb-3">
                Bathroom break at a dinner. Walking to refill your drink. The
                moment before you walk back into the meeting. Tell Casanova what
                just happened — get an instant reframe and walk back in
                differently.
              </p>
              <p className="text-xs text-casanova-muted italic">
                Because the best coaching happens in the margins of real life.
              </p>
            </motion.div>

            {/* DEBRIEF */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="p-8 rounded-2xl bg-casanova-card border border-casanova-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{'\u{1F4DD}'}</span>
                <h3 className="text-xl font-bold">Debrief</h3>
              </div>
              <p className="text-sm text-casanova-muted mb-1 font-medium">
                After it ends
              </p>
              <p className="text-casanova-text leading-relaxed mb-3">
                Replay what happened. Casanova identifies your patterns, names
                what worked, and builds a personalized coaching note for next
                time.
              </p>
              <p className="text-xs text-casanova-muted">
                Turn every conversation into a lesson
              </p>
            </motion.div>
          </div>

          {/* Section CTA */}
          <div className="text-center mt-10">
            <Link
              href="/try"
              className="inline-block px-8 py-3.5 bg-casanova-accent text-white font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-lg shadow-casanova-accent/20 active:scale-[0.98]"
            >
              Get your Social Archetype &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE REAL USP — The coach that knows you ── */}
      <section className="px-6 py-24">
        <div className="max-w-[1100px] mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-3"
          >
            The coach that actually knows you.
          </motion.h2>
          <p className="text-casanova-muted text-center mb-14 max-w-lg mx-auto">
            Most AI tools forget you the moment you close the tab. Casanova
            remembers.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '\u{1F9EC}',
                title: 'Your Archetype',
                text: 'Casanova discovers your natural communication style in your first session. Every coaching session after is built around it.',
              },
              {
                icon: '\u{1F4C8}',
                title: 'Your Progress',
                text: 'Track which of the Seven Arts you have practiced. Watch your range expand over time.',
              },
              {
                icon: '\u{1F50D}',
                title: 'Your Patterns',
                text: 'Casanova identifies what you do when you are nervous, when you overcommunicate, when you go quiet. Then it teaches you to catch yourself.',
              },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-casanova-card border border-casanova-border"
              >
                <span className="text-3xl block mb-4">{col.icon}</span>
                <h3 className="text-lg font-bold mb-2">{col.title}</h3>
                <p className="text-sm text-casanova-muted leading-relaxed">
                  {col.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-casanova-muted text-sm mb-5 italic">
              This is what separates a coach from a chatbot.
            </p>
            <Link
              href="/try"
              className="inline-block px-8 py-3.5 bg-casanova-accent text-white font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-lg shadow-casanova-accent/20 active:scale-[0.98]"
            >
              Start building your profile &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARCHETYPE QUIZ ── */}
      <section className="px-6 py-24 bg-casanova-surface">
        <div className="max-w-[650px] mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-3"
          >
            What kind of conversationalist are you?
          </motion.h2>
          <p className="text-casanova-muted text-center mb-12 max-w-md mx-auto">
            Answer 3 quick questions. Casanova will tell you your archetype and
            what it means for your next conversation.
          </p>

          {/* Q1 */}
          {quizStep === 0 && (
            <QuizQuestion
              num={1}
              question="When you are at your social best, what is usually happening?"
              options={[
                {
                  key: 'A',
                  text: 'I am one-on-one, going deep on something I care about',
                },
                {
                  key: 'B',
                  text: 'I have somehow become the center of attention in a group',
                },
                {
                  key: 'C',
                  text: 'I am making someone feel genuinely heard',
                },
                {
                  key: 'D',
                  text: 'I created a moment that surprised everyone',
                },
              ]}
              onAnswer={handleQuizAnswer}
            />
          )}

          {/* Q2 */}
          {quizStep === 1 && (
            <QuizQuestion
              num={2}
              question="What do people say is your social superpower?"
              options={[
                {
                  key: 'A',
                  text: 'I notice things about people others miss',
                },
                { key: 'B', text: 'I am funny or surprising' },
                { key: 'C', text: 'People feel safe around me' },
                {
                  key: 'D',
                  text: 'I am hard to read — people find me intriguing',
                },
              ]}
              onAnswer={handleQuizAnswer}
            />
          )}

          {/* Q3 */}
          {quizStep === 2 && (
            <QuizQuestion
              num={3}
              question="What trips you up most?"
              options={[
                { key: 'A', text: 'I overthink and freeze' },
                {
                  key: 'B',
                  text: 'I connect but struggle to leave a lasting impression',
                },
                {
                  key: 'C',
                  text: 'I am great one-on-one but groups drain me',
                },
                {
                  key: 'D',
                  text: 'I play it safe and conversations stay surface-level',
                },
              ]}
              onAnswer={handleQuizAnswer}
            />
          )}

          {/* Result */}
          {archetype && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-casanova-muted mb-2">Your archetype</p>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-casanova-accent mb-4">
                The {archetype}
              </h3>
              <p className="text-casanova-muted text-lg leading-relaxed mb-8 max-w-md mx-auto">
                {archetypeDescriptions[archetype]}
              </p>
              <Link
                href="/try"
                className="inline-block px-8 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 active:scale-[0.98]"
              >
                See what Casanova can teach the {archetype} &rarr;
              </Link>
              <button
                onClick={() => {
                  setQuizStep(0);
                  setQuizAnswers([]);
                }}
                className="block mx-auto mt-4 text-sm text-casanova-muted hover:text-casanova-text transition-colors"
              >
                Retake quiz
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="px-6 py-24">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-14">
            What people are saying
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                quote:
                  'I walked into my skip-level with a question instead of a pitch. My VP said it was the best conversation we had had in two years.',
                author: 'Kenji M.',
                role: 'Product Manager',
              },
              {
                quote:
                  'I stopped trying to be interesting at networking events. I started being interested. Three clients in 60 days.',
                author: 'Sarah L.',
                role: 'Freelance Consultant',
              },
              {
                quote:
                  'I am not naturally good at small talk. Casanova did not fix that. It taught me that small talk is not the point — and showed me what is.',
                author: 'Marcus T.',
                role: 'Software Engineer',
              },
              {
                quote:
                  'I have had Casanova for six weeks. I still use ChatGPT for work. But for conversations I actually care about? There is no comparison. It knows me.',
                author: 'Priya R.',
                role: 'Business Development, Singapore',
              },
            ].map((t, i) => (
              <motion.div
                key={t.author}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-casanova-card border border-casanova-border"
              >
                <div className="text-casanova-gold text-2xl mb-3">
                  &ldquo;
                </div>
                <p className="text-[15px] leading-relaxed mb-4">{t.quote}</p>
                <p className="text-casanova-muted text-sm font-medium">
                  — {t.author}
                </p>
                <p className="text-casanova-muted text-xs mt-0.5">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="px-6 py-24 bg-casanova-surface">
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-4"
          >
            Simple pricing
          </motion.h2>
          <p className="text-casanova-muted text-center mb-14 max-w-md mx-auto">
            Start free. Upgrade when Casanova proves its value.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {/* Free tier */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="p-7 rounded-2xl bg-casanova-card border border-casanova-border"
            >
              <h3 className="text-lg font-bold mb-1">Free</h3>
              <p className="text-3xl font-bold mb-4">
                $0<span className="text-sm font-normal text-casanova-muted">/mo</span>
              </p>
              <ul className="space-y-2.5 text-sm text-casanova-muted mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  3 sessions per month
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Full experience — Prep, Pause, and Debrief
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Archetype discovery
                </li>
              </ul>
              <Link
                href="/try"
                className="block text-center px-6 py-3 border border-casanova-border text-casanova-text font-semibold rounded-xl hover:border-casanova-accent/40 transition-all"
              >
                Get your Social Archetype &rarr;
              </Link>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="relative p-7 rounded-2xl bg-casanova-card border-2 border-casanova-accent/40 shadow-[0_0_40px_rgba(233,69,96,0.08)]"
            >
              <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase text-casanova-accent bg-casanova-accent/10 px-3 py-1 rounded-full">
                7-day free trial
              </span>
              <h3 className="text-lg font-bold mb-1">Pro</h3>
              <p className="text-3xl font-bold mb-4">
                $9.99<span className="text-sm font-normal text-casanova-muted">/mo</span>
              </p>
              <ul className="space-y-2.5 text-sm text-casanova-muted mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Unlimited sessions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Session memory — Casanova learns over time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Pattern tracking across the Seven Arts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Personalized coaching notes
                </li>
              </ul>
              <Link
                href="/try"
                className="block text-center px-6 py-3 bg-casanova-accent text-white font-semibold rounded-xl hover:bg-casanova-accent/90 transition-all shadow-lg shadow-casanova-accent/20 active:scale-[0.98]"
              >
                Start your 7-day free trial &rarr;
              </Link>
            </motion.div>

            {/* Annual tier */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="relative p-7 rounded-2xl bg-casanova-card border border-casanova-border"
            >
              <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase text-casanova-gold bg-casanova-gold/10 px-3 py-1 rounded-full">
                Save 33%
              </span>
              <h3 className="text-lg font-bold mb-1">Annual</h3>
              <p className="text-3xl font-bold mb-1">
                $79.99<span className="text-sm font-normal text-casanova-muted">/yr</span>
              </p>
              <p className="text-xs text-casanova-muted mb-4">~$6.67/mo — two months free</p>
              <ul className="space-y-2.5 text-sm text-casanova-muted mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Everything in Pro
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  Two months free
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-casanova-success mt-0.5">&#10003;</span>
                  7-day free trial included
                </li>
              </ul>
              <Link
                href="/try"
                className="block text-center px-6 py-3 border border-casanova-gold/40 text-casanova-gold font-semibold rounded-xl hover:bg-casanova-gold/10 transition-all"
              >
                Get Annual &rarr;
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-sm text-casanova-muted mt-8">
            No credit card required for the free tier. Cancel Pro anytime.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            You have a conversation coming up that matters.
          </h2>
          <p className="text-casanova-muted mb-8 leading-relaxed text-lg">
            You already know which one. Casanova can help you prepare for it
            right now — in 60 seconds, before you talk yourself out of it.
          </p>
          <Link
            href="/try"
            className="inline-block px-10 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 active:scale-[0.98]"
          >
            Prepare for it now &rarr;
          </Link>
          <p className="mt-5 text-sm text-casanova-muted">
            Join{' '}
            <span className="text-casanova-text font-semibold">2,400+</span>{' '}
            professionals already coaching with Casanova
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-10 border-t border-casanova-border">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="flex justify-center gap-8 mb-5 text-sm text-casanova-muted">
            <a
              href="#"
              className="hover:text-casanova-text transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-casanova-text transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-casanova-text transition-colors"
            >
              Contact
            </a>
          </div>
          <p className="text-xs text-casanova-muted leading-relaxed max-w-md mx-auto">
            Your conversations with Casanova are private. We don&apos;t read
            them, we don&apos;t sell them, and you can delete them anytime.
          </p>
          <p className="text-xs text-casanova-muted mt-3">
            &copy; 2026 Casanova
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Quiz Question Component ─── */
function QuizQuestion({
  num,
  question,
  options,
  onAnswer,
}: {
  num: number;
  question: string;
  options: { key: string; text: string }[];
  onAnswer: (key: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-xs text-casanova-muted mb-2 font-medium">
        Question {num} of 3
      </p>
      <h3 className="text-lg font-semibold mb-6">{question}</h3>
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onAnswer(opt.key)}
            className="w-full text-left px-5 py-4 rounded-xl bg-casanova-card border border-casanova-border hover:border-casanova-accent/40 hover:bg-casanova-accent/5 transition-all duration-200 text-sm leading-relaxed"
          >
            <span className="text-casanova-accent font-semibold mr-2">
              {opt.key}.
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
