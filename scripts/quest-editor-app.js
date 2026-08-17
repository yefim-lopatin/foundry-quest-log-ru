import {
  DEFAULT_CATEGORY,
  MODULE_ID,
  QUEST_STATUS,
  STATUS_LABEL_KEYS,
} from "./constants.js";
import { normalizeObjective } from "./model.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function blankObjective() {
  return normalizeObjective({ text: "", completed: false, secret: false });
}

export class QuestEditorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-editor`,
    classes: [MODULE_ID, "fqlr-editor-window"],
    position: { width: 660, height: "auto" },
    window: {
      icon: "fa-solid fa-feather-pointed",
      resizable: true,
    },
  };

  static PARTS = {
    form: {
      template: `modules/${MODULE_ID}/templates/quest-editor.hbs`,
      root: true,
    },
  };

  constructor({ store, quest = null, onSaved = null } = {}, options = {}) {
    super(options);
    this.store = store;
    this.questId = quest?.id ?? null;
    this.onSaved = onSaved;
    this.draft = quest
      ? structuredClone(quest)
      : {
          name: "",
          category: DEFAULT_CATEGORY,
          status: QUEST_STATUS.ACTIVE,
          visible: true,
          giver: "",
          location: "",
          description: "",
          rewards: "",
          gmNotes: "",
          objectives: [blankObjective()],
        };
  }

  get title() {
    return game.i18n.localize(this.questId ? "FQLR.Editor.EditTitle" : "FQLR.Editor.CreateTitle");
  }

  async _prepareContext() {
    const categories = [...new Set(this.store.getQuests().map((quest) => quest.category))]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right, "ru-RU"));

    return {
      quest: this.draft,
      categories,
      statuses: Object.values(QUEST_STATUS).map((value) => ({
        value,
        label: game.i18n.localize(STATUS_LABEL_KEYS[value]),
        selected: this.draft.status === value,
      })),
    };
  }

  _onRender() {
    const form = this.element.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (event) => this.#onSubmit(event));
    form.querySelector('[data-action="cancel"]')?.addEventListener("click", () => this.close());
    form.querySelector('[data-action="addObjective"]')?.addEventListener("click", () => {
      this.#captureForm(form);
      this.draft.objectives.push(blankObjective());
      this.render({ force: true });
    });

    form.querySelectorAll('[data-action="removeObjective"]').forEach((button) => {
      button.addEventListener("click", () => {
        this.#captureForm(form);
        this.draft.objectives = this.draft.objectives.filter(
          (objective) => objective.id !== button.dataset.objectiveId,
        );
        if (this.draft.objectives.length === 0) this.draft.objectives.push(blankObjective());
        this.render({ force: true });
      });
    });
  }

  #captureForm(form) {
    const formData = new foundry.applications.ux.FormDataExtended(form).object;
    this.draft = {
      ...this.draft,
      name: String(formData.name ?? ""),
      category: String(formData.category ?? DEFAULT_CATEGORY),
      status: String(formData.status ?? QUEST_STATUS.ACTIVE),
      visible: form.elements.visible.checked,
      giver: String(formData.giver ?? ""),
      location: String(formData.location ?? ""),
      description: String(formData.description ?? ""),
      rewards: String(formData.rewards ?? ""),
      gmNotes: String(formData.gmNotes ?? ""),
      objectives: [...form.querySelectorAll("[data-objective-id]")].map((row) => ({
        id: row.dataset.objectiveId,
        text: row.querySelector('[name="objectiveText"]')?.value ?? "",
        completed: row.querySelector('[name="objectiveCompleted"]')?.checked ?? false,
        secret: row.querySelector('[name="objectiveSecret"]')?.checked ?? false,
      })),
    };
  }

  async #onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    this.#captureForm(form);
    this.draft.objectives = this.draft.objectives.filter((objective) => objective.text.trim());

    try {
      const saved = this.questId
        ? await this.store.updateQuest(this.questId, this.draft)
        : await this.store.createQuest(this.draft);
      ui.notifications.info(game.i18n.localize("FQLR.Notifications.Saved"));
      await this.onSaved?.(saved);
      await this.close();
    } catch (error) {
      console.error(`${MODULE_ID} | Не удалось сохранить квест`, error);
      ui.notifications.error(error.message ?? game.i18n.localize("FQLR.Errors.SaveFailed"));
    }
  }
}
