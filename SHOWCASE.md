# 📸 PixelBin Claude Skill — Sample Gallery

A small selection of what's possible with **just one prompt** through the PixelBin Claude Skill. All images served from PixelBin's global CDN.

> Want any of these for your own brand? Clone the repo, set up `.env`, and use the prompts in `examples/jobs.example.json` as a starting point.

---

## 🎨 Image templates (one prompt each)

<table>
<tr>
<td align="center" width="33%">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/create-a-hero-shot/preview.jpg" width="280"/><br/>
  <sub><b>Hero shot</b></sub>
</td>
<td align="center" width="33%">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/floating-product-photo/preview.jpg" width="280"/><br/>
  <sub><b>Floating product photo</b></sub>
</td>
<td align="center" width="33%">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/editorial-fashion-photo/preview.jpg" width="280"/><br/>
  <sub><b>Editorial fashion</b></sub>
</td>
</tr>
<tr>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/product-in-lifestyle-scene/preview.jpg" width="280"/><br/>
  <sub><b>Product in lifestyle scene</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/cinematic-frame/preview.jpg" width="280"/><br/>
  <sub><b>Cinematic frame</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/generate-a-tech-product-photo/preview.jpg" width="280"/><br/>
  <sub><b>Tech product photo</b></sub>
</td>
</tr>
<tr>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/create-your-influencer/preview.jpg" width="280"/><br/>
  <sub><b>Create your influencer</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/try-on-outfits/preview.jpg" width="280"/><br/>
  <sub><b>Try-on outfits</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/replace-your-product/preview.jpg" width="280"/><br/>
  <sub><b>Replace your product</b></sub>
</td>
</tr>
<tr>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/branding-mockup/preview.jpg" width="280"/><br/>
  <sub><b>Branding mockup</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/analog-style-photos/preview.jpg" width="280"/><br/>
  <sub><b>Analog style</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/sports-action-photo/preview.jpg" width="280"/><br/>
  <sub><b>Sports action</b></sub>
</td>
</tr>
<tr>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/typographic-poster/preview.jpg" width="280"/><br/>
  <sub><b>Typographic poster</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/object-into-3d-illustration/preview.jpg" width="280"/><br/>
  <sub><b>Object → 3D illustration</b></sub>
</td>
<td align="center">
  <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/__pixelbin_console_assets/__ai_image_generator/templates/documentary-style-image/preview.jpg" width="280"/><br/>
  <sub><b>Documentary style</b></sub>
</td>
</tr>
</table>

---

## 🛠️ URL transformations on the same images

Every image above is served from PixelBin's CDN — meaning you can append URL transforms and the edge will render them on the fly. Try modifying any URL with:

- `~t.resize(h:280,w:280)` → resize to 280×280
- `~t.toFormat(f:webp)` → convert to WebP
- `~t.compress()` → smaller file size
- `~t.blur(s:5)` → soft blur
- `~t.rotate(a:90)` → rotate 90°
- For AI ops (background removal, upscaling, watermark removal), enable the matching plugin in your Console — or call the predictions API via the skill's scripts.

That's the PixelBin pipeline in one sentence: **upload once, transform infinitely via URL, serve via CDN.**

---

## 👉 Want this for your products?

[**Get a free PixelBin API token**](https://www.pixelbin.io/?utm_source=github&utm_medium=claude-skill&utm_campaign=showcase) and clone this skill. You'll be making your own gallery in minutes.
