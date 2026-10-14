import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const PawIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <ellipse cx="12" cy="16.2" rx="5" ry="4" />
    <ellipse cx="5.2" cy="11" rx="2.1" ry="2.9" />
    <ellipse cx="9.4" cy="6.6" rx="2.1" ry="2.9" />
    <ellipse cx="14.6" cy="6.6" rx="2.1" ry="2.9" />
    <ellipse cx="18.8" cy="11" rx="2.1" ry="2.9" />
  </svg>
);

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const HeartIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.300 6.500 11 6.500 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor">
    <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.200-.1-2.300-.1-2.300 0-3.900 1.400-3.900 4v2.200H8v3h2.400V21h3.100Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);

export const PrintIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M7 9V4h10v5M7 17H5a1.500 1.500 0 0 1-1.500-1.500v-5A1.500 1.500 0 0 1 5 9h14a1.500 1.500 0 0 1 1.500 1.500v5A1.500 1.500 0 0 1 19 17h-2" />
    <rect x="7" y="14" width="10" height="6" rx="1" />
  </svg>
);

export const RehabIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200Z" />
    <path d="M7.500 12h2.200l1.300-2.300 2 4 1.200-1.700h1.800" />
  </svg>
);

export const MotionIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <circle cx="14.500" cy="5" r="1.800" />
    <path d="m9 21 2.500-6-2.500-2.500 1.500-4.500 3.500 1.500 2.500 3M13.500 11 16 21" />
  </svg>
);

export const HandsIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M4 14c2-3 4-3 6-1.500s4 1.500 6-1.500l4 2.500M4 19c2-3 4-3 6-1.500s4 1.500 6-1.500l4 2.500M7 8.500a2 2 0 1 0 0-.1M16 5.500a2 2 0 1 0 0-.1" />
  </svg>
);

export const ClipboardIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" />
    <path d="M9 4.5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5M8.5 11h7M8.5 14.5h7M8.5 18h4" />
  </svg>
);

export const JointIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M20 12a8 8 0 0 1-13.6 5.7M4 12a8 8 0 0 1 13.6-5.7M17.6 3v3.3h-3.3M6.4 21v-3.3h3.3" />
  </svg>
);

export const ThermoIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M10 14.8V5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0ZM12 9v7" />
  </svg>
);

export const BoltIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />
  </svg>
);

export const LaserIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <circle cx="12" cy="12" r="2" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...base(props)} {...stroke}>
    <path d="M12 3 5 6v5.5c0 4.4 2.9 7.9 7 9.5 4.1-1.6 7-5.1 7-9.5V6l-7-3Z" />
    <path d="m9 12 2.2 2.2L15.200 10" />
  </svg>
);
