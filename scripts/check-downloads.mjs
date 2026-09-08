import assert from "node:assert/strict";

export async function checkDownloads(browser, baseURL) {
  const context = await browser.newContext();
  await context.route("https://plausible.io/**", (route) =>
    route.fulfill({ body: "" }),
  );
  const page = await context.newPage();
  try {
    await page.goto(baseURL);
    await page.evaluate(() => {
      window.downloadEvents = [];
      window.plausible = (name, options) =>
        window.downloadEvents.push({ name, ...options });
      // Preserve normal handler execution but avoid real downloads during checks.
      document.addEventListener("click", (event) => {
        window.downloadWasPrevented = event.defaultPrevented;
        event.preventDefault();
      });
      document.addEventListener("auxclick", (event) => event.preventDefault());
    });
    const links = page.locator("a[data-download-os]");
    assert.equal(await links.count(), 4);
    for (let i = 0; i < 4; i++) {
      await links.nth(i).locator("span").click();
    }
    assert.deepEqual(
      await page.evaluate(() => window.downloadEvents),
      ["Windows", "macOS", "Linux", "macOS"].map((os) => ({
        name: "Download",
        props: { os },
      })),
    );
    await links.first().focus();
    await page.keyboard.press("Enter");
    await links.first().dispatchEvent("auxclick", { button: 1 });
    await links.first().dispatchEvent("auxclick", { button: 2 });
    await page.locator("a[download]").first().click();
    assert.equal(await page.evaluate(() => window.downloadEvents.length), 6);
    await page.evaluate(() => {
      window.plausible = undefined;
    });
    await links.first().click();
    assert.equal(
      await page.evaluate(() => window.downloadWasPrevented),
      false,
      "Downloads remain available without analytics",
    );
  } finally {
    await context.close();
  }
}
