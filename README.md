# Imnota marketing website

A static marketing site for [Imnota](https://github.com/Dytschgo/imnota), the local-first screenshot annotation desktop app. The website lives separately from the Electron application. HTML, CSS and browser JavaScript are served directly from this repository's root. No build step, Node server, analytics, tracking, CDN or external runtime dependency is required.

## Preview

```bash
python -m http.server 4173
```

Open http://localhost:4173. Reading, navigation, installation commands and FAQ work without JavaScript. JavaScript adds accessible installation tabs, clipboard feedback and mobile-menu dismissal. Fonts and images are self-hosted.

## Hostinger deployment

Production domain: https://imnota.xyz/.

Create the ready-to-serve static archive:

```bash
python scripts/package-site.py
```

The script writes a timestamped ZIP and prints its SHA-256 under ignored `.qa/`. It includes only HTML, CSS, browser JavaScript, crawler files, `.htaccess`, licensed assets and `LICENSE`. Development dependencies, source-capture scripts, Git metadata and internal reports are excluded. No build command, `npm install` or Node server is needed on the host.

Deploy that archive with the Hostinger MCP `hosting_deployStaticWebsite` tool, using `imnota.xyz` as the domain and the printed absolute ZIP path as `archivePath`. The tool uploads and extracts it directly. Deployment replaces the site's existing contents, so retain the previous working archive for recovery and confirm the domain before deploying. To roll back, deploy the retained archive to the same domain.

After deployment, check HTTPS, canonical and Open Graph URLs, assets, installation controls, and a nonexistent nested URL. `.htaccess` configures the custom `/404.html` response on Apache/LiteSpeed. Run the full browser suite against production from PowerShell:

```powershell
$env:SITE_URL = 'https://imnota.xyz'
npm test
Remove-Item Env:SITE_URL
```

The production URL is set in `index.html`, `robots.txt` and `sitemap.xml`. If the domain changes, update all three before packaging. This archive workflow does not configure Git automatic deployment. See `VERIFICATION.md` for observed deployment checks.

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
