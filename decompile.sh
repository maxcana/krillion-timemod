#!/usr/bin/env bash
# webcrack (deobfuscate only) -> wakaru (unpack + unminify)
set -uo pipefail

export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=8192"

OUT1="deob"
OUT2="decomp"

rm -rf "$OUT1"
rm -rf "$OUT2"

mkdir -p "$OUT1"
mkdir -p "$OUT2"

echo "[running webcrack...]"

for file in krillion.io/_next/static/chunks/*.js; do
    name_ext="${file##*/}"
    name_only="${name_ext%.*}"

    pnpm dlx webcrack --no-unpack --no-unminify "krillion.io/_next/static/chunks/$name_only.js" > "$OUT1/$name_only.js"
done

echo "[running wakaru...]"
pnpm dlx wakaru "$OUT1" -o "$OUT2" --unpack --level aggressive --formatter

# echo "removing $OUT1..."
# rm -r "$OUT1"