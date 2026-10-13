import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendContact } from '../lib/api';
import { telHref } from '../lib/content';
import type { SiteSettings } from '../lib/types';
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from './Icons';
import { Reveal } from './Reveal';

const SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITEKEY ?? '10000000-ffff-ffff-ffff-000000000001';

type Status = { type: 'idle' } | { type: 'sending' } | { type: 'ok' } | { type: 'error'; message: string };

export function Contact({ settings }: { settings: SiteSettings }) {
  const captchaRef = useRef<HCaptcha>(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const captchaBox = useRef<HTMLDivElement>(null);
  const [captchaScale, setCaptchaScale] = useState(1);

  // The hCaptcha widget is a fixed 303px wide; shrink it on very narrow phones instead of overflowing.
  useEffect(() => {
    const el = captchaBox.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setCaptchaScale(Math.min(1, (el.clientWidth - 8) / 303));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!token) {
      setStatus({ type: 'error', message: 'Kérjük, igazolja, hogy nem robot (captcha).' });
      return;
    }

    setStatus({ type: 'sending' });
    try {
      await sendContact({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        message: String(data.get('message') ?? ''),
        website: String(data.get('website') ?? ''),
        privacyAccepted: data.get('privacy') === 'on',
        captchaToken: token,
      });
      form.reset();
      setStatus({ type: 'ok' });
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message });
    } finally {
      captchaRef.current?.resetCaptcha();
      setToken('');
    }
  };

  return (
    <section id="kapcsolat" className="section section-blush" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <Reveal>
          <p className="eyebrow">Kapcsolat</p>
          <h2 id="contact-title" className="section-title">
            Időpontfoglalás
          </h2>
          <p className="section-lead">
            Írjon nekünk, vagy hívjon bizalommal – egyeztetjük a kutyája állapotát és a legalkalmasabb időpontot.
          </p>

          <ul className="contact-list">
            <li>
              <PhoneIcon />
              <a href={telHref(settings.phone)}>{settings.phone}</a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <PinIcon />
              <span>Győr és 15 km-es körzete (házhoz megyünk)</span>
            </li>
          </ul>

          <div className="socials">
            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="BellaWell a Facebookon">
              <FacebookIcon />
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="BellaWell az Instagramon">
              <InstagramIcon />
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="cf-name">Név *</label>
              <input id="cf-name" name="name" type="text" required maxLength={120} autoComplete="name" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="cf-email">E-mail *</label>
                <input id="cf-email" name="email" type="email" required maxLength={200} autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="cf-phone">Telefon</label>
                <input id="cf-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="cf-message">Üzenet *</label>
              <textarea
                id="cf-message"
                name="message"
                rows={5}
                required
                minLength={5}
                maxLength={4000}
                placeholder="Kutyája neve, fajtája, kora, panasza, kívánt időpont…"
              />
            </div>

            <div className="hp" aria-hidden="true">
              <label htmlFor="cf-website">Ne töltse ki</label>
              <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <label className="check">
              <input type="checkbox" name="privacy" required />
              <span>
                Elolvastam és elfogadom az <Link to="/adatvedelem">adatvédelmi tájékoztatót</Link>. *
              </span>
            </label>

            <div
              className="captcha"
              ref={captchaBox}
              style={{ height: 78 * captchaScale }}
            >
              <div style={{ transform: `scale(${captchaScale})`, transformOrigin: '0 0', width: 303 }}>
              <HCaptcha
                ref={captchaRef}
                sitekey={SITE_KEY}
                languageOverride="hu"
                onVerify={setToken}
                onExpire={() => setToken('')}
                onError={() => setToken('')}
              />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={status.type === 'sending'}>
              {status.type === 'sending' ? 'Küldés…' : 'Üzenet küldése'}
            </button>

            <div aria-live="polite">
              {status.type === 'ok' && <p className="form-msg ok">Köszönjük! Üzenetét megkaptuk, hamarosan válaszolunk.</p>}
              {status.type === 'error' && <p className="form-msg err">{status.message}</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
