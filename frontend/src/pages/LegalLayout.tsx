import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PrintIcon } from '../components/Icons';

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  useEffect(() => {
    const previous = document.title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.href;
    document.title = `${title} | BellaWell Kutya-fizioterápia`;
    if (canonical) canonical.href = `https://bellawellfizio.hu${window.location.pathname}`;
    return () => {
      document.title = previous;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, [title]);

  return (
    <main id="main" className="legal">
      <div className="container legal-inner">
        <div className="legal-toolbar no-print">
          <Link to="/" className="back-link">
            ← Vissza a főoldalra
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            <PrintIcon /> Nyomtatás
          </button>
        </div>

        <article className="legal-doc">
          <p className="print-brand">BellaWell Kutya-fizioterápia · bellawellfizio.hu</p>
          <h1>{title}</h1>
          <p className="legal-updated">Hatályos: {updated}</p>
          {children}
        </article>
      </div>
    </main>
  );
}
