import { About } from '../components/About';
import { Area } from '../components/Area';
import { Faq } from '../components/Faq';
import { Contact } from '../components/Contact';
import { Gallery } from '../components/Gallery';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { fetchGallery, fetchServices } from '../lib/api';
import { DEFAULT_SERVICES, useApi } from '../lib/content';
import type { GalleryItem, SiteSettings } from '../lib/types';

const NO_GALLERY: GalleryItem[] = [];

export default function Home({ settings }: { settings: SiteSettings }) {
  const services = useApi(fetchServices, DEFAULT_SERVICES, 'services');
  const gallery = useApi(fetchGallery, NO_GALLERY, 'gallery');

  return (
    <main id="main">
      <Hero settings={settings} />
      <About />
      <Services services={services.data.length ? services.data : DEFAULT_SERVICES} settings={settings} />
      <Gallery items={gallery.data} loading={gallery.loading} />
      <Area />
      <Faq />
      <Contact settings={settings} />
    </main>
  );
}
