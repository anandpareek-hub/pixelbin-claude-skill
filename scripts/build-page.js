/**
 * Assemble a humanized SEO landing page from a content spec + PixelBin CDN images.
 *
 * Workflow:
 *   1. Run scripts/seo-content.js to extract a brief from a URL or file.
 *   2. Claude reads the brief and generates a `page-spec.json` with the actual
 *      humanized copy + image jobs (see schema below).
 *   3. Run scripts/generate-image.js + scripts/upload.js for the image_jobs.
 *   4. Run THIS script to assemble the final self-contained HTML.
 *
 * Usage:
 *   node scripts/build-page.js --spec ./page-spec.json --out ./dist/index.html
 *
 * Spec shape (the JSON Claude produces):
 *   {
 *     "url_slug": "waterproof-hiking-boots",
 *     "title": "...",
 *     "meta_description": "...",
 *     "h1": "...",
 *     "intro": "<paragraph>",
 *     "sections": [
 *       { "h2": "...", "body": "<paragraphs>", "image_key": "section-1-image" }
 *     ],
 *     "faqs": [{ "q": "...", "a": "..." }],
 *     "image_urls": { "<key>": "https://cdn.pixelbin.io/v2/.../...png" },
 *     "design": {                      // OPTIONAL — derived from brief.design_system
 *       "fg":   "#0a0a0a",             //   text color
 *       "bg":   "#ffffff",             //   background
 *       "muted":"#666666",
 *       "accent":"#6d28d9",            //   primary brand color
 *       "line": "#eeeeee",
 *       "container":   "760px",        //   page max-width
 *       "font_body":   "Inter, sans-serif",
 *       "font_heading":"Inter Tight, sans-serif"
 *     },
 *     "schema": { ... optional pre-built JSON-LD ... }
 *   }
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function arg(name, fallback) {
    const i = process.argv.indexOf(`--${name}`);
    return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const SPEC = arg('spec');
const OUT = arg('out', path.join(process.cwd(), 'dist', 'index.html'));

if (!SPEC) {
    console.error('Pass --spec <path-to-page-spec.json>');
    process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(SPEC, 'utf8'));
const CLOUD = process.env.PIXELBIN_CLOUD_NAME;

function img(key, txOpts = {}) {
    const url = spec.image_urls?.[key];
    if (!url) return '';
    // Optionally rewrite for delivery transforms
    if (CLOUD && txOpts.transform) {
        const m = url.match(/cdn\.pixelbin\.io\/v2\/[^/]+\/(?:original|t\.[^/]+(?:~t\.[^/]+)*)\/(.+)$/);
        if (m) return `https://cdn.pixelbin.io/v2/${CLOUD}/${txOpts.transform}/${m[1]}`;
    }
    return url;
}

function esc(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function faqJsonLd() {
    const list = (spec.faqs || []).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    }));
    return list.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list } : null;
}

function pageJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: spec.title,
        description: spec.meta_description,
        primaryImageOfPage: img(spec.sections?.[0]?.image_key) || undefined,
    };
}

const heroImg = img(spec.sections?.[0]?.image_key, { transform: 't.resize(h:800,w:1600)~t.toFormat(f:webp)' });

const sectionsHtml = (spec.sections || []).map((s, i) => `
    <section class="block">
      ${s.image_key ? `<img class="block-img" loading="lazy" src="${esc(img(s.image_key, { transform: 't.resize(h:600,w:1200)~t.toFormat(f:webp)' }))}" alt="${esc(s.h2)}" />` : ''}
      <h2>${esc(s.h2)}</h2>
      <div class="prose">${s.body}</div>
    </section>
`).join('');

const faqsHtml = (spec.faqs || []).length ? `
    <section class="faqs">
      <h2>Frequently asked questions</h2>
      ${spec.faqs.map((f) => `
        <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>
      `).join('')}
    </section>
` : '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(spec.title)}</title>
<meta name="description" content="${esc(spec.meta_description)}" />
<meta property="og:title" content="${esc(spec.title)}" />
<meta property="og:description" content="${esc(spec.meta_description)}" />
${heroImg ? `<meta property="og:image" content="${esc(heroImg)}" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<style>
:root {
  --fg: ${esc(spec.design?.fg || '#0a0a0a')};
  --muted: ${esc(spec.design?.muted || '#666666')};
  --bg: ${esc(spec.design?.bg || '#ffffff')};
  --accent: ${esc(spec.design?.accent || '#6d28d9')};
  --line: ${esc(spec.design?.line || '#eeeeee')};
  --container: ${esc(spec.design?.container || '760px')};
  --font-body: ${esc(spec.design?.font_body || '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif')};
  --font-heading: ${esc(spec.design?.font_heading || 'inherit')};
}
* { box-sizing: border-box; }
body { margin:0; font:16px/1.6 var(--font-body); color:var(--fg); background:var(--bg); }
h1, h2, h3 { font-family: var(--font-heading); }
.wrap { max-width: var(--container); margin: 0 auto; padding: 48px 20px; }
.hero { margin-bottom: 32px; }
.hero img { width:100%; height:auto; border-radius:12px; }
h1 { font-size: 2.25rem; line-height:1.2; margin: 0.5em 0; }
h2 { font-size: 1.5rem; line-height:1.3; margin: 2em 0 0.6em; }
.lede { font-size: 1.125rem; color: var(--muted); }
.block { margin: 3em 0; }
.block-img { width:100%; height:auto; border-radius:12px; margin-bottom: 16px; }
.prose p { margin: 0 0 1em; }
details { border-top: 1px solid var(--line); padding: 12px 0; }
details summary { font-weight: 600; cursor: pointer; }
details p { margin-top: 8px; color: var(--muted); }
.cta { display:inline-block; background:var(--accent); color:#fff; padding: 12px 18px; border-radius: 8px; text-decoration:none; margin-top: 24px; }
footer { margin-top: 64px; color: var(--muted); font-size: 0.875rem; }
</style>
</head>
<body>
<main class="wrap">
  <article>
    ${heroImg ? `<div class="hero"><img src="${esc(heroImg)}" alt="${esc(spec.h1)}" /></div>` : ''}
    <h1>${esc(spec.h1)}</h1>
    ${spec.intro ? `<p class="lede">${spec.intro}</p>` : ''}
    ${sectionsHtml}
    ${faqsHtml}
  </article>
  <footer>Built with the <a href="https://github.com/anandpareek-hub/pixelbin-claude-skill">PixelBin Claude Skill</a>. Images served via PixelBin CDN.</footer>
</main>
<script type="application/ld+json">${JSON.stringify(pageJsonLd())}</script>
${faqJsonLd() ? `<script type="application/ld+json">${JSON.stringify(faqJsonLd())}</script>` : ''}
${spec.schema ? `<script type="application/ld+json">${JSON.stringify(spec.schema)}</script>` : ''}
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ Page written to ${OUT}`);
console.log(`  Title: ${spec.title}`);
console.log(`  Sections: ${(spec.sections || []).length}  ·  FAQs: ${(spec.faqs || []).length}  ·  Images: ${Object.keys(spec.image_urls || {}).length}`);
