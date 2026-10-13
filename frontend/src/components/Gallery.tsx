import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { imageSrcSet, lightboxImage, mediaUrl } from '../lib/api';
import type { GalleryItem } from '../lib/types';
import { PawIcon } from './Icons';
import { Reveal } from './Reveal';

const GALLERY_ID = 'bento-gallery';
const DESKTOP_BLOCK = 6;
const MOBILE_BLOCK = 4;

// Tiles repeat in fixed blocks (6 on desktop, 4 on mobile) that tile the grid exactly;
// the last tile of an incomplete block is stretched in CSS so the grid never ends with holes.
function tileClasses(index: number, total: number) {
  const last = index === total - 1 ? ' fill' : '';
  return `d${index % DESKTOP_BLOCK} m${index % MOBILE_BLOCK}${last}`;
}

export function Gallery({ items, loading }: { items: GalleryItem[]; loading: boolean }) {
  const photos = items.filter((i) => i.image);

  useEffect(() => {
    if (photos.length === 0) return;
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${GALLERY_ID}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.92,
      closeTitle: 'Bezárás',
      zoomTitle: 'Nagyítás',
      arrowPrevTitle: 'Előző kép',
      arrowNextTitle: 'Következő kép',
      errorMsg: 'A kép nem tölthető be.',
      indexIndicatorSep: ' / ',
    });

    lightbox.on('uiRegister', () => {
      lightbox.pswp?.ui?.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (el, pswp) => {
          el.className = 'pswp-caption';
          pswp.on('change', () => {
            el.textContent = pswp.currSlide?.data.alt ?? '';
          });
        },
      });
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [photos.length]);

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
          <div id={GALLERY_ID} className="bento">
            {photos.map((item, i) => {
              const image = item.image!;
              const full = lightboxImage(image);
              const alt = image.alternativeText || item.title || 'BellaWell kutya-fizioterápia';
              return (
                <a
                  key={item.id}
                  href={full.url}
                  data-pswp-width={full.width}
                  data-pswp-height={full.height}
                  target="_blank"
                  rel="noreferrer"
                  className={`bento-tile ${tileClasses(i, photos.length)}`}
                  aria-label={`Kép megnyitása: ${alt}`}
                >
                  <img
                    src={mediaUrl(image.formats?.medium?.url ?? image.url)}
                    srcSet={imageSrcSet(image)}
                    sizes="(max-width: 700px) 50vw, (max-width: 1200px) 45vw, 560px"
                    alt={alt}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
