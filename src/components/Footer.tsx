import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { url: settings.instagram_url, label: 'Instagram' },
    { url: settings.facebook_url, label: 'Facebook' },
    { url: settings.nextdoor_url, label: 'Nextdoor' },
    { url: settings.other_social_url, label: 'More' },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-cream-dark bg-cream-mid">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg">{settings.business_name}</p>
            <p className="mt-1 text-sm text-ink-muted">Handmade &amp; homegrown</p>
          </div>
          <div className="text-sm text-ink-muted">
            <p>{settings.address}</p>
            {settings.address_note && <p>{settings.address_note}</p>}
            <p className="mt-2">{settings.hours_text}</p>
            <p>{settings.payment_note}</p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold text-ink">Follow along</p>
            {socials.length === 0 && <p className="text-ink-muted">Links coming soon</p>}
            <ul className="flex flex-col gap-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted underline decoration-sage/50 underline-offset-4 hover:text-sage-dark"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-cream-dark pt-5 text-xs text-ink-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-sage-dark">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
