// ------------------------------------------------------------
// parse-json.js
// Liest JSON-Lesezeichen ein und ergänzt fehlende Eigenschaften
// ------------------------------------------------------------

window.parseBookmarkJSON = function (jsonText) {
    try {
        const data = JSON.parse(jsonText);

        if (!data || !Array.isArray(data.folders)) {
            window.setMessage("Ungültiges JSON‑Format.");
            return;
        }

        // ------------------------------------------------------------
        // Fehlende Eigenschaften rekursiv ergänzen
        // ------------------------------------------------------------
        function enhanceFolder(folder) {

            if (folder.showCheckbox === undefined) folder.showCheckbox = false;
            if (folder.selected === undefined) folder.selected = false;
            if (folder.visible === undefined) folder.visible = true;

            if (!Array.isArray(folder.children)) {
                folder.children = [];
                return;
            }

            for (const child of folder.children) {

                if (child.type === "folder") {
                    const sub = data.folders.find(f => f.id === child.ref);
                    if (sub) enhanceFolder(sub);
                }

                else if (child.type === "bookmark") {

                    if (child.showCheckbox === undefined) child.showCheckbox = false;
                    if (child.selected === undefined) child.selected = false;
                    if (child.visible === undefined) child.visible = true;
                    if (!Array.isArray(child.tags)) child.tags = [];
                }
            }
        }

        // Alle Ordner durchgehen
        for (const folder of data.folders) {
            enhanceFolder(folder);
        }

        // Root-Ordner absoluteNumber absichern
        if (data.folders.length > 0 && data.folders[0].absoluteNumber == null) {
            data.folders[0].absoluteNumber = "0";
        }

        window.bookmarkData = data;

        // Index neu aufbauen
        window.buildBookmarkIndex();

        window.setMessage("JSON‑Lesezeichen geladen.");
        window.renderTree();

    } catch (err) {
        console.error(err);
        window.setMessage("Fehler beim Lesen der JSON‑Datei.");
    }
};

