import test from "node:test";
import assert from "node:assert/strict";

import {
  buildQuestChatCard,
  calculateProgress,
  filterAndSortQuests,
  normalizeQuest,
  normalizeQuestFlags,
  sanitizeQuestForPlayer,
} from "../scripts/model.js";

test("нормализация отклоняет неизвестный статус и ограничивает форму данных", () => {
  const flags = normalizeQuestFlags({
    category: "  Гильдия  ",
    status: "unknown",
    visible: 0,
    objectives: [{ id: "one", text: "  Найти ключ  ", completed: 1, secret: 0 }],
  });

  assert.equal(flags.category, "Гильдия");
  assert.equal(flags.status, "active");
  assert.equal(flags.visible, true);
  assert.deepEqual(flags.objectives[0], {
    id: "one",
    text: "Найти ключ",
    completed: true,
    secret: false,
  });
});

test("повреждённые пустые элементы не ломают нормализацию", () => {
  const flags = normalizeQuestFlags({ objectives: [null, "ошибка"] });
  assert.equal(flags.objectives.length, 2);
  assert.equal(flags.objectives[0].text, "");
  assert.equal(normalizeQuest(null).name, "Новый квест");
});

test("игрок не получает скрытый квест, заметки мастера и секретные цели", () => {
  const hidden = sanitizeQuestForPlayer({ name: "Тайна", visible: false });
  assert.equal(hidden, null);

  const visible = sanitizeQuestForPlayer({
    id: "quest-1",
    name: "Башня",
    visible: true,
    gmNotes: "Главный злодей — мэр",
    objectives: [
      { id: "public", text: "Войти", secret: false },
      { id: "secret", text: "Попасть в засаду", secret: true },
    ],
  });

  assert.equal(visible.gmNotes, "");
  assert.deepEqual(visible.objectives.map((objective) => objective.id), ["public"]);
});

test("фильтрация ищет по русскому тексту и сортирует активные квесты первыми", () => {
  const quests = [
    normalizeQuest({ id: "2", name: "Возвращение", status: "completed", category: "Город" }),
    normalizeQuest({ id: "1", name: "След в снегу", status: "active", category: "Север", location: "Перевал" }),
  ];

  assert.deepEqual(filterAndSortQuests(quests).map((quest) => quest.id), ["1", "2"]);
  assert.deepEqual(filterAndSortQuests(quests, { query: "ПЕРЕВАЛ" }).map((quest) => quest.id), ["1"]);
  assert.deepEqual(filterAndSortQuests(quests, { status: "completed" }).map((quest) => quest.id), ["2"]);
});

test("прогресс корректен для пустого и заполненного списка целей", () => {
  assert.deepEqual(calculateProgress([]), { total: 0, completed: 0, percent: 0 });
  assert.deepEqual(calculateProgress([{ completed: true }, { completed: false }]), {
    total: 2,
    completed: 1,
    percent: 50,
  });
});

test("карточка чата экранирует HTML и не включает секретные поля", () => {
  const card = buildQuestChatCard(
    {
      name: "<img src=x onerror=alert(1)>",
      visible: true,
      gmNotes: "секрет",
      objectives: [
        { id: "safe", text: "Открыть дверь", secret: false },
        { id: "secret", text: "Засада", secret: true },
      ],
    },
    "Активен",
  );

  assert.match(card, /&lt;img/);
  assert.doesNotMatch(card, /onerror=alert\(1\)>/);
  assert.doesNotMatch(card, /секрет|Засада/);
  assert.match(card, /Открыть дверь/);
});
