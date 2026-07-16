'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

type Draft = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_DRAFT: Draft = {
  name: '',
  category: '',
  price_label: '',
  description: '',
  image_url: null,
  emoji: '🌿',
  available: true,
  featured: false,
  badge: '',
  sort_order: 0,
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  function startNew() {
    setDraft({ ...EMPTY_DRAFT, sort_order: products.length + 1 });
    setEditingId('new');
  }

  function startEdit(product: Product) {
    const { id, created_at, updated_at, ...rest } = product;
    void id;
    void created_at;
    void updated_at;
    setDraft(rest);
    setEditingId(product.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: false });
    setUploading(false);
    if (error) {
      alert('Image upload failed: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    setDraft((d) => ({ ...d, image_url: data.publicUrl }));
  }

  async function saveDraft() {
    if (!draft.name.trim() || !draft.category.trim()) {
      alert('Name and category are required.');
      return;
    }
    setSaving(true);
    if (editingId === 'new') {
      const { data, error } = await supabase.from('products').insert(draft).select().single();
      if (!error && data) setProducts((prev) => [...prev, data as Product]);
    } else if (editingId) {
      const { data, error } = await supabase.from('products').update(draft).eq('id', editingId).select().single();
      if (!error && data) setProducts((prev) => prev.map((p) => (p.id === editingId ? (data as Product) : p)));
    }
    setSaving(false);
    cancelEdit();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  }

  async function toggleAvailable(product: Product) {
    const available = !product.available;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, available } : p)));
    await supabase.from('products').update({ available }).eq('id', product.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{products.length} item{products.length === 1 ? '' : 's'} in the catalog</p>
        <button
          onClick={startNew}
          className="rounded-full bg-sage px-4 py-1.5 text-sm font-semibold text-white hover:bg-sage-dark"
        >
          + Add Item
        </button>
      </div>

      {editingId && (
        <div className="mt-4 rounded-2xl border border-sage bg-white p-5">
          <h3 className="font-display text-lg">{editingId === 'new' ? 'New Item' : 'Edit Item'}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <LabeledInput label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <LabeledInput label="Category" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} />
            <LabeledInput label="Price label" value={draft.price_label} onChange={(v) => setDraft({ ...draft, price_label: v })} placeholder="$12 or $4 each" />
            <LabeledInput label="Badge (optional)" value={draft.badge} onChange={(v) => setDraft({ ...draft, badge: v })} placeholder="Bestseller, New, Seasonal…" />
            <LabeledInput label="Emoji (used if no photo)" value={draft.emoji} onChange={(v) => setDraft({ ...draft, emoji: v })} />
            <LabeledInput label="Sort order" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })} />
          </div>
          <label className="mt-3 flex flex-col gap-1 text-sm font-semibold text-ink">
            Description
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-normal"
            />
          </label>

          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
          </div>

          <div className="mt-3">
            <label className="text-sm font-semibold text-ink">Photo</label>
            <div className="mt-1 flex items-center gap-3">
              {draft.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="text-sm"
              />
              {uploading && <span className="text-xs text-ink-muted">Uploading…</span>}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="rounded-full bg-sage px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancelEdit} className="rounded-full border border-cream-dark px-5 py-2 text-sm font-semibold text-ink-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {products.map((product) => (
          <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-dark bg-white p-4">
            <div className="flex items-center gap-3">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <span className="text-2xl">{product.emoji}</span>
              )}
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs text-ink-muted">
                  {product.category} · {product.price_label} {product.badge && `· ${product.badge}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAvailable(product)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.available ? 'bg-sage-light text-sage-dark' : 'bg-cream-dark text-ink-muted'
                }`}
              >
                {product.available ? 'Available' : 'Sold Out'}
              </button>
              <button onClick={() => startEdit(product)} className="text-xs font-semibold text-sage-dark underline">
                Edit
              </button>
              <button onClick={() => deleteProduct(product.id)} className="text-xs font-semibold text-rose underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-ink">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-normal"
      />
    </label>
  );
}
