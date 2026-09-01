import { MODULE_ID } from "./main.js";
import { createLoreFolder } from "./helpers.js";
import { getSetting } from "./settings.js";

const PRESET_FLAG = "rusthengePreset";
const PRESET_VERSION = "1";
const MAP_FLAG = "rusthengeSceneKey";

const PLAYER = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER };
const GM_ONLY = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };

const page = (name, content, { hidden = false, ownership = PLAYER } = {}) => ({
    name,
    type: "text",
    ownership,
    "text.content": content,
    flags: {
        [MODULE_ID]: {
            [PRESET_FLAG]: PRESET_VERSION,
            ...(hidden ? { hidden: true } : {}),
        },
    },
});

const QUEST_JOURNALS = [
    {
        name: "Пролог и глава 1",
        pages: [
            page("Растхендж — начало приключения", `<p>Вы прибыли в тихую рыбацкую деревню Бухта Скопы на северном побережье Варисии. Ночной шторм приносит к её берегу умирающего гонца с просьбой о помощи. Его последние слова указывают на Железную Гавань — поселение, которое внезапно перестало отвечать соседям.</p>
<h2>Что предстоит сделать</h2><ul><li>Выяснить, кто послал гонца и почему он погиб.</li><li>Добраться до Железной Гавани и помочь её жителям.</li><li>Найти источник странной ржавчины и остановить тех, кто её распространяет.</li></ul>
<h2>Для игроков</h2><p>Приключение начинается на 1-м уровне и заканчивается на 4-м. Вы можете быть местными жителями, путешественниками, знакомыми гонца или героями, которых объединила буря.</p>`),
            page("Глава 1 — Послание в ночи", `<p>След ведёт от Бухты Скопы к Железной Гавани. Поселение пережило нападение, а его храм Горума оказался в руках жестокого культа.</p>
<h2>Основная цель</h2><ul><li>Добраться до Железной Гавани и найти выживших.</li><li>Собрать сведения о нападении и пропавших жителях.</li><li>Исследовать Стоунхоум и прекратить действия культистов.</li><li>Найти путь к древним ржавым руинам.</li></ul>
<h2>Итог главы</h2><p>Перед исследованием Растхенджа герои должны получить 2-й уровень.</p>`),
        ],
    },
    {
        name: "Глава 2 — Ржавые руины",
        pages: [
            page("Глава 2 — Ржавые руины", `<p>Раскрыв тайну Стоунхоума, герои спускаются в Растхендж — древний комплекс под ржавыми монолитами. Здесь культ готовит возвращение давно погибшего повелителя демонов.</p>
<h2>Основная цель</h2><ul><li>Исследовать наземные руины и первый подземный этаж.</li><li>Найти записи и следы, объясняющие замысел культа.</li><li>Ослабить ресурсы культистов и открыть путь дальше.</li><li>Узнать, где проводится ритуал.</li></ul>
<h2>Итог главы</h2><p>Перед спуском в храм Ксар-Азмака герои должны получить 3-й уровень.</p>`, { hidden: true }),
        ],
    },
    {
        name: "Глава 3 — Воскрешение ржавчины",
        pages: [
            page("Глава 3 — Воскрешение ржавчины", `<p>Культисты почти завершили ритуал. Героям нужно пробиться к границе Тёмных земель, разрушить его опоры и не дать древнему злу вернуться в мир.</p>
<h2>Основная цель</h2><ul><li>Найти вход в глубины под Растхенджем.</li><li>Выявить и ослабить опоры ритуала.</li><li>Остановить предводителя культа.</li><li>Не допустить воскрешения Ксар-Азмака.</li></ul>
<h2>Финал</h2><p>За завершение приключения герои получают 4-й уровень.</p>`, { hidden: true }),
        ],
    },
    {
        name: "Материалы ведущего",
        pages: [
            page("Ведение «Растхенджа»", `<p><strong>Порядок подготовки.</strong> Включите официальный модуль <em>Pathfinder Adventure: Rusthenge</em> и его русский перевод, затем импортируйте приключение в чистый мир. PF2e Journal добавит сюда квесты, лор, временную шкалу и копии фонов импортированных сцен для вкладки «Карты».</p>
<h2>Последовательность</h2><ol><li>Глава 1: Бухта Скопы → Железная Гавань → Стоунхоум. После неё дайте 2-й уровень.</li><li>Глава 2: Растхендж и верхние подземелья. Перед храмом дайте 3-й уровень.</li><li>Глава 3: Тёмные земли, ритуал и финал. После него — 4-й уровень.</li></ol>
<h2>Оригинальные материалы</h2><p>@UUID[JournalEntry.pf2sa06401frontm]{Вводная часть} · @UUID[JournalEntry.pf2sa06402messag]{Глава 1} · @UUID[JournalEntry.pf2sa06403therus]{Глава 2} · @UUID[JournalEntry.pf2sa06404ressur]{Глава 3}</p>
<p>Все карты создаются скрытыми, чтобы не раскрывать план локации раньше времени. Открывайте нужную карту игрокам через значок глаза во вкладке «Карты».</p>`, { hidden: true, ownership: GM_ONLY }),
        ],
    },
];

