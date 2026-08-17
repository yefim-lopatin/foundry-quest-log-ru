import { MODULE_ID } from "./main";

let mermaid = null;
const selector = ".mermaid";

async function loadMermaid() {
    const dynamicImport = new Function('url', 'return import(url)');
    const esModule = await dynamicImport("https://cdn.jsdelivr.net/npm/mermaid/+esm"); /*webpackIgnore*/
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
            tertiaryColor: getComputedStyle(document.documentElement).getPropertyValue("--foundry-quest-log-ru-background-color"),
        },
    });
}

export async function setupMermaid() {
    try {
        if (!mermaid) await loadMermaid();
        await mermaid.run({ querySelector: selector });
    } catch (error) {
        console.warn(`${MODULE_ID} | Mermaid недоступен, оставлен исходный mindmap`, error);
        ui.notifications?.warn("Mermaid не загрузился. Текст mindmap сохранён без визуализации.");
    }
}

export function setMermaidHooks() {
    window.runMermaid = setupMermaid;
    Hooks.on("renderJournalPageSheet", (app, html, data) => {
        if (html.find(selector)) {
            setTimeout(() => {
            setupMermaid();
            }, 1);
        }
    });
    Hooks.on(`${MODULE_ID}.onSelectQuest`, (page, html) => {
        if (html.querySelector(selector)) setupMermaid();
    });
}
