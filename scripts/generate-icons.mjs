/**
 * Generates the PWA icon PNGs into /public from an inline SVG.
 * One-off/dev-only. Run with: `npm install --no-save sharp && node scripts/generate-icons.mjs`
 * The emerald "package" mark (Lucide) is drawn as vector paths, so no fonts are needed.
 */
import { writeFileSync } from "node:fs"
import sharp from "sharp"

const EMERALD = "#059669"

// 512x512 icon: emerald rounded square + centered white package glyph.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${EMERALD}"/>
  <g transform="translate(116 116) scale(11.67)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="M3.3 7 12 12l8.7-5"/>
    <path d="M12 22V12"/>
  </g>
</svg>`

// Maskable: same but the glyph is a bit smaller to sit inside the safe zone.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${EMERALD}"/>
  <g transform="translate(146 146) scale(8.75)" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="M3.3 7 12 12l8.7-5"/>
    <path d="M12 22V12"/>
  </g>
</svg>`

const svg = Buffer.from(icon)
const svgMaskable = Buffer.from(maskable)

async function png(source, size, out) {
  await sharp(source).resize(size, size).png().toFile(`public/${out}`)
  console.log(`wrote public/${out}`)
}

await png(svg, 192, "icon-192.png")
await png(svg, 512, "icon-512.png")
await png(svg, 180, "apple-icon.png")
await png(svgMaskable, 512, "icon-maskable-512.png")

// Keep the source SVG around for reference.
writeFileSync("public/icon.svg", icon)
console.log("wrote public/icon.svg")
