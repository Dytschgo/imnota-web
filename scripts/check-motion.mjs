import assert from "node:assert/strict";

export async function checkMotion(browser, baseURL) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.locator("html.motion-enhanced").waitFor();
  assert.equal(await page.locator(".hero-annotation").count(), 1);
  const finite = await page.evaluate(() =>
    document
      .getAnimations()
      .every(
        (animation) => animation.effect.getTiming().iterations !== Infinity,
      ),
  );
  assert.ok(finite, "Autoplay motion must settle");
  const diagram = page.locator("#handoff-diagram");
  const progress = () =>
    diagram.evaluate((element) =>
      Number(getComputedStyle(element).getPropertyValue("--route-progress")),
    );
  const scrollToProgress = async (position) => {
    await diagram.evaluate((element, fraction) => {
      const top = element.getBoundingClientRect().top + scrollY;
      window.scrollTo({
        top:
          top - innerHeight + (innerHeight + element.offsetHeight) * fraction,
        behavior: "instant",
      });
    }, position);
    await page.waitForTimeout(100);
    return progress();
  };
  const stroke = () =>
    diagram
      .locator(".handoff-route")
      .first()
      .evaluate((element) => getComputedStyle(element).strokeDashoffset);
  const before = await scrollToProgress(0.1);
  const strokeBefore = await stroke();
  const after = await scrollToProgress(0.9);
  assert.notEqual(
    await stroke(),
    strokeBefore,
    "SVG route does not visibly draw with scroll",
  );
  assert.ok(
    after > before + 0.3,
    `Scroll sequence does not advance: ${before} -> ${after}`,
  );
  const reverse = await scrollToProgress(0.2);
  assert.ok(reverse < after - 0.2, "Scroll sequence does not reverse");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("motion-enhanced"),
  );
  assert.equal(await diagram.getAttribute("data-motion-state"), "static");
  assert.equal(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
    0,
    "Motion continues after reduced-motion preference changes",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("html.motion-enhanced").waitFor();
  await page.goto(`${baseURL}/#how-it-works`);
  assert.ok(await page.locator("#how-it-works").isVisible());
  await context.close();

  const limited = await browser.newContext();
  await limited.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    }),
  );
  const economical = await limited.newPage();
  await economical.goto(baseURL);
  assert.equal(await economical.locator("html.motion-enhanced").count(), 0);
  assert.equal(
    await economical
      .locator("#handoff-diagram")
      .getAttribute("data-motion-state"),
    "static",
  );
  await limited.close();

  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const staticPage = await plain.newPage();
  await staticPage.goto(baseURL);
  assert.ok(await staticPage.locator(".hero-annotation").isVisible());
  assert.ok(await staticPage.locator("#handoff-diagram").isVisible());
  assert.equal(
    await staticPage
      .locator("#handoff-diagram")
      .evaluate(
        (element) => element.getBoundingClientRect().right <= innerWidth,
      ),
    true,
  );
  await plain.close();
  return {
    finiteHero: true,
    forwardAndReverseScroll: true,
    liveReducedMotion: true,
    saveData: true,
    staticWithoutJS: true,
  };
}
