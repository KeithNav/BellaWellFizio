// Web3Forms access keys are public by design; restrict the allowed domain in the Web3Forms dashboard.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

// The Web3Forms free plan verifies captcha tokens only for its own hCaptcha site key.
export const HCAPTCHA_SITE_KEY =
  (import.meta.env.VITE_HCAPTCHA_SITEKEY as string | undefined) || '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

const DEFAULT_ERROR = 'Az üzenet küldése nem sikerült. Kérjük, próbálja újra, vagy hívjon telefonon.';

export async function sendContact(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
  captchaToken: string;
  website: string;
}) {
  // Honeypot: real users never fill this hidden field, bots get a fake success.
  if (payload.website.trim()) return;
  if (!ACCESS_KEY) throw new Error(DEFAULT_ERROR);

  let res: Response;
  try {
    res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `BellaWell weboldal – új üzenet: ${payload.name}`,
        from_name: 'BellaWell weboldal',
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '-',
        message: payload.message,
        'h-captcha-response': payload.captchaToken,
      }),
    });
  } catch {
    throw new Error(DEFAULT_ERROR);
  }

  let body: { success?: boolean; message?: string } = {};
  try {
    body = await res.json();
  } catch {
    /* keep default message */
  }
  if (!res.ok || body.success !== true) {
    throw new Error(res.status === 429 ? 'Túl sok kérés. Kérjük, próbálja később.' : DEFAULT_ERROR);
  }
}
