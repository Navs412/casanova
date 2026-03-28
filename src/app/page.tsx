'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const archetypes = [
  'Charmer', 'Magnetic', 'Enigma', 'Ideal', 'Bold',
  'Natural', 'Aesthete', 'Luminary', 'Alchemist',
];

const pricingPlans = [
  {
    name: 'Free',
    price: 'Free forever',
    features: ['3 sessions/month', 'Prep mode only', 'Text only'],
    missing: ['Voice mode', 'Session memory', 'Progress tracking'],
    cta: 'Get Started',
    href: '/try',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: ['Unlimited sessions', 'All three modes', 'Voice input', 'Session memory', 'Progress tracking', '7-day free trial'],
    missing: [],
    cta: 'Start Pro',
    href: '/try',
    highlighted: true,
  },
  {
    name: 'Annual',
    price: '$79.99/yr',
    features: ['Everything in Pro', 'Save 33%', '7-day free trial'],
    missing: [],
    cta: 'Start Annual',
    href: '/try',
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-casanova-bg overflow-x-hidden">
      {/* Navigation */}
      <nav className="px-6 py-4 max-w-[1100px] mx-auto flex items-center justify-between">
        <span className="text-lg font-bold text-casanova-text tracking-tight">Casanova</span>
        <Link
          href="/try"
          className="text-sm font-medium text-casanova-accent hover:text-casanova-accent/80 transition-colors"
        >
          Try free
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-28 max-w-[1100px] mx-auto text-center">
        {/* Subtle warm gradient backdrop */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-casanova-accent-soft/40 via-casanova-bg to-casanova-bg rounded-full blur-3xl" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-casanova-text leading-[1.1] tracking-tight mb-6 max-w-3xl mx-auto"
        >
          Most people hope good conversations happen to them.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg sm:text-xl text-casanova-muted mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Casanova teaches you how to make them happen — with anyone, anywhere.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/try"
            className="inline-block px-10 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 hover:shadow-2xl hover:shadow-casanova-accent/30 active:scale-[0.98]"
          >
            Try your first session free &rarr;
          </Link>
          <p className="mt-4 text-sm text-casanova-muted">
            No signup required. 60 seconds to your first coaching insight.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white/60">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-casanova-text text-center mb-4">How It Works</h2>
          <p className="text-casanova-muted text-center mb-12 max-w-md mx-auto">Three modes for every moment in a conversation</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Prep', subtitle: 'Before', desc: 'Get ready for any conversation. Specific openers, questions, and strategies tailored to your situation.' },
              { icon: '⚡', title: 'Pause', subtitle: 'During', desc: "Step away for 30 seconds, tell Casanova what's happening, and get instant coaching in real-time." },
              { icon: '📝', title: 'Debrief', subtitle: 'After', desc: 'Review what went well and what to improve. Casanova tracks your growth over time.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-casanova-surface border border-casanova-border hover:border-casanova-accent/20 hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-casanova-text">{item.title}</h3>
                  <span className="text-xs font-medium text-casanova-muted bg-casanova-bg px-2 py-0.5 rounded-full">{item.subtitle}</span>
                </div>
                <p className="text-sm text-casanova-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-casanova-text text-center mb-4">Works everywhere</h2>
          <p className="text-casanova-muted text-center mb-12 max-w-md mx-auto">One coach for every kind of connection</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '💼', title: 'Networking', text: "Nail the networking event you've been dreading" },
              { icon: '💬', title: 'Stalled conversations', text: 'Know exactly what to say when the conversation stalls' },
              { icon: '🤝', title: 'Deep friendships', text: 'Build the kind of friendships where people actually open up' },
              { icon: '✨', title: 'Lasting impressions', text: 'Walk into any room and leave a lasting impression' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 rounded-2xl bg-casanova-surface border border-casanova-border hover:border-casanova-accent/20 transition-all duration-300"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-casanova-text mb-0.5">{item.title}</h3>
                  <p className="text-sm text-casanova-muted leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nine Archetypes */}
      <section className="px-6 py-20 bg-white/60">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-casanova-text mb-4">The Nine Archetypes</h2>
          <p className="text-casanova-muted mb-10 max-w-lg mx-auto">
            Casanova discovers your natural communication archetype and coaches you to master it.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-10">
            {archetypes.map((name, i) => (
              <motion.div
                key={name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="px-4 py-3 rounded-xl bg-casanova-surface border border-casanova-border text-sm font-medium text-casanova-text hover:border-casanova-accent/30 hover:bg-casanova-accent-soft/20 transition-all duration-200 cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 text-casanova-accent font-semibold text-lg hover:gap-3 transition-all duration-200"
          >
            Which one are you? <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-casanova-text text-center mb-4">Simple pricing</h2>
          <p className="text-casanova-muted text-center mb-12 max-w-md mx-auto">Start free. Upgrade when you&apos;re hooked.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`p-7 rounded-2xl border relative ${
                  plan.highlighted
                    ? 'border-casanova-accent bg-white shadow-xl shadow-casanova-accent/10 ring-1 ring-casanova-accent/20'
                    : 'border-casanova-border bg-casanova-surface'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-casanova-accent text-white text-xs font-semibold rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-casanova-text">{plan.name}</h3>
                <p className="text-3xl font-bold text-casanova-text mt-2 mb-5">{plan.price}</p>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-casanova-text">
                      <span className="text-casanova-success flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-casanova-muted">
                      <span className="flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-casanova-accent text-white hover:bg-casanova-accent/90 shadow-lg shadow-casanova-accent/20'
                      : 'bg-casanova-bg text-casanova-text hover:bg-casanova-border/50 border border-casanova-border'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20 bg-white/60">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-casanova-muted mb-10 text-lg">Join people who are becoming better communicators</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { quote: "I walked into my skip-level with a question instead of a pitch. My VP said it was the best conversation we had had in two years. I had practiced it with Casanova the night before.", author: "Kenji M.", role: "Product Manager, Singapore" },
              { quote: "I stopped trying to be interesting at networking events. I started being interested. Three clients in 60 days.", author: "Sarah L.", role: "Freelance consultant" },
              { quote: "I am not naturally good at small talk. Casanova did not fix that. It taught me that small talk is not the point — and showed me what is.", author: "Marcus T.", role: "Software engineer" },
            ].map((t, i) => (
              <motion.div
                key={t.author}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-casanova-surface border border-casanova-border text-left"
              >
                <div className="text-casanova-gold text-2xl mb-3">&ldquo;</div>
                <p className="text-casanova-text text-[15px] leading-relaxed mb-4">{t.quote}</p>
                <p className="text-casanova-muted text-sm font-medium">— {t.author}</p>
                <p className="text-casanova-muted text-xs mt-0.5">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-casanova-text mb-4">
            Your next great conversation starts here
          </h2>
          <p className="text-casanova-muted mb-8 leading-relaxed">
            No signup. No credit card. Just a 60-second taste of what it feels like to have a personal EQ coach in your corner.
          </p>
          <Link
            href="/try"
            className="inline-block px-10 py-4 bg-casanova-accent text-white text-lg font-semibold rounded-2xl hover:bg-casanova-accent/90 transition-all shadow-xl shadow-casanova-accent/20 active:scale-[0.98]"
          >
            Try your first session free &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-casanova-border">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="flex justify-center gap-8 mb-5 text-sm text-casanova-muted">
            <a href="#" className="hover:text-casanova-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-casanova-text transition-colors">Terms</a>
            <a href="#" className="hover:text-casanova-text transition-colors">Contact</a>
          </div>
          <p className="text-xs text-casanova-muted leading-relaxed max-w-md mx-auto">
            Your conversations with Casanova are private. We don&apos;t read them, we don&apos;t sell them, and you can delete them anytime.
          </p>
          <p className="text-xs text-casanova-muted mt-3">&copy; 2026 Casanova</p>
        </div>
      </footer>
    </div>
  );
}
