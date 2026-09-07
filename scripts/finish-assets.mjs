import { annotations } from "./example-annotations.mjs";
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto("http://127.0.0.1:4176");
const example = {
  annotations,
  dataUrl: `data:image/webp;base64,${(await readFile("assets/screenshots/example-before.webp")).toString("base64")}`,
};
const annotated = await page.evaluate(async ({ dataUrl, annotations }) => {
  const { renderAnnotatedImageWithDimensions } =
    await import("/src/renderer/export-image.ts");
  return renderAnnotatedImageWithDimensions(
    { filename: "example.png", dataUrl, width: 960, height: 600 },
    annotations,
    { margin: 0 },
  );
}, example);
await sharp(Buffer.from(annotated.dataUrl.split(",")[1], "base64"))
  .resize(960, 600)
  .webp({ quality: 90 })
  .toFile("assets/screenshots/example-after-c08.webp");
await page.goto("http://127.0.0.1:4173");
await page.setContent(
  `<!doctype html><html lang="en"><meta charset="utf-8"><style>@font-face{font-family:Plex;src:url(http://127.0.0.1:4173/assets/fonts/plex-semibold.woff2)}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#0b0d12;color:#f4f5f7;font-family:Plex,Arial;overflow:hidden;padding:50px 60px}.brand{display:flex;align-items:center;gap:12px;font-size:28px}.brand img{width:46px;height:46px}h1{position:relative;z-index:2;font-size:64px;line-height:1.04;letter-spacing:-3px;width:620px;margin:44px 0 28px}.line{border-bottom:3px solid #6857f5}p{font:21px Arial;color:#b3bac8;position:relative;z-index:2}.shot{position:absolute;left:665px;top:210px;width:480px;height:300px;object-fit:contain;border:2px solid #6857f5;border-radius:8px;transform:none}.foot{position:absolute;bottom:48px;left:60px;font:17px Arial;color:#b3bac8}</style><div class="brand"><img src="http://127.0.0.1:4173/assets/logo.svg" alt="">Imnota</div><h1>Screenshots that<br>AI <span class="line">understands.</span></h1><p>Annotate. Add context. Copy a prompt bundle.</p><img class="shot" src="http://127.0.0.1:4173/assets/screenshots/example-after-c08.webp" alt=""><div class="foot">Local-first desktop app. Open source. No account required.</div></html>`,
);
await page.evaluate(() => document.fonts.ready);
await page.locator(".shot").evaluate((img) => img.decode());
await page.screenshot({ path: "assets/social-preview-c08.png" });
await browser.close();
