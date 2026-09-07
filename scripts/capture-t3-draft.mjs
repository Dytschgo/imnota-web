import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

// Serve a fresh isolated T3 Code DEV 0.0.4 instance on localhost:6041.
// This adds an unsent draft only; no provider request is made.

const root = fileURLToPath(new URL("../", import.meta.url));
const imagePath = path.join(root, ".qa/collection08-export/prompt-1.png");
const markdownPath = path.join(root, ".qa/collection08-export/prompt-1.md");
const outputPath = path.join(root, ".qa/collection08-t3/t3-composer-draft.png");
const focusedOutputPath = path.join(
  root,
  ".qa/collection08-t3/t3-composer-focused.png",
);

const markdown = await fs.readFile(markdownPath, "utf8");
const imageBytes = await fs.readFile(imagePath);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 980 },
  deviceScaleFactor: 1,
});
await context.grantPermissions(["clipboard-read", "clipboard-write"], {
  origin: "http://localhost:6041",
});
const page = await context.newPage();

try {
  await page.goto("http://localhost:6041/", { waitUntil: "networkidle" });
  const composer = page.locator('[contenteditable="true"]').last();
  await composer.waitFor({ state: "visible", timeout: 15_000 });

  // Stage one: paste text from the browser clipboard into the actual composer.
  await page.evaluate(
    async (text) => navigator.clipboard.writeText(text),
    markdown,
  );
  await composer.click();
  await page.keyboard.press("Control+V");
  await page.waitForTimeout(350);

  // Stage two: paste the image from the clipboard. T3 deliberately prevents the
  // default paste here, so Markdown and image must be added separately.
  await page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/png" });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }, imageBytes.toString("base64"));
  await composer.click();
  await page.keyboard.press("Control+V");
  await page.waitForTimeout(700);

  const visibleMarkdown = await composer.textContent();
  const imageAlts = await page
    .locator("img")
    .evaluateAll((images) => images.map((image) => image.alt));
  const imageCount = imageAlts.filter((alt) => alt === "image.png").length;
  if (!visibleMarkdown?.includes("Checkout review") || imageCount !== 1) {
    throw new Error(
      `Draft did not render as expected: markdown=${Boolean(visibleMarkdown?.includes("Checkout review"))}, imageAlts=${JSON.stringify(imageAlts)}`,
    );
  }
  await composer.evaluate((element) =>
    element.scrollTo({ top: 0, behavior: "instant" }),
  );
  const composerBox = await composer
    .locator("xpath=ancestor::form[1]")
    .boundingBox();
  if (!composerBox) {
    throw new Error(
      "Could not find the composer bezel for the focused capture.",
    );
  }
  const padding = 32;
  await page.screenshot({
    path: focusedOutputPath,
    type: "png",
    clip: {
      x: Math.max(0, composerBox.x - padding),
      y: Math.max(0, composerBox.y - padding),
      width: Math.min(832, composerBox.width + padding * 2),
      height: Math.min(420, composerBox.height + padding * 2),
    },
  });
  await page.screenshot({ path: outputPath, fullPage: true, type: "png" });
  await sharp(focusedOutputPath)
    .webp({ quality: 92 })
    .toFile(focusedOutputPath.replace(/\.png$/, ".webp"));
  console.log(
    JSON.stringify({
      outputPath,
      focusedOutputPath,
      imageCount,
      markdownChars: visibleMarkdown.length,
    }),
  );
} finally {
  await browser.close();
}
