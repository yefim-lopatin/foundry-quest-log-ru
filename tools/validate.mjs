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
const translationPath = join(root, "languages", "ru.json");
const translations = readJson(translationPath);
const packageJson = readJson(join(root, "package.json"));

if (manifest.id !== "foundry-quest-log-ru") errors.push("module.json: неверный id");
if (manifest.version !== packageJson.version) errors.push("Версии module.json и package.json не совпадают");
if (manifest.compatibility?.verified !== "14.367") errors.push("module.json: verified должен быть 14.367");
if (manifest.compatibility?.maximum !== "14") errors.push("module.json: maximum должен ограничивать выпуск v14");
if (manifest.persistentStorage !== true) errors.push("module.json: persistentStorage должен быть true");
if (!(manifest.esmodules ?? []).includes("index.js")) errors.push("module.json: отсутствует основной index.js");

for (const path of [...(manifest.esmodules ?? []), ...(manifest.styles ?? []), ...(manifest.languages ?? []).map((item) => item.path)]) {
  if (!existsSync(join(root, path))) errors.push(`module.json: отсутствует ${path}`);
}

const files = walk(root);
const forbiddenExtensions = new Set([".ldb", ".log", ".mp3", ".ogg", ".wav"]);
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
  for (const match of source.matchAll(/["'](foundry-quest-log-ru(?:\.[A-Za-z0-9_-]+)+)["']/g)) localizationKeys.add(match[1]);
}
for (const key of localizationKeys) {
  if (typeof getTranslation(translations, key) !== "string") errors.push(`Нет перевода ключа ${key}`);
}

function countLeaves(value) {
  return Object.values(value).reduce((count, item) => count + (item && typeof item === "object" ? countLeaves(item) : 1), 0);
}

const localeRoot = translations[manifest.id];
if (!localeRoot || typeof localeRoot !== "object") errors.push(`Локализация: отсутствует корень ${manifest.id}`);
if (countLeaves(translations) < 308) errors.push(`Локализация: ожидалось не менее 308 ключей, найдено ${countLeaves(translations)}`);

const simpleQuestReferences = files
  .filter((file) => [".js", ".mjs", ".hbs", ".css", ".json"].includes(extname(file)))
  .filter((file) => /modules\/simple-quest|flags\.simple-quest|(?:^|["'])id["']?\s*:\s*["']simple-quest/.test(readFileSync(file, "utf8")));
if (simpleQuestReferences.length) errors.push(`Остались старые пути simple-quest: ${simpleQuestReferences.map((file) => relative(root, file)).join(", ")}`);

const css = readFileSync(join(root, "styles", "module.css"), "utf8");
if (/hyphens\s*:\s*auto/i.test(css)) errors.push("CSS: запрещено hyphens: auto");
if (/overflow-wrap\s*:\s*anywhere/i.test(css)) errors.push("CSS: запрещено overflow-wrap: anywhere");

const requiredFiles = ["README.md", "LICENSE", "NOTICE.md", "CHANGELOG.md", "module.json", "index.js", "languages/ru.json", "styles/module.css", "assets/license.txt"];
for (const file of requiredFiles) {
  const path = join(root, file);
  if (!existsSync(path) || statSync(path).size === 0) errors.push(`Отсутствует обязательный файл ${file}`);
}

if (errors.length) {
  console.error(`Проверка не пройдена (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const assets = walk(join(root, "assets"));
if (assets.length < 100) {
  console.error(`Проверка не пройдена: ожидалось не менее 100 лицензированных assets, найдено ${assets.length}`);
  process.exit(1);
}

console.log(`Проверка пройдена: ${files.length} файлов, ${assets.length} assets, ${countLeaves(translations)} ключей локализации.`);
