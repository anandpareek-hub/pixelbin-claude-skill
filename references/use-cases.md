# Recipe playbooks

End-to-end workflows you can run from a single Claude prompt with this skill loaded.

> **About AI ops:** background removal, upscaling, watermark removal, restoration, colorization etc. require either (a) the matching **plugin** activated at [console.pixelbin.io → Plugins](https://console.pixelbin.io), or (b) the **predictions API** (`pixelbin.predictions.createAndWait`) — which always works without per-cloud activation. The recipes below show both paths.

---

## 1. Bulk e-commerce — make 50 photos marketplace-ready

**You say:**
> *"I have 50 product photos in `./products/`. Generate Amazon-, Shopify-, and Instagram-ready versions: white background, square (1:1) for marketplaces, 9:16 for Reels. Output a JSON of CDN URLs."*

**What happens:**
1. `node scripts/upload.js --files "./products/*.jpg"` — uploads all originals.
2. For each uploaded asset, build URL variants:
   - `t.resize(h:2000,w:2000)~t.toFormat(f:webp)~t.compress()` → marketplace
   - `t.resize(h:1080,w:1080)~t.toFormat(f:webp)~t.compress()` → Instagram
   - `t.resize(h:1920,w:1080)~t.toFormat(f:webp)~t.compress()` → Reels
3. For background removal, either: activate **Erase BG** plugin and prepend `~p:erase_bg.bg()` (per console config), OR call `pixelbin.predictions.createAndWait({ name: 'erase_bg', input: { image: cdnUrl } })` and re-upload the result.
4. Output JSON: `{ <product-key>: { marketplace_url, instagram_url, reels_url } }`

See [`examples/bulk-ecom.example.js`](../examples/bulk-ecom.example.js).

---

## 2. Watermark cleanup at scale

**You say:**
> *"Remove watermarks from these 30 product photos."*

**What happens:**
1. Upload originals via `upload.js --files`.
2. For each, call `pixelbin.predictions.createAndWait({ name: 'wm_remove', input: { image: cdnUrl } })`.
3. Upload the cleaned outputs back to PixelBin via `urlUpload` for permanent CDN URLs.

(If you've activated the Watermark Remover plugin in your Console, you can also call it inline as a URL transform — check your console for the exact syntax.)

---

## 3. Hero shots for a new product launch

**You say:**
> *"Make 6 hero shots for a wireless headphone launch — 1:1, 4K, soft pastel backdrops, varied colors."*

**What happens:**
1. Build a `JOBS` array (6 entries) with prompts + `aspect_ratio: '1:1'` + `output_resolution: '2K'` + a shared style suffix.
2. Run `generate-image.js`. → `image-urls.json`.
3. Run `upload.js`. → `cdn-image-urls.json` (permanent CDN URLs).

---

## 4. Product reveal video for a Reels ad

**You say:**
> *"Make a 6-second product reveal video for these sneakers — text-to-video, cinematic, 16:9."*

**What happens:**
1. Single job in `generate-video.js` with `model: veo3Fast_generate`, `duration: 6`, `aspect_ratio: '16:9'`.
2. `upload.js --source video-urls.json` for permanent CDN URL.

---

## 5. Generate a humanized SEO landing page from your URL

**You say:**
> *"Build a landing page for 'AI-generated logos for startups'. My current site is example.com — match that style."*

**What happens:**
1. `seo-content.js --url https://example.com --keyword "AI-generated logos for startups"` extracts existing copy + brand cues into a brief.
2. Claude reads the brief and produces a `page-spec.json`:
   - Humanized title, meta, H1, intro, sections (5–8), FAQs (5–7)
   - 4–6 image jobs (hero + section visuals) matching the brand
3. Run `generate-image.js --jobs <(echo $image_jobs_json)` and `upload.js`.
4. `build-page.js --spec ./page-spec.json --out ./dist/index.html` — outputs a self-contained HTML page with embedded JSON-LD (`WebPage` + `FAQPage`) and PixelBin CDN images.

---

## 6. Generate a humanized SEO page from your code

**You say:**
> *"Here's my JSX file. Generate humanized SEO content + visuals for it."*

**What happens:** Same as #5 but with `seo-content.js --file ./component.jsx`. The script extracts visible text (or treats raw markdown/JSX as the source) and Claude writes humanized copy referencing the existing structure.

---

## 7. Old photo restoration + colorize

**You say:**
> *"Restore and colorize these 10 family photos."*

**What happens:**
1. Upload originals.
2. For each: `pixelbin.predictions.createAndWait({ name: 'restore', input: { image: cdnUrl } })` then `pixelbin.predictions.createAndWait({ name: 'colorize', input: { image: <restored_url> } })`.
3. Re-upload the final outputs for permanent CDN URLs.

---

## 8. Convert a folder of PDFs to OG images (1200×630)

**You say:**
> *"For each PDF in ./reports/, render page 1 as an Open Graph image."*

**What happens:**
1. Upload PDFs via `upload.js --files`.
2. For each, the canonical OG transform on a rendered image: `t.resize(h:630,w:1200)~t.toFormat(f:jpeg)~t.compress()`.
3. (PDF-to-image rendering is provided by the PDF Watermark / PDF tooling plugins — activate the relevant plugin or use the predictions API for `pdf2image`-style flows.)

---

## Tips for asking Claude well

- Specify **count, aspect ratio, and use case** for image jobs.
- For videos, specify **model preference, duration, and audio** (yes/no).
- For SEO content, specify the **target keyword** and **brand voice**.
- For batch ops, say if you want **JSON output** vs **markdown gallery** vs **HTML**.

The skill defaults to JSON for machine-readable output; ask for markdown if you want a copy-pasteable preview.
