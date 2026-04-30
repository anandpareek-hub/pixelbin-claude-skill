/**
 * Build a humanized SEO + design brief Claude can use to write a landing page.
 *
 * Three input categories (combine any/all):
 *   1. WHAT to write about
 *      --keyword "<target>"            primary keyword (required)
 *      --voice "<description>"         brand voice (optional)
 *
 *   2. (Optional) RESEARCH — competitor / SERP reference
 *      --research-url <url>            a competitor or top-ranking page to study intent
 *
 *   3. BRAND / DESIGN reference — YOUR own site or files
 *      --brand-url <url>               your live site (we extract palette, fonts, spacing)
 *      --brand-files "path/glob"       local HTML / CSS / JSX / MD files
 *
 *   --out ./brief.json                 (default: scripts/seo-brief.json)
 *
 * Examples:
 *   node scripts/seo-content.js --keyword "waterproof hiking boots" \
 *     --brand-url https://yoursite.com
 *
 *   node scripts/seo-content.js --keyword "AI logo generator" \
 *     --research-url https://competitor.com/ai-logos \
 *     --brand-files "./src/styles/*.css ./src/app/page.tsx"
 *
 * Output: brief.json — Claude reads this and produces page-spec.json.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function arg(name, fallback) {
    const i = process.argv.indexOf(`--${name}`);
    return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const KEYWORD = arg('keyword', '');
const VOICE = arg('voice', 'clear, friendly, expert — varied sentence rhythm, no AI clichés');
const RESEARCH_URL = arg('research-url') || arg('url'); // back-compat: --url is treated as research
const BRAND_URL = arg('brand-url');
const BRAND_FILES = arg('brand-files') || arg('file'); // back-compat: --file is brand-files
const OUT = arg('out', path.join(__dirname, 'seo-brief.json'));

if (!KEYWORD) {
    console.error('--keyword is required.');
    console.error('Optional: --research-url <url>  (competitor / SERP reference)');
    console.error('Optional: --brand-url <url>     (your own site for design reference)');
    console.error('Optional: --brand-files "<path/glob>"  (CSS / HTML / JSX files)');
    process.exit(1);
}

// ----------------------- Fetch + parse helpers --------------------------

function fetch(url, redirects = 3) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { headers: { 'User-Agent': 'pixelbin-claude-skill/1.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
                return resolve(fetch(new URL(res.headers.location, url).href, redirects - 1));
            }
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    });
}

function stripTags(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ').trim();
}

function extractMeta(html) {
    const get = (re) => { const m = html.match(re); return m ? m[1].trim() : ''; };
    return {
        title: get(/<title>([^<]+)<\/title>/i),
        description: get(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
            || get(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i),
        h1: get(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '').trim(),
        canonical: get(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
        og_image: get(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i),
        theme_color: get(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i),
    };
}

// ----------------------- Design-system extraction -----------------------

function extractDesignTokens(text) {
    // Hex colors (#rgb, #rrggbb, #rrggbbaa)
    const hexMatches = [...text.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map((m) => `#${m[1].toLowerCase()}`);
    // rgb / rgba
    const rgbMatches = [...text.matchAll(/rgba?\(\s*\d+[^)]*\)/g)].map((m) => m[0]);
    // CSS custom properties
    const cssVars = [...text.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => ({ name: `--${m[1]}`, value: m[2].trim() }));
    // font-family
    const fonts = [...text.matchAll(/font-family\s*:\s*([^;{}]+)[;}]/g)].map((m) => m[1].trim());
    // Tailwind-ish class hints (heading sizes, common bg/text classes)
    const tw = {
        heading_classes: [...text.matchAll(/text-(?:5xl|4xl|3xl|2xl|xl)\b/g)].map((m) => m[0]),
        bg_classes: [...new Set([...text.matchAll(/bg-[a-z0-9-]+/gi)].map((m) => m[0]))].slice(0, 20),
        text_classes: [...new Set([...text.matchAll(/text-[a-z0-9-]+/gi)].map((m) => m[0]))].slice(0, 20),
        rounded_classes: [...new Set([...text.matchAll(/rounded-[a-z0-9]+/gi)].map((m) => m[0]))].slice(0, 10),
    };
    // max-width hints
    const maxWidths = [...text.matchAll(/max-width\s*:\s*([^;{}]+)[;}]/g)].map((m) => m[1].trim());

    return {
        colors: { hex: dedupTop(hexMatches, 12), rgb: dedupTop(rgbMatches, 6) },
        css_variables: cssVars.slice(0, 40),
        fonts: dedupTop(fonts, 6),
        max_widths: dedupTop(maxWidths, 4),
        tailwind_hints: tw,
    };
}

function dedupTop(arr, n) {
    const counts = new Map();
    arr.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([v, c]) => ({ value: v, occurrences: c }));
}

async function gatherFromUrl(url) {
    console.log(`  fetching ${url}...`);
    const html = await fetch(url);
    const meta = extractMeta(html);
    const text = stripTags(html);

    // Try to fetch up to 3 referenced stylesheets and concat
    const sheetUrls = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)]
        .map((m) => new URL(m[1], url).href).slice(0, 3);
    const sheets = [];
    for (const su of sheetUrls) {
        try { sheets.push(await fetch(su)); } catch (e) { /* skip */ }
    }
    const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
    const designSource = inlineStyles + '\n' + sheets.join('\n');
    return { meta, text, designSource, html };
}

