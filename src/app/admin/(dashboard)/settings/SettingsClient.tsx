'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/lib/types';

export default function SettingsClient({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  function field<K extends keyof SiteSettings>(key: K) {
    return {
      value: settings[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setSettings((s) => ({ ...s, [key]: e.target.value })),
    };
  }

  async function save() {
    setSaving(true);
    const { id, updated_at, ...rest } = settings;
    void id;
    void updated_at;
    const { error } = await supabase.from('site_settings').update(rest).eq('id', true);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Could not save: ' + error.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-cream-dark bg-white p-5">
        <h2 className="font-display text-lg">Stand Status</h2>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setSettings((s) => ({ ...s, stand_status: 'open' }))}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              settings.stand_status === 'open' ? 'bg-sage text-white' : 'border border-cream-dark text-ink-muted'
            }`}
          >
            ✓ Open
          </button>
          <button
            onClick={() => setSettings((s) => ({ ...s, stand_status: 'closed' }))}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              settings.stand_status === 'closed' ? 'bg-rose text-white' : 'border border-cream-dark text-ink-muted'
            }`}
          >
            ✕ Closed
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Today's hours / status line" {...field('hours_today')} />
          <Field label="Visitor note" {...field('visitor_note')} />
        </div>
      </section>

      <section className="rounded-2xl border border-cream-dark bg-white p-5">
        <h2 className="font-display text-lg">Stand Info</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Business name" {...field('business_name')} />
          <Field label="Address" {...field('address')} />
          <Field label="Address note (e.g. nearby landmark)" {...field('address_note')} />
          <Field label="Hours text" {...field('hours_text')} />
          <Field label="Payment note" {...field('payment_note')} />
          <Field label="Phone (optional)" {...field('phone')} />
          <Field label="Public contact email (optional)" {...field('email')} />
        </div>
      </section>

      <section className="rounded-2xl border border-cream-dark bg-white p-5">
        <h2 className="font-display text-lg">Social Links</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Instagram URL" {...field('instagram_url')} placeholder="https://instagram.com/..." />
          <Field label="Facebook URL" {...field('facebook_url')} placeholder="https://facebook.com/..." />
          <Field label="Nextdoor URL" {...field('nextdoor_url')} />
          <Field label="Other link" {...field('other_social_url')} />
        </div>
      </section>

      <section className="rounded-2xl border border-cream-dark bg-white p-5">
        <h2 className="font-display text-lg">About Section</h2>
        <div className="mt-3 flex flex-col gap-3">
          <TextAreaField label="Lead sentence" {...field('about_lead')} />
          <TextAreaField label="Paragraph 1" {...field('about_body_1')} />
          <TextAreaField label="Paragraph 2" {...field('about_body_2')} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span className="text-sm font-semibold text-sage-dark">✓ Saved!</span>}
      </div>

      <PasswordSection />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-normal"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
      {label}
      <textarea
        rows={2}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-normal"
      />
    </label>
  );
}

function PasswordSection() {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    setMessage(error ? error.message : 'Password updated ✓');
    if (!error) setPassword('');
  }

  return (
    <section className="rounded-2xl border border-cream-dark bg-white p-5">
      <h2 className="font-display text-lg">Change Admin Password</h2>
      <form onSubmit={changePassword} className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-ink-muted">{message}</p>}
    </section>
  );
}
