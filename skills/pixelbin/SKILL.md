---
name: pixelbin
description: Use when the user wants to generate AI images or videos, transform/edit existing media, build production media pipelines, get CDN URLs for images/videos, do bulk image processing (background removal, watermark removal, upscaling, resizing), generate SEO content for pages, or build landing pages with AI-generated visuals. Powered by PixelBin's 85+ AI APIs and 60+ URL-based transformations.
---

# PixelBin Claude Skill

Turn Claude into a full media pipeline. Generate, transform, store, and deliver images & videos at scale using PixelBin.

## When to use

- User wants to generate images (nanoBanana, nanoBanana 2, nanoBanana Pro)
- User wants to generate videos (Sora 2, Veo 3, Kling 3, Hailuo, Seedance, LTX-2, Wan)
- User wants to remove backgrounds, watermarks, or upscale images/videos in bulk
- User wants permanent CDN URLs for media
- User wants to build URL-based image transformations (resize, crop, format, quality, etc.)
- User wants to generate SEO content (titles, meta, FAQ schema, briefs)
- User wants to build a landing page with AI-generated images stitched together
- User mentions "PixelBin", "nano banana", "build a media pipeline", "bulk image processing"

## First-run behaviour (IMPORTANT)

Read [`INTRO.md`](INTRO.md) before responding. INTRO.md is the user-facing voice of this skill — match its tone and follow its "How Claude should respond" section.

