const MODULE_ID = "foundry-quest-log-ru";

export const FULL_FORMAT = `${MODULE_ID}/full-journals`;
export const QUESTS_FORMAT = `${MODULE_ID}/quests`;
export const FORMAT_VERSION = 1;

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

function requireString(value, message) {
    if (typeof value !== "string" || !value.trim()) throw new Error(message);
    return value;
}
function validatePage(page) {
    return isObject(page)
        && typeof page.name === "string"
        && page.name.trim()
        && page.type === "text"
        && isObject(page.text)
        && typeof page.text.content === "string";
}

function validateFullPayload(payload) {
    if (!isObject(payload) || payload.format !== FULL_FORMAT || payload.version !== FORMAT_VERSION || !Array.isArray(payload.journals)) {
        throw new Error("Неверный формат файла полного журнала.");
    }
    for (const journal of payload.journals) {
        if (!isObject(journal) || !["quests", "lore"].includes(journal.section) || typeof journal.name !== "string" || !journal.name.trim() || !Array.isArray(journal.pages) || !journal.pages.every(validatePage)) {
            throw new Error("В файле полного журнала есть повреждённый журнал или страница.");
        }
    }
    return payload;
}

function validateLegacyPayload(payload) {
    if (!isObject(payload) || payload.format !== QUESTS_FORMAT || payload.version !== FORMAT_VERSION || !Array.isArray(payload.quests)) {
        throw new Error("Неверный формат файла старого журнала квестов.");
    }
    for (const quest of payload.quests) {
        if (!isObject(quest)) throw new Error("В старом файле журнала есть повреждённая запись.");
        requireString(quest.category, "У записи отсутствует категория.");
        requireString(quest.name, "У записи отсутствует название.");
        if (quest.description !== undefined && typeof quest.description !== "string") throw new Error("Описание записи должно быть текстом.");
        if (quest.gmNotes !== undefined && typeof quest.gmNotes !== "string") throw new Error("Заметки ведущего должны быть текстом.");
        if (quest.objectives !== undefined && !Array.isArray(quest.objectives)) throw new Error("Цели записи должны быть списком.");
    }
    return payload;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function objectiveText(objective) {
    if (typeof objective === "string") return objective;
    if (!isObject(objective)) return "";
    return objective.text ?? objective.description ?? objective.name ?? "";
}

function objectiveContent(objectives) {
    if (!objectives?.length) return "";
    const items = objectives.map(objectiveText).filter((text) => String(text).trim()).map((text) => `<li>${escapeHtml(text)}</li>`).join("");
    return items ? `<h2>Цели</h2><ul>${items}</ul>` : "";
}

function sectionForCategory(category) {
    return /^(основной сюжет|материалы ведущего|хронология)$/iu.test(category.trim()) ? "quests" : "lore";
}

function statusFlags(quest, hidden) {
    const status = String(quest.status ?? "active").toLowerCase();
    return {
        hidden,
        completed: status === "completed",
        failed: status === "failed",
        legacyImport: true,
    };
}

function legacyPage(name, content, hidden, quest, suffix = "") {
    return {
        name: `${name}${suffix}`,
        type: "text",
        text: { content, format: 1 },
        title: { show: true, level: 1 },
        sort: 0,
        ownership: { default: hidden ? 0 : 2 },
        flags: { [MODULE_ID]: statusFlags(quest, hidden) },
    };
}

function legacyJournal(quest, sort) {
    const name = quest.name.trim();
    const visible = quest.visible !== false;
    const description = quest.description?.trim() ?? "";
    const objectives = objectiveContent(quest.objectives);
    const gmNotes = quest.gmNotes?.trim() ?? "";
    const pages = [];

    if (description || objectives) pages.push(legacyPage(name, `${description}${objectives}`, !visible, quest));
    if (gmNotes) pages.push(legacyPage(name, gmNotes, true, quest, " — заметки ведущего"));
    if (!pages.length) pages.push(legacyPage(name, "", !visible, quest));

    return {
        section: sectionForCategory(quest.category),
        name,
        sort,
        ownership: { default: 0 },
        pages,
    };
}

function convertLegacyPayload(payload) {
    validateLegacyPayload(payload);
    return {
        format: FULL_FORMAT,
        version: FORMAT_VERSION,
        exportedAt: payload.exportedAt,
        source: `${payload.source ?? "Старый журнал квестов"}; преобразовано в формат полных журналов`,
        journals: payload.quests.map(legacyJournal),
    };
}

export function normalizePayload(payload) {
    if (payload?.format === FULL_FORMAT) return validateFullPayload(payload);
    if (payload?.format === QUESTS_FORMAT) return convertLegacyPayload(payload);
    throw new Error("Неизвестный формат файла журнала.");
}
