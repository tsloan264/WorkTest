import { getSiteSettings } from '@/lib/data';
import ContactForm from './ContactForm';

export const revalidate = 0;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const socials = [
    { url: settings.instagram_url, label: 'Instagram', icon: '📷' },
    { url: settings.facebook_url, label: 'Facebook', icon: '👍' },
    { url: settings.nextdoor_url, label: 'Nextdoor', icon: '🏘️' },
    { url: settings.other_social_url, label: 'More', icon: '🔗' },
  ].filter((s) => s.url);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Say Hello</p>
        <h1 className="mt-1 font-display text-4xl">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          A question, custom request, or just a friendly hello? We&rsquo;d love to hear from you.
        </p>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-cream-dark bg-white p-6">
            <h2 className="font-display text-xl">Visit the Stand</h2>
            <p className="mt-2 text-sm text-ink-muted">📍 {settings.address}</p>
            {settings.address_note && <p className="text-sm text-ink-muted">{settings.address_note}</p>}
            <p className="mt-2 text-sm text-ink-muted">🕐 {settings.hours_text}</p>
            <p className="text-sm text-ink-muted">💵 {settings.payment_note}</p>
            {settings.phone && <p className="mt-2 text-sm text-ink-muted">📞 {settings.phone}</p>}
            {settings.email && <p className="text-sm text-ink-muted">✉️ {settings.email}</p>}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full border border-sage px-5 py-2 text-sm font-semibold text-sage-dark hover:bg-sage-light/40"
            >
              Get Directions ↗
            </a>
          </div>

          <div className="rounded-2xl border border-cream-dark bg-white p-6">
            <h2 className="font-display text-xl">Follow Along</h2>
            {socials.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">Social links coming soon.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-ink hover:text-sage-dark"
                    >
                      <span aria-hidden>{s.icon}</span> {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
