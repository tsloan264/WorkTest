'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { GalleryPhoto } from '@/lib/types';

export default function GalleryClient({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleUpload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `gallery/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: false });
      if (error) {
        alert('Upload failed: ' + error.message);
        continue;
      }
      const { data } = supabase.storage.from('photos').getPublicUrl(path);
      const { data: row, error: insertError } = await supabase
        .from('gallery_photos')
        .insert({ url: data.publicUrl, caption: '', sort_order: photos.length })
        .select()
        .single();
      if (!insertError && row) setPhotos((prev) => [...prev, row as GalleryPhoto]);
    }
    setUploading(false);
  }

  async function updateCaption(id: string, caption: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
    await supabase.from('gallery_photos').update({ caption }).eq('id', id);
  }

  async function deletePhoto(id: string) {
    if (!confirm('Delete this photo?')) return;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    await supabase.from('gallery_photos').delete().eq('id', id);
  }

  return (
    <div>
      <div className="rounded-2xl border-2 border-dashed border-cream-dark bg-white p-6 text-center">
        <p className="font-semibold">Upload photos</p>
        <p className="mt-1 text-sm text-ink-muted">Photos of the stand, products, and what you make.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="mx-auto mt-3 text-sm"
        />
        {uploading && <p className="mt-2 text-xs text-ink-muted">Uploading…</p>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-2xl border border-cream-dark bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <input
                value={photo.caption}
                placeholder="Caption (optional)"
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                className="w-full rounded-lg border border-cream-dark px-2 py-1 text-sm"
              />
              <button onClick={() => deletePhoto(photo.id)} className="mt-2 text-xs font-semibold text-rose underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
