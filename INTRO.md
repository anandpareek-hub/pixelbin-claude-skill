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
60+ chainable transformations as URL parameters. **No API call. No extra cost.**

- Resize, crop, smart-crop, format convert (WebP/AVIF), quality, watermark, blur, sharpen, brightness, saturation, rotation, padding, tinting, art presets…
- Chain transforms: `t.bg-remove()~t.resize(h:2048,w:2048)~t.upscale(type:2x)`
- **Try saying:** *"Take this image and remove the background, upscale to 4K, and resize for Instagram square."*

### 4️⃣ Use any of 85+ AI APIs
Background removal, watermark removal, upscaling, OCR, photo restoration, colorization, expansion, relighting, object removal, frame interpolation, captioning, sketch-to-image, image-to-video, video upscale, video watermark removal — and more.

- **Try saying:** *"Remove watermarks from these 30 photos and upscale them to 4K."*

### 5️⃣ Generate SEO content from your URL or code
Give me a **page URL** or **paste your HTML/JSX/Markdown** and I'll generate **humanized** content that reads like a real person wrote it (not AI-detector bait):

- SEO-optimized titles + meta descriptions (with character-count guards)
- H1, H2/H3 outline tuned for the target keyword
- Body content in your brand voice — punchy, varied sentence rhythm, no AI tells ("delve into", "in today's fast-paced world", "elevate", em-dash spam)
- FAQ section with `FAQPage` JSON-LD schema
- Internal linking suggestions
- Open Graph + Twitter card metadata
- **Try saying:** *"Here's my page URL — rewrite it for the keyword 'waterproof hiking boots' in a friendly outdoor brand voice."* — or — *"Here's my JSX file, generate humanized SEO content + visuals for it."*

### 6️⃣ Build a complete landing page
Combine #5 (humanized SEO content) + #1 (AI-generated visuals) into a **ready-to-deploy HTML or JSX page**:

- I read your URL or your existing code as the brand/style reference
- I generate humanized SEO copy targeting your keyword
- I generate matching hero + section images via PixelBin
- I upload images to CDN → permanent URLs
- I produce a self-contained `.html` (or framework component) with embedded JSON-LD schema
- **Try saying:** *"Build a landing page for 'AI-generated logos for startups'. My current site is example.com — match that style."*

---

## 🚀 The signature demo (try this!)

> *"I have 50 product photos. Generate Amazon-, Shopify-, and Instagram-ready versions: white background, 4K, 1:1 for marketplaces, 9:16 for Reels. Output a JSON of CDN URLs."*

I'll orchestrate **upload → bg-remove → upscale → multi-aspect resize → CDN URLs** in one go.

---

## 🗂️ Sample transformations (top 12)

These are URL-based, no API call needed:

| You want to… | Transform syntax |
| --- | --- |
| Resize to 1024×1024 (cover crop) | `t.resize(h:1024,w:1024,fit:cover)` |
| Convert to WebP (auto-best-format) | `t.f.auto()` |
| Compress to 80% quality | `t.q(v:80)` |
| Remove background | `t.bg-remove()` |
| Remove watermark | `t.wmr-watermark-remove()` |
| Upscale 2× / 4× | `t.upscale(type:2x)` / `t.upscale(type:4x)` |
| Smart-crop to a focal subject | `t.smartcrop(h:1080,w:1080)` |
| Add a logo watermark overlay | `t.merge(m:overlay,i:logo,p:bottom-right)` |
| Blur faces / regions | `t.blur(s:50)` |
| Auto-enhance colors | `t.eraseBg.eve()` |
| Pad to a target ratio | `t.pad(h:1920,w:1080,c:white)` |
| Round corners for cards | `t.rt.round(r:24)` |

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
- **"Generate SEO content for [URL or code]"** — I'll fetch / parse, ask for keyword, produce humanized copy
- **"Build a landing page"** — I'll ask for keyword + brand reference (URL or code), then generate copy + images + final HTML
- **"Show me what's possible"** — I'll walk through more examples

Or just describe what you're trying to ship and I'll figure out the right tools.
