import { createDefaultStructure, createLoreFolder } from "./helpers.js";
import { getSetting } from "./settings.js";
import { FULL_FORMAT, normalizePayload } from "./importExportData.js";
import { MODULE_ID } from "./main.js";

const deepClone = (value) => foundry.utils.deepClone(value);
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const sameFolder = (journal, folder) => journal.folder === folder || journal.folder === folder?.id || journal.folder?.id === folder?.id;

function findFolder(name) {
    return Array.from(game.folders).find((folder) => folder.type === "JournalEntry" && folder.name === name);
}
function managedFolders() {
    return {
        quests: findFolder(getSetting("folderName")),
        lore: findFolder(getSetting("loreFolderName")),
    };
}

function isManagedJournal(journal, folders) {
    if (folders.lore && sameFolder(journal, folders.lore)) return true;
    if (!folders.quests || !sameFolder(journal, folders.quests)) return false;
    return ![getSetting("mapsJournalName"), getSetting("achievementsJournalName")].includes(journal.name);
}

function pageSource(page) {
    const source = page.toObject();
    delete source._id;
    delete source._stats;
    return source;
}

function journalSource(journal, section) {
    return {
        section,
        name: journal.name,
        sort: journal.sort,
        ownership: deepClone(journal.ownership ?? {}),
        pages: Array.from(journal.pages)
            .filter((page) => page.type === "text")
            .map(pageSource),
    };
}

export function exportPayload() {
    const folders = managedFolders();
    const journals = Array.from(game.journal)
        .filter((journal) => isManagedJournal(journal, folders))
        .map((journal) => journalSource(journal, folders.lore && sameFolder(journal, folders.lore) ? "lore" : "quests"))
        .filter((journal) => journal.pages.length > 0)
        .sort((left, right) => left.section.localeCompare(right.section) || left.sort - right.sort || left.name.localeCompare(right.name, "ru"));

    return {
        format: FULL_FORMAT,
        version: 1,
        exportedAt: new Date().toISOString(),
        source: "Квестовый журнал: текстовые журналы; карты и изображения исключены",
        journals,
    };
}

export function validatePayload(payload) {
    return normalizePayload(payload);
}

function cleanPage(page) {
    return {
        name: page.name,
        type: "text",
        text: {
            content: page.text.content,
            format: page.text.format ?? CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
        },
        ownership: isObject(page.ownership) ? deepClone(page.ownership) : {},
        title: isObject(page.title) ? deepClone(page.title) : {},
        sort: Number.isFinite(page.sort) ? page.sort : 0,
        flags: isObject(page.flags) ? deepClone(page.flags) : {},
    };
}

async function ensureManagedFolders() {
    if (!findFolder(getSetting("folderName"))) await createDefaultStructure();
    const lore = await createLoreFolder();
    const quests = findFolder(getSetting("folderName"));
    if (!quests || !lore) throw new Error("Не удалось подготовить папки журнала.");
    return { quests, lore };
}

export async function replaceManagedJournals(payload) {
    if (!game.user.isGM) throw new Error("Импорт доступен только ведущему.");
    const normalized = normalizePayload(payload);
    const folders = await ensureManagedFolders();
    const existing = Array.from(game.journal).filter((journal) => isManagedJournal(journal, folders));

    const created = [];
    try {
        for (const journal of normalized.journals) {
            created.push(await JournalEntry.create({
                name: journal.name,
                folder: folders[journal.section].id,
                sort: Number.isFinite(journal.sort) ? journal.sort : 0,
                ownership: isObject(journal.ownership) ? deepClone(journal.ownership) : { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE },
                pages: journal.pages.map(cleanPage),
            }));
        }
    } catch (error) {
        await Promise.all(created.map((journal) => journal.delete().catch(() => undefined)));
        throw error;
    }

    await Promise.all(existing.map((journal) => journal.delete()));
    return normalized.journals.length;
}

function downloadJson(payload) {
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `quest-log-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 0);
}

function pickJsonFile() {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json,.json";
        input.addEventListener("change", () => resolve(input.files?.[0] ?? null), { once: true });
        input.click();
    });
}

export function exportManagedJournals() {
    if (!game.user.isGM) return ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.importExport.gmOnly`));
    downloadJson(exportPayload());
    ui.notifications.info(game.i18n.localize(`${MODULE_ID}.importExport.exported`));
}

export async function importManagedJournals() {
    if (!game.user.isGM) return ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.importExport.gmOnly`));
    const file = await pickJsonFile();
    if (!file) return;

    let payload;
    try {
        payload = validatePayload(JSON.parse(await file.text()));
    } catch (error) {
        console.error(`${MODULE_ID} | Не удалось прочитать файл импорта`, error);
        return ui.notifications.error(`${game.i18n.localize(`${MODULE_ID}.importExport.invalid`)} ${error.message}`);
    }

    const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize(`${MODULE_ID}.importExport.confirmTitle`) },
        content: `<p>${game.i18n.localize(`${MODULE_ID}.importExport.confirmText`)}</p>`,
        rejectClose: false,
    });
    if (!confirmed) return;

    try {
        const count = await replaceManagedJournals(payload);
        ui.notifications.info(game.i18n.format(`${MODULE_ID}.importExport.imported`, { count }));
        ui.simpleQuest?.render(true);
    } catch (error) {
        console.error(`${MODULE_ID} | Не удалось импортировать журналы`, error);
        ui.notifications.error(`${game.i18n.localize(`${MODULE_ID}.importExport.failed`)} ${error.message}`);
    }
}
