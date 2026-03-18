// ------------------------------------------------------------
// is-folder-empty.js
// Prüft, ob ein Ordner effektiv leer ist
// (d. h. keine sichtbaren Bookmarks und keine sichtbaren Unterordner)
// ------------------------------------------------------------

window.isFolderEffectivelyEmpty = function (folder) {

    // Keine Kinder → leer
    if (!folder.children || folder.children.length === 0) {
        return true;
    }

    for (const child of folder.children) {

        // Sichtbares Bookmark → nicht leer
        if (child.type === "bookmark" && child.visible !== false) {
            return false;
        }

        // Unterordner prüfen
        if (child.type === "folder") {
            const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
            if (!sub) continue;

            // Sichtbarer Unterordner → nicht leer
            if (sub.visible !== false) {
                return false;
            }

            // Unterordner hat sichtbare Inhalte → nicht leer
            if (!window.isFolderEffectivelyEmpty(sub)) {
                return false;
            }
        }
    }

    return true;
};

