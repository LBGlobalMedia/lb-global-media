// One-off asset normalization: copies curated source assets from Media/ into public/,
// and resolves each titles.csv row to its actual poster file regardless of naming.
// Run manually with: node scripts/prepare-assets.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MEDIA = path.join(ROOT, "Media");
const PUBLIC = path.join(ROOT, "public");

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
}

// Some partner logos ship with a flat, uniform background baked in (a solid
// card behind the mark) instead of real transparency. On our dark logo strip
// that shows up as a visible rectangle. Chroma-key it out: sample the corner
// color and fade anything close to it to transparent, with a soft ramp so
// anti-aliased edges (e.g. a circular badge) don't get a hard cutout halo.
async function copyChromaKeyed(
  src,
  dest,
  { lowThreshold = 18, highThreshold = 40, featherSigma = 0 } = {}
) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const img = sharp(src);
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const [cr, cg, cb] = [data[0], data[1], data[2]];

  for (let i = 0; i < data.length; i += channels) {
    const dr = data[i] - cr;
    const dg = data[i + 1] - cg;
    const db = data[i + 2] - cb;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= lowThreshold) {
      data[i + 3] = 0;
    } else if (dist < highThreshold) {
      const t = (dist - lowThreshold) / (highThreshold - lowThreshold);
      data[i + 3] = Math.round(data[i + 3] * t);
    }
  }

  if (featherSigma > 0) {
    // A tight color-distance threshold (needed when foreground and
    // background are nearly the same color) collapses the antialiased
    // transition down to almost nothing, leaving hard/jagged edges. Soften
    // just the alpha channel with a slight blur — safe here because on
    // both sides of every edge we key this way, the RGB is already the
    // same color, so blurring opacity alone can't introduce color fringing.
    const alpha = Buffer.alloc(width * height);
    for (let i = 0, j = 0; i < data.length; i += channels, j++) alpha[j] = data[i + 3];
    // toColourspace('b-w') is required here — sharp silently expands a
    // single-channel raw buffer to 3-channel RGB partway through .blur(),
    // which would otherwise misalign every read below into stripes of
    // garbage (verified: raw() output was 3x the expected byte length).
    const blurred = await sharp(alpha, { raw: { width, height, channels: 1 } })
      .blur(featherSigma)
      .toColourspace("b-w")
      .raw()
      .toBuffer();
    for (let i = 0, j = 0; i < data.length; i += channels, j++) data[i + 3] = blurred[j];
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(dest);
  console.log(`  ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)} (chroma-keyed transparent)`);
}

// Genuinely-transparent source that just needs its padding trimmed to a
// tight bounding box, so the logo fills its card the same way the others do.
async function copyTrimmed(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(src).trim().png().toFile(dest);
  console.log(`  ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)} (trimmed)`);
}

// Recolors near-grey (low-saturation) opaque pixels to white, leaving any
// saturated color untouched, then trims. For logos that are genuinely
// transparent already but ship with a dark-grey wordmark meant for a light
// background — unreadable at that grey against our near-black site
// background, the same problem amazon.png had but via a real alpha channel
// this time rather than a baked-in card, so no chroma-keying needed.
async function copyRecoloredGreyToWhite(src, dest, { greyTolerance = 12 } = {}) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const isGreyish = Math.max(r, g, b) - Math.min(r, g, b) < greyTolerance;
    if (isGreyish) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).trim().png().toFile(dest);
  console.log(`  ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)} (grey text recolored to white, trimmed)`);
}

console.log("Brand:");
copy(
  path.join(MEDIA, "BRAND", "lb-global-media-gradient-1280x390.png"),
  path.join(PUBLIC, "brand", "logo.png")
);
copy(
  path.join(MEDIA, "BRAND", "lb-global-media-gradient-2560x780.png"),
  path.join(PUBLIC, "brand", "logo-lg.png")
);

console.log("Partners:");
const PARTNERS = path.join(MEDIA, "PARTNERS");

// Plain copies — these already have real (or acceptably close-to-theme) transparency.
const partnerMap = {
  "tubi.png": "Tubi-Logo.png",
  "digitalvirgo.webp": "DV_Square_No-Baseline_white.webp",
  "hoopla.png": "hoopla-logo-blue copy.png",
};
for (const [destName, srcName] of Object.entries(partnerMap)) {
  copy(path.join(PARTNERS, srcName), path.join(PUBLIC, "partners", destName));
}

