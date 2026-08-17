import { MODULE_ID } from "./constants.js";
import { QuestLogApp } from "./quest-log-app.js";
import { QuestStore } from "./store.js";

let questStore;
let questLogApp;

function openQuestLog() {
  if (!questStore) return;
  questLogApp ??= new QuestLogApp(questStore);
  questLogApp.render({ force: true });
}

function registerSettings() {
  game.settings.register(MODULE_ID, "folderName", {
    name: "FQLR.Settings.FolderName.Name",
    hint: "FQLR.Settings.FolderName.Hint",
    scope: "world",
    config: true,
    restricted: true,
    type: String,
    default: "Квестовый журнал — данные",
  });

  game.settings.register(MODULE_ID, "chatNotifications", {
    name: "FQLR.Settings.ChatNotifications.Name",
    hint: "FQLR.Settings.ChatNotifications.Hint",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: true,
  });
}

function registerKeybindings() {
  game.keybindings.register(MODULE_ID, "openQuestLog", {
    name: "FQLR.Keybindings.Open.Name",
    hint: "FQLR.Keybindings.Open.Hint",
    editable: [{ key: "KeyQ", modifiers: ["Shift"] }],
    restricted: false,
    precedence: globalThis.CONST.KEYBINDING_PRECEDENCE.NORMAL,
    onDown: () => {
      openQuestLog();
      return true;
    },
  });
}

function registerInterfaceHooks() {
  Hooks.on("getSceneControlButtons", (controls) => {
    const group = controls.notes ?? controls.tokens ?? controls.token;
    if (!group?.tools || group.tools[MODULE_ID]) return;
    group.tools[MODULE_ID] = {
      name: MODULE_ID,
      title: game.i18n.localize("FQLR.Title"),
      icon: "fa-solid fa-scroll",
      order: 999,
      visible: true,
      button: true,
      onChange: openQuestLog,
    };
  });

  Hooks.on("renderJournalDirectory", (_application, element) => {
    const actions = element.querySelector(".header-actions.action-buttons, .directory-header .header-actions");
    if (!actions || actions.querySelector(`[data-module-id="${MODULE_ID}"]`)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.moduleId = MODULE_ID;
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-scroll";
    button.append(icon, ` ${game.i18n.localize("FQLR.Title")}`);
    button.addEventListener("click", openQuestLog);
    actions.append(button);
  });
}

Hooks.once("init", () => {
  registerSettings();
  registerKeybindings();
  registerInterfaceHooks();
});

Hooks.once("ready", () => {
  questStore = new QuestStore();
  questStore.initialize();
  questLogApp = new QuestLogApp(questStore);

  game.modules.get(MODULE_ID).api = Object.freeze({
    open: openQuestLog,
    getQuests: () => questStore.getQuests(),
  });

  Hooks.on(`${MODULE_ID}.dataChanged`, () => {
    if (questLogApp.rendered) questLogApp.render({ force: true });
  });

  console.info(`${MODULE_ID} | Модуль готов`);
});
