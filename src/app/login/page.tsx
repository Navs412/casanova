'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const supabase = createClient();

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/app` }
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email to confirm your account.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/app');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-casanova-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-2xl font-bold text-casanova-accent">Casanova</span>
        </Link>

        <div className="bg-casanova-surface border border-casanova-border rounded-2xl p-8">
          <h1 className="text-xl font-bold text-casanova-text mb-1">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-casanova-muted mb-6">
            {isSignup ? 'Start your free coaching journey.' : 'Continue your coaching journey.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-casanova-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-casanova-bg border border-casanova-border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 focus:ring-casanova-accent/30 focus:border-casanova-accent/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-casanova-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-casanova-bg border border-casanova-border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 focus:ring-casanova-accent/30 focus:border-casanova-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-casanova-accent text-white font-semibold rounded-xl hover:bg-casanova-accent/90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Loading...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-casanova-muted mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}
              className="text-casanova-accent hover:underline font-medium"
            >
              {isSignup ? 'Sign in' : 'Sign up free'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-casanova-muted mt-6">
          By continuing you agree to our{' '}
          <Link href="/privacy" className="hover:text-casanova-text">Privacy Policy</Link>
          {' '}and{' '}
          <Link href="/terms" className="hover:text-casanova-text">Terms</Link>
        </p>
      </div>
    </div>
  );
}
