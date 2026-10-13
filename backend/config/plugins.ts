import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024,
      security: {
        allowedTypes: ['image/*'],
        deniedTypes: ['image/svg+xml'],
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('CONTACT_FROM', env('SMTP_USERNAME')),
        defaultReplyTo: env('CONTACT_TO', 'ranschburgdora.fizio@gmail.com'),
      },
    },
  },
});

export default config;
