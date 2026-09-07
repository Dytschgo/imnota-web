# Website verification

The v0.2.4 website update was verified locally on 7 September 2026. Production is https://imnota.xyz/. The release process also runs the same browser suite against that domain after deployment; raw run records are stored in ignored `.qa/` and GitHub CI records the reviewed source revision.

## Content and visuals

- The homepage, feature page and public changelog use the published stable v0.2.4 release and versioned upstream sources.
- The changelog covers five downloadable stable releases. The unpublished 0.2.3 tag is explained rather than presented as a download; Nightly builds are clearly separated.
- Real product screenshots were captured from v0.2.4 commit `b918a6a819fd31d26470301334aa3a9ade4a4f86`, with deterministic example data. The selected local GPT Image backdrop uses Balanced surfaces at 42% opacity; native Desktop glass is off.
- The screenshot capture confirms the renderer configured the local backdrop. The only upstream renderer console messages were React development warnings about spread key props. No bridge or page errors occurred.
- GPT Image created two original artworks, both saved in the repository and integrated into the site. Their full prompts and provenance are in ASSETS.md.
- Desktop and mobile captures were reviewed for the homepage, feature reference and changelog. Versioned screenshot filenames and stylesheet URLs prevent existing visitors from retaining the previous release assets.

## Automated checks

- Prettier formatting and HTML validation pass for all four HTML pages and the checked source files.
- `npm run build` creates a static-only `dist` directory. `npm run package` creates the matching archive with 24 public files, excluding dependencies, developer scripts, source checkout, documentation and repository metadata.
- The browser suite passes against `dist` served on port 4174, across 320, 768, 1024 and 1440 pixel widths for the homepage, Features and Changelog.
- Axe reports zero WCAG A/AA violations across those 12 page/viewport combinations. No horizontal overflow, broken image decode or browser runtime errors occurred.
- Installation tabs support arrow keys, Home and End. Clipboard success and denial fallbacks pass; the mobile menu, Escape handling, FAQ, reduced motion and no-JavaScript content checks pass.
- Feature/changelog navigation, fragment links, stable-release notes and no-JavaScript reference-page reading pass.
- GitHub Actions runs formatting, HTML, build and browser checks against the generated `dist` payload on PRs and pushes to `main`.

## Lighthouse mobile lab result

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
