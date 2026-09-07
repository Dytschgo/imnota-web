# Website imagery

The website uses real Imnota v0.2.4 renderer captures and two original GPT Image assets. Generated artwork is supporting illustration, not an app screenshot.

## GPT Image

Generated with the built-in image generation tool on 7 September 2026. Original PNGs are retained locally under `.qa/`; web copies are resized to 1536 × 864 and encoded as WebP.

- `assets/art/workspace-slate.webp`: original backdrop illustration, displayed on the Features page and used as the local demo workspace image.
- `assets/art/release-bundle.webp`: editorial release artwork on the Changelog page.

### Workspace prompt

Use case: stylized-concept. Asset type: original local desktop backdrop for the Imnota screenshot-annotation app and its website's appearance feature. Generate a wide 16:9 high-resolution landscape image: sculptural alpine ridges made of dark graphite slate, viewed obliquely from above, with a single restrained violet mineral seam tracing the contour across the lower middle. Cool charcoal and smoky blue-gray stone, fine believable mineral texture, subdued silver edge light, soft diffuse overcast illumination. Clear composed silhouettes and generous calm low-detail dark upper area so app controls remain readable. A quiet physical landscape, precise and tactile, no outer glow, no neon, no starfield, no interface, no computer, no lettering, no logo, no watermark, no captions. The image should work as an unobtrusive local workspace wallpaper in a dark desktop app. Landscape orientation.

### Release artwork prompt

Use case: ads-marketing. Asset type: public changelog release artwork for Imnota, a local screenshot annotation and prompt-bundle app. Create a wide landscape editorial still life photographed on a matte charcoal desk: three partially overlapping smoked translucent drafting sheets lying nearly flat, one sheet with a precise hand-drawn violet rectangular annotation and a violet directional arrow, another with a few abstract ruled graphite strokes representing notes, and a small brushed-metal binder clip keeping this physical bundle together. Composition grouped on the right half, generous dark negative space on the left. Off-white fine edges and a restrained violet accent against graphite. Tactile physical materials, exact clean construction, soft raking daylight, modest relief and naturally cast shadows. Quiet, technical, purposeful. No readable text, no fake software screenshot, no device mockup, no decorative geometric spheres, no gradient glow, no logo, no watermark. Wide 16:9 landscape.

## Product captures

`workbench-024.webp`, `workbench-small-024.webp`, `detail-024.webp` and `settings-024.webp` show the actual renderer at stable tag `v0.2.4`, commit `b918a6a819fd31d26470301334aa3a9ade4a4f86`. An isolated source checkout and a deterministic native bridge provide an authored example project. The screenshot inside the canvas is sample project-settings content. No private workspace is used.

`scripts/capture-stable.mjs` records these images with the isolated renderer served on port 4176. Install the tagged app's dependencies and run its Vite renderer before capture. Outputs go to `.qa/stable-capture/` for inspection before copying into `assets/screenshots/`.

The original before/after comparison and social preview remain from the original authored example. Their source capture is documented by `scripts/capture-product.mjs` and `scripts/finish-assets.mjs` at upstream commit `63ddf578141ee2114dbd24c31c36c44950f7dfc1`.

The Imnota logo and bundled app assets retain the upstream MIT license. IBM Plex Sans retains `assets/fonts/OFL.txt`.
