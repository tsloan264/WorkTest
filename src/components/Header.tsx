'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { SiteSettings } from '@/lib/types';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const isOpen = settings.stand_status === 'open';

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl text-sage" aria-hidden>
            ✿
          </span>
          <span className="font-display text-lg leading-tight">
            {settings.business_name.split('&')[0].trim()}
            <span className="block text-xs font-body font-normal tracking-wide text-ink-muted">
              &amp; {settings.business_name.split('&')[1]?.trim() ?? 'Produce'}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition hover:text-sage-dark"
            >
              {link.label}
            </Link>
          ))}
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isOpen ? 'bg-[var(--open-bg)] text-[var(--open-fg)]' : 'bg-[var(--closed-bg)] text-[var(--closed-fg)]'
            }`}
          >
            {isOpen ? 'Open now' : 'Closed'}
          </span>
        </nav>

        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-cream-dark bg-cream px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-cream-mid hover:text-sage-dark"
              >
                {link.label}
              </Link>
            ))}
            <span
              className={`mt-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                isOpen ? 'bg-[var(--open-bg)] text-[var(--open-fg)]' : 'bg-[var(--closed-bg)] text-[var(--closed-fg)]'
              }`}
            >
              {isOpen ? 'Open now' : 'Closed'}
            </span>
          </nav>
        </div>
      )}
    </header>
  );
}
