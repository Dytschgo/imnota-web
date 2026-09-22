# Website verification

Production is https://imnota.xyz/. The release process runs browser checks locally and against that domain after deployment; raw run records are stored in ignored `.qa/` and GitHub CI records the reviewed source revision.

## Motion and generated artwork, 22 September 2026

- Added finite viewport entrances for the product preview, annotation comparison, workflow steps, release artwork, release highlights and page headings. Feature rows and download tiles respond to hover and keyboard focus. The existing scroll-driven handoff diagram is preserved.
- New native Web Animations pause while their scene is offscreen or the document is hidden. Reduced motion and Save-Data cancel the animations and restore the complete static presentation. Finished animation segments are not restarted when a partially completed scene resumes. No animation library or continuous rendering loop was added.
- Generated a conceptual graphite-glass and vellum illustration with the built-in ChatGPT Image tool. Responsive WebP files are 52 KB and 11 KB; the exact prompt and source path are in ASSETS.md. The actual 0.2.8 guide remains available below the artwork and opens its original PNG.
- The production-build browser suite passes all 20 page/viewport combinations with zero axe violations, overflow or runtime errors. Motion checks cover finite hero timing, annotation completion, offscreen pause/resume, live reduced-motion cancellation, Save-Data and no-JavaScript visibility. The guide link and completed artwork animation were also exercised at a 390-pixel viewport.
- Inspected the new composition at desktop, tablet and mobile widths, plus a frame during animation. Final local simulated-mobile Lighthouse scores are Performance 98, Accessibility 100, Best Practices 100 and SEO 100; LCP 2.4 s, CLS 0 and total blocking time 50 ms. This is a lab sample, not field performance or a measured smoothness claim on physical mobile hardware.
- Formatting, HTML validation and production build passed before release; `http://localhost:4173` served the local preview.
- Published through [PR #9](https://github.com/Dytschgo/imnota-web/pull/9), merged as `9f1cac9b8cbb758064f0db44a98793f528dac7f1`. Hostinger's Git deployment completed successfully from that commit. Cleared the Hostinger/CDN cache after the first production requests exposed stale cached content.
- Verified the live homepage, Features, Changelog, Install, drawing screenshot, generated artwork, robots.txt and sitemap over HTTPS; the nested missing-page check returned 404. `npm test` against `https://imnota.xyz` passed all 20 page/viewport combinations with zero axe violations, overflow or runtime errors.

## Stable 0.2.8 update, 22 September 2026

- Verified the live GitHub latest release as `v0.2.8`, published 20 September 2026 at 18:49 UTC. The annotated tag resolves to commit `822bd7e43cd03d3093869670961a1ec6759f1645`. All seven installer links across the homepage and installation page match published assets, including the version-independent Mac alias.
- Added the missing 0.2.7 and 0.2.8 changelog entries. Updated current downloads, structured version metadata, features, agent handoff guidance, `llms.txt`, macOS 13+ compatibility and Node.js 22.13+ source-build requirements. The tagged CHANGELOG.md stops at 0.2.7, so the 0.2.8 summary uses published release notes, tagged user documentation and implementation. Windows multi-display capture and copy preferences were checked against code because portions of the guide describe earlier behavior.
- Added the homepage release announcement, framed built-in guide image, latest-release summary and clearer download tiles. Preserved the existing visual identity and finite motion. Image provenance and the retained historical screenshot versions are recorded in ASSETS.md.
- Formatting, HTML validation and the production build pass. Browser checks against `dist` pass across all five content pages at 320, 768, 1024 and 1440 pixels: 20 page/viewport combinations with no axe violations or horizontal overflow. Keyboard navigation, installation tabs, clipboard success and denial, mobile menu, FAQ, downloads and analytics, release anchors, reduced motion, Save-Data, no-JavaScript reading and image loading pass without runtime errors.
- Inspected the rendered desktop homepage, release spotlight, changelog and installation page, plus narrow mobile and tablet layouts. Corrected the guide image link's accessible name after Lighthouse's additional label-matching check flagged it; the focused axe check and full-size image navigation pass after correction.
- Final local simulated-mobile Lighthouse result: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 2.5 s, CLS 0 and total blocking time 0 ms. The remaining opportunities concern image sizing, CSS delivery and caching/compression on the local Python server. These are lab results, not production field measurements.
- Pre-publication source revision: `a562c4b`. The content and motion refinements are now published together in PR #9 above. Raw local reports and screenshots remain in ignored `.qa/`.

## Stable 0.2.6 update

- Checked the published stable release on 9 September 2026, tag `v0.2.6`, commit `05fd5a5`, against its tagged changelog and sharing user guide. All three installer filenames match published assets.
- Updated homepage release highlights, Features, Changelog, Installation, structured version metadata and `llms.txt`. Corrected the upload FAQ to distinguish offline work from optional hosted sharing.
- Added two built-in ChatGPT Image illustrations with prompts and paths in ASSETS.md. Actual renderer captures remain explicitly labelled 0.2.5.
- Formatting, HTML validation and production build pass. The browser suite passes on the production build at 320, 768, 1024 and 1440 pixels with zero axe violations, overflow or runtime errors. Navigation, historic and current changelog entries, download analytics, keyboard, clipboard fallbacks, motion and no-JavaScript checks pass.
- Inspected the rendered release highlight at desktop and mobile sizes, plus the appearance section and changelog banner. Recovery source baseline: `73cb68b`.

## Stable 0.2.5 update

- Latest stable tag `v0.2.5` resolves to `bd33da45fac5bf05f20e6cdb9f66c5db709b3bdf`, published on 7 September 2026 at 21:55 UTC. The Windows installer, universal Mac ZIP and Linux AppImage links match its published assets.
- Homepage highlights, the feature list and the new changelog entry cover standalone drawings, Markdown editing/preview, shared collection order, autosave, mixed-content exports and Markdown-only exports. The schema 4 upgrade and retained schema 3 backup are explained at installation and in release notes.
- Real tagged editor captures demonstrate the new content types. Historical export and T3 examples keep their original version labels. Their native filesystem/clipboard limitations remain documented in ASSETS.md.
- The existing SVG motion and responsive checks remain part of the release suite. New assertions check six stable changelog entries, the 0.2.5 upgrade/export notes and all three current download URLs.
- Recovery baseline is `753ad0cb239afb09e6c53dca9e5173114f032f40`, archive `.qa/imnota-web_20260907_224214.zip`, SHA-256 `9f7ba12da0335983de914c046844b86a8432553e87edd5635a8336befc45f1eb`.

## SVG motion update

- The headline uses a finite SVG annotation drawing. The workflow illustration follows native scroll position and reverses when scrolling back; phone layouts use a vertical illustration with readable labels.
- Motion uses native SVG/CSS and a throttled animation frame, with no new dependency. Real screenshots and the Collection 08 connector geometry remain intact.
- Dedicated browser checks verify finite animation, visible route drawing, forward/reverse scroll, live reduced-motion changes, Save-Data and no-JavaScript fallbacks. The full page suite passes at 320, 768, 1024 and 1440 pixels with zero axe violations, overflow or runtime errors.
- Desktop and mobile drawings were inspected during animation and at rest. A local simulated-mobile Lighthouse run reports Performance 97, Accessibility 100, Best Practices 100 and SEO 100; LCP 2.4s, CLS 0 and total blocking time 0ms. These are lab measurements, not production field data.
- Recovery baseline is Collection 08 at `5b0468f3c5754998b8d016fb7250ac820fe0371f`, with archive `.qa/imnota-web_20260907_222211.zip`, SHA-256 `10c7587dfa811d7df20de1806fc3133639f0a0295f7d7df8baee526ceb9547a6`.

## Collection 08 corrections

- Annotation source geometry is shared across captures. Save changes has a fitted rectangle, a clear step marker and a callout fully inside the image.
- The connector follows actual element bounds; its dots stay within the figure. Tablet and mobile layouts place the handoff card below the screenshot so it cannot obscure the callout.
- The homepage now includes the real export dialog, unchanged renderer-produced PNG/Markdown downloads and a real unsent T3 Code draft. T3 uses two separate clipboard pastes, explicitly described on the page.
- New browser assertions check connector bounds/card overlap at all four viewport sizes and confirm both downloadable artifacts respond successfully. Full-page visual review includes the export and T3 examples.
- Recovery baseline remains `.qa/imnota-web_20260907_215035.zip`. The Collection 08 payload is `.qa/imnota-web_20260907_221809.zip`, SHA-256 `2865a1bbbbdad28c9f650cd5649f6457528bfcf54e9c0cf69d4390f6ca93e83e`.

## Content and visuals

- The hero uses a straight selection frame with four square handles, replacing the decorative cursor, dot and doubled underline. Its 600 ms reveal settles once; reduced-motion, Save-Data and no-JavaScript views show the complete static frame. Desktop, tablet and mobile captures were inspected after this correction.
- The homepage, feature page and public changelog use the published stable v0.2.5 release and versioned upstream sources.
- The changelog covers six downloadable stable releases. The unpublished 0.2.3 tag is explained rather than presented as a download; Nightly builds are clearly separated.
- Current workbench, drawing and Markdown screenshots were captured from v0.2.5 commit `bd33da45fac5bf05f20e6cdb9f66c5db709b3bdf`, with deterministic example data. Retained 0.2.4 captures originate from `b918a6a819fd31d26470301334aa3a9ade4a4f86`. The workbench's local GPT Image backdrop uses Balanced surfaces at 42% opacity; native Desktop glass is off.
- The workbench capture confirms the renderer configured the local backdrop. Its only upstream renderer console messages were React development warnings about spread key props. No bridge or page errors occurred. The drawing capture's unused remote-font CSP warnings are documented in ASSETS.md.
- GPT Image created two original artworks, both saved in the repository and integrated into the site. Their full prompts and provenance are in ASSETS.md.
- Desktop and mobile captures were reviewed for the homepage, feature reference and changelog. Versioned screenshot filenames and stylesheet URLs prevent existing visitors from retaining the previous release assets.

## Automated checks

- Prettier formatting and HTML validation pass for all four HTML pages and the checked source files.
- `npm run build` creates a static-only `dist` directory. `npm run package` creates the matching archive with 32 public files, excluding dependencies, developer scripts, source checkout, documentation and repository metadata.
- The browser suite passes against `dist` served on port 4174, across 320, 768, 1024 and 1440 pixel widths for the homepage, Features and Changelog.
- Axe reports zero WCAG A/AA violations across those 12 page/viewport combinations. No horizontal overflow, broken image decode or browser runtime errors occurred.
- Installation tabs support arrow keys, Home and End. Clipboard success and denial fallbacks pass; the mobile menu, Escape handling, FAQ, reduced motion and no-JavaScript content checks pass.
- Feature/changelog navigation, fragment links, stable-release notes and no-JavaScript reference-page reading pass.
- GitHub Actions runs formatting, HTML, build and browser checks against the generated `dist` payload on PRs and pushes to `main`.

## Previous v0.2.4 Lighthouse mobile lab result

| Category or metric       | Result |
| ------------------------ | ------ |
| Performance              | 98     |
| Accessibility            | 100    |
| Best practices           | 100    |
| SEO                      | 100    |
| Largest contentful paint | 2.3 s  |
| Cumulative layout shift  | 0      |
| Total blocking time      | 0 ms   |
| Speed index              | 1.2 s  |

These are local simulated mobile measurements, not production field measurements. Remaining opportunities are smaller image delivery, CSS minification, compression and cache behavior. INP requires field data. Fonts are self-hosted; rendering requires no external service.

## Release and recovery

The deployment workflow is documented in README.md. Publication requires independent review, passing final checks, and verification of the exact target `imnota.xyz`. Verify HTTPS, the two new pages, asset content, sitemap, canonical/OG URLs, and a nonexistent nested URL after Hostinger finishes deploying. API acceptance alone is not completion.

The v0.2.4 archive is `.qa/imnota-web_20260907_215035.zip`, SHA-256 `197a3e1e32da442082faf29ca3e6fde82e156a47d96c21d0c162554c461cf545`.

The previous published archive `.qa/imnota-web_20260907_134926.zip` is retained for recovery. Normal rollback uses a reviewed revert PR on `main`; emergency archive recovery must be reconciled with GitHub before subsequent auto-deployment. Search indexing, third-party social-preview caches and native desktop glass behavior are outside the website browser checks.
