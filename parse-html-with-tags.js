/*

// ------------------------------------------------------------
// parse-html-with-tags.js
// Liest Netscape-Bookmark-HTML ein und unterstützt [[TAGS: ...]]
// ------------------------------------------------------------

window.parseBookmarkHTMLWithTags = function (htmlText) {
    try {
        const lines = htmlText.split(/\r?\n/);

        window.bookmarkData = { folders: [] };

        let folderCounter = 0;
        const folderStack = [];
        const numberStack = [];
        const localCounters = {}; // EIN Zähler pro Ordner

        // ------------------------------------------------------------
        // Hilfsfunktionen
        // ------------------------------------------------------------

        function createFolder(title) {
            folderCounter++;
            const folder = {
                id: folderCounter,
                title: title || "(Ohne Titel)",
                children: [],
                absoluteNumber: null,
                showCheckbox: false,
                selected: false,
                visible: true,
                to_delete: false      // ← NEU
            };
            window.bookmarkData.folders.push(folder);

            localCounters[folder.id] = { count: 0 };
            return folder;
        }

        function extractH3Title(line) {
            const upper = line.toUpperCase();
            const start = upper.indexOf("<H3");
            if (start === -1) return null;
            const gt = line.indexOf(">", start);
            const end = upper.indexOf("</H3>", gt);
            return line.substring(gt + 1, end).trim();
        }

        function extractHref(line) {
            const match = line.match(/HREF="([^"]*)"/i);
            return match ? match[1] : "";
        }

        function extractATitle(line) {
            const upper = line.toUpperCase();
            const start = upper.indexOf("<A");
            if (start === -1) return null;
            const gt = line.indexOf(">", start);
            const end = upper.indexOf("</A>", gt);
            return line.substring(gt + 1, end).trim();
        }

        // ------------------------------------------------------------
        // Hauptparser
        // ------------------------------------------------------------
        for (let rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            const upper = line.toUpperCase();

            // ------------------------------------------------------------
            // Ordner öffnen
            // ------------------------------------------------------------
            if (upper.includes("<DT><H3") || upper.includes("<H3")) {
                const title = extractH3Title(line) || "(Ohne Titel)";
                const newFolder = createFolder(title);

                if (folderStack.length > 0) {
                    const parentId = folderStack[folderStack.length - 1];
                    const parentFolder = window.bookmarkData.folders.find(f => f.id === parentId);

                    parentFolder.children.push({
                        type: "folder",
                        ref: newFolder.id
                    });

                    localCounters[parentId].count++;

                    const parentNum = numberStack[numberStack.length - 1];
                    const num = parentNum
                        ? parentNum + "." + localCounters[parentId].count
                        : "" + localCounters[parentId].count;

                    newFolder.absoluteNumber = num;
                    numberStack.push(num);
                } else {
                    // Root-Ordner
                    newFolder.absoluteNumber = "0";
                    numberStack.push("0");
                }

                folderStack.push(newFolder.id);
                continue;
            }

            // ------------------------------------------------------------
            // Bookmark
            // ------------------------------------------------------------
            if (upper.includes("<DT><A") || upper.includes("<A ")) {

                const href = extractHref(line);
                let title = extractATitle(line);
                if (!title) title = href || "(Ohne Titel)";

                // Tags extrahieren
                let tags = [];
                const tagMatch = title.match(/^(.*)\s*\[\[TAGS:(.*?)\]\]$/);
                if (tagMatch) {
                    title = tagMatch[1].trim();
                    tags = tagMatch[2].split(",").map(t => t.trim());
                }

                const currentFolderId = folderStack[folderStack.length - 1];
                const currentFolder = window.bookmarkData.folders.find(f => f.id === currentFolderId);

                localCounters[currentFolderId].count++;

                const base = numberStack[numberStack.length - 1];
                const absNum = base
                    ? base + "." + localCounters[currentFolderId].count
                    : "" + localCounters[currentFolderId].count;

                currentFolder.children.push({
                    type: "bookmark",
                    title: title,
                    url: href,
                    absoluteNumber: absNum,
                    tags: tags,
                    showCheckbox: false,
                    selected: false,
                    visible: true,
                    to_delete: false      // ← NEU
                });

                continue;
            }

            // ------------------------------------------------------------
            // Ordner schließen
            // ------------------------------------------------------------
            if (upper.includes("</DL>")) {
                if (folderStack.length > 1) {
                    folderStack.pop();
                    numberStack.pop();
                }
                continue;
            }
        }

        window.setMessage("Lesezeichen erfolgreich geladen.");

        // Index aufbauen
        window.buildBookmarkIndex();

        // Baum rendern
        window.renderTree();

    } catch (err) {
        console.error(err);
        window.setMessage("Fehler beim Verarbeiten der HTML‑Datei.");
    }
};

// ------------------------------------------------------------
// Alias, damit alte Aufrufe nicht crashen
// ------------------------------------------------------------
window.parseBookmarkHTML = window.parseBookmarkHTMLWithTags;


*/
// ------------------------------------------------------------
// parse-html-with-tags.js
// Liest Netscape-Bookmark-HTML ein und unterstützt [[TAGS: ...]]
// Mit ausführlichem Debug-Logging (folderStack, numberStack, localCounters)
// ------------------------------------------------------------

