// scripts/app/tabConfig.js
var TabConfig = class extends FormApplication {
  constructor() {
    super();
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: true,
      minimizable: true,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`),
      closeOnSubmit: true,
      width: 400
    });
  }
  async getData() {
    return { ...getTabNames() };
  }
  async _updateObject(event, formData) {
    formData = foundry.utils.expandObject(formData);
    return setSetting("tabNames", formData);
  }
};

// scripts/app/themeConfig.js
var THEMES = {
  default: {
    backgroundColor: "#1b130d",
    textColor: "#f5deb3",
    secretColor: "#ff00ff",
    failedColor: "#ff0000",
    fontFamily: "Times New Roman"
  },
  redDragon: {
    backgroundColor: "#1b130d",
    textColor: "#e6415a",
    secretColor: "#0091ff",
    failedColor: "#ff7b00",
    fontFamily: "Signika",
    headerOnlyFont: "Modesto Condensed"
  },
  whiteDragon: {
    backgroundColor: "#f1ebe8",
    textColor: "#1c1c1c",
    secretColor: "#0091ff",
    failedColor: "#ff0000",
    fontFamily: "Signika",
    headerOnlyFont: "Modesto Condensed"
  },
  "D&D": {
    backgroundColor: `url("/systems/dnd5e/ui/texture1.webp") no-repeat top center / 150% auto, #f1ebe8 url("/systems/dnd5e/ui/texture2.webp") no-repeat bottom center / 150% auto`,
    textColor: "#1c1c1c",
    secretColor: "#0091ff",
    failedColor: "#ff0000",
    fontFamily: "Roboto Condensed",
    headerOnlyFont: "Modesto Condensed"
  },
  typewriter: {
    backgroundColor: "#d9ccc4",
    textColor: "#1c1c1c",
    secretColor: "#834b16",
    failedColor: "#ff0000",
    fontFamily: "Courier New"
  },
  postApocalypticWasteland: {
    backgroundColor: "#5c5c5c",
    textColor: "#bfbfbf",
    secretColor: "#008080",
    failedColor: "#cc3300",
    fontFamily: "Courier New"
  },
  cyberpunkCity: {
    backgroundColor: "#000000",
    textColor: "#00ffcc",
    secretColor: "#ff66b2",
    failedColor: "#ff3300",
    fontFamily: "Modesto Condensed"
  },
  galacticAdventure: {
    backgroundColor: "#0e0e0e",
    textColor: "#ffffff",
    secretColor: "#00ffcc",
    failedColor: "#ff0000",
    fontFamily: "Signika",
    headerOnlyFont: "Bruno Ace"
  },
  steampunkWorkshop: {
    backgroundColor: "#2b2b2b",
    textColor: "#b98946",
    secretColor: "#00ccff",
    failedColor: "#a52a2a",
    fontFamily: "Modesto Condensed"
  },
  dystopianFuture: {
    backgroundColor: "#333333",
    textColor: "#ff6666",
    secretColor: "#00ccff",
    failedColor: "#990000",
    fontFamily: "Currier New"
  },
  virtualRealityOasis: {
    backgroundColor: "#111111",
    textColor: "#00ffcc",
    secretColor: "#ff00ff",
    failedColor: "#ff3300",
    fontFamily: "Modesto Condensed"
  },
  mysticForest: {
    backgroundColor: "#003300",
    textColor: "#99cc66",
    secretColor: "#9933ff",
    failedColor: "#cc0000",
    fontFamily: "Amiri"
  },
  vintageFilmNoir: {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    secretColor: "#9900cc",
    failedColor: "#cc0000",
    fontFamily: "Signika",
    headerOnlyFont: "Courier New"
  },
  sciFiConsole: {
    backgroundColor: "#000000",
    textColor: "#00ffcc",
    secretColor: "#ff66b2",
    failedColor: "#ff3300",
    fontFamily: "Courier"
  },
  futuristicTech: {
    backgroundColor: "#1a1a1a",
    textColor: "#99cc66",
    secretColor: "#3366ff",
    failedColor: "#cc0000",
    fontFamily: "Roboto"
  },
  alienInvasion: {
    backgroundColor: "#0a0a0a",
    textColor: "#00ccff",
    secretColor: "#ff00ff",
    failedColor: "#ff3300",
    fontFamily: "Signika"
  },
  ancientScrolls: {
    backgroundColor: "#f5e6cc",
    textColor: "#663300",
    secretColor: "#9933ff",
    failedColor: "#cc0000",
    fontFamily: "Times"
  },
  steampunkAdventure: {
    backgroundColor: "#2b2b2b",
    textColor: "#ffd700",
    secretColor: "#00ccff",
    failedColor: "#a52a2a",
    fontFamily: "Roboto Slab"
  }
};
var ThemeConfig = class extends FormApplication {
  constructor() {
    super();
    ui.simpleQuest.render(true);
    setSetting("themeConfigShown", true);
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: MODULE_ID + "-" + this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: true,
      minimizable: true,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`),
      closeOnSubmit: true,
      width: 400
    });
  }
  activateListeners(html) {
    super.activateListeners(html);
    html = html[0];
    html.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const theme = event.target.dataset.theme;
        this.setTheme(theme);
      });
    });
  }
  async setTheme(theme) {
    const themeConfig = THEMES[theme];
    if (themeConfig.headerOnlyFont === void 0) themeConfig.headerOnlyFont = "default";
    for (let key of Object.keys(themeConfig)) {
      await setSetting(key, themeConfig[key]);
    }
    this.setPosition({ height: "auto" });
  }
  async getData() {
    return {
      themes: Object.keys(THEMES).map((theme) => {
        return {
          id: theme,
          label: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.themes.${theme}`)
        };
      })
    };
  }
  async _updateObject(event, formData) {
  }
};

