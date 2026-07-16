import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('*').order('sort_order', { ascending: true });

  return <ProductsClient initialProducts={(products as Product[]) ?? []} />;
}
