/**
 * Совместимость портированного Simple Quest с Foundry VTT 14.366.
 * Загружается до index.js, чтобы устаревшие точки расширения v13 имели
 * безопасные эквиваленты в текущем API. Все проверки намеренно условные:
 * это позволяет не ломать стандартные объекты Foundry и облегчает переход
 * на ApplicationV2 в следующих версиях модуля.
 */

const api = globalThis.foundry?.applications?.api;
const MODULE_ID = "foundry-quest-log-ru";

/**
 * Переносит записи MVP 1.x (один JournalEntry на квест) в модель Simple Quest
 * 3.x (категория = JournalEntry, квест = JournalEntryPage). Старые документы
 * не удаляются: они перемещаются в корень и помечаются migratedToV2, поэтому
 * резервная копия мира остаётся достаточной для отката.
 */
async function migrateMvpJournalEntries() {
  if (!globalThis.game?.user?.isGM || !globalThis.game?.journal) return;
  if (game.settings.get(MODULE_ID, "mvpMigrationDone")) return;

  const legacy = Array.from(game.journal).filter((journal) => journal.getFlag?.(MODULE_ID, "isQuest") === true);
  if (!legacy.length) {
    await game.settings.set(MODULE_ID, "mvpMigrationDone", true);
    return;
  }

  const folderName = game.settings.get(MODULE_ID, "folderName");
  let targetFolder = Array.from(game.folders).find((folder) => folder.type === "JournalEntry" && folder.name === folderName);
  if (!targetFolder) {
    targetFolder = await Folder.create({ name: folderName, type: "JournalEntry", sorting: "m", folder: null });
  }

  const categories = new Map();
  for (const source of legacy) {
    const sourceFlags = foundry.utils.deepClone(source.flags?.[MODULE_ID] ?? {});
    const categoryName = String(sourceFlags.category || "Перенесённые квесты").trim();
    let category = categories.get(categoryName);
    if (!category) {
      category = Array.from(game.journal).find((journal) => journal.folder === targetFolder && journal.name === categoryName);
      if (!category) category = await JournalEntry.create({ name: categoryName, folder: targetFolder.id, ownership: { default: 0 } });
      categories.set(categoryName, category);
    }

    const sourcePage = Array.from(source.pages ?? []).find((page) => page.getFlag?.(MODULE_ID, "mirror") === true) ?? Array.from(source.pages ?? [])[0];
    const content = sourcePage?.text?.content ?? "";
    const pageFlags = {
      hidden: sourceFlags.visible === false,
      completed: sourceFlags.status === "completed",
      failed: sourceFlags.status === "failed",
      lastUpdated: sourceFlags.updatedAt ?? Date.now(),
      legacyMvp: sourceFlags,
    };
    await category.createEmbeddedDocuments("JournalEntryPage", [{
      name: source.name,
      type: sourcePage?.type ?? "text",
      text: { content, format: sourcePage?.text?.format ?? 1 },
      ownership: sourcePage?.ownership ?? { default: 0 },
      flags: { [MODULE_ID]: pageFlags },
    }]);
    await source.update({ folder: null, [`flags.${MODULE_ID}.migratedToV2`]: true });
  }

  await game.settings.set(MODULE_ID, "mvpMigrationDone", true);
  ui.notifications.info("Квестовый журнал: данные MVP перенесены в JournalEntry/JournalEntryPage.", { permanent: true });
}

Hooks.once("init", () => {
  if (!game.settings.settings?.has?.(`${MODULE_ID}.mvpMigrationDone`)) {
    game.settings.register(MODULE_ID, "mvpMigrationDone", { scope: "world", config: false, type: Boolean, default: false });
  }
});

if (globalThis.CONFIG?.TextEditor && !Array.isArray(CONFIG.TextEditor.enrichers)) {
  CONFIG.TextEditor.enrichers = [];
}

if (globalThis.foundry?.applications?.ux?.TextEditor?.implementation) {
  const implementation = foundry.applications.ux.TextEditor.implementation;
  if (!implementation.enrichHTML && typeof implementation.enrich === "function") {
    implementation.enrichHTML = implementation.enrich.bind(implementation);
  }
}

if (api?.DialogV2 && !globalThis.DialogV2) globalThis.DialogV2 = api.DialogV2;
if (api?.ApplicationV2 && !globalThis.ApplicationV2) globalThis.ApplicationV2 = api.ApplicationV2;

// В v14 Tour уже находится в foundry.nue, но оставляем fallback для сборок,
// где namespace nue загружается после esmodules.
if (globalThis.foundry && !foundry.nue?.Tour && globalThis.Tour) {
  foundry.nue ??= {};
  foundry.nue.Tour = globalThis.Tour;
}

// Старые версии бандла обращались к глобальному TextEditor.
if (!globalThis.TextEditor && foundry.applications?.ux?.TextEditor) {
  globalThis.TextEditor = foundry.applications.ux.TextEditor;
}

Hooks.once("ready", () => {
  // v14 больше не гарантирует существование CONFIG.TextEditor.enrichers до
  // инициализации всех систем; после ready восстанавливаем массив, если его
  // заменила система.
  if (globalThis.CONFIG?.TextEditor && !Array.isArray(CONFIG.TextEditor.enrichers)) {
    CONFIG.TextEditor.enrichers = [];
  }
});

Hooks.once("ready", () => {
  // Ждём завершения createDefaultStructure из основного бандла, чтобы при
  // миграции уже существовали Lore, Maps, Timeline и журналы группы.
  const started = Date.now();
  const waitForStructure = () => {
    if (globalThis.ui?.simpleQuest || Date.now() - started > 15000) {
      migrateMvpJournalEntries().catch((error) => console.error(`${MODULE_ID} | Ошибка миграции MVP`, error));
      return;
    }
    setTimeout(waitForStructure, 100);
  };
  waitForStructure();
});
