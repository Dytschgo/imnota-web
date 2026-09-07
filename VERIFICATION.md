# Website verification

The v0.2.4 website update was verified locally on 7 September 2026. Production is https://imnota.xyz/. The release process also runs the same browser suite against that domain after deployment; raw run records are stored in ignored `.qa/` and GitHub CI records the reviewed source revision.

## Collection 08 corrections

- Annotation source geometry is shared across captures. Save changes has a fitted rectangle, a clear step marker and a callout fully inside the image.
- The connector follows actual element bounds; its dots stay within the figure. Tablet and mobile layouts place the handoff card below the screenshot so it cannot obscure the callout.
- The homepage now includes the real export dialog, unchanged renderer-produced PNG/Markdown downloads and a real unsent T3 Code draft. T3 uses two separate clipboard pastes, explicitly described on the page.
- New browser assertions check connector bounds/card overlap at all four viewport sizes and confirm both downloadable artifacts respond successfully. Full-page visual review includes the export and T3 examples.
- Recovery baseline remains `.qa/imnota-web_20260907_215035.zip`. The Collection 08 payload is `.qa/imnota-web_20260907_221809.zip`, SHA-256 `2865a1bbbbdad28c9f650cd5649f6457528bfcf54e9c0cf69d4390f6ca93e83e`.

## Content and visuals

- The homepage, feature page and public changelog use the published stable v0.2.4 release and versioned upstream sources.
- The changelog covers five downloadable stable releases. The unpublished 0.2.3 tag is explained rather than presented as a download; Nightly builds are clearly separated.
- Real product screenshots were captured from v0.2.4 commit `b918a6a819fd31d26470301334aa3a9ade4a4f86`, with deterministic example data. The selected local GPT Image backdrop uses Balanced surfaces at 42% opacity; native Desktop glass is off.
- The screenshot capture confirms the renderer configured the local backdrop. The only upstream renderer console messages were React development warnings about spread key props. No bridge or page errors occurred.
- GPT Image created two original artworks, both saved in the repository and integrated into the site. Their full prompts and provenance are in ASSETS.md.
- Desktop and mobile captures were reviewed for the homepage, feature reference and changelog. Versioned screenshot filenames and stylesheet URLs prevent existing visitors from retaining the previous release assets.

## Automated checks

- Prettier formatting and HTML validation pass for all four HTML pages and the checked source files.
- `npm run build` creates a static-only `dist` directory. `npm run package` creates the matching archive with 28 public files, excluding dependencies, developer scripts, source checkout, documentation and repository metadata.
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
