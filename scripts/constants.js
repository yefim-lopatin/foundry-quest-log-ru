export const MODULE_ID = "foundry-quest-log-ru";

export const MODULE_TITLE = "Квестовый журнал";

export const FLAG_VERSION = 1;

export const QUEST_STATUS = Object.freeze({
  ACTIVE: "active",
  COMPLETED: "completed",
  FAILED: "failed",
});

export const QUEST_STATUS_VALUES = Object.freeze(Object.values(QUEST_STATUS));

export const STATUS_LABEL_KEYS = Object.freeze({
  [QUEST_STATUS.ACTIVE]: "FQLR.StatusLabel.Active",
  [QUEST_STATUS.COMPLETED]: "FQLR.StatusLabel.Completed",
  [QUEST_STATUS.FAILED]: "FQLR.StatusLabel.Failed",
});

export const SOCKET_TYPE = Object.freeze({
  REQUEST_SNAPSHOT: "requestSnapshot",
  SNAPSHOT: "snapshot",
});

export const DEFAULT_CATEGORY = "Без категории";

export const MAX_OBJECTIVES = 100;

export const MAX_TEXT_LENGTH = 20_000;
