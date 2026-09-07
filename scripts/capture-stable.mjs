import { annotations } from "./example-annotations.mjs";
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Serve an isolated checkout of v0.2.5 on port 4177 before running.
const output = new URL("../.qa/stable-capture/", import.meta.url);
const outPath = (name) => fileURLToPath(new URL(name, output));
await mkdir(output, { recursive: true });
const dataUrl = `data:image/webp;base64,${(await readFile(new URL("../assets/screenshots/example-before.webp", import.meta.url))).toString("base64")}`;
const backdropDataUrl = `data:image/webp;base64,${(await readFile(new URL("../assets/art/workspace-slate.webp", import.meta.url))).toString("base64")}`;
const now = "2026-09-07T18:24:23.000Z";

const shots = [
  [
    "shot-settings",
    "Settings: primary action",
    "Make the Save changes action prominent and align it with the form fields.",
    "high",
  ],
  [
    "shot-empty",
    "Empty state",
    "Clarify the next step when a new workspace has no projects yet.",
    "medium",
  ],
  [
    "shot-mobile",
    "Mobile navigation",
    "Keep the primary section and feedback actions within reach.",
    "low",
  ],
].map(([id, title, description, priority], position) => ({
  collectionId: "product-review",
  id,
  originalFilename: `${id}.png`,
  storedFilename: `${id}.png`,
  title,
  description,
  position,
  createdAt: now,
  updatedAt: now,
  priority,
  annotationFile: `annotations/${id}.json`,
  descriptionFile: `screenshots/${id}.md`,
  originalWidth: 960,
  originalHeight: 600,
  includeInExport: true,
}));
const project = {
  schemaVersion: 3,
  id: "imnota-demo",
  name: "Imnota product review",
  description: "Demo project · local example data",
  createdAt: now,
  updatedAt: now,
  status: "active",
  favourite: true,
  collections: [
    {
      id: "product-review",
      name: "Release review",
      archived: false,
      createdAt: now,
      updatedAt: now,
      overallContext:
        "Review the interaction details before the next product release.",
    },
  ],
  screenshots: shots,
  exportPreferences: {
    includeOriginalScreenshots: true,
    includeAnnotationMetadata: true,
    template: "default",
  },
};
const snapshot = {
  projectPath: "/Demo/Imnota product review",
  project,
  thumbnails: Object.fromEntries(shots.map((shot) => [shot.id, dataUrl])),
  recoveryFound: false,
  projectRevision: "demo-v024",
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

await mkdir(output, { recursive: true });
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
  ({ dataUrl, annotations, snapshot, settings, preferences }) => {
    const noop = async () => undefined;
    const workflow = {
      getPreferenceSettings: async () => ({ ok: true, value: preferences }),
      setPreferenceSettings: async (update) => {
        preferences.settings = {
          ...preferences.settings,
          ...update,
          appearance: update.appearance ?? preferences.settings.appearance,
          shortcuts: update.shortcuts ?? preferences.settings.shortcuts,
          onboarding: update.onboarding ?? preferences.settings.onboarding,
        };
        return { ok: true, value: preferences };
      },
      getNativePerformanceProfile: async () => ({
        ok: true,
        value: {
          platform: "windows",
          performanceClass: "standard",
          reducedEffectsRecommended: false,
          reasons: [],
        },
      }),
      setDesktopGlass: async () => ({ ok: true, value: { active: false } }),
      startProjectWatch: async () => ({
        ok: true,
        value: {
          watchId: "demo",
          projectPath: snapshot.projectPath,
          projectRevision: "demo-v024",
        },
      }),
      stopProjectWatch: noop,
      onProjectWatchEvent: () => () => {},
      saveProjectCompareAndSwap: async ({ project }) => ({
        ok: true,
        value: {
          snapshot: { ...snapshot, project },
          projectRevision: "demo-v024",
        },
      }),
      reloadWatchedProject: async () => ({
        ok: true,
        value: { snapshot, projectRevision: "demo-v024" },
      }),
    };
    window.imnota = {
      ...workflow,
      getSettings: async () => settings,
      setSettings: async (patch) => Object.assign(settings, patch),
      chooseWorkspace: async () => settings,
      listProjects: async () => [
        { ...snapshot.project, projectPath: snapshot.projectPath },
      ],
      loadProject: async () => snapshot,
      onUpdateStatus: () => () => {},
      getUpdateStatus: async () => ({ state: "idle", currentVersion: "0.2.5" }),
      loadScreenshotContent: async ({ screenshot }) => ({
        image: {
          filename: screenshot.storedFilename,
          dataUrl,
          width: 960,
          height: 600,
        },
        annotations: screenshot.id === "shot-settings" ? annotations : [],
        description: screenshot.description,
        contentRevision: "demo-v024",
      }),
      saveProject: noop,
      saveScreenshotContent: async ({ screenshot }) => ({
        project: snapshot.project,
        savedScreenshotId: screenshot.id,
        conflictCreated: false,
        contentRevision: "demo-v024",
        projectRevision: "demo-v024",
      }),
      createProject: async () => snapshot,
      openProjectDialog: async () => snapshot,
      importImageFiles: async () => snapshot,
      pasteImage: async () => snapshot,
      editCollection: async () => snapshot,
      duplicateScreenshot: async () => snapshot,
      deleteScreenshot: async () => ({ snapshot, undoToken: "demo" }),
      undoDeleteScreenshot: async () => snapshot,
      duplicateProject: async () => snapshot,
      archiveProject: noop,
      deleteProject: noop,
      exportAnnotatedImage: async () => "/Demo/export.png",
      exportPackage: async () => ({
        folderPath: "/Demo/export",
        zipPath: "/Demo/export.zip",
        count: 3,
      }),
      openPath: noop,
      copyText: noop,
      copyContext: noop,
      copyImage: noop,
      saveRecovery: noop,
      clearRecovery: noop,
      getDroppedFilePath: (file) => file.name,
      downloadUpdate: noop,
      checkForUpdates: noop,
      installUpdate: noop,
    };
  },
  { dataUrl, annotations, snapshot, settings, preferences },
);
await page.goto("http://127.0.0.1:4177/", { waitUntil: "networkidle" });
await page.locator(".workspace").waitFor({ timeout: 15000 });
await page.waitForTimeout(1000);
await page.getByTestId("settings-button").click();
await page.locator('[data-testid="settings-view"]').waitFor();
await page.waitForFunction(() => {
  const root = document.documentElement;
  return (
    root.dataset.background === "active" &&
    root.style.getPropertyValue("--imnota-background-image").startsWith("url(")
  );
});
await page.waitForTimeout(500);
const rendering = await page.evaluate(() => {
  const shell = document.querySelector(".app-shell");
  const wallpaper = getComputedStyle(shell, "::after");
  return {
    backgroundDataset: document.documentElement.dataset.background,
    glassDataset: document.documentElement.dataset.glassLevel,
    desktopGlassDataset: document.documentElement.dataset.desktopGlass,
    rootBackgroundValueLength: document.documentElement.style.getPropertyValue(
      "--imnota-background-image",
    ).length,
    rootBackgroundStartsWithUrl: document.documentElement.style
      .getPropertyValue("--imnota-background-image")
      .startsWith("url("),
    wallpaperConfigured: wallpaper.backgroundImage !== "none",
    wallpaperOpacity: wallpaper.opacity,
    backdropFilterSupported: CSS.supports("backdrop-filter", "blur(1px)"),
    reducedTransparency: matchMedia("(prefers-reduced-transparency: reduce)")
      .matches,
  };
});
await page.screenshot({ path: outPath("settings.png") });
await sharp(outPath("settings.png"))
  .webp({ quality: 90 })
  .toFile(outPath("settings.webp"));
await page.locator(".nav-submenu-item").first().click();
await page.locator(".workspace").waitFor();
await page.waitForTimeout(350);
await page.screenshot({ path: outPath("workbench.png") });
await sharp(outPath("workbench.png"))
  .webp({ quality: 90 })
  .toFile(outPath("workbench.webp"));
await sharp(outPath("workbench.png"))
  .resize(1000)
  .webp({ quality: 87 })
  .toFile(outPath("workbench-small.webp"));
await page.locator(".workspace").screenshot({ path: outPath("detail.png") });
await sharp(outPath("detail.png"))
  .webp({ quality: 90 })
  .toFile(outPath("detail.webp"));
const metadata = {
  tag: "v0.2.5",
  commit: "bd33da45fac5bf05f20e6cdb9f66c5db709b3bdf",
  viewport: "1600x1000",
  backdrop: "local GPT Image artwork via data URL",
  desktopGlass: false,
  glassLevel: "balanced",
  rendering,
  errors: issues,
};
await writeFile(
  outPath("capture-report.json"),
  JSON.stringify(metadata, null, 2),
);
await browser.close();
