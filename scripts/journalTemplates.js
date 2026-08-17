import { MODULE_ID } from "./main";

const TEMPLATE_ICONS = {
    banner: "fad fa-scroll-old",
    character: "fad fa-user",
    "dynamic-columns": "fad fa-columns",
    "image-text-left": "fad fa-image",
    "image-text-right": "fad fa-image",
    location: "fad fa-place-of-worship",
    "boxed-text": "fad fa-paragraph",
    "description-text": "fad fa-text",
    "character-grid-1x2": "fad fa-user",
    "character-grid-1x3": "fad fa-user",
    wiki: "fad fa-book",
    event: "fad fa-calendar",
    custom: "fad fa-file-invoice",
};

export async function applyTemplate(t, page, app) {
    await app.close({ force: true });
    const textContent = page.text.content;
    const template = await fetch(t).then((r) => r.text());
    const hasImage = template.includes("https://source.unsplash.com/random");
    if (!hasImage) {
        const newContent = textContent + "\n" + template;
        await page.update({ "text.content": newContent });
        app.render(true);
        return;
    }

    const matches = template.match(/https:\/\/source\.unsplash\.com\/random/g);
    const paths = [];

    for (const match of matches) {
        const path = await getFile();
        paths.push(path);
    }

    const newTemplate = matches.reduce((acc, m, i) => {
        return acc.replace(m, paths[i] || m);
    }, template);

    const newContent = textContent + "\n" + newTemplate;
    await page.update({ "text.content": newContent });
    app.render(true);
}

async function getFile() {
    let resolve;
    const promise = new Promise((r) => (resolve = r));
    const picker = new FilePicker({
        type: "image",
        callback: (path) => {
            resolve(path);
        },
    });

    //wrap close method to resolve promise
    const original = picker.close;

    picker.close = async () => {
        resolve(null);
        await original.bind(picker)();
    };

    picker.browse();

    return promise;
}

export function initJournalTemplates() {
    Hooks.on("getHeaderControlsJournalEntryPageProseMirrorSheet", (app, buttons) => {
        buttons.push({
            class: "foundry-quest-log-ru-page-template",
            icon: "fas fa-scroll-old",
            label: game.i18n.localize(`${MODULE_ID}.page-template.label`),
            onClick: async () => {
                const templates = (await FilePicker.browse("data", `modules/${MODULE_ID}/templates/JournalTemplates`)).files;
                let customTemplates = [];
                try {
                    customTemplates = (await FilePicker.browse("user", `modules/${MODULE_ID}/storage`, { extensions: [".html"] })).files;
                } catch (error) {
                    console.error(error);
                    customTemplates = [];
                }

                const buttons = templates.concat(customTemplates).map((t) => {
                    return {
                        label: t
                            .split("/")
                            .pop()
                            .split(".")
                            .slice(0, -1)
                            .join(".")
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" "),
                        icon: `<i class="${TEMPLATE_ICONS[t.split("/").pop().split(".").slice(0, -1).join(".")] ?? TEMPLATE_ICONS.custom}"></i>`,
                        callback: async () => {
                            await applyTemplate(t, app.document, app);
                        },
                    };
                });

                new Dialog({
                    title: game.i18n.localize(`${MODULE_ID}.page-template.label`),
                    content: `<p>${game.i18n.localize(`${MODULE_ID}.page-template.description`)}</p>`,
                    buttons: buttons,
                    render: (html) => {
                        html[0].closest(".app").classList.add("foundry-quest-log-ru-dialog");
                        html[0].closest(".app").classList.add("page-template-dialog");
                    },
                }).render(true);
            },
        });
    });
}
