import { telHref } from '../lib/content';
import { PhoneIcon } from './Icons';

export function MobileCall({ phone }: { phone: string }) {
  return (
    <a className="mobile-call" href={telHref(phone)} aria-label={`Hívás: ${phone}`}>
      <PhoneIcon />
      Hívás
    </a>
  );
}
