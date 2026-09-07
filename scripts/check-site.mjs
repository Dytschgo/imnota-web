import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const baseURL = (process.env.SITE_URL || "http://127.0.0.1:4173").replace(
  /\/$/,
  "",
);
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const results = [];
for (const width of [320, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) => {
        img.loading = "eager";
        return img.decode();
      }),
    ),
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    `Overflow at ${width}`,
  );
  assert.equal(
    await page
      .locator("body")
      .innerText()
      .then((text) => /[\u2013\u2014]/.test(text)),
    false,
    "Visible dash",
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    `Accessibility at ${width}`,
  );
  await page.screenshot({ path: `.qa/desktop-${width}.png`, fullPage: true });
  results.push({
    width,
    overflow: false,
    axeViolations: axe.violations.length,
  });
}
await page.locator("#tab-unix").focus();
await page.keyboard.press("ArrowRight");
assert.equal(
  await page.locator("#tab-windows").getAttribute("aria-selected"),
  "true",
);
await page.keyboard.press("End");
assert.equal(await page.locator("#install-manual").isVisible(), true);
await page.keyboard.press("Home");
await page.locator('[data-copy="command-unix"]').click();
assert.equal(
  (await page.evaluate(() => navigator.clipboard.readText())).replace(
    /\r\n/g,
    "\n",
  ),
  await page.locator("#command-unix").textContent(),
);
assert.equal(
  await page.locator('[data-copy="command-unix"]').textContent(),
  "Copied!",
);
await page.locator("#tab-windows").click();
await page.locator('[data-copy="command-windows"]').click();
assert.equal(
  (await page.evaluate(() => navigator.clipboard.readText())).replace(
    /\r\n/g,
    "\n",
  ),
  await page.locator("#command-windows").textContent(),
);
await page.locator("#tab-manual").click();
await page.locator('[data-copy="command-manual"]').click();
assert.equal(
  (await page.evaluate(() => navigator.clipboard.readText())).replace(
    /\r\n/g,
    "\n",
  ),
  await page.locator("#command-manual").textContent(),
);
await page.evaluate(() =>
  Object.defineProperty(navigator.clipboard, "writeText", {
    value: async () => {
      throw new Error("Denied");
    },
  }),
);
await page.locator('[data-copy="command-manual"]').click();
assert.match(await page.locator("#copy-status").textContent(), /unavailable/);
await page.locator(".faq-list summary").first().focus();
await page.keyboard.press("Enter");
assert.equal(
  await page.locator(".faq-list details").first().getAttribute("open"),
  "",
);
await page.setViewportSize({ width: 320, height: 740 });
await page.locator(".mobile-menu summary").focus();
await page.keyboard.press("Enter");
assert.equal(await page.locator(".mobile-menu").getAttribute("open"), "");
await page.keyboard.press("Escape");
assert.equal(await page.locator(".mobile-menu").getAttribute("open"), null);
await page.emulateMedia({ reducedMotion: "reduce" });
assert.equal(
  await page
    .locator(".handoff-line path")
    .evaluate((el) => getComputedStyle(el).animationName),
  "none",
);
await page.goto(`${baseURL}/#install-manual`);
assert.equal(await page.locator("#install-manual").isVisible(), true);
assert.deepEqual(errors, []);
const nojs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 320, height: 740 },
});
const plain = await nojs.newPage();
await plain.goto(baseURL);
for (const id of ["unix", "windows", "manual"])
  assert.equal(await plain.locator(`#install-${id}`).isVisible(), true);
assert.equal(await plain.locator(".copy-button:visible").count(), 0);
await plain.locator(".faq-list summary").first().click();
assert.equal(
  await plain.locator(".faq-list details").first().getAttribute("open"),
  "",
);
await plain.route("**/assets/screenshots/**", (route) => route.abort());
await plain.reload();
assert.equal(await plain.locator("#installation").isVisible(), true);
assert.equal(
  await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await plain.screenshot({ path: ".qa/no-js-no-images.png", fullPage: true });
await page.goto(`${baseURL}/404.html`);
assert.equal(await page.locator("h1").textContent(), "This page is missing.");
const referencePages = [];
for (const route of ["features.html", "changelog.html"]) {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${baseURL}/${route}`);
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return img.decode();
        }),
      ),
    );
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${route} overflow at ${width}`,
    );
    assert.doesNotMatch(
      await page.locator("body").innerText(),
      /[\u2013\u2014]/,
    );
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      `${route} accessibility at ${width}`,
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `.qa/${route}-${width}.png`,
      fullPage: true,
    });
    referencePages.push({ route, width, axeViolations: 0, overflow: false });
  }
  const brokenAnchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .filter((a) => !document.getElementById(a.hash.slice(1)))
      .map((a) => a.hash),
  );
  assert.deepEqual(brokenAnchors, [], `${route} fragment links`);
  await plain.goto(`${baseURL}/${route}`);
  assert.equal(await plain.locator("h1").count(), 1);
  assert.ok(
    (await plain.locator("main").innerText()).length > 1000,
    `${route} without JavaScript`,
  );
}
await page.goto(`${baseURL}/changelog.html#v0-2-4`);
assert.match(await page.locator("#v0-2-4").innerText(), /Beta/);
assert.match(await page.locator("#v0-2-4").innerText(), /Back up/);
assert.equal(await page.locator(".release-entry").count(), 5);
await page.goto(baseURL);
await page.locator('.desktop-nav a[href="features.html"]').click();
assert.equal(new URL(page.url()).pathname, "/features.html");
await page.locator('.desktop-nav a[href="changelog.html"]').click();
assert.equal(new URL(page.url()).pathname, "/changelog.html");
assert.deepEqual(errors, []);
const report = {
  layouts: results,
  referencePages,
  keyboard: true,
  clipboardSuccessAndFailure: true,
  noJavaScript: true,
  imagesDisabled: true,
  reducedMotion: true,
  runtimeErrors: errors,
};
await writeFile(".qa/check-results.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