// Einfacher Debug-Logger: zeigt Codezeile + Variablen
function DBG(codeLine, vars = {}) {
    console.log(
        "%c" + codeLine,
        "color:#ff0; background:#333; padding:2px 6px; font-family:monospace;"
    );

    for (const [k, v] of Object.entries(vars)) {
        console.log(
            "%c   " + k + ":",
            "color:#0af; font-weight:bold;"
        );
        try {
            console.log(JSON.parse(JSON.stringify(v)));
        } catch {
            console.log(v);
        }
    }
}

window.parseBookmarkHTMLWithTags = function (htmlText) {
    try {
        DBG("START parseBookmarkHTMLWithTags(htmlText)");

        const lines = htmlText.split(/\r?\n/);
        DBG("const lines = htmlText.split()", { lines: lines.length });

        window.bookmarkData = { folders: [] };

        let folderCounter = 0;
        const folderStack = [];
        const numberStack = [];
        const localCounters = {}; // EIN Zähler pro Ordner

        // ------------------------------------------------------------
        // Hilfsfunktionen
        // ------------------------------------------------------------

        function createFolder(title) {
            DBG("createFolder('" + title + "')");

            folderCounter++;
            const folder = {
                id: folderCounter,
                title: title || "(Ohne Titel)",
                children: [],
                absoluteNumber: null,
                showCheckbox: false,
                selected: false,
                visible: true,
                to_delete: false
            };
            window.bookmarkData.folders.push(folder);

            localCounters[folder.id] = { count: 0 };

            DBG("→ Ordner erzeugt", {
                id: folder.id,
                title: folder.title,
                folderStack,
                numberStack,
                localCounters
            });

            return folder;
        }

        function extractH3Title(line) {
            const upper = line.toUpperCase();
            const start = upper.indexOf("<H3");
            if (start === -1) return null;
            const gt = line.indexOf(">", start);
            const end = upper.indexOf("</H3>", gt);
            return line.substring(gt + 1, end).trim();
        }

        function extractHref(line) {
            const match = line.match(/HREF="([^"]*)"/i);
            return match ? match[1] : "";
        }

        function extractATitle(line) {
            const upper = line.toUpperCase();
            const start = upper.indexOf("<A");
            if (start === -1) return null;
            const gt = line.indexOf(">", start);
            const end = upper.indexOf("</A>", gt);
            return line.substring(gt + 1, end).trim();
        }

        // ------------------------------------------------------------
        // Hauptparser
        // ------------------------------------------------------------
        for (let rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            const upper = line.toUpperCase();

            // ------------------------------------------------------------
            // Ordner öffnen
            // ------------------------------------------------------------
            if (upper.includes("<DT><H3") || upper.includes("<H3")) {

                DBG("ZEILE: Ordner öffnen (H3 erkannt)", {
                    line,
                    folderStack,
                    numberStack,
                    localCounters
                });

                const title = extractH3Title(line) || "(Ohne Titel)";
                DBG("ZEILE: title = extractH3Title()", { title });

                const newFolder = createFolder(title);

                if (folderStack.length > 0) {
                    DBG("ZEILE: verschachtelter Ordner", {
                        parentId: folderStack.at(-1)
                    });

                    const parentId = folderStack.at(-1);
                    const parentFolder = window.bookmarkData.folders.find(f => f.id === parentId);

                    parentFolder.children.push({
                        type: "folder",
                        ref: newFolder.id
                    });

                    localCounters[parentId].count++;

                    const parentNum = numberStack.at(-1);
                    const num = parentNum
                        ? parentNum + "." + localCounters[parentId].count
                        : "" + localCounters[parentId].count;

                    newFolder.absoluteNumber = num;
                    numberStack.push(num);

                    DBG("ZEILE: absoluteNumber = parentNum + count", {
                        parentNum,
                        count: localCounters[parentId].count,
                        result: num,
                        folderStack,
                        numberStack,
                        localCounters
                    });

                } else {
                    DBG("ZEILE: Root-Ordner");

                    newFolder.absoluteNumber = "0";
                    numberStack.push("0");

                    DBG("ZEILE: Root-Ordner gesetzt", {
                        id: newFolder.id,
                        title: newFolder.title,
                        absoluteNumber: "0",
                        folderStack,
                        numberStack
                    });
                }

                folderStack.push(newFolder.id);

                DBG("ZEILE: Nach Ordner-Öffnen", {
                    folderStack,
                    numberStack,
                    localCounters
                });

                continue;
            }

            // ------------------------------------------------------------
            // Bookmark
            // ------------------------------------------------------------
            if (upper.includes("<DT><A") || upper.includes("<A ")) {

                DBG("ZEILE: Bookmark erkannt (A)", {
                    line,
                    folderStack,
                    numberStack,
                    localCounters
                });

                const href = extractHref(line);
                let title = extractATitle(line);
                if (!title) title = href || "(Ohne Titel)";

                DBG("ZEILE: title/href extrahiert", { title, href });

                // Tags extrahieren
                let tags = [];
                const tagMatch = title.match(/^(.*)\s*\[\[TAGS:(.*?)\]\]$/);
                if (tagMatch) {
                    title = tagMatch[1].trim();
                    tags = tagMatch[2].split(",").map(t => t.trim());
                    DBG("ZEILE: Tags extrahiert", { title, tags });
                }

                const currentFolderId = folderStack.at(-1);
                const currentFolder = window.bookmarkData.folders.find(f => f.id === currentFolderId);

                localCounters[currentFolderId].count++;

                const base = numberStack.at(-1);
                const absNum = base
                    ? base + "." + localCounters[currentFolderId].count
                    : "" + localCounters[currentFolderId].count;

                DBG("ZEILE: absoluteNumber = base + count", {
                    base,
                    count: localCounters[currentFolderId].count,
                    absNum,
                    folderStack,
                    numberStack,
                    localCounters
                });

                currentFolder.children.push({
                    type: "bookmark",
                    title: title,
                    url: href,
                    absoluteNumber: absNum,
                    tags: tags,
                    showCheckbox: false,
                    selected: false,
                    visible: true,
                    to_delete: false
                });

                DBG("ZEILE: Nach Bookmark", {
                    folderStack,
                    numberStack,
                    localCounters
                });

                continue;
            }

            // ------------------------------------------------------------
            // Ordner schließen
            // ------------------------------------------------------------
            if (upper.includes("</DL>")) {

                DBG("ZEILE: Ordner schließen (</DL>)", {
                    folderStack,
                    numberStack
                });

                if (folderStack.length > 1) {
                    folderStack.pop();
                    numberStack.pop();
                }

                DBG("ZEILE: Nach Ordner-Schließen", {
                    folderStack,
                    numberStack
                });

                continue;
            }
        }

        DBG("END parseBookmarkHTMLWithTags()", {
            folders: window.bookmarkData.folders.length
        });

        window.setMessage("Lesezeichen erfolgreich geladen.");


        window.postProcessTags?.();

        // Index aufbauen
        window.buildBookmarkIndex();

        // Baum rendern
        window.renderTree();

    } catch (err) {
        console.error(err);
        window.setMessage("Fehler beim Verarbeiten der HTML‑Datei.");
    }
};

// ------------------------------------------------------------
// Alias, damit alte Aufrufe nicht crashen
// ------------------------------------------------------------
window.parseBookmarkHTML = window.parseBookmarkHTMLWithTags;
