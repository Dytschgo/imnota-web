# Website verification

Published to https://imnota.xyz/ through the Hostinger MCP on 7 September 2026. The full browser suite passed both locally and against the live HTTPS site. Local preview used `python -m http.server 4173`.

## Automated checks

- HTML Validate: `index.html` and `404.html` pass the recommended rules.
- Playwright: 320, 768, 1024 and 1440 pixel widths pass overflow, heading, asset-loading and visible-copy checks.
- Axe: zero WCAG A/AA violations at all four widths.
- Keyboard: installation tabs support arrow keys, Home, End and normal tab focus; native FAQ and mobile menu toggle with Enter; Escape closes the menu.
- Clipboard: all three command blocks copy their exact contents and show success. Denied access selects the text and explains manual copying. Windows clipboard line endings are normalized only in the test comparison.
- Progressive enhancement: all installation commands and core links remain available without JavaScript. Native accordions remain functional. Images-disabled reading has no horizontal overflow.
- Reduced motion: the handoff animation is removed and smooth scrolling is disabled.
- No browser runtime errors or broken images/fonts in the checked layouts.
- No visible em dash or en dash in the page text.
- Manual-build fragment links activate the correct panel, including direct initial navigation.
- The standalone 404 page renders correctly. A nonexistent nested production URL returns HTTP 404 with the custom page.

## Lighthouse mobile lab result

| Category or metric       | Result |
| ------------------------ | ------ |
| Performance              | 99     |
| Accessibility            | 100    |
| Best practices           | 100    |
| SEO                      | 100    |
| Largest contentful paint | 2.1 s  |
| Cumulative layout shift  | 0      |
| Total blocking time      | 0 ms   |
| Speed index              | 1.1 s  |

These are simulated mobile measurements against the local Python server, not field measurements or a guarantee of production scores. INP requires real interaction/field measurement; total blocking time is reported instead. Optional font display and preloading prevent late font replacement from shifting content. Slow first visits may use the system sans fallback.

Remaining Lighthouse opportunities concern image delivery, unminified readable CSS, cache headers and compression. The Python preview does not provide production caching or compression. Assets are small, self-hosted WebP images and Latin WOFF2 font subsets. No external requests are needed to render the page.

## Visual and content review

Reviewed full-page desktop and mobile captures, the hero, installation controls and social preview. The primary install and GitHub actions are visible before the product image. The real renderer capture, collection rail, annotations, inspector and adjacent Markdown excerpt explain the handoff without video. The before/after pair uses the same authored example screen. Detailed asset and claim provenance is recorded in README.md.

The GitHub source capture uses an isolated copy of upstream commit `63ddf578141ee2114dbd24c31c36c44950f7dfc1`. Existing uncommitted desktop app work was neither changed nor included.

## Production verification

- Hostinger accepted the static archive deployment; subsequent file inventory and live HTTP checks confirmed the update.
- Canonical and Open Graph URLs use `https://imnota.xyz/`; `robots.txt` advertises the matching sitemap.
- All 18 public files tested over HTTPS returned HTTP 200. Non-raster response bytes match local files. Raster images match decoded pixels; Hostinger adds metadata/re-encodes the social PNG without changing its pixels.
- HTTP redirects to HTTPS with status 301. A nonexistent nested URL returns the custom page with status 404.
- The full production browser suite passes at 320, 768, 1024 and 1440 pixel widths with zero axe violations and no runtime errors. Installation tabs, keyboard navigation, clipboard success/failure, mobile menu, no-JavaScript reading and reduced motion pass.
- The deployed inventory contains only the public package. Development dependencies, scripts and repository documentation were removed by the static deployment.
- Terra independently reviewed the website. Sol independently reviewed the final archive and deployment/recovery plan before publication. The placeholder metadata finding was resolved.

Published archive: `.qa/imnota-web_20260907_134926.zip`, SHA-256 `6f3deb88301b3892aef99fc5fa7e5de7fa2b29e2fdc4770f0623e4da5ff21ace`.

The prior static site is retained locally as `.qa/imnota-baseline-7206ac1.zip` for recovery. It includes the prior placeholder metadata, so use the published archive above for a recovery that preserves the final domain configuration. Redeploy a retained archive with `hosting_deployStaticWebsite`; see README.md for the packaging workflow.

Raw reports and review screenshots are generated under ignored `.qa/`. Production file checks are recorded in `.qa/production-verification.json`; browser results are in `.qa/check-results.json`, with the local run retained as `.qa/local-check-results.json`. Lighthouse scores above are local lab measurements. External social platforms' cached previews and search indexing were not measured. Git automatic deployment was not configured by this archive deployment.
