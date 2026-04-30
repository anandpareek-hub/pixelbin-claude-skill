/**
 * Build PixelBin CDN transformation URLs.
 *
 * No API call needed — transformations are URL-based.
 *
 * Usage:
 *   1. Edit `JOBS` below or pass `--jobs path/to/jobs.json`
 *   2. node scripts/transform.js
 *
 * Each job: { key, source, transforms: [string, ...] }
 *   `source` is either:
 *     - a CDN path like `claude-skill/hero.png`
 *     - a full https URL on cdn.pixelbin.io (the script will extract the path)
 *
 * Output: scripts/transformed-urls.json  →  { key: cdn_url_with_transforms }
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const CLOUD = process.env.PIXELBIN_CLOUD_NAME;
if (!CLOUD) {
    console.error('✗ Missing PIXELBIN_CLOUD_NAME in .env');
    process.exit(1);
}

let JOBS = [
    {
        key: 'hero-instagram-square',
        source: 'claude-skill/hero.png',
        transforms: ['t.resize(h:1080,w:1080)', 't.toFormat(f:webp)', 't.compress()'],
    },
    {
        key: 'hero-reel-9x16',
        source: 'claude-skill/hero.png',
        transforms: ['t.resize(h:1920,w:1080)', 't.toFormat(f:webp)'],
    },
    {
        key: 'hero-amazon-2k',
        source: 'claude-skill/hero.png',
        transforms: ['t.resize(h:2000,w:2000)', 't.toFormat(f:jpeg)', 't.compress()'],
    },
    {
        key: 'og-1200x630',
        source: 'claude-skill/hero.png',
        transforms: ['t.resize(h:630,w:1200)', 't.toFormat(f:jpeg)', 't.compress()'],
    },
];

// Note: For AI ops (background removal, upscaling, watermark removal),
// either activate the matching plugin in console.pixelbin.io → Plugins,
// or call pixelbin.predictions.createAndWait({ name: '<api>', input: {...} })
// — see references/apis.md.

const jobsArg = process.argv.indexOf('--jobs');
if (jobsArg !== -1 && process.argv[jobsArg + 1]) {
    JOBS = JSON.parse(fs.readFileSync(process.argv[jobsArg + 1], 'utf8'));
}

function extractPath(source) {
    // If it's a full https URL on our CDN, extract the path after "/original/" or after "/<transforms>/"
    if (/^https?:\/\//.test(source)) {
        const m = source.match(/cdn\.pixelbin\.io\/v2\/[^/]+\/(?:original|t\.[^/]+(?:~t\.[^/]+)*)\/(.+)$/);
        if (m) return m[1];
        // Generic fallback: take everything after the cloud name
        const m2 = source.match(/cdn\.pixelbin\.io\/v2\/[^/]+\/(.+)$/);
        if (m2) return m2[1].replace(/^[^/]+\//, '');
    }
    return source.replace(/^\/+/, '');
}

function buildUrl({ source, transforms }) {
    const filePath = extractPath(source);
    const tx = (transforms || []).join('~') || 'original';
    return `https://cdn.pixelbin.io/v2/${CLOUD}/${tx}/${filePath}`;
}

function main() {
    const out = {};
    JOBS.forEach((job) => {
        const url = buildUrl(job);
        out[job.key] = url;
        console.log(`[${job.key}] ${url}`);
    });
    const dest = path.join(__dirname, 'transformed-urls.json');
    fs.writeFileSync(dest, JSON.stringify(out, null, 2));
    console.log(`\n✓ ${Object.keys(out).length} URLs built → ${dest}`);
    console.log('\nThese URLs are live the moment you hit them — first request renders + edge-caches.');
}

main();
