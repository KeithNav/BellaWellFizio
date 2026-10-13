import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const isRateLimited = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 1000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
};

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const verifyCaptcha = async (token: string, ip: string) => {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const siteKey = process.env.HCAPTCHA_SITEKEY;
  if (siteKey) body.set('sitekey', siteKey);
  const res = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async send(ctx: Context) {
    const input = ctx.request.body ?? {};

    // Honeypot: real users never fill this hidden field.
    if (clean(input.website, 200)) {
      ctx.body = { ok: true };
      return;
    }

    if (isRateLimited(ctx.request.ip)) {
      return ctx.tooManyRequests('Túl sok kérés. Kérjük, próbálja később.');
    }

    const name = clean(input.name, 120);
    const email = clean(input.email, 200);
    const phone = clean(input.phone, 40);
    const message = clean(input.message, 4000);
    const token = clean(input.captchaToken, 4000);

    if (!name || !EMAIL_RE.test(email) || message.length < 5) {
      return ctx.badRequest('Kérjük, töltse ki helyesen a kötelező mezőket.');
    }
    if (input.privacyAccepted !== true) {
      return ctx.badRequest('Az adatkezelési tájékoztató elfogadása kötelező.');
    }
    if (!token) return ctx.badRequest('A captcha ellenőrzés kötelező.');

    let captchaOk = false;
    try {
      captchaOk = await verifyCaptcha(token, ctx.request.ip);
    } catch (err) {
      strapi.log.error(`hCaptcha verification failed: ${(err as Error).message}`);
      return ctx.internalServerError('A captcha ellenőrzés nem sikerült. Kérjük, próbálja később.');
    }
    if (!captchaOk) return ctx.badRequest('A captcha ellenőrzés sikertelen.');

    const to = process.env.CONTACT_TO || 'ranschburgdora.fizio@gmail.com';
    const from = process.env.CONTACT_FROM || process.env.SMTP_USERNAME || to;
    const text = `Név: ${name}\nE-mail: ${email}\nTelefon: ${phone || '-'}\n\n${message}`;

    if (!process.env.SMTP_HOST) {
      if (process.env.NODE_ENV === 'production') {
        strapi.log.error('SMTP_HOST is not configured; contact message could not be delivered.');
        return ctx.internalServerError('Az üzenet küldése jelenleg nem lehetséges.');
      }
      strapi.log.warn(`SMTP not configured, contact message logged only:\n${text}`);
      ctx.body = { ok: true };
      return;
    }

    try {
      await strapi.plugin('email').service('email').send({
        to,
        from,
        replyTo: email,
        subject: `BellaWell weboldal – új üzenet: ${name}`,
        text,
      });
    } catch (err) {
      strapi.log.error(`Contact email failed: ${(err as Error).message}`);
      return ctx.internalServerError('Az üzenet küldése nem sikerült. Kérjük, hívjon telefonon.');
    }

    ctx.body = { ok: true };
  },
});
