import { MODULE_ID } from "./main";
import { getSetting, setSetting } from "./settings";

export async function createDefaultStructure() {
    const folderName = getSetting("folderName");
    const folder = Array.from(game.folders).find((f) => f.name === folderName && f.type === "JournalEntry");
    if (folder) return createPlayerJournal(folder);

    //create folder

    const folderDocument = await Folder.create({
        name: folderName,
        color: "#03bafc",
        sorting: "m",
        type: "JournalEntry",
        folder: null,
    });

    //create lore folder

    const loreFolder = await createLoreFolder();

    //create default quest journals

    const IN_PROGRESS = game.i18n.localize(`${MODULE_ID}.default-structure.in-progress`);
    const COMPLETED = game.i18n.localize(`${MODULE_ID}.default-structure.completed`);
    const FAILED = game.i18n.localize(`${MODULE_ID}.default-structure.failed`);

    const defaultJournalNames = [IN_PROGRESS, COMPLETED, FAILED];

    for (const name of defaultJournalNames) {
        const j = await JournalEntry.create({
            name: name,
            folder: folderDocument.id,
            ownership: {
                default: 0,
            },
        });

        if (name === IN_PROGRESS) {
            await j.createEmbeddedDocuments("JournalEntryPage", [DEMO_QUEST]);
        }
    }

    //create default lore journals

    const LOCATIONS = game.i18n.localize(`${MODULE_ID}.default-structure.locations`);
    const NPCS = game.i18n.localize(`${MODULE_ID}.default-structure.npcs`);
    const ORGANIZATIONS = game.i18n.localize(`${MODULE_ID}.default-structure.organizations`);
    const HISTORY = game.i18n.localize(`${MODULE_ID}.default-structure.history`);
    const BESTIARY = game.i18n.localize(`${MODULE_ID}.default-structure.bestiary`);

    const defaultLoreNames = [LOCATIONS, NPCS, ORGANIZATIONS, HISTORY, BESTIARY];

    for (const name of defaultLoreNames) {
        const j = await JournalEntry.create({
            name: name,
            folder: loreFolder.id,
            ownership: {
                default: 0,
            },
        });

        if (name === LOCATIONS) {
            await j.createEmbeddedDocuments("JournalEntryPage", [DEMO_LORE]);
        }
    }

    //create party journal
    await createPlayerJournal(folderDocument);

    ui.notifications.info(game.i18n.localize(`${MODULE_ID}.notifications.defaultStructureCreated`));
}

