import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(resolve(root, "module.json"), "utf8"));
const locale = JSON.parse(readFileSync(resolve(root, "languages/ru.json"), "utf8"));
const bundle = readFileSync(resolve(root, "index.js"), "utf8");
const appSource = readFileSync(resolve(root, "scripts/app/app.js"), "utf8");
const settingsSource = readFileSync(resolve(root, "scripts/settings.js"), "utf8");
const helpersSource = readFileSync(resolve(root, "scripts/helpers.js"), "utf8");
const mainSource = readFileSync(resolve(root, "scripts/main.js"), "utf8");

function leafCount(value) {
  return Object.values(value).reduce((n, item) => n + (item && typeof item === "object" ? leafCount(item) : 1), 0);
}

test("manifest настроен для Foundry 14.367 и не конфликтует с Simple Quest", () => {
  assert.equal(manifest.id, "foundry-quest-log-ru");
  assert.equal(manifest.version, "2.2.1");
  assert.deepEqual(manifest.compatibility, { minimum: "14", verified: "14.367", maximum: "14" });
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
    "importManagedJournals",
    "exportManagedJournals",
    "foundry-quest-log-ru",
  ]) assert.match(bundle, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), marker);
});

test("основное окно использует существующий шаблон simple-quest", () => {
  assert.match(appSource, /static get APP_ID\(\) \{\s*return "simple-quest";\s*\}/);
  assert.doesNotMatch(bundle, /__simple-quest\.hbs/);
});

test("обучение выключено по умолчанию и учитывает настройку", () => {
  assert.match(settingsSource, /enableTutorial[\s\S]*?scope: "client"[\s\S]*?default: false/);
  assert.match(helpersSource, /showWelcomeScreen\(force = false\) \{\s*if \(!getSetting\("enableTutorial"\)\) return;/);
  assert.match(helpersSource, /showWelcomeMaps\(force = false\) \{\s*if \(!getSetting\("enableTutorial"\) && !force\) return;/);
  assert.match(appSource, /checkTour\(tab, tourId\) \{\s*if \(!getSetting\("enableTutorial"\)\) return;/);
  assert.match(mainSource, /renderJournalTextPage[\s\S]*?if \(!getSetting\("enableTutorial"\)\) return;/);
});

test("хлебные крошки выключены по умолчанию", () => {
  assert.match(settingsSource, /showHistory[\s\S]*?default: false[\s\S]*?onChange: refreshQuestLog/);
  assert.equal(locale[manifest.id].settings.showHistory.name, "Показывать хлебные крошки");
});

test("разделы журнала можно отключать настройками", () => {
  for (const setting of [
    "enableQuests",
    "enablePartyJournal",
    "enableMyJournal",
    "enableMaps",
    "enableLore",
    "enableTimeline",
    "enableAchievements",
  ]) {
    assert.match(settingsSource, new RegExp(`${setting}[\\s\\S]*?onChange: refreshQuestLog`), setting);
  }
  for (const setting of ["enableQuests", "enablePartyJournal", "enableMyJournal", "enableMaps", "enableLore", "enableTimeline", "enableAchievements"]) {
    assert.match(readFileSync(resolve(root, "templates/simple-quest.hbs"), "utf8"), new RegExp(`unless ${setting}`), setting);
  }
});

test("присутствуют шаблоны, assets и v14-совместимость", () => {
  for (const file of [
    "scripts/compat-v14.js",
    "scripts/app/app.js",
    "scripts/mapImage.js",
    "scripts/app/timeline.js",
    "scripts/enrichers.js",
    "scripts/importExport.js",
    "scripts/importExportData.js",
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