// Chroma-keyed copies — these ship with a flat solid background baked in
// (navy / charcoal / near-black card behind the mark) that would otherwise
// show as a visible rectangle now that logos render at full opacity.
const chromaKeyMap = {
  "boxbrazil.png": "Box Brazil 2.jpg",
  "futuretoday.png": "ft-dark-bg.png",
  "ottstudio.png": "OTT Studio logo.jpg",
};
for (const [destName, srcName] of Object.entries(chromaKeyMap)) {
  await copyChromaKeyed(path.join(PARTNERS, srcName), path.join(PUBLIC, "partners", destName));
}

// Amazon's white wordmark ships on a near-white (247,247,247) card rather
// than true transparency — and since the wordmark itself is a flat white
// (255,255,255), it sits only ~14 units away from the card color in RGB
// space. The default chroma-key thresholds (18/40) would treat that as
// "close enough to background" and erase the text along with the card, so
// this one needs much tighter thresholds tuned to the actual gap between
// the two (verified against the source's pixel histogram: background is a
// clean 247, text a clean 255, with only a thin antialiased band between).
// That tight a threshold leaves almost no ramp to work with, so the cutout
// comes out visibly jagged — featherSigma re-softens just the alpha edge
// afterward.
await copyChromaKeyed(
  path.join(PARTNERS, "amazon-white.png.png"),
  path.join(PUBLIC, "partners", "amazon.png"),
  { lowThreshold: 3, highThreshold: 9, featherSigma: 1 }
);

// Google Play ships with real transparency, but its wordmark is a flat dark
// grey (~95,99,104) meant for a light background — unreadable against our
// near-black one. The triangle icon's colors are far outside grey (each
// channel differs by well more than 12), so recoloring only near-grey
// pixels leaves the icon untouched.
await copyRecoloredGreyToWhite(
  path.join(PARTNERS, "Google-Play-Logo.png"),
  path.join(PUBLIC, "partners", "googleplay.png")
);

// YouTube Movies already ships with a genuinely transparent background and
// a white wordmark — no recoloring needed, just trim the padding.
await copyTrimmed(
  path.join(PARTNERS, "Youtube-Movies-Logo.png"),
  path.join(PUBLIC, "partners", "youtubemovies.png")
);

console.log("Production:");
copy(
  path.join(MEDIA, "PRODUCTION", "our-global-footprint-map.png"),
  path.join(PUBLIC, "production", "our-global-footprint-map.png")
);
copy(
  path.join(MEDIA, "PRODUCTION", "519000_IP.jpg"),
  path.join(PUBLIC, "production", "masterclass-wide.jpg")
);

// Home / hero octagon video — NOT run as part of this script, since it needs
// the `ffmpeg` binary rather than sharp. Source: Media/HOME/octagon-reel-1-hero-d02.mp4
// (1920x1080 h264, 25fps, 10.6MB, 27.4s). Re-run this command by hand if the
// source clip is ever replaced — it center-crops the 16:9 source to a 1:1
// square (matching the object-cover crop the octagon already applies at
// render time, so no extra content is lost), downscales to 720x720 (2x the
// largest on-screen render size, 560px, for retina), strips the unused audio
// track (video is always muted), and adds +faststart for progressive playback:
//
//   ffmpeg -i "Media/HOME/octagon-reel-1-hero-d02.mp4" \
//     -vf "crop=1080:1080:420:0,scale=720:720" \
//     -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart \
//     public/home/hero-octagon.mp4
//
// Poster frame (shown for first paint, before the video loads) extracted from
// the transcoded output at the 1s mark:
//
//   ffmpeg -ss 1 -i public/home/hero-octagon.mp4 -frames:v 1 -q:v 3 \
//     public/home/hero-octagon-poster.jpg
//
// Result: 10.6MB -> 2.6MB video, plus a 17KB poster.
//
// Catalogue and Production hero octagons follow the identical treatment,
// same source specs (1920x1080 h264, 25fps), same crop/scale/strip/poster
// commands, just different source files and output directories. Despite the
// "hero"/"catalogue"/"production" suffixes on all three source filenames,
// each clip is used on its correspondingly-named page only:
//
//   ffmpeg -i "Media/HOME/octagon-reel-2-catalogue-d02.mp4" \
//     -vf "crop=1080:1080:420:0,scale=720:720" \
//     -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart \
//     public/catalogue/hero-octagon.mp4
//   ffmpeg -ss 10 -i public/catalogue/hero-octagon.mp4 -frames:v 1 -q:v 3 \
//     public/catalogue/hero-octagon-poster.jpg
//   (10.5MB -> 2.4MB; poster taken at the 10s mark — the 1s frame on this
//   clip is a washed-out, abstract lens-flare shot, not representative)
//
//   ffmpeg -i "Media/HOME/octagon-reel-3-production-d02.mp4" \
//     -vf "crop=1080:1080:420:0,scale=720:720" \
//     -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart \
//     public/production/hero-octagon.mp4
//   ffmpeg -ss 1 -i public/production/hero-octagon.mp4 -frames:v 1 -q:v 3 \
//     public/production/hero-octagon-poster.jpg
//   (10.5MB -> 3.0MB)

