import { cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicFiles = [
  "index.html",
  "404.html",
  "features.html",
  "changelog.html",
  "install.html",
  "agents.html",
  "styles.css",
  "script.js",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "LICENSE",
  ".htaccess",
];

function relativeToRoot(target) {
  const relative = path.relative(root, target);
  if (
    relative === "" ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Path is outside the project root: ${target}`);
  }
  return relative;
}

async function assertRegularFile(source) {
  relativeToRoot(source);
  const stat = await lstat(source);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error(`Expected a regular file: ${relativeToRoot(source)}`);
  }
}

async function assertSafeDirectory(source) {
  relativeToRoot(source);
  const stat = await lstat(source);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error(`Expected a directory: ${relativeToRoot(source)}`);
  }
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const child = path.join(source, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(
        `Symbolic links are not publishable: ${relativeToRoot(child)}`,
      );
    }
    if (entry.isDirectory()) await assertSafeDirectory(child);
    else if (!entry.isFile()) {
      throw new Error(`Unsupported asset entry: ${relativeToRoot(child)}`);
    }
  }
}

try {
  const stat = await lstat(dist);
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(
      "Refusing to clean a non-directory or symbolic-link dist path",
    );
  }
  await rm(dist, { recursive: true, force: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

await mkdir(dist);
for (const name of publicFiles) {
  const source = path.join(root, name);
  await assertRegularFile(source);
  await cp(source, path.join(dist, name));
}

const assets = path.join(root, "assets");
await assertSafeDirectory(assets);
await cp(assets, path.join(dist, "assets"), {
  recursive: true,
  verbatimSymlinks: true,
});

console.log(
  `Built ${publicFiles.length} public files and assets into ${relativeToRoot(dist)}.`,
);
