import type { Core } from '@strapi/strapi';

const DEFAULT_SERVICES = [
  { title: 'Állapotfelmérés', price: 12000, isAddon: false },
  { title: 'Kutya-fitness 45 perc', price: 10000, isAddon: false },
  { title: 'Fizioterápia 45 perc', price: 10000, isAddon: false },
  { title: 'Lézer terápia', price: 4000, priceSuffix: '/ terület', isAddon: true },
  { title: 'Tens terápia', price: 4000, isAddon: true },
  { title: 'Masszázs 30 perc', price: 7000, isAddon: false },
];

const DEFAULT_SETTINGS = {
  servicesNote:
    'A szolgáltatás házhoz, kiszállással vehető igénybe. Az árak Győrre és 15 km-es körzetére vonatkoznak. Távolabbi kiszállás esetén a díj előzetes egyeztetés alapján kerül meghatározásra.',
  phone: '+36 70 673 7988',
  email: 'ranschburgdora.fizio@gmail.com',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61584674462110',
  instagramUrl: 'https://www.instagram.com/bellawellkutyafizioterapia/',
};

const PUBLIC_READ: Record<string, string[]> = {
  'api::service.service': ['find', 'findOne'],
  'api::gallery-item.gallery-item': ['find', 'findOne'],
  'api::site-setting.site-setting': ['find'],
};

async function grantPublicReadAccess(strapi: Core.Strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!role) return;

  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  for (const [uid, actions] of Object.entries(PUBLIC_READ)) {
    for (const action of actions) {
      const name = `${uid}.${action}`;
      const exists = await permissionQuery.findOne({ where: { action: name, role: role.id } });
      if (!exists) await permissionQuery.create({ data: { action: name, role: role.id } });
    }
  }
}

async function seed(strapi: Core.Strapi) {
  if ((await strapi.documents('api::service.service').count({})) === 0) {
    for (const [index, item] of DEFAULT_SERVICES.entries()) {
      await strapi.documents('api::service.service').create({ data: { ...item, order: index + 1 } });
    }
  }

  const settings = await strapi.documents('api::site-setting.site-setting').findFirst({});
  if (!settings) {
    await strapi.documents('api::site-setting.site-setting').create({ data: DEFAULT_SETTINGS });
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadAccess(strapi);
    await seed(strapi);
  },
};
