// ------------------------------------------------------------
// checkbox.js
// Steuert Checkbox-Anzeige und Auswahlverhalten
// ------------------------------------------------------------

// ------------------------------------------------------------
// Checkboxen ein-/ausblenden
// ------------------------------------------------------------
window.toggleCheckboxes = function () {

    window.showUrlCheckboxes = !window.showUrlCheckboxes;
    window.showFolderCheckboxes = window.showUrlCheckboxes;

    function walk(folder) {

        folder.showCheckbox = window.showFolderCheckboxes;

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                child.showCheckbox = window.showUrlCheckboxes;
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
};


// ------------------------------------------------------------
// Alle Checkboxen zurücksetzen
// ------------------------------------------------------------
window.clearAllSelections = function () {

    function walk(folder) {
        folder.selected = false;

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                child.selected = false;
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
};


// ------------------------------------------------------------
// Sichtbare auswählen / abwählen (Toggle)
// ------------------------------------------------------------
window.selectVisibleToggle = false;

window.selectVisibleBookmarks = function () {

    function walk(folder) {

        // Ordner selbst
        if (folder.visible !== false && folder.to_delete !== true) {
            if (folder.showCheckbox) {
                folder.selected = window.selectVisibleToggle;
            }
        }

        for (const child of folder.children) {

            // Bookmark
            if (child.type === "bookmark") {

                if (child.visible !== false && child.to_delete !== true) {

                    // Filter berücksichtigen
                    const isVisible =
                        (!window.showDuplicatesOnly || window.duplicates?.get(child.url)) &&
                        (!window.currentSearchTerm || window.matchesSearch(child));

                    if (isVisible && child.showCheckbox) {
                        child.selected = window.selectVisibleToggle;
                    }
                }
            }

            // Unterordner
            if (child.type === "folder") {
                const sub = window.bookmarkData.folders.find(f => f.id === child.ref);
                if (sub) walk(sub);
            }
        }
    }

    if (window.bookmarkData.folders.length > 0) {
        walk(window.bookmarkData.folders[0]);
    }

    // Toggle umdrehen
    window.selectVisibleToggle = !window.selectVisibleToggle;

    window.renderTree();
};

