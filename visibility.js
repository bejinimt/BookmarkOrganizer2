// ------------------------------------------------------------
// visibility.js
// Steuert Sichtbarkeit von Bookmarks und Ordnern
// ------------------------------------------------------------

// ------------------------------------------------------------
// Ausgewählte Bookmarks/Ordner ausblenden
// ------------------------------------------------------------
window.hideSelectedItems = function () {

    function walk(folder) {
        for (const child of folder.children) {

            // Bookmark
            if (child.type === "bookmark") {
                if (child.selected) {
                    child.visible = false;
                    child.selected = false;
                }
            }

            // Ordner
            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (!sub) continue;

                if (sub.selected) {
                    sub.visible = false;
                    sub.selected = false;
                }

                walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    window.renderTree();
    window.setMessage("Ausgewählte Elemente wurden ausgeblendet.");
};


// ------------------------------------------------------------
// Alle ausgeblendeten Elemente wieder einblenden
// ------------------------------------------------------------
window.showAllHiddenItems = function () {

    function walk(folder) {
        folder.visible = true;

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                child.visible = true;
            }

            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    window.renderTree();
    window.setMessage("Alle ausgeblendeten Elemente wurden wieder eingeblendet.");
};


// ------------------------------------------------------------
// Nur sichtbare Bookmarks auswählen
// ------------------------------------------------------------
window.selectVisibleBookmarks = function () {

    function walk(folder) {
        for (const child of folder.children) {

            if (child.type === "bookmark") {
                child.selected = (child.visible !== false);
            }

            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    window.renderTree();
    window.setMessage("Alle sichtbaren Bookmarks wurden ausgewählt.");
};

