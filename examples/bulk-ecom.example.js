/**
 * "Drop 50 product photos. Get e-commerce-ready images in one prompt."
 *
 * This example shows the end-to-end orchestration: upload → variants by URL.
 * Run it directly OR copy the pattern into your own scripts.
 *
 * Usage:
 *   1. Put your originals in ./products/  (jpg / png)
 *   2. node examples/bulk-ecom.example.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PixelbinConfig, PixelbinClient } = require('@pixelbin/admin');

const CLOUD = process.env.PIXELBIN_CLOUD_NAME;
const TOKEN = process.env.PIXELBIN_API_TOKEN;
const FOLDER = 'bulk-ecom';

if (!TOKEN || !CLOUD) {
    console.error('Set PIXELBIN_API_TOKEN and PIXELBIN_CLOUD_NAME in .env');
    process.exit(1);
}

const pixelbin = new PixelbinClient(new PixelbinConfig({
    domain: 'https://api.pixelbin.io',
    apiSecret: TOKEN,
}));

const SOURCE_DIR = path.join(process.cwd(), 'products');
if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Put your product photos in ${SOURCE_DIR}/ first.`);
    process.exit(1);
}

function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// URL-only variants (basic transforms — work on every cloud, no plugin needed).
// For background removal, upscaling, etc., either activate the matching plugin
// in console.pixelbin.io → Plugins, or call the predictions API and re-upload.
const VARIANTS = {
    marketplace_2k: 't.resize(h:2000,w:2000)~t.toFormat(f:webp)~t.compress()',
    instagram_square: 't.resize(h:1080,w:1080)~t.toFormat(f:webp)~t.compress()',
    reels_9x16: 't.resize(h:1920,w:1080)~t.toFormat(f:webp)~t.compress()',
    og_1200x630: 't.resize(h:630,w:1200)~t.toFormat(f:jpeg)~t.compress()',
};

async function processOne(filePath) {
    const base = path.basename(filePath, path.extname(filePath));
    const key = slug(base);
    try {
        console.log(`[${key}] uploading...`);
        const r = await pixelbin.assets.fileUpload({
            file: fs.createReadStream(filePath),
            path: FOLDER,
            name: key,
            access: 'public-read',
            tags: ['bulk-ecom'],
            overwrite: true,
        });
        const cdnPath = `${r.path}/${key}.${r.format}`;
        const variants = {};
        for (const [name, tx] of Object.entries(VARIANTS)) {
            variants[name] = `https://cdn.pixelbin.io/v2/${CLOUD}/${tx}/${cdnPath}`;
        }
        console.log(`[${key}] OK — ${Object.keys(variants).length} variants ready`);
        return { key, original: `https://cdn.pixelbin.io/v2/${CLOUD}/original/${cdnPath}`, variants };
    } catch (e) {
        console.error(`[${key}] FAIL`, e.response?.data?.message || e.message);
        return { key, error: e.message };
    }
}

async function main() {
    const files = fs.readdirSync(SOURCE_DIR)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
        .map((f) => path.join(SOURCE_DIR, f));

    console.log(`Found ${files.length} photos. Processing in batches of 5...\n`);

    const results = {};
    const BATCH = 5;
    for (let i = 0; i < files.length; i += BATCH) {
        const slice = files.slice(i, i + BATCH);
        const out = await Promise.all(slice.map(processOne));
        out.forEach((r) => { if (!r.error) results[r.key] = r; });
        fs.writeFileSync('bulk-ecom-output.json', JSON.stringify(results, null, 2));
    }

    console.log(`\n✓ Done. ${Object.keys(results).length}/${files.length} processed.`);
    console.log('  See bulk-ecom-output.json for all CDN URLs.');
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
