/**
 * Bulk AI video generation via PixelBin (Veo 3, Sora 2, Kling 3, Hailuo, Seedance, LTX-2, Wan...).
 *
 * Usage:
 *   1. cp .env.example .env
 *   2. npm install
 *   3. Edit JOBS below or pass --jobs <path-to-jobs.json>
 *   4. node scripts/generate-video.js
 *
 * Output: scripts/video-urls.json  →  { key: temporary_delivery_url }
 *         (Run upload.js afterwards to make these permanent CDN URLs.)
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PixelbinConfig, PixelbinClient } = require('@pixelbin/admin');

const TOKEN = process.env.PIXELBIN_API_TOKEN;
const MODEL = process.env.PIXELBIN_VIDEO_MODEL || 'veo3Fast_generate';

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
// Each job: { key, prompt }. Optional: aspect_ratio, duration, images (start/end frames).

let JOBS = [
    {
        key: 'product-reveal',
        prompt: 'A pair of premium white sneakers slowly rotating on a soft pastel pedestal, studio lighting, smooth cinematic motion, 6 seconds',
        aspect_ratio: '16:9',
        duration: 6,
    },
];

const jobsArg = process.argv.indexOf('--jobs');
if (jobsArg !== -1 && process.argv[jobsArg + 1]) {
    JOBS = JSON.parse(fs.readFileSync(process.argv[jobsArg + 1], 'utf8'));
}

const OUT = path.join(__dirname, 'video-urls.json');

async function generateOne(job) {
    if (!job.prompt || !job.prompt.trim()) {
        console.error(`[${job.key}] skipped — empty prompt`);
        return { key: job.key, error: 'empty prompt' };
    }
    try {
        console.log(`[${job.key}] generating (model=${MODEL})... — this can take 1–5 min`);
        const input = { prompt: job.prompt };
        if (job.aspect_ratio) input.aspect_ratio = job.aspect_ratio;
        if (job.duration) input.duration = job.duration;
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
    console.log(`Model: ${MODEL}  ·  ${JOBS.length} job(s)\n`);
    // Videos are heavier — run sequentially to avoid timeouts
    const results = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
    for (const job of JOBS) {
        const r = await generateOne(job);
        if (r.url) {
            results[r.key] = r.url;
            fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
        }
    }
    const ok = Object.keys(results).length;
    console.log(`\n✓ Done. ${ok}/${JOBS.length} succeeded.`);
    console.log(`  Wrote ${OUT}`);
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