console.log("Home / masterclass photos:");
const MASTERCLASS = path.join(
  MEDIA,
  "HOME",
  "PHOTOS - IP IS YOUR ASSET 17th JAN 2026 MASTERCLASS"
);
const masterclassPicks = ["90000_IP.jpg", "650000_IP.jpg", "655000_IP.jpg"];
masterclassPicks.forEach((name, i) => {
  copy(path.join(MASTERCLASS, name), path.join(PUBLIC, "home", "masterclass", `photo-${i + 1}.jpg`));
});

console.log("Home / film stills:");
const STILLS = path.join(MEDIA, "HOME", "Film stills");
const stillsPicks = [
  "Beyond Our End 1.png",
  "From Her Bones 2.jpg",
  "Tender Resistance 1.png",
  "Where We Begin 3.png",
  "Love Evolving - still 5.jpg",
  "Sans Amour.png",
  "FREAKS_SCOPE_0032.jpg",
  "Remembering His Touch 9.jpg",
];
stillsPicks.forEach((name, i) => {
  copy(path.join(STILLS, name), path.join(PUBLIC, "home", "stills", `still-${i + 1}${path.extname(name).toLowerCase()}`));
});

console.log("Titles: resolving posters...");
const TITLES = path.join(MEDIA, "TITLES");
const OTHER = path.join(TITLES, "Other Titles");

// Slugs that have their own folder directly under Media/TITLES (poster.<ext>.<ext>)
function firstFileIn(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const file = entries.find((e) => e.isFile());
  return file ? path.join(dir, file.name) : null;
}

// Explicit overrides for slugs whose asset filenames don't match the slug at all,
// or where multiple candidate posters exist (see README-assets.md for rationale).
const explicitOverrides = {
  // Two candidate posters live in this title's folder (plus its new
  // Stills folder) — kept as an explicit override, unlike the other
  // slugs below, specifically to keep picking "Poster 2 (Amazon)"
  // deterministically rather than whatever fs.readdirSync happens to
  // return first between the two.
  "the-first-taste": path.join(OTHER, "the-first-taste", "The First Taste_Poster 2 (Amazon).png"),
  // these-untold-secrets, when-you-look-beneath-the-skin, and
  // love-is-never-far overrides removed: their posters now each live in
  // their own Other Titles/<slug>/ subfolder (alongside new Stills
  // folders), so the default per-slug resolution below finds them
  // correctly — these overrides were pointing at the old flat-file
  // locations and had gone stale.
  "before-the-dawn-breaks": path.join(OTHER, "before-the-dawn", "BEFORE-THE-DAWN-BREAKS-AMAZON-1200x1600.png"),
};

function resolvePoster(slug) {
  if (explicitOverrides[slug]) return explicitOverrides[slug];
  const topLevel = path.join(TITLES, slug);
  if (fs.existsSync(topLevel)) {
    const f = firstFileIn(topLevel);
    if (f) return f;
  }
  const otherLevel = path.join(OTHER, slug);
  if (fs.existsSync(otherLevel)) {
    const f = firstFileIn(otherLevel);
    if (f) return f;
  }
  return null;
}

const csvRaw = fs.readFileSync(path.join(TITLES, "titles.csv"), "utf-8");
// Minimal CSV split just to pull slugs (col 1) for this asset step; the app's real
// parser (src/lib/titles.ts) handles quoting properly for actual field data.
const lines = csvRaw.split(/\r?\n/).filter(Boolean);
const slugs = new Set();
for (let i = 1; i < lines.length; i++) {
  const slug = lines[i].split(",")[0].trim();
  if (slug) slugs.add(slug);
}

const missing = [];
const manifest = {};
for (const slug of slugs) {
  const src = resolvePoster(slug);
  if (!src) {
    missing.push(slug);
    continue;
  }
  const ext = path.extname(src).toLowerCase() || ".jpg";
  copy(src, path.join(PUBLIC, "titles", slug, `poster${ext}`));
  manifest[slug] = `/titles/${slug}/poster${ext}`;
}

