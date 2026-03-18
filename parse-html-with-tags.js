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
