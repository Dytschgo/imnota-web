import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Run against the isolated v0.2.5 checkout served at http://127.0.0.1:4177.
// The in-memory bridge only replaces Electron file access. Every visible control
// and editor is rendered by the tagged v0.2.5 React application.
const output = new URL("../.qa/v025-capture/", import.meta.url);
const out = (name) => fileURLToPath(new URL(name, output));
await mkdir(output, { recursive: true });

const now = "2026-09-08T08:30:00.000Z";
const drawingSource = JSON.stringify({
  type: "excalidraw",
  version: 2,
  source: "https://excalidraw.com",
  elements: [
    {
      id: "capture",
      type: "rectangle",
      x: 150,
      y: 220,
      width: 210,
      height: 110,
      angle: 0,
      strokeColor: "#1d4ed8",
      backgroundColor: "#dbeafe",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: { type: 3 },
      seed: 11,
      version: 1,
      versionNonce: 12,
      isDeleted: false,
      boundElements: [{ id: "arrow-a", type: "arrow" }],
      updated: 0,
      link: null,
      locked: false,
    },
    {
      id: "review",
      type: "diamond",
      x: 500,
      y: 220,
      width: 170,
      height: 110,
      angle: 0,
      strokeColor: "#7c3aed",
      backgroundColor: "#ede9fe",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: 21,
      version: 1,
      versionNonce: 22,
      isDeleted: false,
      boundElements: [
        { id: "arrow-a", type: "arrow" },
        { id: "arrow-b", type: "arrow" },
      ],
      updated: 0,
      link: null,
      locked: false,
    },
    {
      id: "handoff",
      type: "rectangle",
      x: 800,
      y: 220,
      width: 210,
      height: 110,
      angle: 0,
      strokeColor: "#059669",
      backgroundColor: "#d1fae5",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: { type: 3 },
      seed: 41,
      version: 1,
      versionNonce: 42,
      isDeleted: false,
      boundElements: [{ id: "arrow-b", type: "arrow" }],
      updated: 0,
      link: null,
      locked: false,
    },
    {
      id: "capture-label",
      type: "text",
      x: 210,
      y: 258,
      width: 90,
      height: 24,
      angle: 0,
      strokeColor: "#0f172a",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: 13,
      version: 1,
      versionNonce: 14,
      isDeleted: false,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
      text: "Capture",
      originalText: "Capture",
      fontSize: 20,
      fontFamily: 2,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: null,
      autoResize: true,
      lineHeight: 1.25,
    },
    {
      id: "review-label",
      type: "text",
      x: 545,
      y: 258,
      width: 80,
      height: 24,
      angle: 0,
      strokeColor: "#0f172a",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: 23,
      version: 1,
      versionNonce: 24,
      isDeleted: false,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
      text: "Review",
      originalText: "Review",
      fontSize: 20,
      fontFamily: 2,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: null,
      autoResize: true,
      lineHeight: 1.25,
    },
    {
      id: "handoff-label",
      type: "text",
      x: 855,
      y: 258,
      width: 100,
      height: 24,
      angle: 0,
      strokeColor: "#0f172a",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: 43,
      version: 1,
      versionNonce: 44,
      isDeleted: false,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
      text: "Handoff",
      originalText: "Handoff",
      fontSize: 20,
      fontFamily: 2,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: null,
      autoResize: true,
      lineHeight: 1.25,
    },
    {
      id: "arrow-a",
      type: "arrow",
      x: 370,
      y: 275,
      width: 120,
      height: 0,
      angle: 0,
      strokeColor: "#334155",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: { type: 2 },
      seed: 31,
      version: 1,
      versionNonce: 32,
      isDeleted: false,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
      points: [
        [0, 0],
        [120, 0],
      ],
      lastCommittedPoint: null,
      startBinding: { elementId: "capture", focus: 0, gap: 10 },
      endBinding: { elementId: "review", focus: 0, gap: 10 },
      startArrowhead: null,
      endArrowhead: "arrow",
    },
    {
      id: "arrow-b",
      type: "arrow",
      x: 680,
      y: 275,
      width: 110,
      height: 0,
      angle: 0,
      strokeColor: "#334155",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: { type: 2 },
      seed: 33,
      version: 1,
      versionNonce: 34,
      isDeleted: false,
      boundElements: null,
      updated: 0,
      link: null,
      locked: false,
      points: [
        [0, 0],
        [110, 0],
      ],
      lastCommittedPoint: null,
      startBinding: { elementId: "review", focus: 0, gap: 10 },
      endBinding: { elementId: "handoff", focus: 0, gap: 10 },
      startArrowhead: null,
      endArrowhead: "arrow",
    },
  ],
  appState: { viewBackgroundColor: "#ffffff" },
  files: {},
});
const drawing = {
  id: "architecture",
  collectionId: "release-plan",
  kind: "drawing",
  title: "Capture flow",
  sourceFilename: "architecture.json",
  imageFilename: "architecture.png",
  originalWidth: 760,
  originalHeight: 420,
  position: 0,
  includeInExport: true,
  createdAt: now,
  updatedAt: now,
};
const text = {
  id: "brief",
  collectionId: "release-plan",
  kind: "text",
  markdownFilename: "brief.md",
  preview: "Release brief",
  position: 1,
  includeInExport: true,
  createdAt: now,
  updatedAt: now,
};
const project = {
  schemaVersion: 4,
  id: "v025-demo",
  name: "Release planning",
  description: "Local capture fixture",
  createdAt: now,
  updatedAt: now,
  status: "active",
  favourite: true,
  collections: [
    {
      id: "release-plan",
      name: "Release plan",
      archived: false,
      createdAt: now,
      updatedAt: now,
      overallContext: "Explain the implementation sequence.",
    },
  ],
  screenshots: [],
  contentItems: [drawing, text],
  exportPreferences: {
    includeOriginalScreenshots: true,
    includeAnnotationMetadata: true,
    template: "default",
  },
};
let snapshot = {
  projectPath: "/Capture/v0.2.5 release planning",
  project,
  thumbnails: {},
  recoveryFound: false,
  projectRevision: "v025-capture",
};
let markdown =
  "# Checkout review\n\nMake **Save changes** the primary action and keep it aligned with the form.\n\n## Acceptance\n\n- The primary action remains visible at 320 px\n- Cancel stays secondary\n- The validation message names the affected field";
const blankPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
await page.addInitScript(
  ({ snapshot, drawing, text, drawingSource, markdown, blankPng }) => {
    const ok = (value) => ({ ok: true, value });
    let current = snapshot;
    let textValue = markdown;
    const native = {
      getPreferenceSettings: async () =>
        ok({
          settings: {
            appearance: {
              mode: "dark",
              accent: "indigo",
              glassLevel: "off",
              allowPerformanceFallback: false,
              backgroundImage: null,
              backgroundOpacity: 0,
              desktopGlass: false,
            },
            shortcuts: { bindings: {} },
            onboarding: { completed: true, completedVersion: 1 },
          },
          profile: {
            settingsFileExists: true,
            migratedFromLegacyProfile: false,
          },
        }),
      setPreferenceSettings: async () => ok(undefined),
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
          watchId: "v025",
          projectPath: current.projectPath,
          projectRevision: current.projectRevision,
        }),
      stopProjectWatch: async () => ok(undefined),
      onProjectWatchEvent: () => () => {},
      saveProjectCompareAndSwap: async ({ project }) =>
        ok({
          snapshot: (current = { ...current, project }),
          projectRevision: "v025-capture",
        }),
      reloadWatchedProject: async () =>
        ok({ snapshot: current, projectRevision: "v025-capture" }),
      createContentItem: async () => current,
      loadContentItem: async ({ itemId }) =>
        itemId === drawing.id
          ? {
              item: drawing,
              source: drawingSource,
              image: {
                filename: drawing.imageFilename,
                dataUrl: blankPng,
                width: 760,
                height: 420,
              },
              contentRevision: "drawing-v1",
            }
          : { item: text, markdown: textValue, contentRevision: "text-v1" },
      saveContentItem: async ({ itemId, markdown: nextMarkdown }) => {
        if (itemId === text.id && typeof nextMarkdown === "string")
          textValue = nextMarkdown;
        return {
          snapshot: current,
          itemId,
          contentRevision: `${itemId}-v2`,
          conflictCreated: false,
        };
      },
      duplicateContentItem: async () => current,
      deleteContentItem: async () => ({ snapshot: current, undoToken: "v025" }),
      undoDeleteContentItem: async () => current,
    };
    window.imnota = {
      ...native,
      getSettings: async () => ({
        workspacePath: "/Capture",
        theme: "dark",
        interfaceScale: 1,
        openRecentOnLaunch: true,
        confirmBeforeDeletion: true,
        updateChannel: "stable",
      }),
      setSettings: async () => undefined,
      chooseWorkspace: async () => undefined,
      listProjects: async () => [
        { ...current.project, projectPath: current.projectPath },
      ],
      loadProject: async () => current,
      onUpdateStatus: () => () => {},
      getUpdateStatus: async () => ({ state: "idle", currentVersion: "0.2.5" }),
      loadScreenshotContent: async () => {
        throw new Error("No screenshots in capture fixture");
      },
      saveProject: async () => undefined,
      saveScreenshotContent: async () => ({
        project: current.project,
        savedScreenshotId: "",
        conflictCreated: false,
        contentRevision: "v025",
        projectRevision: "v025",
      }),
      createProject: async () => current,
      openProjectDialog: async () => current,
      importImageFiles: async () => current,
      pasteImage: async () => current,
      editCollection: async () => current,
      duplicateScreenshot: async () => current,
      deleteScreenshot: async () => ({ snapshot: current, undoToken: "v025" }),
      undoDeleteScreenshot: async () => current,
      duplicateProject: async () => current,
      archiveProject: async () => undefined,
      deleteProject: async () => undefined,
      exportAnnotatedImage: async () => "/Capture/export.png",
      exportPackage: async () => ({
        folderPath: "/Capture/export",
        zipPath: "/Capture/export.zip",
        count: 0,
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
  { snapshot, drawing, text, drawingSource, markdown, blankPng },
);
await page.goto("http://127.0.0.1:4177/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: out("debug.png") });
await writeFile(
  out("debug.json"),
  JSON.stringify(
    { body: await page.locator("body").innerText(), errors },
    null,
    2,
  ),
);
await page.getByTestId("workspace").waitFor({ timeout: 20000 });
await page.getByTestId("screenshot-architecture").click();
await page.getByTestId("drawing-editor").waitFor({ timeout: 20000 });
await page.getByRole("button", { name: "Zoom out" }).click();
await page.getByRole("button", { name: "Zoom out" }).click();
await page.getByRole("button", { name: "Zoom out" }).click();
await page.screenshot({ path: out("drawing-025.png") });
await sharp(out("drawing-025.png"))
  .webp({ quality: 92 })
  .toFile(out("drawing-025.webp"));
await page.getByTestId("screenshot-brief").click();
await page.getByTestId("markdown-input").waitFor({ timeout: 10000 });
await page
  .getByTestId("markdown-input")
  .fill(
    "# Checkout review\n\nMake **Save changes** the primary action and keep it aligned with the form.\n\n## Acceptance\n\n- The primary action remains visible at 320 px\n- Cancel stays secondary\n- The validation message names the affected field",
  );
await page.waitForTimeout(900);
await page.screenshot({ path: out("markdown-editing.png") });
await sharp(out("markdown-editing.png"))
  .webp({ quality: 92 })
  .toFile(out("markdown-editing.webp"));
await page.getByRole("button", { name: "Preview" }).click();
await page.getByLabel("Markdown preview").waitFor({ timeout: 10000 });
await page.screenshot({ path: out("markdown-025.png") });
await sharp(out("markdown-025.png"))
  .webp({ quality: 92 })
  .toFile(out("markdown-025.webp"));
await writeFile(
  out("capture-report.json"),
  JSON.stringify(
    {
      tag: "v0.2.5",
      commit: "bd33da45fac5bf05f20e6cdb9f66c5db709b3bdf",
      viewport: "1600x1000",
      bridge:
        "in-memory Electron file bridge; actual tagged React renderer and Excalidraw editor",
      fixture: "schema 4 mixed collection: drawing followed by Markdown",
      errors: errors.filter(
        (message) =>
          !message.includes("excalidraw") ||
          !message.includes("Content Security Policy"),
      ),
      warnings: [
        "Excalidraw requested remote font assets which the tagged app CSP blocked in this browser capture. The authored text uses Excalidraw fontFamily 2 (system font) and rendered visibly.",
      ],
      limitations: [
        "The bridge replaces only local Electron persistence with in-memory fixture data. This capture demonstrates UI, ordering, and autosave state; it does not verify Electron on-disk persistence or a native export folder.",
      ],
    },
    null,
    2,
  ),
);
await browser.close();
