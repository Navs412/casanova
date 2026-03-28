'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';

const plans = [
  {
    tier: 'free' as const,
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      { text: '3 coaching sessions/month', included: true },
      { text: 'Prep mode only', included: true },
      { text: 'Text input only', included: true },
      { text: 'Voice input', included: false },
      { text: 'Pause & Debrief modes', included: false },
      { text: 'Session memory', included: false },
      { text: 'Progress tracking', included: false },
    ],
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    trial: '7-day free trial',
    features: [
      { text: 'Unlimited sessions', included: true },
      { text: 'All three modes', included: true },
      { text: 'Voice input', included: true },
      { text: 'Session memory', included: true },
      { text: 'Progress tracking', included: true },
    ],
    highlighted: true,
  },
  {
    tier: 'annual' as const,
    name: 'Annual',
    price: '$79.99',
    period: '/year',
    trial: '7-day free trial · Save 33%',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Best value', included: true },
    ],
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: 'pro' | 'annual') => {
    setLoading(tier);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      alert('Unable to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AppShell>
      <div className="pt-8 pb-4">
        <button onClick={() => router.back()} className="text-sm text-casanova-muted mb-4 hover:text-casanova-text">
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-casanova-text mb-2">Upgrade Your Coaching</h1>
        <p className="text-casanova-muted text-sm mb-8">Unlock unlimited sessions, voice input, and all coaching modes.</p>

        <div className="space-y-4">
          {plans.map(plan => (
            <div
              key={plan.tier}
              className={`p-5 rounded-2xl border ${
                plan.highlighted
                  ? 'border-casanova-accent shadow-lg shadow-casanova-accent/10 bg-white'
                  : 'border-casanova-border bg-casanova-surface'
              }`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-casanova-text">{plan.name}</h3>
                  {plan.trial && <p className="text-xs text-casanova-success font-medium">{plan.trial}</p>}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-casanova-text">{plan.price}</span>
                  <span className="text-sm text-casanova-muted">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map(f => (
                  <li key={f.text} className={`flex items-center gap-2 text-sm ${f.included ? 'text-casanova-text' : 'text-casanova-muted'}`}>
                    <span className={f.included ? 'text-casanova-success' : ''}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.tier !== 'free' && (
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  size="md"
                  className="w-full"
                  loading={loading === plan.tier}
                  onClick={() => handleUpgrade(plan.tier as 'pro' | 'annual')}
                >
                  {plan.highlighted ? 'Start Pro' : 'Start Annual'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
