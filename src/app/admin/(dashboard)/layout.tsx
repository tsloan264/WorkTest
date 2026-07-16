import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';

const NAV = [
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Catalog' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/settings', label: 'Site Settings' },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-dark pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Admin</p>
          <h1 className="font-display text-2xl">Dashboard</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-cream-dark px-4 py-1.5 text-sm font-semibold text-ink-muted transition hover:border-sage hover:text-sage-dark"
            >
              {item.label}
            </Link>
          ))}
          <SignOutButton />
        </nav>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
