/**
 * Upload assets to PixelBin storage to get permanent cdn.pixelbin.io URLs.
 *
 * Two modes (auto-detected):
 *   1. URL mode  — reads scripts/image-urls.json (or video-urls.json) and uploads each via urlUpload.
 *   2. File mode — pass --files "path/glob/*.jpg" and it uploads local files via fileUpload.
 *
 * Usage:
 *   node scripts/upload.js                              # uploads from image-urls.json
 *   node scripts/upload.js --source video-urls.json     # uploads from video-urls.json
 *   node scripts/upload.js --files "./photos/*.jpg"     # uploads local files
 *
 * Output: scripts/cdn-image-urls.json  →  { key: permanent_cdn_url }
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PixelbinConfig, PixelbinClient } = require('@pixelbin/admin');

const TOKEN = process.env.PIXELBIN_API_TOKEN;
const CLOUD = process.env.PIXELBIN_CLOUD_NAME;
const FOLDER = process.env.PIXELBIN_FOLDER || 'claude-skill';

if (!TOKEN || !CLOUD) {
    console.error('✗ Missing PIXELBIN_API_TOKEN or PIXELBIN_CLOUD_NAME in .env');
    process.exit(1);
}

const pixelbin = new PixelbinClient(new PixelbinConfig({
    domain: 'https://api.pixelbin.io',
    apiSecret: TOKEN,
}));

function buildCdnUrl(uploadedPath, name, format) {
    const folder = uploadedPath ? `${uploadedPath}/` : '';
    return `https://cdn.pixelbin.io/v2/${CLOUD}/original/${folder}${name}.${format}`;
}

function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function uploadFromUrl(key, url) {
    try {
        console.log(`[${key}] uploading from URL...`);
        const r = await pixelbin.assets.urlUpload({
            url,
            path: FOLDER,
            name: key,
            access: 'public-read',
            tags: ['claude-skill'],
            overwrite: true,
        });
        const cdn = buildCdnUrl(r.path, key, r.format);
        console.log(`[${key}] OK -> ${cdn}`);
        return { key, cdn };
    } catch (e) {
        console.error(`[${key}] FAIL`, e.response?.data?.message || e.message);
        return { key, error: e.message };
    }
}

async function uploadFromFile(filepath) {
    const key = slugify(path.basename(filepath, path.extname(filepath)));
    try {
        console.log(`[${key}] uploading file...`);
        const r = await pixelbin.assets.fileUpload({
            file: fs.createReadStream(filepath),
            path: FOLDER,
            name: key,
            access: 'public-read',
            tags: ['claude-skill'],
            overwrite: true,
        });
        const cdn = buildCdnUrl(r.path, key, r.format);
        console.log(`[${key}] OK -> ${cdn}`);
        return { key, cdn };
    } catch (e) {
        console.error(`[${key}] FAIL`, e.response?.data?.message || e.message);
        return { key, error: e.message };
    }
}

async function batchRun(items, fn, batch = 5) {
    const out = {};
    for (let i = 0; i < items.length; i += batch) {
        const slice = items.slice(i, i + batch);
        const r = await Promise.all(slice.map(fn));
        r.forEach((x) => { if (x.cdn) out[x.key] = x.cdn; });
    }
    return out;
}

function expandGlob(pattern) {
    // Tiny glob: supports `dir/*.ext` only (no need for a dep for that)
    const dir = path.dirname(pattern);
    const filePattern = path.basename(pattern);
    if (!filePattern.includes('*')) {
        return fs.existsSync(pattern) ? [pattern] : [];
    }
    const ext = filePattern.replace('*', '');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter((f) => (ext ? f.endsWith(ext) : true))
        .map((f) => path.join(dir, f));
}

async function main() {
    const argv = process.argv;

    // File mode
    const filesArg = argv.indexOf('--files');
    if (filesArg !== -1 && argv[filesArg + 1]) {
        const files = expandGlob(argv[filesArg + 1]);
        if (!files.length) {
            console.error('No files matched.');
            process.exit(1);
        }
        console.log(`Uploading ${files.length} file(s)...\n`);
        const results = await batchRun(files, uploadFromFile);
        const out = path.join(__dirname, 'cdn-image-urls.json');
        const merged = fs.existsSync(out) ? { ...JSON.parse(fs.readFileSync(out, 'utf8')), ...results } : results;
        fs.writeFileSync(out, JSON.stringify(merged, null, 2));
        console.log(`\n✓ ${Object.keys(results).length}/${files.length} uploaded → ${out}`);
        return;
    }

    // URL mode (default)
    const sourceArg = argv.indexOf('--source');
    const sourceFile = sourceArg !== -1 && argv[sourceArg + 1] ? argv[sourceArg + 1] : 'image-urls.json';
    const SOURCE = path.isAbsolute(sourceFile) ? sourceFile : path.join(__dirname, sourceFile);

    if (!fs.existsSync(SOURCE)) {
        console.error(`Missing ${SOURCE}.`);
        console.error('  Either run generate-image.js / generate-video.js first,');
        console.error('  or pass --files "path/*.jpg" to upload local files.');
        process.exit(1);
    }

    const urls = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
    const entries = Object.entries(urls);
    console.log(`Uploading ${entries.length} URL(s) from ${path.basename(SOURCE)}...\n`);

    const results = await batchRun(entries, ([k, u]) => uploadFromUrl(k, u));
    const outFile = sourceFile.includes('video') ? 'cdn-video-urls.json' : 'cdn-image-urls.json';
    const out = path.join(__dirname, outFile);
    fs.writeFileSync(out, JSON.stringify(results, null, 2));
    console.log(`\n✓ ${Object.keys(results).length}/${entries.length} uploaded → ${out}`);
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