const LORE_JOURNALS = [
    {
        name: "Локации",
        pages: [
            page("Бухта Скопы", `<p>Небольшая рыбацкая деревня на северном побережье Варисии. Отсюда начинается путь героев: шторм выбрасывает на берег умирающего гонца с просьбой о помощи.</p>`),
            page("Железная Гавань", `<p>Прибрежное поселение, которое перестало отвечать соседям после недавней беды. Его жители нуждаются в помощи, а следы нападения ведут к Стоунхоуму.</p>`),
            page("Стоунхоум", `<p>Бывшая крепость и храм Горума в Железной Гавани. Сейчас здесь скрывается источник угрозы для поселения.</p>`, { hidden: true }),
            page("Растхендж", `<p>Древние ржавые монолиты и скрытый под ними комплекс. Именно здесь находится сердце замысла культистов.</p>`, { hidden: true }),
        ],
    },
    {
        name: "НПС",
        pages: [
            page("Старейшина Ордви", `<p>Уважаемая старейшина Бухты Скопы. Она обеспокоена судьбой соседей и может направить героев к Железной Гавани.</p>`),
            page("Блантон", `<p>Гонец, прибывший в Бухту Скопы во время шторма. Его послание становится первой нитью расследования.</p>`),
            page("Мейтремар", `<p>Предводитель культа, который ищет способ вернуть древнюю силу Растхенджа.</p>`, { hidden: true }),
        ],
    },
    {
        name: "Организации",
        pages: [
            page("Адепты Ржавчины", `<p>Тайный культ, связанный с древней тассилонской магией, ржавчиной и разложением. Его участники действуют в Железной Гавани и Растхендже.</p>`, { hidden: true }),
        ],
    },
    {
        name: "История",
        pages: [
            page("Ксар-Азмак", `<p>Давно погибший повелитель демонов, связанный с ржавчиной, разложением и смертью. Культ пытается вернуть его силу в мир.</p>`, { hidden: true }),
            page("Ползучая ржавчина", `<p>Сверхъестественная болезнь, которая ослабляет живых существ и портит снаряжение. Если эта тема некомфортна группе, ведущий может представить её как проклятие, яд или эффект трансмутации.</p>`, { hidden: true }),
        ],
    },
    {
        name: "Бестиарий",
        pages: [
            page("Опасности Растхенджа", `<p>В приключении встречаются культисты, существа подземелий и магические опасности. Используйте карточки актёров из официально импортированного Rusthenge: в них уже находятся точные характеристики и правила PF2e.</p>`, { hidden: true, ownership: GM_ONLY }),
        ],
    },
];

const timelineEvent = (name, year, content) => ({
    ...page(name, `<p>${content}</p>`, { hidden: year > 0 }),
    flags: {
        [MODULE_ID]: {
            [PRESET_FLAG]: PRESET_VERSION,
            ...(year > 0 ? { hidden: true } : {}),
            timeline: { year, color: "#8a3d22", label: "Растхендж" },
        },
    },
});