export async function createPlayerJournal(folder) {
    const partyFolderName = getSetting("partyJournalName");
    let partyFolder = Array.from(game.folders).find((f) => f.name === partyFolderName && f.type === "JournalEntry" && f.folder === folder);
    if (!partyFolder) {
        partyFolder = await Folder.create({ name: partyFolderName, type: "JournalEntry", color: "#1fa87f", sorting: "m", folder: folder });
    }

    let updated = false;

    //create a page for each player

    const players = Array.from(game.users);
    const oldPlayerJournal = Array.from(game.journal).find((j) => j.name === partyFolderName && j.folder === folder);

    let migrated = false;

    for (const player of players) {
        let playerFolder = Array.from(game.folders).find((f) => f.name === player.name && f.type === "JournalEntry" && f.folder === partyFolder);
        if (!playerFolder) {
            updated = true;
            playerFolder = await Folder.create({ name: player.name, type: "JournalEntry", color: player.color, sorting: "m", folder: partyFolder.id });
            if (oldPlayerJournal) {
                const oldPage = oldPlayerJournal.pages.getName(player.name);
                const defaultJournal = await JournalEntry.create({
                    name: "Default",
                    folder: playerFolder,
                    ownership: {
                        default: 0,
                        [player.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                    },
                    pages: [oldPage.toObject()],
                });
                migrated = true;
            }
        }
    }

    //create shared page for the party

    const sharedFolderName = getSetting("sharedJournalName");

    let sharedFolder = Array.from(game.folders).find((f) => f.name === sharedFolderName && f.type === "JournalEntry" && f.folder === partyFolder);
    if (!sharedFolder) {
        updated = true;
        sharedFolder = await Folder.create({ name: sharedFolderName, type: "JournalEntry", sorting: "m", folder: partyFolder.id });
        if (oldPlayerJournal) {
            const oldSharedPage = oldPlayerJournal.pages.getName(sharedFolderName);
            const sharedJournal = await JournalEntry.create({
                name: "Default",
                folder: sharedFolder,
                ownership: {
                    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                },
                pages: [oldSharedPage.toObject()],
            });
        }
    }

    if (migrated) {
        oldPlayerJournal.update({ folder: null });
        ui.notifications.info("Квестовый журнал: старые журналы группы и игроков перенесены в новую структуру. После проверки миграции старый журнал можно удалить.", { permanent: true });
    }
    if (updated) ui.notifications.info(game.i18n.localize(`${MODULE_ID}.notifications.playerJournalUpdated`));
}

export async function createLoreFolder() {
    const loreFolderName = getSetting("loreFolderName");
    let loreFolder = Array.from(game.folders).find((f) => f.name === loreFolderName && f.type === "JournalEntry");
    if (!loreFolder) {
        loreFolder = await Folder.create({ name: loreFolderName, type: "JournalEntry", color: "#a85d1f", sorting: "m" });
    }
    return loreFolder;
}

export function showWelcomeScreen(force = false) {
    if (!getSetting("enableTutorial")) return;
    const welcomeMessage = getSetting("welcomeMessage");
    if (welcomeMessage && !force) return;
    Dialog.prompt({
        title: game.i18n.localize(`${MODULE_ID}.welcomeScreen.title`),
        content: game.i18n.localize(`${MODULE_ID}.welcomeScreen.content`),
        callback: () => {
            setSetting("welcomeMessage", true);
        },
        render: (html) => {
            html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-screen");
        },
    });
}

export function showWelcomeMaps(force = false) {
    if (!getSetting("enableTutorial") && !force) return;
    const welcomeMaps = getSetting("welcomeMaps");
    if (welcomeMaps && !force) return;
    Dialog.prompt({
        title: game.i18n.localize(`${MODULE_ID}.welcomeMaps.title`),
        content: game.i18n.localize(`${MODULE_ID}.welcomeMaps.content`),
        options: {
            width: 600,
        },
        callback: () => {
            setSetting("welcomeMaps", true);
        },
        render: (html) => {
            html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-screen");
            html[0].closest(".app").classList.add("foundry-quest-log-ru-welcome-maps");
        },
        close: () => {},
    });
}

export function createDemoQuest() {
    const inProgress = game.i18n.localize(`${MODULE_ID}.default-structure.in-progress`);
    const j = game.journal.getName(inProgress);
    if (!j) return;
    j.createEmbeddedDocuments("JournalEntryPage", [DEMO_QUEST]);
}

export function showQuestNotification(page, newQuest = false, isLore = false, isAchievement = false, isCompleted = false) {
    if (!getSetting("showQuestNotifications")) return;
    const isHidden = page.getFlag(MODULE_ID, "hidden");
    if (isHidden && !isLore) return;

    const sound = isCompleted ? getSetting("completeQuestSoundEffect") : newQuest ? getSetting("newQuestSoundEffect") : getSetting("updateQuestSoundEffect");
    if (sound) foundry.audio.AudioHelper.play({ src: sound, volume: game.settings.get("core", "globalInterfaceVolume"), loop: false });

    const existing = document.querySelector(`.foundry-quest-log-ru-notification[data-uuid="${page.uuid}"]`);
    if (existing) return;

    const notificationContainer = document.getElementById("foundry-quest-log-ru-notification-container") || document.createElement("div");
    notificationContainer.id = "foundry-quest-log-ru-notification-container";

    document.body.appendChild(notificationContainer);

    const notification = document.createElement("div");
    notification.dataset.uuid = page.uuid;
    notification.classList.add("foundry-quest-log-ru-notification");
    const questName = `<span class="foundry-quest-log-ru-notification-quest-name">${page.name}</span>`;
    if (newQuest) {
        if (isLore) {
            notification.innerHTML = `<i class="fas fa-scroll-old"></i> ${game.i18n.localize(`${MODULE_ID}.shareLore.chatMessage`) + " " + questName}`;
        } else if (isAchievement) {
            notification.innerHTML = `<i class="fas fa-trophy"></i> ${game.i18n.localize(`${MODULE_ID}.shareAchievement.chatMessage`) + " " + questName}`;
        } else {
            notification.innerHTML = `<i class="fas fa-exclamation"></i> ${game.i18n.localize(`${MODULE_ID}.shareQuest.chatMessage`) + " " + questName}`;
        }
    } else {
        notification.innerHTML = `<i class="fas fa-exclamation"></i> ${game.i18n.localize(`${MODULE_ID}.questNotification.text`).replace("%q", questName)}`;
    }
    notificationContainer.appendChild(notification);

    const fontSize = getSetting("fontSize") * 2.5 + "rem";

    //animate opacity and scaleY to 1
    notification.animate(
        [
            { opacity: 0, height: "0rem" },
            { opacity: 1, height: fontSize },
        ],
        {
            duration: 500,
            easing: "ease-in-out",
        },
    );

    let dismissed = false;

    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        notification.animate(
            [
                { opacity: 1, height: fontSize },
                { opacity: 0, height: "0rem" },
            ],
            {
                duration: 500,
                easing: "ease-in-out",
            },
        ).onfinish = () => {
            notificationContainer.removeChild(notification);
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        };
    };

    notification.onmouseup = (e) => {
        //dismiss notification
        dismiss();
        //if left click, open quest
        if (e.button === 0) {
            ui.simpleQuest.openToPage(page.uuid);
        }
    };

    setTimeout(
        () => {
            dismiss();
        },
        newQuest ? 10000 : 5000,
    );
}

