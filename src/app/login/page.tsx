'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (password.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Too weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-500' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very strong', color: 'bg-emerald-500' };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Simple math CAPTCHA
  const [captchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState('');

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignup) {
      // Validate CAPTCHA
      if (parseInt(captchaInput) !== captchaA + captchaB) {
        setError('Incorrect answer. Please try the verification again.');
        return;
      }
      // Validate password strength
      if (passwordStrength.score < 3) {
        setError('Please choose a stronger password.');
        return;
      }
      // Validate password match
      if (!passwordsMatch) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
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
        setSuccess('Check your email to confirm your account. Check your spam folder if you don\'t see it within a minute.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Incorrect email or password.');
      } else {
        router.push('/app');
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setCaptchaInput('');
  };

  return (
    <div className="min-h-screen bg-casanova-bg flex items-center justify-center px-4 py-12">
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
            {/* Email */}
            <div>
              <label className="block text-sm text-casanova-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-casanova-bg border border-casanova-border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 focus:ring-casanova-accent/30 focus:border-casanova-accent/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-casanova-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-casanova-bg border border-casanova-border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 focus:ring-casanova-accent/30 focus:border-casanova-accent/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-casanova-muted hover:text-casanova-text transition-colors text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Password strength indicator — only on signup */}
              {isSignup && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-casanova-border'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength.score <= 1 ? 'text-red-400' :
                    passwordStrength.score === 2 ? 'text-orange-400' :
                    passwordStrength.score === 3 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {passwordStrength.label}
                    {passwordStrength.score < 3 && ' — use 8+ characters, uppercase, numbers'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password — only on signup */}
            {isSignup && (
              <div>
                <label className="block text-sm text-casanova-muted mb-1.5">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-xl bg-casanova-bg border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 transition-all ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-green-500/50 focus:ring-green-500/20'
                        : 'border-red-500/50 focus:ring-red-500/20'
                      : 'border-casanova-border focus:ring-casanova-accent/30 focus:border-casanova-accent/50'
                  }`}
                  placeholder="••••••••"
                />
                {confirmPassword.length > 0 && (
                  <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            )}

            {/* CAPTCHA — only on signup */}
            {isSignup && (
              <div>
                <label className="block text-sm text-casanova-muted mb-1.5">
                  Quick verification — what is {captchaA} + {captchaB}?
                </label>
                <input
                  type="number"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-casanova-bg border border-casanova-border text-casanova-text placeholder:text-casanova-muted/50 focus:outline-none focus:ring-2 focus:ring-casanova-accent/30 focus:border-casanova-accent/50 transition-all"
                  placeholder="Your answer"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (isSignup && (!passwordsMatch || passwordStrength.score < 3 || confirmPassword.length === 0))}
              className="w-full py-3 bg-casanova-accent text-white font-semibold rounded-xl hover:bg-casanova-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Loading...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-casanova-muted mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignup(!isSignup); resetForm(); }}
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
