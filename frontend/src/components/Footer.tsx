import { Link } from 'react-router-dom';
import type { SiteSettings } from '../lib/types';
import { FacebookIcon, InstagramIcon } from './Icons';

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">BellaWell</p>
          <p className="footer-sub">Kutya-fizioterápia · Győr</p>
        </div>

        <nav className="footer-links" aria-label="Jogi információk">
          <Link to="/impresszum">Impresszum</Link>
          <Link to="/adatvedelem">Adatvédelmi tájékoztató</Link>
        </nav>

        <div className="socials">
          <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} BellaWell Kutya-fizioterápia · bellawellfizio.hu</p>
    </footer>
  );
}