const DEMO_QUEST = {
    name: "Welcome to Simple Quest!",
    "text.content": `<p>Welcome to Simple Quest! This demo quest is designed to highlight the straightforwardness and capabilities of Simple Quest, which seamlessly integrates with Core Foundry Journals. You'll get started in no time!</p>
    <h2>Getting Started</h2>
    <p>Simple Quest operates on Core Foundry Journals, eliminating the need to learn new tools or interfaces. The following objectives demonstrate the ease of use:</p>
    <ul>
        <li>This is my initial objective.</li>
        <li>Woah! A second objective!</li>
    </ul>
    <p>To maintain clarity, Simple Quest utilizes the first characters of list elements to store checked status. Avoid using identical names for objectives to prevent confusion.</p>
    <h2>Navigating the Quests Tab</h2>
    <p>Create organized sub-quests by adding headers (1 or 2) to your quests. This is useful for breaking down extensive quests. Lists can also be nested as shown here.</p>
    <ul>
        <li>
            <p><strong>Quests List:</strong></p>
            <ul>
                <li>On the left side of the interface, you'll find the quests list.</li>
                <li>This displays all quest categories and the quests within them.</li>
                <li>Quest Categories represent "Journals" and individual quests are "Journal Pages"</li>
                <li>Hover over the left side of a Quest title to reveal a button for hiding/unhiding it from players.</li>
                <li>Hover over a Quest Category name to find the "Add Quest" button.</li>
            </ul>
        </li>
        <li>
            <p><strong>Quest Details:</strong></p>
            <ul>
                <li>The section you're currently reading is the Quest Details, providing a comprehensive view of your quest.</li>
                <li>Top right corner houses quest controls; hover over them for tooltips explaining their functions.</li>
            </ul>
        </li>
        <li>
            <p><strong>Interacting with Lists:</strong></p>
            <ul>
                <li>Left-click a checkbox to mark the objective as complete.</li>
                <li>Right-click to mark it as failed.</li>
                <li>Hover over the left side of the checkbox to reveal the hide/unhide option, making the objective hidden from players.</li>
            </ul>
        </li>
    </ul>
    <h2>Quest Notifications</h2>
    <p>Some actions will make the quest have a notification (exclamation point) icon next to it's name to make the user take notice that the quest was updated:</p>
    <ul>
        <li>
            <p>Un-hiding (but not hiding) an objective</p>
        </li>
        <li>
            <p>Checking\Unchecking an objective</p>
        </li>
        <li>
            <p>Creating the quest for the first time</p>
        </li>
        <li>
            <p>Manually enabling the notification with the exclamation mark button in the quest controls</p>
        </li>
    </ul>
    <h2>Customizing</h2>
    <ul>
        <li>
            <p><strong>Quest Layout:</strong></p>
            <ul>
                <li>Add more categories with the Add category button on the top right of the quest list.</li>
                <li>You can reorder categories by drag and dropping.</li>
                <li>Example: Add an "Available" category for quests players can pick up from a tavern board.</li>
                <li>Adjust the font size using buttons at the Bottom Right of the Simple Quest interface.</li>
                <li>Explore the Module Settings for more customizations.</li>
            </ul>
        </li>
        <li>
            <p><strong>Closing Simple Quest:</strong></p>
            <ul>
                <li>Press J, ESC, or click the close button in the top right side (visible on hover) to exit Simple Quest.</li>
            </ul>
        </li>
    </ul>`,
};

const DEMO_LORE = {
    name: "Welcome to the Lore tab!",
    "text.content": `<table style="width:100%;border:none;background:transparent">
    <tbody><tr style="background:transparent">
            <td style="width:50%;padding:0;margin:0">
                <img style="-webkit-mask-size: 100% 100%; -webkit-mask-image: url('modules/foundry-quest-log-ru/assets/mask/mask4.webp'); object-fit: cover; border: none; border-radius: 5px; width: 100%; aspect-ratio: 1/1" src="https://source.unsplash.com/random">
            </td>
            <td style="padding:2rem;font-size:1.5rem">
                <p><strong>Region: </strong>Demo</p>
                <p><strong>Population: </strong>6969</p>
                <p><strong>Founded: </strong>420 a.d.</p>
                <p><strong>Government: </strong>Location</p>
            </td>
</tr><tr style="background:transparent">
            <td colspan="2">
                <ul>
                    <li>
                        <p>In the <strong>Lore</strong> tab you can create organized information for your World.</p>
                    </li>
                    <li>
                        <p>If you already have Lore organized in regular foundry journals, you can simply move them to the <strong>Lore</strong> folder created by simple quest in you journal sidebar.</p>
                    </li>
                    <li>
                        <p>Try editing this Lore or create a new one to test out the <strong>Page Template</strong> feature of <strong>Simple Quest </strong>which was used to create this example page.</p>
                    </li>
                    <li>
                        <p>You can delete Lore categories and Lore entries from your regular journal sidebar, inside the Lore folder</p>
                    </li>
                    <li>
                        <p>Remember that the Lore tab has a quick button to hide (purple) and reveal entries. Simply hover over the Left Side of a Lore entry name on the left sidebar to reveal the button</p>
                    </li>
                </ul>
            </td>
</tr></tbody>
</table>`,
};
