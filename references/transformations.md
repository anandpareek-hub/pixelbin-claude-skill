# PixelBin URL transformations

URL transformations modify any image **without an API call** — just append the transform spec to the URL. They are free, instant (rendered + cached at the edge), and chainable.

## URL anatomy

```
https://cdn.pixelbin.io/v2/<CLOUD>/<TRANSFORMS>/<PATH>/<FILE>.<EXT>

  TRANSFORMS:  one or more `t.<name>(args)` joined by `~`
               or `original` for no transform
```

## Examples

```
# Original
https://cdn.pixelbin.io/v2/round-dust-e06b92/original/claude-skill/hero.png

# Resize to 1024×1024
https://cdn.pixelbin.io/v2/round-dust-e06b92/t.resize(h:1024,w:1024)/claude-skill/hero.png

# Resize → WebP (chained with ~)
https://cdn.pixelbin.io/v2/round-dust-e06b92/t.resize(h:1024,w:1024)~t.toFormat(f:webp)/claude-skill/hero.png
```

---

## Basic transforms (work out-of-the-box, no setup)

These transforms are part of every PixelBin cloud and don't require any plugin activation.

### Sizing & geometry

| Transform | Purpose | Example |
| --- | --- | --- |
| `t.resize(h:H,w:W)` | Resize to dimensions | `t.resize(h:1024,w:1024)` |
| `t.extract(t:T,l:L,h:H,w:W)` | Extract a region (top, left, height, width) | `t.extract(t:0,l:0,h:500,w:500)` |
| `t.extend(t:T,r:R,b:B,l:L,bc:HEX)` | Pad / extend edges with a color | `t.extend(t:20,r:20,b:20,l:20,bc:ffffff)` |
| `t.rotate(a:DEG)` | Rotate by degrees | `t.rotate(a:90)` |

### Format & quality

| Transform | Purpose | Example |
| --- | --- | --- |
| `t.toFormat(f:FMT)` | Convert format | `t.toFormat(f:webp)` / `t.toFormat(f:jpeg)` / `t.toFormat(f:png)` |
| `t.compress()` | Smart compression | `t.compress()` |

### Effects

| Transform | Purpose | Example |
| --- | --- | --- |
| `t.blur(s:N)` | Gaussian blur | `t.blur(s:5)` |
| `t.sharpen(s:N)` | Sharpen | `t.sharpen(s:5)` |

---

## AI plugins (require activation per cloud)

PixelBin's AI features are exposed as **plugins** — once enabled in the Console, each plugin gets a transformation identifier you can use in URLs. Until activated, calling them via URL returns 400.

You can also invoke any of these via the **predictions API** (`pixelbin.predictions.createAndWait`) — see [`apis.md`](apis.md). The predictions API works without per-cloud plugin activation.

| Plugin | Identifier | What it does |
| --- | --- | --- |
| Erase Background | `erase_bg` | Remove background |
| Generate Background | `generate_bg` | AI-generate a backdrop |
| Watermark Remover | `wm_remove` | Remove watermark |
| Watermark Remover Pro | `wmrPro_remove` | Pro-quality watermark removal |
| Watermark Remover Max | `wmrMax_remove` | Max-quality watermark removal |
| Watermark Detection | `wmc_detect` | Detect if watermarked |
| Artifact Remover | `af_remove` | Remove compression artifacts |
| Detect Background | `dbt_detect` | Classify backdrop quality |
| OCR | `ocr_extract` | Extract text |
| Product Tagging | `pr_tag` | AI tags |
| Video Upscaler | `vsr_upscale` | Upscale videos |
| Video Watermark Remover | `wmv_remove` | Remove video watermarks |
| PDF Watermark Remover | `pwr_remove` | Remove watermarks from PDFs |

> Activate plugins in **[console.pixelbin.io](https://console.pixelbin.io) → Plugins**. Configuration & syntax for each plugin lives in your console (some require credentials).

For the always-available, non-plugin path to AI features, use the predictions API → see [`apis.md`](apis.md).

---

## Chaining

Join transforms with `~`. The leftmost transform runs first.

```
# Resize, then convert to WebP, then compress
t.resize(h:1024,w:1024)~t.toFormat(f:webp)~t.compress()
```

---

## Tips

- For OG / Twitter cards: `t.resize(h:630,w:1200)~t.toFormat(f:jpeg)~t.compress()` is a solid default.
- Use `t.toFormat(f:webp)` for marketing pages — smaller payloads, broad browser support.
- For thumbnails: `t.resize(h:280,w:280)~t.compress()` is fast + cache-friendly.
- Pad to a target ratio without cropping: `t.extend(t:20,r:0,b:20,l:0,bc:ffffff)` (or compute padding from your source size).
- Cache-bust with `?v=2` (or any querystring change) if you replace the underlying asset.

---

> Always defer to **[pixelbin.io/docs](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill)** for the live catalog and any new transforms or plugins.
