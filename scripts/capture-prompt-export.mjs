import { annotations } from "./example-annotations.mjs";
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Reproduce against the isolated v0.2.4 renderer served on http://127.0.0.1:4176.
// The bridge stores only the actual renderer-produced PNG and Markdown in memory;
// Node persists those completed artifacts after the browser export succeeds.
const output = new URL("../.qa/collection08-export/", import.meta.url);
const outPath = (name) => fileURLToPath(new URL(name, output));
await mkdir(output, { recursive: true });

const imageDataUrl = `data:image/webp;base64,${(await readFile(new URL("../assets/screenshots/example-before.webp", import.meta.url))).toString("base64")}`;
const backdropDataUrl = `data:image/webp;base64,${(await readFile(new URL("../assets/art/workspace-slate.webp", import.meta.url))).toString("base64")}`;
const now = "2026-09-07T18:24:23.000Z";
const sessionId = "collection08-export-260907-182423";
const shot = {
  collectionId: "checkout-review",
  id: "checkout-save",
  originalFilename: "checkout-save.png",
  storedFilename: "checkout-save.png",
  title: "Checkout settings: Save changes",
  description:
    "The primary Save changes action should be visually prominent and remain aligned with the form.",
  position: 0,
  createdAt: now,
  updatedAt: now,
  priority: "high",
  annotationFile: "annotations/checkout-save.json",
  descriptionFile: "screenshots/checkout-save.md",
  originalWidth: 960,
  originalHeight: 600,
  includeInExport: true,
};
// Corrected authored geometry: the rectangle isolates Save changes (x421–555, y423–467)
// with six pixels of padding; it does not span the Cancel control.
const project = {
  schemaVersion: 3,
  id: "collection08-demo",
  name: "Checkout review",
  description: "Local authored example",
  createdAt: now,
  updatedAt: now,
  status: "active",
  favourite: true,
  collections: [
    {
      id: "checkout-review",
      name: "Checkout review",
      archived: false,
      createdAt: now,
      updatedAt: now,
      overallContext:
        "Review the checkout settings interaction before release.",
    },
  ],
  screenshots: [shot],
  exportPreferences: {
    includeOriginalScreenshots: true,
    includeAnnotationMetadata: true,
    template: "default",
  },
};
const snapshot = {
  projectPath: "/Demo/Checkout review",
  project,
  thumbnails: { [shot.id]: imageDataUrl },
  recoveryFound: false,
  projectRevision: "collection08-v024",
};
const settings = {
  workspacePath: "/Demo",
  theme: "dark",
  interfaceScale: 1,
  openRecentOnLaunch: true,
  confirmBeforeDeletion: true,
  updateChannel: "stable",
};
let preferences = {
  settings: {
    appearance: {
      mode: "dark",
      accent: "indigo",
      glassLevel: "balanced",
      allowPerformanceFallback: false,
      backgroundImage: backdropDataUrl,
      backgroundOpacity: 0.42,
      desktopGlass: false,
    },
    shortcuts: { bindings: {} },
    onboarding: { completed: true, completedVersion: 1 },
  },
  profile: { settingsFileExists: true, migratedFromLegacyProfile: false },
};

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const issues = [];
page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") issues.push(`console: ${message.text()}`);
});
await page.addInitScript(
  ({
    imageDataUrl,
    annotations,
    snapshot,
    settings,
    preferences,
    sessionId,
    shot,
  }) => {
    const exports = new Map();
    const ok = (value) => ({ ok: true, value });
    const session = {
      sessionId,
      collectionId: "checkout-review",
      timestamp: "2026-09-07T18:24:23.000Z",
      setName: "Checkout review - 260907-182423",
    };
    const grant = (number) => ({
      bundleNumber: number,
      pngFilename: `prompt-${number}.png`,
      markdownFilename: `prompt-${number}.md`,
    });
    const native = {
      getPreferenceSettings: async () => ok(preferences),
      setPreferenceSettings: async (update) => {
        preferences.settings = { ...preferences.settings, ...update };
        return ok(preferences);
      },
      getNativePerformanceProfile: async () =>
        ok({
          platform: "windows",
          performanceClass: "standard",
          reducedEffectsRecommended: false,
          reasons: [],
        }),
      setDesktopGlass: async () => ok({ active: false }),
      startProjectWatch: async () =>
        ok({
          watchId: "collection08",
          projectPath: snapshot.projectPath,
          projectRevision: snapshot.projectRevision,
        }),
      stopProjectWatch: async () => ok(undefined),
      onProjectWatchEvent: () => () => {},
      saveProjectCompareAndSwap: async ({ project }) =>
        ok({
          snapshot: { ...snapshot, project },
          projectRevision: snapshot.projectRevision,
        }),
      reloadWatchedProject: async () =>
        ok({ snapshot, projectRevision: snapshot.projectRevision }),
      startPromptExport: async () => ok(session),
      writePromptExportBundle: async (input) => {
        exports.set(input.bundleNumber, {
          ...grant(input.bundleNumber),
          markdown: input.markdown,
          imageDataUrl: input.pngDataUrl,
        });
        return ok(grant(input.bundleNumber));
      },
      finishPromptExport: async () =>
        ok({
          status: "completed",
          published: true,
          bundles: [...exports.keys()].map(grant),
          hasMasterMarkdown: true,
          warnings: [],
        }),
      cancelPromptExport: async () =>
        ok({
          status: "cancelled",
          published: false,
          bundles: [...exports.keys()].map(grant),
          hasMasterMarkdown: false,
          warnings: [],
        }),
      readPromptExportBundle: async ({ bundleNumber }) =>
        ok(exports.get(bundleNumber)),
      copyPromptExportBundle: async () => ok(undefined),
      openPromptExportBundle: async () => ok(undefined),
    };
    window.__collection08Exports = exports;
    window.imnota = {
      ...native,
      getSettings: async () => settings,
      setSettings: async (patch) => Object.assign(settings, patch),
      chooseWorkspace: async () => settings,
      listProjects: async () => [
        { ...snapshot.project, projectPath: snapshot.projectPath },
      ],
      loadProject: async () => snapshot,
      onUpdateStatus: () => () => {},
      getUpdateStatus: async () => ({ state: "idle", currentVersion: "0.2.4" }),
      loadScreenshotContent: async () => ({
        image: {
          filename: shot.storedFilename,
          dataUrl: imageDataUrl,
          width: 960,
          height: 600,
        },
        annotations,
        description: shot.description,
        contentRevision: snapshot.projectRevision,
      }),
      saveProject: async () => undefined,
      saveScreenshotContent: async () => ({
        project: snapshot.project,
        savedScreenshotId: shot.id,
        conflictCreated: false,
        contentRevision: snapshot.projectRevision,
        projectRevision: snapshot.projectRevision,
      }),
      createProject: async () => snapshot,
      openProjectDialog: async () => snapshot,
      importImageFiles: async () => snapshot,
      pasteImage: async () => snapshot,
      editCollection: async () => snapshot,
      duplicateScreenshot: async () => snapshot,
      deleteScreenshot: async () => ({ snapshot, undoToken: "collection08" }),
      undoDeleteScreenshot: async () => snapshot,
      duplicateProject: async () => snapshot,
      archiveProject: async () => undefined,
      deleteProject: async () => undefined,
      exportAnnotatedImage: async () => "/Demo/export.png",
      exportPackage: async () => ({
        folderPath: "/Demo/export",
        zipPath: "/Demo/export.zip",
        count: 1,
      }),
      openPath: async () => undefined,
      copyText: async () => undefined,
      copyContext: async () => undefined,
      copyImage: async () => undefined,
      saveRecovery: async () => undefined,
      clearRecovery: async () => undefined,
      getDroppedFilePath: (file) => file.name,
      downloadUpdate: async () => undefined,
      checkForUpdates: async () => undefined,
      installUpdate: async () => undefined,
    };
  },
  {
    imageDataUrl,
    annotations,
    snapshot,
    settings,
    preferences,
    sessionId,
    shot,
  },
);

