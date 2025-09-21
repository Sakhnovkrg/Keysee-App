import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const presetsDir = "presets";
const baseUrl = 'https://raw.githubusercontent.com/Sakhnovkrg/Keysee-App/presets/';

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

const lastCommit = execSync("git rev-parse HEAD").toString().trim();

const presets = [];

fs.readdirSync(presetsDir, { withFileTypes: true }).forEach((dirent) => {
  if (dirent.isDirectory()) {
    const presetPath = path.join(presetsDir, dirent.name, "preset.json");
    const metaPath = path.join(presetsDir, dirent.name, "meta.json");
    const screenshotPath = path.join(presetsDir, dirent.name, "screenshot.webp");

    if (!fs.existsSync(presetPath) || !fs.existsSync(metaPath)) return;

    const preset = JSON.parse(fs.readFileSync(presetPath, "utf-8"));
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    presets.push({
      id: dirent.name,
      preset: preset,
      meta: meta,
      
      presetUrl: `${dirent.name}/preset.json`,
      metaUrl: `${dirent.name}/meta.json`,
      screenshotUrl: fs.existsSync(screenshotPath)
        ? `${dirent.name}/screenshot.webp`
        : null,

      presetHash: hashFile(presetPath),
      metaHash: hashFile(metaPath),
      screenshotHash: fs.existsSync(screenshotPath)
        ? hashFile(screenshotPath)
        : null
    });
  }
});

const index = {
  lastCommit,
  baseUrl,
  presets
};

fs.writeFileSync(
  path.join(presetsDir, "index.json"),
  JSON.stringify(index, null, 2)
);

console.log("✅ index.json updated");
