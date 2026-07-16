import Image from 'next/image';
import { getGalleryPhotos } from '@/lib/data';

export const revalidate = 0;

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">A Peek Inside</p>
        <h1 className="mt-1 font-display text-4xl">Gallery</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Photos of the stand, our handmade goods, and what grows here throughout the season.
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-cream-dark bg-cream-mid py-16 text-center text-ink-muted">
          <span className="text-4xl">✿</span>
          <p>Photos coming soon — check back!</p>
        </div>
      ) : (
        <div className="mt-10 columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {photos.map((photo) => (
            <figure key={photo.id} className="break-inside-avoid overflow-hidden rounded-2xl">
              <Image
                src={photo.url}
                alt={photo.caption || 'Farm stand photo'}
                width={480}
                height={480}
                className="w-full object-cover"
              />
              {photo.caption && (
                <figcaption className="bg-white px-3 py-2 text-xs text-ink-muted">{photo.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
