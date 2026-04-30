/**
 * Generate humanized SEO content from a URL or local file.
 *
 * This script EXTRACTS what Claude needs to do the writing. It does NOT call an
 * LLM API itself — Claude reads the extracted brief and produces the content.
 *
 * Usage:
 *   node scripts/seo-content.js --url https://example.com/page
 *   node scripts/seo-content.js --file ./path/to/page.html
 *   node scripts/seo-content.js --file ./component.jsx --keyword "waterproof hiking boots"
 *
 * Optional flags:
 *   --keyword "<target>"     primary keyword to target
 *   --voice "<description>"  brand voice (e.g. "friendly outdoor brand, punchy")
 *   --out ./brief.json       output path (default: scripts/seo-brief.json)
 *
 * Output: scripts/seo-brief.json  →  a structured brief Claude uses to generate
 *         humanized titles, meta, H1/H2/H3, body, FAQs, JSON-LD, and matching
 *         PixelBin image jobs.
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

const URL = arg('url');
const FILE = arg('file');
const KEYWORD = arg('keyword', '');
const VOICE = arg('voice', 'clear, friendly, expert — varied sentence rhythm, no AI clichés');
const OUT = arg('out', path.join(__dirname, 'seo-brief.json'));

if (!URL && !FILE) {
    console.error('Provide --url <url> OR --file <path>');
    process.exit(1);
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { headers: { 'User-Agent': 'pixelbin-claude-skill/1.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetch(new URL(res.headers.location, url).href));
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
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
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
    };
}

async function main() {
    let raw, isHtml = false;
    if (URL) {
        console.log(`Fetching ${URL}...`);
        raw = await fetch(URL);
        isHtml = /<html|<!doctype/i.test(raw.slice(0, 200));
    } else {
        console.log(`Reading ${FILE}...`);
        raw = fs.readFileSync(FILE, 'utf8');
        isHtml = /<html|<!doctype|<div|<section|<header/i.test(raw.slice(0, 1000));
    }

    const meta = isHtml ? extractMeta(raw) : {};
    const text = isHtml ? stripTags(raw) : raw;
    const wordCount = text.split(/\s+/).length;

    const brief = {
        source: URL || FILE,
        type: URL ? 'url' : 'file',
        target_keyword: KEYWORD,
        brand_voice: VOICE,
        existing: {
            ...meta,
            word_count: wordCount,
            text_excerpt: text.slice(0, 4000),
        },
        // Instructions Claude follows when generating content
        deliverables: {
            title: { max_chars: 60, requirements: 'natural, includes keyword early, avoids clickbait' },
            meta_description: { max_chars: 155, requirements: 'reads like a human wrote it, includes keyword + a benefit + a soft CTA, no ellipsis-spam' },
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
            internal_links: { count: '3–5', requirements: 'suggest anchor text + topical relevance for an existing site' },
            og: { og_title: true, og_description: true, og_image: 'use a PixelBin CDN URL' },
            schema_jsonld: ['WebPage', 'FAQPage', 'BreadcrumbList'],
            image_jobs: {
                description: 'List 3–6 PixelBin image-generation jobs that visually match this page (hero + sections). Provide prompt + aspect_ratio for each.',
                output_format: '[{ key, prompt, aspect_ratio, output_resolution }]',
            },
        },
        humanization_checklist: [
            'Read the draft aloud — does it sound like a person?',
            'Run a grep for the banned phrases above and rewrite any matches.',
            'Trim every adverb you can without losing meaning.',
            'Replace at least one sentence with a concrete real-world example.',
            'Make sure NO paragraph is exactly the same length as the one above it.',
        ],
    };

    fs.writeFileSync(OUT, JSON.stringify(brief, null, 2));
    console.log(`\n✓ Brief written to ${OUT}`);
    console.log('\nNext steps for Claude:');
    console.log('  1. Read this brief.');
    console.log('  2. Generate the deliverables. Apply humanization checklist.');
    console.log('  3. Run scripts/generate-image.js with the image_jobs array.');
    console.log('  4. (Optional) Run scripts/build-page.js to assemble the final HTML.');
}

main().catch((e) => { console.error('fatal', e); process.exit(1); });
