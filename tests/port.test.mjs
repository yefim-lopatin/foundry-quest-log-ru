import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(resolve(root, "module.json"), "utf8"));
const locale = JSON.parse(readFileSync(resolve(root, "languages/ru.json"), "utf8"));
const bundle = readFileSync(resolve(root, "index.js"), "utf8");
const rusthengePreset = readFileSync(resolve(root, "scripts/rusthengePreset.js"), "utf8");

function leafCount(value) {
  return Object.values(value).reduce((n, item) => n + (item && typeof item === "object" ? leafCount(item) : 1), 0);
}

test("manifest настроен для Foundry 14.366 и не конфликтует с Simple Quest", () => {
  assert.equal(manifest.id, "foundry-quest-log-ru");
  assert.equal(manifest.title, "PF2e Journal");
  assert.equal(manifest.version, "2.1.0");
  assert.deepEqual(manifest.compatibility, { minimum: "14", verified: "14.366", maximum: "14" });
  assert.deepEqual(manifest.esmodules, ["scripts/compat-v14.js", "index.js"]);
  assert.equal(manifest.persistentStorage, true);
  assert.ok(!manifest.esmodules.includes("scripts/main.js"));
});

test("перенесены все 308 ключей русской локализации", () => {
  assert.ok(leafCount(locale) >= 308);
  assert.ok(locale[manifest.id]);
  assert.equal(locale[manifest.id]["simple-quest"].tabs.quests, "Квесты");
  assert.equal(locale[manifest.id]["simple-quest"].tabs.map, "Карты");
});

test("бандл содержит функциональные подсистемы полного журнала", () => {
  for (const marker of [
    "JournalEntry",
    "JournalEntryPage",
    "MapImage",
    "Timeline",
    "fow",
    "@QUEST",
    "@MAP",
    "@LORE",
    "@COUNT",
    "@REPUTATION",
    "SimpleQuestAutoImport",
    "foundry-quest-log-ru",
  ]) assert.match(bundle, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), marker);
});

test("стартовый набор «Растхендж» содержит квесты, лор, скрытые карты и ссылку на исходные журналы", () => {
  for (const marker of [
    "Растхендж — начало приключения",
    "Глава 1 — Послание в ночи",
    "Глава 2 — Ржавые руины",
    "Глава 3 — Воскрешение ржавчины",
    "Материалы ведущего",
    "hidden: true",
    "JournalEntry.pf2sa06402messag",
    "syncRusthengeMaps",
    "modules/pf2e-rusthenge/",
  ]) assert.match(rusthengePreset, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), marker);
});

test("присутствуют шаблоны, assets и v14-совместимость", () => {
  for (const file of [
    "scripts/compat-v14.js",
    "scripts/app/app.js",
    "scripts/mapImage.js",
    "scripts/app/timeline.js",
    "scripts/enrichers.js",
    "templates/simple-quest.hbs",
    "templates/timeline.hbs",
    "styles/module.css",
    "assets/license.txt",
  ]) assert.ok(existsSync(resolve(root, file)), file);
  const compat = readFileSync(resolve(root, "scripts/compat-v14.js"), "utf8");
  assert.match(compat, /migrateMvpJournalEntries/);
  assert.match(compat, /legacyMvp/);
  const mindmap = readFileSync(resolve(root, "scripts/mindmap.js"), "utf8");
  assert.match(mindmap, /Mermaid недоступен/);
  const assets = readdirSync(resolve(root, "assets"), { recursive: true }).filter((file) => file.endsWith(".webp"));
  assert.ok(assets.length >= 100, `assets: ${assets.length}`);
});
