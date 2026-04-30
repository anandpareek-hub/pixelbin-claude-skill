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

When this skill is invoked AND the user has not yet stated a specific task, you MUST:

1. Read [`INTRO.md`](INTRO.md)
2. Present the capabilities walkthrough from INTRO.md to the user
3. Ask the user what they want to build
4. Proceed only after the user states a goal

If the user has already stated a clear task ("generate 10 hero images for X", "remove backgrounds from these 50 photos"), skip the walkthrough and go straight to execution — but still confirm scope before running large jobs.

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
| Generate SEO content | `scripts/seo-content.js` | [use-cases.md](references/use-cases.md) |
| Build full landing page | `scripts/build-page.js` | [use-cases.md](references/use-cases.md) |

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
