import assert from "node:assert/strict";

export async function checkMotion(browser, baseURL) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.locator("html.motion-enhanced").waitFor();

  // The hero entrance is finite and settles.
  await page.locator('.stage-hero[data-reveal-state="playing"]').waitFor();
  const finite = await page.evaluate(() =>
    document
      .getAnimations()
      .every(
        (animation) => animation.effect.getTiming().iterations !== Infinity,
      ),
  );
  assert.ok(finite, "Autoplay motion must settle");
  await page.locator('.stage-hero[data-reveal-state="complete"]').waitFor();

  // The looping product film plays muted while the hero is visible.
  const video = page.locator("[data-autoplay-loop]");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-autoplay-loop]").dataset.videoState ===
      "playing",
  );
  assert.equal(await video.evaluate((element) => element.muted), true);
  assert.match(
    await video.evaluate((element) => element.currentSrc),
    /\/assets\/video\/imnota-hero-loop\.(mp4|webm)$/,
    "The hero loop plays one of its published sources",
  );

  // The hero screen tilts back and settles flat as it scrolls into view.
  const tilt = () =>
    page
      .locator(".hero-screen")
      .evaluate((element) =>
        Number(getComputedStyle(element).getPropertyValue("--tilt")),
      );
  const tiltAtTop = await tilt();
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(150);
  const tiltScrolled = await tilt();
  assert.ok(tiltAtTop < 1, `Hero should start tilted, got ${tiltAtTop}`);
  assert.ok(
    tiltScrolled > tiltAtTop + 0.2,
    `Hero tilt does not advance: ${tiltAtTop} -> ${tiltScrolled}`,
  );

  // The hero video pauses once it leaves the viewport.
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector("[data-autoplay-loop]").paused,
  );

  // The annotation still reveals on entry and ends fully visible.
  const annotation = page.locator('[data-motion="annotation"]');
  await annotation.scrollIntoViewIfNeeded();
  await page
    .locator('[data-motion="annotation"][data-reveal-state="playing"]')
    .waitFor();
  assert.notEqual(
    await annotation.evaluate((element) => getComputedStyle(element).clipPath),
    "none",
    "Annotation should reveal on entry",
  );
  await page
    .locator('[data-motion="annotation"][data-reveal-state="complete"]')
    .waitFor();
  assert.equal(
    await annotation.evaluate((element) => getComputedStyle(element).clipPath),
    "none",
    "Completed annotations must remain fully visible",
  );

  // Words light up with scroll, forwards and in reverse.
  const statement = page.locator("[data-lit]");
  const scrollToProgress = async (fraction) => {
    await statement.evaluate((element, position) => {
      const top = element.getBoundingClientRect().top + scrollY;
      window.scrollTo({
        top:
          top - innerHeight + (innerHeight + element.offsetHeight) * position,
        behavior: "instant",
      });
    }, fraction);
    await page.waitForTimeout(120);
    return statement.evaluate((element) => ({
      progress: Number(element.dataset.litProgress),
      lit: element.querySelectorAll(".word.is-lit").length,
    }));
  };
  const before = await scrollToProgress(0.15);
  const after = await scrollToProgress(0.85);
  assert.ok(
    after.progress > before.progress + 0.3 && after.lit > before.lit,
    `Statement does not advance: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`,
  );
  const reverse = await scrollToProgress(0.2);
  assert.ok(reverse.lit < after.lit, "Statement does not reverse");
  assert.equal(
    await statement.getAttribute("aria-label"),
    await statement.evaluate((element) =>
      [...element.querySelectorAll(".word")]
        .map((word) => word.textContent)
        .join(" "),
    ),
    "Split statement keeps its accessible text",
  );

  // Exactly the workflow step in the middle of the viewport is active.
  const secondStep = page.locator('.step[data-step="1"]');
  await secondStep.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await page.waitForFunction(() =>
    document
      .querySelector('.step[data-step="1"]')
      .classList.contains("is-active"),
  );
  assert.equal(
    await page
      .locator('.step[data-step="3"]')
      .evaluate((element) => element.classList.contains("is-active")),
    false,
  );

  // Card entrances pause offscreen and resume on return.
  const cards = page.locator('[data-motion="cards"]');
  await cards.scrollIntoViewIfNeeded();
  await page
    .locator('[data-motion="cards"][data-reveal-state="playing"]')
    .waitFor();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page
    .locator('[data-motion="cards"][data-reveal-state="paused"]')
    .waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector('[data-motion="cards"]')
      .getAnimations({ subtree: true })
      .every((animation) => !animation.pending),
  );
  const cardTimes = () =>
    cards.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.currentTime),
    );
  const pausedAt = await cardTimes();
  await page.waitForTimeout(180);
  assert.deepEqual(
    await cardTimes(),
    pausedAt,
    "Offscreen animations must pause",
  );
  await cards.scrollIntoViewIfNeeded();
  await page
    .locator('[data-motion="cards"][data-reveal-state="playing"]')
    .waitFor();

  // A live reduced-motion change settles everything.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("motion-enhanced"),
  );
  assert.equal(await cards.getAttribute("data-reveal-state"), "static");
  assert.equal(await video.getAttribute("data-video-state"), "static");
  assert.equal(await video.evaluate((element) => element.paused), true);
  assert.equal(
    await page.locator(".lit-text .word:not(.is-lit)").count(),
    0,
    "Reduced motion must light the whole statement",
  );
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
  await page.goto(`${baseURL}/features.html`);
  await page.locator('.page-intro[data-reveal-state="complete"]').waitFor();
  await context.close();

  // Save-Data keeps the static poster and does not fetch the loop.
  const limited = await browser.newContext();
  await limited.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    }),
  );
  const economical = await limited.newPage();
  const videoRequests = [];
  economical.on("request", (request) => {
    if (
      request.url().includes("/assets/video/") &&
      /\.(mp4|webm)/.test(request.url())
    )
      videoRequests.push(request.url());
  });
  await economical.goto(baseURL);
  await economical.waitForTimeout(500);
  assert.equal(await economical.locator("html.motion-enhanced").count(), 0);
  assert.equal(
    await economical.locator('html[data-motion-mode="static"]').count(),
    1,
  );
  assert.equal(
    await economical
      .locator("[data-autoplay-loop]")
      .getAttribute("data-video-state"),
    "static",
  );
  assert.deepEqual(videoRequests, [], "Save-Data must not download video");
  await limited.close();

  // Without JavaScript the page is complete and still.
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const staticPage = await plain.newPage();
  await staticPage.goto(baseURL);
  assert.ok(await staticPage.locator(".screen-poster").isVisible());
  assert.equal(
    await staticPage
      .locator(".screen-video")
      .evaluate((element) => getComputedStyle(element).opacity),
    "0",
  );
  assert.equal(
    await staticPage
      .locator('.comparison-image[data-motion="annotation"]')
      .evaluate((element) => getComputedStyle(element).clipPath),
    "none",
    "Annotations must remain visible without JavaScript",
  );
  assert.equal(
    await staticPage
      .locator(".hero-screen")
      .evaluate(
        (element) => element.getBoundingClientRect().right <= innerWidth,
      ),
    true,
  );
  await plain.close();
  return {
    finiteHero: true,
    heroFilmLoop: true,
    heroTilt: true,
    viewportScenes: true,
    annotationReveal: true,
    offscreenPause: true,
    forwardAndReverseScroll: true,
    activeStep: true,
    liveReducedMotion: true,
    saveData: true,
    staticWithoutJS: true,
  };
}
