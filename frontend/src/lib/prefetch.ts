import type { GalleryItem, Service, SiteSettings } from './types';

// CMS data fetched at build time (scripts/prerender.mjs) and embedded in the prerendered HTML, so the first
// paint and crawlers already get the hero image, prices and gallery without waiting for the API.
export interface Prefetched {
  settings?: SiteSettings;
  services?: Service[];
  gallery?: GalleryItem[];
}

let store: Prefetched = {};

export const setPrefetched = (data: Prefetched) => {
  store = data;
};

export const getPrefetched = <K extends keyof Prefetched>(key: K): Prefetched[K] => store[key];