**If the user has already stated a clear goal** (e.g. "generate 6 hero images for X", "remove backgrounds from these photos", "build a landing page for Y"):
1. Confirm `.env` and `node_modules/` are ready (see Setup check below) — auto-fix silently if you can.
2. **Confirm model + key options in ONE friendly line** (don't make them write JSON — give a default they can accept with "go"):
   - **Image gen:** _"Quick pick: **nano banana 2** (default, balanced) or **nano banana Pro** (premium quality, slower)? Aspect: 1:1 / 16:9 / 9:16 / 4:5 (default 1:1). Resolution: 1K / 2K / 4K (default 2K). Or just say 'defaults' and I'll use nano banana 2 · 1:1 · 2K."_
   - **Video gen:** _"Quick pick: **Veo 3 Fast** (default, balanced cost), **Veo 3** (premium), **Sora 2** (with audio), **Kling 3** (cinematic), or **Hailuo 2.3** (1080p)? Duration: 4 / 6 / 8s (default 6). Aspect: 16:9 / 9:16 / 1:1 (default 16:9)."_
   - **Resize/format:** safe to default silently → `t.resize(...)~t.toFormat(f:webp)~t.compress()`.
   - If the user already specified everything in their prompt, skip the picker and just run.
3. Run the right scripts under the hood and hand back CDN URLs.

**If the user is just exploring** ("hi", "what can you do?", "help"):
1. Greet them and present the **broad buckets** from INTRO.md (image gen, image edit, transformation, AI cleanup, video, bulk, SEO, landing pages).
2. Show **one concrete example prompt + a sample CDN URL** from INTRO.md so it feels real and easy.
3. Invite them to just say what they want in plain English. No CLI talk.

**Default to chat-first.** Don't expose CLI flags, JOBS arrays, model names, or transform syntax unless the user asks "how does this work?". Run scripts silently; report results visually.

## Handling images the user provides (CRITICAL)

When the user references an image, **you must obtain it yourself** — never ask them to "give me a file path" or "save it to Downloads". The image is already accessible to you in one of these forms:

| What the user did | What you do |
| --- | --- |
| **Pasted an image inline in the chat** | The image is in your conversation context. Use the `Write` tool to save the bytes to `./scripts/_inputs/<slug>.<ext>`, then upload it via `pixelbin.assets.fileUpload({ file: fs.createReadStream(...) })` to get a permanent CDN URL. Pass that URL into `images: [...]` for the prediction. |
| **Gave you a public URL** (e.g. `https://example.com/photo.jpg`, a CDN URL, a Slack/Drive public link) | Two options:<br>• **Quick path** — pass the URL straight into `images: [url]` of `pixelbin.predictions.createAndWait` (most models accept a URL). No upload needed.<br>• **Permanent path** — call `pixelbin.assets.urlUpload({ url, path: '<folder>', name: '<slug>', access: 'public-read' })` to store it in PixelBin DAM, then use the resulting CDN URL. |
| **Gave a local path** (`~/Downloads/photo.jpg`, `./photo.jpg`) | Use `pixelbin.assets.fileUpload({ file: fs.createReadStream(absPath), ... })`. |
| **Mentioned an image but didn't attach or link it** | _Now_ ask — but politely: _"Drop the image into the chat or paste a URL — I'll handle the rest."_ |

**Never** say "the inline image isn't saved on disk, please paste the path" — that's a user-experience failure. Saving inline image bytes to disk is your job, not theirs.

## Cost-aware path selection (CRITICAL)

**Before reaching for a generation model, decide whether the task needs generation at all.** Generation models are the most expensive op in the stack. For most product / e-commerce / variant tasks, you can do the same job with a cheap prediction + free URL transforms.

### Decision tree

| User intent | Cheap path (use this) | Expensive path (avoid unless asked) |
| --- | --- | --- |
| **"Same product, white bg, marketplace-ready"** (Amazon, Shopify, Flipkart, etc.) | 1. `erase_bg` prediction → transparent PNG<br>2. Upload to DAM<br>3. URL transform: `t.extend(...,bc:ffffff)~t.resize(h:H,w:W)~t.toFormat(f:webp)~t.compress()` | nanoBanana regenerate (loses product fidelity, ~10× cost) |
| **"Resize / reformat / compress / different aspect ratio"** for an existing image | URL transforms only — `t.resize`, `t.toFormat`, `t.compress`, `t.extend` (free, just CDN params) | Regeneration |
| **"Upscale to 4K"** | `vsr_upscale` prediction (or `t.resize` if source is large enough) | Regeneration at higher res |
| **"Remove watermark"** | `wm_remove` / `wmrPro_remove` / `wmrMax_remove` prediction | Regeneration |
| **"Remove background and place on new scene"** | `erase_bg` + composite via `t.merge` / generation only for the new background | Full regeneration of the whole image |
| **"Generate a NEW scene / NEW product shot / hero image from scratch"** | Generation model (nanoBanana 2 / Pro) — this is the right tool | — |
| **"Variants of the same hero (color, angle, style change)"** | Image-to-image with `nanoBanana2_generate` + `images:[ref]` (preserves identity) | Text-only regeneration (loses identity) |

### Cost ranking (rough, lower → cheaper)
1. **URL transforms** — free, no API call
2. **Plugin transforms** in URL (when activated) — free per request, included in plan
3. **Predictions: `erase_bg`, `wm_remove`, `vsr_upscale`** — small per-call credit cost
4. **Image generation** — `nanoBanana_generate` < `nanoBanana2_generate` < `nanoBananaPro_generate`
5. **Video generation** — most expensive op; always confirm before spending

### Worked example — "Amazon + Shopify + Instagram-ready, white bg, 4K, 1:1 + 9:16"

**Wrong** (what NOT to do): regenerate each variant with nanoBanana — 12 outputs × generation cost, plus product hallucination risk.

**Right** (default behavior):
```
For each source image:
  1. urlUpload(source)                                        → CDN URL
  2. predictions.createAndWait({ name: 'erase_bg', input: { image: cdnUrl } })  → transparent PNG
  3. urlUpload(eraseBgOutput)                                 → CDN URL of transparent product
  4. Build transform URLs (no API call):
     • Amazon 1:1   t.extend(t:200,r:200,b:200,l:200,bc:ffffff)~t.resize(h:2048,w:2048)~t.toFormat(f:jpeg)~t.compress()
     • Shopify 1:1  t.extend(t:150,r:150,b:150,l:150,bc:ffffff)~t.resize(h:2048,w:2048)~t.toFormat(f:webp)~t.compress()
     • Instagram 9:16  t.extend(t:600,r:200,b:600,l:200,bc:ffffff)~t.resize(h:1920,w:1080)~t.toFormat(f:webp)~t.compress()
```

This costs **~1 prediction per source image**, vs **3 generations per source**. Same visual result, fraction of the credits, zero product drift.

### When in doubt — ask the user
If a task is borderline (e.g. "make this look more premium" — could be a transform or a regen), say in one line: _"I can either (a) clean + restyle the existing photo with bg-remove + transforms (~1 credit each, preserves the actual product) or (b) regenerate hero shots with nano banana 2 (higher cost, more creative freedom). Which do you want?"_

## Setup check (always do this first)

Before running any script, verify:

1. `.env` exists with `PIXELBIN_API_TOKEN` and `PIXELBIN_CLOUD_NAME`
2. `npm install` has been run (deps: `@pixelbin/admin`, `dotenv`)

If missing, walk the user through `cp .env.example .env` and link them to the [API Token page](https://console.pixelbin.io) and [signup](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup).

## Core architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   GENERATE       │ →  │   STORE (DAM)    │ →  │   TRANSFORM      │
│   image-gen      │    │   assets.upload  │    │   URL params     │
│   video-gen      │    │   folders, tags  │    │   (free, chained)│
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                  ↓
                         ┌──────────────────┐
                         │   DELIVER (CDN)  │
                         │  cdn.pixelbin.io │
                         └──────────────────┘
```

Two URL patterns:

- **Original (no transform):** `https://cdn.pixelbin.io/v2/<CLOUD>/original/<path>/<file>.<ext>`
- **Transformed:** `https://cdn.pixelbin.io/v2/<CLOUD>/<t.preset(args)>/<path>/<file>.<ext>`
  - Multiple transforms chained with `~`: `t.resize(h:1024,w:1024)~t.toFormat(f:webp)~t.compress()`

## Capabilities (high-level)

| Capability | Script | Reference |
| --- | --- | --- |
| AI image generation | `scripts/generate-image.js` | [apis.md#image-generation](references/apis.md#image-generation) |
| AI video generation | `scripts/generate-video.js` | [apis.md#video-generation](references/apis.md#video-generation) |
| Upload local file / URL → CDN | `scripts/upload.js` | [cdn.md](references/cdn.md) |
| Build transformation URLs | `scripts/transform.js` | [transformations.md](references/transformations.md) |
| Generate SEO + design brief | `scripts/seo-content.js` | [use-cases.md](references/use-cases.md) |
| Build full landing page (uses brand design tokens) | `scripts/build-page.js` | [use-cases.md](references/use-cases.md) |

### SEO + landing-page input model

When the user wants SEO content or a landing page, ALWAYS gather these before running anything:

1. **Target keyword** (required) — what to rank for.
2. **Brand reference** (strongly recommended) — either a `--brand-url <url>` OR `--brand-files "<glob>"` (CSS / HTML / JSX / MD). Without this, the page won't match the user's design.
3. **Research reference** (optional) — `--research-url <url>` of a competitor or top-ranking page for SERP-intent signal.
4. **Voice description** (optional) — `--voice "<short description>"`.

`scripts/seo-content.js` produces `brief.json`. It includes `design_system` (palette / fonts / CSS vars / max-widths) extracted from the brand reference. Claude then reads the brief and writes `page-spec.json`. `build-page.js` consumes the `design` block in `page-spec.json` and applies it as CSS variables (`--fg`, `--bg`, `--accent`, `--font-body`, `--font-heading`, `--container`).

If the user does NOT provide a brand reference, ask for one before generating the page. Don't guess colors/fonts.

## SDK pattern (memorize this)

```js
const { PixelbinConfig, PixelbinClient } = require('@pixelbin/admin');

const pixelbin = new PixelbinClient(new PixelbinConfig({
    domain: 'https://api.pixelbin.io',
    apiSecret: process.env.PIXELBIN_API_TOKEN,
}));

// 1. GENERATE (any AI model — image OR video — same shape)
const r = await pixelbin.predictions.createAndWait({
    name: 'nanoBanana2_generate',          // or veo3_generate, sora2_generate, kling3_generate, etc.
    input: {
        prompt: '...',                     // required
        images: ['https://...'],           // optional, image-to-image / image-to-video
        aspect_ratio: '16:9',              // optional, model-dependent
        output_resolution: '2K',           // optional, image models only
        duration: 8,                       // optional, video models only
    },
});
// r.status === 'SUCCESS' → r.output[0] is a temp URL (~30-day retention)

// 2. UPLOAD (local file → permanent CDN URL)
const up = await pixelbin.assets.fileUpload({
    file: fs.createReadStream('./photo.jpg'),
    path: 'my-folder',
    name: 'hero',
    access: 'public-read',
    overwrite: true,
});
// up.path / up.format → build URL: cdn.pixelbin.io/v2/<CLOUD>/original/<up.path>/hero.<up.format>

// 3. URL UPLOAD (remote URL → permanent CDN URL)
const up2 = await pixelbin.assets.urlUpload({
    url: r.output[0],
    path: 'my-folder',
    name: 'ai-output-1',
    access: 'public-read',
    overwrite: true,
});

// 4. TRANSFORM (no API call — just build the URL)
const cdn = `https://cdn.pixelbin.io/v2/${CLOUD}/t.resize(h:2048,w:2048)~t.toFormat(f:webp)~t.compress()/my-folder/hero.png`;
```

## Models reference

### Image generation
| `name` | Use for |
| --- | --- |
| `nanoBanana_generate` | Cheapest / fastest. Photo edits & fixes. |
| `nanoBanana2_generate` | Default. High quality, supports `aspect_ratio` + `output_resolution`. |
| `nanoBananaPro_generate` | Hero / showcase quality. |

### Video generation (popular)
| `name` | Notes |
| --- | --- |
| `veo3_generate` | Google Veo 3 — state-of-the-art |
| `veo3Fast_generate` | Faster, cheaper Veo 3 |
| `sora2_generate` | OpenAI Sora 2 — text/image → video w/ audio |
| `kling3_generate` | High-quality text/image → video, optional audio |
| `kling26_generate` | Cinematic, fluid motion + native audio |
| `hailuo23_generate` | MiniMax 1080p |
| `seedancePro_generate` | Bytedance, high-quality |
| `wan25_generate` | Image-to-video |
| `ltx2_generate` | High-fidelity with audio from images |

Full list: [`references/apis.md`](references/apis.md).

## Common URL transformations

Basic transforms (always available — no plugin needed):

| Transform | Syntax | Example |
| --- | --- | --- |
| Resize | `t.resize(h:H,w:W)` | `t.resize(h:1024,w:1024)` |
| Format convert | `t.toFormat(f:FMT)` | `t.toFormat(f:webp)` / `t.toFormat(f:jpeg)` / `t.toFormat(f:png)` |
| Compress | `t.compress()` | — |
| Blur / sharpen | `t.blur(s:N)` / `t.sharpen(s:N)` | `t.blur(s:5)` |
| Rotate | `t.rotate(a:DEG)` | `t.rotate(a:90)` |
| Extract region | `t.extract(t:T,l:L,h:H,w:W)` | `t.extract(t:0,l:0,h:500,w:500)` |
| Extend / pad | `t.extend(t:T,r:R,b:B,l:L,bc:HEX)` | `t.extend(t:20,r:20,b:20,l:20,bc:ffffff)` |

AI ops via plugins (require activation in **console.pixelbin.io → Plugins**) — identifiers: `erase_bg`, `wm_remove`, `wmrPro_remove`, `wmrMax_remove`, `af_remove`, `ocr_extract`, `pr_tag`, `vsr_upscale`, `wmv_remove`, `pwr_remove`. For features the user hasn't activated, fall back to the **predictions API** (`pixelbin.predictions.createAndWait`) — that always works.

Chain transforms with `~`. Full catalog: [`references/transformations.md`](references/transformations.md).

## Error handling

| Error | Cause | Action |
| --- | --- | --- |
| `Insufficient credits` / `Usage Limit Exceeded` | Plan quota | Surface upgrade link: https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=quota-error |
| `Prompt is required` | Empty prompt | Validate before submitting |
| `No output image received` | Transient model failure | Retry the single job |
| 408 / `ECONNABORTED` | Network timeout | Retry the job (SDK polls ~10 min) |
| 429 | Rate-limit | Lower concurrency to 2–3 |
| `Invalid path` | Bad folder name in upload | Use slug-safe names (lowercase, hyphens) |

## Script conventions (when generating code)

- Use `dotenv` for credentials. Never hardcode tokens.
- Batch concurrency: 4 for generation, 5 for uploads.
- Persist progress to JSON after each batch (resumable).
- Use slug-safe `name` values (lowercase, hyphens, no spaces).
- Default `access: 'public-read'` unless the user wants signed URLs.

## What NOT to do

- ❌ Don't suggest scraping / bulk-downloading from third-party sites
- ❌ Don't generate content with real, named individuals without consent
- ❌ Don't surface the user's API token in chat or logs
- ❌ Don't claim a transformation works without checking [`references/transformations.md`](references/transformations.md)

## Files in this skill

- `INTRO.md` — first-run user walkthrough (READ THIS WHEN INVOKED)
- `SKILL.md` — this file
- `README.md` — public-facing repo readme
- `SHOWCASE.md` — sample gallery
- `.env.example` — credentials template
- `package.json` — deps
- `scripts/` — runnable scripts (generate-image, generate-video, upload, transform, seo-content, build-page)
- `references/` — `apis.md`, `transformations.md`, `cdn.md`, `use-cases.md`
- `examples/` — ready-to-run sample job files