const TIMELINE_PAGES = [
    {
        name: "Приключение «Растхендж»",
        type: "text",
        ownership: PLAYER,
        "text.content": "<p>Короткая временная шкала для отслеживания хода приключения. Номера дней условны: при необходимости меняйте их в настройках события.</p>",
        flags: { [MODULE_ID]: { [PRESET_FLAG]: PRESET_VERSION, timeline: { isEra: true, eraStart: 0, eraEnd: 3, color: "#8a3d22", label: "Растхендж" } } },
    },
    timelineEvent("Ночной шторм", 0, "Гонец прибывает в Бухту Скопы; начинается расследование."),
    timelineEvent("Железная Гавань", 1, "Герои раскрывают угрозу в поселении и Стоунхоуме."),
    timelineEvent("Ржавые руины", 2, "Экспедиция спускается в Растхендж."),
    timelineEvent("Финал ритуала", 3, "Решается судьба ритуала и Ксар-Азмака."),
];

async function ensureJournal(folder, name) {
    return Array.from(game.journal).find((journal) => journal.folder === folder && journal.name === name)
        ?? JournalEntry.create({ name, folder: folder.id, ownership: GM_ONLY });
}

async function ensurePages(journal, pages) {
    const missing = pages.filter((definition) => !Array.from(journal.pages).some((existing) => existing.getFlag(MODULE_ID, PRESET_FLAG) === PRESET_VERSION && existing.name === definition.name));
    if (missing.length) await journal.createEmbeddedDocuments("JournalEntryPage", missing);
}

async function removeLegacyDemoContent(questFolder, loreFolder) {
    const names = new Set(["Welcome to Simple Quest!", "Welcome to the Lore tab!"]);
    for (const journal of Array.from(game.journal)) {
        if (journal.folder !== questFolder && journal.folder !== loreFolder) continue;
        const demoPages = Array.from(journal.pages).filter((document) => names.has(document.name));
        if (demoPages.length) await journal.deleteEmbeddedDocuments("JournalEntryPage", demoPages.map((document) => document.id));
    }
}

export async function installRusthengePreset() {
    if (!game.user.isGM) return;
    const questFolder = Array.from(game.folders).find((folder) => folder.type === "JournalEntry" && folder.name === getSetting("folderName"));
    if (!questFolder) return;
    const loreFolder = await createLoreFolder();
    await removeLegacyDemoContent(questFolder, loreFolder);

    for (const definition of QUEST_JOURNALS) {
        const journal = await ensureJournal(questFolder, definition.name);
        await ensurePages(journal, definition.pages);
    }
    for (const definition of LORE_JOURNALS) {
        const journal = await ensureJournal(loreFolder, definition.name);
        await ensurePages(journal, definition.pages);
    }

    const timeline = await ensureJournal(questFolder, getSetting("timelineJournalName"));
    await ensurePages(timeline, TIMELINE_PAGES);
    await syncRusthengeMaps();
}

function rusthengeSceneKey(scene) {
    const source = scene._stats?.compendiumSource ?? scene.flags?.core?.sourceId ?? "";
    return source || `${scene.name}|${scene.background?.src ?? ""}`;
}

function isRusthengeScene(scene) {
    const source = scene._stats?.compendiumSource ?? scene.flags?.core?.sourceId ?? "";
    return source.includes("rusthenge") || (scene.background?.src ?? "").includes("modules/pf2e-rusthenge/");
}

export async function syncRusthengeMaps() {
    if (!game.user.isGM) return;
    const questFolder = Array.from(game.folders).find((folder) => folder.type === "JournalEntry" && folder.name === getSetting("folderName"));
    if (!questFolder) return;
    const maps = await ensureJournal(questFolder, getSetting("mapsJournalName"));
    const scenes = Array.from(game.scenes).filter(isRusthengeScene).filter((scene) => scene.background?.src);
    const pages = Array.from(maps.pages);
    const missing = scenes.filter((scene) => !pages.some((map) => map.getFlag(MODULE_ID, MAP_FLAG) === rusthengeSceneKey(scene)));
    if (!missing.length) return;
    await maps.createEmbeddedDocuments("JournalEntryPage", missing.map((scene) => ({
        name: scene.name,
        type: "image",
        src: scene.background.src,
        ownership: PLAYER,
        flags: {
            [MODULE_ID]: {
                [PRESET_FLAG]: PRESET_VERSION,
                [MAP_FLAG]: rusthengeSceneKey(scene),
                hidden: true,
                measure: scene.dimensions?.distancePixels ? `${100 / scene.dimensions.distancePixels}${scene.grid.units}` : "1mi",
            },
        },
    })));
}
