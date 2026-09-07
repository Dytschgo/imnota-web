"""Build and package the exact static site payload for manual Hostinger uploads."""

from datetime import datetime
from hashlib import sha256
from pathlib import Path
from subprocess import run
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parent.parent
dist = root / "dist"
output = root / ".qa"

run(["node", "scripts/build-site.mjs"], cwd=root, check=True)

if dist.is_symlink() or not dist.is_dir() or not dist.resolve().is_relative_to(root):
    raise ValueError("Invalid dist directory")

files = sorted(path for path in dist.rglob("*") if path.is_file())
if not files:
    raise ValueError("Build produced no files")
for path in files:
    if path.is_symlink() or not path.resolve().is_relative_to(dist):
        raise ValueError(f"Invalid build file: {path.relative_to(dist)}")

output.mkdir(exist_ok=True)
archive = output / f"{root.name}_{datetime.now():%Y%m%d_%H%M%S}.zip"
with ZipFile(archive, "x", ZIP_DEFLATED) as bundle:
    for path in files:
        bundle.write(path, path.relative_to(dist).as_posix())
print(archive)
print(f"{len(files)} files; SHA-256 {sha256(archive.read_bytes()).hexdigest()}")
