'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

type CartLine = { product: Product; quantity: number };

export default function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const filtered = useMemo(
    () => (filter === 'All' ? products : products.filter((p) => p.category === filter)),
    [products, filter]
  );

  const cartLines = Object.values(cart);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  function toggleProduct(product: Product) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = { product, quantity: 1 };
      }
      return next;
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) => {
      const line = prev[id];
      if (!line) return prev;
      const quantity = Math.max(1, line.quantity + delta);
      return { ...prev, [id]: { ...line, quantity } };
    });
  }

  function removeLine(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function submitReservation(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_type: 'reserve',
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          pickup_notes: form.notes,
          items: cartLines.map((line) => ({
            product_id: line.product.id,
            product_name: line.product.name,
            price_label: line.product.price_label,
            quantity: line.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
      setCart({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              filter === cat
                ? 'border-sage bg-sage text-white'
                : 'border-cream-dark text-ink-muted hover:border-sage hover:text-sage-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-ink-muted">✿ Nothing in this category right now — check back soon!</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={!!cart[product.id]}
              onToggle={() => toggleProduct(product)}
            />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-cream-dark bg-white p-6 text-center">
        <p className="font-semibold">Looking for something custom?</p>
        <p className="mt-1 text-sm text-ink-muted">
          Request a custom bouquet, artwork piece, or gift bag made just for you.
        </p>
        <a
          href="/custom-order"
          className="mt-3 inline-block rounded-full border border-sage px-5 py-2 text-sm font-semibold text-sage-dark hover:bg-sage-light/40"
        >
          Send a Custom Request
        </a>
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-sage-dark px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          🧺 Reserve {cartCount} item{cartCount > 1 ? 's' : ''}
        </button>
      )}

      {/* Cart / checkout drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
            {submitted ? (
              <div className="py-6 text-center">
                <p className="text-4xl">✿</p>
                <h3 className="mt-2 font-display text-2xl">Reservation Sent!</h3>
                <p className="mt-2 text-ink-muted">
                  We&rsquo;ve got your items set aside. Come by during open hours to pick up and pay.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCartOpen(false);
                  }}
                  className="mt-5 rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">Your Reservation</h3>
                  <button onClick={() => setCartOpen(false)} aria-label="Close" className="text-2xl leading-none">
                    &times;
                  </button>
                </div>

                {cartLines.length === 0 ? (
                  <p className="mt-6 text-ink-muted">No items selected yet.</p>
                ) : (
                  <ul className="mt-4 flex flex-col gap-3">
                    {cartLines.map((line) => (
                      <li key={line.product.id} className="flex items-center justify-between gap-3 border-b border-cream-dark pb-3">
                        <div>
                          <p className="font-semibold">{line.product.name}</p>
                          <p className="text-sm text-ink-muted">{line.product.price_label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.id, -1)}
                            className="h-7 w-7 rounded-full border border-cream-dark text-sm"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.product.id, 1)}
                            className="h-7 w-7 rounded-full border border-cream-dark text-sm"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLine(line.product.id)}
                            className="ml-1 text-xs text-rose underline"
                          >
                            remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {cartLines.length > 0 && (
                  <form onSubmit={submitReservation} className="mt-5 flex flex-col gap-3">
                    <input
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
                    />
                    <textarea
                      placeholder="Pickup notes (optional) — e.g. what time you'll swing by"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                      className="rounded-lg border border-cream-dark px-3 py-2 text-sm"
                    />
                    {error && <p className="text-sm text-rose">{error}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-1 rounded-full bg-sage px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {submitting ? 'Sending…' : 'Request Reservation'}
                    </button>
                    <p className="text-center text-xs text-ink-muted">
                      Reserved items are set aside for pickup — pay with Venmo or cash when you arrive.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
