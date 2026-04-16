/**
 * Compresses every MP4 in assets/videos/ to 720px wide, H.264, no audio.
 * Uses the ffmpeg binary bundled with ffmpeg-static — no system install needed.
 *
 * Run: node scripts/compress-videos.mjs
 */
import { execFileSync } from "child_process";
import { readdirSync, renameSync, statSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { createRequire } from "module";

const require   = createRequire(import.meta.url);
const ffmpegBin = require("ffmpeg-static");

const VIDEOS_DIR = new URL("../assets/videos/", import.meta.url).pathname
  .replace(/^\/([A-Z]:)/, "$1"); // fix Windows path: /C:/... → C:/...

const videos = readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mp4"));

console.log(`\nffmpeg: ${ffmpegBin}`);
console.log(`Found ${videos.length} videos to compress\n`);

for (const file of videos) {
  const input  = join(VIDEOS_DIR, file);
  const output = join(VIDEOS_DIR, `__compressed_${file}`);
  const before = statSync(input).size;

  console.log(`▶  ${file}  (${(before / 1024 / 1024).toFixed(1)} MB)`);

  try {
    execFileSync(ffmpegBin, [
      "-i",  input,
      // Scale: width = 720, height proportional (multiple of 2 for H.264)
      "-vf", "scale=720:-2",
      // H.264 + good-quality compression, no audio (player is muted anyway)
      "-c:v", "libx264",
      "-crf", "26",
      "-preset", "fast",
      "-pix_fmt", "yuv420p",
      "-an",          // strip audio
      "-movflags", "+faststart",  // moov atom at front for faster seek
      "-y",           // overwrite output
      output,
    ], { stdio: ["ignore", "ignore", "pipe"] });

    const after = statSync(output).size;
    const saved = (((before - after) / before) * 100).toFixed(0);
    console.log(`   ✓  ${(after / 1024 / 1024).toFixed(1)} MB  (saved ${saved}%)\n`);

    // Replace original with compressed
    renameSync(output, input);
  } catch (err) {
    console.error(`   ✗  Failed: ${err.message}\n`);
    // Leave original untouched
  }
}

console.log("Done.");
