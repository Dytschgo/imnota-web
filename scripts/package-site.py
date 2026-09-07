"""Package only public static files for Hostinger; no install or build needed."""

from datetime import datetime
from hashlib import sha256
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parent.parent
files = [
    root / name
    for name in (
        "index.html", "404.html", "styles.css", "script.js", ".htaccess",
        "robots.txt", "sitemap.xml", "LICENSE",
    )
]
files += sorted(path for path in (root / "assets").rglob("*") if path.is_file())
for path in files:
    if not path.is_file() or path.is_symlink() or not path.resolve().is_relative_to(root):
        raise ValueError(f"Invalid public file: {path.relative_to(root)}")

output = root / ".qa"
output.mkdir(exist_ok=True)
archive = output / f"{root.name}_{datetime.now():%Y%m%d_%H%M%S}.zip"
with ZipFile(archive, "x", ZIP_DEFLATED) as bundle:
    for path in files:
        bundle.write(path, path.relative_to(root).as_posix())
print(archive)
print(f"{len(files)} files; SHA-256 {sha256(archive.read_bytes()).hexdigest()}")
