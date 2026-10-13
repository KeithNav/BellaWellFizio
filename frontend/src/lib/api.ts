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

export async function sendContact(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
  captchaToken: string;
  website: string;
}) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = 'Az üzenet küldése nem sikerült. Kérjük, próbálja újra, vagy hívjon telefonon.';
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
}

export function imageSrcSet(image: StrapiImage) {
  const sizes = Object.values(image.formats ?? {});
  if (image.width) sizes.push({ url: image.url, width: image.width, height: image.height ?? 0 });
  return sizes
    .sort((a, b) => a.width - b.width)
    .map((f) => `${mediaUrl(f.url)} ${f.width}w`)
    .join(', ');
}
