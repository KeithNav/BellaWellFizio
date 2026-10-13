import { Link } from 'react-router-dom';
import { telHref } from '../lib/content';
import { NAV } from '../lib/nav';
import type { SiteSettings } from '../lib/types';
import { FacebookIcon, InstagramIcon, PawIcon } from './Icons';

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-about">
          <PawIcon className="footer-paw" aria-hidden="true" />
          <div className="footer-about-text">
            <p className="footer-brand">BellaWell</p>
            <p className="footer-sub">Kutya-fizioterápia · Győr</p>
            <p className="footer-contact">
              <a href={telHref(settings.phone)}>{settings.phone}</a>
              <br />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
            <div className="socials">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        <nav className="footer-col" aria-label="Oldal szakaszai">
          <p className="footer-heading">Oldalak</p>
          {NAV.map((item) => (
            <Link key={item.id} to={`/#${item.id}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="Jogi információk">
          <p className="footer-heading">Jogi információk</p>
          <Link to="/impresszum">Impresszum</Link>
          <Link to="/adatvedelem">Adatvédelmi tájékoztató</Link>
        </nav>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} BellaWell Kutya-fizioterápia · bellawellfizio.hu</p>
    </footer>
  );
}
