import { useCallback, useEffect, useRef, useState } from 'react';
import { imageSrcSet, mediaUrl } from '../lib/api';
import type { GalleryItem } from '../lib/types';
import { PawIcon } from './Icons';
import { Reveal } from './Reveal';

function Lightbox({ items, index, onClose, onMove }: { items: GalleryItem[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];
  const image = item.image!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onMove]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Képnézegető" onClick={onClose}>
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Bezárás">
        ×
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="lb-btn lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            aria-label="Előző kép"
          >
            ‹
          </button>
          <button
            type="button"
            className="lb-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            aria-label="Következő kép"
          >
            ›
          </button>
        </>
      )}
      <figure onClick={(e) => e.stopPropagation()}>
        <img
          src={mediaUrl(image.formats?.large?.url ?? image.url)}
          alt={image.alternativeText || item.title || 'BellaWell galéria'}
        />
        {item.title && <figcaption>{item.title}</figcaption>}
      </figure>
    </div>
  );
}

export function Gallery({ items, loading }: { items: GalleryItem[]; loading: boolean }) {
  const photos = items.filter((i) => i.image);
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (d: number) => setActive((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  return (
    <section id="galeria" className="section" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Galéria</p>
          <h2 id="gallery-title" className="section-title">
            Pillanatok a kezelésekről
          </h2>
        </Reveal>

        {photos.length === 0 ? (
          <p className="gallery-empty">
            <PawIcon />
            {loading ? 'Képek betöltése…' : 'Hamarosan új képekkel jelentkezünk.'}
          </p>
        ) : (
          <ul className="gallery-grid">
            {photos.map((item, i) => (
              <li key={item.id}>
                <button type="button" onClick={() => setActive(i)} aria-label={`Kép megnyitása: ${item.title || i + 1}`}>
                  <img
                    src={mediaUrl(item.image!.formats?.medium?.url ?? item.image!.url)}
                    srcSet={imageSrcSet(item.image!)}
                    sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 300px"
                    alt={item.image!.alternativeText || item.title || 'BellaWell galéria'}
                    loading="lazy"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {active !== null && photos[active] && <Lightbox items={photos} index={active} onClose={close} onMove={move} />}
    </section>
  );
}
