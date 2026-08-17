import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "module.json"), "utf8"));
const moduleId = manifest.id;
const dist = join(root, "dist");
const packageRoot = join(dist, moduleId);
const zipPath = join(dist, `${moduleId}.zip`);

if (dirname(dist) !== root || moduleId !== "foundry-quest-log-ru") {
  throw new Error("Отказ от сборки: неожиданный путь назначения или id модуля");
}

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(packageRoot, { recursive: true });

const files = [
  "module.json",
  "README.md",
  "LICENSE",
  "NOTICE.md",
  "CHANGELOG.md",
  "NOTICE-assets.txt",
  "index.js",
  "index.js.map",
  "languages",
  "scripts",
  "styles",
  "templates",
  "assets",
  "storage",
];

for (const file of files) cpSync(join(root, file), join(packageRoot, file), { recursive: true });
cpSync(join(root, "module.json"), join(dist, "module.json"));
execFileSync("zip", ["-qr", zipPath, moduleId], { cwd: dist, stdio: "inherit" });

console.log(`Собрано: ${zipPath}`);
