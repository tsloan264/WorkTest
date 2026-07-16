'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-14">
      <div className="text-center">
        <span className="text-3xl">✿</span>
        <h1 className="mt-2 font-display text-3xl">Admin Login</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage orders, catalog, and site info.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 rounded-2xl border border-cream-dark bg-white p-6">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-rose">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