// scripts/app/theaterOfTheMind.js
var TheaterOfTheMind = class extends Application {
  constructor(src) {
    super();
    this.src = src.src;
    this.ttmTitle = src.title;
    this.isVideo = this.src.toLowerCase().endsWith(".mp4") || this.src.toLowerCase().endsWith(".webm");
    ui.theaterOfTheMind?.close();
    ui.theaterOfTheMind = this;
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: false,
      minimizable: false,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`)
    });
  }
  async getData() {
    return { src: this.src, isVideo: this.isVideo, title: this.ttmTitle };
  }
  activateListeners(html) {
    super.activateListeners(html);
    html = html[0] ?? html;
    document.querySelector("#interface").appendChild(html);
    html.onclick = () => html.classList.toggle("minimized");
    if (game.user.isGM) html.oncontextmenu = (e) => setSetting("ttmSrc", null);
  }
  async close() {
    ui.theaterOfTheMind = null;
    return super.close();
  }
};
function setTTM(src) {
  src = src || getSetting("ttmSrc");
  if (!src?.src) return ui.theaterOfTheMind?.close();
  new TheaterOfTheMind(src).render(true);
}

// scripts/settings.js
var DEFAULT_TAB_NAMES = {
  quests: "foundry-quest-log-ru.simple-quest.tabs.quests",
  map: "foundry-quest-log-ru.simple-quest.tabs.map",
  timeline: "foundry-quest-log-ru.simple-quest.tabs.timeline",
  lore: "foundry-quest-log-ru.simple-quest.tabs.lore",
  achievements: "foundry-quest-log-ru.simple-quest.tabs.achievements",
  "my-journal": "foundry-quest-log-ru.simple-quest.tabs.my-journal",
  "party-journal": "foundry-quest-log-ru.simple-quest.tabs.party-journal"
};
function registerSettings() {
  game.settings.registerMenu(MODULE_ID, "tabConfig", {
    name: `${MODULE_ID}.settings.tabConfig.name`,
    label: `${MODULE_ID}.settings.tabConfig.label`,
    hint: `${MODULE_ID}.settings.tabConfig.hint`,
    icon: "fas fa-cog",
    type: TabConfig,
    restricted: true
  });
  game.settings.registerMenu(MODULE_ID, "themeConfig", {
    name: `${MODULE_ID}.settings.themeConfig.name`,
    label: `${MODULE_ID}.settings.themeConfig.label`,
    hint: `${MODULE_ID}.settings.themeConfig.hint`,
    icon: "fas fa-palette",
    type: ThemeConfig,
    restricted: true
  });
  const settings = {
    showHistory: {
      name: `${MODULE_ID}.settings.showHistory.name`,
      hint: `${MODULE_ID}.settings.showHistory.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    hideCheckboxAutoHide: {
      name: `${MODULE_ID}.settings.hideCheckboxAutoHide.name`,
      hint: `${MODULE_ID}.settings.hideCheckboxAutoHide.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    },
    folderName: {
      name: `${MODULE_ID}.settings.folderName.name`,
      hint: `${MODULE_ID}.settings.folderName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u041A\u0432\u0435\u0441\u0442\u044B"
    },
    loreFolderName: {
      name: `${MODULE_ID}.settings.loreFolderName.name`,
      hint: `${MODULE_ID}.settings.loreFolderName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u041B\u043E\u0440"
    },
    mapsJournalName: {
      name: `${MODULE_ID}.settings.mapsJournalName.name`,
      hint: `${MODULE_ID}.settings.mapsJournalName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u041A\u0430\u0440\u0442\u044B"
    },
    timelineJournalName: {
      name: `${MODULE_ID}.settings.timelineJournalName.name`,
      hint: `${MODULE_ID}.settings.timelineJournalName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u0425\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u044F"
    },
    achievementsJournalName: {
      name: `${MODULE_ID}.settings.achievementsJournalName.name`,
      hint: `${MODULE_ID}.settings.achievementsJournalName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"
    },
    partyJournalName: {
      name: `${MODULE_ID}.settings.partyJournalName.name`,
      hint: `${MODULE_ID}.settings.partyJournalName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u0413\u0440\u0443\u043F\u043F\u0430"
    },
    sharedJournalName: {
      name: `${MODULE_ID}.settings.sharedJournalName.name`,
      hint: `${MODULE_ID}.settings.sharedJournalName.hint`,
      scope: "world",
      config: true,
      type: String,
      default: "\u041E\u0431\u0449\u0438\u0439"
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    },
    hideFolderFromPlayers: {
      name: `${MODULE_ID}.settings.hideFolderFromPlayers.name`,
      hint: `${MODULE_ID}.settings.hideFolderFromPlayers.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    useMessageTheme: {
      name: `${MODULE_ID}.settings.useMessageTheme.name`,
      hint: `${MODULE_ID}.settings.useMessageTheme.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    showQuestNotifications: {
      name: `${MODULE_ID}.settings.showQuestNotifications.name`,
      hint: `${MODULE_ID}.settings.showQuestNotifications.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    newQuestSoundEffect: {
      name: `${MODULE_ID}.settings.newQuestSoundEffect.name`,
      hint: `${MODULE_ID}.settings.newQuestSoundEffect.hint`,
      scope: "world",
      config: true,
      type: String,
      filePicker: "audio",
      default: ""
    },
    updateQuestSoundEffect: {
      name: `${MODULE_ID}.settings.updateQuestSoundEffect.name`,
      hint: `${MODULE_ID}.settings.updateQuestSoundEffect.hint`,
      scope: "world",
      config: true,
      type: String,
      filePicker: "audio",
      default: ""
    },
    openJournalPinsAsModals: {
      name: `${MODULE_ID}.settings.openJournalPinsAsModals.name`,
      hint: `${MODULE_ID}.settings.openJournalPinsAsModals.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableQuests: {
      name: `${MODULE_ID}.settings.enableQuests.name`,
      hint: `${MODULE_ID}.settings.enableQuests.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enablePartyJournal: {
      name: `${MODULE_ID}.settings.enablePartyJournal.name`,
      hint: `${MODULE_ID}.settings.enablePartyJournal.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableMyJournal: {
      name: `${MODULE_ID}.settings.enableMyJournal.name`,
      hint: `${MODULE_ID}.settings.enableMyJournal.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableMaps: {
      name: `${MODULE_ID}.settings.enableMaps.name`,
      hint: `${MODULE_ID}.settings.enableMaps.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableLore: {
      name: `${MODULE_ID}.settings.enableLore.name`,
      hint: `${MODULE_ID}.settings.enableLore.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableTimeline: {
      name: `${MODULE_ID}.settings.enableTimeline.name`,
      hint: `${MODULE_ID}.settings.enableTimeline.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    enableAchievements: {
      name: `${MODULE_ID}.settings.enableAchievements.name`,
      hint: `${MODULE_ID}.settings.enableAchievements.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    },
    imagePageMask: {
      name: `${MODULE_ID}.settings.imagePageMask.name`,
      hint: `${MODULE_ID}.settings.imagePageMask.hint`,
      scope: "world",
      config: true,
      type: String,
      filePicker: "image",
      default: "modules/foundry-quest-log-ru/assets/mask/mask1.webp"
    },
    matchJournalPermission: {
      name: `${MODULE_ID}.settings.matchJournalPermission.name`,
      hint: `${MODULE_ID}.settings.matchJournalPermission.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    },
    ttmSrc: {
      scope: "world",
      config: false,
      type: Object,
      default: null,
      onChange: (val) => setTTM(val)
    },
    lastQuest: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastMap: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastLore: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastAchievements: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastTimeline: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastMyJournal: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    lastPartyJournal: {
      scope: "client",
      config: false,
      type: String,
      default: ""
    },
    timelineScroll: {
      scope: "client",
      config: false,
      type: Number,
      default: 0
    },
    lastTab: {
      scope: "client",
      config: false,
      type: String,
      default: "quests"
    },
    seenQuests: {
      scope: "client",
      config: false,
      type: Object,
      default: {}
    },
    showCompleted: {
      scope: "client",
      config: false,
      type: Boolean,
      default: true
    },
    welcomeMessage: {
      scope: "client",
      config: false,
      type: Boolean,
      default: false
    },
    welcomeMaps: {
      scope: "client",
      config: false,
      type: Boolean,
      default: false
    },
    detailsStatus: {
      scope: "client",
      config: false,
      type: Object,
      default: {}
    },
    windowedMode: {
      scope: "client",
      config: false,
      type: Boolean,
      default: false
    },
    themeConfigShown: {
      scope: "client",
      config: false,
      type: Boolean,
      default: false
    },
    fontSize: {
      scope: "client",
      config: false,
      type: Number,
      default: 1.5,
      onChange: () => {
        ui.simpleQuest.updateStyle();
      }
    },
    tabNames: {
      scope: "world",
      config: false,
      type: Object,
      default: { ...DEFAULT_TAB_NAMES },
      onChange: () => {
        ui.simpleQuest.refresh();
      }
    }
  };
  registerSettingsArray(settings);
  Hooks.on("renderSettingsConfig", (app, html, data) => {
    colorPicker("backgroundColor", html);
    colorPicker("textColor", html);
    colorPicker("secretColor", html);
    colorPicker("failedColor", html);
    colorPicker("labelColor", html);
    html.querySelector(`select[name="${MODULE_ID}.fontFamily"]`).querySelectorAll("option").forEach((option2) => {
      option2.style.fontFamily = option2.value;
    });
    html.querySelector(`select[name="${MODULE_ID}.headerOnlyFont"]`).querySelectorAll("option").forEach((option2) => {
      option2.style.fontFamily = option2.value;
    });
  });
}
function registerOnReadySettings() {
  const settings = {
    fontFamily: {
      name: `${MODULE_ID}.settings.fontFamily.name`,
      hint: `${MODULE_ID}.settings.fontFamily.hint`,
      scope: "world",
      config: true,
      type: String,
      choices: foundry.applications.settings.menus.FontConfig.getAvailableFontChoices(),
      //Object.keys(CONFIG.fontDefinitions).reduce((obj, key) => {obj[key] = key; return obj}, {}),
      default: "Times New Roman",
      onChange: () => {
        ui.simpleQuest.updateStyle();
      }
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
      }
    }
  };
  registerSettingsArray(settings);
}
function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}
async function setSetting(key, value) {
  return await game.settings.set(MODULE_ID, key, value);
}
function getDefaultSetting(key) {
  return game.settings.settings.get(MODULE_ID + "." + key).default;
}
function getTabNames() {
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
function colorPicker(settingId, html) {
  const colorPickerElement = document.createElement("input");
  colorPickerElement.setAttribute("type", "color");
  colorPickerElement.setAttribute("data-edit", MODULE_ID + "." + settingId);
  colorPickerElement.value = game.settings.get(MODULE_ID, settingId) || game.settings.settings.get(MODULE_ID + "." + settingId).default;
  const stringInputElement = html.querySelector(`input[name="${MODULE_ID}.${settingId}"]`);
  if (!stringInputElement.value) stringInputElement.value = colorPickerElement.value;
  stringInputElement.classList.add("color");
  stringInputElement.after(colorPickerElement);
}

// scripts/config.js
function initConfig() {
  Hooks.on("getSceneControlButtons", (buttons) => {
    buttons.notes.tools.toggleSimpleQuest = {
      name: "toggleSimpleQuest",
      title: game.i18n.localize(`${MODULE_ID}.hotkeys.toggleSimpleQuest.name`),
      icon: "fas fa-scroll-old",
      button: true,
      onChange: () => {
        ui.simpleQuest.toggle();
      }
    };
  });
  Hooks.on("renderJournalDirectory", (app, html) => {
    const buttonContainer = html.querySelector(".header-actions.action-buttons");
    const button = document.createElement("button");
    button.classList.add(`${MODULE_ID}-open-quest-app`);
    button.type = "button";
    button.innerHTML = `<i class="fas fa-scroll-old"></i><span>${game.i18n.localize(`${MODULE_ID}.foundry-quest-log-ru.title`)}</span>`;
    button.onclick = () => {
      ui.simpleQuest.toggle();
    };
    buttonContainer.appendChild(button);
    if (game.user.isGM) return;
    const hideForPlayers = getSetting("hideFolderFromPlayers");
    if (!hideForPlayers) return;
    const folder = Array.from(game.folders).find((f) => f.name === getSetting("folderName") && f.type === "JournalEntry");
    if (!folder) return;
    const folderEl = html.querySelector(`li[data-uuid="${folder.uuid}"]`);
    if (folderEl) folderEl.classList.add("foundry-quest-log-ru-hide-folder");
  });
  const PROSE_MIRROR_MENUS = {
    CALLOUT: [
      {
        id: "callout-lore",
        class: "notification lore"
      },
      {
        id: "callout-creature",
        class: "notification creature"
      },
      {
        id: "callout-npc",
        class: "notification npc"
      },
      {
        id: "callout-location",
        class: "notification location"
      },
      {
        id: "callout-magic",
        class: "notification magic"
      },
      {
        id: "callout-item",
        class: "notification item"
      },
      {
        id: "callout-event",
        class: "notification event"
      },
      {
        id: "callout-time",
        class: "notification time"
      }
    ],
    PAGE_INSERT: [
      {
        id: "parchment-note-1",
        class: "parchment-note-1"
      },
      {
        id: "parchment-note-2",
        class: "parchment-note-2"
      },
      {
        id: "parchment-note-3",
        class: "parchment-note-3"
      },
      {
        id: "parchment-note-4",
        class: "parchment-note-4"
      },
      {
        id: "parchment-book-1",
        class: "parchment-book-1"
      },
      {
        id: "parchment-book-2",
        class: "parchment-book-2"
      },
      {
        id: "parchment-scroll-1",
        class: "parchment-scroll-1"
      }
    ],
    TEXT: [
      {
        id: "paragraph-initial",
        class: "initial"
      }
    ]
  };
  const ALL_CLASSES = {
    CALLOUT: PROSE_MIRROR_MENUS.CALLOUT.map((c) => c.class),
    PAGE_INSERT: PROSE_MIRROR_MENUS.PAGE_INSERT.map((c) => c.class),
    COMBINED: [...PROSE_MIRROR_MENUS.CALLOUT.map((c) => c.class), ...PROSE_MIRROR_MENUS.PAGE_INSERT.map((c) => c.class)]
  };
  Hooks.on("getProseMirrorMenuDropDowns", (proseMirrorMenu, menus) => {
    const calloutMenu = {
      action: `${MODULE_ID}-callout`,
      title: `${MODULE_ID}.proseMirrorMenu.callout.title`,
      children: PROSE_MIRROR_MENUS.CALLOUT.map((c) => {
        return {
          action: c.id,
          title: `${MODULE_ID}.proseMirrorMenu.callout.${c.id}`,
          priority: 3,
          cmd: () => {
            handleToggleClass(
              proseMirrorMenu,
              c.class,
              ALL_CLASSES.COMBINED.filter((cc) => cc !== c.class)
            );
          }
        };
      })
    };
    const pageInsertMenu = {
      action: `${MODULE_ID}-page-insert`,
      title: `${MODULE_ID}.proseMirrorMenu.pageInsert.title`,
      children: PROSE_MIRROR_MENUS.PAGE_INSERT.map((c) => {
        return {
          action: c.id,
          title: `${MODULE_ID}.proseMirrorMenu.pageInsert.${c.id}`,
          priority: 3,
          cmd: () => {
            handleToggleClass(
              proseMirrorMenu,
              c.class,
              ALL_CLASSES.COMBINED.filter((cc) => cc !== c.class)
            );
          }
        };
      })
    };
    menus.format.entries.push(calloutMenu, pageInsertMenu);
    const inline = menus.format.entries.find((e) => e.action === "inline");
    inline.children.push({
      action: `${MODULE_ID}-initial`,
      title: `${MODULE_ID}.proseMirrorMenu.text.initial`,
      priority: 3,
      cmd: () => {
        handleToggleClass(proseMirrorMenu, "initial");
      }
    });
  });
  function handleToggleClass(menu, className, removeClasses = []) {
    const view = menu.view;
    const { state, dispatch } = view;
    const { from, to, $from } = state.selection;
    const paragraphInfo = findClosestAncestorOfType(state.doc.resolve(from), state.schema.nodes.paragraph);
    if (!paragraphInfo) return false;
    let currentClass = (paragraphInfo.node.attrs._preserve.class || "").split(" ").filter((c) => c).join(" ");
    removeClasses.forEach((c) => {
      currentClass = currentClass.replace(c, "");
    });
    currentClass = currentClass.split(" ").filter((c) => c).join(" ");
    const newClass = currentClass.includes(className) ? currentClass.replace(className, "") : currentClass + " " + className;
    const prevAttrs = foundry.utils.deepClone(paragraphInfo.node.attrs);
    const prevAttrsClone = foundry.utils.deepClone(paragraphInfo.node.attrs);
    const newState = foundry.utils.mergeObject(prevAttrs, { _preserve: { class: newClass.trim() } });
    const tr = state.tr.setNodeMarkup(paragraphInfo.pos, void 0, newState);
    dispatch(tr);
    state.tr.setNodeMarkup(paragraphInfo.pos, void 0, foundry.utils.mergeObject(prevAttrsClone, { _preserve: { class: "" } }));
    return true;
  }
  function findClosestAncestorOfType($pos, nodeType) {
    for (let depth = $pos.depth; depth > 0; depth--) {
      const node = $pos.node(depth);
      if (node.type === nodeType) {
        return { pos: $pos.before(depth), node, originalPos: depth };
      }
    }
    return null;
  }
  Hooks.on("renderJournalEntryPageImageSheet", (app, html, data) => {
    if (!ui.simpleQuest?.rendered || !game.user.isGM) return;
    const formGroups = html.querySelectorAll(".form-group");
    const lastFormGroup = formGroups[formGroups.length - 1];
    const currentMask = app.document.getFlag(MODULE_ID, "fowMask") || "";
    lastFormGroup.insertAdjacentHTML(
      "afterend",
      `<div class="form-group">
        <label>${game.i18n.localize(`${MODULE_ID}.injected.fowMask.label`)}</label>
        <file-picker name="flags.foundry-quest-log-ru.fowMask" type="image" value="${currentMask}"></file-picker>
    </div>`
    );
    app.setPosition({ height: "auto" });
  });
}

// scripts/helpers.js
async function createDefaultStructure() {
  const folderName = getSetting("folderName");
  const folder = Array.from(game.folders).find((f) => f.name === folderName && f.type === "JournalEntry");
  if (folder) return createPlayerJournal(folder);
  const folderDocument = await Folder.create({
    name: folderName,
    color: "#03bafc",
    sorting: "m",
    type: "JournalEntry",
    folder: null
  });
  const loreFolder = await createLoreFolder();
  await createPlayerJournal(folderDocument);
  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.notifications.defaultStructureCreated`));
}
async function createPlayerJournal(folder) {
  const partyFolderName = getSetting("partyJournalName");
  let partyFolder = Array.from(game.folders).find((f) => f.name === partyFolderName && f.type === "JournalEntry" && f.folder === folder);
  if (!partyFolder) {
    partyFolder = await Folder.create({ name: partyFolderName, type: "JournalEntry", color: "#1fa87f", sorting: "m", folder });
  }
  let updated = false;
  const players = Array.from(game.users);
  const oldPlayerJournal = Array.from(game.journal).find((j) => j.name === partyFolderName && j.folder === folder);
  let migrated = false;
  for (const player of players) {
    let playerFolder = Array.from(game.folders).find((f) => f.name === player.name && f.type === "JournalEntry" && f.folder === partyFolder);
    if (!playerFolder) {
      updated = true;
      playerFolder = await Folder.create({ name: player.name, type: "JournalEntry", color: player.color, sorting: "m", folder: partyFolder.id });
      if (oldPlayerJournal) {
        const oldPage = oldPlayerJournal.pages.getName(player.name);
        const defaultJournal = await JournalEntry.create({
          name: "Default",
          folder: playerFolder,
          ownership: {
            default: 0,
            [player.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
          },
          pages: [oldPage.toObject()]
        });
        migrated = true;
      }
    }
  }
  const sharedFolderName = getSetting("sharedJournalName");
  let sharedFolder = Array.from(game.folders).find((f) => f.name === sharedFolderName && f.type === "JournalEntry" && f.folder === partyFolder);
  if (!sharedFolder) {
    updated = true;
    sharedFolder = await Folder.create({ name: sharedFolderName, type: "JournalEntry", sorting: "m", folder: partyFolder.id });
    if (oldPlayerJournal) {
      const oldSharedPage = oldPlayerJournal.pages.getName(sharedFolderName);
      const sharedJournal = await JournalEntry.create({
        name: "Default",
        folder: sharedFolder,
        ownership: {
          default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        },
        pages: [oldSharedPage.toObject()]
      });
    }
  }
  if (migrated) {
    oldPlayerJournal.update({ folder: null });
    ui.notifications.info("\u041A\u0432\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0436\u0443\u0440\u043D\u0430\u043B: \u0441\u0442\u0430\u0440\u044B\u0435 \u0436\u0443\u0440\u043D\u0430\u043B\u044B \u0433\u0440\u0443\u043F\u043F\u044B \u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D\u044B \u0432 \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443. \u041F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043C\u0438\u0433\u0440\u0430\u0446\u0438\u0438 \u0441\u0442\u0430\u0440\u044B\u0439 \u0436\u0443\u0440\u043D\u0430\u043B \u043C\u043E\u0436\u043D\u043E \u0443\u0434\u0430\u043B\u0438\u0442\u044C.", { permanent: true });
  }
  if (updated) ui.notifications.info(game.i18n.localize(`${MODULE_ID}.notifications.playerJournalUpdated`));
}
async function createLoreFolder() {
  const loreFolderName = getSetting("loreFolderName");
  let loreFolder = Array.from(game.folders).find((f) => f.name === loreFolderName && f.type === "JournalEntry");
  if (!loreFolder) {
    loreFolder = await Folder.create({ name: loreFolderName, type: "JournalEntry", color: "#a85d1f", sorting: "m" });
  }
  return loreFolder;
}
function showWelcomeScreen(force = false) {
  const welcomeMessage = getSetting("welcomeMessage");
  if (welcomeMessage && !force) return;
  Dialog.prompt({
    title: game.i18n.localize(`${MODULE_ID}.welcomeScreen.title`),
    content: game.i18n.localize(`${MODULE_ID}.welcomeScreen.content`),
    callback: () => {
      setSetting("welcomeMessage", true);
    },
    render: (html) => {
      html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-screen");
    }
  });
}
function showWelcomeMaps(force = false) {
  const welcomeMaps = getSetting("welcomeMaps");
  if (welcomeMaps && !force) return;
  Dialog.prompt({
    title: game.i18n.localize(`${MODULE_ID}.welcomeMaps.title`),
    content: game.i18n.localize(`${MODULE_ID}.welcomeMaps.content`),
    options: {
      width: 600
    },
    callback: () => {
      setSetting("welcomeMaps", true);
    },
    render: (html) => {
      html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-screen");
      html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-maps");
    },
    close: () => {
    }
  });
}
function createDemoQuest() {
  ui.notifications.warn("PF2e Journal: \u0434\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u0437\u0430\u043C\u0435\u043D\u0435\u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u043C \u043D\u0430\u0431\u043E\u0440\u043E\u043C \xAB\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\xBB.");
}
function showQuestNotification(page2, newQuest = false, isLore = false, isAchievement = false) {
  if (!getSetting("showQuestNotifications")) return;
  const isHidden = page2.getFlag(MODULE_ID, "hidden");
  if (isHidden) return;
  const existing = document.querySelector(`.foundry-quest-log-ru-notification[data-uuid="${page2.uuid}"]`);
  if (existing) return;
  const notificationContainer = document.getElementById("foundry-quest-log-ru-notification-container") || document.createElement("div");
  notificationContainer.id = "foundry-quest-log-ru-notification-container";
  document.body.appendChild(notificationContainer);
  const notification = document.createElement("div");
  notification.dataset.uuid = page2.uuid;
  notification.classList.add("foundry-quest-log-ru-notification");
  const questName = `<span class="foundry-quest-log-ru-notification-quest-name">${page2.name}</span>`;
  if (newQuest) {
    const sound = getSetting("newQuestSoundEffect");
    if (sound) foundry.audio.AudioHelper.play({ src: sound, volume: game.settings.get("core", "globalInterfaceVolume"), loop: false });
    if (isLore) {
      notification.innerHTML = `<i class="fas fa-scroll-old"></i> ${game.i18n.localize(`${MODULE_ID}.shareLore.chatMessage`) + " " + questName}`;
    } else if (isAchievement) {
      notification.innerHTML = `<i class="fas fa-trophy"></i> ${game.i18n.localize(`${MODULE_ID}.shareAchievement.chatMessage`) + " " + questName}`;
    } else {
      notification.innerHTML = `<i class="fas fa-exclamation"></i> ${game.i18n.localize(`${MODULE_ID}.shareQuest.chatMessage`) + " " + questName}`;
    }
  } else {
    const sound = getSetting("updateQuestSoundEffect");
    if (sound) foundry.audio.AudioHelper.play({ src: sound, volume: game.settings.get("core", "globalInterfaceVolume"), loop: false });
    notification.innerHTML = `<i class="fas fa-exclamation"></i> ${game.i18n.localize(`${MODULE_ID}.questNotification.text`).replace("%q", questName)}`;
  }
  notificationContainer.appendChild(notification);
  const fontSize = getSetting("fontSize") * 2.5 + "rem";
  notification.animate(
    [
      { opacity: 0, height: "0rem" },
      { opacity: 1, height: fontSize }
    ],
    {
      duration: 500,
      easing: "ease-in-out"
    }
  );
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    notification.animate(
      [
        { opacity: 1, height: fontSize },
        { opacity: 0, height: "0rem" }
      ],
      {
        duration: 500,
        easing: "ease-in-out"
      }
    ).onfinish = () => {
      notificationContainer.removeChild(notification);
      if (notificationContainer.children.length === 0) {
        notificationContainer.remove();
      }
    };
  };
  notification.onmouseup = (e) => {
    dismiss();
    if (e.button === 0) {
      ui.simpleQuest.openToPage(page2.uuid);
    }
  };
  setTimeout(
    () => {
      dismiss();
    },
    newQuest ? 1e4 : 5e3
  );
}

// scripts/mapImage.js
var MapImage = class {
  constructor(src, page2, multiSource, lockPins) {
    this.src = src;
    this.page = page2;
    this.multiSource = multiSource;
    this._lockPins = lockPins;
    this.isMultiSource = multiSource.length > 1;
    this.element = document.createElement("div");
    this.element.classList.add("foundry-quest-log-ru-map-image");
    this.element.style.overflow = "hidden";
    this.element.style.position = "relative";
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.setProperty("--zoom-level", 1);
    this.element.style.cursor = this.grabCursor;
    this.element.style.maskImage = "linear-gradient(rgba(0, 0, 0, 0) 0%, black 10%, black 90%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, rgba(0, 0, 0, 0) 0%, black 10%, black 90%, rgba(0, 0, 0, 0) 100%)";
    this.element.style.webkitMaskImage = "linear-gradient(rgba(0, 0, 0, 0) 0%, black 10%, black 90%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, rgba(0, 0, 0, 0) 0%, black 10%, black 90%, rgba(0, 0, 0, 0) 100%)";
    this.element.style.webkitMaskComposite = "source-in";
    this.element.style.opacity = 0;
    this.aspectRatio = 1;
    this._exploredPolygon = this.page.getFlag(MODULE_ID, "fogOfWar") ?? [];
    this._fowMaskImage = this.page.getFlag(MODULE_ID, "fowMask") || null;
    this.create();
    this.initMarkers();
    this._loadPosition();
    const size = JSON.stringify(this._exploredPolygon).length / 1e3;
    console.log(`Estimated size of fog of war for ${this.page.name}: ${size} KB`);
  }
  get grabCursor() {
    return "grab";
  }
  get grabCursorActive() {
    return "grabbing";
  }
  addCircleFogOfWar(radius = 0.1, c, subtract = false) {
    if (!game.user.isGM) return;
    const polygonPoints = [];
    radius *= this.fowBrushSize / 100;
    const nPoints = Math.max(8, radius * 200);
    const center = this.mousePositionToRelative(c.x, c.y);
    const width = this.FoWSize.width;
    const height = this.FoWSize.height;
    const aspectRatio = width / height;
    for (let i = 0; i < nPoints; i++) {
      const angle = i * 2 * Math.PI / nPoints;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle) * aspectRatio;
      polygonPoints.push({ x, y });
    }
    const currentExploredPolygon = this._exploredPolygon;
    const clipper = new ClipperLib.Clipper();
    const clipperPolygon = new ClipperLib.Path();
    for (const point of polygonPoints) {
      clipperPolygon.push(new ClipperLib.IntPoint(parseInt(point.x * this.FoWSize.width), parseInt(point.y * this.FoWSize.height)));
    }
    if (currentExploredPolygon) {
      clipper.AddPath(clipperPolygon, subtract ? ClipperLib.PolyType.ptClip : ClipperLib.PolyType.ptSubject, true);
      currentExploredPolygon.forEach((path) => {
        clipper.AddPath(path.path, subtract ? ClipperLib.PolyType.ptSubject : ClipperLib.PolyType.ptClip, true);
      });
      const solutionPaths = new ClipperLib.PolyTree();
      const mode = subtract ? ClipperLib.ClipType.ctDifference : ClipperLib.ClipType.ctUnion;
      clipper.Execute(mode, solutionPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
      const allPolygons = solutionPaths.m_AllPolys.map((poly) => {
        return { path: poly.m_polygon, isHole: poly.IsHole() };
      });
      this._exploredPolygon = allPolygons;
    } else {
      clipper.AddPath(clipperPolygon, ClipperLib.PolyType.ptSubject, true);
      clipper.AddPath(clipperPolygon, ClipperLib.PolyType.ptClip, true);
      const solutionPaths = new ClipperLib.PolyTree();
      clipper.Execute(ClipperLib.ClipType.ctUnion, solutionPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
      const allPolygons = solutionPaths.m_AllPolys.map((poly) => {
        return { path: poly.m_polygon, isHole: poly.IsHole() };
      });
      this._exploredPolygon = allPolygons;
    }
    this._exploredPolygon = this._exploredPolygon.sort((a, b) => {
      a.area ??= Math.abs(ClipperLib.Clipper.Area(a.path));
      b.area ??= Math.abs(ClipperLib.Clipper.Area(b.path));
      if (a.area < b.area) return 1;
    });
    this._exploredPolygon.forEach((polygon) => delete polygon.area);
    this.updateFoWSVG();
    this._fowNeedsSaving = true;
  }
  updateFoWSVG() {
    if (this._fowMaskImage) return this.updateFoWSVGWithImage();
    const oldSVG = this.image.querySelector("svg");
    if (oldSVG) oldSVG.remove();
    const polygon = this._exploredPolygon;
    if (!polygon) return;
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgContainer.style.width = "100%";
    svgContainer.style.height = "100%";
    svgContainer.style.filter = "blur(5px)";
    svgContainer.style.mixBlendMode = "multiply";
    svgContainer.style.position = "absolute";
    svgContainer.style.pointerEvents = "none";
    svgContainer.style.opacity = game.user.isGM ? 0.7 : 1;
    svgContainer.setAttribute("viewBox", `0 0 ${this.FoWSize.width} ${this.FoWSize.height}`);
    svgContainer.setAttribute("preserveAspectRatio", "none");
    this.image.appendChild(svgContainer);
    const svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svgRect.setAttribute("x", 0);
    svgRect.setAttribute("y", 0);
    svgRect.setAttribute("width", this.FoWSize.width);
    svgRect.setAttribute("height", this.FoWSize.height);
    svgRect.setAttribute("fill", "white");
    svgContainer.appendChild(svgRect);
    for (const path of polygon) {
      const svgPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      for (const point of path.path) {
        const svgPoint = svgContainer.createSVGPoint();
        svgPoint.x = point.X;
        svgPoint.y = point.Y;
        svgPolygon.points.appendItem(svgPoint);
      }
      svgPolygon.setAttribute("fill", path.isHole ? "white" : "black");
      svgContainer.appendChild(svgPolygon);
    }
    this._svgFow = svgContainer;
    this.setFOWBlur();
  }
  updateFoWSVGWithImage() {
    const oldSVG = this.image.querySelector("svg");
    if (oldSVG) oldSVG.remove();
    const polygon = this._exploredPolygon;
    if (!polygon) return;
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgContainer.style.width = "100%";
    svgContainer.style.height = "100%";
    svgContainer.style.position = "absolute";
    svgContainer.style.pointerEvents = "none";
    svgContainer.style.opacity = game.user.isGM ? 0.7 : 1;
    svgContainer.setAttribute("viewBox", `0 0 ${this.FoWSize.width} ${this.FoWSize.height}`);
    svgContainer.setAttribute("preserveAspectRatio", "none");
    this.image.appendChild(svgContainer);
    const svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svgRect.setAttribute("x", 0);
    svgRect.setAttribute("y", 0);
    svgRect.setAttribute("width", this.FoWSize.width);
    svgRect.setAttribute("height", this.FoWSize.height);
    svgRect.setAttribute("fill", "black");
    const maskElement = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    maskElement.setAttribute("id", "fow-mask");
    maskElement.setAttribute("x", 0);
    maskElement.setAttribute("y", 0);
    maskElement.setAttribute("width", this.FoWSize.width);
    maskElement.setAttribute("height", this.FoWSize.height);
    svgContainer.appendChild(maskElement);
    maskElement.appendChild(svgRect);
    for (const path of polygon) {
      const svgPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      for (const point of path.path) {
        const svgPoint = svgContainer.createSVGPoint();
        svgPoint.x = point.X;
        svgPoint.y = point.Y;
        svgPolygon.points.appendItem(svgPoint);
      }
      svgPolygon.setAttribute("fill", path.isHole ? "black" : "white");
      maskElement.appendChild(svgPolygon);
    }
    const svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
    svgImage.setAttribute("href", this._fowMaskImage);
    svgImage.setAttribute("width", this.FoWSize.width);
    svgImage.setAttribute("height", this.FoWSize.height);
    svgImage.setAttribute("preserveAspectRatio", "none");
    svgImage.setAttribute("mask", "url(#fow-mask)");
    svgContainer.appendChild(svgImage);
    this._svgFow = svgContainer;
    this.setFOWBlur();
  }
  setFOWBlur() {
    if (!this._svgFow) return;
    this._svgFow.style.filter = `blur(${Math.max(1.5, Math.min(this._zoomLevel ?? 1, 5))}px)`;
  }
  saveFoW() {
    if (!this._fowNeedsSaving) return;
    this._fowNeedsSaving = false;
    const polygon = this._exploredPolygon;
    if (!polygon) return;
    this.page.setFlag(MODULE_ID, "fogOfWar", polygon);
  }
  resetFow() {
    Dialog.confirm({
      title: game.i18n.localize(`${MODULE_ID}.resetFow.title`),
      content: game.i18n.localize(`${MODULE_ID}.resetFow.content`),
      yes: () => {
        const fow = [
          {
            isHole: false,
            path: [
              { X: 0, Y: 0 },
              { X: this.FoWSize.width, Y: 0 },
              { X: this.FoWSize.width, Y: this.FoWSize.height },
              { X: 0, Y: this.FoWSize.height }
            ]
          }
        ];
        this.page.setFlag(MODULE_ID, "fogOfWar", fow);
        this._exploredPolygon = fow;
      },
      no: () => {
        return;
      },
      defaultYes: false
    });
  }
  mousePositionToRelative(x, y) {
    const imageBoundingRect = this.image.getBoundingClientRect();
    x -= imageBoundingRect.left;
    y -= imageBoundingRect.top;
    const xPercent = x / imageBoundingRect.width;
    const yPercent = y / imageBoundingRect.height;
    return { x: xPercent, y: yPercent };
  }
  async preloadFowMask() {
    if (!this._fowMaskImage) return;
    const img = new Image();
    img.src = this._fowMaskImage;
    if (img.complete) return;
    await new Promise((resolve) => img.onload = resolve);
  }
  create() {
    const image = document.createElement("div");
    image.style.backgroundImage = `url('${this.src}')`;
    image.style.backgroundSize = "contain";
    image.style.backgroundPosition = "center";
    image.style.overflow = "hidden";
    const img = new Image();
    img.src = this.src;
    img.style.opacity = 0;
    image.style.position = "absolute";
    this.image = image;
    this.image.appendChild(img);
    this.loadMultiSource();
    let isDown = false;
    let isRightDown = false;
    let startX;
    let startY;
    let startImgX;
    let startImgY;
    let imgX = 0;
    let imgY = 0;
    let hasZoomed = false;
    let originalWidth = 0;
    let originalHeight = 0;
    let currentZoom = 1;
    const onLoadedImage = () => {
      this.preloadFowMask().then(() => {
        this.element.style.opacity = 1;
      });
      this.aspectRatio = img.naturalWidth / img.naturalHeight;
      this.FoWSize = { width: img.naturalWidth, height: img.naturalHeight };
      this.updateFoWSVG();
      const width = this.element.offsetWidth || window.innerWidth * 0.5;
      this.image.style.width = width + "px";
      this.image.style.height = width / this.aspectRatio + "px";
      this.image.style.maxWidth = "unset";
      this.image.style.maxHeight = "unset";
      const loaded = this._loadPosition();
      img.remove();
      const doAsync = async () => {
        let imageBoundingRect = this.image.getBoundingClientRect();
        while (!imageBoundingRect.width || !imageBoundingRect.height) {
          await new Promise((resolve) => setTimeout(resolve, 1));
          imageBoundingRect = this.image.getBoundingClientRect();
        }
        const elementBoundingRect = this.element.getBoundingClientRect();
        const bWidth = imageBoundingRect.width;
        const bHeight = imageBoundingRect.height;
        const elementWidth = elementBoundingRect.width;
        const elementHeight = elementBoundingRect.height;
        const widthScale = elementWidth / bWidth;
        const heightScale = elementHeight / bHeight;
        const scale = Math.min(widthScale, heightScale);
        originalHeight = bHeight * scale;
        originalWidth = bWidth * scale;
        if (loaded) {
          imgX = loaded.imgX ?? 0;
          imgY = loaded.imgY ?? 0;
          this.setMultiSourceVisibility(originalWidth, originalHeight, loaded.width, loaded.height);
        } else {
          this.image.style.width = bWidth * scale + "px";
          this.image.style.height = bHeight * scale + "px";
          this.image.style.left = (elementWidth - bWidth * scale) / 2 + "px";
          this.image.style.top = (elementHeight - bHeight * scale) / 2 + "px";
          imgX = (elementWidth - bWidth * scale) / 2;
          imgY = (elementHeight - bHeight * scale) / 2;
        }
      };
      doAsync();
    };
    this.element.appendChild(image);
    if (!img.complete) img.onload = onLoadedImage;
    else onLoadedImage();
    image.addEventListener("mouseup", this._addMarker.bind(this));
    const markerPreview = document.createElement("div");
    markerPreview.classList.add("foundry-quest-log-ru-marker");
    markerPreview.style.position = "absolute";
    const i = document.createElement("i");
    i.classList.add("fas", "fa-location-dot");
    markerPreview.appendChild(i);
    markerPreview.style.transform = "translate(-50%, -50%)";
    markerPreview.style.color = "red";
    markerPreview.style.pointerEvents = "none";
    const brushPreview = document.createElement("div");
    brushPreview.style.position = "absolute";
    brushPreview.style.borderRadius = "50%";
    brushPreview.style.pointerEvents = "none";
    brushPreview.style.transform = "translate(-50%, -50%)";
    brushPreview.style.border = "2px dashed";
    brushPreview.style.zIndex = 100;
    brushPreview.style.boxShadow = "0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), inset 0 0 5px var(--foundry-quest-log-ru-background), inset 0 0 5px var(--foundry-quest-log-ru-background), inset 0 0 5px var(--foundry-quest-log-ru-background), inset 0 0 5px var(--foundry-quest-log-ru-background), inset 0 0 5px var(--foundry-quest-log-ru-background)";
    brushPreview.style.display = "none";
    const rulerAnchor = document.createElement("div");
    rulerAnchor.style.position = "absolute";
    rulerAnchor.style.transform = "translate(-50%, -85%)";
    rulerAnchor.style.pointerEvents = "none";
    rulerAnchor.style.zIndex = 100;
    rulerAnchor.style.display = "none";
    rulerAnchor.style.fontSize = "3vh";
    rulerAnchor.className = "foundry-quest-log-ru-ruler-anchor";
    rulerAnchor.innerHTML = `<i class="fas fa-map-pin"></i>`;
    this._rulerAnchor = rulerAnchor;
    const mouseTooltip = document.createElement("div");
    mouseTooltip.style.position = "absolute";
    mouseTooltip.style.transform = "translate(-50%, -100%)";
    mouseTooltip.style.pointerEvents = "none";
    mouseTooltip.style.zIndex = 1e5;
    mouseTooltip.style.fontSize = "3vh";
    mouseTooltip.classList.add("foundry-quest-log-ru-pointer-tooltip");
    const rulerLine = document.createElement("div");
    rulerLine.style.position = "absolute";
    rulerLine.style.pointerEvents = "none";
    rulerLine.style.height = "3px";
    rulerLine.style.background = "var(--foundry-quest-log-ru-text-1)";
    rulerLine.style.transformOrigin = "left center";
    rulerLine.style.boxShadow = "0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background), 0 0 5px var(--foundry-quest-log-ru-background)";
    rulerLine.style.borderRadius = "5px";
    rulerLine.style.width = "100%";
    rulerLine.style.zIndex = 50;
    this.image.appendChild(brushPreview);
    this.element.addEventListener("mousedown", (e) => {
      const isShiftDown = e.shiftKey;
      const isLeftClick = e.button === 0;
      const isCtrlDown = e.ctrlKey;
      if (isCtrlDown) {
        this.image.appendChild(rulerAnchor);
        this.image.appendChild(rulerLine);
        document.body.appendChild(mouseTooltip);
        rulerAnchor.style.display = "block";
        rulerAnchor._enabled = true;
        const imageBoundingRect = this.image.getBoundingClientRect();
        const xPercent = (e.pageX - imageBoundingRect.left) / imageBoundingRect.width;
        const yPercent = (e.pageY - imageBoundingRect.top) / imageBoundingRect.height;
        rulerAnchor.dataset.leftPercent = xPercent;
        rulerAnchor.dataset.topPercent = yPercent;
        rulerAnchor.style.left = xPercent * 100 + "%";
        rulerAnchor.style.top = yPercent * 100 + "%";
      }
      if (isLeftClick) {
        isDown = this.page.isOwner;
        if (isShiftDown) return;
        !!!this._movingMarker && this.image.appendChild(markerPreview);
      } else {
        isRightDown = true;
        if (isShiftDown) return;
        this.element.style.cursor = this.grabCursorActive;
        startX = e.pageX - this.element.offsetLeft;
        startY = e.pageY - this.element.offsetTop;
        startImgX = imgX;
        startImgY = imgY;
        this._savePosition();
      }
    });
    this.element.addEventListener("mouseleave", () => {
      isDown = false;
      isRightDown = false;
      markerPreview.remove();
      rulerAnchor.remove();
      rulerLine.remove();
      rulerAnchor._enabled = false;
      mouseTooltip.remove();
      this.element.style.cursor = this.grabCursor;
      this._savePosition();
    });
    this.element.addEventListener("mouseup", () => {
      isDown = false;
      isRightDown = false;
      markerPreview.remove();
      rulerAnchor.remove();
      rulerLine.remove();
      rulerAnchor._enabled = false;
      mouseTooltip.remove();
      this.element.style.cursor = this.grabCursor;
      this._savePosition();
      this.saveFoW();
    });
    this.element.addEventListener("mousemove", (e) => {
      const isShiftDown = e.shiftKey;
      const isCtrlDown = e.ctrlKey;
      this.element.classList.toggle("prevent-icon-interaction", isCtrlDown);
      const imageBoundingRect = this.image.getBoundingClientRect();
      const xPercent = (e.pageX - imageBoundingRect.left) / imageBoundingRect.width;
      const yPercent = (e.pageY - imageBoundingRect.top) / imageBoundingRect.height;
      if (game.user.isGM) {
        if (isShiftDown) {
          brushPreview.style.left = xPercent * 100 + "%";
          brushPreview.style.top = yPercent * 100 + "%";
          brushPreview.style.width = this.fowBrushSize * 0.2 + "%";
          brushPreview.style.height = this.fowBrushSize * 0.2 * this.aspectRatio + "%";
          brushPreview.style.display = "block";
          this.element.style.cursor = "none";
        } else {
          brushPreview.style.display = "none";
          if (this.element.style.cursor == "none") this.element.style.cursor = this.grabCursor;
        }
      }
      if (isShiftDown && (isDown || isRightDown)) {
        this.addCircleFogOfWar(0.1, { x: e.pageX, y: e.pageY }, isRightDown);
        return;
      }
      if (isDown && !this._movingMarker && !rulerAnchor._enabled) {
        e.preventDefault();
        const imageBoundingRect2 = this.image.getBoundingClientRect();
        const x2 = e.pageX - imageBoundingRect2.left;
        const y2 = e.pageY - imageBoundingRect2.top;
        markerPreview.style.left = x2 + "px";
        markerPreview.style.top = y2 + "px";
        this.element.style.cursor = "none";
      }
      if (this._movingMarker) {
        e.preventDefault();
        this._movingMarker.style.left = xPercent * 100 + "%";
        this._movingMarker.style.top = yPercent * 100 + "%";
        this._movingMarker.dataset.leftPercent = xPercent;
        this._movingMarker.dataset.topPercent = yPercent;
      }
      if (rulerAnchor._enabled) {
        const deltaX2 = xPercent - parseFloat(rulerAnchor.dataset.leftPercent);
        const deltaY2 = yPercent - parseFloat(rulerAnchor.dataset.topPercent);
        const pxX = deltaX2 * img.naturalWidth;
        const pxY = deltaY2 * img.naturalHeight;
        const angle = Math.atan2(pxY, pxX);
        const pxDistance = Math.sqrt(pxX * pxX + pxY * pxY);
        const percentDistance = pxDistance / img.naturalWidth;
        const units = (pxDistance * (this._measure / 100)).toFixed(2) + " " + this._measureUnits + ".";
        rulerLine.style.width = percentDistance * 100 + "%";
        rulerLine.style.left = parseFloat(rulerAnchor.dataset.leftPercent) * 100 + "%";
        rulerLine.style.top = parseFloat(rulerAnchor.dataset.topPercent) * 100 + "%";
        rulerLine.style.transformOrigin = "left center";
        rulerLine.style.transform = `rotate(${angle}rad)`;
        mouseTooltip.innerHTML = `<i class="fas fa-ruler"></i> ${units}`;
        mouseTooltip.style.left = e.pageX + "px";
        mouseTooltip.style.top = e.pageY + "px";
        this.element.style.cursor = "pointer";
      }
      if (!isRightDown || rulerAnchor._enabled) return;
      e.preventDefault();
      const x = e.pageX - this.element.offsetLeft;
      const y = e.pageY - this.element.offsetTop;
      const deltaX = x - startX;
      const deltaY = y - startY;
      imgX = startImgX + deltaX;
      imgY = startImgY + deltaY;
      image.style.left = imgX + "px";
      image.style.top = imgY + "px";
    });
    const onWheel = (e, force = false) => {
      e.preventDefault();
      const scale = Math.min(Math.max(0.1, 1 + (e.deltaY ?? 1) * -1e-3), 4);
      if (e.shiftKey) {
        const deltaSign = -1 * Math.sign(e.deltaY);
        this._fowBrushSizeInput.value = parseInt(this._fowBrushSizeInput.value) + deltaSign * 5;
        this._fowBrushSizeInput.dispatchEvent(new Event("change"));
        brushPreview.style.width = this.fowBrushSize * 0.2 + "%";
        brushPreview.style.height = this.fowBrushSize * 0.2 * this.aspectRatio + "%";
        return;
      }
      const image2 = this.image;
      const originalAspect = this.aspectRatio;
      const boundingRect = image2.getBoundingClientRect();
      const oldWidth = boundingRect.width;
      const oldHeight = boundingRect.height;
      if (!hasZoomed && !originalWidth && !originalHeight) {
        originalWidth = oldWidth;
        originalHeight = oldHeight;
        hasZoomed = true;
      }
      const newWidth = oldWidth * scale;
      const newHeight = newWidth / originalAspect;
      this._zoomLevel = newWidth / originalWidth;
      this.setFOWBlur();
      if (this._zoomLevel < 0.7 || this._zoomLevel > 20) return;
      this.element.style.setProperty("--zoom-level", this._zoomLevel);
      if (force) return;
      const cursorXPercent = (e.pageX - boundingRect.left) / oldWidth;
      const cursorYPercent = (e.pageY - boundingRect.top) / oldHeight;
      image2.style.width = newWidth + "px";
      image2.style.height = newHeight + "px";
      const deltaX = (newWidth - oldWidth) * cursorXPercent;
      const deltaY = (newHeight - oldHeight) * cursorYPercent;
      imgX -= deltaX;
      imgY -= deltaY;
      image2.style.left = imgX + "px";
      image2.style.top = imgY + "px";
      this._savePosition();
      this.setMultiSourceVisibility(originalWidth, originalHeight, newWidth, newHeight);
    };
    setTimeout(() => {
      onWheel(new MouseEvent("wheel", { deltaY: 10 }), true);
    }, 1);
    this.element.addEventListener("wheel", onWheel);
    this.element.addEventListener("drop", async (e) => {
      try {
        const imageBoundingRect = this.image.getBoundingClientRect();
        const xPercent = (e.pageX - imageBoundingRect.left) / imageBoundingRect.width;
        const yPercent = (e.pageY - imageBoundingRect.top) / imageBoundingRect.height;
        const isAlt = e.altKey;
        const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
        let title = "New Marker";
        let icon = "fas fa-location-dot";
        let uuid = dragData.uuid;
        const image2 = dragData?.texture?.src;
        if (uuid) {
          const doc = await fromUuid(uuid);
          title = doc.name ?? doc.title ?? "New Marker";
          icon = doc.img ?? "fas fa-location-dot";
          if (dragData.anchor) {
            title.value = dragData.anchor.name;
            uuid += "#" + dragData.anchor.slug;
          }
        }
        if (image2) {
          icon = image2;
        }
        const markersData = this.page.getFlag(MODULE_ID, "markers") ?? {};
        const id = foundry.utils.randomID();
        markersData[id] = { title, icon, x: xPercent, y: yPercent, journal: uuid, hidden: isAlt, color: "#ff0000" };
        this.page.setFlag(MODULE_ID, "markers", markersData);
      } catch (e2) {
      }
    });
  }
  _savePosition() {
    const left = this.image.style.left;
    const top = this.image.style.top;
    const width = this.image.style.width;
    const height = this.image.style.height;
    if (!left || !top || !width || !height) return;
    this.page._mapPositions = { left, top, width, height };
  }
  _loadPosition() {
    const position = this.page._mapPositions;
    if (!position) return;
    if (!position.left || !position.top || !position.width || !position.height) return;
    this.image.style.left = position.left;
    this.image.style.top = position.top;
    this.image.style.width = position.width;
    this.image.style.height = position.height;
    return { imgX: parseFloat(position.left), imgY: parseFloat(position.top), width: parseFloat(position.width), height: parseFloat(position.height) };
  }
  _addMarker(event) {
    if (!this.page.isOwner || this._lockPins || this._rulerAnchor._enabled) return;
    const isLeftClick = event.button === 0;
    if (!isLeftClick) return;
    const isShiftDown = event.shiftKey;
    if (isShiftDown || this._movingMarker) return;
    const imageBoundingRect = this.image.getBoundingClientRect();
    const x = event.pageX - imageBoundingRect.left;
    const y = event.pageY - imageBoundingRect.top;
    const xPercent = x / imageBoundingRect.width;
    const yPercent = y / imageBoundingRect.height;
    this.mousePercent = { x: xPercent, y: yPercent };
    new MarkerConfig(this, this.page).render(true);
  }
  initMarkers() {
    this.image.querySelectorAll(".foundry-quest-log-ru-marker").forEach((marker) => {
      marker.remove();
    });
    const page2 = this.page;
    const markersFlag = page2.getFlag(MODULE_ID, "markers") ?? {};
    const markers = markersFlag;
    const globalLabelColor = getSetting("labelColor") !== "none" ? getSetting("labelColor") : null;
    if (!markers) return;
    for (const [id, markerData] of Object.entries(markers)) {
      if (markerData == null) continue;
      if (!page2.isOwner && markerData.hidden) continue;
      const marker = document.createElement("div");
      marker.classList.add("foundry-quest-log-ru-marker");
      if (markerData.hidden) marker.style.border = "3px dashed";
      marker.style.position = "absolute";
      marker.style.left = markerData.x * 100 + "%";
      marker.style.top = markerData.y * 100 + "%";
      marker.style.color = markerData.color;
      marker.style.transform = markerData.fixedScale ? `translate(-50%, -50%) scale(calc(${markerData.scale ?? 1} * var(--zoom-level)))` : `translate(-50%, -50%) scale(${markerData.scale ?? 1})`;
      marker.style.display = "flex";
      marker.style.alignItems = "center";
      marker.style.justifyContent = "center";
      markerData.icon ??= "fas fa-location-dot";
      const ext = markerData.icon.split(".").pop().toLowerCase();
      const isVideo = ["mp4", "webm"].includes(ext);
      const isImage = !isVideo && markerData.icon.includes(".");
      const isFaIcon = markerData.icon.includes("fa-") && !isImage;
      const isText = !isImage && !isFaIcon && !isVideo;
      if (isVideo) marker.innerHTML = `<video class="marker-image" src="${markerData.icon}" autoplay loop muted></video>`;
      if (isText) marker.innerHTML = `<i class="emoji">${markerData.icon}</i>`;
      if (isImage) marker.innerHTML = `<i class="marker-image" style="background-image: url('${markerData.icon}')"></i>`;
      if (isFaIcon) marker.innerHTML = `<i class="${markerData.icon}"></i>`;
      marker.dataset.tooltipDirection = "UP";
      marker.dataset.tooltipClass = "foundry-quest-log-ru-marker-tooltip";
      if (markerData.displayLabel) {
        marker.dataset.tooltip = "";
      } else {
        marker.dataset.tooltip = `
                <h4 style="margin: 0">${markerData.title}</h4>
                `;
      }
      if (markerData.description) {
        marker.dataset.tooltip += `
                <p>${markerData.description}</p>
                `;
      }
      marker.style.cursor = markerData.journal ? "pointer" : "default";
      const markerLabel = document.createElement("span");
      markerLabel.innerText = markerData.title;
      markerLabel.style.position = "absolute";
      markerLabel.style.width = "max-content";
      markerLabel.style.bottom = "100%";
      markerLabel.style.fontSize = "calc(var(--foundry-quest-log-ru-font-size)*0.75)";
      markerLabel.style.pointerEvents = "none";
      if (globalLabelColor) markerLabel.style.color = globalLabelColor;
      if (markerData.displayLabel) marker.appendChild(markerLabel);
      if (page2.isOwner && !this._lockPins) {
        let moveTime = 0;
        marker.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          if (e.shiftKey) return;
          const isRightClick = e.button === 2;
          if (!isRightClick) return;
          this._movingMarker = marker;
          moveTime = Date.now();
        });
        marker.addEventListener("mouseup", (e) => {
          e.stopPropagation();
          if (e.shiftKey) return;
          const isRightClick = e.button === 2;
          if (e.altKey) {
            const markersData = page2.getFlag(MODULE_ID, "markers") ?? {};
            markersData[id].hidden = !markersData[id].hidden;
            page2.setFlag(MODULE_ID, "markers", markersData);
            return;
          }
          if (!isRightClick) return;
          this._movingMarker = null;
          const xPercent = parseFloat(marker.dataset.leftPercent);
          const yPercent = parseFloat(marker.dataset.topPercent);
          const diffX = Math.abs(xPercent - markerData.x);
          const diffY = Math.abs(yPercent - markerData.y);
          const deltaTime = Date.now() - moveTime;
          if (deltaTime < 500 && diffX < 5e-4 && diffY < 5e-4 || xPercent <= 0 || yPercent <= 0 || isNaN(xPercent) || isNaN(yPercent)) {
            marker.style.left = markerData.x * 100 + "%";
            marker.style.top = markerData.y * 100 + "%";
            return new MarkerConfig(this, this.page, id).render(true);
          }
          const markers2 = page2.getFlag(MODULE_ID, "markers") ?? {};
          markers2[id].x = xPercent;
          markers2[id].y = yPercent;
          page2.setFlag(MODULE_ID, "markers", markers2);
        });
      }
      if (markerData.journal) {
        marker.addEventListener("click", async (e) => {
          if (e.altKey) return;
          e.preventDefault();
          e.stopPropagation();
          let uuid = markerData.journal;
          const anchor = markerData.journal.split("#")[1];
          if (anchor) uuid = markerData.journal.split("#")[0];
          const journal = await fromUuid(uuid);
          const isScene = journal instanceof Scene;
          const isMacro = journal instanceof Macro;
          if (isScene) {
            ui.simpleQuest.toggle();
            return journal.view();
          }
          if (isMacro) {
            const macroArgs = { ...markerData, id, map: this.page };
            return journal.execute(macroArgs);
          }
          const questJournals = ui.simpleQuest._questJournals;
          const mapsJournal = this.page.parent;
          let isQuest = false;
          const isMap = Array.from(mapsJournal.pages).some((page3) => page3.uuid == journal.uuid);
          for (const qJournal of questJournals) {
            qJournal.pages.forEach((page3) => {
              if (page3.uuid == journal.uuid) isQuest = true;
            });
          }
          if (isQuest || isMap) {
            ui.simpleQuest.openToPage(journal.uuid);
          } else {
            const isJournalPage = journal instanceof JournalEntryPage;
            const hasPermission = journal.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER);
            if (!hasPermission) return ui.notifications.error(game.i18n.localize(`${MODULE_ID}.noPermission`));
            if (isJournalPage && getSetting("openJournalPinsAsModals")) this.openModalJournal(journal, markerData.journal);
            else journal.sheet.render(true);
          }
        });
      }
      this.image.appendChild(marker);
    }
  }
  async openModalJournal(journal, uuid) {
    const anchor = uuid.split("#")[1];
    const hasPermission = journal.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER);
    if (!hasPermission) return ui.notifications.error(game.i18n.localize(`${MODULE_ID}.noPermission`));
    let content = "";
    if (journal.type === "text") {
      content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(journal.text.content, { secrets: game.user.isGM, relativeTo: journal, async: true });
    } else if (journal.type === "image") {
      content = `<div class="foundry-quest-log-ru-image-journal" style="max-height: 50vh;"><img src="${journal.src}" alt="${journal.name}"><p>${journal.image.caption}</p></div>`;
    } else {
      content = `<p>This Page Type is not Supported in Simple Quest</p>`;
    }
    const modal = document.createElement("div");
    modal.classList.add("foundry-quest-log-ru-modal");
    modal.style.opacity = 0;
    const title = `<h1>${journal.name}</h1>`;
    modal.innerHTML = `<div class="foundry-quest-log-ru-modal-content">${title + content}</div>`;
    modal.addEventListener("mousedown", (e) => {
      modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in-out" }).onfinish = () => {
        modal.remove();
      };
    });
    modal.addEventListener("wheel", (e) => {
      e.stopPropagation();
    });
    modal.addEventListener("mousemove", (e) => {
      e.stopPropagation();
    });
    this.element.appendChild(modal);
    const height = this.element.getBoundingClientRect().height;
    const modalContentHeight = modal.querySelector(".foundry-quest-log-ru-modal-content").getBoundingClientRect().height;
    if (modalContentHeight < height) {
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.flexDirection = "column";
    }
    modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-in-out", fill: "forwards" });
    if (anchor) {
      const toc = journal.toc[anchor];
      const tocText = toc.text.trim();
      const headers = modal.querySelectorAll("h1, h2, h3");
      let header;
      const sameNameHeaderIndex = anchor.includes("$") ? parseInt(anchor.split("$")[1]) : 0;
      const matchingHeaders = Array.from(headers).filter((h) => h.innerText.trim() === tocText);
      header = matchingHeaders[sameNameHeaderIndex];
      if (header) {
        header.scrollIntoView({ block: "start" });
      }
    }
  }
  loadMultiSource() {
    if (!this.isMultiSource) return false;
    let squareRoot = Math.sqrt(this.multiSource.length);
    const isInteger = squareRoot % 1 === 0;
    const isMinusOneInteger = Math.sqrt(this.multiSource.length - 1) % 1 === 0 && !isInteger;
    if (!isInteger && !isMinusOneInteger) return false;
    this.multiImageElements = [];
    if (isMinusOneInteger) {
      squareRoot = Math.sqrt(this.multiSource.length - 1);
      this.multiSourceHasLowRes = true;
    }
    this.multiSourceSQRT = squareRoot;
    const gridSize = { x: squareRoot, y: squareRoot };
    this.image.style.display = "grid";
    this.image.style.gridTemplateColumns = `repeat(${gridSize.x}, 1fr)`;
    this.image.style.gridTemplateRows = `repeat(${gridSize.y}, 1fr)`;
    for (const src of this.multiSource) {
      if (isMinusOneInteger && this.multiSource.indexOf(src) == 0) continue;
      const image = document.createElement("div");
      if (isMinusOneInteger) image.style.display = "none";
      image.style.backgroundImage = `url('${src}')`;
      image.style.backgroundSize = "cover";
      image.style.backgroundPosition = "center";
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.pointerEvents = "none";
      this.multiImageElements.push(image);
      this.image.appendChild(image);
    }
  }
  setMultiSourceVisibility(originalWidth, originalHeight, newWidth, newHeight) {
    if (!this.multiImageElements || !this.multiSourceHasLowRes) return;
    const zoomFactor = newWidth / originalWidth;
    const visible = zoomFactor > this.multiSourceSQRT;
    this.multiImageElements.forEach((image) => {
      image.style.display = visible ? "block" : "none";
    });
  }
};
var MarkerConfig = class extends FormApplication {
  constructor(mapImage, page2, edit = null) {
    super();
    this.mapImage = mapImage;
    this.page = page2;
    this.edit = edit;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "foundry-quest-log-ru-marker-config",
      template: "modules/foundry-quest-log-ru/templates/marker-config.hbs",
      title: game.i18n.localize(`${MODULE_ID}.markerConfig.title`),
      classes: [],
      width: 400,
      height: "auto",
      resizable: false,
      closeOnSubmit: true
    });
  }
  get defaultMarkerData() {
    return {
      title: "New Marker",
      icon: "fas fa-location-dot",
      color: "#ff0000",
      scale: 1
    };
  }
  get markerIcons() {
    return [
      "modules/foundry-quest-log-ru/assets/icons/altar1.webp",
      "modules/foundry-quest-log-ru/assets/icons/beer1.webp",
      "modules/foundry-quest-log-ru/assets/icons/beer2.webp",
      "modules/foundry-quest-log-ru/assets/icons/beer3.webp",
      "modules/foundry-quest-log-ru/assets/icons/book1.webp",
      "modules/foundry-quest-log-ru/assets/icons/book2.webp",
      "modules/foundry-quest-log-ru/assets/icons/book3.webp",
      "modules/foundry-quest-log-ru/assets/icons/book4.webp",
      "modules/foundry-quest-log-ru/assets/icons/book5.webp",
      "modules/foundry-quest-log-ru/assets/icons/boss1.webp",
      "modules/foundry-quest-log-ru/assets/icons/boss2.webp",
      "modules/foundry-quest-log-ru/assets/icons/boss3.webp",
      "modules/foundry-quest-log-ru/assets/icons/boss4.webp",
      "modules/foundry-quest-log-ru/assets/icons/coin1.webp",
      "modules/foundry-quest-log-ru/assets/icons/coin2.webp",
      "modules/foundry-quest-log-ru/assets/icons/coin3.webp",
      "modules/foundry-quest-log-ru/assets/icons/coin4.webp",
      "modules/foundry-quest-log-ru/assets/icons/combat1.webp",
      "modules/foundry-quest-log-ru/assets/icons/combat2.webp",
      "modules/foundry-quest-log-ru/assets/icons/combat3.webp",
      "modules/foundry-quest-log-ru/assets/icons/doorway1.webp",
      "modules/foundry-quest-log-ru/assets/icons/doorway2.webp",
      "modules/foundry-quest-log-ru/assets/icons/doorway3.webp",
      "modules/foundry-quest-log-ru/assets/icons/doorway4.webp",
      "modules/foundry-quest-log-ru/assets/icons/doorway5.webp",
      "modules/foundry-quest-log-ru/assets/icons/exclamation1.webp",
      "modules/foundry-quest-log-ru/assets/icons/exclamation2.webp",
      "modules/foundry-quest-log-ru/assets/icons/exclamation3.webp",
      "modules/foundry-quest-log-ru/assets/icons/exclamation4.webp",
      "modules/foundry-quest-log-ru/assets/icons/food1.webp",
      "modules/foundry-quest-log-ru/assets/icons/food2.webp",
      "modules/foundry-quest-log-ru/assets/icons/food3.webp",
      "modules/foundry-quest-log-ru/assets/icons/key1.webp",
      "modules/foundry-quest-log-ru/assets/icons/key2.webp",
      "modules/foundry-quest-log-ru/assets/icons/location1.webp",
      "modules/foundry-quest-log-ru/assets/icons/location10.webp",
      "modules/foundry-quest-log-ru/assets/icons/location2.webp",
      "modules/foundry-quest-log-ru/assets/icons/location3.webp",
      "modules/foundry-quest-log-ru/assets/icons/location4.webp",
      "modules/foundry-quest-log-ru/assets/icons/location5.webp",
      "modules/foundry-quest-log-ru/assets/icons/location6.webp",
      "modules/foundry-quest-log-ru/assets/icons/location7.webp",
      "modules/foundry-quest-log-ru/assets/icons/location8.webp",
      "modules/foundry-quest-log-ru/assets/icons/location9.webp",
      "modules/foundry-quest-log-ru/assets/icons/map1.webp",
      "modules/foundry-quest-log-ru/assets/icons/map2.webp",
      "modules/foundry-quest-log-ru/assets/icons/map3.webp",
      "modules/foundry-quest-log-ru/assets/icons/monster1.webp",
      "modules/foundry-quest-log-ru/assets/icons/monster2.webp",
      "modules/foundry-quest-log-ru/assets/icons/monster3.webp",
      "modules/foundry-quest-log-ru/assets/icons/monster4.webp",
      "modules/foundry-quest-log-ru/assets/icons/note1.webp",
      "modules/foundry-quest-log-ru/assets/icons/note2.webp",
      "modules/foundry-quest-log-ru/assets/icons/note3.webp",
      "modules/foundry-quest-log-ru/assets/icons/note4.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore1.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore2.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore3.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore4.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore5.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore6.webp",
      "modules/foundry-quest-log-ru/assets/icons/ore7.webp",
      "modules/foundry-quest-log-ru/assets/icons/painting1.webp",
      "modules/foundry-quest-log-ru/assets/icons/painting2.webp",
      "modules/foundry-quest-log-ru/assets/icons/painting3.webp",
      "modules/foundry-quest-log-ru/assets/icons/pendant1.webp",
      "modules/foundry-quest-log-ru/assets/icons/pendant2.webp",
      "modules/foundry-quest-log-ru/assets/icons/pendant3.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant1.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant2.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant3.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant4.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant5.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant6.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant7.webp",
      "modules/foundry-quest-log-ru/assets/icons/plant8.webp",
      "modules/foundry-quest-log-ru/assets/icons/portal1.webp",
      "modules/foundry-quest-log-ru/assets/icons/portal2.webp",
      "modules/foundry-quest-log-ru/assets/icons/portal3.webp",
      "modules/foundry-quest-log-ru/assets/icons/portal4.webp",
      "modules/foundry-quest-log-ru/assets/icons/pouch1.webp",
      "modules/foundry-quest-log-ru/assets/icons/pouch2.webp",
      "modules/foundry-quest-log-ru/assets/icons/pouch3.webp",
      "modules/foundry-quest-log-ru/assets/icons/pouch4.webp",
      "modules/foundry-quest-log-ru/assets/icons/question1.webp",
      "modules/foundry-quest-log-ru/assets/icons/question2.webp",
      "modules/foundry-quest-log-ru/assets/icons/question3.webp",
      "modules/foundry-quest-log-ru/assets/icons/question4.webp",
      "modules/foundry-quest-log-ru/assets/icons/scroll1.webp",
      "modules/foundry-quest-log-ru/assets/icons/scroll2.webp",
      "modules/foundry-quest-log-ru/assets/icons/scroll3.webp",
      "modules/foundry-quest-log-ru/assets/icons/shield1.webp",
      "modules/foundry-quest-log-ru/assets/icons/shield2.webp",
      "modules/foundry-quest-log-ru/assets/icons/shield3.webp",
      "modules/foundry-quest-log-ru/assets/icons/shield4.webp",
      "modules/foundry-quest-log-ru/assets/icons/skull1.webp",
      "modules/foundry-quest-log-ru/assets/icons/skull2.webp",
      "modules/foundry-quest-log-ru/assets/icons/skull3.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell1.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell2.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell3.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell4.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell5.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell6.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell7.webp",
      "modules/foundry-quest-log-ru/assets/icons/spell8.webp",
      "modules/foundry-quest-log-ru/assets/icons/tree1.webp",
      "modules/foundry-quest-log-ru/assets/icons/tree2.webp",
      "modules/foundry-quest-log-ru/assets/icons/tree3.webp",
      "modules/foundry-quest-log-ru/assets/icons/tree4.webp",
      "fas fa-location-dot",
      "fa-solid fa-exclamation",
      "fa-solid fa-question",
      "fas fa-dragon",
      "fas fa-sword",
      "fas fa-shield-alt",
      "fas fa-helmet-battle",
      "fas fa-axe",
      "fas fa-scroll",
      "fas fa-scroll-old",
      "fas fa-treasure-chest",
      "fas fa-magic",
      "fas fa-crystal-ball",
      "fas fa-book-dead",
      "fas fa-bone",
      "fas fa-flask-round-potion",
      "fas fa-flask-round-poison",
      "fas fa-ring",
      "fas fa-crown",
      "fas fa-dice",
      "fas fa-hourglass-end",
      "fas fa-bow-arrow",
      "fas fa-meteor",
      "fas fa-moon",
      "fas fa-sun",
      "fas fa-cloud-moon",
      "fas fa-cloud-sun",
      "fas fa-coin",
      "fas fa-skull-crossbones",
      "fas fa-dungeon",
      "fas fa-mountain",
      "fas fa-tree",
      "fas fa-campfire",
      "fas fa-compass",
      "fa-solid fa-bullseye",
      "fas fa-feather-alt",
      "fas fa-bug",
      "fas fa-paw",
      "fas fa-fish",
      "fas fa-bird",
      "fas fa-horse",
      "fas fa-spider",
      "fas fa-ghost",
      "fas fa-bat",
      "fas fa-wand-magic",
      "fas fa-hat-wizard",
      "fas fa-staff",
      "fas fa-flag-checkered",
      "fas fa-map",
      "fas fa-anchor",
      "fas fa-ship",
      "fas fa-skull",
      "fas fa-cross",
      "fas fa-ban",
      "fas fa-gem",
      "fas fa-leaf",
      "fas fa-flower",
      "fas fa-mushroom",
      "fas fa-paw-claws",
      "fas fa-star",
      "fas fa-fire",
      "fa-solid fa-fire-flame-curved",
      "fas fa-water",
      "fas fa-wind",
      "fas fa-earth",
      "fas fa-heart",
      "fas fa-mind-share",
      "fas fa-sword-laser",
      "fas fa-moon-stars",
      "fas fa-cloud",
      "fas fa-rainbow",
      "fas fa-axe-battle",
      "fas fa-brain",
      "fas fa-crow",
      "fas fa-dagger",
      "fas fa-frog",
      "fas fa-globe",
      "fas fa-hammer",
      "fas fa-hat-witch",
      "fas fa-pumpkin",
      "fas fa-candle-holder",
      "fas fa-broom",
      "fas fa-dice-d20",
      "fas fa-tornado",
      "fas fa-cloud-showers-heavy"
    ];
  }
  activateListeners(html) {
    super.activateListeners(html);
    html[0].querySelector("#delete-marker").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.page.update({ [`flags.${MODULE_ID}.markers.-=${this.edit}`]: null });
      this.close();
    });
    html[0].querySelectorAll(".quest-icons i").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const iconInput = html[0].querySelector("#icon");
        iconInput.value = icon.classList.value;
      });
    });
    html[0].querySelector("#journal").addEventListener("drop", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const uuid = dragData.uuid;
        const journal = await fromUuid(uuid);
        const title = journal.name ?? journal.title;
        const titleInput = html[0].querySelector("#title");
        if (!titleInput.value || titleInput.value == "New Marker") titleInput.value = title;
        html[0].querySelector("#journal").value = uuid;
        if (dragData.anchor) {
          titleInput.value = dragData.anchor.name;
          html[0].querySelector("#journal").value += "#" + dragData.anchor.slug;
        }
      } catch (e2) {
      }
    });
  }
  getData() {
    const markersFlag = this.page.getFlag(MODULE_ID, "markers") ?? {};
    const markers = markersFlag ?? {};
    const markerData = markers[this.edit] ?? {};
    return {
      ...foundry.utils.mergeObject(this.defaultMarkerData, markerData),
      id: this.edit,
      icons: this.markerIcons.map((icon) => {
        return {
          icon,
          isImage: icon.includes(".")
        };
      })
    };
  }
  async _updateObject(event, formData) {
    event.preventDefault();
    formData = expandObject(formData);
    if (!this.edit) {
      formData.x = this.mapImage.mousePercent.x;
      formData.y = this.mapImage.mousePercent.y;
    }
    const markers = this.page.getFlag(MODULE_ID, "markers") ?? {};
    markers[this.edit ?? foundry.utils.randomID(20)] = formData;
    await this.page.setFlag(MODULE_ID, "markers", markers);
  }
};

