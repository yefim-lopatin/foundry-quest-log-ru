import { MODULE_ID } from "./main.js";
import { TabConfig } from "./app/tabConfig.js";
import { ThemeConfig } from "./app/themeConfig.js";
import { setTTM } from "./app/theaterOfTheMind.js";

const DEFAULT_TAB_NAMES = {
    quests: "foundry-quest-log-ru.simple-quest.tabs.quests",
    map: "foundry-quest-log-ru.simple-quest.tabs.map",
    timeline: "foundry-quest-log-ru.simple-quest.tabs.timeline",
    lore: "foundry-quest-log-ru.simple-quest.tabs.lore",
    achievements: "foundry-quest-log-ru.simple-quest.tabs.achievements",
    "my-journal": "foundry-quest-log-ru.simple-quest.tabs.my-journal",
    "party-journal": "foundry-quest-log-ru.simple-quest.tabs.party-journal",
};

const refreshQuestLog = () => ui.simpleQuest?.render(true);

export function registerSettings() {
    game.settings.registerMenu(MODULE_ID, "tabConfig", {
        name: `${MODULE_ID}.settings.tabConfig.name`,
        label: `${MODULE_ID}.settings.tabConfig.label`,
        hint: `${MODULE_ID}.settings.tabConfig.hint`,
        icon: "fas fa-cog",
        type: TabConfig,
        restricted: true,
    });

    game.settings.registerMenu(MODULE_ID, "themeConfig", {
        name: `${MODULE_ID}.settings.themeConfig.name`,
        label: `${MODULE_ID}.settings.themeConfig.label`,
        hint: `${MODULE_ID}.settings.themeConfig.hint`,
        icon: "fas fa-palette",
        type: ThemeConfig,
        restricted: true,
    });

    const settings = {
        enableTutorial: {
            name: `${MODULE_ID}.settings.enableTutorial.name`,
            hint: `${MODULE_ID}.settings.enableTutorial.hint`,
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
        },
        showHistory: {
            name: `${MODULE_ID}.settings.showHistory.name`,
            hint: `${MODULE_ID}.settings.showHistory.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
            onChange: refreshQuestLog,
        },
        hideCheckboxAutoHide: {
            name: `${MODULE_ID}.settings.hideCheckboxAutoHide.name`,
            hint: `${MODULE_ID}.settings.hideCheckboxAutoHide.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        },
        folderName: {
            name: `${MODULE_ID}.settings.folderName.name`,
            hint: `${MODULE_ID}.settings.folderName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Квесты",
        },
        loreFolderName: {
            name: `${MODULE_ID}.settings.loreFolderName.name`,
            hint: `${MODULE_ID}.settings.loreFolderName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Лор",
        },
        mapsJournalName: {
            name: `${MODULE_ID}.settings.mapsJournalName.name`,
            hint: `${MODULE_ID}.settings.mapsJournalName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Карты",
        },
        timelineJournalName: {
            name: `${MODULE_ID}.settings.timelineJournalName.name`,
            hint: `${MODULE_ID}.settings.timelineJournalName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Хронология",
        },
        achievementsJournalName: {
            name: `${MODULE_ID}.settings.achievementsJournalName.name`,
            hint: `${MODULE_ID}.settings.achievementsJournalName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Достижения",
        },
        partyJournalName: {
            name: `${MODULE_ID}.settings.partyJournalName.name`,
            hint: `${MODULE_ID}.settings.partyJournalName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Группа",
        },
        sharedJournalName: {
            name: `${MODULE_ID}.settings.sharedJournalName.name`,
            hint: `${MODULE_ID}.settings.sharedJournalName.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "Общий",
        },
        backgroundColor: {
            name: `${MODULE_ID}.settings.backgroundColor.name`,
            hint: `${MODULE_ID}.settings.backgroundColor.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "#1b130d",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        textColor: {
            name: `${MODULE_ID}.settings.textColor.name`,
            hint: `${MODULE_ID}.settings.textColor.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "#f5deb3",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        secretColor: {
            name: `${MODULE_ID}.settings.secretColor.name`,
            hint: `${MODULE_ID}.settings.secretColor.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "#ff00ff",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        failedColor: {
            name: `${MODULE_ID}.settings.failedColor.name`,
            hint: `${MODULE_ID}.settings.failedColor.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "#ff0000",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        labelColor: {
            name: `${MODULE_ID}.settings.labelColor.name`,
            hint: `${MODULE_ID}.settings.labelColor.hint`,
            scope: "world",
            config: true,
            type: String,
            default: "none",
            onChange: () => {
                ui.simpleQuest.refresh();
            },
        },
        invertTheme: {
            name: `${MODULE_ID}.settings.invertTheme.name`,
            hint: `${MODULE_ID}.settings.invertTheme.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        matchJournalStyle: {
            name: `${MODULE_ID}.settings.matchJournalStyle.name`,
            hint: `${MODULE_ID}.settings.matchJournalStyle.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        hideFolderFromPlayers: {
            name: `${MODULE_ID}.settings.hideFolderFromPlayers.name`,
            hint: `${MODULE_ID}.settings.hideFolderFromPlayers.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        },
        useMessageTheme: {
            name: `${MODULE_ID}.settings.useMessageTheme.name`,
            hint: `${MODULE_ID}.settings.useMessageTheme.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        },
        showQuestNotifications: {
            name: `${MODULE_ID}.settings.showQuestNotifications.name`,
            hint: `${MODULE_ID}.settings.showQuestNotifications.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        },
        newQuestSoundEffect: {
            name: `${MODULE_ID}.settings.newQuestSoundEffect.name`,
            hint: `${MODULE_ID}.settings.newQuestSoundEffect.hint`,
            scope: "world",
            config: true,
            type: String,
            filePicker: "audio",
            default: `modules/${MODULE_ID}/assets/audio/quest-new.ogg`,
        },
        updateQuestSoundEffect: {
            name: `${MODULE_ID}.settings.updateQuestSoundEffect.name`,
            hint: `${MODULE_ID}.settings.updateQuestSoundEffect.hint`,
            scope: "world",
            config: true,
            type: String,
            filePicker: "audio",
            default: `modules/${MODULE_ID}/assets/audio/quest-update.ogg`,
        },
        completeQuestSoundEffect: {
            name: `${MODULE_ID}.settings.completeQuestSoundEffect.name`,
            hint: `${MODULE_ID}.settings.completeQuestSoundEffect.hint`,
            scope: "world",
            config: true,
            type: String,
            filePicker: "audio",
            default: `modules/${MODULE_ID}/assets/audio/quest-complete.ogg`,
        },
        openJournalPinsAsModals: {
            name: `${MODULE_ID}.settings.openJournalPinsAsModals.name`,
            hint: `${MODULE_ID}.settings.openJournalPinsAsModals.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        },
        enableQuests: {
            name: `${MODULE_ID}.settings.enableQuests.name`,
            hint: `${MODULE_ID}.settings.enableQuests.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enablePartyJournal: {
            name: `${MODULE_ID}.settings.enablePartyJournal.name`,
            hint: `${MODULE_ID}.settings.enablePartyJournal.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enableMyJournal: {
            name: `${MODULE_ID}.settings.enableMyJournal.name`,
            hint: `${MODULE_ID}.settings.enableMyJournal.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enableMaps: {
            name: `${MODULE_ID}.settings.enableMaps.name`,
            hint: `${MODULE_ID}.settings.enableMaps.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enableLore: {
            name: `${MODULE_ID}.settings.enableLore.name`,
            hint: `${MODULE_ID}.settings.enableLore.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enableTimeline: {
            name: `${MODULE_ID}.settings.enableTimeline.name`,
            hint: `${MODULE_ID}.settings.enableTimeline.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        enableAchievements: {
            name: `${MODULE_ID}.settings.enableAchievements.name`,
            hint: `${MODULE_ID}.settings.enableAchievements.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            onChange: refreshQuestLog,
        },
        imagePageMask: {
            name: `${MODULE_ID}.settings.imagePageMask.name`,
            hint: `${MODULE_ID}.settings.imagePageMask.hint`,
            scope: "world",
            config: true,
            type: String,
            filePicker: "image",
            default: "modules/foundry-quest-log-ru/assets/mask/mask1.webp",
        },
        matchJournalPermission: {
            name: `${MODULE_ID}.settings.matchJournalPermission.name`,
            hint: `${MODULE_ID}.settings.matchJournalPermission.hint`,
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        },
        ttmSrc: {
            scope: "world",
            config: false,
            type: Object,
            default: null,
            onChange: (val) => setTTM(val),
        },
        lastQuest: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastMap: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastLore: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastAchievements: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastTimeline: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastMyJournal: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        lastPartyJournal: {
            scope: "client",
            config: false,
            type: String,
            default: "",
        },
        timelineScroll: {
            scope: "client",
            config: false,
            type: Number,
            default: 0,
        },
        lastTab: {
            scope: "client",
            config: false,
            type: String,
            default: "quests",
        },
        seenQuests: {
            scope: "client",
            config: false,
            type: Object,
            default: {},
        },
        showCompleted: {
            scope: "client",
            config: false,
            type: Boolean,
            default: true,
        },
        welcomeMessage: {
            scope: "client",
            config: false,
            type: Boolean,
            default: false,
        },
        welcomeMaps: {
            scope: "client",
            config: false,
            type: Boolean,
            default: false,
        },
        detailsStatus: {
            scope: "client",
            config: false,
            type: Object,
            default: {},
        },
        windowedMode: {
            scope: "client",
            config: false,
            type: Boolean,
            default: false,
        },
        themeConfigShown: {
            scope: "client",
            config: false,
            type: Boolean,
            default: false,
        },
        fontSize: {
            scope: "client",
            config: false,
            type: Number,
            default: 1.5,
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        tabNames: {
            scope: "world",
            config: false,
            type: Object,
            default: { ...DEFAULT_TAB_NAMES },
            onChange: () => {
                ui.simpleQuest.refresh();
            },
        }
    };

    registerSettingsArray(settings);

    Hooks.on("renderSettingsConfig", (app, html, data) => {
        colorPicker("backgroundColor", html);
        colorPicker("textColor", html);
        colorPicker("secretColor", html);
        colorPicker("failedColor", html);
        colorPicker("labelColor", html);

        html
            .querySelector(`select[name="${MODULE_ID}.fontFamily"]`)
            .querySelectorAll("option")
            .forEach((option) => {
                option.style.fontFamily = option.value;
            });

        html
            .querySelector(`select[name="${MODULE_ID}.headerOnlyFont"]`)
            .querySelectorAll("option")
            .forEach((option) => {
                option.style.fontFamily = option.value;
            });
    });
}

export function registerOnReadySettings() {
    const settings = {
        fontFamily: {
            name: `${MODULE_ID}.settings.fontFamily.name`,
            hint: `${MODULE_ID}.settings.fontFamily.hint`,
            scope: "world",
            config: true,
            type: String,
            choices: foundry.applications.settings.menus.FontConfig.getAvailableFontChoices(), //Object.keys(CONFIG.fontDefinitions).reduce((obj, key) => {obj[key] = key; return obj}, {}),
            default: "Times New Roman",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
        headerOnlyFont: {
            name: `${MODULE_ID}.settings.headerOnlyFont.name`,
            hint: `${MODULE_ID}.settings.headerOnlyFont.hint`,
            scope: "world",
            config: true,
            type: String,
            choices: { default: "Default", ...foundry.applications.settings.menus.FontConfig.getAvailableFontChoices() },
            default: "default",
            onChange: () => {
                ui.simpleQuest.updateStyle();
            },
        },
    };

    registerSettingsArray(settings);
}

export function getSetting(key) {
    return game.settings.get(MODULE_ID, key);
}

export async function setSetting(key, value) {
    return await game.settings.set(MODULE_ID, key, value);
}

export function getDefaultSetting(key) {
    return game.settings.settings.get(MODULE_ID + "." + key).default;
}

export function getTabNames() {
    //merge the default with the user's settings so that empty values are replaced with the default
    const setting = getSetting("tabNames");
    for (const [key, value] of Object.entries(DEFAULT_TAB_NAMES)) {
        if (!setting[key]) setting[key] = value;
    }
    return setting;
}

function registerSettingsArray(settings) {
    for (const [key, value] of Object.entries(settings)) {
        game.settings.register(MODULE_ID, key, value);
    }
}


export function colorPicker(settingId, html) {
    const colorPickerElement = document.createElement("input");
    colorPickerElement.setAttribute("type", "color");
    colorPickerElement.setAttribute("data-edit", MODULE_ID + "." + settingId);
    colorPickerElement.value = game.settings.get(MODULE_ID, settingId) || game.settings.settings.get(MODULE_ID + "." + settingId).default;

    // Add color picker
    const stringInputElement = html.querySelector(`input[name="${MODULE_ID}.${settingId}"]`);
    if (!stringInputElement.value) stringInputElement.value = colorPickerElement.value;
    stringInputElement.classList.add("color");
    stringInputElement.after(colorPickerElement);
}
