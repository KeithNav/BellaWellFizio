export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiImageFormat> | null;
}

export interface Service {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  priceSuffix?: string | null;
  isAddon: boolean;
  order: number;
}

export interface GalleryItem {
  id: number;
  title?: string | null;
  image: StrapiImage | null;
  order: number;
}

export interface SiteSettings {
  servicesNote: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  heroImage?: StrapiImage | null;
}
