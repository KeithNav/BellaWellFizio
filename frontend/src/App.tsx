import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MobileCall } from './components/MobileCall';
import { ScrollToTop } from './components/ScrollToTop';
import { fetchSettings } from './lib/api';
import { DEFAULT_SETTINGS, useApi } from './lib/content';
import type { SiteSettings } from './lib/types';
import Adatvedelem from './pages/Adatvedelem';
import Home from './pages/Home';
import Impresszum from './pages/Impresszum';
import NotFound from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick so sections mounted by the route change exist.
      const timer = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { data } = useApi<SiteSettings>(fetchSettings, DEFAULT_SETTINGS, 'settings');
  const settings: SiteSettings = { ...DEFAULT_SETTINGS, ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v !== null && v !== '')) };

  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Ugrás a tartalomra
      </a>
      <Header settings={settings} />
      <Routes>
        <Route path="/" element={<Home settings={settings} />} />
        <Route path="/impresszum" element={<Impresszum />} />
        <Route path="/adatvedelem" element={<Adatvedelem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer settings={settings} />
      <MobileCall phone={settings.phone} />
      <ScrollToTop />
    </>
  );
}
