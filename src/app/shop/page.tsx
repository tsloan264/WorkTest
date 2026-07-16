import { getProducts } from '@/lib/data';
import ShopClient from './ShopClient';

export const revalidate = 0;

export default async function ShopPage() {
  const products = await getProducts();
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Handmade &amp; Homegrown</p>
        <h1 className="mt-1 font-display text-4xl">Shop the Stand</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Browse everything currently at the stand and prices. Select what you&rsquo;d like to reserve, submit
          your info, and come pick it up — pay with Venmo or cash when you arrive.
        </p>
      </div>

      <ShopClient products={products} categories={categories} />
    </div>
  );
}
