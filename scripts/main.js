import { initConfig } from "./config.js";
import { getSetting, migrateQuestSoundSettings, registerSettings, registerOnReadySettings, setSetting } from "./settings.js";
import { createDefaultStructure, showQuestNotification, showWelcomeScreen } from "./helpers.js";
import { SimpleQuest, setWindowedMode } from "./app/app.js";
import { initJournalTemplates } from "./journalTemplates.js";
import { registerTours } from "./tours.js";
import { Socket } from "./lib/socket.js";
import { setTTM } from "./app/theaterOfTheMind.js";
import { applyTOCOverride } from "./overrides.js";
import {setMermaidHooks} from "./mindmap.js";
import {initEnrichers} from "./enrichers.js";
import {initAutoImport} from "./autoImport.js";

export const MODULE_ID = "foundry-quest-log-ru";

initJournalTemplates();

Hooks.on("setup", () => {
    registerSettings();
    initConfig();

    Socket.register("openToPage", ({ uuid }) => {
        const page = fromUuidSync(uuid);
        const isNewQuest = !game.user.isGM && page && ui.simpleQuest.isSimpleQuestPage(uuid) === "quests" && ui.simpleQuest.hasPermission(uuid);
        ui.simpleQuest.openToPage(uuid);
        if (isNewQuest) showQuestNotification(page, true);
    });
});

Hooks.on("init", () => {
    game.keybindings.register(MODULE_ID, "toggleSimpleQuest", {
        name: `${MODULE_ID}.hotkeys.toggleSimpleQuest.name`,
        editable: [{ key: "KeyJ" }],
        restricted: false,
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
        onDown: () => {
            ui.simpleQuest.toggle();
        },
    });
    setMermaidHooks();
    applyTOCOverride();
});

Hooks.on("ready", () => {
    registerTours();
    registerOnReadySettings();
    migrateQuestSoundSettings();
    showWelcomeScreen();
    setTTM();
    initAutoImport();
    const isFirstConnectedGM = game.users.find((u) => u.isGM && u.active) === game.user;
    if (isFirstConnectedGM) {
        createDefaultStructure();
    }
    setWindowedMode();
    ui.simpleQuest = new SimpleQuest();

    document.addEventListener("mouseup", (e) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        isLeft && e.target.classList.contains("foundry-quest-log-ru-content-link") && ui.simpleQuest.openToPage(e.target.dataset.uuid, e.target.dataset.anchor);
        game.user.isGM && isLeft && e.target.classList.contains("foundry-quest-log-ru-ttm") && setSetting("ttmSrc", { src: e.target.dataset.src, title: e.target.dataset.title });

        if ((isRight || isLeft) && e.target.classList.contains("foundry-quest-log-ru-counter")) {
            const uuid = e.target.dataset.uuid;
            const id = e.target.dataset.id;
            const page = fromUuidSync(uuid);
            if (!page.isOwner) return;
            const flag = page.getFlag(MODULE_ID, "counters") ?? {};
            const value = flag[id] ?? 0;
            const count = parseInt(e.target.dataset.count);
            const newValue = (isLeft ? value + 1 : value - 1) % (count + 1);
            flag[id] = Math.max(e.target.dataset.min ?? 0, newValue);
            page.setFlag(MODULE_ID, "counters", flag);
        }
    });

    if (game.user.isGM) {
        Hooks.once("renderJournalTextPageSheet", () => {
            if (!getSetting("enableTutorial")) return;
            const tour = game.tours.get(MODULE_ID + ".journal-page");
            if (tour.status === Tour.STATUS.UNSTARTED) {
                tour.start();
            }
        });
    }
});

Hooks.once("setup", () => {
    initEnrichers();
});
