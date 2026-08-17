import {
  DEFAULT_CATEGORY,
  FLAG_VERSION,
  MAX_OBJECTIVES,
  MAX_TEXT_LENGTH,
  QUEST_STATUS,
  QUEST_STATUS_VALUES,
} from "./constants.js";

const STATUS_ORDER = Object.freeze({
  [QUEST_STATUS.ACTIVE]: 0,
  [QUEST_STATUS.FAILED]: 1,
  [QUEST_STATUS.COMPLETED]: 2,
});

function cleanText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, MAX_TEXT_LENGTH);
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `objective-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeObjective(value = {}) {
  if (!value || typeof value !== "object") value = {};
  return {
    id: cleanText(value.id) || makeId(),
    text: cleanText(value.text),
    completed: Boolean(value.completed),
    secret: Boolean(value.secret),
  };
}

export function normalizeQuestFlags(value = {}) {
  if (!value || typeof value !== "object") value = {};
  const status = QUEST_STATUS_VALUES.includes(value.status) ? value.status : QUEST_STATUS.ACTIVE;
  const createdAt = Number.isFinite(Number(value.createdAt)) ? Number(value.createdAt) : Date.now();
  const updatedAt = Number.isFinite(Number(value.updatedAt)) ? Number(value.updatedAt) : createdAt;
  const sourceObjectives = Array.isArray(value.objectives) ? value.objectives : [];

  return {
    version: FLAG_VERSION,
    isQuest: true,
    category: cleanText(value.category, DEFAULT_CATEGORY) || DEFAULT_CATEGORY,
    status,
    visible: value.visible !== false,
    giver: cleanText(value.giver),
    location: cleanText(value.location),
    description: cleanText(value.description),
    rewards: cleanText(value.rewards),
    gmNotes: cleanText(value.gmNotes),
    objectives: sourceObjectives.slice(0, MAX_OBJECTIVES).map(normalizeObjective),
    createdAt,
    updatedAt,
  };
}

export function normalizeQuest(value = {}) {
  if (!value || typeof value !== "object") value = {};
  const flags = normalizeQuestFlags(value);
  return {
    id: cleanText(value.id),
    uuid: cleanText(value.uuid),
    name: cleanText(value.name, "Новый квест") || "Новый квест",
    ...flags,
  };
}

export function sanitizeQuestForPlayer(value) {
  const quest = normalizeQuest(value);
  if (!quest.visible) return null;

  return {
    ...quest,
    gmNotes: "",
    objectives: quest.objectives.filter((objective) => !objective.secret),
  };
}

export function calculateProgress(objectives = []) {
  const total = objectives.length;
  const completed = objectives.filter((objective) => objective.completed).length;
  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function filterAndSortQuests(quests, { status = "all", category = "all", query = "" } = {}) {
  const normalizedQuery = cleanText(query).toLocaleLowerCase("ru-RU");

  return quests
    .map(normalizeQuest)
    .filter((quest) => status === "all" || quest.status === status)
    .filter((quest) => category === "all" || quest.category === category)
    .filter((quest) => {
      if (!normalizedQuery) return true;
      const haystack = [
        quest.name,
        quest.category,
        quest.giver,
        quest.location,
        quest.description,
        quest.rewards,
        ...quest.objectives.map((objective) => objective.text),
      ]
        .join("\n")
        .toLocaleLowerCase("ru-RU");
      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => {
      const statusDifference = STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
      if (statusDifference !== 0) return statusDifference;
      const categoryDifference = left.category.localeCompare(right.category, "ru-RU");
      if (categoryDifference !== 0) return categoryDifference;
      return left.name.localeCompare(right.name, "ru-RU");
    });
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToParagraphs(value) {
  return cleanText(value)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

export function buildQuestJournalHtml(value) {
  const quest = normalizeQuest(value);
  const objectiveItems = quest.objectives
    .map((objective) => {
      const state = objective.completed ? "☑" : "☐";
      const secret = objective.secret ? " <em>(секретная цель)</em>" : "";
      return `<li>${state} ${escapeHtml(objective.text)}${secret}</li>`;
    })
    .join("");

  return [
    `<h1>${escapeHtml(quest.name)}</h1>`,
    `<p><strong>Категория:</strong> ${escapeHtml(quest.category)}</p>`,
    quest.giver ? `<p><strong>Квестодатель:</strong> ${escapeHtml(quest.giver)}</p>` : "",
    quest.location ? `<p><strong>Место:</strong> ${escapeHtml(quest.location)}</p>` : "",
    quest.description ? `<h2>Описание</h2>${textToParagraphs(quest.description)}` : "",
    objectiveItems ? `<h2>Цели</h2><ul>${objectiveItems}</ul>` : "",
    quest.rewards ? `<h2>Награда</h2>${textToParagraphs(quest.rewards)}` : "",
    quest.gmNotes ? `<h2>Заметки мастера</h2>${textToParagraphs(quest.gmNotes)}` : "",
  ].join("");
}

export function buildQuestChatCard(value, statusLabel) {
  const quest = sanitizeQuestForPlayer(value);
  if (!quest) return "";
  const objectiveItems = quest.objectives
    .map((objective) => `<li>${objective.completed ? "☑" : "☐"} ${escapeHtml(objective.text)}</li>`)
    .join("");

  return `<article class="fqlr-chat-card">
    <header><i class="fa-solid fa-scroll"></i> <strong>${escapeHtml(quest.name)}</strong></header>
    <p><strong>Статус:</strong> ${escapeHtml(statusLabel)}</p>
    ${quest.description ? textToParagraphs(quest.description) : ""}
    ${objectiveItems ? `<h4>Цели</h4><ul>${objectiveItems}</ul>` : ""}
    ${quest.rewards ? `<h4>Награда</h4>${textToParagraphs(quest.rewards)}` : ""}
  </article>`;
}
