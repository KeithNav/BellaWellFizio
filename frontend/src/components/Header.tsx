import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../lib/types';
import { FacebookIcon, InstagramIcon, PawIcon } from './Icons';

const NAV = [
  { id: 'rolunk', label: 'Rólunk' },
  { id: 'szolgaltatasok', label: 'Szolgáltatások és árak' },
  { id: 'galeria', label: 'Galéria' },
  { id: 'kapcsolat', label: 'Kapcsolat' },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="BellaWell Kutya-fizioterápia – főoldal">
          <PawIcon className="brand-paw" />
          <span className="brand-name">BellaWell</span>
        </Link>

        <div className="socials header-socials">
          <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav id="main-nav" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Fő navigáció">
          {NAV.map((item) => (
            <Link key={item.id} to={`/#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
