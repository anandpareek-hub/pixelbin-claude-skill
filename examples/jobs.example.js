/**
 * Example image-generation jobs.
 * Save as jobs.json (JSON, not JS) and pass to generate-image.js:
 *   node scripts/generate-image.js --jobs ./examples/jobs.example.json
 */
module.exports = [
    {
        key: 'headphones-hero',
        prompt: 'sleek wireless over-ear headphones product hero shot, studio lit, soft pastel pink gradient backdrop, e-commerce magazine quality',
        aspect_ratio: '1:1',
        output_resolution: '2K',
    },
    {
        key: 'sneaker-side-angle',
        prompt: 'minimalist white sneaker, side angle, floating on light beige seamless backdrop, soft contact shadow, premium e-commerce hero',
        aspect_ratio: '4:5',
        output_resolution: '2K',
    },
    {
        key: 'watch-flat-lay',
        prompt: 'luxury analog wristwatch with stainless-steel case and black leather strap, flat lay, charcoal seamless backdrop, soft top-key lighting, dial visible',
        aspect_ratio: '1:1',
        output_resolution: '2K',
    },
    {
        key: 'sunglasses-product',
        prompt: 'matte-black acetate sunglasses, three-quarter angle, soft daylight backdrop in muted sage green, magazine-quality product photo',
        aspect_ratio: '1:1',
        output_resolution: '2K',
    },
];