fs.writeFileSync(
  path.join(PUBLIC, "titles", "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log(`Wrote poster manifest for ${Object.keys(manifest).length} slugs.`);

if (missing.length) {
  console.warn("\nWARNING: could not resolve a poster for:", missing.join(", "));
} else {
  console.log(`\nResolved posters for all ${slugs.size} unique title slugs.`);
}

console.log("\nTitles: resolving stills (up to 3 per title)...");

// Folders whose name doesn't match the slug at all (mirrors the poster
// overrides above, for the one slug that has a Stills folder to find).
const folderNameOverrides = {
  "before-the-dawn-breaks": path.join(OTHER, "before-the-dawn"),
};

function resolveTitleFolder(slug) {
  if (folderNameOverrides[slug]) return folderNameOverrides[slug];
  const topLevel = path.join(TITLES, slug);
  if (fs.existsSync(topLevel)) return topLevel;
  const otherLevel = path.join(OTHER, slug);
  if (fs.existsSync(otherLevel)) return otherLevel;
  return null;
}

// Manual picks for specific titles where the default "first N alphabetically"
// selection isn't the best set of shots — order matters (first entry becomes
// still-1, etc). Filenames are relative to that title's Stills folder.
const stillPicksOverrides = {
  "no-place-to-hide": [
    "Screenshot 2026-08-20 173544.png",
    "Screenshot 2026-08-20 173429.png",
    "Screenshot 2026-08-20 173619.png",
  ],
  // Default case-sensitive alphabetical sort puts these out of numeric order
  // ("Like the First Time - Still 2.jpg" sorts before the lowercase-l
  // "like the first time still 1.png").
  "like-the-first-time": [
    "like the first time still 1.png",
    "Like the First Time - Still 2.jpg",
    "Like the First Time - Still 3.jpg",
  ],
  // Default alphabetical sort (Still-1, Still-10, Still-11) happened to pick
  // three shots that all feature women, skewing away from the anthology's
  // other segments. Swap in Still-2 (father + his gifted caretaker) and
  // Still-3 (the "lonely man" segment) so the stills better represent the
  // range of stories; Still-11 is kept as a strong shot from the segment
  // that otherwise dominates this folder (Stills 4-12).
  "an-artificial-life": [
    "An-Artificial-Life-Still-2.jpg",
    "An-Artificial-Life-Still-3.jpg",
    "An-Artificial-Life-Still-11.png",
  ],
};

function resolveStills(slug, max = 3) {
  const folder = resolveTitleFolder(slug);
  if (!folder) return [];
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  const stillsDirEntry = entries.find((e) => e.isDirectory() && /^stills?$/i.test(e.name));
  if (!stillsDirEntry) return [];
  const stillsDir = path.join(folder, stillsDirEntry.name);

  if (stillPicksOverrides[slug]) {
    return stillPicksOverrides[slug].map((name) => path.join(stillsDir, name));
  }

  const files = fs
    .readdirSync(stillsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(jpe?g|png|webp)$/i.test(e.name))
    .map((e) => e.name)
    .sort();
  return files.slice(0, max).map((name) => path.join(stillsDir, name));
}

let titlesWithStills = 0;
let titlesWithoutStills = [];
for (const slug of slugs) {
  // copy() only ever writes/overwrites by name — it never removes a
  // destination file whose source no longer resolves to that slot (e.g. a
  // leftover still-1.jpg from before a slug picked up a still-1.png). Clear
  // the directory first so every run reflects exactly resolveStills' current
  // output, not an accumulation of whatever's ever been written there.
  fs.rmSync(path.join(PUBLIC, "titles", slug, "stills"), { recursive: true, force: true });

  const stillPaths = resolveStills(slug);
  if (stillPaths.length === 0) {
    titlesWithoutStills.push(slug);
    continue;
  }
  titlesWithStills++;
  stillPaths.forEach((src, i) => {
    const ext = path.extname(src).toLowerCase() || ".jpg";
    copy(src, path.join(PUBLIC, "titles", slug, "stills", `still-${i + 1}${ext}`));
  });
}

console.log(`\nCopied stills for ${titlesWithStills} of ${slugs.size} title slugs.`);
if (titlesWithoutStills.length) {
  console.log("No stills available for:", titlesWithoutStills.join(", "));
}
