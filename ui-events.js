// ------------------------------------------------------------
// ui-events.js
// Verknüpft Buttons, Eingabefelder und UI-Aktionen
// ------------------------------------------------------------

window.initializeUIEvents = function () {

    // ------------------------------------------------------------
    // Datei laden (HTML oder JSON)
    // ------------------------------------------------------------
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const text = await file.text();

            if (file.name.toLowerCase().endsWith(".json")) {
                window.parseBookmarkJSON(text);
            } else {
                window.parseBookmarkHTMLWithTags(text);
            }
        });
    }

    // ------------------------------------------------------------
    // Suchfeld
    // ------------------------------------------------------------
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            window.setSearchTerm(searchInput.value);
        });
    }

    // ------------------------------------------------------------
    // Buttons
    // ------------------------------------------------------------
    bind("btnShowUrls", window.toggleShowAllUrls);
    bind("btnShowNumbers", window.toggleNumbers);
    bind("btnShowDuplicates", window.toggleShowDuplicates);
    bind("btnShowDuplicateLocations", window.toggleDuplicateLocations);
    bind("btnToggleCheckboxes", window.toggleCheckboxes);
    bind("btnHideSelected", window.hideSelectedItems);
    bind("btnShowHidden", window.showAllHiddenItems);
    bind("btnSelectVisible", window.selectVisibleBookmarks);
    bind("btnMoveSelected", window.moveSelectedToFirstVisibleFolder);
    bind("btnExportHtml", window.exportAsHTML);

    // ------------------------------------------------------------
    // Debug
    // ------------------------------------------------------------
    bind("btnDebugVisibility", () => {
        console.log(window.debugVisibilityDump());
        window.setMessage("Debug-Ausgabe in der Konsole.");
    });

    bind("btnDebugFind", () => {
        const num = prompt("absoluteNumber eingeben:");
        if (num) {
            console.log(window.debugFindByAbsolute(num));
            window.setMessage("Debug-Ausgabe in der Konsole.");
        }
    });
};


// ------------------------------------------------------------
// Hilfsfunktion: Button mit Funktion verbinden
// ------------------------------------------------------------
function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("click", fn);
    }
}

