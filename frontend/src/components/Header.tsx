import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../lib/types';
import { NAV } from '../lib/nav';
import { FacebookIcon, InstagramIcon, PawIcon } from './Icons';

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on a tap/click outside of it, or on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (navRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

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
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav ref={navRef} id="main-nav" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Fő navigáció">
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
