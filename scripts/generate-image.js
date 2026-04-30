/**
 * Bulk AI image generation via PixelBin (nanoBanana / nanoBanana 2 / nanoBanana Pro).
 *
 * Usage:
 *   1. cp .env.example .env  (fill in PIXELBIN_API_TOKEN + PIXELBIN_CLOUD_NAME)
 *   2. npm install
 *   3. Edit JOBS below or pass --jobs <path-to-jobs.json>
 *   4. node scripts/generate-image.js
 *
 * Output: scripts/image-urls.json  →  { key: temporary_delivery_url }
 *         (URLs are valid ~30 days. Run upload.js to make them permanent CDN URLs.)
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PixelbinConfig, PixelbinClient } = require('@pixelbin/admin');

const TOKEN = process.env.PIXELBIN_API_TOKEN;
const MODEL = process.env.PIXELBIN_IMAGE_MODEL || 'nanoBanana2_generate';

if (!TOKEN) {
    console.error('✗ Missing PIXELBIN_API_TOKEN in .env');
    console.error('  Get one at: https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill');
    process.exit(1);
}

const pixelbin = new PixelbinClient(new PixelbinConfig({
    domain: 'https://api.pixelbin.io',
    apiSecret: TOKEN,
}));

// ---- Jobs ----------------------------------------------------------------
// Either edit this array OR pass `--jobs path/to/jobs.json`.
// Each job needs: { key, prompt }. Optional: aspect_ratio, output_resolution, images.

let JOBS = [
    {
        key: 'hero-headphones',
        prompt: 'sleek wireless over-ear headphones product hero shot, studio lit, soft pastel gradient backdrop, e-commerce magazine quality',
        aspect_ratio: '1:1',
        output_resolution: '2K',
    },
    {
        key: 'hero-sneaker',
        prompt: 'minimalist white sneaker, side angle, floating on light beige seamless backdrop, soft contact shadow, premium e-commerce hero',
        aspect_ratio: '4:5',
        output_resolution: '2K',
    },
];

// CLI override
const jobsArg = process.argv.indexOf('--jobs');
if (jobsArg !== -1 && process.argv[jobsArg + 1]) {
    JOBS = JSON.parse(fs.readFileSync(process.argv[jobsArg + 1], 'utf8'));
}

// ---- Runner --------------------------------------------------------------
const OUT = path.join(__dirname, 'image-urls.json');
const BATCH = 4;

async function generateOne(job) {
    if (!job.prompt || !job.prompt.trim()) {
        console.error(`[${job.key}] skipped — empty prompt`);
        return { key: job.key, error: 'empty prompt' };
    }
    try {
        console.log(`[${job.key}] generating...`);
        const input = { prompt: job.prompt };
        if (job.aspect_ratio) input.aspect_ratio = job.aspect_ratio;
        if (job.output_resolution) input.output_resolution = job.output_resolution;
        if (job.images?.length) input.images = job.images;

        const r = await pixelbin.predictions.createAndWait({ name: MODEL, input });
        if (r.status !== 'SUCCESS' || !r.output?.[0]) {
            throw new Error(r.error || 'no output');
        }
        console.log(`[${job.key}] OK -> ${r.output[0]}`);
        return { key: job.key, url: r.output[0] };
    } catch (e) {
        const msg = e.response?.data?.message || e.message;
        console.error(`[${job.key}] FAIL: ${msg}`);
        if (/Insufficient credits|Usage Limit Exceeded/i.test(msg)) {
            console.error('  → Top up: https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=quota');
        }
        return { key: job.key, error: msg };
    }
}

async function main() {
    console.log(`Model: ${MODEL}  ·  ${JOBS.length} jobs  ·  batch ${BATCH}\n`);
    const results = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};

    for (let i = 0; i < JOBS.length; i += BATCH) {
        const slice = JOBS.slice(i, i + BATCH);
        const out = await Promise.all(slice.map(generateOne));
        out.forEach((r) => { if (r.url) results[r.key] = r.url; });
        fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
    }

    const ok = Object.keys(results).length;
    console.log(`\n✓ Done. ${ok}/${JOBS.length} succeeded.`);
    console.log(`  Wrote ${OUT}`);
    console.log(`\nNext: node scripts/upload.js  (make URLs permanent on the CDN)`);
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
