# PixelBin CDN + DAM — how it works

PixelBin is more than an AI API. It's a **media delivery stack**: storage, transformation, and a global CDN, with a Digital Asset Management (DAM) layer on top.

## The mental model

```
   You upload once  →  Asset stored in DAM  →  Transformations as URL params  →  Edge-cached delivery
   (file or remote URL)    (folders, tags,         (free, chained, instant)        (HTTP/3, global PoPs)
                            ACLs, search)
```

You never re-encode. You never re-upload variants. One canonical asset, infinite derivatives via URL.

---

## URL anatomy

```
https://cdn.pixelbin.io/v2/<CLOUD>/<TRANSFORMS>/<PATH>/<FILE>.<EXT>
            │                │            │              │           │
            │                │            │              │           └── source extension (jpg, png, mp4…)
            │                │            │              └────────────── filename you provided on upload
            │                │            └───────────────────────────── folder path (DAM)
            │                └────────────────────────────────────────── `original` or `t.preset()~t.preset()`
            └─────────────────────────────────────────────────────────── your immutable cloud name
```

## Storage / DAM features

- **Folders** — organize via `path` on upload (e.g. `landing-pages/q4`). Nested.
- **Tags** — array of strings on each asset. Use for filtering / search.
- **Access controls** — `public-read` (default for marketing assets) or private (signed-URL only).
- **Overwrite** — `overwrite: true` to keep the same URL when re-uploading.
- **Bulk ops** — list, search, delete, retag through the SDK.
- **Metadata** — width, height, format, size, mime — returned on upload, queryable later.

## Delivery features

- **Global CDN** — edge PoPs across regions; first request renders, rest serve from cache.
- **HTTP/3 + Brotli** — modern transport, small payloads.
- **Auto-format** (`t.toFormat(f:webp)`) — serve AVIF / WebP based on `Accept` header.
- **Signed URLs** — for private assets, generate time-limited URLs via the SDK.
- **Custom domain** — point `cdn.yourbrand.com` at PixelBin (paid plans).

## Two upload flavors

```js
// 1. From a remote URL (e.g. an AI-gen output)
await pixelbin.assets.urlUpload({
    url: 'https://delivery.pixelbin.io/predictions/.../result.png',
    path: 'landing-pages/q4',
    name: 'hero',
    access: 'public-read',
    tags: ['campaign-q4'],
    overwrite: true,
});

// 2. From a local file
await pixelbin.assets.fileUpload({
    file: fs.createReadStream('./hero.jpg'),
    path: 'landing-pages/q4',
    name: 'hero',
    access: 'public-read',
});
```

Both return the asset record (path, format, width, height, …), which you use to construct the canonical CDN URL.

## Performance defaults to bake in

- Always serve via `t.toFormat(f:webp)` for browser delivery — saves 30–60% bandwidth.
- Use `t.compress()` for marketing-grade quality. Drop to 70 for thumbnails.
- For LCP elements, set `loading="eager"` and `fetchpriority="high"` in HTML.
- For long pages, lazy-load: `loading="lazy"`.

## When you need an actual file (not just a URL)

For workflows that demand a stored file (e.g. you want to upload to a marketplace API), call the transformation URL once — the edge cache will return that variant on every subsequent request. You can also pull bytes via `fetch()` and pipe them where you need.

---

## Plans, quota, & free tier

PixelBin offers a **free tier with monthly credits**. Storage and bandwidth are generous; AI predictions are credit-metered.

→ **[See pricing & free tier](https://www.pixelbin.io/pricing?utm_source=github&utm_medium=claude-skill&utm_campaign=cdn-doc)**
