# Website verification

Verified locally on 7 September 2026 with the static files served by `python -m http.server 4173`. The website is ready to connect to Hostinger; no Hostinger deployment has been performed.

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
- The standalone 404 page renders correctly. Apache/LiteSpeed error routing remains a hosting-side check.

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

## Owner's deployment follow-up

1. Connect `Dytschgo/imnota-web`, branch `main`, to the Hostinger site and deploy the repository root.
2. Supply the final domain so the explicit `https://imnota.example/` canonical and Open Graph placeholders can be replaced.
3. Verify HTTPS, production asset loading, clipboard permission, favicon, social crawler image and the 404 response after deployment.

Raw reports and review screenshots are generated under ignored `.qa/`. Run the documented checks to reproduce them.
