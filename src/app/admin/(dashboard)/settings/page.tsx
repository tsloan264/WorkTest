import { createClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();

  return <SettingsClient initialSettings={data as SiteSettings} />;
}
