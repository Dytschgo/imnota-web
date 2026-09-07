# Website imagery

The website uses real Imnota renderer captures and two original GPT Image assets. Each product capture records its source version below. Generated artwork is supporting illustration, not an app screenshot.

## GPT Image

Generated with the built-in image generation tool on 7 September 2026. Original PNGs are retained locally under `.qa/`; web copies are resized to 1536 × 864 and encoded as WebP.

- `assets/art/workspace-slate.webp`: original backdrop illustration, displayed on the Features page and used as the local demo workspace image.
- `assets/art/release-bundle.webp`: editorial release artwork on the Changelog page.

### Workspace prompt

Use case: stylized-concept. Asset type: original local desktop backdrop for the Imnota screenshot-annotation app and its website's appearance feature. Generate a wide 16:9 high-resolution landscape image: sculptural alpine ridges made of dark graphite slate, viewed obliquely from above, with a single restrained violet mineral seam tracing the contour across the lower middle. Cool charcoal and smoky blue-gray stone, fine believable mineral texture, subdued silver edge light, soft diffuse overcast illumination. Clear composed silhouettes and generous calm low-detail dark upper area so app controls remain readable. A quiet physical landscape, precise and tactile, no outer glow, no neon, no starfield, no interface, no computer, no lettering, no logo, no watermark, no captions. The image should work as an unobtrusive local workspace wallpaper in a dark desktop app. Landscape orientation.

### Release artwork prompt

Use case: ads-marketing. Asset type: public changelog release artwork for Imnota, a local screenshot annotation and prompt-bundle app. Create a wide landscape editorial still life photographed on a matte charcoal desk: three partially overlapping smoked translucent drafting sheets lying nearly flat, one sheet with a precise hand-drawn violet rectangular annotation and a violet directional arrow, another with a few abstract ruled graphite strokes representing notes, and a small brushed-metal binder clip keeping this physical bundle together. Composition grouped on the right half, generous dark negative space on the left. Off-white fine edges and a restrained violet accent against graphite. Tactile physical materials, exact clean construction, soft raking daylight, modest relief and naturally cast shadows. Quiet, technical, purposeful. No readable text, no fake software screenshot, no device mockup, no decorative geometric spheres, no gradient glow, no logo, no watermark. Wide 16:9 landscape.

## Product captures

`drawing-025.webp` and `markdown-025.webp` show the actual Imnota v0.2.5 renderer at commit `bd33da45fac5bf05f20e6cdb9f66c5db709b3bdf`. The example contains a standalone drawing and Markdown item in a shared collection. The drawing uses attached connectors and system-font labels; the Markdown preview contains an authored checkout review. Captures retain the full 1600 by 1000 application frame.

`scripts/capture-content-025.mjs` reproduces these captures with an isolated tagged renderer served on port 4177. It uses an in-memory replacement for Electron file access. It demonstrates the drawing and Markdown editors, not native on-disk persistence or export validation. The drawing editor emits upstream CSP warnings for unused remote font URLs; CSP was not relaxed and the example uses the system font. Existing 0.2.4 export and T3 examples retain their explicit version labels.

`workbench-c08.webp`, `workbench-small-c08.webp` and `settings-024.webp` show the actual renderer at stable tag `v0.2.4`, commit `b918a6a819fd31d26470301334aa3a9ade4a4f86`. An isolated source checkout and a deterministic native bridge provide an authored example project. The screenshot inside the canvas is sample project-settings content. No private workspace is used.

The current `scripts/capture-stable.mjs` records `workbench-025.webp` and `workbench-small-025.webp` with the isolated v0.2.5 renderer served on port 4177. Install the tagged app's dependencies and run its Vite renderer before capture. Outputs go to `.qa/stable-capture/` for inspection before copying into `assets/screenshots/`. The 0.2.4 captures above are retained historical assets. Current workbench captures preserve the corrected annotation geometry, 80% canvas zoom and 42% backdrop opacity.

The Collection 08 screenshots share `scripts/example-annotations.mjs`: the rectangle surrounds only Save changes, the step marker clears the label and the callout stays within the source image. `scripts/finish-assets.mjs` uses the stable renderer to produce `example-after-c08.webp` and refreshes `social-preview-c08.png`.

`prompt-export-c08.webp` is the actual stable Share prompt bundles dialog, captured with 32px surrounding padding after the renderer completed the export. `scripts/capture-prompt-export.mjs` uses the real composition pipeline with deterministic in-memory native persistence and clipboard adapters. The completed PNG and Markdown are retained unchanged as `assets/examples/prompt-1.png` and `prompt-1.md`; `prompt-1.webp` is the web preview. The dialog's Copied state comes from that adapter, not a native OS clipboard test.

`t3-draft-c08.webp` shows the actual T3 Code DEV 0.0.4 composer, from a locally staged copy of the user's T3 source. `scripts/capture-t3-draft.mjs` records it against an isolated app on port 6041. The actual exported Markdown was pasted from the browser clipboard, then the actual PNG was pasted separately. This T3 version suppresses text paste when image files are present, so the page explicitly describes the two-paste fallback. No prompt was sent and no private project state was used. The focused screenshot retains 32px around the full composer bezel; only its scroll position was adjusted, not its UI styles.


The Imnota logo and bundled app assets retain the upstream MIT license. IBM Plex Sans retains `assets/fonts/OFL.txt`.