await page.goto("http://127.0.0.1:4176/", { waitUntil: "networkidle" });
await page.locator(".workspace").waitFor({ timeout: 15000 });
await page.getByTestId("share-prompt-bundles").click();
await page.getByTestId("prompt-sharing-dialog").waitFor({ timeout: 15000 });
await page.screenshot({ path: outPath("share-prompt-bundles-dialog.png") });
await sharp(outPath("share-prompt-bundles-dialog.png"))
  .webp({ quality: 92 })
  .toFile(outPath("share-prompt-bundles-dialog.webp"));
await page.getByTestId("copy-prompt-1").click();
await page
  .getByRole("status")
  .filter({ hasText: "Export complete" })
  .waitFor({ timeout: 30000 });
await page.screenshot({ path: outPath("share-prompt-bundles-complete.png") });
await sharp(outPath("share-prompt-bundles-complete.png"))
  .webp({ quality: 92 })
  .toFile(outPath("share-prompt-bundles-complete.webp"));
const modalBox = await page.getByRole("dialog").boundingBox();
if (!modalBox)
  throw new Error("Share prompt bundles modal has no visible bounds.");
const pad = 32;
const clip = {
  x: Math.max(0, Math.floor(modalBox.x - pad)),
  y: Math.max(0, Math.floor(modalBox.y - pad)),
  width:
    Math.min(1600, Math.ceil(modalBox.x + modalBox.width + pad)) -
    Math.max(0, Math.floor(modalBox.x - pad)),
  height:
    Math.min(1000, Math.ceil(modalBox.y + modalBox.height + pad)) -
    Math.max(0, Math.floor(modalBox.y - pad)),
};
await page.screenshot({
  path: outPath("share-prompt-bundles-complete-focused.png"),
  clip,
});
await sharp(outPath("share-prompt-bundles-complete-focused.png"))
  .webp({ quality: 92 })
  .toFile(outPath("share-prompt-bundles-complete-focused.webp"));
const artifacts = await page.evaluate(() => [
  ...window.__collection08Exports.entries(),
]);
if (artifacts.length !== 1)
  throw new Error(
    `Expected one completed bundle; received ${artifacts.length}.`,
  );
const [, artifact] = artifacts[0];
await writeFile(outPath("prompt-1.md"), artifact.markdown);
await writeFile(
  outPath("prompt-1.png"),
  Buffer.from(artifact.imageDataUrl.split(",")[1], "base64"),
);
await sharp(outPath("prompt-1.png"))
  .webp({ quality: 92 })
  .toFile(outPath("prompt-1.webp"));
const metadata = {
  source: "stable v0.2.4 renderer at .qa/stable-source/app",
  commit: "b918a6a819fd31d26470301334aa3a9ade4a4f86",
  viewport: "1600x1000",
  dialog: "actual PromptSharingDialog opened through the app",
  export:
    "actual PromptBundleControllerEngine rendering/composition pipeline; deterministic in-memory native persistence bridge",
  exportSession: sessionId,
  annotations,
  issues,
};
await writeFile(
  outPath("capture-report.json"),
  JSON.stringify(metadata, null, 2),
);
await browser.close();
