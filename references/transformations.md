# PixelBin URL transformations

URL transformations let you modify any image **without an API call** — just append the transform spec to the URL. They are free, instant (rendered + cached at the edge), and chainable.

## URL anatomy

```
https://cdn.pixelbin.io/v2/<CLOUD>/<TRANSFORMS>/<PATH>/<FILE>.<EXT>

  TRANSFORMS:  one or more `t.preset(args)` joined by `~`
               or `original` for no transform
```

## Examples

```
# Original
https://cdn.pixelbin.io/v2/round-dust-e06b92/original/claude-skill/hero.png

# Resize to 1024×1024 (cover)
https://cdn.pixelbin.io/v2/round-dust-e06b92/t.resize(h:1024,w:1024,fit:cover)/claude-skill/hero.png

# bg-remove → upscale → WebP
https://cdn.pixelbin.io/v2/round-dust-e06b92/t.bg-remove()~t.upscale(type:2x)~t.f.webp()/claude-skill/hero.png
```

## Categories

### Sizing & crop

| Transform | Purpose | Example |
| --- | --- | --- |
| `t.resize(h:H,w:W,fit:F)` | Resize | `t.resize(h:1024,w:1024,fit:cover)` |
| `t.smartcrop(h:H,w:W)` | Focal-point smart crop | `t.smartcrop(h:1080,w:1080)` |
| `t.pad(h:H,w:W,c:color)` | Pad to ratio | `t.pad(h:1920,w:1080,c:white)` |
| `t.extract(x:X,y:Y,h:H,w:W)` | Extract region | — |

`fit` values: `cover`, `contain`, `fill`, `inside`, `outside`.

### Format & quality

| Transform | Purpose |
| --- | --- |
| `t.f.auto()` | Auto-pick best format (WebP/AVIF/JPG) per browser |
| `t.f.webp()` / `t.f.avif()` / `t.f.jpg()` / `t.f.png()` | Force a format |
| `t.q(v:N)` | Quality 1–100 |
| `t.f.lossless()` | Lossless variant of the format |

### AI cleanup (most popular)

| Transform | Purpose |
| --- | --- |
| `t.bg-remove()` | Remove background |
| `t.wmr-watermark-remove()` | Remove watermark |
| `t.upscale(type:2x)` / `t.upscale(type:4x)` | Upscale |
| `t.eraseBg.eve()` | Auto enhance + bg cleanup |
| `t.restore()` | Photo restore |
| `t.colorize()` | Colorize B&W |
| `t.expand(h:H,w:W)` | Generative expand |

### Color & light

| Transform | Purpose |
| --- | --- |
| `t.brightness(v:N)` | Brightness ±100 |
| `t.contrast(v:N)` | Contrast ±100 |
| `t.saturation(v:N)` | Saturation ±100 |
| `t.tint(c:color,a:alpha)` | Tint overlay |
| `t.grayscale()` | Convert to grayscale |
| `t.sepia(v:N)` | Sepia tone |
| `t.invert()` | Invert colors |

### Effects

| Transform | Purpose |
| --- | --- |
| `t.blur(s:N)` | Gaussian blur |
| `t.sharpen(s:N)` | Sharpen |
| `t.pixelate(s:N)` | Pixelate |
| `t.noise(s:N)` | Add noise |
| `t.vignette()` | Vignette |

### Geometry

| Transform | Purpose |
| --- | --- |
| `t.rotate(a:deg)` | Rotate by degrees |
| `t.flip(d:h\|v)` | Flip horizontal / vertical |
| `t.rt.round(r:N)` | Round corners (radius) |
| `t.rt.circle()` | Circle crop |

### Composition / branding

| Transform | Purpose |
| --- | --- |
| `t.merge(m:overlay,i:logo,p:bottom-right)` | Add a logo / watermark overlay |
| `t.merge(m:underlay,i:bg)` | Underlay another asset |
| `t.text(t:"hello",c:#fff,s:48,p:center)` | Render text on the image |

### Document / PDF (where available)

| Transform | Purpose |
| --- | --- |
| `t.pdf.toImage(p:1)` | Render PDF page → image |
| `t.pdf.split(p:1-3)` | Split PDF pages |

---

## Chaining

Join transforms with `~`. Order matters — the leftmost transform runs first.

```
# Background remove first, then resize, then to WebP
t.bg-remove()~t.resize(h:1024,w:1024,fit:cover)~t.f.webp()
```

## Tips

- Use `t.f.auto()` for production — cuts bandwidth 30–60% with no work.
- Cache-bust with `?v=2` if you replace the underlying asset.
- Combine `t.bg-remove()` with `t.merge(m:underlay,...)` to drop a product onto any backdrop.
- Use `t.smartcrop(...)` (not `resize`) when subject framing matters — it uses saliency detection.
- For Open Graph images, `t.smartcrop(h:630,w:1200)~t.f.jpg()~t.q(v:80)` is a good default.

---

> The 60+ transforms above are the most-used ones. PixelBin ships additional presets (art filters, physics-based effects, document utilities). Always defer to **[pixelbin.io/docs](https://www.pixelbin.io/docs?utm_source=github&utm_medium=claude-skill)** for the live catalog.
