#!/usr/bin/env bash
# Copy only the public site (not DESIGN.md, README, or raw photos) into dist/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/dist"

rm -rf "$DEST"
mkdir -p "$DEST"

cp "$ROOT/index.html" "$ROOT/project.html" "$DEST/"
cp -R "$ROOT/css" "$ROOT/js" "$ROOT/assets" "$DEST/"

# Netlify: SPA-style 404 is unnecessary; keep a clean public folder only.
printf 'User-agent: *\nAllow: /\n' > "$DEST/robots.txt"

echo "Packed public site → dist/"
echo "Upload the dist/ folder (not the repo) to Netlify Drop or Firebase Hosting."
