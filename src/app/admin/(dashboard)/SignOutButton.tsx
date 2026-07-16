'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-warm-brown"
    >
      Sign Out
    </button>
  );
}
