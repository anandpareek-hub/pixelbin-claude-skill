<div align="center">

<a href="https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.pixelbin.io/v2/round-dust-e06b92/t.resize(h:80)/pixelbin-claude-skill-samples/pixelbin-logo-white.png" />
    <img src="https://cdn.pixelbin.io/v2/round-dust-e06b92/t.resize(h:80)/pixelbin-claude-skill-samples/pixelbin-logo-black.png" alt="Fynd Pixelbin" height="64" />
  </picture>
</a>

# PixelBin Claude Skill

**Turn Claude into a full media pipeline for AI image generation, AI video generation, image transformation, background removal, watermark removal, image upscaling, and bulk image processing — backed by a global image CDN and DAM.**

> Claude skill for AI image generation (nanoBanana / nanoBanana 2 / nanoBanana Pro), AI video generation (Sora 2, Veo 3, Kling 3, Hailuo, Seedance, LTX-2, Wan 2.5), 60+ chainable image transformation operations (resize, crop, WebP/AVIF format conversion, watermark, compress, sharpen, smart-crop), background remover, watermark remover, AI image upscaler, photo restoration, colorization, OCR, image editing, and image-to-video — delivered over a built-in CDN with DAM.

[![Get API Key](https://img.shields.io/badge/Get_API_Key-Free_Tier-2563eb?style=for-the-badge)](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup)
[![Pricing](https://img.shields.io/badge/Pricing-View_Plans-10b981?style=for-the-badge)](https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=pricing)
[![Docs](https://img.shields.io/badge/Docs-PixelBin-6366f1?style=for-the-badge)](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill&utm_campaign=docs)
[![License](https://img.shields.io/badge/License-MIT-374151?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 The Wow

> **"Drop 50 product photos in a Claude conversation. Get back e-commerce-ready images — backgrounds removed, upscaled to 4K, watermarked, resized for Amazon, Shopify, and Instagram — in one prompt."**

That's not a roadmap. That's what this skill does, today.

---

## ✨ Created with just one prompt

<table>
  <tr>
    <td align="center" width="20%">
      <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/create-a-hero-shot/preview.jpg" width="200" /><br />
      <sub><b>Hero shot</b></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/floating-product-photo/preview.jpg" width="200" /><br />
      <sub><b>Floating product</b></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/editorial-fashion-photo/preview.jpg" width="200" /><br />
      <sub><b>Editorial fashion</b></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/product-in-lifestyle-scene/preview.jpg" width="200" /><br />
      <sub><b>Lifestyle scene</b></sub>
    </td>
    <td align="center" width="20%">
      <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/cinematic-frame/preview.jpg" width="200" /><br />
      <sub><b>Cinematic frame</b></sub>
    </td>
  </tr>
</table>

📸 **See more →** [`SHOWCASE.md`](SHOWCASE.md)

---

## 🆚 How this is different

Most AI-media skills give Claude a single API call. PixelBin gives Claude a **production media stack**.

| Generic AI media skills | **PixelBin Claude Skill** |
| --- | --- |
| One-off API calls | **Full media pipeline** — generate → store → transform → deliver |
| Image gen, OCR, bg-remove… | **85+ AI APIs**: image gen, video gen, OCR, upscale, bg-remove, watermark remove, restore, colorize, expand, relight, frame-interp, video upscale, video watermark remove, +many more |
| Stateless, no CDN | **Built-in global CDN** — edge cache, HTTP/3, signed URLs, custom domains |
| Per-call billing | **URL-param transformations** — chain `t.resize()~t.toFormat(f:webp)~t.compress()` infinitely, free |
| No bulk pipelines | **Built for batch** — process hundreds in one job, resumable |
| Just an API | **Includes DAM** — folders, tags, search, access controls, bulk ops |

> 📌 **Powered by the same media infrastructure trusted by enterprise retail brands in production.**

---

## 🧰 What's inside

### 1. **85+ AI APIs for image generation, video generation & editing**
   AI image generation (nanoBanana, nanoBanana 2, nanoBanana Pro), AI video generation (Sora 2, Veo 3, Kling 3, Hailuo, Seedance, LTX-2, Wan 2.5), background removal, watermark removal, AI image upscaling, video upscaling, OCR, photo restoration, colorization, image expansion (outpainting), AI relighting, object removal, frame interpolation, image captioning, sketch-to-image, image-to-video, AI photo editor, and more. → [`references/apis.md`](references/apis.md)

### 2. **60+ image transformation operations** — chainable in one URL
   Image resize, crop, format conversion (WebP / AVIF / JPEG / PNG), quality / compression, watermark, blur, sharpen, brightness, saturation, rotation, padding, tinting, smart-crop, focal-point cropping, art-style presets, and more — all chainable in a single CDN URL with no extra API call. → [`references/transformations.md`](references/transformations.md)

### 3. **Built-in image & video CDN** — global edge delivery
   Every uploaded asset gets a `cdn.pixelbin.io/v2/...` URL with HTTP/3, edge caching, signed URLs, and custom domains — production-grade image CDN and video CDN out of the box. → [`references/cdn.md`](references/cdn.md)

### 4. **DAM (Digital Asset Management)** for images & videos
   Folders, tags, full-text search, access controls (`public-read` / `private`), bulk ops, metadata. Manage thousands of images and videos without spinning up your own storage layer.

### 5. **Bulk image processing & batch pipelines**
   Concurrency-safe batch runners, resumable jobs, progress checkpointing. Bulk image generation (500+ images while you sleep), bulk image transformation (10,000+ product shots in a script), bulk background removal, bulk watermark removal, bulk image upscaling.

---

## 📦 What you can build

| Use case | Tools used | Live page |
| --- | --- | --- |
| 🛍️ E-commerce hero shots at scale | image-gen + bg-remove + upscale + resize | [AI Image Generator](https://www.pixelbin.io/ai-tools/ai-image-generator?utm_source=github&utm_medium=claude-skill) |
| 🧹 Bulk watermark cleanup | watermark-remover | [Watermark Remover](https://www.pixelbin.io/ai-tools/remove-watermark?utm_source=github&utm_medium=claude-skill) |
| 🔍 4K upscaling for print/marketing | image-upscale | [AI Image Upscaler](https://www.pixelbin.io/ai-tools/ai-image-upscaler?utm_source=github&utm_medium=claude-skill) |
| ✂️ One-click background removal | bg-remove | [Remove Background](https://www.pixelbin.io/ai-tools/remove-background-from-image?utm_source=github&utm_medium=claude-skill) |
| 🎬 AI video generation (text/image → video) | video-gen (Veo 3 / Sora 2 / Kling 3) | [AI Video Generator](https://www.pixelbin.io/ai-tools/ai-video-generator?utm_source=github&utm_medium=claude-skill) |
| 🎨 AI image editing (inpaint, expand, relight) | nanoBanana 2 / Pro | [AI Photo Editor](https://www.pixelbin.io/ai-tools/ai-photo-editor?utm_source=github&utm_medium=claude-skill) |
| 🌈 Old photo restoration & colorization | restore + colorize | [Photo Restoration](https://www.pixelbin.io/ai-tools/photo-restoration?utm_source=github&utm_medium=claude-skill) |
| 📄 Landing-page generation (SEO + images) | seo-content + image-gen + build-page | — |

---

## ⚡ Quickstart (3 steps, ~2 minutes)

### 1. Install

```bash
git clone https://github.com/anandpareek-hub/pixelbin-claude-skill.git
cd pixelbin-claude-skill
npm install
```

> Make sure you `cd` into the folder `git clone` actually creates (`pixelbin-claude-skill`). The repo includes `overrides` in `package.json` to keep all transitive dependencies (axios, crypto-js, form-data) on patched versions, so a clean install reports **0 vulnerabilities**.

### 2. Configure (paste two values, you're done)

```bash
cp .env.example .env
# Open .env in any editor
```

Paste your API token and cloud name into `.env`:

```
PIXELBIN_API_TOKEN=<paste-your-token>
PIXELBIN_CLOUD_NAME=<your-cloud-name>
```

| Var | Where to find it |
| --- | --- |
| `PIXELBIN_API_TOKEN` | [console.pixelbin.io](https://console.pixelbin.io) → **Settings → Tokens → API Token** |
| `PIXELBIN_CLOUD_NAME` | [console.pixelbin.io](https://console.pixelbin.io) → **Settings → Organization** (e.g. `round-dust-e06b92`) |

🆓 **Don't have an account?** → [Sign up free](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup)

### 3. Just chat with Claude

Once `.env` is filled and the skill is loaded, you don't need to learn any commands. Try saying:

> *"Generate a hero image of wireless headphones, soft pastel pink background, square."*

You'll get back a permanent CDN URL like:

<p align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/create-a-hero-shot/preview.jpg" width="280" alt="Sample CDN-hosted output"/>
</p>

```
https://cdn.pixelbin.io/v2/<your-cloud>/original/<folder>/headphones-hero.png
```

Paste it anywhere — site, ad, deck, Instagram. That's it.

More example prompts → see [`skills/pixelbin/INTRO.md`](skills/pixelbin/INTRO.md).

---

## How to load the skill into Claude

Pick the install method that fits your workflow.

#### Option A — Claude Code plugin (recommended)

Install like you would `superpowers` — via the Claude Code plugin marketplace:

```
/plugin marketplace add anandpareek-hub/pixelbin-claude-skill
/plugin install pixelbin@pixelbin-claude-skill
```

> 🛠 **Requires Claude Code with plugin support.** If you see `Unknown skill: plugin`, your CLI is too old. Update with `npm i -g @anthropic-ai/claude-code` and restart your session, then retry. If `/plugin` still isn't recognized, use **Option B** (symlink) below.

That gives you, immediately:
- The `/pixelbin` slash command
- The `pixelbin` skill auto-triggered when you say things like *"generate AI images via PixelBin"*, *"build a media pipeline"*, etc.

To use the local clone you already made instead of GitHub, run:

```
/plugin marketplace add /absolute/path/to/pixelbin-claude-skill
/plugin install pixelbin@pixelbin-claude-skill
```

> ⚠️ The plugin still needs `.env` (`PIXELBIN_API_TOKEN`, `PIXELBIN_CLOUD_NAME`) and `npm install` in the cloned repo so the scripts can run. The plugin handles Claude's side; the scripts are what actually call PixelBin.

#### Option B — Symlink the skill manually

If you don't want the plugin marketplace setup:

```bash
ln -s "$(pwd)/skills/pixelbin" ~/.claude/skills/pixelbin
```

The skill auto-triggers on relevant keywords. Add the slash command too if you want explicit invocation:

```bash
mkdir -p ~/.claude/commands
cp commands/pixelbin.md ~/.claude/commands/
```

#### Option C — Run the scripts directly (no Claude needed)

```bash
node scripts/generate-image.js     # bulk AI image generation
node scripts/generate-video.js     # bulk AI video generation
node scripts/upload.js             # upload local files / URLs → permanent CDN URLs
node scripts/transform.js          # build CDN URLs with transformations
node scripts/seo-content.js        # generate SEO + design brief
node scripts/build-page.js         # assemble HTML page from a spec
```

See [`examples/`](examples) for ready-to-run job files.

#### Option D — npm / npx CLI

Once published to npm, the same scripts are available as a single CLI:

```bash
npx pixelbin-claude-skill help
npx pixelbin-claude-skill generate-image --jobs ./jobs.json
npx pixelbin-claude-skill seo --keyword "X" --brand-url https://yoursite.com
```

Or install globally and use the short `pixelbin` binary:

```bash
npm install -g pixelbin-claude-skill
pixelbin generate-image --jobs ./jobs.json
pixelbin build-page --spec ./page-spec.json --out ./dist/index.html
```

#### Slash-command usage

After Option A or B (with command copied), you can do:

```
/pixelbin                                  # shows the menu
/pixelbin generate 6 product hero shots    # straight to image generation
/pixelbin build a landing page for X       # SEO + design system + image gen + HTML
/pixelbin remove watermarks from these     # predictions API flow
```

---

## 🎯 The killer demo — bulk e-commerce in one prompt

Open Claude with this skill loaded and try:

> *"I have 12 product photos in `./products/`. Generate Amazon-, Shopify-, and Instagram-ready versions for each: white background, 4K upscale, square crop for marketplaces, 9:16 for Instagram Reels. Output a JSON of CDN URLs."*

The skill orchestrates: upload → bg-remove → upscale → multi-aspect resize → CDN URL build. One prompt. Production-ready URLs out.

See [`examples/bulk-ecom.example.js`](examples/bulk-ecom.example.js).

---

## 💸 Pricing & free tier

PixelBin offers a **free tier with monthly credits** — enough to experiment and ship a small project.

For production volume, paid plans start at low monthly fees with bulk credit packs. → **[View pricing](https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=pricing)**

When Claude hits an `Insufficient credits` error, it will surface the upgrade link automatically.

---

## ❓ FAQ

### What is the PixelBin Claude Skill?
A Claude Code skill (and slash command `/pixelbin`) that gives Claude direct access to PixelBin's media stack: 85+ AI APIs for image generation, video generation, and image editing; 60+ chainable image transformation operations; built-in CDN for image and video delivery; and DAM for asset management.

### Which AI image generation models does it support?
nanoBanana, nanoBanana 2, and nanoBanana Pro — covering fast drafts through hero-tier product photography. Claude picks the right model for the task or asks the user when ambiguous.

### Which AI video generation models does it support?
Sora 2, Veo 3 / Veo 3 Fast, Kling 3, Hailuo, Seedance, LTX-2, and Wan 2.5 — text-to-video and image-to-video, including reels, ads, product motion, and cinematic clips.

### What image transformations can I chain in a single URL?
Resize, crop, format conversion (WebP, AVIF, JPEG, PNG), compression / quality, watermark, blur, sharpen, brightness, saturation, rotation, padding, tinting, smart-crop, focal-point cropping, and art-style presets — all composable in one `cdn.pixelbin.io/v2/...` URL with zero per-call cost.

### Can I do bulk image processing with this skill?
Yes — bulk image generation, bulk background removal, bulk watermark removal, bulk AI image upscaling, and bulk image transformation are all first-class. Batch runners are concurrency-safe and resumable, so 500–10,000 image jobs survive crashes.

### How does the image CDN work?
Every asset uploaded via `scripts/upload.js` (or the PixelBin SDK) gets a permanent `cdn.pixelbin.io/v2/<cloud>/<transformations>/<path>` URL served from a global edge network with HTTP/3, signed URLs, and custom-domain support.

### Is there a free tier?
Yes — PixelBin offers a free tier with monthly credits for image generation, transformations, and CDN delivery. → [Sign up free](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=faq).

### How is this different from a generic AI image generation API?
Generic APIs return one-off images. PixelBin returns CDN-hosted, transformable images: upload once, transform infinitely via URL params, and serve at edge. It's an image generation API + image transformation API + image CDN + DAM in one — built for production media pipelines, not single API calls.

---

## 📚 Reference docs

- [`SKILL.md`](SKILL.md) — Claude-facing skill manifest (how Claude uses this)
- [`INTRO.md`](INTRO.md) — First-run user walkthrough Claude reads
- [`SHOWCASE.md`](SHOWCASE.md) — Full sample gallery (17 images + 4 videos)
- [`references/apis.md`](references/apis.md) — All 85+ AI APIs catalog
- [`references/transformations.md`](references/transformations.md) — All 60+ URL transformations
- [`references/cdn.md`](references/cdn.md) — How the CDN + DAM work
- [`references/use-cases.md`](references/use-cases.md) — Recipe playbooks

Official PixelBin docs → [pixelbin.io/docs](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill&utm_campaign=docs)

---

## 🤝 Contributing

PRs welcome. Found a transformation we don't cover? A use case worth a recipe? Open an issue.

## 📄 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by developers who got tired of stitching 5 APIs to ship one product page.</sub><br />
  <sub><a href="https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=footer">pixelbin.io</a> · <a href="https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=footer">pricing</a> · <a href="https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill&utm_campaign=footer">docs</a></sub>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PixelBin Claude Skill",
  "alternateName": ["PixelBin AI Image & Video Skill for Claude", "PixelBin Media Pipeline Skill"],
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "description": "Claude Code skill for AI image generation, AI video generation, image transformation, background removal, watermark removal, image upscaling, photo restoration, OCR, bulk image processing, and image CDN delivery — powered by PixelBin's 85+ AI APIs and 60+ URL transformations.",
  "keywords": "image generation, AI image generation, image transformation, video generation, AI video generation, background removal, watermark removal, image upscaling, image CDN, image API, bulk image processing, DAM, digital asset management, Claude skill, Claude Code plugin, nanoBanana, Sora 2, Veo 3, Kling 3, photo restoration, image editing API",
  "url": "https://github.com/anandpareek-hub/pixelbin-claude-skill",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "PixelBin", "url": "https://www.pixelbin.io" }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the PixelBin Claude Skill?",
      "acceptedAnswer": { "@type": "Answer", "text": "A Claude Code skill that gives Claude direct access to PixelBin's media stack: 85+ AI APIs for image generation, video generation, and image editing; 60+ chainable image transformation operations; built-in CDN for image and video delivery; and DAM for asset management." }
    },
    {
      "@type": "Question",
      "name": "Which AI image generation models does it support?",
      "acceptedAnswer": { "@type": "Answer", "text": "nanoBanana, nanoBanana 2, and nanoBanana Pro — covering fast drafts through hero-tier product photography." }
    },
    {
      "@type": "Question",
      "name": "Which AI video generation models does it support?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sora 2, Veo 3 / Veo 3 Fast, Kling 3, Hailuo, Seedance, LTX-2, and Wan 2.5 — text-to-video and image-to-video for reels, ads, product motion, and cinematic clips." }
    },
    {
      "@type": "Question",
      "name": "What image transformations can be chained in a single URL?",
      "acceptedAnswer": { "@type": "Answer", "text": "Resize, crop, format conversion (WebP, AVIF, JPEG, PNG), compression, watermark, blur, sharpen, brightness, saturation, rotation, padding, tinting, smart-crop, focal-point cropping, and art-style presets — all composable in one cdn.pixelbin.io/v2/... URL with zero per-call cost." }
    },
    {
      "@type": "Question",
      "name": "Can I do bulk image processing with this skill?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — bulk image generation, bulk background removal, bulk watermark removal, bulk AI image upscaling, and bulk image transformation are all supported via concurrency-safe, resumable batch runners." }
    },
    {
      "@type": "Question",
      "name": "Is there a free tier?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — PixelBin offers a free tier with monthly credits for image generation, transformations, and CDN delivery." }
    }
  ]
}
</script>
