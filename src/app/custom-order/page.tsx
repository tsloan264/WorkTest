'use client';

import { useState } from 'react';

export default function CustomOrderPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', request: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.request.trim()) {
      setError('Please fill in your name, email, and what you have in mind.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_type: 'custom',
          subject: 'Custom Order Request',
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          custom_request: form.request,
          pickup_notes: form.notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Made Just for You</p>
        <h1 className="mt-1 font-display text-4xl">Custom Order Request</h1>
        <p className="mx-auto mt-3 text-ink-muted">
          Have something specific in mind — a custom bouquet, pressed flower artwork, or gift bag? Tell us about it
          and we&rsquo;ll follow up to make it happen.
        </p>
      </div>

      {submitted ? (
        <div className="mt-10 rounded-2xl border border-sage-light bg-white p-8 text-center">
          <p className="text-4xl">✿</p>
          <h2 className="mt-2 font-display text-2xl">Request Sent!</h2>
          <p className="mt-2 text-ink-muted">
            Thanks for reaching out — we&rsquo;ll get back to you soon to talk details.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 rounded-2xl border border-cream-dark bg-white p-6">
          <Field label="Your Name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Email Address">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </Field>
          <Field label="What do you have in mind?">
            <textarea
              required
              rows={5}
              placeholder="Describe the item, colors, size, occasion, timeline — anything that helps!"
              value={form.request}
              onChange={(e) => setForm({ ...form, request: e.target.value })}
              className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Anything else? (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm"
            />
          </Field>
          {error && <p className="text-sm text-rose">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send Custom Request ✿'}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
      {label}
      {children}
    </label>
  );
}
