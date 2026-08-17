import test from "node:test";
import assert from "node:assert/strict";

import { SOCKET_TYPE } from "../scripts/constants.js";
import { QuestStore } from "../scripts/store.js";

class MockCollection extends Array {
  get(id) {
    return this.find((entry) => entry.id === id);
  }
}

function makePage(source) {
  return {
    ...source,
    flags: structuredClone(source.flags ?? {}),
    getFlag(moduleId, key) {
      return this.flags?.[moduleId]?.[key];
    },
    async update(changes) {
      if (changes.name) this.name = changes.name;
      if (changes["text.content"]) this.text.content = changes["text.content"];
      return this;
    },
  };
}

function installFoundryMocks() {
  const emissions = [];
  const journals = new MockCollection();
  const folders = new MockCollection();
  const users = new MockCollection({ id: "gm", isGM: true, active: true });

  globalThis.CONST = {
    DOCUMENT_OWNERSHIP_LEVELS: { NONE: 0 },
    CHAT_MESSAGE_STYLES: { OTHER: 0 },
  };
  globalThis.Hooks = { callAll() {}, on() {} };
  globalThis.ui = { notifications: { info() {}, error() {} } };
  globalThis.game = {
    user: users[0],
    users,
    journal: journals,
    folders,
    socket: {
      on() {},
      emit(channel, payload) {
        emissions.push({ channel, payload });
      },
    },
    settings: {
      get(_moduleId, key) {
        if (key === "folderName") return "Квестовый журнал — данные";
        if (key === "chatNotifications") return false;
        return undefined;
      },
    },
    i18n: {
      localize(key) {
        return key;
      },
    },
  };

  globalThis.Folder = {
    async create(source) {
      const folder = {
        ...source,
        id: `folder-${folders.length + 1}`,
        getFlag(moduleId, key) {
          return this.flags?.[moduleId]?.[key];
        },
      };
      folders.push(folder);
      return folder;
    },
  };

  globalThis.JournalEntry = {
    async create(source) {
      const journal = {
        ...source,
        id: `quest-${journals.length + 1}`,
        uuid: `JournalEntry.quest-${journals.length + 1}`,
        flags: structuredClone(source.flags),
        pages: new MockCollection(...source.pages.map(makePage)),
        getFlag(moduleId, key) {
          return this.flags?.[moduleId]?.[key];
        },
        async update(changes) {
          if (changes.name) this.name = changes.name;
          const flagChanges = changes["flags.foundry-quest-log-ru"];
          if (flagChanges) this.flags["foundry-quest-log-ru"] = structuredClone(flagChanges);
          return this;
        },
        async delete() {
          journals.splice(journals.indexOf(this), 1);
        },
      };
      journals.push(journal);
      return journal;
    },
  };

  globalThis.ChatMessage = {
    getSpeaker() {
      return {};
    },
    async create() {},
  };

  return { emissions, journals, folders };
}

test("хранилище создаёт закрытый JournalEntry и публикует только очищенный снимок", async () => {
  const { emissions, journals, folders } = installFoundryMocks();
  const store = new QuestStore();

  const quest = await store.createQuest({
    name: "Башня на перевале",
    visible: true,
    gmNotes: "Мэр работает на культ",
    objectives: [
      { id: "public", text: "Добраться до башни", secret: false },
      { id: "secret", text: "Пережить засаду", secret: true },
    ],
  });

  assert.equal(quest.name, "Башня на перевале");
  assert.equal(folders.length, 1);
  assert.equal(journals.length, 1);
  assert.equal(journals[0].ownership.default, 0);
  assert.equal(journals[0].flags["foundry-quest-log-ru"].gmNotes, "Мэр работает на культ");
  assert.match(journals[0].pages[0].text.content, /секретная цель/);

  store.broadcastSnapshot();
  const snapshot = emissions.findLast((entry) => entry.payload.type === SOCKET_TYPE.SNAPSHOT)?.payload;
  assert.ok(snapshot);
  assert.equal(snapshot.quests[0].gmNotes, "");
  assert.deepEqual(snapshot.quests[0].objectives.map((objective) => objective.id), ["public"]);

  const updated = await store.updateQuest(quest.id, {
    ...quest,
    name: "Башня очищена",
    status: "completed",
    visible: false,
  });
  assert.equal(updated.status, "completed");
  assert.equal(journals[0].name, "Башня очищена");
  assert.match(journals[0].pages[0].text.content, /Башня очищена/);

  store.broadcastSnapshot();
  const hiddenSnapshot = emissions.findLast((entry) => entry.payload.type === SOCKET_TYPE.SNAPSHOT)?.payload;
  assert.equal(hiddenSnapshot.quests.length, 0);
});

test("хранилище не создаёт квест без названия", async () => {
  installFoundryMocks();
  const store = new QuestStore();
  await assert.rejects(() => store.createQuest({ name: "   " }), /FQLR.Validation.NameRequired/);
});
