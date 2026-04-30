# 👋 Welcome — here's what I can do for you with PixelBin

> _Claude reads this file first. When the user has just installed the skill (or hasn't given a clear task), Claude walks them through this menu before doing anything else._

---

## 🎯 Pick what you want to build

I can help you with **media + content + page-building** workflows. Here's the menu:

### 1️⃣ Generate AI images
Bulk-generate marketing visuals, hero shots, lifestyle photos, product mocks.

- **Models available:** `nanoBanana` (fast/cheap), `nanoBanana2` (default), `nanoBananaPro` (hero quality)
- **Inputs:** prompt + (optional) reference images + aspect ratio + resolution (up to 4K)
- **Output:** permanent CDN URLs ready to embed anywhere
- **Try saying:** *"Generate 6 product hero shots for a wireless headphone — 1:1, studio-lit, soft pastel backgrounds."*

### 2️⃣ Generate AI videos
Text-to-video and image-to-video using state-of-the-art models.

- **Models:** Veo 3, Veo 3 Fast, Sora 2, Kling 3, Kling 2.6, Hailuo 2.3, Seedance Pro/Lite, Wan 2.5, LTX-2
- **Inputs:** prompt + (optional) start/end-frame images + duration + aspect ratio
- **Output:** permanent CDN MP4 URLs
- **Try saying:** *"Make a 6-second product reveal video for these 3 sneakers."*

### 3️⃣ Transform existing images via CDN URL
Chainable transformations as URL parameters. **No API call. No extra cost.**

- **Always available:** resize, format convert (WebP/JPEG/PNG), compress, blur, sharpen, rotate, extract, extend (padding).
- **AI ops (require plugin activation in Console, or via the predictions API):** background removal, watermark removal, upscaling, OCR, restoration, colorization.
- Chain basics: `t.resize(h:2048,w:2048)~t.toFormat(f:webp)~t.compress()`
- **Try saying:** *"Take this image, resize to 1024×1024, convert to WebP, compress."*

### 4️⃣ Use any of 85+ AI APIs
Background removal, watermark removal, upscaling, OCR, photo restoration, colorization, expansion, relighting, object removal, frame interpolation, captioning, sketch-to-image, image-to-video, video upscale, video watermark removal — and more.

- **Try saying:** *"Remove watermarks from these 30 photos and upscale them to 4K."*

### 5️⃣ Generate SEO content (with humanization)
Give me a **target keyword** plus optional references, and I'll generate copy that reads like a real person wrote it (not AI-detector bait):

**Inputs you can pass:**
- 🎯 `--keyword` — what to rank for *(required)*
- 🔍 `--research-url` — a competitor or top-ranking page (so I can match search intent)
- 🎨 `--brand-url` — **your own site** (I extract palette, fonts, container width, voice cues)
- 📁 `--brand-files` — local CSS / HTML / JSX / MD files (same extraction)

**What I produce:**
- SEO-optimized title + meta description (with character-count guards)
- H1, H2/H3 outline tuned for the target keyword
- Body content in your brand voice — punchy, varied sentence rhythm, no AI tells ("delve into", "in today's fast-paced world", "elevate", em-dash spam)
- FAQ section with `FAQPage` JSON-LD schema
- Internal linking suggestions
- Open Graph + Twitter card metadata
- **Try saying:** *"Generate humanized SEO content for 'waterproof hiking boots'. My site is yoursite.com — match that brand voice and palette."*

### 6️⃣ Build a complete landing page (with YOUR design system)
Combine #5 (humanized SEO content) + #1 (AI-generated visuals) into a **ready-to-deploy HTML page that matches your brand**:

1. You give me a **keyword** and a **brand reference** (`--brand-url` or `--brand-files`)
2. I extract your **design system** — palette, fonts, container width, common spacing
3. I generate humanized SEO copy targeting your keyword
4. I generate matching hero + section images via PixelBin (style instructions reference your brand visuals)
5. I upload images to CDN → permanent URLs
6. I produce a self-contained `.html` whose CSS variables (`--accent`, `--bg`, `--font-body`, `--container`…) are populated from your design system, with embedded `WebPage` + `FAQPage` JSON-LD
- **Try saying:** *"Build a landing page for 'AI-generated logos for startups'. My current site is example.com — match that style and visuals."*

---

## 🚀 The signature demo (try this!)

> *"I have 50 product photos. Generate Amazon-, Shopify-, and Instagram-ready versions: white background, 4K, 1:1 for marketplaces, 9:16 for Reels. Output a JSON of CDN URLs."*

I'll orchestrate **upload → bg-remove → upscale → multi-aspect resize → CDN URLs** in one go.

---

## 🗂️ Sample transformations

URL-based, no API call needed:

| You want to… | Transform syntax | Type |
| --- | --- | --- |
| Resize to 1024×1024 | `t.resize(h:1024,w:1024)` | basic |
| Convert to WebP | `t.toFormat(f:webp)` | basic |
| Convert to JPEG | `t.toFormat(f:jpeg)` | basic |
| Smart compression | `t.compress()` | basic |
| Blur an image | `t.blur(s:5)` | basic |
| Sharpen | `t.sharpen(s:5)` | basic |
| Rotate 90° | `t.rotate(a:90)` | basic |
| Extract a region | `t.extract(t:0,l:0,h:500,w:500)` | basic |
| Pad / extend with color | `t.extend(t:20,r:20,b:20,l:20,bc:ffffff)` | basic |
| Chain transforms | `t.resize(h:1024,w:1024)~t.toFormat(f:webp)~t.compress()` | basic |
| Remove background | activate the **Erase BG** plugin (`erase_bg`) | AI plugin |
| Remove watermark | activate the **Watermark Remover** plugin (`wm_remove` / `wmrPro_remove`) | AI plugin |
| Upscale image | activate the **Upscaler** plugin | AI plugin |
| OCR / extract text | activate the **OCR** plugin (`ocr_extract`) | AI plugin |

> Activate plugins at **[console.pixelbin.io](https://console.pixelbin.io) → Plugins**, or call any AI feature via the predictions API (no plugin activation needed) — see [`references/apis.md`](references/apis.md).

Full catalog → [`references/transformations.md`](references/transformations.md)

---

## 💡 Setup check

Before we run anything, make sure you have:

- ✅ A PixelBin account → [Sign up free](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup-intro)
- ✅ `.env` file with `PIXELBIN_API_TOKEN` and `PIXELBIN_CLOUD_NAME` (see [README — Quickstart](README.md#-quickstart-3-steps-2-minutes))
- ✅ `npm install` already run

If anything is missing, I'll help you set it up first.

---

## 🤔 What would you like to do?

Reply with one of:

- **"Generate images"** — I'll ask for prompts, count, aspect ratios
- **"Generate a video"** — I'll ask for prompt, model preference, duration
- **"Transform these images"** — I'll ask for the source URLs and what you want done
- **"Process this batch"** — bulk pipeline (e.g., the 50-photo demo above)
- **"Generate SEO content for [keyword]"** — I'll ask for your brand reference (URL or files) and produce humanized copy aligned to your design
- **"Build a landing page"** — I'll ask for keyword + brand reference (URL or files), extract your design tokens (palette/fonts/container), then generate copy + matching images + final HTML
- **"Show me what's possible"** — I'll walk through more examples

Or just describe what you're trying to ship and I'll figure out the right tools.