function expandGlob(pattern) {
    if (!pattern) return [];
    const tokens = pattern.split(/\s+/);
    const out = [];
    for (const t of tokens) {
        const dir = path.dirname(t);
        const file = path.basename(t);
        if (!file.includes('*')) {
            if (fs.existsSync(t)) out.push(t);
            continue;
        }
        const ext = file.replace(/^\*/, '');
        if (!fs.existsSync(dir)) continue;
        for (const f of fs.readdirSync(dir)) {
            if (ext ? f.endsWith(ext) : true) out.push(path.join(dir, f));
        }
    }
    return [...new Set(out)];
}

function gatherFromFiles(globPattern) {
    const files = expandGlob(globPattern);
    const collected = [];
    for (const f of files) {
        try {
            const text = fs.readFileSync(f, 'utf8');
            collected.push({ file: f, text });
        } catch (e) { /* skip */ }
    }
    return collected;
}

// ----------------------- Main --------------------------------

async function main() {
    const brief = {
        target_keyword: KEYWORD,
        brand_voice: VOICE,
        sources: { research: null, brand: null },
        design_system: null,
        deliverables: deliverables(),
        humanization_checklist: humanizationChecklist(),
    };

    // Research (optional)
    if (RESEARCH_URL) {
        console.log(`Research source: ${RESEARCH_URL}`);
        try {
            const r = await gatherFromUrl(RESEARCH_URL);
            brief.sources.research = {
                url: RESEARCH_URL,
                type: 'url',
                existing_meta: r.meta,
                text_excerpt: r.text.slice(0, 4000),
                word_count: r.text.split(/\s+/).length,
            };
        } catch (e) {
            console.warn(`  ⚠ could not fetch research URL: ${e.message}`);
            brief.sources.research = { url: RESEARCH_URL, type: 'url', error: e.message };
        }
    }

    // Brand reference (optional but strongly recommended)
    let designSource = '';
    if (BRAND_URL) {
        console.log(`Brand source (URL): ${BRAND_URL}`);
        try {
            const b = await gatherFromUrl(BRAND_URL);
            designSource += b.designSource + '\n' + b.html;
            brief.sources.brand = {
                type: 'url',
                url: BRAND_URL,
                existing_meta: b.meta,
                text_excerpt: b.text.slice(0, 2000),
            };
        } catch (e) {
            console.warn(`  ⚠ could not fetch brand URL: ${e.message}`);
            console.warn(`    (corporate network? try: NODE_EXTRA_CA_CERTS=/path/to/ca.pem node scripts/seo-content.js ...)`);
            brief.sources.brand = { type: 'url', url: BRAND_URL, error: e.message };
        }
    }
    if (BRAND_FILES) {
        console.log(`Brand source (files): ${BRAND_FILES}`);
        const collected = gatherFromFiles(BRAND_FILES);
        designSource += '\n' + collected.map((c) => c.text).join('\n');
        brief.sources.brand = brief.sources.brand || { type: 'files', files: collected.map((c) => c.file) };
        if (brief.sources.brand.type === 'files') {
            brief.sources.brand.files = [...new Set([...(brief.sources.brand.files || []), ...collected.map((c) => c.file)])];
        }
    }
    if (designSource.trim()) {
        brief.design_system = extractDesignTokens(designSource);
    } else {
        console.log('  (no brand reference provided — Claude will pick neutral defaults)');
    }

    fs.writeFileSync(OUT, JSON.stringify(brief, null, 2));
    console.log(`\n✓ Brief written to ${OUT}`);
    console.log('\nNext: ask Claude to read the brief and produce page-spec.json');
    console.log('  Then run:');
    console.log('    node scripts/generate-image.js --jobs <(jq -c .image_jobs page-spec.json)');
    console.log('    node scripts/upload.js');
    console.log('    node scripts/build-page.js --spec ./page-spec.json --out ./dist/index.html');
}

