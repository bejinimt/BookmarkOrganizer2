// ------------------------------------------------------------
// to-delete.js
// Markiert ausgewählte Elemente dauerhaft zum Löschen
// und hebt diese Markierung wieder auf
// ------------------------------------------------------------

// ------------------------------------------------------------
// Ausgewählte Elemente als "to_delete" markieren
// ------------------------------------------------------------
window.markToDelete = function () {

    function walk(folder) {

        // Ordner selbst
        if (folder.selected) {
            folder.to_delete = true;
            folder.visible = false;
            folder.selected = false;
        }

        for (const child of folder.children) {

            // Bookmark
            if (child.type === "bookmark") {
                if (child.selected) {
                    child.to_delete = true;
                    child.visible = false;
                    child.selected = false;
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

    window.renderTree();
    window.setMessage("Ausgewählte Elemente wurden als 'to_delete' markiert.");
};


// ------------------------------------------------------------
// Alle "to_delete"-Markierungen aufheben
// ------------------------------------------------------------
window.undoToDelete = function () {

    function walk(folder) {

        folder.to_delete = false;
        folder.visible = true;

        for (const child of folder.children) {

            if (child.type === "bookmark") {
                child.to_delete = false;
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
    window.setMessage("Alle 'to_delete'-Markierungen wurden aufgehoben.");
};
