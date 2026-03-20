// ------------------------------------------------------------
// add-tags.js
// Fügt allen angehakten Bookmarks einen Tag hinzu
// ------------------------------------------------------------

window.addTagToCheckedBookmarks = function (tag) {

    if (!window.bookmarkData?.folders) return;

    for (const folder of window.bookmarkData.folders) {
        for (const child of folder.children) {

            // Nur Bookmarks, die angehakt sind
            if (child.type === "bookmark" && child.selected === true) {

                if (!Array.isArray(child.tags)) {
                    child.tags = [];
                }

                if (!child.tags.includes(tag)) {
                    child.tags.push(tag);
                }
            }
        }
    }

    // UI aktualisieren
    window.renderTree();
};
