/* eslint-disable */
// Imports photos from a folder into the Strapi media library and creates gallery items.
// Usage (Strapi must NOT be running):  npm run import:gallery [-- <folder>] [--force]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const mime = require('mime-types');

// Display order and alt text; files not listed here are appended alphabetically.
const CURATED = [
  // Order matches the desktop bento slots: [big, tall, tall, wide, small, small] repeating.
  ['IMG_2875.JPG', 'Kutya és gazdája pacsit ad rózsaszín háttér előtt'],
  ['sp_02903.jpg', 'Kutya-fitness gyakorlat tapintós pályán'],
  ['sp_03128.jpg', 'Kíméletes kutya-masszázs'],
  ['sp_02967.jpg', 'Kutya akadálypályán a szabadban'],
  ['591F2889-9A25-4B30-A928-CAB1D3340124.jpeg', 'A masszázs több, mint kényeztetés'],
  ['IMG_2818.jpg', 'Tacskó egyensúlyozó pályán'],
  ['IMG_2848.JPG', 'Pihenő labrador az akadályok között'],
  ['sp_02999.jpg', 'Kutya egyensúlyi gyakorlata gazdája mellett'],
  ['sp_03035.jpg', 'Kutya egyensúlyozó korongon'],
  ['sp_03130.jpg', 'Kutya-masszázs, nyugodt pillanat'],
  ['IMG_2866.JPG', 'Kutya és gazdája pacsit ad'],
  ['sp_03133.jpg', 'Kutya-masszázs kézzel'],
  ['IMG_2843.JPG', 'Barna labrador portré'],
  ['IMG_2813.jpg', 'Tacskó egyensúlyozó félgömbön'],
  ['sp_03074.jpg', 'Kutya mancsai az egyensúlyozó lapon'],
];
const HERO_FILE = 'IMG_2843.JPG';

(async () => {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const folder = path.resolve(args.find((a) => !a.startsWith('--')) || path.join('public', 'uploads', 'pictures'));
  if (!fs.existsSync(folder)) throw new Error(`Folder not found: ${folder}`);

  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  try {
    const items = app.documents('api::gallery-item.gallery-item');
    if (!force && (await items.count({})) > 0) {
      console.log('Gallery already has items – skipping (use --force to import anyway).');
      return;
    }

    const onDisk = fs.readdirSync(folder).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    const curated = new Map(CURATED);
    const ordered = [
      ...CURATED.map(([name]) => name).filter((n) => onDisk.includes(n)),
      ...onDisk.filter((n) => !curated.has(n)).sort(),
    ];

    // Upload from a temp copy so the originals are never touched by Strapi.
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bellawell-'));
    const upload = app.plugin('upload').service('upload');
    let heroFileId = null;

    for (const [index, name] of ordered.entries()) {
      const copy = path.join(tmp, name);
      fs.copyFileSync(path.join(folder, name), copy);
      const alt = curated.get(name) || 'BellaWell kutya-fizioterápia';
      const [file] = await upload.upload({
        data: { fileInfo: { name, alternativeText: alt } },
        files: { filepath: copy, originalFilename: name, mimetype: mime.lookup(name) || 'image/jpeg', size: fs.statSync(copy).size },
      });
      await items.create({ data: { title: alt, image: file.id, order: index + 1 } });
      if (name === HERO_FILE) heroFileId = file.id;
      console.log(`  ✓ ${name} (${file.width}x${file.height})`);
    }

    if (heroFileId) {
      const settings = await app.documents('api::site-setting.site-setting').findFirst({});
      if (settings) {
        await app.documents('api::site-setting.site-setting').update({ documentId: settings.documentId, data: { heroImage: heroFileId } });
        console.log('  ✓ hero image set');
      }
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`Imported ${ordered.length} images.`);
  } finally {
    await app.destroy();
  }
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
