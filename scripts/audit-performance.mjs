import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".qa", { recursive: true });
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ["--headless", "--no-sandbox"],
  userDataDir: false,
});
try {
  const result = await lighthouse("http://127.0.0.1:4173", {
    port: chrome.port,
    output: ["json", "html"],
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    logLevel: "error",
  });
  await writeFile(".qa/lighthouse.json", result.report[0]);
  await writeFile(".qa/lighthouse.html", result.report[1]);
  console.log(
    JSON.stringify(
      {
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            value.score * 100,
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "largest-contentful-paint",
            "cumulative-layout-shift",
            "total-blocking-time",
            "speed-index",
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
        failed: Object.values(result.lhr.audits)
          .filter((a) => a.score !== null && a.score < 0.9)
          .map((a) => ({
            id: a.id,
            title: a.title,
            displayValue: a.displayValue,
          })),
      },
      null,
      2,
    ),
  );
} finally {
  await chrome.kill();
}
