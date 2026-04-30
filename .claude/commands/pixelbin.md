---
description: Run the PixelBin Claude Skill — generate AI images/videos, transform via CDN, build SEO landing pages with your brand's design system. Pass a goal as the argument or leave blank to see the menu.
argument-hint: <what you want to build>
---

# /pixelbin

Activate the **PixelBin Claude Skill**. Use this whenever you want to generate AI images / videos, transform existing media via CDN URLs, build production media pipelines, generate humanized SEO content, or assemble a landing page that matches the user's design system.

## What the user typed

`$ARGUMENTS`

If `$ARGUMENTS` is empty, treat this as **first-run** — read [`INTRO.md`](../../INTRO.md) and present the capabilities menu, then wait for the user's choice.

If `$ARGUMENTS` is non-empty, treat it as the user's goal and proceed straight to the matching workflow (skip the menu but still run preflight).

---

## Preflight (always run first)

Before any generation / upload, verify:

1. **Repo present** — current directory should contain `package.json` with `"@pixelbin/admin"`. If you are in a different directory, look for `pixelbin-claude-skill/` and `cd` into it. If the skill isn't installed locally yet, walk the user through:
   ```
   git clone https://github.com/anandpareek-hub/pixelbin-claude-skill.git
   cd pixelbin-claude-skill
   npm install
   ```
2. **Credentials** — `.env` exists with `PIXELBIN_API_TOKEN` and `PIXELBIN_CLOUD_NAME`.
   - If missing: `cp .env.example .env`, then point the user at:
     - API token: [console.pixelbin.io](https://console.pixelbin.io) → Settings → Tokens → API Token
     - Cloud name: [console.pixelbin.io](https://console.pixelbin.io) → Settings → Organization
     - No account yet? → [pixelbin.io](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=signup)
3. **Deps installed** — `node_modules/@pixelbin/admin` exists. If not, run `npm install` (the repo pins safe versions of axios/crypto-js/form-data via `overrides`, so `npm audit` should report 0 vulnerabilities).

If any preflight check fails, fix it before generating anything.

---

## Read the skill before acting

Read these files (in this order) to load the skill's behaviour, capabilities, and constraints:

1. [`SKILL.md`](../../SKILL.md) — manifest: when/how to use, SDK patterns, model list, error handling, what NOT to do
2. [`INTRO.md`](../../INTRO.md) — user-facing menu of capabilities
3. [`references/apis.md`](../../references/apis.md) — 85+ AI APIs catalog
4. [`references/transformations.md`](../../references/transformations.md) — URL transformations (basic + AI plugins)
5. [`references/use-cases.md`](../../references/use-cases.md) — recipe playbooks

You don't need every file every time — pull what's relevant to `$ARGUMENTS`.

---

## Plan — dispatch by intent

Match the user's goal to one of these flows. If the goal is unclear, ask **one** clarifying question, then proceed.

### A. Generate AI images
- Confirm: count, prompts (or generate from a brief), aspect ratio, model preference (`nanoBanana` / `nanoBanana2` / `nanoBananaPro`).
- Build a JOBS array. Run `node scripts/generate-image.js --jobs <path>`.
- Then `node scripts/upload.js` to mint permanent CDN URLs.
- Output: `cdn-image-urls.json` mapping keys → permanent URLs.

### B. Generate AI videos
- Confirm: model (`veo3_generate`, `sora2_generate`, `kling3_generate`, `hailuo23_generate`, `seedancePro_generate`, `wan25_generate`, `ltx2_generate`, …), prompt, duration, aspect ratio, audio.
- Run `node scripts/generate-video.js --jobs <path>`.
- Then `node scripts/upload.js --source video-urls.json`.

### C. Transform existing images via URL (no API call)
- Identify source asset(s) — uploaded path, or URL on this user's CDN.
- Build the transform chain using **only verified syntax**:
  - `t.resize(h:N,w:N)`, `t.toFormat(f:webp|jpeg|png)`, `t.compress()`, `t.blur(s:N)`, `t.sharpen(s:N)`, `t.rotate(a:DEG)`, `t.extract(t:T,l:L,h:H,w:W)`, `t.extend(t:T,r:R,b:B,l:L,bc:HEX)`
- For AI ops (background removal, upscaling, watermark removal): use the **predictions API** (`pixelbin.predictions.createAndWait({ name: 'erase_bg', input: { image: cdnUrl } })`) — that always works without per-cloud plugin activation. See `references/apis.md` for identifiers.
- Use `node scripts/transform.js` for batch URL building.

### D. Bulk e-commerce pipeline
- Run `examples/bulk-ecom.example.js` against `./products/` for upload + multi-variant URL generation.

### E. Generate SEO content (humanized)
- Required: `--keyword "<topic>"`.
- Strongly recommended: a brand reference (`--brand-url <url>` OR `--brand-files "<glob>"`). Without it, ask the user for one — don't guess colors/fonts.
- Optional: `--research-url <competitor>` for SERP-intent signal, `--voice "<description>"`.
- Run `node scripts/seo-content.js ...` to produce `brief.json`.
- Then **read `brief.json`** and produce `page-spec.json` per the deliverables spec inside it. Apply the humanization checklist. Populate `design` from `brief.design_system` (palette, fonts, max-width).
- Stop here unless the user wants the full page assembled (flow F).

### F. Build a complete landing page
- Run flow E first to get `page-spec.json` (which now includes a `design` block + `image_jobs`).
- Run `node scripts/generate-image.js --jobs <(jq -c .image_jobs page-spec.json)` then `node scripts/upload.js` to fill in `image_urls`.
- Merge image_urls back into `page-spec.json`.
- Run `node scripts/build-page.js --spec ./page-spec.json --out ./dist/index.html`.
- Hand the user a path to the rendered HTML.

---

## Output discipline

- Show progress per batch (concurrency-safe, resumable).
- Persist intermediate JSON after every batch so partial failures aren't lost.
- Never print the user's API token in chat or logs.
- Surface upgrade link on quota errors: `https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=quota-error`
- For batch ops, default to JSON output. Offer markdown gallery preview if the user asks.

---

## What NOT to do

- ❌ Don't hard-code transforms that require AI plugins (`t.bg-remove()`, `t.upscale()`, `t.smartcrop()`, `t.f.auto()`) — they 400 unless the plugin is activated. Use the predictions API or verified basic transforms instead.
- ❌ Don't generate landing-page CSS without a brand reference unless the user explicitly says "use neutral defaults".
- ❌ Don't fabricate stats, customer names, or capabilities not in the public docs.
- ❌ Don't skip `npm install` if `node_modules/` is missing.

---

When you're ready, restate what you'll do in 1–2 lines and start with the preflight check.
