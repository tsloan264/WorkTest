import Image from 'next/image';
import type { Product } from '@/lib/types';

const BADGE_STYLES: Record<string, string> = {
  Bestseller: 'bg-gold-light text-warm-brown',
  New: 'bg-lavender/30 text-warm-brown',
  Seasonal: 'bg-sage-light text-sage-dark',
  'Coming Soon': 'bg-blush-light text-rose',
};

export default function ProductCard({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected?: boolean;
  onToggle?: () => void;
}) {
  const badgeClass = product.available
    ? BADGE_STYLES[product.badge] ?? 'bg-cream-dark text-ink-muted'
    : 'bg-ink/70 text-white';

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        product.available ? 'border-cream-dark' : 'border-cream-dark opacity-60'
      } ${selected ? 'ring-2 ring-sage' : ''}`}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-cream-mid">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <span className="text-5xl" aria-hidden>
            {product.emoji}
          </span>
        )}
        {(product.badge || !product.available) && (
          <span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
            {product.available ? product.badge : 'Sold Out'}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">{product.category}</p>
        <h3 className="font-display text-lg">{product.name}</h3>
        <p className="flex-1 text-sm text-ink-muted">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-ink">{product.price_label}</span>
          {onToggle ? (
            <button
              type="button"
              disabled={!product.available}
              onClick={onToggle}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                selected ? 'bg-sage-dark text-white' : 'bg-sage text-white hover:bg-sage-dark'
              }`}
            >
              {selected ? 'Added ✓' : 'Reserve'}
            </button>
          ) : (
            <span
              className={`text-xs font-semibold ${product.available ? 'text-sage-dark' : 'text-ink-muted'}`}
            >
              {product.available ? 'Available' : 'Unavailable'}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
