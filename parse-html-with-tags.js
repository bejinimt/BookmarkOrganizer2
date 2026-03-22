
// ------------------------------------------------------------
// parse-html-with-tags.js (REFACTORED)
// Single-Stack statt folderStack + numberStack + localCounters
// ------------------------------------------------------------


window.parseBookmarkHTMLWithTags = function (htmlText) {
    try {

        const lines = htmlText.split(/\r?\n/);

        window.bookmarkData = { folders: [] };

        let folderCounter = 0;

        // 🔥 EINZIGER STACK
        const stack = [];

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
                to_delete: false
            };

            window.bookmarkData.folders.push(folder);
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
            // 📂 ORDNER
            // ------------------------------------------------------------
            if (upper.includes("<DT><H3") || upper.includes("<H3")) {

                const title = extractH3Title(line) || "(Ohne Titel)";
                const newFolder = createFolder(title);

                const parent = stack.at(-1);

                let num = "0";

                if (parent) {
                    parent.counter++;

                    num = parent.number
                        ? parent.number + "." + parent.counter
                        : "" + parent.counter;

                    parent.folder.children.push({
                        type: "folder",
                        ref: newFolder.id
                    });
                }

                newFolder.absoluteNumber = num;

                stack.push({
                    folder: newFolder,
                    number: num,
                    counter: 0
                });



                continue;
            }

            // ------------------------------------------------------------
            // 🔖 BOOKMARK
            // ------------------------------------------------------------
            if (upper.includes("<DT><A") || upper.includes("<A ")) {

                const href = extractHref(line);
                let title = extractATitle(line);
                if (!title) title = href || "(Ohne Titel)";

                // TAGS extrahieren
                let tags = [];
                const tagMatch = title.match(/^(.*)\s*\[\[TAGS:(.*?)\]\]$/);
                if (tagMatch) {
                    title = tagMatch[1].trim();
                    tags = tagMatch[2].split(",").map(t => t.trim());
                }

                const current = stack.at(-1);
                if (!current) continue;

                current.counter++;

                const absNum = current.number
                    ? current.number + "." + current.counter
                    : "" + current.counter;

                current.folder.children.push({
                    type: "bookmark",
                    title,
                    url: href,
                    absoluteNumber: absNum,
                    tags,
                    showCheckbox: false,
                    selected: false,
                    visible: true,
                    to_delete: false
                });

                continue;
            }

            // ------------------------------------------------------------
            // 🔚 ORDNER ZU
            // ------------------------------------------------------------
            if (upper.includes("</DL>")) {

                if (stack.length > 1) {
                    const popped = stack.pop();


                }

                continue;
            }
        }

        window.setMessage("Lesezeichen erfolgreich geladen.");

        window.postProcessTags?.();
        window.buildBookmarkIndex();
        window.renderTree();

    } catch (err) {
        console.error(err);
        window.setMessage("Fehler beim Verarbeiten der HTML-Datei.");
    }
};

// ------------------------------------------------------------
// Alias (Kompatibilität)
// ------------------------------------------------------------
window.parseBookmarkHTML = window.parseBookmarkHTMLWithTags;