// scripts/lib/Sortable.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var version = "1.15.0";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches(el, selector2) {
  if (!selector2) return;
  selector2[0] === ">" && (selector2 = selector2.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector2);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector2);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector2);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(el, selector2, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector2 != null && (selector2[0] === ">" ? el.parentNode === ctx && matches(el, selector2) : matches(el, selector2)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx) break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, "transform");
      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top -= containerRect.top + parseInt(css(container, "border-top-width"));
          left -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }
    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector2) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector2 && !matches(last, selector2))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector2) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector2 || matches(el, selector2))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function") callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function") callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function") callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults2, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2)) continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function") return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName]) return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable) return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl;
var parentEl;
var ghostEl;
var rootEl;
var nextEl;
var lastDownEl;
var cloneEl;
var cloneHidden;
var oldIndex;
var newIndex;
var oldDraggableIndex;
var newDraggableIndex;
var activeGroup;
var putSortable;
var awaitingDragStarted = false;
var ignoreNextClick = false;
var sortables = [];
var tapEvt;
var touchEvt;
var lastDx;
var lastDy;
var tapDistanceLeft;
var tapDistanceTop;
var moved;
var lastTarget;
var lastDirection;
var pastFirstInvertThresh = false;
var isCircumstantialInvert = false;
var targetMoveDistance;
var ghostRelativeParent;
var ghostRelativeParentInitialScroll = [];
var _silent = false;
var savedInputChecked = [];
var documentExists = typeof document !== "undefined";
var PositionGhostAbsolutely = IOS;
var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
var supportCssPointerEvents = (function() {
  if (!documentExists) return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
})();
var _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
};
var _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
};
var _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
};
var _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
};
var _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
};
var _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists && !ChromeForAndroid) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults2 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults2);
  for (var name in defaults2) {
    !(name in options) && (options[name] = defaults2[name]);
  }
  _prepareGroup(options);
  for (var fn in this) {
    if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
      this[fn] = this[fn].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable) return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = parent.parentNode);
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled) return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent) return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled) return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled) return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function(el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector2) {
    return closest(el, selector2 || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled) return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector2) {
    return !!closest(el, selector2, el, false);
  },
  extend,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array) plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [];
var scrollEl;
var scrollRootEl;
var scrolling = false;
var lastAutoScrollX;
var lastAutoScrollY;
var touchEvt$1;
var pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval(function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

// scripts/lib/socket.js
var Socket = class {
  static __$callbacks = {};
  static __$stores = {};
  static __$promises = {};
  static USERS = {
    GMS: "gms",
    PLAYERS: "players",
    ALL: "all",
    OTHERS: "others",
    FIRSTGM: "firstGM",
    SELF: "self"
  };
  static __$reserved = ["__$eventName", "__$response", "__$onMessage", "__$parseUsers", "register", "USERS"];
  static async __$onMessage(data) {
    const options = data.__$socketOptions;
    if (options.__$storeName) {
      if (options.__$request) {
        const store = this.__$stores[options.__$storeName];
        const _isLive = store._isLive;
        if (!_isLive) return;
        game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: options.__$storeName, user: game.user.id }, data: store.getData() });
      } else {
        this.__$stores[options.__$storeName].synchronize(data.data, game.users.get(options.user));
      }
      return;
    }
    if (options.__$eventName === "__$response") {
      const key = options.__$responseKey;
      if (this.__$promises[key]) {
        this.__$promises[key].resolve({ user: game.users.get(options.__$userId), response: data.result });
        delete this.__$promises[key];
      }
      return;
    }
    if (!options.users.includes(game.user.id)) return;
    const callback = this.__$callbacks[options.__$eventName];
    delete data.__$socketOptions;
    const result = await callback(data);
    if (options.response) {
      const key = `${options.__$eventId}.${game.user.id}`;
      const data2 = { __$socketOptions: { __$eventName: "__$response", __$responseKey: key, __$userId: game.user.id }, result };
      this.__$socket.emit(`module.${MODULE_ID}`, data2);
    }
  }
  static __$parseUsers(options) {
    if (Array.isArray(options?.users)) return options;
    if (typeof options === "string") options = { users: options };
    if (Array.isArray(options)) options = { users: options };
    options.users = options.users || this.USERS.ALL;
    const active = game.users.filter((u) => u.active);
    const users = options.users;
    if (users === this.USERS.ALL) {
      options.users = active.map((u) => u.id);
    } else if (users === this.USERS.GMS) {
      options.users = active.filter((u) => u.isGM).map((u) => u.id);
    } else if (users === this.USERS.PLAYERS) {
      options.users = active.filter((u) => !u.isGM).map((u) => u.id);
    } else if (users === this.USERS.OTHERS) {
      options.users = active.filter((u) => u.id !== game.user.id).map((u) => u.id);
    } else if (users === this.USERS.FIRSTGM) {
      options.users = game.users.activeGM.id;
    } else if (users === this.USERS.SELF) {
      options.users = [game.user.id];
    }
    return options;
  }
  static register(eventName, callback, defaultOptions = {}) {
    if (!this.__$socket) {
      this.__$socket = game.socket;
      game.socket.on(`module.${MODULE_ID}`, this.__$onMessage.bind(this));
    }
    if (this.__$reserved.includes(eventName)) {
      throw new Error(`Socket event name ${eventName} is reserved`);
    }
    this.__$callbacks[eventName] = callback;
    const wrappedCallback = async (data, options = {}) => {
      options = this.__$parseUsers(options);
      options = { ...defaultOptions, ...options };
      const eventId = foundry.utils.randomID();
      options.__$eventId = eventId;
      options.__$eventName = eventName;
      const promises = [];
      const local = options.users.includes(game.user.id);
      options.users = options.users.filter((u) => u !== game.user.id);
      if (options.response) {
        for (const user of options.users) {
          promises.push(
            new Promise((resolve, reject) => {
              const key = `${eventId}.${user}`;
              this.__$promises[key] = { resolve, reject };
            })
          );
        }
        setTimeout(() => {
          for (const user of options.users) {
            const key = `${eventId}.${user}`;
            if (this.__$promises[key]) {
              this.__$promises[key].reject({ user: game.users.get(user), response: "timeout" });
              delete this.__$promises[key];
            }
          }
        }, options.timeout || 3e4);
      }
      data.__$socketOptions = options;
      this.__$socket.emit(`module.${MODULE_ID}`, data);
      const results = [];
      if (local) {
        const localWrapper = async () => {
          return { user: game.user, response: await callback(data) };
        };
        promises.push(localWrapper());
      }
      const allPromises = await Promise.all(promises);
      for (const promise of allPromises) {
        results.push(promise);
      }
      return results;
    };
    this[eventName] = wrappedCallback.bind(this);
  }
  static registerStore(storeName, initialValue = {}, callback = null) {
    if (this.__$reserved.includes(storeName)) {
      throw new Error(`Store name ${storeName} is reserved`);
    }
    if (typeof initialValue !== "object") {
      throw new Error("Initial value for store must be an object");
    }
    this.__$stores[storeName] = new SynchronizedStore(storeName, initialValue, callback);
    Object.defineProperty(this, storeName, {
      get: () => {
        return this.__$stores[storeName].getData();
      },
      set: (value) => {
        this.__$stores[storeName].setData(value);
      }
    });
    return this.__$stores[storeName];
  }
};
var SynchronizedStore = class {
  constructor(storeName, initialValue, callback) {
    this._storeName = storeName;
    this._onChange = callback;
    this._data = initialValue;
    this._timestamp = Date.now();
    this._isLive = false;
    game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: this._storeName, __$request: true, user: game.user.id } });
  }
  synchronize(data) {
    this._data = data;
    this._timestamp = Date.now();
    this._isLive = true;
    this._onChange?.(this.data);
  }
  getData() {
    return this._data;
  }
  setData(value) {
    this.synchronize(value);
    game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: this._storeName, user: game.user.id }, data: value });
  }
};

