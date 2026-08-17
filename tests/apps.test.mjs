import test from "node:test";
import assert from "node:assert/strict";

class MockApplicationV2 {
  constructor(options = {}) {
    this.options = options;
    this.rendered = false;
  }

  render() {
    this.rendered = true;
    return this;
  }
}

globalThis.foundry = {
  applications: {
    api: {
      ApplicationV2: MockApplicationV2,
      DialogV2: { confirm: async () => false },
      HandlebarsApplicationMixin: (Base) => class extends Base {},
    },
    ux: {
      TextEditor: {
        implementation: {
          async enrichHTML(value) {
            return `<p>${value}</p>`;
          },
        },
      },
      FormDataExtended: class {},
    },
  },
};

globalThis.game = {
  user: { isGM: true },
  i18n: {
    localize(key) {
      return key;
    },
  },
};

const { QuestEditorApp } = await import("../scripts/quest-editor-app.js");
const { QuestLogApp } = await import("../scripts/quest-log-app.js");

const quest = {
  id: "quest-1",
  uuid: "JournalEntry.quest-1",
  name: "Затонувший храм",
  category: "Исследование",
  status: "active",
  visible: true,
  giver: "Архивариус",
  location: "Побережье",
  description: "Найти вход",
  rewards: "Карта",
  gmNotes: "Страж — иллюзия",
  objectives: [{ id: "goal-1", text: "Осмотреть руины", completed: false, secret: false }],
  createdAt: 1,
  updatedAt: 1,
};

const store = {
  hasPlayerSnapshot: true,
  getQuests() {
    return [quest];
  },
};

test("главное окно готовит полный контекст квеста на ApplicationV2", async () => {
  const app = new QuestLogApp(store);
  const context = await app._prepareContext();
  assert.equal(context.quests.length, 1);
  assert.equal(context.selectedQuest.name, "Затонувший храм");
  assert.match(context.selectedQuest.enrichedDescription, /Найти вход/);
  assert.equal(context.selectedQuest.progress.total, 1);
});

test("редактор готовит русский список статусов и исходные данные", async () => {
  const app = new QuestEditorApp({ store, quest });
  const context = await app._prepareContext();
  assert.equal(context.quest.name, "Затонувший храм");
  assert.equal(context.statuses.length, 3);
  assert.equal(app.title, "FQLR.Editor.EditTitle");
});
