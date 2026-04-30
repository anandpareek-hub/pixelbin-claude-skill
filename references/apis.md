# PixelBin AI APIs — quick reference

Every API below is invoked via the same SDK pattern:

```js
const r = await pixelbin.predictions.createAndWait({
    name: '<api_name>',
    input: { ... },
});
// r.status === 'SUCCESS' → r.output[0] is the temp URL
```

For full input schemas, see [pixelbin.io/docs](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill).

---

## Image generation

| API name | What it does |
| --- | --- |
| `nanoBanana_generate` | Fast, cost-efficient image gen / edits |
| `nanoBanana2_generate` | Default high-quality gen — `aspect_ratio` + `output_resolution` up to 4K |
| `nanoBananaPro_generate` | Hero / showcase quality |

Common input: `{ prompt, images?, aspect_ratio?, output_resolution? }`

---

## Video generation

| API name | What it does |
| --- | --- |
| `veo3_generate` | Google Veo 3 — state-of-the-art |
| `veo3Fast_generate` | Faster/cheaper Veo 3 |
| `veo31Fast_generate` | Veo 3.1 Fast — first/last-frame video |
| `veo2_generate` | Google Veo 2 — image-to-video, realistic motion |
| `sora2_generate` | OpenAI Sora 2 — text/image → video w/ audio |
| `kling3_generate` | Kling 3 — high-quality, optional audio |
| `kling26_generate` | Kling 2.6 — cinematic, native audio |
| `kling21Master_generate` | Kling 2.1 Master — premium image-to-video |
| `hailuo23_generate` | MiniMax Hailuo 2.3 — 1080p |
| `hailuo2_generate` | MiniMax Hailuo 02 — 1080p |
| `seedancePro_generate` | Bytedance Seedance Pro — high quality |
| `seedance15_generate` | Seedance 1.5 — start/end-frame, audio |
| `seedanceLite_generate` | Bytedance Seedance Lite |
| `wan25_generate` | Wan 2.5 — image-to-video |
| `wan22_generate` | Wan 2.2 — image-to-video |
| `ltx2_generate` | LTX-2 — high-fidelity video w/ audio from images |

Common input: `{ prompt, images?, aspect_ratio?, duration? }`

---

## Image plugins (cleanup / enhancement)

Each plugin can be activated in [console.pixelbin.io → Plugins](https://console.pixelbin.io) for inline URL use, OR called directly via `pixelbin.predictions.createAndWait({ name: '<id>', input: { image: <cdn_url> } })`.

| Identifier | What it does |
| --- | --- |
| `erase_bg` | Remove background |
| `generate_bg` | AI-generate a backdrop |
| `wm_remove` | Watermark removal |
| `wmrPro_remove` | Pro-quality watermark removal |
| `wmrMax_remove` | Max-quality watermark removal |
| `wmc_detect` | Watermark detection |
| `af_remove` | Compression artifact removal |
| `dbt_detect` | Backdrop quality classification |
| `ocr_extract` | Extract text from images |
| `pr_tag` | AI product tagging |

---

## Video plugins

| Identifier | What it does |
| --- | --- |
| `vsr_upscale` | Video upscaling |
| `wmv_remove` | Video watermark removal |

---

## PDF plugins

| Identifier | What it does |
| --- | --- |
| `pwr_remove` | PDF watermark removal |

---

## Counting

PixelBin's catalog continues to expand. The 85+ figure cited in the README counts:

- Image generation models (3 nanoBanana variants)
- Video generation models (16+: Veo / Sora / Kling / Hailuo / Seedance / Wan / LTX-2 variants)
- Image cleanup / enhancement plugins (erase_bg, wm_remove, wmrPro/wmrMax, af_remove, etc.)
- Video plugins (vsr_upscale, wmv_remove)
- PDF plugins (pwr_remove)
- Media intelligence (ocr_extract, pr_tag, dbt_detect, wmc_detect)
- Plus the catalog of URL transformations available without an API call

For the live, authoritative list, always check **[pixelbin.io/docs](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill)**.

---

## Error reference

| Error | Likely cause | Fix |
| --- | --- | --- |
| `Insufficient credits` / `Usage Limit Exceeded` | Out of credits / plan quota | [Top up / upgrade](https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill) |
| `Prompt is required` | Empty / whitespace prompt | Validate before submit |
| `No output image received` | Transient model failure | Retry the single job |
| 408 / `ECONNABORTED` | Network timeout | Retry — SDK polls for ~10 min |
| 429 | Rate limited | Lower concurrency to 2–3 |
| `Invalid path` | Bad folder name on upload | Slugify (lowercase, hyphens) |
| Image validation errors | Reference image too large / wrong type | Re-encode as JPG/PNG, < a few MB |
