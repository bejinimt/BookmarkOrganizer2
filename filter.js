// ------------------------------------------------------------
// filter.js
// Steuert Suchfilter und dynamische Sichtbarkeit
// ------------------------------------------------------------

// ------------------------------------------------------------
// Suchbegriff setzen
// ------------------------------------------------------------
window.setSearchTerm = function (term) {
    window.currentSearchTerm = term.trim().toLowerCase();
    window.renderTree();
};


// ------------------------------------------------------------
// Nur Duplikate anzeigen
// ------------------------------------------------------------
window.toggleShowDuplicates = function () {
    window.showDuplicatesOnly = !window.showDuplicatesOnly;

    if (window.showDuplicatesOnly) {

        // Duplikate finden
        window.findDuplicates();

        // Sichtbarkeit im Datenmodell + DOM setzen
        window.applyDuplicateVisibility();

        window.setMessage("Nur doppelte Bookmarks werden angezeigt.");

    } else {

        // Alles wieder sichtbar machen
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

        window.setMessage("Alle Bookmarks werden angezeigt.");
    }

    window.renderTree();
};


// ------------------------------------------------------------
// Alle URLs anzeigen / ausblenden
// ------------------------------------------------------------
window.toggleShowAllUrls = function () {
    window.showAllUrls = !window.showAllUrls;
    window.renderTree();
};


// ------------------------------------------------------------
// Nummern ein-/ausblenden
// ------------------------------------------------------------
window.toggleNumbers = function () {
    window.showNumbers = !window.showNumbers;
    window.renderTree();
};


// ------------------------------------------------------------
// Fundstellen (Duplikat-Locations) ein-/ausblenden
// ------------------------------------------------------------
window.toggleDuplicateLocations = function () {
    window.showDuplicateLocations = !window.showDuplicateLocations;
    window.renderTree();
};
