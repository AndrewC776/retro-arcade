#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$ROOT_DIR/build"
ENTRY_FILE="$ROOT_DIR/jsnes-lite/index.js"
TEMPLATE_FILE="$ROOT_DIR/html_template.html"

mkdir -p "$BUILD_DIR"

# Bundle jsnes-lite by concatenation
cat \
  "$ROOT_DIR/jsnes-lite/utils.js" \
  "$ROOT_DIR/jsnes-lite/controller.js" \
  "$ROOT_DIR/jsnes-lite/tile.js" \
  "$ROOT_DIR/jsnes-lite/cpu.js" \
  "$ROOT_DIR/jsnes-lite/mappers.js" \
  "$ROOT_DIR/jsnes-lite/papu.js" \
  "$ROOT_DIR/jsnes-lite/ppu.js" \
  "$ROOT_DIR/jsnes-lite/rom.js" \
  "$ROOT_DIR/jsnes-lite/nes.js" \
  "$ROOT_DIR/jsnes-lite/index.js" \
  "$ROOT_DIR/source/document.js" \
  "$ROOT_DIR/source/main.js" \
  > "$BUILD_DIR/jsnes.bundle.js"

npx uglify-js "$BUILD_DIR/jsnes.bundle.js" \
  --compress \
  --mangle toplevel \
  --mangle-props 'regex=/^(?:_|[A-Z]|f_|cnt|reg|spr|pt|nt|vram|pal|smp|cur|scan|last|hit|bg|img|name|clip|dummy|nmi|irq|frame|sample|master|derived|channel|length|square|triangle|noise|dmc|stereo|panning|acc|prev|dc|dac|rom|mapper|op|cycle|mem|cpu|ppu|papu)/' \
  -o "$BUILD_DIR/jsnes.min.1.js"

npx roadroller -Zab14 -Zlr930 -Zmd19 -Zpr14 -S0,1,2,3,7,13,14,19,58,97,305,422 "$BUILD_DIR/jsnes.min.1.js" -o "$BUILD_DIR/jsnes.min.js"

# Embed source into HTML
sed -e "/NES_SOURCE/{r $BUILD_DIR/jsnes.min.js" -e 'd;}' "$TEMPLATE_FILE" > "$BUILD_DIR/index.html"

# Build ZIP
rm -f -- "$BUILD_DIR/game.zip"
(cd "$BUILD_DIR" && zip -q game.zip index.html)

if command -v advzip >/dev/null 2>&1; then
  advzip -z -4 "$BUILD_DIR/game.zip"
fi

ls -la "$BUILD_DIR"
