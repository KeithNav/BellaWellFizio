import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/content';
import type { Service, SiteSettings } from '../lib/types';
import { Reveal } from './Reveal';

function Row({ service }: { service: Service }) {
  return (
    <li className="price-row">
      <div className="price-main">
        <span className="price-title">
          {service.isAddon && <span className="plus">+</span>}
          {service.title}
        </span>
        <span className="price-leader" aria-hidden="true" />
        <span className="price-value">
          {formatPrice(service.price)}
          {service.priceSuffix && <small> {service.priceSuffix}</small>}
        </span>
      </div>
      {service.description && <p className="price-desc">{service.description}</p>}
    </li>
  );
}

export function Services({ services, settings }: { services: Service[]; settings: SiteSettings }) {
  const main = services.filter((s) => !s.isAddon);
  const addons = services.filter((s) => s.isAddon);

  return (
    <section id="szolgaltatasok" className="section section-blush" aria-labelledby="services-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Szolgáltatások és árak</p>
          <h2 id="services-title" className="section-title">
            Kutya fizioterápia árak: átlátható árak, személyre szabott kezelés
          </h2>
        </Reveal>

        <Reveal>
          <div className="price-card">
            <ul className="price-list">
              {main.map((s) => (
                <Row key={s.id} service={s} />
              ))}
            </ul>
            {addons.length > 0 && (
              <>
                <h3 className="price-subtitle">Kiegészítő terápiák</h3>
                <ul className="price-list">
                  {addons.map((s) => (
                    <Row key={s.id} service={s} />
                  ))}
                </ul>
              </>
            )}
            {settings.servicesNote && <p className="price-note">{settings.servicesNote}</p>}
            <div className="price-cta">
              <Link to="/#kapcsolat" className="btn btn-primary">
                Időpontot kérek
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
