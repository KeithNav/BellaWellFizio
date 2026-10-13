import type { GalleryItem, Service, SiteSettings, StrapiImage } from './types';

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

export const mediaUrl = (url: string) => (/^https?:\/\//.test(url) ? url : `${API_URL}${url}`);

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API hiba: ${res.status}`);
  return ((await res.json()) as { data: T }).data;
}

export const fetchServices = () => getJson<Service[]>('/api/services?sort=order:asc&pagination[pageSize]=100');

export const fetchGallery = () =>
  getJson<GalleryItem[]>('/api/gallery-items?populate=image&sort=order:asc&pagination[pageSize]=100');

export const fetchSettings = () => getJson<SiteSettings>('/api/site-setting?populate=heroImage');

export function imageSrcSet(image: StrapiImage): string {
  const sizes = Object.values(image.formats ?? {}).map((f) => ({ url: f.url, width: f.width }));
  if (image.width) sizes.push({ url: image.url, width: image.width });
  return sizes
    .sort((a, b) => a.width - b.width)
    .map((s) => `${mediaUrl(s.url)} ${s.width}w`)
    .join(', ');
}

export function lightboxImage(image: StrapiImage) {
  const formats = image.formats ?? {};
  const best = formats.xlarge ?? formats.large ?? formats.medium ?? {
    url: image.url,
    width: image.width ?? 1600,
    height: image.height ?? 1200,
  };
  return { url: mediaUrl(best.url), width: best.width, height: best.height };
}