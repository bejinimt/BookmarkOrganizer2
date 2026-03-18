// ------------------------------------------------------------
// events.js – angepasst an deine HTML-Button-IDs
// ------------------------------------------------------------

window.initEvents = function () {

    function bind(id, fn) {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", fn);
        else console.warn("Button nicht gefunden:", id);
    }

    // Datei laden
    const btnLoad = document.getElementById("btnLoad");
    const fileInput = document.getElementById("fileInput");

    if (btnLoad && fileInput) {
        btnLoad.addEventListener("click", () => fileInput.click());

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

    // Suche
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            window.setSearchTerm(searchInput.value);
        });
    }

    // Buttons (IDs exakt wie in deinem HTML)
    bind("btnToggleNumbers", window.toggleNumbers);
    bind("btnToggleAllUrls", window.toggleShowAllUrls);
    bind("btnShowDuplicates", window.toggleShowDuplicates);
    bind("btnToggleLocations", window.toggleDuplicateLocations);
    bind("btnToggleCheckboxes", window.toggleCheckboxes);

    bind("btnHideSelected", window.hideSelectedItems);
    bind("btnShowHidden", window.showAllHiddenItems);

    bind("btnSelectEmptyFolders", () => {
        window.markEmptyFolders?.();
        window.renderTree();
    });

    bind("btnSelectVisible", window.selectVisibleBookmarks);

    bind("btnMoveVisibleChecked", window.moveSelectedToFirstVisibleFolder);

    bind("btnExport", () => {
        const json = JSON.stringify(window.bookmarkData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "bookmarks.json";
        a.click();

        URL.revokeObjectURL(url);
    });

    bind("btnExportHtml", window.exportAsHTML);

    // ------------------------------------------------------------
    // NEU: to_delete Buttons
    // ------------------------------------------------------------
    bind("btnToDelete", window.markToDelete);
    bind("btnToDeleteUndo", window.undoToDelete);

    // ------------------------------------------------------------
    // Debug absoluteNumber → jetzt korrekt ins Overlay
    // ------------------------------------------------------------
    const debugBtn = document.getElementById("debugSearchAbsoluteBtn");
    const debugInput = document.getElementById("debugAbsoluteInput");

    if (debugBtn && debugInput) {
        debugBtn.addEventListener("click", () => {
            const num = debugInput.value.trim();
            if (!num) return;

            const obj = window.bookmarkIndex?.[num];

            // WICHTIG:
            // Kein console.log()
            // Kein setMessage()
            // Kein renderTree()
            // → Nur Overlay anzeigen
            window.debugShowObject(obj);
        });
    }
};
