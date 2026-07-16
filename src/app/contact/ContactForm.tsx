'use client';

import { useState } from 'react';

const TOPICS = [
  'General Hello',
  'Item Availability',
  'Custom Order Request',
  'Wholesale Inquiry',
  'Something Else',
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_type: 'message',
          subject: form.topic,
          customer_name: form.name,
          customer_email: form.email,
          custom_request: form.message,
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

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sage-light bg-white p-8 text-center">
        <p className="text-4xl">✿</p>
        <h2 className="mt-2 font-display text-2xl">Message Sent!</h2>
        <p className="mt-2 text-ink-muted">Thank you for reaching out. We&rsquo;ll get back to you soon.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: '', email: '', topic: TOPICS[0], message: '' });
          }}
          className="mt-4 rounded-full border border-sage px-5 py-2 text-sm font-semibold text-sage-dark"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-cream-dark bg-white p-6">
      <h2 className="font-display text-xl">Send a Message</h2>
      <input
        required
        placeholder="Your Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
      />
      <input
        required
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
      />
      <select
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
      >
        {TOPICS.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <textarea
        required
        rows={5}
        placeholder="Tell us what you're looking for…"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-rose">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Message ✿'}
      </button>
      <p className="text-center text-xs text-ink-muted">We typically reply within 1–2 business days.</p>
    </form>
  );
}