// scripts/app/timeline.js
var YEAR_SEPARATOR = `<i class="fa-thin fa-arrow-right"></i>`;
var Timeline = class extends Application {
  constructor(container) {
    super();
    this.container = container;
    const journalName = getSetting("timelineJournalName");
    this.journal = Array.from(game.journal).find((j) => j.name === journalName);
    this.scrollPosition = getSetting("timelineScroll") ?? 0;
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: false,
      minimizable: false,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`),
      closeOnSubmit: false
    });
  }
  async getData() {
    YEAR_SEPARATOR = game.i18n.localize(`${MODULE_ID}.timeline-config.to`);
    const YEAR_PIXEL_SCALE = Math.max(this.journal.getFlag(MODULE_ID, "timeScale") ?? 10, 0.1);
    const USE_DYNAMIC = this.journal.getFlag(MODULE_ID, "dynamicTimeScale") ?? false;
    const ERA_SCALES = {};
    const pages = Array.from(this.journal.pages);
    const negativeAbb = this.journal.getFlag(MODULE_ID, "negativeAbb") ?? "BC";
    const positiveAbb = this.journal.getFlag(MODULE_ID, "positiveAbb") ?? "AC";
    const showMinus = this.journal.getFlag(MODULE_ID, "showMinus") ?? false;
    const erasData = [];
    const eventsData = {
      left: [],
      right: []
    };
    const scrollbarDots = [];
    const eras = pages.filter((p) => p.flags[MODULE_ID]?.timeline?.isEra).sort((a, b) => a.getFlag(MODULE_ID, "timeline").eraStart - b.getFlag(MODULE_ID, "timeline").eraStart);
    const events = pages.filter((p) => !p.flags[MODULE_ID]?.timeline?.isEra && (p.flags[MODULE_ID]?.hidden !== true || game.user.isGM)).sort((a, b) => a.flags[MODULE_ID]?.timeline?.year - b.flags[MODULE_ID]?.timeline?.year);
    let erasCssGradient = "";
    eras.forEach((era) => {
      const eraEventsCount = events.filter((e) => e.flags[MODULE_ID]?.timeline?.year >= era.flags[MODULE_ID]?.timeline?.eraStart && e.flags[MODULE_ID]?.timeline?.year <= era.flags[MODULE_ID]?.timeline?.eraEnd).length;
      const eraLength = era.flags[MODULE_ID]?.timeline?.eraEnd - era.flags[MODULE_ID]?.timeline?.eraStart;
      if (USE_DYNAMIC) {
        ERA_SCALES[era.uuid] = (eraEventsCount + 1) * 300 * YEAR_PIXEL_SCALE;
      } else {
        ERA_SCALES[era.uuid] = eraLength * YEAR_PIXEL_SCALE;
      }
    });
    const totalHeight = Object.values(ERA_SCALES).reduce((a, b) => a + b, 0);
    for (let i = 0; i < eras.length; i++) {
      const era = eras[i];
      const nextEra = eras[i + 1];
      const eraStart = era.flags[MODULE_ID]?.timeline?.eraStart;
      const eraEnd = era.flags[MODULE_ID]?.timeline?.eraEnd || nextEra?.flags[MODULE_ID]?.timeline?.eraStart;
      const color = era.flags[MODULE_ID]?.timeline?.color;
      const prevEndPx = erasData[i - 1]?.endPx;
      const startPx = prevEndPx ?? 0;
      const endPx = ERA_SCALES[era.uuid] + startPx;
      const startPercent = startPx / totalHeight;
      const endPercent = endPx / totalHeight * 100;
      erasCssGradient += `${color} ${startPercent}%, ${color} ${endPercent}%, `;
      let startText = eraStart > 0 ? `${eraStart} ${positiveAbb}` : `${Math.abs(eraStart)} ${negativeAbb}`;
      let endText = eraEnd > 0 ? `${eraEnd} ${positiveAbb}` : `${Math.abs(eraEnd)} ${negativeAbb}`;
      if (eraStart < 0 && (!negativeAbb || showMinus)) startText = "-" + startText;
      if (eraEnd < 0 && (!negativeAbb || showMinus)) endText = "-" + endText;
      erasData.push({
        start: startText,
        end: endText,
        name: era.name,
        top: startPx,
        endPx,
        content: await foundry.applications.ux.TextEditor.implementation.enrichHTML(era.text.content, { secrets: game.user.isGM, relativeTo: era, async: true }),
        banner: era.flags[MODULE_ID]?.timeline?.banner,
        color: era.flags[MODULE_ID]?.timeline?.color,
        uuid: era.uuid,
        label: era.flags[MODULE_ID]?.timeline?.label
      });
    }
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const year = event.flags[MODULE_ID]?.timeline?.year;
      const era = eras.find((e) => e.flags[MODULE_ID]?.timeline?.eraStart <= year && e.flags[MODULE_ID]?.timeline?.eraEnd >= year);
      if (!era) continue;
      const color = era.flags[MODULE_ID]?.timeline?.color;
      const percentYearInEra = (year - era.flags[MODULE_ID]?.timeline?.eraStart) / (era.flags[MODULE_ID]?.timeline?.eraEnd - era.flags[MODULE_ID]?.timeline?.eraStart);
      const duration = event.flags[MODULE_ID]?.timeline?.duration ?? 0;
      const percentYearInEraEnd = (year + duration - era.flags[MODULE_ID]?.timeline?.eraStart) / (era.flags[MODULE_ID]?.timeline?.eraEnd - era.flags[MODULE_ID]?.timeline?.eraStart);
      const top = ERA_SCALES[era.uuid] * percentYearInEra + erasData.find((e) => e.uuid === era.uuid).top;
      const percent = top / totalHeight * 100;
      const durationTop = ERA_SCALES[era.uuid] * percentYearInEraEnd + erasData.find((e) => e.uuid === era.uuid).top;
      const durationDelta = Math.round(durationTop - top);
      const yearText = year > 0 ? `${year} ${positiveAbb}` : `${showMinus ? "-" : ""}${Math.abs(year)} ${negativeAbb}`;
      const yearEndText = year + duration > 0 ? `${year + duration} ${positiveAbb}` : `${showMinus ? "-" : ""}${Math.abs(year + duration)} ${negativeAbb}`;
      const content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(event.text.content, { secrets: game.user.isGM, relativeTo: era, async: true });
      const banner = event.flags[MODULE_ID]?.timeline?.banner;
      const uuid = event.uuid;
      const data = {
        name: event.name,
        content,
        banner,
        color,
        uuid,
        top: top + (event.flags[MODULE_ID]?.timeline?.offset ?? 0),
        year: yearText,
        yearEnd: duration ? yearEndText : null,
        era: era.name,
        eraUuid: era.uuid,
        hidden: event.flags[MODULE_ID]?.hidden,
        icon: event.flags[MODULE_ID]?.timeline?.icon,
        flipped: event.flags[MODULE_ID]?.timeline?.flipped,
        duration: durationDelta,
        label: event.flags[MODULE_ID]?.timeline?.label
      };
      if (i % 2 === 0) {
        eventsData.left.push(data);
      } else {
        eventsData.right.push(data);
      }
      scrollbarDots.push({
        top: percent,
        uuid: event.uuid
      });
    }
    erasCssGradient = erasCssGradient.slice(0, -2);
    const contentSetting = this.journal.getFlag(MODULE_ID, "content") ?? "always";
    const showContentToggle = contentSetting !== "always";
    const collapsed = contentSetting === "toggleOff";
    return { height: totalHeight, erasData, eventsData, erasCssGradient, scrollbarDots, isGM: game.user.isGM, showContentToggle, collapsed, YEAR_SEPARATOR };
  }
  activateListeners(html) {
    super.activateListeners(html);
    html = html[0] ?? html;
    this.container.appendChild(html);
    html.querySelector("main section").scrollTo({ top: this.scrollPosition });
    html.querySelectorAll(".event-era").forEach((era) => {
      const uuid = era.dataset.uuid;
      era.addEventListener("click", (e) => {
        e.preventDefault();
        this.goTo(uuid);
      });
    });
    html.querySelectorAll(".timeline-scrollbar-dot").forEach((event) => {
      const uuid = event.dataset.uuid;
      event.addEventListener("click", (e) => {
        e.preventDefault();
        this.goTo(uuid);
      });
    });
    html.querySelectorAll(".content-collapse").forEach((el) => {
      const content = el.closest(".timeline-era, .timeline-event").querySelector(".timeline-content");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        content.classList.toggle("collapsed");
      });
    });
    html.querySelectorAll(".timeline-event, .timeline-era").forEach((el) => {
      el.addEventListener("click", (e) => {
        const closestContainer = e.target.closest(".timeline-center, .timeline-right, .timeline-left");
        if (!closestContainer) return;
        closestContainer.querySelectorAll(".on-top").forEach((el2) => el2.classList.remove("on-top"));
        el.classList.add("on-top");
      });
    });
    if (!game.user.isGM) return;
    html.querySelector("#add-timeline").addEventListener("click", async (e) => {
      const page2 = await this.journal.createEmbeddedDocuments("JournalEntryPage", [{ name: "New Event", type: "text" }]);
      new TimelineConfig(page2[0]).render(true);
    });
    this.addConfigIcons(html);
  }
  addConfigIcons(html) {
    html.querySelectorAll(".timeline-era, .timeline-event").forEach((el) => {
      let target = el.querySelector("header");
      if (!target) return;
      const cogIcon = document.createElement("i");
      cogIcon.classList.add("fas", "fa-cog", "timeline-config-icon");
      cogIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const page2 = fromUuidSync(e.currentTarget.closest(".timeline-era, .timeline-event").dataset.uuid);
        new TimelineConfig(page2).render(true);
      });
      target.appendChild(cogIcon);
    });
  }
  goTo(pageUuid) {
    const target = this.element[0].querySelector(`.timeline-era[data-uuid="${pageUuid}"], .timeline-event[data-uuid="${pageUuid}"]`);
    this.element[0].querySelector("main section").scrollTo({ top: target.offsetTop - target.offsetHeight, behavior: "smooth" });
  }
  configTimeline(uuid) {
    const page2 = fromUuidSync(uuid);
    new TimelineConfig(page2).render(true);
  }
  saveScrollPosition() {
    const scroll = this.element[0].querySelector("main section").scrollTop;
    setSetting("timelineScroll", scroll);
  }
};
var TimelineConfig = class extends FormApplication {
  constructor(document2) {
    super();
    this.document = document2;
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: true,
      minimizable: true,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`),
      closeOnSubmit: false
    });
  }
  async getData() {
    const timelineFlag = this.document.getFlag(MODULE_ID, "timeline") ?? {};
    const hidden = this.document.getFlag(MODULE_ID, "hidden") ?? false;
    const timeScale = this.document.parent.getFlag(MODULE_ID, "timeScale") ?? 10;
    const negativeAbb = this.document.parent.getFlag(MODULE_ID, "negativeAbb") ?? "BC";
    const positiveAbb = this.document.parent.getFlag(MODULE_ID, "positiveAbb") ?? "AC";
    const dynamicTimeScale = this.document.parent.getFlag(MODULE_ID, "dynamicTimeScale") ?? false;
    const content = this.document.parent.getFlag(MODULE_ID, "content");
    const showMinus = this.document.parent.getFlag(MODULE_ID, "showMinus") ?? false;
    timelineFlag.color = timelineFlag.color || "#ff0000";
    const contentChoices = {
      always: `${MODULE_ID}.timeline-config.contentChoices.always`,
      toggleOff: `${MODULE_ID}.timeline-config.contentChoices.toggleOff`,
      toggleOn: `${MODULE_ID}.timeline-config.contentChoices.toggleOn`
    };
    return { ...timelineFlag, title: this.document.name, hidden, negativeAbb, positiveAbb, timeScale, dynamicTimeScale, content, contentChoices, showMinus };
  }
  activateListeners(html) {
    super.activateListeners(html);
    html = html[0] ?? html;
    html.querySelector("#edit-contents").addEventListener("click", (e) => {
      this.document.sheet.render(true);
    });
    html.querySelector("#delete").addEventListener("click", async (e) => {
      Dialog.confirm({
        title: game.i18n.localize(`${MODULE_ID}.deletePage.title`) + ` ${this.document.name}`,
        content: game.i18n.localize(`${MODULE_ID}.deletePage.content`),
        yes: async () => {
          await this.document.parent.deleteEmbeddedDocuments("JournalEntryPage", [this.document.id]);
          this.close();
        },
        no: () => {
        },
        defaultYes: false
      });
    });
    html.querySelectorAll(".era-event-switch span").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        html.querySelector(".era-event-switch .selected").classList.remove("selected");
        el.classList.add("selected");
        this.setTypeVisibility();
      });
    });
    this.setTypeVisibility();
  }
  setTypeVisibility() {
    const selectedType = this.element[0].querySelector(".era-event-switch .selected").dataset.type;
    const targetFieldset = this.element[0].querySelector(`fieldset.${selectedType === "era" ? "event" : "era"}-fieldset`);
    const otherFieldset = this.element[0].querySelector(`fieldset.${selectedType}-fieldset`);
    targetFieldset.style.filter = "grayscale(1)";
    targetFieldset.style.pointerEvents = "none";
    targetFieldset.style.opacity = "0.5";
    otherFieldset.style.filter = "none";
    otherFieldset.style.pointerEvents = "auto";
    otherFieldset.style.opacity = "1";
  }
  async _updateObject(event, formData) {
    formData = foundry.utils.expandObject(formData);
    formData.isEra = this.element[0].querySelector(".era-event-switch .selected").dataset.type === "era";
    if (!formData.ignoreDataValidation) {
      try {
        this.validateData(formData);
      } catch (error) {
        console.error(error);
        return;
      }
    }
    delete formData.ignoreDataValidation;
    const journalFlags = ["negativeAbb", "positiveAbb", "timeScale", "dynamicTimeScale", "content", "showMinus"];
    await this.document.parent.update({
      flags: {
        [MODULE_ID]: journalFlags.reduce((acc, flag) => {
          acc[flag] = formData[flag];
          return acc;
        }, {})
      }
    });
    journalFlags.forEach((flag) => delete formData[flag]);
    const hidden = formData.hidden;
    delete formData.hidden;
    await this.document.update({
      name: formData.title,
      flags: {
        [MODULE_ID]: {
          timeline: formData,
          hidden
        }
      }
    });
    const updates = [];
    const journal = this.document.parent;
    const pages = Array.from(journal.pages);
    for (const page2 of pages) {
      const flagData = page2.getFlag(MODULE_ID, "timeline") ?? {};
      const sort2 = flagData.isEra ? flagData.eraStart : flagData.year;
      updates.push({ _id: page2.id, sort: sort2 });
    }
    await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
    this.close();
  }
  validateData(expanded) {
    const eras = Array.from(this.document.parent.pages).filter((p) => p.getFlag(MODULE_ID, "timeline")?.isEra).filter((p) => p.id !== this.document.id);
    if (eras.length === 0 && !expanded.isEra) {
      const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.noEra`);
      ui.notifications.error(errorString);
      throw new Error(errorString);
    }
    const isFirstEra = eras.length === 0 && expanded.isEra;
    if (!expanded.isEra) {
      const year = expanded.year;
      if (year === void 0 || year === null || year === "") {
        const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.noYear`);
        ui.notifications.error(errorString);
        throw new Error(errorString);
      }
      const era = eras.find((e) => e.getFlag(MODULE_ID, "timeline").eraStart <= year && e.getFlag(MODULE_ID, "timeline").eraEnd >= year);
      if (!era) {
        const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.yearOutOfBounds`);
        ui.notifications.error(errorString);
        throw new Error(errorString);
      }
    }
    if (expanded.isEra) {
      const eraStart = expanded.eraStart;
      const eraEnd = expanded.eraEnd;
      if (eraStart === void 0 || eraStart === null || eraStart === "") {
        const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.noEraStart`);
        ui.notifications.error(errorString);
        throw new Error(errorString);
      }
      if (eraEnd === void 0 || eraEnd === null || eraEnd === "") {
        const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.noEraEnd`);
        ui.notifications.error(errorString);
        throw new Error(errorString);
      }
      if (eraStart >= eraEnd) {
        const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.eraStartAfterEnd`);
        ui.notifications.error(errorString);
        throw new Error(errorString);
      }
      if (!isFirstEra) {
        const previousEra = eras.find((e) => e.getFlag(MODULE_ID, "timeline").eraEnd === eraStart);
        const nextEra = eras.find((e) => e.getFlag(MODULE_ID, "timeline").eraStart === eraEnd);
        if (!previousEra && !nextEra) {
          const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.eraNotConnected`);
          ui.notifications.error(errorString);
          throw new Error(errorString);
        }
        const overlappingEra = eras.find((e) => e.getFlag(MODULE_ID, "timeline").eraStart < eraStart && e.getFlag(MODULE_ID, "timeline").eraEnd > eraStart || e.getFlag(MODULE_ID, "timeline").eraStart < eraEnd && e.getFlag(MODULE_ID, "timeline").eraEnd > eraEnd);
        if (overlappingEra) {
          const errorString = game.i18n.localize(`${MODULE_ID}.timeline-config.errors.eraOverlap`);
          ui.notifications.error(errorString);
          throw new Error(errorString);
        }
      }
    }
  }
};

// scripts/app/app.js
var getHistory = () => {
  return game.user.getFlag(MODULE_ID, "history") ?? [];
};
var setHistory = (history) => {
  return game.user.setFlag(MODULE_ID, "history", history);
};
var CHECKBOX_STATE = {
  UNCHECKED: 0,
  CHECKED: 1,
  FAILED: 2
};
var TAB_SCROLL_STATES = {
  quests: { sel: ".quest-list", scroll: 0 },
  lore: { sel: ".quest-list", scroll: 0 },
  timeline: { sel: ".quest-list", scroll: 0 },
  map: { sel: ".maps-list", scroll: 0 },
  achievements: { sel: ".achievements-list", scroll: 0 },
  "my-journal": { sel: ".journal-container", scroll: 0 },
  "party-journal": { sel: ".journal-container", scroll: 0 }
};
var JOURNAL_DEFAULTS = {
  achievements: {
    name: "New Achievement",
    src: "icons/commodities/treasure/cup-trophy-gold.webp"
  }
};
var isPopOut = true;
var fowBrushSize = 50;
var STATES = {
  quests: {
    saveSelected: (uuid) => setSetting("lastQuest", uuid)
  },
  lore: {
    saveSelected: (uuid) => setSetting("lastLore", uuid)
  },
  map: {
    saveSelected: (uuid) => setSetting("lastMap", uuid)
  },
  "my-journal": {
    saveSelected: (uuid) => setSetting("lastMyJournal", uuid)
  },
  "party-journal": {
    saveSelected: (uuid) => setSetting("lastPartyJournal", uuid)
  },
  timeline: {
    saveSelected: (uuid) => setSetting("lastTimeline", uuid)
  },
  achievements: {
    saveSelected: (uuid) => setSetting("lastAchievements", uuid),
    selected: false
  }
};
function setWindowedMode() {
  isPopOut = getSetting("windowedMode");
}
var SimpleQuest = class _SimpleQuest extends Application {
  constructor() {
    super();
    this._questScroll = {};
    _SimpleQuest.setHooks();
    STATES.quests.selected = getSetting("lastQuest");
    STATES.map.selected = getSetting("lastMap");
    STATES.lore.selected = getSetting("lastLore");
    STATES["my-journal"].selected = getSetting("lastMyJournal");
    STATES["party-journal"].selected = getSetting("lastPartyJournal");
    this._search = {};
    this.updateStyle();
    this.refresh = foundry.utils.debounce(this.refresh.bind(this), 30);
  }
  static get APP_ID() {
    return this.name.split(/(?=[A-Z])/).join("-").toLowerCase();
  }
  get APP_ID() {
    return this.constructor.APP_ID;
  }
  get activeTab() {
    return this._tabs[0]?.active;
  }
  getActiveJournal(type) {
    if (STATES[type].active) return STATES[type].active;
    if (!STATES[type].selected) return STATES[type].active ?? STATES[type].journals?.[0] ?? STATES[type].journal;
    const activePage = fromUuidSync(STATES[type].selected);
    if (!activePage) return STATES[type].active ?? STATES[type].journals[0];
    return activePage.parent;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: this.APP_ID,
      template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
      popOut: isPopOut,
      resizable: isPopOut,
      minimizable: isPopOut,
      width: isPopOut ? window.innerWidth * 0.6 : window.innerWidth,
      height: isPopOut ? window.innerHeight * 0.8 : window.innerHeight,
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.title`),
      tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "quests" }],
      scrollY: [".quest-list", ".quest-contents", ".maps-list"]
    });
  }
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      class: "windowed-mode",
      icon: "fas fa-expand",
      onclick: () => this.toggleWindowedMode(),
      title: game.i18n.localize(`${MODULE_ID}.${this.APP_ID}.windowedModeToggle`)
    });
    return buttons;
  }
  async getData() {
    const detailsStatus = getSetting("detailsStatus");
    const seenQuests = getSetting("seenQuests");
    const folderName = getSetting("folderName");
    const loreFolder = await createLoreFolder();
    const matchJournalPermission = getSetting("matchJournalPermission");
    const simpleQuestFolder = Array.from(game.folders).find((f) => f.name === folderName && f.type === "JournalEntry");
    const partyFolder = Array.from(game.folders).find((f) => f.name === getSetting("partyJournalName") && f.type === "JournalEntry" && f.folder === simpleQuestFolder);
    let mapsJournal = Array.from(game.journal).find((j) => j.folder === simpleQuestFolder && j.name === getSetting("mapsJournalName"));
    let timelineJournal = Array.from(game.journal).find((j) => j.folder === simpleQuestFolder && j.name === getSetting("timelineJournalName"));
    let achievementsJournal = Array.from(game.journal).find((j) => j.folder === simpleQuestFolder && j.name === getSetting("achievementsJournalName"));
    const questJournals = Array.from(game.journal).filter((j) => j.folder === simpleQuestFolder && j.name !== mapsJournal?.name && j.name !== timelineJournal?.name && j.name !== achievementsJournal?.name).sort((a, b) => a.sort - b.sort);
    const loreJournals = Array.from(game.journal).filter((j) => j.folder === loreFolder && j.name !== mapsJournal?.name).sort((a, b) => a.sort - b.sort);
    if (!mapsJournal) {
      mapsJournal = await JournalEntry.create({
        name: getSetting("mapsJournalName"),
        folder: simpleQuestFolder.id
      });
    }
    if (!timelineJournal) {
      timelineJournal = await JournalEntry.create({
        name: getSetting("timelineJournalName"),
        folder: simpleQuestFolder.id
      });
    }
    if (!achievementsJournal) {
      achievementsJournal = await JournalEntry.create({
        name: getSetting("achievementsJournalName"),
        folder: simpleQuestFolder.id
      });
    }
    const myFolder = Array.from(game.folders).find((f) => f.name === game.user.name && f.type === "JournalEntry" && f.folder === partyFolder);
    const myJournals = Array.from(game.journal).filter((j) => j.folder === myFolder).sort((a, b) => a.sort - b.sort);
    const sharedFolder = Array.from(game.folders).find((j) => j.folder === partyFolder && j.name === getSetting("sharedJournalName"));
    const sharedJournals = Array.from(game.journal).filter((j) => j.folder === sharedFolder).sort((a, b) => a.sort - b.sort);
    this._questJournals = questJournals;
    this._questFolder = simpleQuestFolder;
    this._loreFolder = loreFolder;
    this._mapsJournal = mapsJournal;
    this._loreJournals = loreJournals;
    this._achievementsJournal = achievementsJournal;
    STATES.quests.journals = questJournals;
    STATES.lore.journals = loreJournals;
    STATES.quests.folder = simpleQuestFolder;
    STATES.lore.folder = loreFolder;
    STATES["my-journal"].journals = myJournals;
    STATES["party-journal"].journals = sharedJournals;
    STATES["my-journal"].folder = myFolder;
    STATES["party-journal"].folder = sharedFolder;
    STATES.map.journal = mapsJournal;
    STATES.timeline.journal = timelineJournal;
    STATES.achievements.journal = achievementsJournal;
    timelineJournal.sortedPages = Array.from(timelineJournal.pages).sort((a, b) => a.sort - b.sort);
    let defaultQuest = "";
    for (const j of questJournals) {
      let count = 0;
      j._simpleQuestDetails = detailsStatus[j.uuid] ?? true;
      const pages = Array.from(j.pages);
      pages.forEach((p) => {
        const isSecret = p.getFlag(MODULE_ID, "hidden");
        const completedSubquests = p.getFlag(MODULE_ID, "completedSubquests") ?? {};
        if (!isSecret) {
          if (!defaultQuest) defaultQuest = p.uuid;
        }
        p._seen = !!seenQuests[p.uuid];
        p.canUserSee = matchJournalPermission ? p.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) : true;
        if (p.canUserSee && !isSecret) count++;
        const lastUpdated = p.getFlag(MODULE_ID, "lastUpdated");
        if (seenQuests[p.uuid] && lastUpdated) {
          p._seen = seenQuests[p.uuid] > lastUpdated;
        }
        p._tocArray = Object.values(p.toc);
        p._tocArray.forEach((t) => {
          t._hidden = p.getFlag(MODULE_ID, `secret.${t.slug}`) ?? false;
          t._completed = completedSubquests[t.slug] ?? false;
        });
        p._simpleQuestDetails = detailsStatus[p.uuid] ?? true;
      });
      j.questCount = count;
      j.sortedPages = Array.from(j.pages).sort((a, b) => a.sort - b.sort);
    }
    for (const j of loreJournals) {
      const pages = Array.from(j.pages);
      let isOnePageVisible = false;
      pages.forEach((p) => {
        p.canPlayerSee = this.getDefaultUserPermission(p) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        p.canUserSee = p.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER);
        if (p.canUserSee) isOnePageVisible = true;
        const lastUpdated = p.getFlag(MODULE_ID, "lastUpdated") ?? 1;
        if (seenQuests[p.uuid] && lastUpdated) {
          p._seen = seenQuests[p.uuid] > lastUpdated;
        }
        p._tocArray = Object.values(p.toc);
        p._simpleQuestDetails = detailsStatus[p.uuid] ?? true;
      });
      j.sortedPages = Array.from(j.pages).sort((a, b) => a.sort - b.sort);
      j._simpleQuestDetails = detailsStatus[j.uuid] ?? true;
      j.canUserSee = j.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) || isOnePageVisible;
    }
    for (const j of myJournals.concat(sharedJournals)) {
      const pages = Array.from(j.pages);
      pages.forEach((p) => {
        p._simpleQuestDetails = detailsStatus[p.uuid] ?? true;
        p._tocArray = Object.values(p.toc);
        j._simpleQuestDetails = detailsStatus[j.uuid] ?? true;
      });
      j.sortedPages = Array.from(j.pages).sort((a, b) => a.sort - b.sort);
      j._simpleQuestDetails = detailsStatus[j.uuid] ?? true;
    }
    if (mapsJournal) {
      mapsJournal.sortedPages = Array.from(mapsJournal.pages).sort((a, b) => a.sort - b.sort);
    }
    if (achievementsJournal) {
      achievementsJournal.sortedPages = Array.from(achievementsJournal.pages).sort((a, b) => a.sort - b.sort);
      achievementsJournal.sortedPages = achievementsJournal.sortedPages.sort((a, b) => {
        if (a.isOwner && !b.isOwner) return -1;
        if (!a.isOwner && b.isOwner) return 1;
        return a.sort - b.sort;
      });
      const users = Array.from(game.users).filter((u) => !u.isGM && u.character);
      for (const page2 of achievementsJournal.sortedPages) {
        const isLimited = !page2.isOwner && page2.getUserLevel(game.user) === CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
        page2.enrichedText = await foundry.applications.ux.TextEditor.implementation.enrichHTML(page2.text.content, { secrets: game.user.isGM, relativeTo: page2, async: true });
        page2.canUserSee = this.getUserPermission(page2) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
        page2.isAwarded = !game.user.isGM && this.getUserPermission(page2) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
        page2.isHiddenAchievement = isLimited;
        const color = page2.getFlag(MODULE_ID, "color") ?? "#000000";
        page2.achievementColor = color === "#000000" ? "var(--foundry-quest-log-ru-text-4)" : color;
        const userOwnership = [];
        for (const user of users) {
          const userPermission = this.getUserPermission(page2, user);
          const userPagePermission = Math.max(page2.ownership[user.id] ?? 0, userPermission);
          const isOwner = userPagePermission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
          const isObserver = userPagePermission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
          userOwnership.push({ user, isOwner, isObserver, isLimited });
        }
        page2._userOwnership = userOwnership;
      }
    }
    if (!STATES.quests.selected) STATES.quests.selected = defaultQuest;
    return { showHistory: getSetting("showHistory"), history: getHistory(), hideCheckboxAutoHide: getSetting("hideCheckboxAutoHide"), matchJournalStyle: getSetting("matchJournalStyle"), achievementsJournal, timelineJournal, questJournals, myJournals, sharedJournals, mapsJournal, isGM: game.user.isGM, popOut: isPopOut, loreJournals, enableQuests: getSetting("enableQuests"), enablePartyJournal: getSetting("enablePartyJournal"), enableMyJournal: getSetting("enableMyJournal"), enableMaps: getSetting("enableMaps"), enableLore: getSetting("enableLore"), enableTimeline: getSetting("enableTimeline"), enableAchievements: getSetting("enableAchievements"), matchJournalPermission: getSetting("matchJournalPermission"), tabNames: getTabNames(), showCompleted: getSetting("showCompleted") };
  }
  getDefaultUserPermission(page2, user) {
    const isInherited = page2.ownership.default === CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT;
    return isInherited ? page2.parent.ownership.default : page2.ownership.default;
  }
  getUserPermission(page2, user) {
    return page2.getUserLevel(user ?? game.user);
  }
  _onChangeTab(event, tabs, active) {
    setSetting("lastTab", active);
    if (!game.user.isGM && active == "map") showWelcomeMaps();
    if (game.user.isGM) this.checkTour(active);
    const res = super._onChangeTab(event, tabs, active);
    if (STATES.map.selected) {
      this._onSelectMap(null, STATES.map.selected);
    }
    const tScroll = TAB_SCROLL_STATES[active].scroll;
    if (tScroll) {
      this.element[0].querySelector(`.tab[data-tab='${active}'] ${TAB_SCROLL_STATES[active].sel}`).scrollTop = tScroll;
      TAB_SCROLL_STATES[active].scroll = 0;
    }
    return res;
  }
  async activateListeners(html) {
    super.activateListeners(html);
    html = html[0] ?? html;
    const timelineContainer = html.querySelector(`.tab[data-tab='timeline'] .quest-details`);
    this.timeline = new Timeline(timelineContainer);
    this.timeline.render(true);
    if (this._storedScrollPositions) {
      this._scrollPositions = this._storedScrollPositions;
      delete this._storedScrollPositions;
    }
    if (game.user.isGM) {
      if (!getSetting("themeConfigShown") && game.tours.get(MODULE_ID + ".interface")?.status !== foundry.nue.Tour.STATUS.UNSTARTED) new ThemeConfig().render(true);
      html.querySelectorAll(".item").forEach((el) => {
        el.addEventListener("contextmenu", async (e) => {
          new TabConfig().render(true);
        });
      });
    }
    html.querySelectorAll(".quest-item").forEach((el) => {
      if (!el.classList.contains("has-details")) el.addEventListener("click", this._onSelectQuest.bind(this));
    });
    html.querySelectorAll(".timeline-item").forEach((el) => {
      el.addEventListener("click", this._onSelectTimeline.bind(this));
    });
    html.querySelectorAll("input[type='search']").forEach((el) => {
      el.addEventListener("focus", (e) => {
        e.currentTarget.select();
      });
      el.addEventListener("input", this._onSearch.bind(this));
    });
    html.querySelector("#toggle-completed").addEventListener("click", async (e) => {
      setSetting("showCompleted", !getSetting("showCompleted"));
      this.render(true);
    });
    if (STATES.quests.selected) {
      await this._onSelectQuest(null, STATES.quests.selected, true);
    }
    if (STATES.map.selected) {
      await this._onSelectMap(null, STATES.map.selected, true);
    }
    if (STATES.lore.selected) {
      await this._onSelectQuest(null, STATES.lore.selected, true);
    }
    if (STATES["my-journal"].selected) {
      await this._onSelectQuest(null, STATES["my-journal"].selected, true);
    }
    if (STATES["party-journal"].selected) {
      await this._onSelectQuest(null, STATES["party-journal"].selected, true);
    }
    html.querySelectorAll("#edit").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const uuid = STATES[tab].selected;
        const page2 = await fromUuid(uuid);
        page2.sheet.render(true);
      });
    });
    html.querySelector("#configure-lore-permissions").addEventListener("click", async (e) => {
      const uuid = e.currentTarget.closest(".quest-controls").dataset.uuid;
      const page2 = await fromUuid(uuid);
      new foundry.applications.apps.DocumentOwnershipConfig({ document: page2 }).render(true);
    });
    html.querySelector("#mark-updated").addEventListener("click", async (e) => {
      const uuid = e.currentTarget.closest(".quest-controls").dataset.uuid;
      const page2 = await fromUuid(uuid);
      await page2.setFlag(MODULE_ID, "lastUpdated", Date.now());
    });
    html.querySelector("#share-quest").addEventListener("click", async (e) => {
      const uuid = e.currentTarget.closest(".quest-controls").dataset.uuid;
      const page2 = await fromUuid(uuid);
      if (!page2) return;
      const response = await Dialog.confirm({
        title: game.i18n.localize(`${MODULE_ID}.shareQuest.title`),
        content: game.i18n.localize(`${MODULE_ID}.shareQuest.content`),
        yes: async () => {
          await ChatMessage.create({
            content: `<div class="dnd5e2"><h2 id="foundry-quest-log-ru-image-override" class="${getSetting("useMessageTheme") ? "foundry-quest-log-ru-message" : ""}">${game.i18n.localize(`${MODULE_ID}.shareQuest.chatMessage`)}</h2><hr><button data-uuid="${uuid}" class="share-quest-button"><i style="pointer-events: none;" class="fa-duotone fa-scroll-old"></i> ${page2.name}</button><hr></div>`,
            speaker: { alias: "Simple Quest" },
            flags: {
              [MODULE_ID]: {
                simpleQuestMessage: uuid
              }
            }
          });
        },
        no: () => {
        },
        defaultYes: false
      });
    });
    html.querySelectorAll("#delete").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const uuid = STATES[tab].selected || el.dataset.uuid;
        const page2 = await fromUuid(uuid);
        if (!page2) return ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.notifications.noPage`));
        const journal = page2.parent;
        const response = await Dialog.confirm({
          title: game.i18n.localize(`${MODULE_ID}.deletePage.title`) + ` ${page2.name}`,
          content: game.i18n.localize(`${MODULE_ID}.deletePage.content`),
          yes: async () => {
            await journal.deleteEmbeddedDocuments("JournalEntryPage", [page2.id]);
            this.render(true);
          },
          no: () => {
          },
          defaultYes: false
        });
      });
    });
    html.querySelectorAll(".foundry-quest-log-ru-show-players").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const uuid = e.currentTarget.closest(".quest-controls").dataset.uuid;
        this.showQuest(uuid);
      });
    });
    html.querySelectorAll("#duplicate").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const uuid = STATES[tab].selected;
        const page2 = await fromUuid(uuid);
        const journal = page2.parent;
        const newPage = await journal.createEmbeddedDocuments("JournalEntryPage", [page2.toObject()]);
        this.render(true);
      });
    });
    html.querySelectorAll("#move").forEach((el) => {
      el.addEventListener("change", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const selected = e.currentTarget.value;
        if (selected === "none") return;
        const page2 = await fromUuid(STATES[tab].selected);
        const pageJournal = page2.parent;
        const newJournal = STATES[tab].journals.find((j) => j.name === selected);
        if (!newJournal) return;
        if (!newJournal.isOwner && !pageJournal.isOwner) return ui.notifications.error(game.i18n.localize(`${MODULE_ID}.${MODULE_ID}.moveQuest.error`));
        const moved2 = await newJournal.createEmbeddedDocuments("JournalEntryPage", [page2.toObject()]);
        if (!moved2[0]) return;
        await pageJournal.deleteEmbeddedDocuments("JournalEntryPage", [page2.id]);
        STATES[tab].selected = moved2[0].uuid;
        this.render(true);
      });
    });
    html.querySelectorAll("#add-category").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const isPartyJournal = tab === "party-journal";
        const journals = STATES[tab].journals;
        const highestSort = journals.reduce((acc, j) => Math.max(acc, j.sort), 0);
        const newJournal = await JournalEntry.create({ name: "New Category", folder: STATES[tab].folder, sort: highestSort + 1e3, ownership: isPartyJournal ? { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER } : null });
        newJournal.sheet.render(true);
        STATES[tab].selected = newJournal.uuid;
        this.render(true);
      });
    });
    html.querySelectorAll("#add-page").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = e.currentTarget.closest(".tab").dataset.tab;
        const journal = this.getActiveJournal(tab);
        if (!journal) return;
        const baseData = { name: "New Page", sort: Math.max(0, ...Array.from(journal.pages).map((p) => p.sort)) + 1e3 };
        const specialData = JOURNAL_DEFAULTS[tab] ?? {};
        const newPage = await journal.createEmbeddedDocuments("JournalEntryPage", [foundry.utils.mergeObject(baseData, specialData)]);
        newPage[0].sheet.render(true);
        if (STATES[tab].selected !== false) STATES[tab].selected = newPage[0].uuid;
        this.render(true);
      });
    });
    html.querySelector("#add-map").addEventListener("click", async (e) => {
      const journal = this._mapsJournal;
      if (!journal) return;
      const newPage = await journal.createEmbeddedDocuments("JournalEntryPage", [{ name: "New Map", type: "image" }]);
      newPage[0].sheet.render(true);
    });
    html.querySelector("#map-help").addEventListener("click", async (e) => {
      showWelcomeMaps(true);
    });
    html.querySelectorAll(".quest-category-summary").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const tab = el.closest(".tab").dataset.tab;
        const uuid = el.dataset.uuid;
        STATES[tab].active = fromUuidSync(uuid);
        this._setSelectedCategory();
      });
    });
    html.querySelectorAll(".tab[data-tab='quests'] .quest-item .quest-checkbox.secret,.tab[data-tab='map'] .map-item .quest-checkbox.secret, .timeline-item .quest-checkbox.secret").forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const uuid = e.currentTarget.dataset.uuid;
        const anchor = e.currentTarget.dataset.anchor;
        const page2 = await fromUuid(uuid);
        const checked = !e.currentTarget.classList.contains("checked");
        if (anchor) {
          const oldChecked = page2.getFlag(MODULE_ID, `secret`) ?? {};
          oldChecked[anchor] = checked;
          await page2.setFlag(MODULE_ID, `secret`, oldChecked);
        } else {
          await page2.setFlag(MODULE_ID, "hidden", checked);
        }
      });
    });
    html.querySelectorAll(".tab[data-tab='lore'] .quest-item .quest-checkbox.secret").forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const uuid = e.currentTarget.dataset.uuid;
        const page2 = await fromUuid(uuid);
        const playerPermission = this.getDefaultUserPermission(page2) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        page2.update({
          ownership: {
            default: playerPermission ? CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE : CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
          }
        });
      });
    });
    html.querySelector("#windowed-mode").addEventListener("click", async (e) => {
      this.toggleWindowedMode();
    });
    html.querySelector("#font-size-decrease").addEventListener("click", async (e) => {
      const fontSize = getSetting("fontSize");
      if (fontSize > 1) {
        await setSetting("fontSize", fontSize - 0.25);
      }
    });
    html.querySelector("#font-size-increase").addEventListener("click", async (e) => {
      const fontSize = getSetting("fontSize");
      if (fontSize < 3) {
        await setSetting("fontSize", fontSize + 0.25);
      }
    });
    html.querySelector("#theme-config").addEventListener("click", async (e) => {
      new ThemeConfig().render(true);
    });
    html.querySelectorAll("details").forEach((el) => {
      el.addEventListener("toggle", async (e) => {
        const details = e.currentTarget;
        if (details._temporarilyOpen) {
          delete details._temporarilyOpen;
          return;
        }
        const isOpen = details.open;
        const uuid = details.dataset.uuid;
        if (!uuid) return;
        const sett = getSetting("detailsStatus");
        sett[uuid] = isOpen;
        await setSetting("detailsStatus", sett);
      });
    });
    html.querySelectorAll(".map-item").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const uuid = e.currentTarget.dataset.uuid;
        this._onSelectMap(e, uuid);
      });
    });
    html.querySelectorAll(".journal-toc").forEach((el) => {
      el.addEventListener("click", async (e) => {
        const journalContainer = el.closest(".tab").querySelector(".journal-container");
        const anchor = el.dataset.slug;
        const tocText = el.dataset.toc;
        const headers = journalContainer.querySelectorAll("h1, h2, h3");
        let header;
        const sameNameHeaderIndex = anchor.includes("$") ? parseInt(anchor.split("$")[1]) : 0;
        const matchingHeaders = Array.from(headers).filter((h) => h.innerText.trim() === tocText);
        header = matchingHeaders[sameNameHeaderIndex];
        if (header) {
          header.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    html.addEventListener("click", (e) => {
      if (!e.target.classList.contains("content-link") || e.ctrlKey || e.metaKey) return;
      const isSimpleQuestPage = this.isSimpleQuestPage(e.target.dataset.uuid);
      if (!isSimpleQuestPage) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.activeTab === "map" && isSimpleQuestPage === "lore" && this._mapImage) {
        this._mapImage.openModalJournal(fromUuidSync(e.target.dataset.uuid));
      } else {
        this.openToPage(e.target.dataset.uuid);
      }
    });
    if (game.user.isGM) {
      html.querySelectorAll(".user-image-wrapper img").forEach((el) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const pageUuid = el.closest(".achievement-item").dataset.uuid;
          const page2 = fromUuidSync(pageUuid);
          new foundry.applications.apps.DocumentOwnershipConfig({ document: page2 }).render(true);
        });
      });
      html.querySelectorAll(".quest-header").forEach((el) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const pageUuid = el.closest(".achievement-item").dataset.uuid;
          const page2 = fromUuidSync(pageUuid);
          page2.sheet.render(true);
        });
      });
    }
    document.addEventListener("keydown", this._onEscape.bind(this));
    this._makeSortable(html);
    this._setSelectedCategory();
    this.restoreSearch();
    this.updateHistory();
    if (this._initialTab) {
      this._skipFirstTourCheck = true;
      this.activateTab(this._initialTab);
      this._initialTab = null;
    }
    this.element[0].querySelector(".achievements-list").scrollTop = TAB_SCROLL_STATES.achievements.scroll;
    this.checkTour(null, "interface");
    if (!this.element[0].dataset.hasContextMenu) {
      new foundry.applications.ux.ContextMenu.implementation(this.element[0], "[data-uuid]", this._getContextEntries(), { jQuery: false });
      this.element[0].dataset.hasContextMenu = true;
    }
  }
  _getContextEntries() {
    const getDocument = (el) => fromUuidSync(el.dataset.uuid);
    return [
      {
        name: "OWNERSHIP.Configure",
        icon: '<i class="far fa-lock"></i>',
        condition: () => game.user.isGM,
        callback: (el) => new foundry.applications.apps.DocumentOwnershipConfig({ document: getDocument(el) }).render(true)
      },
      {
        name: "SIDEBAR.Edit",
        icon: '<i class="far fa-edit"></i>',
        condition: (el) => getDocument(el).isOwner,
        callback: (el) => getDocument(el).sheet.render(true)
      },
      {
        name: "SIDEBAR.Delete",
        icon: '<i class="far fa-trash"></i>',
        condition: (el) => getDocument(el).isOwner,
        callback: (el) => getDocument(el).deleteDialog()
      },
      {
        name: "SIDEBAR.Duplicate",
        icon: '<i class="far fa-copy"></i>',
        condition: (el) => getDocument(el).isOwner,
        callback: (el) => getDocument(el).clone({ name: `${getDocument(el)._source.name} (Copy)` }, { save: true, addSource: true })
      }
    ];
  }
  checkTour(tab, tourId) {
    if (this._skipFirstTourCheck) {
      delete this._skipFirstTourCheck;
      return;
    }
    const tourName = tab ? `${MODULE_ID}.${tab}-tab` : `${MODULE_ID}.${tourId}`;
    const t = game.tours.get(tourName);
    if (t?.status === foundry.nue.Tour.STATUS.UNSTARTED) {
      t.start();
    }
  }
  _makeSortable(html) {
    if (!game.user.isGM) return;
    html.querySelectorAll(".quest-category-list").forEach((el) => {
      new Sortable(el, {
        dragSelector: ".quest-item",
        dropSelector: ".quest-item",
        animation: 100,
        onEnd: this._sortQuestListAndSave.bind(this)
      });
    });
    html.querySelectorAll(".quest-list").forEach((el) => {
      new Sortable(el, {
        dragSelector: ".quest-category",
        dropSelector: ".quest-category",
        animation: 100,
        onEnd: this._sortCategoryListAndSave.bind(this)
      });
    });
    new Sortable(html.querySelector(".maps-list-element"), {
      dragSelector: ".map-item",
      dropSelector: ".map-item",
      animation: 100,
      onEnd: this._sortMapListAndSave.bind(this)
    });
    new Sortable(html.querySelector(".achievements-wrapper"), {
      dragSelector: ".achievement-item",
      dropSelector: ".achievement-item",
      animation: 100,
      onEnd: this._sortAchievementListAndSave.bind(this)
    });
  }
  restoreSearch() {
    const searchInputs = this.element[0].querySelectorAll("input[type='search']");
    searchInputs.forEach((s) => {
      s.value = this._search[s.closest(".tab").dataset.tab] ?? "";
      if (s.value) s.dispatchEvent(new Event("input"));
    });
  }
  _onSearch(e) {
    const term = e.currentTarget.value.toLowerCase();
    const html = e.currentTarget.parentElement.parentElement;
    const tab = html.closest(".tab").dataset.tab;
    if (tab == "lore") this.updateGlobalSearch(term, e.currentTarget);
    this._search[tab] = term;
    const listItems = html.querySelectorAll("li");
    listItems.forEach((li) => {
      const text = li.textContent.toLowerCase();
      const isMatch = text.includes(term);
      li.classList.toggle("not-match", !isMatch);
      if (isMatch) {
        const cd = li.closest("details");
        if (cd) {
          cd._temporarilyOpen = true;
          cd.open = true;
        }
      }
    });
    const details = html.querySelectorAll("details");
    details.forEach((d) => {
      const text = d.textContent.toLowerCase();
      const isMatch = text.includes(term);
      d.classList.toggle("not-match", !isMatch);
    });
    if (!term) this.refresh();
  }
  updateGlobalSearch(term, input) {
    const oldResults = input.parentElement.parentElement.querySelectorAll(".global-search-results");
    if (oldResults.length) oldResults.forEach((r) => r.remove());
    if (!term) return;
    term = term.toLowerCase();
    const global = new GlobalSearch(term, this._loreJournals);
    if (term.length < 4) return;
    const res = global.getResults();
    const resultsEl = document.createElement("ul");
    resultsEl.classList.add("global-search-results");
    resultsEl.style.display = term ? null : "none";
    res.forEach((r) => {
      const li = document.createElement("li");
      const text = r.bestMatch;
      const index2 = text.toLowerCase().indexOf(term);
      const before = text.substring(0, index2);
      const after = text.substring(index2 + term.length);
      li.innerHTML = `<h3>${r.page.name}</h3><p>${before}<span class="highlight">${term}</span>${after}</p>`;
      resultsEl.append(li);
      li.addEventListener("click", async (e) => {
        await this._onSelectQuest(null, r.page.uuid);
        const journalContainer = input.closest(".tab").querySelector(".quest-details");
        const allEls = journalContainer.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
        let el = [];
        allEls.forEach((e2) => {
          const inner = e2.textContent.toLowerCase();
          (inner.match(new RegExp(term, "g")) || []).forEach((m) => {
            el.push(e2);
          });
        });
        if (!el.length) return;
        const targetEl = el[r.matchIndex];
        setTimeout(() => {
          targetEl.classList.add("search-highlight");
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
        li.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    resultsEl.style.width = input.clientWidth + "px";
    input.parentElement.after(resultsEl);
  }
  async _sortQuestListAndSave(sortEvent) {
    const list = sortEvent.from;
    const pages = Array.from(list.children).map((li) => li.dataset.uuid);
    const journal = await fromUuid(list.dataset.uuid);
    const updates = journal.pages.map((p) => {
      return {
        _id: p.id,
        sort: pages.indexOf(p.uuid) * 1e3
      };
    });
    await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
  }
  async _sortCategoryListAndSave(sortEvent) {
    const list = sortEvent.from;
    const tab = list.closest(".tab").dataset.tab;
    const journals = Array.from(list.children).map((li) => li.dataset.uuid);
    const updates = STATES[tab].journals.map((j) => {
      return {
        _id: j.id,
        sort: journals.indexOf(j.uuid) * 1e3
      };
    });
    await JournalEntry.updateDocuments(updates);
  }
  async _sortMapListAndSave(sortEvent) {
    const list = sortEvent.from;
    const pages = Array.from(list.children).map((li) => li.dataset.uuid);
    const journal = this._mapsJournal;
    const updates = journal.pages.map((p) => {
      return {
        _id: p.id,
        sort: pages.indexOf(p.uuid) * 1e3
      };
    });
    await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
  }
  async _sortAchievementListAndSave(sortEvent) {
    const list = sortEvent.from;
    const pages = Array.from(list.children).map((li) => li.dataset.uuid);
    const journal = this._achievementsJournal;
    const updates = journal.pages.map((p) => {
      return {
        _id: p.id,
        sort: pages.indexOf(p.uuid) * 1e3
      };
    });
    await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
  }
  _onEscape(e) {
    if (e.key === "Escape" && this.rendered) {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    }
  }
  async _setSelectedCategory() {
    const html = this.element[0];
    const categories = html.querySelectorAll(".quest-category-summary");
    categories.forEach((c) => c.classList.remove("selected"));
    const selected = this.getActiveJournal("quests");
    if (!selected) return;
    const category = html.querySelector(`.quest-category-summary[data-uuid="${selected.uuid}"]`);
    if (!category) return;
    category.classList.add("selected");
  }
  _addCheckboxes(html, page2) {
    const listItems = html.querySelectorAll("li");
    listItems.forEach((li) => {
      const checkbox = document.createElement("div");
      if (!page2.isOwner) checkbox.style.pointerEvents = "none";
      checkbox.classList.add("quest-checkbox");
      const marker = document.createElement("div");
      marker.classList.add("quest-checkbox-marker");
      checkbox.append(marker);
      const key = _SimpleQuest.getKeyFromLi(li);
      const checked = page2.getFlag(MODULE_ID, `checkboxes.${key}`);
      if (checked) {
        checkbox.classList.add("checked");
        li.classList.add("checked");
        if (checked === CHECKBOX_STATE.FAILED) {
          checkbox.classList.add("failed");
          li.classList.add("failed");
        }
      }
      checkbox.addEventListener("mouseup", async (e) => {
        const isLeftClick = e.button === 0;
        const isRightClick = e.button === 2;
        if (!isLeftClick && !isRightClick) return;
        let checked2 = !checkbox.classList.contains("checked");
        if (checked2 && isRightClick) checked2 = CHECKBOX_STATE.FAILED;
        if (checked2 && isLeftClick) checked2 = CHECKBOX_STATE.CHECKED;
        checkbox.classList.toggle("checked");
        checkbox.classList.toggle("failed", checked2 === CHECKBOX_STATE.FAILED);
        const keysToUpdate = { [`${key}`]: checked2 };
        const parentLi = checkbox.closest("ul, ol").closest("li");
        const childLis = checkbox.closest("li").querySelectorAll("li");
        if (parentLi) {
          const siblings = checkbox.closest("ul").querySelectorAll("li");
          const allChecked2 = Array.from(siblings).every((s) => s.querySelector(".quest-checkbox:not(.secret)").classList.contains("checked"));
          const allFailed = Array.from(siblings).every((s) => s.querySelector(".quest-checkbox:not(.secret)").classList.contains("failed"));
          const parentKey = _SimpleQuest.getKeyFromLi(parentLi);
          if (allChecked2) {
            keysToUpdate[parentKey] = allFailed ? CHECKBOX_STATE.FAILED : CHECKBOX_STATE.CHECKED;
          } else {
            keysToUpdate[parentKey] = CHECKBOX_STATE.UNCHECKED;
          }
          parentLi.querySelector(".quest-checkbox:not(.secret)").classList.toggle("checked", allChecked2);
        }
        checkbox.classList.toggle("checked");
        if (childLis.length && checked2) {
          childLis.forEach((li2) => {
            const childKey = _SimpleQuest.getKeyFromLi(li2);
            keysToUpdate[childKey] = checked2;
            li2.querySelector(".quest-checkbox:not(.secret)").classList.toggle("checked", checked2 !== CHECKBOX_STATE.UNCHECKED);
          });
        }
        const oldChecked = page2.getFlag(MODULE_ID, `checkboxes`) ?? {};
        const update = { [`flags.${MODULE_ID}.checkboxes`]: foundry.utils.mergeObject(oldChecked, keysToUpdate) };
        const isSecretUpdate = checkbox.closest(".secret");
        if (!isSecretUpdate) update[`flags.${MODULE_ID}.lastUpdated`] = Date.now();
        let furtherList = li.closest("ol, ul");
        for (let i = 0; i < 10; i++) {
          const isUlorOl = furtherList.tagName === "UL" || furtherList.tagName === "OL";
          const closest2 = !isUlorOl ? furtherList.closest("ol, ul") : furtherList.parentElement?.closest("ol, ul");
          if (closest2) furtherList = closest2;
        }
        const _furthestList = furtherList;
        let upperBoundHeader;
        while (furtherList.previousElementSibling) {
          upperBoundHeader = furtherList.previousElementSibling;
          if (upperBoundHeader.tagName.startsWith("H")) break;
          furtherList = furtherList.previousElementSibling;
        }
        if (!upperBoundHeader.tagName.startsWith("H")) upperBoundHeader = null;
        checkbox.classList.toggle("checked");
        const allChecked = Array.from(_furthestList.querySelectorAll("li")).every((li2) => li2.querySelector(".quest-checkbox:not(.secret)").classList.contains("checked"));
        if (upperBoundHeader) {
          const headerKey = upperBoundHeader.innerText.slugify({ strict: true });
          const oldCompleted = page2.getFlag(MODULE_ID, `completedSubquests`) ?? {};
          update[`flags.${MODULE_ID}.completedSubquests`] = foundry.utils.mergeObject(oldCompleted, { [headerKey]: allChecked });
        }
        const allCheckedOnQuest = Array.from(html.querySelectorAll("li")).every((li2) => li2.querySelector(".quest-checkbox:not(.secret)").classList.contains("checked"));
        checkbox.classList.toggle("checked");
        update[`flags.${MODULE_ID}.completed`] = allCheckedOnQuest;
        await page2.update(update);
      });
      li.prepend(checkbox);
      const secretCheckbox = document.createElement("div");
      secretCheckbox.classList.add("quest-checkbox");
      secretCheckbox.classList.add("secret");
      const secretMarker = document.createElement("div");
      const secretMarkerIcon = document.createElement("i");
      secretMarkerIcon.classList.add("fas");
      secretMarkerIcon.classList.add("fa-eye-slash");
      secretMarker.append(secretMarkerIcon);
      secretMarker.classList.add("quest-checkbox-marker");
      secretCheckbox.append(secretMarker);
      const secretKey = key;
      const secretChecked = page2.getFlag(MODULE_ID, `secret.${secretKey}`);
      if (secretChecked) {
        secretCheckbox.classList.add("checked");
        li.classList.add("secret");
        if (!game.user.isGM) {
          li.style.display = "none";
        }
      }
      secretCheckbox.addEventListener("click", async (e) => {
        const checked2 = !secretCheckbox.classList.contains("checked");
        const keysToUpdate = { [`${secretKey}`]: checked2 };
        let oldChecked = page2.getFlag(MODULE_ID, `secret`) ?? {};
        if (typeof oldChecked === "boolean") oldChecked = {};
        const isAnyUnSecret = Object.values(keysToUpdate).some((v) => !v);
        const update = { [`flags.${MODULE_ID}.secret`]: foundry.utils.mergeObject(oldChecked, keysToUpdate) };
        const isSecretUpdate = checkbox.classList.contains("secret") ?? checkbox.closest(".secret");
        if (isAnyUnSecret && !isSecretUpdate) {
          update[`flags.${MODULE_ID}.lastUpdated`] = Date.now();
        }
        await page2.update(update);
      });
      if (game.user.isGM) li.prepend(secretCheckbox);
    });
  }
  async _onSelectQuest(event, uuid, firstRender = false) {
    const pageUuid = uuid ?? event.currentTarget.dataset.uuid;
    const page2 = await fromUuid(pageUuid);
    if (!page2) return;
    const pageType = this.isSimpleQuestPage(pageUuid);
    if (!pageType) return;
    const html = this.element[0].querySelector(`.tab[data-tab="${pageType}"]`);
    STATES[pageType].active = page2.parent;
    await this._setSelectedCategory();
    html.querySelectorAll(".quest-selected").forEach((el) => el.classList.remove("quest-selected"));
    if (event) event.currentTarget.classList.add("quest-selected");
    else {
      const el = html.querySelector(`summary.quest-item[data-uuid="${pageUuid}"]`) ?? html.querySelector(`.quest-item[data-uuid="${pageUuid}"]`);
      if (el) el.classList.add("quest-selected");
    }
    STATES[pageType].selected = pageUuid;
    const container = html.querySelector(".quest-contents");
    container.innerHTML = "";
    let content;
    if (page2.type === "text") {
      content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(page2.text.content, { secrets: page2.isOwner, relativeTo: page2, async: true });
    } else if (page2.type === "image") {
      const maskImage = getSetting("imagePageMask");
      const maskImageStyle = maskImage ? `style="mask-image: url('${maskImage}');-webkit-mask-image: url('${maskImage}');"` : "";
      content = `<div class="foundry-quest-log-ru-image-journal"><img ${maskImageStyle} src="${page2.src}" alt="${page2.name}"><p>${page2.image.caption}</p></div>`;
    } else if (page2.type === "pdf") {
      console.log("Loading PDF");
      const params = page2.sheet._getViewerParams();
      const frame = `<iframe src="scripts/pdfjs/web/viewer.html?${params}" style="width: 100%; height: 95%;"></iframe>`;
      content = frame;
    } else {
      content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`@Embed[${page2.uuid}]`, { secrets: page2.isOwner, relativeTo: page2, async: true });
    }
    container.innerHTML = `<h1 class="quest-header">${page2.name}</h1>` + content;
    container.querySelectorAll("secret-block").forEach((s) => s.addEventListener("change", (event2) => {
      page2.update({ "text.content": event2.target.toggleRevealed(page2.text.content) });
    }));
    if (!uuid) {
      html.querySelector(".quest-details").scrollTop = this._questScroll[pageUuid] ?? 0;
    }
    html.querySelectorAll("img").forEach((img) => img.addEventListener("click", (event2) => new ImagePopout(event2.currentTarget.getAttribute("src"), {}).render(true)));
    const questControls = html.querySelector(".quest-controls");
    questControls.classList.toggle("foundry-quest-log-ru-hidden", !page2.isOwner);
    questControls.dataset.uuid = pageUuid;
    STATES[pageType].saveSelected(pageUuid);
    const seenQuests = getSetting("seenQuests");
    seenQuests[pageUuid] = Date.now();
    await setSetting("seenQuests", seenQuests);
    if (pageType === "quests") this._addCheckboxes(container, page2);
    const onOpenAnchor = STATES[pageType].anchor;
    const anchor = onOpenAnchor ?? event?.currentTarget?.dataset?.anchor;
    this.updateHistory(pageUuid, anchor);
    if (event && event.currentTarget?.classList.contains("sub-quest") || onOpenAnchor && page2.toc[anchor]) {
      STATES[pageType].anchor = null;
      const toc2 = page2.toc[anchor];
      const tocText = toc2.text.trim();
      const headers = container.querySelectorAll("h1, h2, h3");
      let header;
      const sameNameHeaderIndex = anchor.includes("$") ? parseInt(anchor.split("$")[1]) : 0;
      const matchingHeaders = Array.from(headers).filter((h) => h.innerText.trim() === tocText);
      header = matchingHeaders[sameNameHeaderIndex];
      if (header) {
        setTimeout(() => header.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      }
    }
    const toc = page2._tocArray;
    if (toc?.some((t) => t._hidden)) {
      const h1h2h3 = container.querySelectorAll("h1, h2, h3");
      const hiddenTocInnerText = toc.filter((t) => t._hidden).map((t) => t.text);
      const toHide = Array.from(h1h2h3).filter((h) => hiddenTocInnerText.includes(h.innerText));
      for (const h of toHide) {
        let next = h.nextElementSibling;
        while (next && !next.matches("h1, h2, h3")) {
          next.style.display = "none";
          next = next.nextElementSibling;
        }
        h.style.display = "none";
      }
    }
    if (firstRender) {
      html.querySelector(".quest-details").scrollTop = this._questScroll[STATES[pageType].selected] ?? 0;
    }
    Hooks.callAll(`${MODULE_ID}.onSelectQuest`, page2, container);
  }
  async _onSelectMap(event, uuid, firstRender = false) {
    const pageUuid = uuid ?? event.currentTarget.dataset.uuid;
    const page2 = await fromUuid(pageUuid);
    const html = this.element[0];
    if (!page2) return;
    this.updateHistory(pageUuid);
    const mapContainer = html.querySelector(".map-details");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = page2.text.content;
    const firstImageSrc = page2.src || tempDiv.querySelector("img")?.src;
    const multiSource = Array.from(tempDiv.querySelectorAll("img")).map((i) => i.src);
    const mapImage = new MapImage(firstImageSrc, page2, multiSource, page2.getFlag(MODULE_ID, "pinsLocked") ?? false);
    this._mapImage = mapImage;
    mapContainer.innerHTML = "";
    mapContainer.append(mapImage.element);
    const measureFlag = page2.getFlag(MODULE_ID, "measure") || "1mi";
    const numericPart = parseFloat(measureFlag) || 1;
    const unitPart = measureFlag.match(/[a-z]+/)?.[0] ?? "mi";
    mapImage._measureUnits = unitPart;
    mapImage._measure = numericPart;
    if (page2.isOwner) {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("map-controls");
      mapContainer.append(buttonContainer);
      if (game.user.isGM) {
        const resetFowButton = document.createElement("i");
        resetFowButton.classList.add("fa-duotone");
        resetFowButton.classList.add("fa-cloud");
        resetFowButton.id = "reset-fow";
        resetFowButton.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.reset-fow";
        resetFowButton.dataset.tooltipDirection = "UP";
        resetFowButton.addEventListener("click", async (e) => {
          mapImage.resetFow();
        });
        const fowBrushSizeSlider = document.createElement("input");
        fowBrushSizeSlider.type = "range";
        fowBrushSizeSlider.min = 0;
        fowBrushSizeSlider.max = 100;
        fowBrushSizeSlider.value = fowBrushSize;
        fowBrushSizeSlider.id = "fow-brush-size";
        fowBrushSizeSlider.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.fow-brush-size";
        fowBrushSizeSlider.dataset.tooltipDirection = "UP";
        fowBrushSizeSlider.addEventListener("change", async (e) => {
          fowBrushSize = e.currentTarget.value;
        });
        const measureInput = document.createElement("input");
        measureInput.type = "text";
        measureInput.id = "measure-input";
        measureInput.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.measure";
        measureInput.dataset.tooltipDirection = "UP";
        measureInput.placeholder = "foundry-quest-log-ru.simple-quest.tooltip.measure";
        measureInput.value = page2.getFlag(MODULE_ID, "measure") ?? "1mi";
        measureInput.style.width = "8rem";
        measureInput.addEventListener("change", async (e) => {
          const value = e.currentTarget.value;
          page2.setFlag(MODULE_ID, "measure", value);
        });
        const pinsLocked = page2.getFlag(MODULE_ID, "pinsLocked") ?? false;
        const lockPins = document.createElement("i");
        lockPins.classList.add("fa-duotone");
        lockPins.classList.add(pinsLocked ? "fa-location-pin-slash" : "fa-location-pin");
        lockPins.id = "lock-pins";
        lockPins.style.minWidth = "2.2rem";
        lockPins.style.textAlign = "center";
        lockPins.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.lock-pins";
        lockPins.dataset.tooltipDirection = "UP";
        lockPins.addEventListener("click", async (e) => {
          page2.setFlag(MODULE_ID, "pinsLocked", !pinsLocked);
        });
        const showPlayersButton = document.createElement("i");
        showPlayersButton.classList.add("fa-duotone");
        showPlayersButton.classList.add("fa-eye");
        showPlayersButton.id = "show-players";
        showPlayersButton.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.show-players";
        showPlayersButton.dataset.tooltipDirection = "UP";
        showPlayersButton.addEventListener("click", async (e) => {
          this.showQuest(pageUuid);
        });
        buttonContainer.append(measureInput);
        buttonContainer.append(lockPins);
        buttonContainer.append(fowBrushSizeSlider);
        buttonContainer.append(resetFowButton);
        buttonContainer.append(showPlayersButton);
        Object.defineProperty(mapImage, "fowBrushSize", {
          get: () => fowBrushSize
        });
        mapImage._fowBrushSizeInput = fowBrushSizeSlider;
      }
      const editButton = document.createElement("i");
      editButton.classList.add("fa-duotone");
      editButton.classList.add("fa-pen-to-square");
      editButton.id = "edit-map";
      editButton.dataset.tooltip = "foundry-quest-log-ru.simple-quest.tooltip.edit-map";
      editButton.dataset.tooltipDirection = "UP";
      editButton.addEventListener("click", async (e) => {
        page2.sheet.render(true);
      });
      buttonContainer.append(editButton);
    }
    setSetting("lastMap", pageUuid);
    html.querySelectorAll(".map-selected").forEach((el) => el.classList.remove("map-selected"));
    const mapEl = this.element[0].querySelector(`.map-item[data-uuid="${pageUuid}"]`);
    if (mapEl) mapEl.classList.add("map-selected");
    STATES.map.selected = pageUuid;
  }
  async _onSelectTimeline(event, uuid) {
    const pageUuid = uuid ?? event.currentTarget.dataset.uuid;
    const page2 = await fromUuid(pageUuid);
    if (!page2) return;
    STATES.timeline.selected = pageUuid;
    this.timeline.goTo(pageUuid);
  }
  toggle(tab = null) {
    if (this.rendered) {
      if (STATES.quests.selected) {
        this._questScroll[STATES.quests.selected] = this.element[0].querySelector(".quest-details").scrollTop;
      }
      this.close();
    } else {
      this._initialTab = tab ?? getSetting("lastTab");
      this.render(true);
    }
  }
  async toggleWindowedMode() {
    await this.close();
    setSetting("windowedMode", !getSetting("windowedMode"));
    isPopOut = !isPopOut;
    ui.simpleQuest = new _SimpleQuest();
    ui.simpleQuest._initialTab = getSetting("lastTab");
    ui.simpleQuest.render(true);
  }
  openToTab(tab) {
    this._initialTab = tab;
    this.render(true);
  }
  openToPage(uuid, anchor, options = {}) {
    const isSimpleQuestPage = this.isSimpleQuestPage(uuid);
    const hasPermission = this.hasPermission(uuid);
    if (!hasPermission) return ui.notifications.error(game.i18n.localize(`${MODULE_ID}.noPermission`));
    if (STATES[isSimpleQuestPage]) {
      STATES[isSimpleQuestPage].selected = uuid;
      if (anchor) STATES[isSimpleQuestPage].anchor = anchor;
    }
    this._initialTab = isSimpleQuestPage;
    this.updateHistory(uuid, anchor);
    this.render(true);
  }
  updateHistory(uuid, anchor) {
    const history = getHistory();
    if (uuid) {
      const existing = history.find((h) => h.uuid === uuid && h.anchor === anchor);
      if (!existing) {
        history.unshift({ uuid, label: fromUuidSync(uuid).name, anchor });
        history.splice(10);
      } else {
        existing.label = fromUuidSync(uuid).name;
        existing.anchor = anchor;
        existing.uuid = uuid;
      }
      setHistory(history);
    }
    if (!this.element[0]) return;
    const historyEl = this.element[0].querySelector("#history");
    if (!historyEl) return;
    historyEl.innerHTML = "";
    for (const h of history) {
      const isLast = history.findIndex((i) => i === h) === history.length - 1;
      const el = document.createElement("div");
      el.classList.add("history-item");
      el.innerHTML = `<span>${h.label}${h.anchor ? ` (${h.anchor.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")})` : ""}</span>`;
      historyEl.append(el);
      el.addEventListener("click", () => {
        this.openToPage(h.uuid, h.anchor);
      });
      if (!isLast) {
        const arrow = document.createElement("i");
        arrow.classList.add("fa-thin");
        arrow.classList.add("fa-chevron-right");
        historyEl.append(arrow);
      }
    }
  }
  async showQuest(uuid) {
    const users = Array.from(game.users).filter((u) => u.active && u !== game.user);
    const template = await renderTemplate("modules/foundry-quest-log-ru/templates/show-quest.hbs", { users });
    Dialog.prompt({
      title: game.i18n.localize(`${MODULE_ID}.showQuest.title`),
      content: template,
      label: game.i18n.localize(`JOURNAL.ActionShow`),
      render: (html) => {
        html = html[0];
        const all = html.querySelector(`input[name="allPlayers"]`);
        const otherCheckboxes = html.querySelectorAll(`input[name="players"]`);
        all.addEventListener("change", (e) => {
          const disabled = e.currentTarget.checked;
          otherCheckboxes.forEach((c) => c.disabled = disabled);
        });
        html.closest(".app").classList.add("foundry-quest-log-ru-dialog");
      },
      callback: async (html) => {
        html = html[0];
        const all = html.querySelector(`input[name="allPlayers"]`).checked;
        const allUsers = users.map((u) => u.id);
        const selected = Array.from(html.querySelectorAll(`input[name="players"]:checked`)).map((i) => i.value);
        Socket.openToPage({ uuid }, { users: all ? allUsers : selected });
      },
      close: () => {
      }
    });
  }
  isSimpleQuestPage(uuid) {
    let page2;
    try {
      page2 = fromUuidSync(uuid);
    } catch (e) {
      return false;
    }
    if (!page2) return false;
    if (!(page2 instanceof JournalEntryPage)) return false;
    const journal = page2.parent;
    const folder = Array.from(game.folders).find((f) => f.name === getSetting("folderName") && f.type === "JournalEntry");
    const loreFolder = Array.from(game.folders).find((f) => f.name === getSetting("loreFolderName") && f.type === "JournalEntry");
    const mapsJournal = Array.from(game.journal).find((j) => j.folder === folder && j.name === getSetting("mapsJournalName"));
    const isMap = Array.from(mapsJournal.pages).some((p) => p.uuid === uuid);
    const isLore = journal.folder === loreFolder;
    const isQuest = journal.folder === folder;
    const isAchievements = journal.folder === folder && journal.name === getSetting("achievementsJournalName");
    if (isAchievements) return "achievements";
    if (isMap) return "map";
    if (isLore) return "lore";
    if (isQuest) return "quests";
    const partyFolder = Array.from(game.folders).find((f) => f.name === getSetting("partyJournalName") && f.type === "JournalEntry" && f.folder === folder);
    const sharedFolder = Array.from(game.folders).find((f) => f.name === getSetting("sharedJournalName") && f.type === "JournalEntry" && f.folder === partyFolder);
    const playerFolder = Array.from(game.folders).find((f) => f.name === game.user.name && f.type === "JournalEntry" && f.folder === partyFolder);
    if (journal.folder === sharedFolder) return "party-journal";
    if (journal.folder === playerFolder) return "my-journal";
    return false;
  }
  hasPermission(uuid) {
    if (game.user.isGM) return true;
    const page2 = fromUuidSync(uuid);
    if (!page2) return false;
    const simpleQuestHidden = page2.getFlag(MODULE_ID, "hidden");
    if (simpleQuestHidden) return false;
    const type = this.isSimpleQuestPage(uuid);
    const isValid = type === "map" || type === "quests";
    if (isValid && !simpleQuestHidden) return true;
    if (page2.isOwner) return true;
    const journal = page2.parent;
    const journalDefaultPermission = journal.permission;
    return page2.permission === CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT ? journalDefaultPermission : page2.permission;
  }
  sceneToMap() {
    const scene = canvas.scene;
    const img = scene.background.src;
    const distance = 100 / scene.dimensions.distancePixels;
    const markers = {};
    const origin = { x: scene.dimensions.sceneX, y: scene.dimensions.sceneY };
    const size = { x: scene.dimensions.sceneWidth, y: scene.dimensions.sceneHeight };
    canvas.notes.placeables.forEach((n) => {
      const pos = n.center;
      const x = (pos.x - origin.x) / size.x;
      const y = (pos.y - origin.y) / size.y;
      const d = n.document;
      markers[foundry.utils.randomID()] = {
        title: d.label,
        icon: d.texture.src,
        journal: d.page?.uuid ?? d.entry?.uuid,
        x,
        y,
        hidden: false,
        color: d.texture.tint || "#ff0000"
      };
    });
    const mapsJournal = Array.from(game.journal).find((j) => j.folder === this._questFolder && j.name === getSetting("mapsJournalName"));
    const newPage = mapsJournal.createEmbeddedDocuments("JournalEntryPage", [
      {
        name: scene.name,
        type: "image",
        src: img,
        flags: {
          "foundry-quest-log-ru": {
            markers,
            measure: `${distance}${scene.grid.units}`
          }
        }
      }
    ]);
  }
  refresh() {
    if (this.rendered) {
      this.timeline?.saveScrollPosition();
      this.render(true);
    }
  }
  updateStyle() {
    const backgroundColor = getSetting("backgroundColor") || getDefaultSetting("backgroundColor");
    const textColor = getSetting("textColor") || getDefaultSetting("textColor");
    const secretColor = getSetting("secretColor") || getDefaultSetting("secretColor");
    const failedColor = getSetting("failedColor") || getDefaultSetting("failedColor");
    const fontSize = getSetting("fontSize");
    const fontFamily = getSetting("fontFamily");
    const headerOnlyFont = getSetting("headerOnlyFont") === "default" ? fontFamily : getSetting("headerOnlyFont");
    const invertTheme = getSetting("invertTheme");
    const computedBackground = backgroundColor.length > 10 ? backgroundColor : backgroundColor + "eb";
    const computedBackgroundColorOnly = backgroundColor.length > 10 ? computedBackground.match(/#(?:[0-9a-fA-F]{3}){1,2}/g)?.[0] ?? "#ffffff" : computedBackground;
    document.documentElement.style.setProperty("--foundry-quest-log-ru-font-family", fontFamily);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-header-font-family", headerOnlyFont);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-background", computedBackground);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-background-color", computedBackgroundColorOnly);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-hidden-color", secretColor);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-failed-color", failedColor);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-font-size", fontSize + "rem");
    document.documentElement.style.setProperty("--foundry-quest-log-ru-invert", invertTheme ? 1 : 0);
    const baseTextColor = new ColorHelper(textColor);
    const isDark = baseTextColor.l < 0.5;
    const textDesaturated = isDark ? baseTextColor.saturate(1.5) : baseTextColor.saturate(0.5);
    const textBright = isDark ? baseTextColor.brightness(0.7) : baseTextColor.brightness(1.3);
    const textDark = isDark ? baseTextColor.brightness(1.5) : baseTextColor.brightness(0.5);
    const textSaturated = isDark ? baseTextColor.saturate(0.5) : baseTextColor.saturate(1.5);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-text-0", textBright);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-text-1", textColor);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-text-2", textDesaturated);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-text-3", textSaturated);
    document.documentElement.style.setProperty("--foundry-quest-log-ru-text-4", textDark);
  }
  async render(...args) {
    for (const tabType of Object.keys(STATES)) {
      if (STATES[tabType].selected && this.element[0]) {
        const el = this.element[0].querySelector(`.tab[data-tab="${tabType}"] .quest-details`);
        if (el) {
          this._questScroll[STATES[tabType].selected] = el.scrollTop;
        }
      }
    }
    if (this.element[0]) {
      TAB_SCROLL_STATES.achievements.scroll = this.element[0].querySelector(".achievements-list").scrollTop;
    }
    return super.render(...args);
  }
  async close(options = {}) {
    this.element[0].querySelectorAll(".tab").forEach((t) => t.classList.add("active"));
    this._saveScrollPositions(this.element);
    this._storedScrollPositions = this._scrollPositions;
    this.timeline?.saveScrollPosition();
    for (const [tabId, scrollData] of Object.entries(TAB_SCROLL_STATES)) {
      const tabEl = this.element[0].querySelector(`.tab[data-tab="${tabId}"] ${scrollData.sel}`);
      TAB_SCROLL_STATES[tabId].scroll = tabEl ? tabEl.scrollTop : 0;
    }
    document.removeEventListener("keydown", this._onEscape.bind(this));
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) return;
    this._state = states.CLOSING;
    let el = this.element;
    if (!el) return this._state = states.CLOSED;
    for (let cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, el);
    }
    const html = this.element[0];
    return new Promise((resolve) => {
      html.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: "ease-in-out",
        fill: "forwards"
      }).onfinish = () => {
        html.remove();
        this._element = null;
        delete ui.windows[this.appId];
        this._minimized = false;
        this._state = states.CLOSED;
        resolve();
      };
    });
  }
  createDemoQuest() {
    createDemoQuest();
  }
  async importQuests(journal, name, { silent = false } = {}) {
    await this.getData();
    const existing = this._questJournals.find((j) => j.name === name);
    const proceed = silent || await foundry.applications.api.DialogV2.confirm({ window: { title: game.i18n.localize(`${MODULE_ID}.importQuests.title`) + name }, content: game.i18n.localize(`${MODULE_ID}.importQuests.content`) });
    if (!proceed) return;
    const folder = this._questFolder;
    const targetJournal = existing ?? await JournalEntry.create({ name, folder });
    const pages = Array.from(journal.pages).map((p) => p.toObject());
    const createdPages = await targetJournal.createEmbeddedDocuments("JournalEntryPage", pages);
    await journal.delete();
    this.openToPage(createdPages[0].uuid);
  }
  static getKeyFromLi(li) {
    return li.innerText.replace(/\s/g, "").replace(/\./g, "").substring(0, 50);
  }
  static setHooks() {
    if (this._hooksRegistered) return;
    this._hooksRegistered = true;
    Hooks.on("createJournalEntry", (document2, options) => {
      ui.simpleQuest.refresh();
    });
    Hooks.on("deleteJournalEntry", (document2, options) => {
      ui.simpleQuest.refresh();
    });
    Hooks.on("createJournalEntryPage", (document2, options) => {
      ui.simpleQuest.refresh();
    });
    Hooks.on("deleteJournalEntryPage", (document2, options) => {
      ui.simpleQuest.refresh();
    });
    Hooks.on("updateJournalEntry", (document2, updates) => {
      ui.simpleQuest.refresh();
    });
    Hooks.on("preUpdateJournalEntryPage", (document2, updates) => {
      if (updates.text) document2.updateSource({ flags: { [MODULE_ID]: { lastUpdated: Date.now() } } });
    });
    Hooks.on("updateJournalEntryPage", (document2, updates) => {
      ui.simpleQuest.refresh();
      if (updates?.ownership?.default >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) {
        const isLore = ui.simpleQuest.isSimpleQuestPage(document2.uuid) === "lore";
        isLore && showQuestNotification(document2, true, true);
      }
      if (updates?.ownership?.[game.user.id] >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER || updates?.ownership?.default >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
        const isAchievements = ui.simpleQuest.isSimpleQuestPage(document2.uuid) === "achievements";
        !game.user.isGM && isAchievements && showQuestNotification(document2, true, false, true);
      }
      if (updates?.flags?.[MODULE_ID]?.lastUpdated) {
        const isQuest = ui.simpleQuest.isSimpleQuestPage(document2.uuid) === "quests";
        isQuest && showQuestNotification(document2);
      }
    });
    document.addEventListener("click", async (e) => {
      if (!e.target?.classList?.contains("share-quest-button")) return;
      e.preventDefault();
      const uuid = e.target.dataset.uuid;
      ui.simpleQuest.openToPage(uuid);
    });
    Hooks.on("createChatMessage", async (document2, updates) => {
      if (document2.flags?.[MODULE_ID]?.simpleQuestMessage) {
        const page2 = await fromUuid(document2.flags[MODULE_ID].simpleQuestMessage);
        showQuestNotification(page2, true);
      }
    });
    Hooks.on("renderJournalEntryPageTextSheet", (app, html, data) => {
      if (!data.editable) return;
      const journal = app.document.parent;
      if (journal !== STATES.achievements.journal) return;
      const filePickerInput = document.createElement("file-picker");
      filePickerInput.type = "image";
      filePickerInput.name = "src";
      filePickerInput._value = app.document.src || "icons/commodities/treasure/cup-trophy-gold.webp";
      filePickerInput.style.display = "none";
      const imagePreview = document.createElement("img");
      imagePreview.src = app.document.src || "icons/commodities/treasure/cup-trophy-gold.webp";
      imagePreview.style.height = "50px";
      imagePreview.style.maxWidth = "50px";
      imagePreview.style.marginRight = "0.5rem";
      imagePreview.style.cursor = "pointer";
      imagePreview.style.borderRadius = "5px";
      imagePreview.addEventListener("click", async (e) => {
        filePickerInput.button.click();
      });
      filePickerInput.addEventListener("change", async (e) => {
        const image = filePickerInput.value;
        imagePreview.src = image || "icons/commodities/treasure/cup-trophy-gold.webp";
      });
      const colorPicker2 = document.createElement("input");
      colorPicker2.type = "color";
      colorPicker2.name = "flags.foundry-quest-log-ru.color";
      colorPicker2.value = app.document.getFlag(MODULE_ID, "color") || "#000000";
      colorPicker2.style.maxWidth = "50px";
      colorPicker2.style.minHeight = "50px";
      colorPicker2.style.marginRight = "0.5rem";
      const header = html.querySelector(".journal-header .heading-level");
      header.before(filePickerInput, imagePreview, colorPicker2);
    });
  }
};
var ColorHelper = class _ColorHelper {
  constructor(hexColor) {
    this._color = new PIXI.Color(hexColor);
    this.r = this._color.red;
    this.g = this._color.green;
    this.b = this._color.blue;
    this.a = this._color.alpha;
    this._hsl = _ColorHelper.rgbToHsl(this.r, this.g, this.b);
    this.h = this._hsl[0];
    this.s = this._hsl[1];
    this.l = this._hsl[2];
  }
  saturate(n) {
    return _ColorHelper.rgbToHexString(..._ColorHelper.hslToRgb(this.h, Math.min(1, this.s * n), this.l));
  }
  brightness(n) {
    return _ColorHelper.rgbToHexString(..._ColorHelper.hslToRgb(this.h, this.s, Math.min(1, this.l * n)));
  }
  static rgbToHsl(r, g, b) {
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  static hslToRgb(h, s, l) {
    let r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      let hue2rgb = function(p2, q2, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
        if (t < 1 / 2) return q2;
        if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
        return p2;
      };
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
  }
  static rgbToHexString(r, g, b) {
    r *= 255, g *= 255, b *= 255;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).substring(0, 6);
  }
};
var GlobalSearch = class _GlobalSearch {
  constructor(term, journals) {
    this.term = term.toLowerCase();
    this.journals = journals;
    this.textContentIndex = _GlobalSearch.textContentIndex ?? /* @__PURE__ */ new Map();
    if (!_GlobalSearch.textContentIndex || this.expired) this.buildIndex();
  }
  get expired() {
    if (!_GlobalSearch._lastIndex) return true;
    return Date.now() - _GlobalSearch._lastIndex > 12e4;
  }
  async buildIndex() {
    if (_GlobalSearch._indexing) return;
    _GlobalSearch._indexing = true;
    const newIndex2 = /* @__PURE__ */ new Map();
    for (const j of this.journals) {
      const pages = j.pages;
      for (const p of pages) {
        if (!p.isOwner) {
          const perm = ui.simpleQuest.hasPermission(p.uuid);
          if (!perm) continue;
        }
        const el = document.createElement("div");
        el.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(p.text.content, { secrets: game.user.isGM, relativeTo: p, async: true });
        const textContent = el.textContent.toLowerCase();
        newIndex2.set(p, textContent);
      }
    }
    _GlobalSearch.textContentIndex = newIndex2;
    _GlobalSearch._indexing = false;
    _GlobalSearch._lastIndex = Date.now();
  }
  getResults() {
    if (_GlobalSearch._indexing || _GlobalSearch._indexing === void 0) return [{ page: { name: "Indexing" }, bestMatch: "", matchIndex: -1 }];
    const results = [];
    for (const [page2, text] of this.textContentIndex) {
      const matches2 = this.getMatches(text);
      if (matches2.length) {
        matches2.forEach((m) => {
          const start = Math.max(0, m.index - 100);
          const end = Math.min(text.length, m.index + 100);
          let surroundingText = text.substring(start, end);
          const firstSpace = surroundingText.indexOf(" ");
          const lastSpace = surroundingText.lastIndexOf(" ");
          surroundingText = surroundingText.substring(firstSpace, lastSpace);
          surroundingText = surroundingText.trim();
          surroundingText = `...${surroundingText}...`;
          results.push({ page: page2, bestMatch: surroundingText, matchIndex: matches2.indexOf(m) });
        });
      }
      if (results.length > 50) break;
    }
    return results;
  }
  getMatches(text) {
    const matches2 = [];
    const regex = new RegExp(this.term, "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches2.push(match);
    }
    return matches2;
  }
};

// scripts/journalTemplates.js
var TEMPLATE_ICONS = {
  banner: "fad fa-scroll-old",
  character: "fad fa-user",
  "dynamic-columns": "fad fa-columns",
  "image-text-left": "fad fa-image",
  "image-text-right": "fad fa-image",
  location: "fad fa-place-of-worship",
  "boxed-text": "fad fa-paragraph",
  "description-text": "fad fa-text",
  "character-grid-1x2": "fad fa-user",
  "character-grid-1x3": "fad fa-user",
  wiki: "fad fa-book",
  event: "fad fa-calendar",
  custom: "fad fa-file-invoice"
};
async function applyTemplate(t, page2, app) {
  await app.close({ force: true });
  const textContent = page2.text.content;
  const template = await fetch(t).then((r) => r.text());
  const hasImage = template.includes("https://source.unsplash.com/random");
  if (!hasImage) {
    const newContent2 = textContent + "\n" + template;
    await page2.update({ "text.content": newContent2 });
    app.render(true);
    return;
  }
  const matches2 = template.match(/https:\/\/source\.unsplash\.com\/random/g);
  const paths = [];
  for (const match of matches2) {
    const path = await getFile();
    paths.push(path);
  }
  const newTemplate = matches2.reduce((acc, m, i) => {
    return acc.replace(m, paths[i] || m);
  }, template);
  const newContent = textContent + "\n" + newTemplate;
  await page2.update({ "text.content": newContent });
  app.render(true);
}
async function getFile() {
  let resolve;
  const promise = new Promise((r) => resolve = r);
  const picker = new FilePicker({
    type: "image",
    callback: (path) => {
      resolve(path);
    }
  });
  const original = picker.close;
  picker.close = async () => {
    resolve(null);
    await original.bind(picker)();
  };
  picker.browse();
  return promise;
}
function initJournalTemplates() {
  Hooks.on("getHeaderControlsJournalEntryPageProseMirrorSheet", (app, buttons) => {
    buttons.push({
      class: "foundry-quest-log-ru-page-template",
      icon: "fas fa-scroll-old",
      label: game.i18n.localize(`${MODULE_ID}.page-template.label`),
      onClick: async () => {
        const templates = (await FilePicker.browse("data", `modules/${MODULE_ID}/templates/JournalTemplates`)).files;
        let customTemplates = [];
        try {
          customTemplates = (await FilePicker.browse("user", `modules/${MODULE_ID}/storage`, { extensions: [".html"] })).files;
        } catch (error) {
          console.error(error);
          customTemplates = [];
        }
        const buttons2 = templates.concat(customTemplates).map((t) => {
          return {
            label: t.split("/").pop().split(".").slice(0, -1).join(".").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            icon: `<i class="${TEMPLATE_ICONS[t.split("/").pop().split(".").slice(0, -1).join(".")] ?? TEMPLATE_ICONS.custom}"></i>`,
            callback: async () => {
              await applyTemplate(t, app.document, app);
            }
          };
        });
        new Dialog({
          title: game.i18n.localize(`${MODULE_ID}.page-template.label`),
          content: `<p>${game.i18n.localize(`${MODULE_ID}.page-template.description`)}</p>`,
          buttons: buttons2,
          render: (html) => {
            html[0].closest(".app").classList.add("foundry-quest-log-ru-dialog");
            html[0].closest(".app").classList.add("page-template-dialog");
          }
        }).render(true);
      }
    });
  });
}

// scripts/tours.js
function registerTours() {
  game.tours.register(MODULE_ID, "interface", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.interface.name`,
    description: `${MODULE_ID}.tours.interface.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.interface.1`,
        title: `${MODULE_ID}.tours.interface.1.title`,
        content: `${MODULE_ID}.tours.interface.1.content`,
        selector: "#foundry-quest-log-ru .sheet-tabs.tabs"
      },
      {
        id: `${MODULE_ID}.tours.interface.2`,
        title: `${MODULE_ID}.tours.interface.2.title`,
        content: `${MODULE_ID}.tours.interface.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='quests'] .quest-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.interface.3`,
        title: `${MODULE_ID}.tours.interface.3.title`,
        content: `${MODULE_ID}.tours.interface.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='quests'] .quest-details",
        tooltipDirection: "LEFT"
      },
      {
        id: `${MODULE_ID}.tours.interface.4`,
        title: `${MODULE_ID}.tours.interface.4.title`,
        content: `${MODULE_ID}.tours.interface.4.content`,
        selector: "#foundry-quest-log-ru .font-controls"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "lore-tab", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.lore-tab.name`,
    description: `${MODULE_ID}.tours.lore-tab.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.lore-tab.1`,
        title: `${MODULE_ID}.tours.lore-tab.1.title`,
        content: `${MODULE_ID}.tours.lore-tab.1.content`,
        selector: "#foundry-quest-log-ru-tabs",
        tooltipDirection: "UP"
      },
      {
        id: `${MODULE_ID}.tours.lore-tab.2`,
        title: `${MODULE_ID}.tours.lore-tab.2.title`,
        content: `${MODULE_ID}.tours.lore-tab.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='lore'] .quest-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.lore-tab.3`,
        title: `${MODULE_ID}.tours.lore-tab.3.title`,
        content: `${MODULE_ID}.tours.lore-tab.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='lore'] .quest-details",
        tooltipDirection: "LEFT"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "map-tab", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.map-tab.name`,
    description: `${MODULE_ID}.tours.map-tab.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.map-tab.1`,
        title: `${MODULE_ID}.tours.map-tab.1.title`,
        content: `${MODULE_ID}.tours.map-tab.1.content`,
        selector: "#foundry-quest-log-ru-tabs",
        tooltipDirection: "UP"
      },
      {
        id: `${MODULE_ID}.tours.map-tab.2`,
        title: `${MODULE_ID}.tours.map-tab.2.title`,
        content: `${MODULE_ID}.tours.map-tab.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='map'] .maps-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.map-tab.3`,
        title: `${MODULE_ID}.tours.map-tab.3.title`,
        content: `${MODULE_ID}.tours.map-tab.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='map'] .map-details",
        tooltipDirection: "LEFT"
      },
      {
        id: `${MODULE_ID}.tours.map-tab.4`,
        title: `${MODULE_ID}.tours.map-tab.4.title`,
        content: `${MODULE_ID}.tours.map-tab.4.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='map'] .map-details",
        tooltipDirection: "LEFT"
      },
      {
        id: `${MODULE_ID}.tours.map-tab.5`,
        title: `${MODULE_ID}.tours.map-tab.5.title`,
        content: `${MODULE_ID}.tours.map-tab.5.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='map'] .map-details",
        tooltipDirection: "LEFT"
      },
      {
        id: `${MODULE_ID}.tours.map-tab.6`,
        title: `${MODULE_ID}.tours.map-tab.6.title`,
        content: `${MODULE_ID}.tours.map-tab.6.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='map'] .map-details",
        tooltipDirection: "LEFT"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "my-journal-tab", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.my-journal-tab.name`,
    description: `${MODULE_ID}.tours.my-journal-tab.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.my-journal-tab.1`,
        title: `${MODULE_ID}.tours.my-journal-tab.1.title`,
        content: `${MODULE_ID}.tours.my-journal-tab.1.content`,
        selector: "#foundry-quest-log-ru-tabs",
        tooltipDirection: "UP"
      },
      {
        id: `${MODULE_ID}.tours.my-journal-tab.2`,
        title: `${MODULE_ID}.tours.my-journal-tab.2.title`,
        content: `${MODULE_ID}.tours.my-journal-tab.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='my-journal'] .journal-toc-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.my-journal-tab.3`,
        title: `${MODULE_ID}.tours.my-journal-tab.3.title`,
        content: `${MODULE_ID}.tours.my-journal-tab.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='my-journal'] .journal-container",
        tooltipDirection: "LEFT"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "party-journal-tab", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.party-journal-tab.name`,
    description: `${MODULE_ID}.tours.party-journal-tab.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.party-journal-tab.1`,
        title: `${MODULE_ID}.tours.party-journal-tab.1.title`,
        content: `${MODULE_ID}.tours.party-journal-tab.1.content`,
        selector: "#foundry-quest-log-ru-tabs",
        tooltipDirection: "UP"
      },
      {
        id: `${MODULE_ID}.tours.party-journal-tab.2`,
        title: `${MODULE_ID}.tours.party-journal-tab.2.title`,
        content: `${MODULE_ID}.tours.party-journal-tab.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='party-journal'] .journal-toc-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.party-journal-tab.3`,
        title: `${MODULE_ID}.tours.party-journal-tab.3.title`,
        content: `${MODULE_ID}.tours.party-journal-tab.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='party-journal'] .journal-container",
        tooltipDirection: "LEFT"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "journal-page", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.journal-page.name`,
    description: `${MODULE_ID}.tours.journal-page.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.journal-page.1`,
        title: `${MODULE_ID}.tours.journal-page.1.title`,
        content: `${MODULE_ID}.tours.journal-page.1.content`,
        selector: ".foundry-quest-log-ru-page-template",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.journal-page.2`,
        title: `${MODULE_ID}.tours.journal-page.2.title`,
        content: `${MODULE_ID}.tours.journal-page.2.content`,
        selector: ".pm-dropdown.format",
        tooltipDirection: "LEFT"
      }
    ]
  }));
  game.tours.register(MODULE_ID, "timeline-tab", new foundry.nue.Tour({
    title: `${MODULE_ID}.tours.timeline-tab.name`,
    description: `${MODULE_ID}.tours.timeline-tab.description`,
    canBeResumed: false,
    display: true,
    steps: [
      {
        id: `${MODULE_ID}.tours.timeline-tab.1`,
        title: `${MODULE_ID}.tours.timeline-tab.1.title`,
        content: `${MODULE_ID}.tours.timeline-tab.1.content`,
        selector: "#foundry-quest-log-ru-tabs",
        tooltipDirection: "UP"
      },
      {
        id: `${MODULE_ID}.tours.timeline-tab.2`,
        title: `${MODULE_ID}.tours.timeline-tab.2.title`,
        content: `${MODULE_ID}.tours.timeline-tab.2.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='timeline'] .quest-list",
        tooltipDirection: "RIGHT"
      },
      {
        id: `${MODULE_ID}.tours.timeline-tab.3`,
        title: `${MODULE_ID}.tours.timeline-tab.3.title`,
        content: `${MODULE_ID}.tours.timeline-tab.3.content`,
        selector: "#foundry-quest-log-ru .tab[data-tab='timeline'] nav",
        tooltipDirection: "LEFT",
        restricted: true
      }
    ]
  }));
}

// scripts/overrides.js
function applyTOCOverride() {
  JournalEntryPage.buildTOC = function(html, { includeElement = true } = {}) {
    const root = { level: 0, children: [] };
    const stack = [root];
    const searchHeadings = (element) => {
      if (element instanceof HTMLHeadingElement) {
        const node = this._makeHeadingNode(element, { includeElement });
        node.secret = !!element.closest(".secret:not(.revealed)") && !game.user.isGM;
        let parent = stack.at(-1);
        if (node.level <= parent.level) {
          stack.pop();
          parent = stack.at(-1);
        }
        parent.children.push(node);
        stack.push(node);
      }
      for (const child of element.children || []) {
        searchHeadings(child);
      }
    };
    if (Array.isArray(html)) html.forEach(searchHeadings);
    else searchHeadings(html);
    return this._flattenTOC(root.children);
  };
}

// scripts/mindmap.js
var mermaid = null;
var selector = ".mermaid";
async function loadMermaid() {
  const dynamicImport = new Function("url", "return import(url)");
  const esModule = await dynamicImport("https://cdn.jsdelivr.net/npm/mermaid/+esm");
  mermaid = esModule.default;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      primaryColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-background-color"),
      primaryTextColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-text-0"),
      primaryBorderColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-text-4"),
      lineColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-text-4"),
      secondaryColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-background-color"),
      tertiaryColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-background-color")
    }
  });
}
async function setupMermaid() {
  try {
    if (!mermaid) await loadMermaid();
    await mermaid.run({ querySelector: selector });
  } catch (error) {
    console.warn(`${MODULE_ID} | Mermaid \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D, \u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u0439 mindmap`, error);
    ui.notifications?.warn("Mermaid \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0441\u044F. \u0422\u0435\u043A\u0441\u0442 mindmap \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0431\u0435\u0437 \u0432\u0438\u0437\u0443\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438.");
  }
}
function setMermaidHooks() {
  window.runMermaid = setupMermaid;
  Hooks.on("renderJournalPageSheet", (app, html, data) => {
    if (html.find(selector)) {
      setTimeout(() => {
        setupMermaid();
      }, 1);
    }
  });
  Hooks.on(`${MODULE_ID}.onSelectQuest`, (page2, html) => {
    if (html.querySelector(selector)) setupMermaid();
  });
}

// scripts/enrichers.js
function initEnrichers() {
  const questEnricher = (icon) => {
    return (match, content) => {
      let [uuid, heading] = match[1].split("#");
      uuid = fromUuidSync(uuid, { relative: content.relativeTo })?.uuid;
      const name = match[2] || "Quest";
      const a = document.createElement("a");
      a.classList.add("foundry-quest-log-ru-content-link");
      a.draggable = false;
      a.dataset.uuid = uuid;
      a.dataset.id = uuid;
      a.dataset.anchor = heading;
      a.dataset.tooltip = name;
      a.dataset.tooltipDirection = "UP";
      a.innerHTML = `<i class="fas ${uuid ? icon : "fa-link-slash"}"></i>${name}`;
      return a;
    };
  };
  CONFIG.TextEditor.enrichers.push(
    {
      id: MODULE_ID,
      pattern: /@time\[(.*?)\]/g,
      enricher: (match, content) => {
        try {
          const a = document.createElement("a");
          a.classList.add("foundry-quest-log-ru-time");
          a.draggable = false;
          if (!window.SimpleCalendar) {
            a.innerHTML = `<i class="fa-duotone fa-hourglass-start"></i> Simple Calendar Not Installed`;
            return a;
          }
          let time;
          const matchedTime = match[1];
          const isOnlyNumbers = /^\d+$/.test(matchedTime);
          if (isOnlyNumbers) {
            time = parseInt(match[1]);
          } else {
            time = Date.parse(match[1]);
            if (window.SimpleCalendar) {
              const dateTimeParts = matchedTime.split(",");
              const dateParts = dateTimeParts[0].trim().split("/");
              const timeParts = (dateTimeParts[1] || "00:00").trim().split(":");
              const year = parseInt(dateParts[0]);
              const month = parseInt(dateParts[1]) - 1;
              const day = parseInt(dateParts[2]) - 1;
              const hour = parseInt(timeParts[0]);
              const minute = parseInt(timeParts[1]);
              time = window.SimpleCalendar.api.dateToTimestamp({ year, month, day, hour, minute });
            }
          }
          const scDateTime = window.SimpleCalendar.api.timestampToDate(time);
          a.dataset.tooltip = `${scDateTime.display.date} ${scDateTime.display.time}`;
          a.dataset.tooltipDirection = "UP";
          const delta = time - window.SimpleCalendar.api.timestamp();
          if (delta < 0) {
            a.innerHTML = `<i class="fa-duotone fa-hourglass-start"></i> ${game.i18n.localize(`${MODULE_ID}.time-enricher.expired`)}`;
            return a;
          }
          const interval = window.SimpleCalendar.api.secondsToInterval(delta);
          let timeString = ``;
          if (interval.year) timeString += `${interval.year}y `;
          if (interval.month || interval.year) timeString += `${interval.month}m `;
          if (interval.day || interval.month || interval.year) timeString += `${interval.day}d `;
          if (interval.hour || interval.day || interval.month || interval.year) timeString += `${interval.hour}h `;
          if (interval.minute || interval.hour || interval.day || interval.month || interval.year) timeString += `${interval.minute}m `;
          a.innerHTML = `<i class="fa-duotone fa-hourglass-start"></i> ${timeString}`;
          return a;
        } catch (e) {
          console.error(e);
          const a = document.createElement("a");
          a.innerHTML = `<i class="fa-duotone fa-hourglass-start"></i> Error Parsing Time`;
          return a;
        }
      }
    },
    {
      id: MODULE_ID + "-quest",
      pattern: /@QUEST\[(.*?)\]{(.*?)\}/g,
      enricher: questEnricher("fa-scroll-old")
    },
    {
      id: MODULE_ID + "-map",
      pattern: /@MAP\[(.*?)\]{(.*?)\}/g,
      enricher: questEnricher("fa-map")
    },
    {
      id: MODULE_ID + "-lore",
      pattern: /@LORE\[(.*?)\]{(.*?)\}/g,
      enricher: questEnricher("fa-books")
    },
    {
      id: MODULE_ID + "-ttm",
      pattern: /@TTM\[(.*?)\]{(.*?)\}/g,
      enricher: (match, content) => {
        let src = match[1];
        const srcParts = src.split("/");
        if (srcParts[0].includes(".")) src = "https://" + src;
        const titles = match[2].split("|");
        const title = titles[0];
        const displayTitle = titles[1] || "";
        const a = document.createElement("a");
        a.classList.add("foundry-quest-log-ru-ttm");
        a.dataset.src = src;
        if (game.user.isGM) a.dataset.tooltip = displayTitle + `<img src="${src}">`;
        a.dataset.tooltipDirection = "UP";
        a.dataset.title = displayTitle;
        a.draggable = false;
        a.innerHTML = `<i class="fas fa-theater-masks"></i> ${title}`;
        return a;
      }
    },
    {
      id: MODULE_ID + "-counter",
      pattern: /@COUNT\[(.*?)\]{(.*?)\}/g,
      enricher: (match, content) => {
        const id = match[1];
        const count = parseInt(match[2]);
        const page2 = content.relativeTo;
        const flag = page2.getFlag(MODULE_ID, "counters") ?? {};
        const value = flag[id] ?? 0;
        const a = document.createElement("a");
        a.classList.add("foundry-quest-log-ru-counter");
        a.dataset.uuid = page2.uuid;
        a.dataset.id = id;
        a.dataset.count = count;
        a.draggable = false;
        a.innerHTML = `(${value} / ${count})`;
        return a;
      }
    },
    {
      id: MODULE_ID + "-counter-rep",
      pattern: /@REPUTATION\[(.*?)\]{(.*?)\}/g,
      enricher: (match, content) => {
        let [id, color, fa] = match[1].split(",");
        const isBar = id.includes("$bar");
        if (isBar) {
          id = id.replace("$bar", "");
        }
        if (!isBar && fa && !fa.trim().includes(" ")) fa = `fas fa-${fa.trim()}`;
        let [min, max] = match[2].split(",");
        if (!max) {
          max = min;
          min = 0;
        }
        min = parseInt(min);
        max = parseInt(max);
        const count = max;
        const page2 = content.relativeTo;
        const flag = page2.getFlag(MODULE_ID, "counters") ?? {};
        const value = flag[id] ?? 0;
        const repContainer = document.createElement("div");
        repContainer.classList.add("foundry-quest-log-ru-counter");
        repContainer.classList.add("reputation-container");
        repContainer.dataset.uuid = page2.uuid;
        repContainer.dataset.id = id;
        repContainer.dataset.count = count;
        repContainer.dataset.min = min;
        repContainer.dataset.tooltip = `${value} / ${count}`;
        repContainer.draggable = false;
        if (isBar) {
          const rep = document.createElement("div");
          rep.classList.add("reputation-bar");
          const percentage = (value - min) / (max - min);
          rep.style.width = `${percentage * 100}%`;
          const startGradientColor = "rgb(255, 0, 0)";
          const endGradientColor = `rgb(${percentage < 0.5 ? 255 : Math.floor(255 - (percentage - 0.5) * 2 * 255)}, ${percentage > 0.5 ? 255 : Math.floor(percentage * 2 * 255)}, 0)`;
          if (color && fa) {
            const color1 = getRGBfromCSSColor(color);
            const color2 = getRGBfromCSSColor(fa);
            const interpolatedColor = `rgb(${Math.floor(lerp(color1.r, color2.r, percentage))}, ${Math.floor(lerp(color1.g, color2.g, percentage))}, ${Math.floor(lerp(color1.b, color2.b, percentage))})`;
            const customGradient = `linear-gradient(to right, ${color}, ${interpolatedColor})`;
            color = customGradient;
          }
          rep.style.background = color || `linear-gradient(to right, ${startGradientColor}, ${endGradientColor})`;
          repContainer.appendChild(rep);
          const barText = `${value} / ${count}`;
          const i = document.createElement("i");
          i.classList.add("reputation-bar-text");
          i.innerText = barText;
          const i2 = document.createElement("i");
          i2.classList.add("reputation-bar-text");
          i2.classList.add("overlay-text");
          i2.innerText = barText;
          repContainer.appendChild(i);
          repContainer.appendChild(i2);
        } else {
          for (let i = min; i < max; i++) {
            const rep = fa ? document.createElement("i") : document.createElement("div");
            rep.classList.add("reputation-point");
            if (fa) rep.classList.add(...fa.split(" "), "is-fontawesome");
            const percentage = (i - min) / (max - min);
            const pipColor = color || `rgb(${percentage < 0.5 ? 255 : Math.floor(255 - (percentage - 0.5) * 2 * 255)}, ${percentage > 0.5 ? 255 : Math.floor(percentage * 2 * 255)}, 0)`;
            rep.style.setProperty("--reputation-color", i < value ? pipColor : "inherit");
            if (i < value) {
              rep.classList.add("active");
              if (!fa) rep.style.backgroundColor = pipColor;
            }
            repContainer.appendChild(rep);
          }
        }
        return repContainer;
      }
    }
  );
}
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}
function getRGBfromCSSColor(color) {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computedColor = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const matchRGB = computedColor.match(/\d+/g);
  return { r: parseInt(matchRGB[0]), g: parseInt(matchRGB[1]), b: parseInt(matchRGB[2]) };
}

// scripts/autoImport.js
var AUTO_IMPORT_STRING = "SimpleQuestAutoImport$";
function initAutoImport() {
  if (!game.user.isGM) return;
  Hooks.on("createJournalEntry", (journal) => {
    if (journal.pack || !journal.name.startsWith(AUTO_IMPORT_STRING)) return;
    const [name, silent] = journal.name.replace(AUTO_IMPORT_STRING, "").split("|");
    ui.simpleQuest.importQuests(journal, name, { silent: silent === "silent" });
  });
}

// scripts/rusthengePreset.js
var PRESET_FLAG = "rusthengePreset";
var PRESET_VERSION = "1";
var MAP_FLAG = "rusthengeSceneKey";
var PLAYER = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER };
var GM_ONLY = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
var page = (name, content, { hidden = false, ownership = PLAYER } = {}) => ({
  name,
  type: "text",
  ownership,
  "text.content": content,
  flags: {
    [MODULE_ID]: {
      [PRESET_FLAG]: PRESET_VERSION,
      ...hidden ? { hidden: true } : {}
    }
  }
});
var QUEST_JOURNALS = [
  {
    name: "\u041F\u0440\u043E\u043B\u043E\u0433 \u0438 \u0433\u043B\u0430\u0432\u0430 1",
    pages: [
      page("\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436 \u2014 \u043D\u0430\u0447\u0430\u043B\u043E \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F", `<p>\u0412\u044B \u043F\u0440\u0438\u0431\u044B\u043B\u0438 \u0432 \u0442\u0438\u0445\u0443\u044E \u0440\u044B\u0431\u0430\u0446\u043A\u0443\u044E \u0434\u0435\u0440\u0435\u0432\u043D\u044E \u0411\u0443\u0445\u0442\u0430 \u0421\u043A\u043E\u043F\u044B \u043D\u0430 \u0441\u0435\u0432\u0435\u0440\u043D\u043E\u043C \u043F\u043E\u0431\u0435\u0440\u0435\u0436\u044C\u0435 \u0412\u0430\u0440\u0438\u0441\u0438\u0438. \u041D\u043E\u0447\u043D\u043E\u0439 \u0448\u0442\u043E\u0440\u043C \u043F\u0440\u0438\u043D\u043E\u0441\u0438\u0442 \u043A \u0435\u0451 \u0431\u0435\u0440\u0435\u0433\u0443 \u0443\u043C\u0438\u0440\u0430\u044E\u0449\u0435\u0433\u043E \u0433\u043E\u043D\u0446\u0430 \u0441 \u043F\u0440\u043E\u0441\u044C\u0431\u043E\u0439 \u043E \u043F\u043E\u043C\u043E\u0449\u0438. \u0415\u0433\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u043B\u043E\u0432\u0430 \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u043D\u0430 \u0416\u0435\u043B\u0435\u0437\u043D\u0443\u044E \u0413\u0430\u0432\u0430\u043D\u044C \u2014 \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0432\u043D\u0435\u0437\u0430\u043F\u043D\u043E \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043B\u043E \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u0441\u043E\u0441\u0435\u0434\u044F\u043C.</p>
<h2>\u0427\u0442\u043E \u043F\u0440\u0435\u0434\u0441\u0442\u043E\u0438\u0442 \u0441\u0434\u0435\u043B\u0430\u0442\u044C</h2><ul><li>\u0412\u044B\u044F\u0441\u043D\u0438\u0442\u044C, \u043A\u0442\u043E \u043F\u043E\u0441\u043B\u0430\u043B \u0433\u043E\u043D\u0446\u0430 \u0438 \u043F\u043E\u0447\u0435\u043C\u0443 \u043E\u043D \u043F\u043E\u0433\u0438\u0431.</li><li>\u0414\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F \u0434\u043E \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438 \u0438 \u043F\u043E\u043C\u043E\u0447\u044C \u0435\u0451 \u0436\u0438\u0442\u0435\u043B\u044F\u043C.</li><li>\u041D\u0430\u0439\u0442\u0438 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0441\u0442\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u044B \u0438 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u0435\u0445, \u043A\u0442\u043E \u0435\u0451 \u0440\u0430\u0441\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u044F\u0435\u0442.</li></ul>
<h2>\u0414\u043B\u044F \u0438\u0433\u0440\u043E\u043A\u043E\u0432</h2><p>\u041F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u043D\u0430 1-\u043C \u0443\u0440\u043E\u0432\u043D\u0435 \u0438 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043D\u0430 4-\u043C. \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0431\u044B\u0442\u044C \u043C\u0435\u0441\u0442\u043D\u044B\u043C\u0438 \u0436\u0438\u0442\u0435\u043B\u044F\u043C\u0438, \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u0430\u043C\u0438, \u0437\u043D\u0430\u043A\u043E\u043C\u044B\u043C\u0438 \u0433\u043E\u043D\u0446\u0430 \u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F\u043C\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u0438\u043B\u0430 \u0431\u0443\u0440\u044F.</p>`),
      page("\u0413\u043B\u0430\u0432\u0430 1 \u2014 \u041F\u043E\u0441\u043B\u0430\u043D\u0438\u0435 \u0432 \u043D\u043E\u0447\u0438", `<p>\u0421\u043B\u0435\u0434 \u0432\u0435\u0434\u0451\u0442 \u043E\u0442 \u0411\u0443\u0445\u0442\u044B \u0421\u043A\u043E\u043F\u044B \u043A \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438. \u041F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0436\u0438\u043B\u043E \u043D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u0435, \u0430 \u0435\u0433\u043E \u0445\u0440\u0430\u043C \u0413\u043E\u0440\u0443\u043C\u0430 \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u0432 \u0440\u0443\u043A\u0430\u0445 \u0436\u0435\u0441\u0442\u043E\u043A\u043E\u0433\u043E \u043A\u0443\u043B\u044C\u0442\u0430.</p>
<h2>\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0446\u0435\u043B\u044C</h2><ul><li>\u0414\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F \u0434\u043E \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438 \u0438 \u043D\u0430\u0439\u0442\u0438 \u0432\u044B\u0436\u0438\u0432\u0448\u0438\u0445.</li><li>\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E \u043D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u0438 \u0438 \u043F\u0440\u043E\u043F\u0430\u0432\u0448\u0438\u0445 \u0436\u0438\u0442\u0435\u043B\u044F\u0445.</li><li>\u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C \u0438 \u043F\u0440\u0435\u043A\u0440\u0430\u0442\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043A\u0443\u043B\u044C\u0442\u0438\u0441\u0442\u043E\u0432.</li><li>\u041D\u0430\u0439\u0442\u0438 \u043F\u0443\u0442\u044C \u043A \u0434\u0440\u0435\u0432\u043D\u0438\u043C \u0440\u0436\u0430\u0432\u044B\u043C \u0440\u0443\u0438\u043D\u0430\u043C.</li></ul>
<h2>\u0418\u0442\u043E\u0433 \u0433\u043B\u0430\u0432\u044B</h2><p>\u041F\u0435\u0440\u0435\u0434 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0430 \u0433\u0435\u0440\u043E\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C 2-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</p>`)
    ]
  },
  {
    name: "\u0413\u043B\u0430\u0432\u0430 2 \u2014 \u0420\u0436\u0430\u0432\u044B\u0435 \u0440\u0443\u0438\u043D\u044B",
    pages: [
      page("\u0413\u043B\u0430\u0432\u0430 2 \u2014 \u0420\u0436\u0430\u0432\u044B\u0435 \u0440\u0443\u0438\u043D\u044B", `<p>\u0420\u0430\u0441\u043A\u0440\u044B\u0432 \u0442\u0430\u0439\u043D\u0443 \u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C\u0430, \u0433\u0435\u0440\u043E\u0438 \u0441\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436 \u2014 \u0434\u0440\u0435\u0432\u043D\u0438\u0439 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441 \u043F\u043E\u0434 \u0440\u0436\u0430\u0432\u044B\u043C\u0438 \u043C\u043E\u043D\u043E\u043B\u0438\u0442\u0430\u043C\u0438. \u0417\u0434\u0435\u0441\u044C \u043A\u0443\u043B\u044C\u0442 \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u0434\u0430\u0432\u043D\u043E \u043F\u043E\u0433\u0438\u0431\u0448\u0435\u0433\u043E \u043F\u043E\u0432\u0435\u043B\u0438\u0442\u0435\u043B\u044F \u0434\u0435\u043C\u043E\u043D\u043E\u0432.</p>
<h2>\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0446\u0435\u043B\u044C</h2><ul><li>\u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u043D\u0430\u0437\u0435\u043C\u043D\u044B\u0435 \u0440\u0443\u0438\u043D\u044B \u0438 \u043F\u0435\u0440\u0432\u044B\u0439 \u043F\u043E\u0434\u0437\u0435\u043C\u043D\u044B\u0439 \u044D\u0442\u0430\u0436.</li><li>\u041D\u0430\u0439\u0442\u0438 \u0437\u0430\u043F\u0438\u0441\u0438 \u0438 \u0441\u043B\u0435\u0434\u044B, \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u044E\u0449\u0438\u0435 \u0437\u0430\u043C\u044B\u0441\u0435\u043B \u043A\u0443\u043B\u044C\u0442\u0430.</li><li>\u041E\u0441\u043B\u0430\u0431\u0438\u0442\u044C \u0440\u0435\u0441\u0443\u0440\u0441\u044B \u043A\u0443\u043B\u044C\u0442\u0438\u0441\u0442\u043E\u0432 \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0443\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435.</li><li>\u0423\u0437\u043D\u0430\u0442\u044C, \u0433\u0434\u0435 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0440\u0438\u0442\u0443\u0430\u043B.</li></ul>
<h2>\u0418\u0442\u043E\u0433 \u0433\u043B\u0430\u0432\u044B</h2><p>\u041F\u0435\u0440\u0435\u0434 \u0441\u043F\u0443\u0441\u043A\u043E\u043C \u0432 \u0445\u0440\u0430\u043C \u041A\u0441\u0430\u0440-\u0410\u0437\u043C\u0430\u043A\u0430 \u0433\u0435\u0440\u043E\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C 3-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u0413\u043B\u0430\u0432\u0430 3 \u2014 \u0412\u043E\u0441\u043A\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u044B",
    pages: [
      page("\u0413\u043B\u0430\u0432\u0430 3 \u2014 \u0412\u043E\u0441\u043A\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u044B", `<p>\u041A\u0443\u043B\u044C\u0442\u0438\u0441\u0442\u044B \u043F\u043E\u0447\u0442\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B\u0438 \u0440\u0438\u0442\u0443\u0430\u043B. \u0413\u0435\u0440\u043E\u044F\u043C \u043D\u0443\u0436\u043D\u043E \u043F\u0440\u043E\u0431\u0438\u0442\u044C\u0441\u044F \u043A \u0433\u0440\u0430\u043D\u0438\u0446\u0435 \u0422\u0451\u043C\u043D\u044B\u0445 \u0437\u0435\u043C\u0435\u043B\u044C, \u0440\u0430\u0437\u0440\u0443\u0448\u0438\u0442\u044C \u0435\u0433\u043E \u043E\u043F\u043E\u0440\u044B \u0438 \u043D\u0435 \u0434\u0430\u0442\u044C \u0434\u0440\u0435\u0432\u043D\u0435\u043C\u0443 \u0437\u043B\u0443 \u0432\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0432 \u043C\u0438\u0440.</p>
<h2>\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0446\u0435\u043B\u044C</h2><ul><li>\u041D\u0430\u0439\u0442\u0438 \u0432\u0445\u043E\u0434 \u0432 \u0433\u043B\u0443\u0431\u0438\u043D\u044B \u043F\u043E\u0434 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0435\u043C.</li><li>\u0412\u044B\u044F\u0432\u0438\u0442\u044C \u0438 \u043E\u0441\u043B\u0430\u0431\u0438\u0442\u044C \u043E\u043F\u043E\u0440\u044B \u0440\u0438\u0442\u0443\u0430\u043B\u0430.</li><li>\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F \u043A\u0443\u043B\u044C\u0442\u0430.</li><li>\u041D\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0432\u043E\u0441\u043A\u0440\u0435\u0448\u0435\u043D\u0438\u044F \u041A\u0441\u0430\u0440-\u0410\u0437\u043C\u0430\u043A\u0430.</li></ul>
<h2>\u0424\u0438\u043D\u0430\u043B</h2><p>\u0417\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0433\u0435\u0440\u043E\u0438 \u043F\u043E\u043B\u0443\u0447\u0430\u044E\u0442 4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0432\u0435\u0434\u0443\u0449\u0435\u0433\u043E",
    pages: [
      page("\u0412\u0435\u0434\u0435\u043D\u0438\u0435 \xAB\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0430\xBB", `<p><strong>\u041F\u043E\u0440\u044F\u0434\u043E\u043A \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438.</strong> \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0434\u0443\u043B\u044C <em>Pathfinder Adventure: Rusthenge</em> \u0438 \u0435\u0433\u043E \u0440\u0443\u0441\u0441\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434, \u0437\u0430\u0442\u0435\u043C \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0432 \u0447\u0438\u0441\u0442\u044B\u0439 \u043C\u0438\u0440. PF2e Journal \u0434\u043E\u0431\u0430\u0432\u0438\u0442 \u0441\u044E\u0434\u0430 \u043A\u0432\u0435\u0441\u0442\u044B, \u043B\u043E\u0440, \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u0448\u043A\u0430\u043B\u0443 \u0438 \u043A\u043E\u043F\u0438\u0438 \u0444\u043E\u043D\u043E\u0432 \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u0441\u0446\u0435\u043D \u0434\u043B\u044F \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \xAB\u041A\u0430\u0440\u0442\u044B\xBB.</p>
<h2>\u041F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</h2><ol><li>\u0413\u043B\u0430\u0432\u0430 1: \u0411\u0443\u0445\u0442\u0430 \u0421\u043A\u043E\u043F\u044B \u2192 \u0416\u0435\u043B\u0435\u0437\u043D\u0430\u044F \u0413\u0430\u0432\u0430\u043D\u044C \u2192 \u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C. \u041F\u043E\u0441\u043B\u0435 \u043D\u0435\u0451 \u0434\u0430\u0439\u0442\u0435 2-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</li><li>\u0413\u043B\u0430\u0432\u0430 2: \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436 \u0438 \u0432\u0435\u0440\u0445\u043D\u0438\u0435 \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u044C\u044F. \u041F\u0435\u0440\u0435\u0434 \u0445\u0440\u0430\u043C\u043E\u043C \u0434\u0430\u0439\u0442\u0435 3-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</li><li>\u0413\u043B\u0430\u0432\u0430 3: \u0422\u0451\u043C\u043D\u044B\u0435 \u0437\u0435\u043C\u043B\u0438, \u0440\u0438\u0442\u0443\u0430\u043B \u0438 \u0444\u0438\u043D\u0430\u043B. \u041F\u043E\u0441\u043B\u0435 \u043D\u0435\u0433\u043E \u2014 4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C.</li></ol>
<h2>\u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B</h2><p>@UUID[JournalEntry.pf2sa06401frontm]{\u0412\u0432\u043E\u0434\u043D\u0430\u044F \u0447\u0430\u0441\u0442\u044C} \xB7 @UUID[JournalEntry.pf2sa06402messag]{\u0413\u043B\u0430\u0432\u0430 1} \xB7 @UUID[JournalEntry.pf2sa06403therus]{\u0413\u043B\u0430\u0432\u0430 2} \xB7 @UUID[JournalEntry.pf2sa06404ressur]{\u0413\u043B\u0430\u0432\u0430 3}</p>
<p>\u0412\u0441\u0435 \u043A\u0430\u0440\u0442\u044B \u0441\u043E\u0437\u0434\u0430\u044E\u0442\u0441\u044F \u0441\u043A\u0440\u044B\u0442\u044B\u043C\u0438, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u043F\u043B\u0430\u043D \u043B\u043E\u043A\u0430\u0446\u0438\u0438 \u0440\u0430\u043D\u044C\u0448\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438. \u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u043D\u0443\u0436\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u0443 \u0438\u0433\u0440\u043E\u043A\u0430\u043C \u0447\u0435\u0440\u0435\u0437 \u0437\u043D\u0430\u0447\u043E\u043A \u0433\u043B\u0430\u0437\u0430 \u0432\u043E \u0432\u043A\u043B\u0430\u0434\u043A\u0435 \xAB\u041A\u0430\u0440\u0442\u044B\xBB.</p>`, { hidden: true, ownership: GM_ONLY })
    ]
  }
];
var LORE_JOURNALS = [
  {
    name: "\u041B\u043E\u043A\u0430\u0446\u0438\u0438",
    pages: [
      page("\u0411\u0443\u0445\u0442\u0430 \u0421\u043A\u043E\u043F\u044B", `<p>\u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0440\u044B\u0431\u0430\u0446\u043A\u0430\u044F \u0434\u0435\u0440\u0435\u0432\u043D\u044F \u043D\u0430 \u0441\u0435\u0432\u0435\u0440\u043D\u043E\u043C \u043F\u043E\u0431\u0435\u0440\u0435\u0436\u044C\u0435 \u0412\u0430\u0440\u0438\u0441\u0438\u0438. \u041E\u0442\u0441\u044E\u0434\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u043F\u0443\u0442\u044C \u0433\u0435\u0440\u043E\u0435\u0432: \u0448\u0442\u043E\u0440\u043C \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u0431\u0435\u0440\u0435\u0433 \u0443\u043C\u0438\u0440\u0430\u044E\u0449\u0435\u0433\u043E \u0433\u043E\u043D\u0446\u0430 \u0441 \u043F\u0440\u043E\u0441\u044C\u0431\u043E\u0439 \u043E \u043F\u043E\u043C\u043E\u0449\u0438.</p>`),
      page("\u0416\u0435\u043B\u0435\u0437\u043D\u0430\u044F \u0413\u0430\u0432\u0430\u043D\u044C", `<p>\u041F\u0440\u0438\u0431\u0440\u0435\u0436\u043D\u043E\u0435 \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043B\u043E \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u0441\u043E\u0441\u0435\u0434\u044F\u043C \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0434\u0430\u0432\u043D\u0435\u0439 \u0431\u0435\u0434\u044B. \u0415\u0433\u043E \u0436\u0438\u0442\u0435\u043B\u0438 \u043D\u0443\u0436\u0434\u0430\u044E\u0442\u0441\u044F \u0432 \u043F\u043E\u043C\u043E\u0449\u0438, \u0430 \u0441\u043B\u0435\u0434\u044B \u043D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u044F \u0432\u0435\u0434\u0443\u0442 \u043A \u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C\u0443.</p>`),
      page("\u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C", `<p>\u0411\u044B\u0432\u0448\u0430\u044F \u043A\u0440\u0435\u043F\u043E\u0441\u0442\u044C \u0438 \u0445\u0440\u0430\u043C \u0413\u043E\u0440\u0443\u043C\u0430 \u0432 \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438. \u0421\u0435\u0439\u0447\u0430\u0441 \u0437\u0434\u0435\u0441\u044C \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0443\u0433\u0440\u043E\u0437\u044B \u0434\u043B\u044F \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u044F.</p>`, { hidden: true }),
      page("\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436", `<p>\u0414\u0440\u0435\u0432\u043D\u0438\u0435 \u0440\u0436\u0430\u0432\u044B\u0435 \u043C\u043E\u043D\u043E\u043B\u0438\u0442\u044B \u0438 \u0441\u043A\u0440\u044B\u0442\u044B\u0439 \u043F\u043E\u0434 \u043D\u0438\u043C\u0438 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441. \u0418\u043C\u0435\u043D\u043D\u043E \u0437\u0434\u0435\u0441\u044C \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0441\u0435\u0440\u0434\u0446\u0435 \u0437\u0430\u043C\u044B\u0441\u043B\u0430 \u043A\u0443\u043B\u044C\u0442\u0438\u0441\u0442\u043E\u0432.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u041D\u041F\u0421",
    pages: [
      page("\u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 \u041E\u0440\u0434\u0432\u0438", `<p>\u0423\u0432\u0430\u0436\u0430\u0435\u043C\u0430\u044F \u0441\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 \u0411\u0443\u0445\u0442\u044B \u0421\u043A\u043E\u043F\u044B. \u041E\u043D\u0430 \u043E\u0431\u0435\u0441\u043F\u043E\u043A\u043E\u0435\u043D\u0430 \u0441\u0443\u0434\u044C\u0431\u043E\u0439 \u0441\u043E\u0441\u0435\u0434\u0435\u0439 \u0438 \u043C\u043E\u0436\u0435\u0442 \u043D\u0430\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0433\u0435\u0440\u043E\u0435\u0432 \u043A \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438.</p>`),
      page("\u0411\u043B\u0430\u043D\u0442\u043E\u043D", `<p>\u0413\u043E\u043D\u0435\u0446, \u043F\u0440\u0438\u0431\u044B\u0432\u0448\u0438\u0439 \u0432 \u0411\u0443\u0445\u0442\u0443 \u0421\u043A\u043E\u043F\u044B \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0448\u0442\u043E\u0440\u043C\u0430. \u0415\u0433\u043E \u043F\u043E\u0441\u043B\u0430\u043D\u0438\u0435 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u0435\u0440\u0432\u043E\u0439 \u043D\u0438\u0442\u044C\u044E \u0440\u0430\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F.</p>`),
      page("\u041C\u0435\u0439\u0442\u0440\u0435\u043C\u0430\u0440", `<p>\u041F\u0440\u0435\u0434\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u043A\u0443\u043B\u044C\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0438\u0449\u0435\u0442 \u0441\u043F\u043E\u0441\u043E\u0431 \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0434\u0440\u0435\u0432\u043D\u044E\u044E \u0441\u0438\u043B\u0443 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0430.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
    pages: [
      page("\u0410\u0434\u0435\u043F\u0442\u044B \u0420\u0436\u0430\u0432\u0447\u0438\u043D\u044B", `<p>\u0422\u0430\u0439\u043D\u044B\u0439 \u043A\u0443\u043B\u044C\u0442, \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0439 \u0441 \u0434\u0440\u0435\u0432\u043D\u0435\u0439 \u0442\u0430\u0441\u0441\u0438\u043B\u043E\u043D\u0441\u043A\u043E\u0439 \u043C\u0430\u0433\u0438\u0435\u0439, \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u043E\u0439 \u0438 \u0440\u0430\u0437\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C. \u0415\u0433\u043E \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0442 \u0432 \u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0413\u0430\u0432\u0430\u043D\u0438 \u0438 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0435.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F",
    pages: [
      page("\u041A\u0441\u0430\u0440-\u0410\u0437\u043C\u0430\u043A", `<p>\u0414\u0430\u0432\u043D\u043E \u043F\u043E\u0433\u0438\u0431\u0448\u0438\u0439 \u043F\u043E\u0432\u0435\u043B\u0438\u0442\u0435\u043B\u044C \u0434\u0435\u043C\u043E\u043D\u043E\u0432, \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0439 \u0441 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u043E\u0439, \u0440\u0430\u0437\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C \u0438 \u0441\u043C\u0435\u0440\u0442\u044C\u044E. \u041A\u0443\u043B\u044C\u0442 \u043F\u044B\u0442\u0430\u0435\u0442\u0441\u044F \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0435\u0433\u043E \u0441\u0438\u043B\u0443 \u0432 \u043C\u0438\u0440.</p>`, { hidden: true }),
      page("\u041F\u043E\u043B\u0437\u0443\u0447\u0430\u044F \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u0430", `<p>\u0421\u0432\u0435\u0440\u0445\u044A\u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0431\u043E\u043B\u0435\u0437\u043D\u044C, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043E\u0441\u043B\u0430\u0431\u043B\u044F\u0435\u0442 \u0436\u0438\u0432\u044B\u0445 \u0441\u0443\u0449\u0435\u0441\u0442\u0432 \u0438 \u043F\u043E\u0440\u0442\u0438\u0442 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435. \u0415\u0441\u043B\u0438 \u044D\u0442\u0430 \u0442\u0435\u043C\u0430 \u043D\u0435\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u0430 \u0433\u0440\u0443\u043F\u043F\u0435, \u0432\u0435\u0434\u0443\u0449\u0438\u0439 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0435\u0451 \u043A\u0430\u043A \u043F\u0440\u043E\u043A\u043B\u044F\u0442\u0438\u0435, \u044F\u0434 \u0438\u043B\u0438 \u044D\u0444\u0444\u0435\u043A\u0442 \u0442\u0440\u0430\u043D\u0441\u043C\u0443\u0442\u0430\u0446\u0438\u0438.</p>`, { hidden: true })
    ]
  },
  {
    name: "\u0411\u0435\u0441\u0442\u0438\u0430\u0440\u0438\u0439",
    pages: [
      page("\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\u0430", `<p>\u0412 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u044E\u0442\u0441\u044F \u043A\u0443\u043B\u044C\u0442\u0438\u0441\u0442\u044B, \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043F\u043E\u0434\u0437\u0435\u043C\u0435\u043B\u0438\u0439 \u0438 \u043C\u0430\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0430\u043A\u0442\u0451\u0440\u043E\u0432 \u0438\u0437 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E Rusthenge: \u0432 \u043D\u0438\u0445 \u0443\u0436\u0435 \u043D\u0430\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0442\u043E\u0447\u043D\u044B\u0435 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438 \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 PF2e.</p>`, { hidden: true, ownership: GM_ONLY })
    ]
  }
];
var timelineEvent = (name, year, content) => ({
  ...page(name, `<p>${content}</p>`, { hidden: year > 0 }),
  flags: {
    [MODULE_ID]: {
      [PRESET_FLAG]: PRESET_VERSION,
      ...year > 0 ? { hidden: true } : {},
      timeline: { year, color: "#8a3d22", label: "\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436" }
    }
  }
});
var TIMELINE_PAGES = [
  {
    name: "\u041F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \xAB\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436\xBB",
    type: "text",
    ownership: PLAYER,
    "text.content": "<p>\u041A\u043E\u0440\u043E\u0442\u043A\u0430\u044F \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0448\u043A\u0430\u043B\u0430 \u0434\u043B\u044F \u043E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u044F \u0445\u043E\u0434\u0430 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F. \u041D\u043E\u043C\u0435\u0440\u0430 \u0434\u043D\u0435\u0439 \u0443\u0441\u043B\u043E\u0432\u043D\u044B: \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u0438\u0445 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0441\u043E\u0431\u044B\u0442\u0438\u044F.</p>",
    flags: { [MODULE_ID]: { [PRESET_FLAG]: PRESET_VERSION, timeline: { isEra: true, eraStart: 0, eraEnd: 3, color: "#8a3d22", label: "\u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436" } } }
  },
  timelineEvent("\u041D\u043E\u0447\u043D\u043E\u0439 \u0448\u0442\u043E\u0440\u043C", 0, "\u0413\u043E\u043D\u0435\u0446 \u043F\u0440\u0438\u0431\u044B\u0432\u0430\u0435\u0442 \u0432 \u0411\u0443\u0445\u0442\u0443 \u0421\u043A\u043E\u043F\u044B; \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0440\u0430\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435."),
  timelineEvent("\u0416\u0435\u043B\u0435\u0437\u043D\u0430\u044F \u0413\u0430\u0432\u0430\u043D\u044C", 1, "\u0413\u0435\u0440\u043E\u0438 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u044E\u0442 \u0443\u0433\u0440\u043E\u0437\u0443 \u0432 \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0438 \u0438 \u0421\u0442\u043E\u0443\u043D\u0445\u043E\u0443\u043C\u0435."),
  timelineEvent("\u0420\u0436\u0430\u0432\u044B\u0435 \u0440\u0443\u0438\u043D\u044B", 2, "\u042D\u043A\u0441\u043F\u0435\u0434\u0438\u0446\u0438\u044F \u0441\u043F\u0443\u0441\u043A\u0430\u0435\u0442\u0441\u044F \u0432 \u0420\u0430\u0441\u0442\u0445\u0435\u043D\u0434\u0436."),
  timelineEvent("\u0424\u0438\u043D\u0430\u043B \u0440\u0438\u0442\u0443\u0430\u043B\u0430", 3, "\u0420\u0435\u0448\u0430\u0435\u0442\u0441\u044F \u0441\u0443\u0434\u044C\u0431\u0430 \u0440\u0438\u0442\u0443\u0430\u043B\u0430 \u0438 \u041A\u0441\u0430\u0440-\u0410\u0437\u043C\u0430\u043A\u0430.")
];
async function ensureJournal(folder, name) {
  return Array.from(game.journal).find((journal) => journal.folder === folder && journal.name === name) ?? JournalEntry.create({ name, folder: folder.id, ownership: GM_ONLY });
}
async function ensurePages(journal, pages) {
  const missing = pages.filter((definition) => !Array.from(journal.pages).some((existing) => existing.getFlag(MODULE_ID, PRESET_FLAG) === PRESET_VERSION && existing.name === definition.name));
  if (missing.length) await journal.createEmbeddedDocuments("JournalEntryPage", missing);
}
async function removeLegacyDemoContent(questFolder, loreFolder) {
  const names = /* @__PURE__ */ new Set(["Welcome to Simple Quest!", "Welcome to the Lore tab!"]);
  for (const journal of Array.from(game.journal)) {
    if (journal.folder !== questFolder && journal.folder !== loreFolder) continue;
    const demoPages = Array.from(journal.pages).filter((document2) => names.has(document2.name));
    if (demoPages.length) await journal.deleteEmbeddedDocuments("JournalEntryPage", demoPages.map((document2) => document2.id));
  }
}
async function installRusthengePreset() {
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
async function syncRusthengeMaps() {
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
        measure: scene.dimensions?.distancePixels ? `${100 / scene.dimensions.distancePixels}${scene.grid.units}` : "1mi"
      }
    }
  })));
}

// scripts/main.js
var MODULE_ID = "foundry-quest-log-ru";
function toggleJournal() {
  try {
    ui.simpleQuest ??= new SimpleQuest();
    ui.simpleQuest.toggle();
    return true;
  } catch (error) {
    console.error(`${MODULE_ID} | \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B`, error);
    ui.notifications?.error(game.i18n.localize(`${MODULE_ID}.notifications.openFailed`));
    return false;
  }
}
initJournalTemplates();
Hooks.on("setup", () => {
  registerSettings();
  initConfig();
  Socket.register("openToPage", ({ uuid }) => {
    ui.simpleQuest.openToPage(uuid);
  });
});
Hooks.on("init", () => {
  game.keybindings.register(MODULE_ID, "toggleSimpleQuest", {
    name: `${MODULE_ID}.hotkeys.toggleSimpleQuest.name`,
    editable: [{ key: "KeyJ" }],
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
    repeat: false,
    onDown: toggleJournal
  });
  setMermaidHooks();
  applyTOCOverride();
});
Hooks.on("ready", () => {
  registerTours();
  registerOnReadySettings();
  showWelcomeScreen();
  setTTM();
  initAutoImport();
  const isFirstConnectedGM = game.users.find((u) => u.isGM && u.active) === game.user;
  if (isFirstConnectedGM) {
    void (async () => {
      await createDefaultStructure();
      await installRusthengePreset();
    })();
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
      const page2 = fromUuidSync(uuid);
      if (!page2.isOwner) return;
      const flag = page2.getFlag(MODULE_ID, "counters") ?? {};
      const value = flag[id] ?? 0;
      const count = parseInt(e.target.dataset.count);
      const newValue = (isLeft ? value + 1 : value - 1) % (count + 1);
      flag[id] = Math.max(e.target.dataset.min ?? 0, newValue);
      page2.setFlag(MODULE_ID, "counters", flag);
    }
  });
  if (game.user.isGM) {
    Hooks.once("renderJournalTextPageSheet", () => {
      const tour = game.tours.get(MODULE_ID + ".journal-page");
      if (tour.status === Tour.STATUS.UNSTARTED) {
        tour.start();
      }
    });
  }
});
Hooks.on("createScene", (scene) => {
  if (game.user.isGM) void syncRusthengeMaps(scene);
});
Hooks.once("setup", () => {
  initEnrichers();
});
export {
  MODULE_ID,
  toggleJournal
};
/**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
//# sourceMappingURL=index.js.map
