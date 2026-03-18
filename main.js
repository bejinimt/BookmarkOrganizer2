// ------------------------------------------------------------
// main.js
// Initialisiert die Anwendung beim Laden der Seite
// ------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {

    // Globale Flags
    window.showAllUrls = true;
    window.showNumbers = true;
    window.showDuplicatesOnly = false;
    window.showDuplicateLocations = false;
    window.showUrlCheckboxes = false;
    window.showFolderCheckboxes = false;
    window.currentSearchTerm = "";

    // Datenstruktur vorbereiten
    window.bookmarkData = { folders: [] };
    window.bookmarkIndex = {};

    // UI-Events verbinden
    window.initializeUIEvents();

    // Falls bereits Daten geladen wurden (z. B. durch Restore)
    if (window.bookmarkData.folders.length > 0) {
        window.buildBookmarkIndex();
        window.renderTree();
    }

    window.setMessage("Bereit.");
});

