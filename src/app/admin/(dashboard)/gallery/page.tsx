import { createClient } from '@/lib/supabase/server';
import type { GalleryPhoto } from '@/lib/types';
import GalleryClient from './GalleryClient';

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: photos } = await supabase.from('gallery_photos').select('*').order('sort_order', { ascending: true });

  return <GalleryClient initialPhotos={(photos as GalleryPhoto[]) ?? []} />;
}
