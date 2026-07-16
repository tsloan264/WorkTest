import Link from 'next/link';
import Image from 'next/image';
import { getGalleryPhotos, getProducts, getSiteSettings } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0;

export default async function HomePage() {
  const [settings, photos, products] = await Promise.all([
    getSiteSettings(),
    getGalleryPhotos(),
    getProducts(),
  ]);
  const isOpen = settings.stand_status === 'open';
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const previewPhotos = photos.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-14 text-center sm:pt-20">
        <p aria-hidden className="text-2xl text-blush">
          ❀ ✿ ❀
        </p>
        <h1 className="mt-4 font-display text-4xl italic leading-tight sm:text-6xl">
          {settings.business_name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Handcrafted with love · Grown with care · Self-serve, {settings.hours_text.toLowerCase()}
        </p>

        <div
          className={`mx-auto mt-8 flex max-w-sm flex-col items-center gap-1 rounded-3xl border px-8 py-6 shadow-sm ${
            isOpen
              ? 'border-[var(--open-fg)]/20 bg-[var(--open-bg)]'
              : 'border-[var(--closed-fg)]/20 bg-[var(--closed-bg)]'
          }`}
        >
          <span className="text-3xl" aria-hidden>
            {isOpen ? '✿' : '✕'}
          </span>
          <p className={`text-lg font-semibold ${isOpen ? 'text-[var(--open-fg)]' : 'text-[var(--closed-fg)]'}`}>
            {isOpen ? "We're Open!" : "We're Closed"}
          </p>
          <p className="text-sm text-ink-muted">{settings.hours_today}</p>
          <p className="mt-1 text-sm italic text-ink-muted">{settings.visitor_note}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-sage-dark"
          >
            Browse the Shop
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-sage px-6 py-3 text-sm font-semibold text-sage-dark transition hover:bg-sage-light/40"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-5 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-center">
          <div className="order-2 sm:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Our Story</p>
            <h2 className="mt-1 font-display text-3xl">About the Stand</h2>
            <p className="mt-4 font-medium text-ink">{settings.about_lead}</p>
            <p className="mt-3 text-ink-muted">{settings.about_body_1}</p>
            <p className="mt-3 text-ink-muted">{settings.about_body_2}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoChip icon="📍" label="Find Us" value={settings.address} sub={settings.address_note} />
              <InfoChip icon="🕐" label="Hours" value={settings.hours_text} />
              <InfoChip icon="💵" label="Payment" value={settings.payment_note} />
              <InfoChip icon="🌿" label="Style" value="Self-serve, honor system" />
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-sage px-5 py-2.5 text-sm font-semibold text-sage-dark hover:bg-sage-light/40"
            >
              Get Directions ↗
            </a>
          </div>
          <div className="order-1 sm:order-2">
            {previewPhotos[0] ? (
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-md">
                <Image
                  src={previewPhotos[0].url}
                  alt={previewPhotos[0].caption || settings.business_name}
                  width={640}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-cream-dark bg-cream-mid text-center text-ink-muted">
                <span className="text-4xl">✿</span>
                <p>Photo coming soon</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {photos.length > 0 && (
        <section className="bg-cream-mid px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">A Peek Inside</p>
                <h2 className="mt-1 font-display text-3xl">Gallery</h2>
              </div>
              <Link href="/gallery" className="text-sm font-semibold text-sage-dark hover:underline">
                See all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previewPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Farm stand photo'}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover transition hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-sage-dark">Handmade &amp; Homegrown</p>
              <h2 className="mt-1 font-display text-3xl">Popular Right Now</h2>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/shop"
                className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-sage-dark"
              >
                See the Full Shop
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function InfoChip({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm shadow-sm">
      <span aria-hidden>{icon}</span>
      <div>
        <p className="font-semibold text-ink">{label}</p>
        <p className="text-ink-muted">{value}</p>
        {sub && <p className="text-xs text-ink-muted">{sub}</p>}
      </div>
    </div>
  );
}
