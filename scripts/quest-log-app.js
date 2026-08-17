import {
  MODULE_ID,
  QUEST_STATUS,
  STATUS_LABEL_KEYS,
} from "./constants.js";
import {
  calculateProgress,
  escapeHtml,
  filterAndSortQuests,
} from "./model.js";
import { QuestEditorApp } from "./quest-editor-app.js";

const { ApplicationV2, DialogV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class QuestLogApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-app`,
    classes: [MODULE_ID, "fqlr-app-window"],
    position: { width: 980, height: 720 },
    window: {
      title: "FQLR.Title",
      icon: "fa-solid fa-scroll",
      resizable: true,
    },
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/quest-log.hbs`,
      root: true,
    },
  };

  constructor(store, options = {}) {
    super(options);
    this.store = store;
    this.selectedQuestId = null;
    this.statusFilter = QUEST_STATUS.ACTIVE;
    this.categoryFilter = "all";
    this.searchQuery = "";
    this.searchTimer = null;
  }

  async _prepareContext() {
    const allQuests = this.store.getQuests();
    const filteredQuests = filterAndSortQuests(allQuests, {
      status: this.statusFilter,
      category: this.categoryFilter,
      query: this.searchQuery,
    });

    if (!filteredQuests.some((quest) => quest.id === this.selectedQuestId)) {
      this.selectedQuestId = filteredQuests[0]?.id ?? null;
    }

    const selectedQuest = filteredQuests.find((quest) => quest.id === this.selectedQuestId) ?? null;
    const preparedSelectedQuest = selectedQuest ? await this.#prepareQuestDetails(selectedQuest) : null;
    const categories = [...new Set(allQuests.map((quest) => quest.category))]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right, "ru-RU"));

    const stats = {
      active: allQuests.filter((quest) => quest.status === QUEST_STATUS.ACTIVE).length,
      completed: allQuests.filter((quest) => quest.status === QUEST_STATUS.COMPLETED).length,
      failed: allQuests.filter((quest) => quest.status === QUEST_STATUS.FAILED).length,
    };

    return {
      isGM: game.user.isGM,
      hasSnapshot: this.store.hasPlayerSnapshot,
      quests: filteredQuests.map((quest) => this.#prepareQuestListItem(quest)),
      selectedQuest: preparedSelectedQuest,
      searchQuery: this.searchQuery,
      stats,
      statusOptions: [
        { value: "all", label: game.i18n.localize("FQLR.Filters.All"), selected: this.statusFilter === "all" },
        ...Object.values(QUEST_STATUS).map((value) => ({
          value,
          label: game.i18n.localize(STATUS_LABEL_KEYS[value]),
          selected: this.statusFilter === value,
        })),
      ],
      categoryOptions: [
        { value: "all", label: game.i18n.localize("FQLR.Filters.AllCategories"), selected: this.categoryFilter === "all" },
        ...categories.map((value) => ({ value, label: value, selected: this.categoryFilter === value })),
      ],
    };
  }

  _onRender() {
    const root = this.element;
    if (root.dataset.fqlrActionsBound !== "true") {
      root.dataset.fqlrActionsBound = "true";
      root.addEventListener("click", (event) => this.#onClick(event));
    }

    root.querySelector('[data-role="statusFilter"]')?.addEventListener("change", (event) => {
      this.statusFilter = event.currentTarget.value;
      this.render({ force: true });
    });

    root.querySelector('[data-role="categoryFilter"]')?.addEventListener("change", (event) => {
      this.categoryFilter = event.currentTarget.value;
      this.render({ force: true });
    });

    root.querySelector('[data-role="search"]')?.addEventListener("input", (event) => {
      this.searchQuery = event.currentTarget.value;
      globalThis.clearTimeout(this.searchTimer);
      this.searchTimer = globalThis.setTimeout(() => this.render({ force: true }), 180);
    });
  }

  #prepareQuestListItem(quest) {
    const progress = calculateProgress(quest.objectives);
    return {
      ...quest,
      selected: quest.id === this.selectedQuestId,
      statusLabel: game.i18n.localize(STATUS_LABEL_KEYS[quest.status]),
      progress,
      isActive: quest.status === QUEST_STATUS.ACTIVE,
      isCompleted: quest.status === QUEST_STATUS.COMPLETED,
      isFailed: quest.status === QUEST_STATUS.FAILED,
    };
  }

  async #prepareQuestDetails(quest) {
    const textEditor = foundry.applications.ux.TextEditor.implementation;
    const enrich = (value) => textEditor.enrichHTML(value ?? "", { async: true, secrets: game.user.isGM });
    const objectives = await Promise.all(
      quest.objectives.map(async (objective) => ({
        ...objective,
        enrichedText: await enrich(objective.text),
      })),
    );

    return {
      ...this.#prepareQuestListItem(quest),
      objectives,
      enrichedDescription: await enrich(quest.description),
      enrichedRewards: await enrich(quest.rewards),
      enrichedGmNotes: game.user.isGM ? await enrich(quest.gmNotes) : "",
      hasMetadata: Boolean(quest.giver || quest.location),
      hasDescription: Boolean(quest.description),
      hasRewards: Boolean(quest.rewards),
      hasGmNotes: game.user.isGM && Boolean(quest.gmNotes),
      canComplete: game.user.isGM && quest.status !== QUEST_STATUS.COMPLETED,
      canReopen: game.user.isGM && quest.status === QUEST_STATUS.COMPLETED,
    };
  }

  async #onClick(event) {
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement || !this.element.contains(actionElement)) return;
    const action = actionElement.dataset.action;
    const questId = actionElement.dataset.questId ?? this.selectedQuestId;

    if (action === "selectQuest") {
      this.selectedQuestId = questId;
      this.render({ force: true });
      return;
    }

    if (action === "requestSnapshot") {
      this.store.requestSnapshot();
      ui.notifications.info(game.i18n.localize("FQLR.Notifications.SnapshotRequested"));
      return;
    }

    if (action === "createQuest") {
      if (!game.user.isGM) return;
      new QuestEditorApp({
        store: this.store,
        onSaved: async (quest) => {
          this.selectedQuestId = quest.id;
          this.statusFilter = "all";
          this.render({ force: true });
        },
      }).render({ force: true });
      return;
    }

    if (!questId) return;

    if (action === "shareQuest") {
      await this.#runAction(() => this.store.shareQuestToChat(questId));
      return;
    }

    if (!game.user.isGM) return;
    const quest = this.store.getQuest(questId);
    if (!quest) return;

    if (action === "editQuest") {
      new QuestEditorApp({
        store: this.store,
        quest,
        onSaved: async () => this.render({ force: true }),
      }).render({ force: true });
      return;
    }

    if (action === "toggleCompleted") {
      const status = quest.status === QUEST_STATUS.COMPLETED ? QUEST_STATUS.ACTIVE : QUEST_STATUS.COMPLETED;
      await this.#runAction(() => this.store.updateQuest(questId, { ...quest, status }));
      return;
    }

    if (action === "openJournal") {
      this.store.getQuestDocument(questId)?.sheet.render(true);
      return;
    }

    if (action === "deleteQuest") {
      const confirmed = await DialogV2.confirm({
        window: { title: game.i18n.localize("FQLR.Delete.Title") },
        content: `<p>${game.i18n.format("FQLR.Delete.Content", { name: escapeHtml(quest.name) })}</p>`,
        yes: { label: game.i18n.localize("FQLR.Buttons.Delete"), default: false },
        no: { label: game.i18n.localize("FQLR.Buttons.Cancel"), default: true },
      });
      if (!confirmed) return;
      await this.#runAction(async () => {
        await this.store.deleteQuest(questId);
        this.selectedQuestId = null;
      });
    }
  }

  async #runAction(callback) {
    try {
      await callback();
      this.render({ force: true });
    } catch (error) {
      console.error(`${MODULE_ID} | Ошибка действия`, error);
      ui.notifications.error(error.message ?? game.i18n.localize("FQLR.Errors.ActionFailed"));
    }
  }
}
