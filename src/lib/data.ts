import { createClient } from '@/lib/supabase/server';
import type { GalleryPhoto, Product, SiteSettings } from '@/lib/types';

const FALLBACK_SETTINGS: SiteSettings = {
  id: true,
  stand_status: 'open',
  hours_today: 'Open 24/6 · Self-serve',
  visitor_note: "Come on by — we'd love to see you!",
  business_name: "Dean's Petals & Produce",
  address: '1934 Burlington Road, Akron, OH 44313',
  address_note: "Near Fairlawn / Ken Stewart's area",
  hours_text: 'Open 24/6 · Self-serve',
  payment_note: 'Venmo or cash',
  phone: '',
  email: '',
  instagram_url: '',
  facebook_url: '',
  nextdoor_url: 'https://nextdoor.com/page/deans-bean-stand-akron-oh',
  other_social_url: '',
  about_lead:
    "Welcome to Dean's Petals & Produce — a self-serve farm stand where every handmade piece carries a little piece of the garden.",
  about_body_1:
    'Bouquets, pressed flower artwork, plants, honey, hand-decorated crafts, and seasonal produce — all left out for you to browse any time, day or night.',
  about_body_2:
    'Take what you love, leave payment in the box (Venmo or cash), and enjoy a little piece of the garden. Custom orders and reservations welcome!',
  updated_at: '',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
  return (data as SiteSettings) ?? FALLBACK_SETTINGS;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as Product[]) ?? [];
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as GalleryPhoto[]) ?? [];
}
