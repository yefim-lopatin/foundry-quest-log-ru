import {
  MODULE_ID,
  SOCKET_TYPE,
  STATUS_LABEL_KEYS,
} from "./constants.js";
import {
  buildQuestChatCard,
  buildQuestJournalHtml,
  normalizeQuest,
  normalizeQuestFlags,
  sanitizeQuestForPlayer,
} from "./model.js";

const SOCKET_NAME = `module.${MODULE_ID}`;

function noOwnership() {
  return globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.NONE ?? 0;
}

function localize(key) {
  return game.i18n.localize(key);
}

export class QuestStore {
  #playerSnapshot = [];
  #hasPlayerSnapshot = false;
  #broadcastTimer = null;

  initialize() {
    game.socket.on(SOCKET_NAME, (message) => this.#onSocketMessage(message));

    for (const hookName of ["createJournalEntry", "updateJournalEntry", "deleteJournalEntry"]) {
      Hooks.on(hookName, (document) => this.#onQuestDocumentChanged(document));
    }

    if (!game.user.isGM) this.requestSnapshot();
  }

  get hasPlayerSnapshot() {
    return game.user.isGM || this.#hasPlayerSnapshot;
  }

  getQuests() {
    if (!game.user.isGM) return this.#playerSnapshot.map(normalizeQuest);
    return game.journal
      .filter((journal) => journal.getFlag(MODULE_ID, "isQuest") === true)
      .map((journal) => this.#documentToQuest(journal));
  }

  getQuest(id) {
    return this.getQuests().find((quest) => quest.id === id) ?? null;
  }

  getQuestDocument(id) {
    if (!game.user.isGM) return null;
    const journal = game.journal.get(id);
    return journal?.getFlag(MODULE_ID, "isQuest") === true ? journal : null;
  }

  async createQuest(input) {
    this.#assertGM();
    const name = String(input.name ?? "").trim();
    if (!name) throw new Error(localize("FQLR.Validation.NameRequired"));

    const folder = await this.#ensureFolder();
    const now = Date.now();
    const flags = normalizeQuestFlags({ ...input, createdAt: now, updatedAt: now });
    const quest = normalizeQuest({ name, ...flags });
    const journal = await JournalEntry.create({
      name,
      folder: folder.id,
      ownership: { default: noOwnership() },
      flags: { [MODULE_ID]: flags },
      pages: [
        {
          name: localize("FQLR.Journal.MirrorPage"),
          type: "text",
          ownership: { default: noOwnership() },
          text: { content: buildQuestJournalHtml(quest), format: 1 },
          flags: { [MODULE_ID]: { mirror: true } },
        },
      ],
    });

    const created = this.#documentToQuest(journal);
    await this.#announce(created, "created");
    this.#scheduleBroadcast();
    return created;
  }

  async updateQuest(id, input) {
    this.#assertGM();
    const journal = this.getQuestDocument(id);
    if (!journal) throw new Error(localize("FQLR.Errors.QuestNotFound"));

    const current = this.#documentToQuest(journal);
    const name = String(input.name ?? "").trim();
    if (!name) throw new Error(localize("FQLR.Validation.NameRequired"));

    const flags = normalizeQuestFlags({
      ...input,
      createdAt: current.createdAt,
      updatedAt: Date.now(),
    });
    const updatedQuest = normalizeQuest({ id, uuid: journal.uuid, name, ...flags });

    await journal.update({
      name,
      [`flags.${MODULE_ID}`]: flags,
    });

    const mirror = journal.pages.find((page) => page.getFlag(MODULE_ID, "mirror") === true);
    if (mirror) {
      await mirror.update({
        name: localize("FQLR.Journal.MirrorPage"),
        "text.content": buildQuestJournalHtml(updatedQuest),
      });
    }

    if (current.status !== updatedQuest.status || current.visible !== updatedQuest.visible) {
      await this.#announce(updatedQuest, "updated");
    }
    this.#scheduleBroadcast();
    return updatedQuest;
  }

  async deleteQuest(id) {
    this.#assertGM();
    const journal = this.getQuestDocument(id);
    if (!journal) throw new Error(localize("FQLR.Errors.QuestNotFound"));
    await journal.delete();
    this.#scheduleBroadcast();
  }

  async shareQuestToChat(id) {
    const quest = this.getQuest(id);
    if (!quest || (!game.user.isGM && !quest.visible)) return;
    const statusLabel = localize(STATUS_LABEL_KEYS[quest.status]);
    const content = buildQuestChatCard(quest, statusLabel);
    if (!content) return;
    await ChatMessage.create({
      content,
      speaker: ChatMessage.getSpeaker(),
      style: globalThis.CONST?.CHAT_MESSAGE_STYLES?.OTHER,
    });
  }

  requestSnapshot() {
    if (game.user.isGM) return;
    game.socket.emit(SOCKET_NAME, {
      type: SOCKET_TYPE.REQUEST_SNAPSHOT,
      requesterId: game.user.id,
    });
  }

  broadcastSnapshot() {
    if (!game.user.isGM || !this.#isPrimaryGM()) return;
    const quests = this.getQuests()
      .map(sanitizeQuestForPlayer)
      .filter(Boolean);
    game.socket.emit(SOCKET_NAME, {
      type: SOCKET_TYPE.SNAPSHOT,
      gmId: game.user.id,
      quests,
    });
  }

  #documentToQuest(journal) {
    return normalizeQuest({
      id: journal.id,
      uuid: journal.uuid,
      name: journal.name,
      ...(journal.flags?.[MODULE_ID] ?? {}),
    });
  }

  async #ensureFolder() {
    const existing = game.folders.find(
      (folder) => folder.type === "JournalEntry" && folder.getFlag(MODULE_ID, "questFolder") === true,
    );
    if (existing) return existing;

    return Folder.create({
      name: game.settings.get(MODULE_ID, "folderName"),
      type: "JournalEntry",
      sorting: "a",
      flags: { [MODULE_ID]: { questFolder: true } },
    });
  }

  #assertGM() {
    if (!game.user.isGM) throw new Error(localize("FQLR.Errors.GMOnly"));
  }

  #isPrimaryGM() {
    const primaryGM = game.users
      .filter((user) => user.active && user.isGM)
      .sort((left, right) => left.id.localeCompare(right.id))[0];
    return primaryGM?.id === game.user.id;
  }