function deliverables() {
    return {
        title: { max_chars: 60, requirements: 'natural, includes keyword early, avoids clickbait' },
        meta_description: { max_chars: 155, requirements: 'reads like a human wrote it, includes keyword + a benefit + a soft CTA, no ellipsis spam' },
        h1: { max_chars: 70, requirements: 'matches title intent, no duplicate of title verbatim' },
        outline: { sections: '5–8 H2s with 1–3 H3s each, logical info flow, intent-matched' },
        body: {
            length_words: '900–1500',
            rules: [
                'Vary sentence length (mix short punchy ones with longer flowing ones).',
                'Use first or second person where natural.',
                'No AI tells: avoid "delve into", "in today\'s fast-paced world", "elevate", "in conclusion", "embark on a journey", em-dash spam, "moreover/furthermore" overuse.',
                'Use concrete numbers, comparisons, and specific examples.',
                'Cite real, verifiable facts only — no hallucinated stats.',
                'Keep paragraphs 2–4 sentences max for scannability.',
                'Insert keyword + 2–3 close variants naturally; do NOT keyword-stuff.',
            ],
        },
        faqs: { count: '5–7', schema: 'FAQPage JSON-LD', humanized: true },
        internal_links: { count: '3–5', requirements: 'suggest anchor text + topical relevance' },
        og: { og_title: true, og_description: true, og_image: 'use a PixelBin CDN URL' },
        schema_jsonld: ['WebPage', 'FAQPage', 'BreadcrumbList'],
        design_alignment: 'If `design_system` is present in the brief, the visual style of generated images AND the page CSS MUST match the extracted palette/fonts/spacing. Do not invent colors/fonts that conflict with it.',
        image_jobs: {
            description: 'List 3–6 PixelBin image-generation jobs that visually match this page (hero + sections). Each job carries a prompt that references the brand imagery style if applicable.',
            output_format: '[{ key, prompt, aspect_ratio, output_resolution, model? }]',
        },
    };
}

function humanizationChecklist() {
    return [
        'Read the draft aloud — does it sound like a person?',
        'Grep for banned phrases above and rewrite any matches.',
        'Trim every adverb you can without losing meaning.',
        'Replace at least one sentence with a concrete real-world example.',
        'Make sure NO paragraph is exactly the same length as the one above it.',
    ];
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
