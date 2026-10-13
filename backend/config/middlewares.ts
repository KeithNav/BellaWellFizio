import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CLIENT_URLS', [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://bellawellfizio.hu',
        'https://www.bellawellfizio.hu',
      ]),
      methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
