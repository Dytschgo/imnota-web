// Capture the real renderer from a read-only source checkout served on port 4175.
// The native bridge is replaced with deterministic example data, never user files.
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

await mkdir("assets/screenshots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 960, height: 600 },
  deviceScaleFactor: 1,
});
await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Example project settings</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f5f7;color:#20232c;font:16px Arial,sans-serif}.nav{height:66px;background:#fff;border-bottom:1px solid #dfe1e7;padding:24px 35px;display:flex;gap:40px}.nav strong{margin-right:auto}.muted{color:#7b8190}.layout{display:grid;grid-template-columns:195px 1fr;height:534px}aside{padding:36px 26px;border-right:1px solid #dddfe5}aside p{padding:12px;margin:0 0 8px}.active{background:#e8e6f9;color:#5142c0}main{padding:40px 55px}h1{font-size:29px;margin:0 0 12px}label{display:block;font-size:14px;font-weight:600;margin:24px 0 10px}input{width:100%;padding:14px;border:1px solid #cfd2db;border-radius:4px;background:white;font:16px Arial}small{display:block;margin-top:9px;color:#7b8190}.actions{display:flex;gap:14px;margin:30px 0 0 65px}button{border:1px solid #d2d5de;border-radius:4px;padding:13px 23px;background:white;color:#303440;font-size:14px}.save{background:#d9dce5;color:#9a9fac;border:0}
</style><div class="nav"><strong>Project settings</strong><span>Workspace</span><span class="muted">Settings</span></div><div class="layout"><aside><p>General</p><p class="active">Project details</p><p>Appearance</p><p>Notifications</p></aside><main><h1>Project details</h1><p class="muted">Manage the details of your local project.</p><label>Project name</label><input value="Website review" readonly><label>Description</label><input value="Visual feedback for the next release" readonly><small>Give your project a short, useful description.</small><div class="actions"><button>Cancel</button><button class="save">Save changes</button></div></main></div></html>`);
const source = await page.screenshot();
await sharp(source)
  .webp({ quality: 90 })
  .toFile("assets/screenshots/example-before.webp");
const dataUrl = `data:image/png;base64,${source.toString("base64")}`;
const annotations = [
  {
    id: "box",
    kind: "rectangle",
    x: 306,
    y: 435,
    width: 305,
    height: 72,
    stroke: "#6857f5",
    strokeWidth: 3,
    zIndex: 0,
  },
  {
    id: "arrow",
    kind: "arrow",
    x: 680,
    y: 388,
    points: [0, 0, -190, 60],
    stroke: "#6857f5",
    strokeWidth: 4,
    zIndex: 1,
  },
  {
    id: "step",
    kind: "step",
    x: 295,
    y: 445,
    stepNumber: 1,
    fill: "#6857f5",
    stroke: "#6857f5",
    fontSize: 20,
    zIndex: 2,
  },
  {
    id: "note",
    kind: "callout",
    x: 578,
    y: 304,
    width: 310,
    height: 65,
    text: "Make the primary action clear.",
    stroke: "#6857f5",
    fill: "#6857f5",
    fontSize: 18,
    zIndex: 3,
  },
];
await writeFile(
  ".qa/example-data.json",
  JSON.stringify({ dataUrl, annotations }),
);
await page.setViewportSize({ width: 1600, height: 1000 });
await page.addInitScript(
  ({ dataUrl, annotations }) => {
    const date = "2026-09-07T10:00:00.000Z";
    const shot = {
      collectionId: "001-collection",
      id: "shot-1",
      originalFilename: "project-settings.png",
      storedFilename: "project-settings.png",
      title: "Project settings",
      description:
        "Make Save changes the primary action. Align the buttons with the fields and increase the button contrast.",
      position: 0,
      createdAt: date,
      updatedAt: date,
      priority: "high",
      annotationFile: "annotations/shot-1.json",
      descriptionFile: "screenshots/shot-1.md",
      originalWidth: 960,
      originalHeight: 600,
      includeInExport: true,
    };
    const project = {
      schemaVersion: 3,
      id: "website-review",
      name: "Website review",
      description: "Example project",
      createdAt: date,
      updatedAt: date,
      status: "active",
      favourite: false,
      collections: [
        {
          id: "001-collection",
          name: "Settings review",
          archived: false,
          createdAt: date,
          updatedAt: date,
          overallContext:
            "Improve clarity and keyboard accessibility in the project settings.",
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
      projectPath: "/example/Website review",
      project,
      thumbnails: { "shot-1": dataUrl },
      recoveryFound: false,
      projectRevision: "example-1",
    };
    const settings = {
      workspacePath: "/example",
      theme: "dark",
      interfaceScale: 1,
      openRecentOnLaunch: true,
      confirmBeforeDeletion: true,
      updateChannel: "stable",
    };
    const preferences = {
      settings: {
        appearance: {
          mode: "dark",
          accent: "indigo",
          glassLevel: "off",
          allowPerformanceFallback: true,
          backgroundImage: "",
          backgroundOpacity: 0,
        },
        shortcuts: { bindings: {} },
        onboarding: { completed: true, completedVersion: 1 },
      },
      profile: { settingsFileExists: true, migratedFromLegacyProfile: false },
    };
    window.imnota = {
      getSettings: async () => settings,
      listProjects: async () => [
        { ...project, projectPath: snapshot.projectPath },
      ],
      loadProject: async () => snapshot,
      onUpdateStatus: () => () => {},
      getUpdateStatus: async () => ({ state: "idle" }),
      getPreferenceSettings: async () => ({ ok: true, value: preferences }),
      getNativePerformanceProfile: async () => ({
        ok: true,
        value: {
          platform: "windows",
          performanceClass: "standard",
          reducedEffectsRecommended: false,
          reasons: [],
        },
      }),
      startProjectWatch: async () => ({
        ok: true,
        value: {
          watchId: "example",
          projectPath: snapshot.projectPath,
          projectRevision: "example-1",
        },
      }),
      stopProjectWatch: async () => ({ ok: true }),
      onProjectWatchEvent: () => () => {},
      loadScreenshotContent: async () => ({
        image: {
          filename: "project-settings.png",
          dataUrl,
          width: 960,
          height: 600,
        },
        annotations,
        description: shot.description,
        contentRevision: "example-1",
      }),
      onCloseRequested: () => () => {},
      getAppVersion: async () => "0.2.2",
    };
  },
  { dataUrl, annotations },
);
page.on("pageerror", (error) => console.error(error.message));
await page.goto("http://127.0.0.1:4175");
await page.locator("canvas").first().waitFor();
await page.waitForTimeout(1800);
await page.screenshot({ path: ".qa/renderer.png" });
await sharp(".qa/renderer.png")
  .webp({ quality: 90 })
  .toFile("assets/screenshots/workbench.webp");
await sharp(".qa/renderer.png")
  .resize(1000)
  .webp({ quality: 86 })
  .toFile("assets/screenshots/workbench-small.webp");
console.log((await page.locator("body").innerText()).slice(0, 6000));
const canvas = page.locator(".konvajs-content");
if (await canvas.count()) await canvas.screenshot({ path: ".qa/canvas.png" });
await writeFile(".qa/renderer-dom.html", await page.content());
await browser.close();
