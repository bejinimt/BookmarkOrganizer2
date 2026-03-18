// ------------------------------------------------------------
// debug-visibility.js
// Debug-Ausgabe für Sichtbarkeit von Ordnern & Bookmarks
// ------------------------------------------------------------

window.debugVisibilityDump = function () {

    if (!window.bookmarkData || !window.bookmarkData.folders.length) {
        return "Keine Daten geladen.";
    }

    const root = window.bookmarkData.folders[0];
    let out = "";

    function walk(folder, indent) {
        const pad = " ".repeat(indent);

        out += pad + "[Folder] "
            + folder.title
            + "  (visible=" + folder.visible + ", abs=" + folder.absoluteNumber + ")\n";

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                out += pad + "  [Bookmark] "
                    + (child.title || "(Ohne Titel)")
                    + "  (visible=" + child.visible
                    + ", abs=" + child.absoluteNumber + ")\n";
            }

            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub, indent + 2);
            }
        }
    }

    walk(root, 0);
    return out;
};

