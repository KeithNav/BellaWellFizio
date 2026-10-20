import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { HERO_IMAGE_SIZES } from './components/Hero';
import { imageSrcSet, mediaUrl } from './lib/api';
import { faqJsonLd } from './lib/faq';
import { setPrefetched, type Prefetched } from './lib/prefetch';

export function render(url: string, data: Prefetched = {}) {
  setPrefetched(data);
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}

// Used by scripts/prerender.mjs to preload the hero image (the LCP element) from the HTML head.
export function heroPreload(data: Prefetched) {
  const image = data.settings?.heroImage;
  if (!image) return null;
  return { href: mediaUrl(image.url), srcset: imageSrcSet(image), sizes: HERO_IMAGE_SIZES };
}

export { faqJsonLd };
