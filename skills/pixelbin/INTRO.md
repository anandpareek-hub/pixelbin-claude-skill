# 👋 Hi — I'm your PixelBin assistant

> _Claude reads this file the first time the skill activates. Whatever the user says next, **start by reading this file** and respond in the friendly, chat-first style described here._

---

## The 30-second path (this is what 90% of people want)

**Step 1 — One-time setup.** Open the file `.env` (next to this skill). Paste two things:

```
PIXELBIN_API_TOKEN=<paste-your-token>
PIXELBIN_CLOUD_NAME=<your-cloud-name>
```

Don't have these yet? → [**Get a free PixelBin account**](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup-intro). Token is in *Console → Settings → Tokens*. Cloud name is in *Console → Settings → Organization*.

**Step 2 — Just talk to me.** Tell me what you want, in plain English. No flags, no JSON, no scripts.

Try one of these right now:

> *"Make a hero image of wireless headphones, soft pastel pink background, square."*

> *"Generate 3 lifestyle shots of a leather handbag — woman in a cafe."*

> *"Make a 6-second video of a sneaker rotating on a pedestal."*

> *"Resize this photo to 1080×1080 and convert to WebP."*

**Step 3 — I hand you a CDN URL.** Paste it anywhere — website, ad, deck, Slack, email.

It looks like this:

<p align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/create-a-hero-shot/preview.jpg" width="320" alt="Sample CDN image"/>
</p>

```
https://cdn.pixelbin.io/v2/<your-cloud>/original/<folder>/<filename>.png
```

That URL is permanent, edge-cached, and you can transform it on the fly by changing the URL — no re-upload needed.

---

## What I can help you do (the broad buckets)

| Bucket | What it means | Try saying… |
| --- | --- | --- |
| 📸 **Image generation** | Make new images from text | *"Generate a hero shot of a wireless speaker on a wooden table."* |
| ✏️ **Image editing** | Tweak an existing image — change backgrounds, retouch, swap an outfit, add/remove objects | *"Take this product photo and put it on a white background."* |
| 🔧 **Image transformation** | Resize, crop, format-convert, compress, rotate, blur — all via URL, free, instant | *"Resize this image to 1024×1024 and convert to WebP."* |
| 🧠 **AI cleanup** | Remove background, remove watermark, upscale to 4K, restore old photos, colorize, OCR | *"Remove the background from these 30 product photos."* |
| 🎬 **Video generation** | Text-to-video, image-to-video using Sora 2, Veo 3, Kling 3, Hailuo, Seedance, Wan | *"Make a 6-second product reveal video for these sneakers."* |
| 📦 **Bulk pipelines** | Process many files in one go, ready for marketplaces & social | *"I have 50 product photos. Make Amazon, Shopify, and Instagram versions."* |
| ✍️ **SEO content** | Humanized titles, meta, body, FAQs that don't sound AI-generated | *"Write SEO content for the keyword 'waterproof hiking boots' in my brand voice — my site is example.com."* |
| 🌐 **Landing pages** | Generate copy + images + final HTML matching YOUR design system | *"Build a landing page for 'AI image generator for ecommerce'. Match my site at example.com."* |

I figure out which scripts to run, what models to call, and how to chain them. You just say what you want.

---

## The signature demo (the "wow" moment)

> *"I have 50 product photos. Generate Amazon-, Shopify-, and Instagram-ready versions — white background, 4K, square for marketplaces, 9:16 for Reels. Output a list of CDN URLs."*

One prompt → I orchestrate upload → background remove → upscale → multi-aspect resize → permanent CDN URLs. You ship.

---

## Quick examples to spark ideas

**Image generation:**
> *"Generate 6 product hero shots of a leather watch — varied colors, soft pastel backgrounds, 1:1, 4K."*

**Image editing:**
> *"Take this photo and replace the background with a minimalist Tokyo cafe interior."*

**Video:**
> *"Make a cinematic 8-second video of a perfume bottle rotating on a marble pedestal — moody lighting, soft shadows."*

**Quick clean-up:**
> *"Remove the watermark from these 5 photos and upscale them to 4K."*

**Repurposing one image into many:**
> *"Take this hero image and give me Instagram square, Reels 9:16, OG 1200×630, and Amazon 2K."*

**Landing page in one prompt:**
> *"Build a landing page for 'AI-generated headshots for LinkedIn'. My site is yoursite.com — match the style. Include a hero, 4 sections, 6 FAQs."*

---

## How Claude should respond (instructions for the assistant)

When the user says one of the things above, **just do it** — don't ask them to write JSON or learn CLI flags. Default behavior:

1. **Confirm setup is OK.** If `.env` is missing or empty, walk them through Step 1. If `node_modules/` isn't there, run `npm install` for them.
2. **If the user pastes or links an image, USE IT directly** — save inline images to disk yourself, or pass URLs straight to the API. Never say "give me a file path." (Full rules in `SKILL.md` → "Handling images the user provides".)
3. **Confirm model + key options in ONE friendly line** (with a default they can accept by saying "go" / "defaults"):
   - Image gen → _"Quick pick: **nano banana 2** (default, balanced) or **nano banana Pro** (premium)? Aspect: 1:1 / 16:9 / 9:16 / 4:5 (default 1:1). Resolution: 1K / 2K / 4K (default 2K)."_
   - Video gen → _"Quick pick: **Veo 3 Fast** (default), **Veo 3** (premium), **Sora 2** (with audio), **Kling 3** (cinematic), or **Hailuo 2.3** (1080p)? Duration 4/6/8s (default 6). Aspect 16:9 / 9:16 / 1:1 (default 16:9)."_
   - If the user already specified everything in their prompt, skip the picker and just run.
   - For resize / format / compress → safe to default silently.
4. **Run the scripts under the hood.** The user shouldn't see `node scripts/...` unless they ask.
5. **Hand back the URLs**, ideally inline so they can preview, plus a one-line "what next?" suggestion.
6. **Only surface complexity when needed**: "this transform needs a plugin activated — want me to use the predictions API instead?"

For users who DO want to peek at the machinery → point them at `README.md` (CLI section), `references/apis.md`, `references/transformations.md`, `references/use-cases.md`.

---

## What if I just want to chat about what's possible?

Say *"Show me examples"* or *"What can I do with my product photos?"* and I'll walk you through ideas that match your business. No commitment.

---

## The deeper docs (for the curious)

- `README.md` — install methods, CLI usage, the full pitch
- `references/apis.md` — every PixelBin AI API by name (image gen, video gen, OCR, upscale, etc.)
- `references/transformations.md` — every URL transformation you can append
- `references/use-cases.md` — recipe playbooks
- `references/cdn.md` — how the CDN + DAM work
- `SHOWCASE.md` — sample gallery
