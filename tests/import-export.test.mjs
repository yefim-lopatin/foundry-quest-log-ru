import test from "node:test";
import assert from "node:assert/strict";
import { FULL_FORMAT, normalizePayload, QUESTS_FORMAT } from "../scripts/importExportData.js";

test("принимается полный формат журналов", () => {
  const payload = normalizePayload({
    format: FULL_FORMAT,
    version: 1,
    journals: [{
      section: "quests",
      name: "Основной сюжет",
      pages: [{ name: "Глава 1", type: "text", text: { content: "<p>Текст</p>" } }],
    }],
  });

  assert.equal(payload.journals.length, 1);
  assert.equal(payload.journals[0].pages[0].text.content, "<p>Текст</p>");
});
test("старый формат превращается в журналы с отдельными заметками ведущего", () => {
  const payload = normalizePayload({
    format: QUESTS_FORMAT,
    version: 1,
    quests: [{
      category: "Лор Растхенджа",
      name: "Локации",
      visible: true,
      description: "<p>Для игроков</p>",
      gmNotes: "<p>Только ведущему</p>",
      objectives: [],
    }],
  });

  assert.equal(payload.format, FULL_FORMAT);
  assert.equal(payload.journals[0].section, "lore");
  assert.equal(payload.journals[0].pages.length, 2);
  assert.equal(payload.journals[0].pages[0].ownership.default, 2);
  assert.equal(payload.journals[0].pages[1].ownership.default, 0);
  assert.equal(payload.journals[0].pages[1].flags["foundry-quest-log-ru"].hidden, true);
});

test("повреждённый формат отклоняется", () => {
  assert.throws(() => normalizePayload({ format: FULL_FORMAT, version: 1, journals: [{ name: "Без страниц" }] }));
  assert.throws(() => normalizePayload({ format: "unknown", version: 1, journals: [] }));
});