  #onSocketMessage(message) {
    if (!message || typeof message !== "object") return;

    if (message.type === SOCKET_TYPE.REQUEST_SNAPSHOT) {
      if (game.user.isGM && this.#isPrimaryGM()) this.broadcastSnapshot();
      return;
    }

    if (message.type !== SOCKET_TYPE.SNAPSHOT || game.user.isGM) return;
    if (!game.users.get(message.gmId)?.isGM || !Array.isArray(message.quests)) return;

    this.#playerSnapshot = message.quests
      .map(sanitizeQuestForPlayer)
      .filter(Boolean);
    this.#hasPlayerSnapshot = true;
    Hooks.callAll(`${MODULE_ID}.dataChanged`);
  }

  #onQuestDocumentChanged(document) {
    if (!game.user.isGM || document.getFlag(MODULE_ID, "isQuest") !== true) return;
    this.#scheduleBroadcast();
  }

  #scheduleBroadcast() {
    if (!game.user.isGM) return;
    globalThis.clearTimeout(this.#broadcastTimer);
    this.#broadcastTimer = globalThis.setTimeout(() => this.broadcastSnapshot(), 50);
    Hooks.callAll(`${MODULE_ID}.dataChanged`);
  }

  async #announce(quest, action) {
    if (!quest.visible || !game.settings.get(MODULE_ID, "chatNotifications")) return;
    const labelKey = action === "created" ? "FQLR.Chat.NewQuest" : "FQLR.Chat.QuestUpdated";
    const statusLabel = localize(STATUS_LABEL_KEYS[quest.status]);
    const card = buildQuestChatCard(quest, statusLabel);
    await ChatMessage.create({
      content: `<p class="fqlr-chat-label">${localize(labelKey)}</p>${card}`,
      speaker: ChatMessage.getSpeaker(),
      style: globalThis.CONST?.CHAT_MESSAGE_STYLES?.OTHER,
    });
  }
}
