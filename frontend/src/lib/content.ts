import { useEffect, useState } from 'react';
import { getPrefetched, type Prefetched } from './prefetch';
import type { Service, SiteSettings } from './types';

export const DEFAULT_SERVICES: Service[] = [
  { id: -1, title: 'Állapotfelmérés', price: 12000, isAddon: false, order: 1 },
  { id: -2, title: 'Kutya-fitness 45 perc', price: 10000, isAddon: false, order: 2 },
  { id: -3, title: 'Fizioterápia 45 perc', price: 10000, isAddon: false, order: 3 },
  { id: -4, title: 'Lézer terápia', price: 4000, priceSuffix: '/ terület', isAddon: true, order: 4 },
  { id: -5, title: 'Tens terápia', price: 4000, isAddon: true, order: 5 },
  { id: -6, title: 'Masszázs 30 perc', price: 7000, isAddon: false, order: 6 },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  servicesNote:
    'A szolgáltatás házhoz, kiszállással vehető igénybe. Az árak Győrre és 15 km-es körzetére vonatkoznak. Távolabbi kiszállás esetén a díj előzetes egyeztetés alapján kerül meghatározásra.',
  phone: '+36 70 673 7988',
  email: 'ranschburgdora.fizio@gmail.com',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61584674462110',
  instagramUrl: 'https://www.instagram.com/bellawellkutyafizioterapia/',
};

export const formatPrice = (price: number) => `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0Ft`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;

// Loads CMS data; keeps the fallback when the API is unreachable so the page never breaks.
// Build-time data (when present) is the initial value and is refreshed from the API after mount.
export function useApi<T>(load: () => Promise<T>, fallback: T, key?: keyof Prefetched) {
  const [data, setData] = useState<T>(() => ((key ? getPrefetched(key) : undefined) as T | undefined) ?? fallback);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    load()
      .then((result) => active && setData(result))
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, failed };
}
