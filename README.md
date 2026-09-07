# Imnota marketing website

A static marketing site for [Imnota](https://github.com/Dytschgo/imnota), the local-first screenshot annotation desktop app. The website lives separately from the Electron application. HTML, CSS and browser JavaScript are served directly from this repository's root. A small build step copies public files for deployment. No Node server, analytics, tracking or external runtime dependency is required.

## Preview

```bash
python -m http.server 4173
```

Open http://localhost:4173. Reading, navigation, installation commands and FAQ work without JavaScript. JavaScript adds accessible installation tabs, clipboard feedback and mobile-menu dismissal. Fonts and images are self-hosted.

## Hostinger deployment

Production domain: https://imnota.xyz/. GitHub repository: `Dytschgo/imnota-web`.

The intended normal workflow is a reviewed PR, passing GitHub Actions checks, merge to `main`, then Hostinger Git auto-deployment. The check workflow runs on PRs and pushes to `main`. Hostinger does not commit local changes to GitHub.

The dependency-free `npm run build` copies only public files to `dist`: all four HTML pages, CSS, browser JavaScript, robots/sitemap, `.htaccess`, licensed assets and `LICENSE`. It rejects symlinked inputs. Development scripts, Git metadata and dependencies stay outside the published payload. The app has no server entry file.

Hostinger build settings for this workflow:

| Setting           | Value                                      |
| ----------------- | ------------------------------------------ |
| Framework         | Other                                      |
| Node version      | 24                                         |
| Package manager   | npm                                        |
| Root directory    | Repository root (`.`)                      |
| Build command     | `npm run build` (API script name: `build`) |
| Output directory  | `dist`                                     |
| Entry file        | None                                       |
| Deployment branch | `main`                                     |

For a manual recovery package, run `npm run package`. This builds the site and prints a timestamped ZIP path and SHA-256 under `.qa/`. Deploy the ZIP using Hostinger MCP `hosting_deployStaticWebsite`, domain `imnota.xyz`. Keep the previous working archive. An archive replacement is a recovery path; reconcile GitHub before resuming normal auto-deployment.

After publishing, verify the homepage, `/features.html`, `/changelog.html`, HTTPS, assets, canonical/OG metadata, sitemap, and a nonexistent nested URL. Run the browser suite against production in PowerShell:

```powershell
$env:SITE_URL = 'https://imnota.xyz'
npm test
Remove-Item Env:SITE_URL
```

To roll back normal Git deployment, revert the release commit through a reviewed PR and let Hostinger deploy the resulting `main`. Do not force-push. See `VERIFICATION.md` for the last observed deployment, checks and any unverified settings.

## Content and asset provenance

The homepage, feature list and public changelog reflect stable [Imnota v0.2.4](https://github.com/Dytschgo/imnota/releases/tag/v0.2.4), commit `b918a6a819fd31d26470301334aa3a9ade4a4f86`. Claims were checked against its versioned README, user guide, changelog and published release notes. The changelog lists downloadable stable releases only. The unpublished 0.2.3 tag and Nightly previews are not listed as stable releases.

Product images show the actual tagged React/Konva renderer with deterministic example data. GPT Image created the workspace backdrop and release artwork. Image prompts, provenance, licenses and capture instructions are in [ASSETS.md](ASSETS.md).

## Design

Visual thesis: make the handoff between a visual idea and an AI-ready instruction tangible. Precise, focused and quietly expressive, with variance 7/10, motion 5/10 and density 5/10. Native CSS uses the Imnota palette and a 12-column desktop hero. Major surfaces use radii of 5 to 8 pixels. Asymmetric product imagery becomes a single readable composition on mobile.

The one-shot annotation line explains the transfer to Markdown and stops after drawing. Reduced motion removes it. The page remains understandable without animation or images. Green identifies local-first information, stable-release status and installation copy success.

## Development checks

Node 24 is used for publishing and verification:

```bash
npm ci
npx playwright install chromium
npm run format:check
npm run validate
npm run build
# Keep the Python preview running in another terminal:
npm test
npm run audit:performance
```

Browser checks cover 320, 768, 1024 and 1440 pixel layouts, overflow, broken assets, keyboard tabs, mobile navigation, FAQ, clipboard success/failure, no-JavaScript reading, reduced motion and axe accessibility. Lighthouse reports and screenshots are written to ignored `.qa/`. See `VERIFICATION.md` for the latest recorded results and remaining deployment checks.
