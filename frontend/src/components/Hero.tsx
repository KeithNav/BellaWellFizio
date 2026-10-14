import { Link } from 'react-router-dom';
import { telHref } from '../lib/content';
import type { SiteSettings, StrapiImage } from '../lib/types';
import { imageSrcSet, mediaUrl } from '../lib/api';
import { HeartIcon, MotionIcon, PawIcon, RehabIcon, HandsIcon } from './Icons';

const PILLARS = [
  { icon: RehabIcon, label: 'Rehabilitáció' },
  { icon: MotionIcon, label: 'Mozgásterápia' },
  { icon: HandsIcon, label: 'Egyéni kezelések' },
  { icon: HeartIcon, label: 'Szeretettel és szakértelemmel' },
];

function HeroImage({ image }: { image?: StrapiImage | null }) {
  if (image) {
    return (
      <img
        src={mediaUrl(image.url)}
        srcSet={imageSrcSet(image)}
        sizes="(max-width: 900px) 92vw, 640px"
        alt={image.alternativeText || 'BellaWell Kutya-fizioterápia'}
        width={image.width}
        height={image.height}
        fetchPriority="high"
      />
    );
  }
  return (
    <div className="hero-placeholder" aria-hidden="true">
      <PawIcon />
    </div>
  );
}

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <PawIcon className="hero-paw hero-paw-1" />
      <PawIcon className="hero-paw hero-paw-2" />
      <PawIcon className="hero-paw hero-paw-3" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <span className="eyebrow">Kutya-fizioterápia · Győr</span>
            BellaWell
          </h1>
          <p className="script hero-tagline">Mozgás. Egyensúly. Életminőség.</p>
          <p className="hero-lead">
            Kutya fizioterápia az otthonod kényelmében Győrben és környékén – egyéni kezelési tervvel, türelemmel, szeretettel és
            szakértelemmel, hogy kedvenced újra felszabadultan mozoghasson.
          </p>
          <div className="hero-actions">
            <Link to="/#kapcsolat" className="btn btn-primary">
              Időpontfoglalás
            </Link>
            <Link to="/#szolgaltatasok" className="btn btn-ghost">
              Szolgáltatások és árak
            </Link>
          </div>
          <a className="hero-phone" href={telHref(settings.phone)}>
            {settings.phone}
          </a>
        </div>

        <div className="hero-visual">
          <div className="hero-arch">
            <HeroImage image={settings.heroImage} />
          </div>
        </div>
      </div>

      <ul className="container pillars">
        {PILLARS.map(({ icon: Icon, label }) => (
          <li key={label}>
            <span className="pillar-icon">
              <Icon />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70c240 60 480 60 720 20s480-60 720-10v60H0Z" fill="#ffffff" />
      </svg>
    </section>
  );
}
