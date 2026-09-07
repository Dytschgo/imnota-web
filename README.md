# Imnota marketing website

A static marketing site for [Imnota](https://github.com/Dytschgo/imnota), the local-first screenshot annotation desktop app. The website lives separately from the Electron application. HTML, CSS and browser JavaScript are served directly from this repository's root. No build step, Node server, analytics, tracking, CDN or external runtime dependency is required.

## Preview

```bash
python -m http.server 4173
```

Open http://localhost:4173. Reading, navigation, installation commands and FAQ work without JavaScript. JavaScript adds accessible installation tabs, clipboard feedback and mobile-menu dismissal. Fonts and images are self-hosted.

## Hostinger deployment

1. Push this website repository to GitHub on `main`.
2. In Hostinger hPanel, open the website dashboard, then **Advanced > Git**.
3. Connect GitHub, authorize this repository, select it and choose `main`.
4. Deploy the repository root to `public_html`. `index.html` is already in that root. Use a dedicated website directory because deployment can overwrite existing files there.
5. There is **no build command**. Do not run `npm install` on the host. The development dependencies only support local verification and screenshot capture. A Node.js server or Node.js Web App plan is unnecessary.
6. Enable automatic deployment in the Git settings, or configure the Hostinger webhook if that option is available on your plan. Manual **Redeploy** also pulls the selected branch.
7. Confirm the custom domain, HTTPS, favicon, Open Graph preview and mobile layout after the first deployment. Test a missing URL: `.htaccess` supplies `/404.html` on Apache/LiteSpeed hosts that permit overrides. Otherwise configure the host's custom error page to use `404.html`.

Before deployment, replace every `https://imnota.example/` occurrence in `index.html` with the actual HTTPS domain. This explicitly reserved placeholder appears in the canonical, Open Graph URL and Open Graph image URL. No production domain has been assumed.

Deployment is prepared but Hostinger is not connected by this repository. Current setup reference: [Hostinger Git deployment documentation](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/).

If migrating to a generator later, document its exact build command and deploy only its static output. Do not assume standard Git hosting builds a Node application.

## Content and asset provenance

Product claims were checked against [the upstream README at commit 63ddf578141ee2114dbd24c31c36c44950f7dfc1](https://github.com/Dytschgo/imnota/blob/63ddf578141ee2114dbd24c31c36c44950f7dfc1/README.md).

| Website content                                                          | Upstream README section               |
| ------------------------------------------------------------------------ | ------------------------------------- |
| Annotation tools, import formats, collection context, priority, exports  | Features                              |
| Accounts, cloud storage, telemetry, portable files                       | Why local-first; Privacy and security |
| Folder tree, archive/restore, source preservation, clipboard limitations | User data format                      |
| Install commands, dependencies, macOS notarisation                       | Installation; Development             |
| Desktop targets                                                          | Supported platforms                   |
| MIT licence and contribution guide                                       | Licence; Contributing                 |

`assets/logo.svg` is the original `build/icon.svg`, copied without modification from Imnota. The MIT licence is retained in `LICENSE`. IBM Plex Sans Latin regular, medium and semibold are redistributed under the included `assets/fonts/OFL.txt` licence.

The workbench images capture the actual upstream React/Konva renderer from an isolated checkout at the commit above. Its native bridge is replaced with deterministic example data for the capture only. The project settings page inside the canvas is an authored example, not a customer interface or product claim. The website labels this example content. No modified desktop app files, private projects or unrelated app backdrops are used. The Markdown excerpt follows real export vocabulary and is intentionally abbreviated. It is not a byte-for-byte export.

`scripts/capture-product.mjs` records the workbench from an isolated source checkout served by Vite on port 4175. `scripts/finish-assets.mjs` captures the annotated example using the same renderer and makes the crops and social preview. Capture tooling is optional; all deployable assets are committed. Social preview typography is rendered in HTML and captured to PNG for crawler compatibility.

## Design

Visual thesis: make the handoff between a visual idea and an AI-ready instruction tangible. Precise, focused and quietly expressive, with variance 7/10, motion 5/10 and density 5/10. Native CSS uses the Imnota palette and a 12-column desktop hero. Major surfaces use radii of 5 to 8 pixels. Asymmetric product imagery becomes a single readable composition on mobile.

The one-shot annotation line explains the transfer to Markdown and stops after drawing. Reduced motion removes it. The page remains understandable without animation or images. Green only identifies local-first information and installation copy success.

## Development checks

Node is only required for these optional checks:

```bash
npm ci
npx playwright install chromium
npm run format:check
npm run validate
# Keep the Python preview running in another terminal:
npm test
npm run audit:performance
```

Browser checks cover 320, 768, 1024 and 1440 pixel layouts, overflow, broken assets, keyboard tabs, mobile navigation, FAQ, clipboard success/failure, no-JavaScript reading, reduced motion and axe accessibility. Lighthouse reports and screenshots are written to ignored `.qa/`. See `VERIFICATION.md` for the latest recorded results and remaining deployment checks.
