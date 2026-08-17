import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${relative(root, path)}: ${error.message}`);
    return {};
  }
}

function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const target = join(path, entry.name);
    if (entry.name === ".git" || entry.name === "dist" || entry.name === "node_modules") return [];
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function getTranslation(translations, dottedKey) {
  return dottedKey.split(".").reduce((value, part) => value?.[part], translations);
}

const manifest = readJson(join(root, "module.json"));
const translations = readJson(join(root, "lang", "ru.json"));
const packageJson = readJson(join(root, "package.json"));

if (manifest.id !== "foundry-quest-log-ru") errors.push("module.json: неверный id");
if (manifest.version !== packageJson.version) errors.push("Версии module.json и package.json не совпадают");
if (manifest.compatibility?.verified !== "14.366") errors.push("module.json: verified должен быть 14.366");
if (manifest.compatibility?.maximum !== "14") errors.push("module.json: maximum должен ограничивать выпуск v14");

for (const path of [...(manifest.esmodules ?? []), ...(manifest.styles ?? []), ...(manifest.languages ?? []).map((item) => item.path)]) {
  if (!existsSync(join(root, path))) errors.push(`module.json: отсутствует ${path}`);
}

const files = walk(root);
const forbiddenExtensions = new Set([".ldb", ".log", ".pdf", ".webp", ".png", ".jpg", ".jpeg", ".mp3", ".ogg", ".woff", ".woff2"]);
for (const file of files) {
  if (forbiddenExtensions.has(extname(file).toLowerCase())) {
    errors.push(`Запрещённый бинарный или исходный ресурс: ${relative(root, file)}`);
  }
}

for (const file of files.filter((path) => [".js", ".mjs"].includes(extname(path)))) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    errors.push(`${relative(root, file)}: синтаксическая ошибка JavaScript\n${error.stderr?.toString() ?? error.message}`);
  }
}

const sourceFiles = files.filter((path) => [".js", ".mjs", ".hbs"].includes(extname(path)));
const localizationKeys = new Set();
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/["'](FQLR(?:\.[A-Za-z0-9]+)+)["']/g)) localizationKeys.add(match[1]);
}
for (const key of localizationKeys) {
  if (typeof getTranslation(translations, key) !== "string") errors.push(`Нет перевода ключа ${key}`);
}

const css = readFileSync(join(root, "styles", "quest-log.css"), "utf8");
if (/hyphens\s*:\s*auto/i.test(css)) errors.push("CSS: запрещено hyphens: auto");
if (/overflow-wrap\s*:\s*anywhere/i.test(css)) errors.push("CSS: запрещено overflow-wrap: anywhere");

const requiredFiles = ["README.md", "LICENSE", "NOTICE.md", "CHANGELOG.md", "module.json"];
for (const file of requiredFiles) {
  const path = join(root, file);
  if (!existsSync(path) || statSync(path).size === 0) errors.push(`Отсутствует обязательный файл ${file}`);
}

if (errors.length) {
  console.error(`Проверка не пройдена (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Проверка пройдена: ${files.length} файлов, ${localizationKeys.size} ключей локализации.`);
